import { useState, useEffect } from 'react';
import Joi from 'joi-browser';
import {
	SignUp,
	ProfileUpdate,
	ConfirmationStatus,
	UnlockEmail,
	UnlockPaypal,
	UnlockPhone,
	Deactivate,
	ReVerify,
} from '../api/calls/user.api';
import { userDefaults, userConfirm } from '../database/bhoozt_defaults.data';
import messages from './messages.container';
import useRoute from '../hooks/route.hook';
import profileContainer from './profile.container';
import HomeContainer from './home.container';
import { createContainer } from 'unstated-next';
import OtpContainer from './otp.container';
import useLogin from './login.container';

const useRegister = () => {
	const [isBusy, setIsBusy] = useState(false);
	const [data, setData] = useState({});
	const [errors, setErrors] = useState('');
	const [edit, setEdit] = useState(false);
	const [isEmail, setIsEmail] = useState(false);
	const [check, setCheck] = useState(false);
	const [confirmationData, setConfirmationData] = useState({
		is_fresh_user: false,
		is_email_confirmed: false,
		is_email_change_requested: false,
		is_otp_confirmed: false,
		is_phone_change_requested: false,
		is_paypal_confirmed: false,
		is_paypal_change_requested: false,
	});

	const [dataFile, setDataFile] = useState();
	const [paypalPopupOpen, setPaypalPopupOpen] = useState(false);
	const [paypalPopupMsg, setPaypalPopupMsg] = useState('');

	const { profile, setIsUpdated } = profileContainer.useContainer();
	const { handleRedirect } = useRoute();
	const {
		notifyError,
		notifyLongError,
		notifySuccess,
		notifyProgress,
		notifyForceDismiss,
	} = messages();
	const { handleLogout } = useLogin();
	const { setMobileVisible, handleSetUserData } = OtpContainer.useContainer();

	const { path, user } = HomeContainer.useContainer();

	useEffect(() => {
		console.log(confirmationData);
	}, [confirmationData]);

	useEffect(() => {
		if (edit) {
			loadEditFields();
		} else {
			setData({ ...data, gender: 'male', countryCode: '+61' });
		}
	}, [edit]);

	useEffect(() => {
		if (path !== '/login') {
			setEdit(
				profile &&
					Object.keys(profile).length > 0 &&
					profile.user_role !== 'anonymous'
			);
		}
	}, [profile, path]);

	useEffect(() => {
		if (profile && !isEmpty(profile) && path !== '/login') {
			loadEditFields();
		}
	}, [profile]);

	const schema = {
		firstName: Joi.string().required().label('firstName'),
		lastName: Joi.string().required().label('lastName'),
		email: Joi.string().required().email().label('email'),
		payPalEmail: Joi.string().email().label('payPalEmail'),
		gender: Joi.string().min(10).label('gender'),
		phoneNumber: Joi.string().label('phoneNumber'),
		location: Joi.string().label('location'),
		latitude: Joi.string().label('latitude'),
		longitude: Joi.string().label('longitude'),
		image: Joi.string().label('image'),
		birthDate: Joi.string().label('birthDate'),
		password: edit
			? Joi.string().required().min(6).label('password')
			: Joi.string().min(6).label('password'),
		confirmPassword: edit
			? Joi.string()
					.valid(Joi.ref('password'))
					.options({
						language: { any: { allowOnly: 'must match password' } },
					})
					.label('confirmPassword')
			: Joi.string()
					.valid(Joi.ref('password'))
					.required()
					.options({
						language: { any: { allowOnly: 'must match password' } },
					})
					.label('confirmPassword'),
	};

	const loadEditFields = () => {
		let names = profile.name.split(' ');
		let firstName = names[0];
		let lastName = '';
		for (let index = 1; index < names.length; index++) {
			lastName = names[index] + '';
		}
		let userData = {
			firstName: firstName,
			lastName: lastName,
			email: profile.email,
			payPalEmail: profile.pay_pal_email,
			gender: profile.sex,
			countryCode:
				process.env.REACT_APP_CUSTOM_NODE_ENV === 'production' ||
				process.env.REACT_APP_CUSTOM_NODE_ENV === 'staging'
					? '+61'
					: '+94',
			// countryCode: profile.contact_number
			// 	? `${profile.contact_number.substring(0, 3)}`
			// 	: '+61',
			localPhoneNumber: profile.contact_number
				? profile.contact_number.substr(3, 1) !== '0' &&
				  profile.contact_number.length < 13
					? `0${profile.contact_number.substr(3)}`
					: profile.contact_number.substr(3)
				: '',
			phoneNumber: profile.contact_number,
			image: profile.image,
			birthDate: profile.date_of_birth
				? profile.date_of_birth.slice(0, 10)
				: null,
			provider: profile.provider,
			id: profile.id || null,
			socialImage: profile.socialImage,
		};
		setData(userData);
		if (profile.provider === 'email') {
			setIsEmail(true);
		}
	};

	const validate = () => {
		const options = { abortEarly: false };
		const { error } = Joi.validate(data, schema, options);
		if (!error) return null;

		const errors = {};
		for (let item of error.details) errors[item.path[0]] = item.message;
		return errors;
	};

	// const validateProperty = ({ name, value }) => {
	// 	const obj = { [name]: value };
	// 	const sche = { [name]: schema[name] };
	// 	const { error } = Joi.validate(obj, sche);
	// 	return error ? error.details[0].message : null;
	// };

	const handleToggle = () => {
		if (check === true) {
			setCheck(false);
		} else {
			setCheck(true);
		}
	};

	const handleFocus = (e) => {
		if (e.target.type === 'date') {
			e.target.focus();
		} else {
			e.preventDefault();
			e.target.focus();
		}
	};

	const handleChange = ({ currentTarget: input }) => {
		setData((data) => ({ ...data, [input.name]: input.value }));
	};

	const handleChangeSelect = (e, { name, value }) => {
		setData((data) => ({ ...data, [name]: value }));
	};

	const handleChangeImage = (file) => {
		setDataFile(file);
	};

	const formatMobileNumber = () => {
		let pNumber = `${data.countryCode}${
			data.localPhoneNumber &&
			data.localPhoneNumber.length > 0 &&
			data.localPhoneNumber.substring(0, 1) === '0'
				? data.localPhoneNumber.substr(1)
				: data.localPhoneNumber
		}`;
		setData((data) => ({ ...data, phoneNumber: pNumber }));
	};

	const handleSubmit = async (e) => {
		formatMobileNumber();
		setIsBusy(true);
		e.preventDefault();
		if (data && data.phoneNumber && data.phoneNumber.length > 15) {
			notifyError('Invalid phone number');
			return;
		}
		if (
			data &&
			data.firstName &&
			data.lastName &&
			data.countryCode &&
			data.localPhoneNumber &&
			data.email &&
			data.password
		) {
			if (data.password.length >= 6) {
				if (data.password === data.confirmPassword) {
					let d = data;
					d['image'] = dataFile;

					notifyProgress('Please wait...');
					let user = await userDefaults();
					let [code, res] = await SignUp(
						d,
						user ? user.device_unique_id : null,
						user && user.user_role && user.user_role === 'anonymous'
							? user.email
							: null
					);

					if (code >= 300 && code !== 503) {
						notifyError(
							res &&
								res.message !== undefined &&
								res.message.length > 0
								? res.message
								: 'Something went wrong'
						);
					} else if (code !== 503) {
						notifySuccess(
							res &&
								res.message !== undefined &&
								res.message.length > 0
								? res.message
								: 'Profile created successfully'
						);

						setTimeout(function () {
							handleRedirect(`/`);
							return code;
						}, 3500);
					}
				} else {
					notifyError('Please make sure your passwords match');
				}
			} else {
				notifyError(
					'Password and Confirm password should have at least 6 characters'
				);
			}
		} else {
			notifyError('Please fill all required fields');
		}
		setIsBusy(false);
	};

	const handleUpdate = async (e) => {
		setIsBusy(true);
		e.preventDefault();

		if (
			data &&
			data.localPhoneNumber &&
			data.localPhoneNumber.length < 10
		) {
			notifyError('Invalid phone number');
			setIsBusy(false);
			return;
		}

		if (data && data.firstName && data.lastName && data.email) {
			if (data.oldPassword && data.oldPassword.length > 0) {
				if (data.password === data.confirmPassword) {
					// console.log('Continue update');
				} else {
					notifyError(
						'Password and Confirm password should match and needs to have at least 6 characters'
					);
					setIsBusy(false);
					return;
				}
			} else {
				// console.log('Continue update');
			}

			let d = data;
			d['image'] = dataFile ? dataFile : null;

			notifyProgress('Please wait...');
			let [code, res] = await ProfileUpdate(d);

			notifyForceDismiss();

			if (code >= 300 && code !== 503) {
				notifyError(
					res && res.message !== undefined && res.message.length > 0
						? res.message
						: 'Something went wrong'
				);
			} else if (code !== 503) {
				if (
					res &&
					res.message !== undefined &&
					res.message.length > 0
				) {
					if (
						res.content.user.is_paypal_confirmation_sent === true &&
						res.content.user.is_email_confirmation_sent === false
					) {
						setPaypalPopupMsg(
							'We sent a message to your PayPal email. Please click on the button in the email to	confirm we’ve got the right account.'
						);
						setPaypalPopupOpen(true);
					} else if (
						res.content.user.is_paypal_confirmation_sent === true &&
						res.content.user.is_email_confirmation_sent === true
					) {
						setPaypalPopupMsg(res.message);
						setPaypalPopupOpen(true);
					} else {
						notifySuccess(res.message);
					}
				}

				// notifySuccess(
				// 	res && res.message !== undefined && res.message.length > 0
				// 		? res.content.user.is_paypal_confirmation_sent
				// 			? 'We sent a message to your PayPal email. Please click on the button in the email to	confirm we’ve got the right account.'
				// 			: res.message
				// 		: res.message
				// );

				if (
					res &&
					res.content &&
					res.content.user &&
					!res.content.user.is_otp_confirmed
				) {
					handleSetUserData(res.content.user);
					setMobileVisible(true);
				}

				setIsUpdated(true);
				// getUserData();
				setTimeout(function () {
					if (!edit) {
						handleRedirect(`/`);
					}
					return code;
				}, 3500);
			}
		} else {
			notifyError('Please fill all required fields');
		}
		setIsBusy(false);
	};

	const isEmpty = (obj) => {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	};

	const checkConfirmation = async () => {
		if (user && user.id && path !== '/login') {
			let [code, res] = await ConfirmationStatus(user.id);

			if (code === 200) {
				let res = await userConfirm();
				if (res) {
					setConfirmationData(res);
					return true;
				} else {
					notifyError('Something went wrong.');
					return false;
				}
			} else {
				notifyError(res);
				return false;
			}
		}
	};

	const unlockEmail = async () => {
		notifyProgress('Please wait..');
		if (user && user.id) {
			let [code, res] = await UnlockEmail(user.id);

			if (code === 200) {
				notifySuccess(res.message);
			} else {
				notifyError(res.message);
			}
		}
	};

	const unlockPaypal = async () => {
		notifyProgress('Please wait..');
		if (user && user.id) {
			let [code, res] = await UnlockPaypal(user.id);

			if (code === 200) {
				notifySuccess(res.message);
			} else {
				notifyError(res.message);
			}
		}
	};

	const unlockPhone = async () => {
		notifyProgress('Please wait..');
		if (user && user.id) {
			console.log(user.id);
			let [code, res] = await UnlockPhone(user.id);

			if (code === 200) {
				notifySuccess(res.message);
			} else {
				notifyError(res.message);
			}
		}
	};

	const deactivate = async () => {
		notifyProgress('Please wait..');
		if (user && user.id) {
			console.log(user.id);
			let [code, res] = await Deactivate(user.id);

			if (code === 200) {
				notifySuccess(res.message);
				return true;
			} else {
				notifyError(res.message);
				return false;
			}
		}
	};

	const handleUserLogout = () => {
		handleLogout();
	};

	const handleReVerify = async () => {
		setIsBusy(true);
		notifyProgress('Please wait..');

		let [code, res] = await ReVerify();

		if (code === 200) {
			notifySuccess(res.message);
		} else {
			notifyError(res.message);
		}
		setIsBusy(false);
	};

	return {
		isBusy,
		data,
		setData,
		setErrors,
		dataFile,
		check,
		edit,
		setEdit,
		isEmail,
		handleToggle,
		handleChange,
		handleChangeSelect,
		handleSubmit,
		handleChangeImage,
		handleUpdate,
		handleFocus,
		errors,
		checkConfirmation,
		confirmationData,
		setConfirmationData,
		unlockEmail,
		unlockPaypal,
		unlockPhone,
		deactivate,
		handleUserLogout,
		paypalPopupOpen,
		setPaypalPopupOpen,
		paypalPopupMsg,
		handleReVerify,
	};
};

const RegisterContainer = createContainer(useRegister);

export default RegisterContainer;
