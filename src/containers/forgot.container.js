import { useState } from 'react';
// import Joi from 'joi-browser';
import { PasswordReset } from '../api/calls/forgotpass.api';
import messages from './messages.container';
import useRoute from '../hooks/route.hook';

const useForgot = () => {
	const [data, setData] = useState({});
	const [errors, setErrors] = useState('');
	const [isEmail, setIsEmail] = useState(false);
	const [check, setCheck] = useState(false);

	const { handleRedirect } = useRoute();
	const { notifyError, notifySuccess, notifyProgress } = messages();

	// const schema = {
	// 	password: Joi.string()
	// 		.min(6)
	// 		.label('password'),
	// 	confirmPassword: Joi.string()
	// 		.valid(Joi.ref('password'))
	// 		.required()
	// 		.options({
	// 			language: { any: { allowOnly: 'must match password' } },
	// 		})
	// 		.label('confirmPassword'),
	// };

	// const validate = () => {
	// 	const options = { abortEarly: false };
	// 	const { error } = Joi.validate(data, schema, options);
	// 	if (!error) return null;

	// 	const errors = {};
	// 	for (let item of error.details) errors[item.path[0]] = item.message;
	// 	return errors;
	// };

	const handleChange = ({ currentTarget: input }) => {
		setData(data => ({ ...data, [input.name]: input.value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (
			data &&
			data.password &&
			data.confirmPassword &&
			data.password.length >= 6
		) {
			if (data.password === data.confirmPassword) {
				notifyProgress('Please wait...');
				let [code, res] = await PasswordReset(data);

				if (code >= 300 && code !== 503) {
					// notifyError(
					// 	res &&
					// 		res.message !== undefined &&
					// 		res.message.length > 0
					// 		? res.message
					// 		: 'Something went wrong'
					// );
				} else if (code !== 503) {
					notifySuccess(
						res &&
							res.message !== undefined &&
							res.message.length > 0
							? res.message
							: 'Password updated successfully'
					);
					setTimeout(function() {
						handleRedirect(`/`);
						return code;
					}, 3500);
				}
			} else {
				notifyError(
					'Password and Confirm password should match and needs to have at least 6 characters'
				);
			}
		} else {
			notifyError('Please fill all required fields');
		}
	};

	return {
		data,
		setData,
		setErrors,
		check,
		handleChange,
		handleSubmit,
		errors,
		isEmail,
		setIsEmail,
		setCheck,
	};
};

export default useForgot;
