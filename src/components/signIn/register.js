import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, Confirm, Modal, Button } from 'semantic-ui-react';

import useRoute from '../../hooks/route.hook';
import RegisterContainer from '../../containers/register.container';
import { usePosition } from '../../containers/position.container';
import { colors } from '../../utils/colors';
import { mediumScreen, smallScreen } from '../../utils/media';
import {
	Column,
	Container,
	Row,
	StyledColumn,
	StyledGrid,
	StyledModal,
} from '../styles/styles';
import Check from '../../assets/images/check.svg';
import MobileVerification from './mobileVerification';
import { ImageUploadButton, RectangularButton } from '../common/button';
import NavHeader from '../common/navHeader';
import { InputField } from '../common/input';
import SelectField from '../common/select';
import ToggleRadio from '../common/toggleRadio';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import NetworkContainer from '../../containers/network.container';
import messages from '../../containers/messages.container';

const StyledColumnConfirm = styled(StyledColumn)`
	display: inline-grid !important;
`;

const RegistrationContainer = styled.div`
	margin: 0 auto;
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 52}px`};
		width: ${(props) => `${props.width}px`} !important;
		padding-left: 7%;
		padding-right: 7%;
		padding-bottom: 20px;
	}
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 68}px`};
		width: calc(100% - 2px) !important;
		width: 100%;
		padding-left: 7%;
		padding-right: 7%;
		padding-bottom: 50px;
	}
	overflow-y: scroll;
	overflow-x: hidden;
	::-webkit-scrollbar {
		display: block;
		background: #fff;
		width: 7px;
	}
	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1);
		-webkit-border-radius: 10px;
		border-radius: 10px;
	}
	::-webkit-scrollbar-track:window-inactive {
		-webkit-box-shadow: none;
		background: white;
		border: none;
	}
	::-webkit-scrollbar-thumb {
		-webkit-border-radius: 10px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 1);
		border-style: solid;
		border-width: 0.5px;
		border-color: rgba(0, 0, 0, 0.3);
		// -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
	}
	::-webkit-scrollbar-thumb:window-inactive {
		background: white;
		border: none;
	}
`;

const StyledLabel = styled.p`
  text-align: left;
  color: ${colors.darkGreen}
  margin-top: 10px;
  margin-bottom: 20px!important;
  @media ${smallScreen} {
    width: 300px !important;
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    width: 500px !important;
    font-size: 16px !important;
  }
`;

const ChangePassword = styled(StyledLabel)`
	margin-bottom: 0px !important;
	padding-top: 20px;
	padding-bottom: 0px;
	@media ${smallScreen} {
		width: 300px !important;
		font-size: 16px !important;
	}
	@media ${mediumScreen} {
		width: 500px !important;
		font-size: 18px !important;
	}
`;

const StyledRegister = styled.div`
	height: 100%;
	overflow-y: hidden;
`;

const StyledContainer = styled(Container)`
	height: 100%;
	overflow-y: hidden;
`;

const StyledRecapWrapper = styled.div`
	margin: 0 auto !important;
	display: ${(props) => (props.recapVisible ? 'flex' : 'none')};
`;

const StyledConfirm = styled(Confirm)`
	&&.ui.modal > .actions {
		background-color: ${colors.white} !important;
		border-top: none !important;
	}
	&&&.ui.modal .actions > .button {
		color: #000000 !important;
		background: transparent !important;
	}
	@media ${smallScreen} {
		width: 300px !important;
	}
	@media ${mediumScreen} {
		width: 400px !important;
	}
	&&&.ui.small.modal {
		position: unset !important;
		margin: auto;
	}
`;

const StyledCheckIcon = styled.div`
	width: 20px;
	height: 20px;
	position: absolute;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${Check}) !important;
	@media ${smallScreen} {
		right: -11px;
		top: 52px;
	}
	@media ${mediumScreen} {
		right: -25px;
		top: 52px;
	}
`;

const StyledTitle = styled.p`
	font-weight: 400;
	margin-bottom: 10px;
	color: ${colors.green};
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 22px;
	}
	text-decoration: underline;
	cursor: pointer;
`;

const StyledSendButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.green} !important;
	padding: 15px !important;
	width: 45%;
	margin: 5px 5px !important;
	background-color: ${colors.green}!important;
	text-transform: uppercase !important;
	align-self: center;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const StyledOkButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.green} !important;
	padding: 15px !important;
	width: 45%;
	margin: 5px auto !important;
	background-color: ${colors.green}!important;
	text-transform: uppercase !important;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const StyledCancelButton = styled(StyledSendButton)`
	background-color: ${colors.red}!important;
	border: 1px solid ${colors.red} !important;
`;

const StyledDeactContent = styled.div`
	text-align: center;
	color: ${colors.darkGreen} !important;
	margin: 10px 5px !important;
	@media ${smallScreen} {
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const Register = (props) => {
	const { height, width } = useWindowDimensions();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError, notifyLongError } = messages();

	const {
		isBusy,
		data,
		setData,
		setErrors,
		dataFile,
		check,
		edit,
		isEmail,
		handleToggle,
		handleChange,
		handleChangeSelect,
		handleSubmit,
		handleChangeImage,
		handleUpdate,
		handleFocus,
		otpVisible,
		recapVisible,
		checkConfirmation,
		confirmationData,
		unlockEmail,
		unlockPaypal,
		unlockPhone,
		deactivate,
		handleUserLogout,
		paypalPopupOpen,
		setPaypalPopupOpen,
		paypalPopupMsg,
		handleReVerify,
	} = RegisterContainer.useContainer();

	const { latitude, longitude, error } = usePosition();
	const inputOpenFileRef = React.createRef();

	const gender = [
		{ key: 'male', value: 'male', text: 'Male' },
		{ key: 'female', value: 'female', text: 'Female' },
	];

	const [openConfirm, setOpenConfirm] = useState(false);
	const [clicked, setClicked] = useState();
	const [firstPopupOpen, setFirstPopupOpen] = useState(false);
	const [secondPopupOpen, setSecondPopupOpen] = useState(false);

	useEffect(() => {
		if (data) {
			checkConfirmation(); // Check whether email, paypal and phone number is locked
		}
	}, []);

	useEffect(() => {
		if (!data.latitude || !data.longitude) {
			setLocation();
		}
	});

	const setLocation = () => {
		if (error) {
		} else if (latitude && longitude && !error) {
			setData((data) => ({ ...data, latitude, longitude }));
		}
	};

	const loadPhoto = (event) => {
		inputOpenFileRef.current.click();
	};

	const fileChange = (event) => {
		event.stopPropagation();
		event.preventDefault();
		handleChangeImage(event.target.files[0]);
	};

	const handleOnSubmit = async (e) => {
		if (isOnline) {
			await handleSubmit(e);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	const profImageUrl = () => {
		if (dataFile) {
			return URL.createObjectURL(dataFile);
		} else if (
			data &&
			data.provider &&
			data.provider !== 'email' &&
			!data.image
		) {
			return data && data.socialImage ? data.socialImage : '';
		} else {
			// return data && data.image ? process.env.REACT_APP_API_ENDPOINT_IMAGE + data.image : ''
			return data && data.image
				? `${process.env.REACT_APP_API_ENDPOINT_IMAGE}${data.image}`
				: null;
		}
	};

	const handleClickEmail = (e) => {
		handleFocus(e);
		if (checkConfirmation()) {
			if (confirmationData.is_email_confirmed && edit === true) {
				setClicked(e.target.getAttribute('name'));
				setOpenConfirm(true);
			}
		}
		if (confirmationData.is_email_confirmed === false) {
			notifyError('Your email will need to be verified');
		}
	};

	const handleClickPayPal = (e) => {
		handleFocus(e);
		if (checkConfirmation()) {
			if (confirmationData.is_paypal_confirmed && edit === true) {
				setClicked(e.target.getAttribute('name'));
				setOpenConfirm(true);
			}
		}
	};

	const handleClickPhone = (e) => {
		handleFocus(e);
		if (checkConfirmation()) {
			if (confirmationData.is_otp_confirmed && edit === true) {
				setClicked(e.target.getAttribute('name'));
				setOpenConfirm(true);
			}
		}
	};

	const handleConfirm = () => {
		setOpenConfirm(false);
		if (clicked) {
			if (clicked === 'localPhoneNumber') {
				unlockPhone();
			} else if (clicked === 'email') {
				unlockEmail();
			} else if (clicked === 'payPalEmail') {
				unlockPaypal();
			}
		}
	};

	const handleClickDeactivate = () => {
		setFirstPopupOpen(true);
	};

	const handleYesFirstDeactivate = () => {
		setFirstPopupOpen(false);
		setTimeout(() => {
			setSecondPopupOpen(true);
		}, 500);
	};

	const handleDeactivate = () => {
		setSecondPopupOpen(false);
		if (deactivate()) {
			handleUserLogout();
		}
	};

	const ReverificationButton = () => {
		if (
			edit === true &&
			(confirmationData.is_email_confirmed === false ||
				confirmationData.is_email_change_requested === true ||
				confirmationData.is_otp_confirmed === false ||
				confirmationData.is_phone_change_requested === true ||
				confirmationData.is_paypal_confirmed === false ||
				confirmationData.is_paypal_change_requested === true)
		) {
			return (
				<RectangularButton
					width={'50%'}
					label={'Send Verification'}
					color={colors.green}
					disabled={isBusy}
					onRedirect={() => handleReVerify()}
				/>
			);
		} else {
			return null;
		}
	};

	const RenderDeactivateFirst = () => {
		return (
			<StyledModal open={firstPopupOpen}>
				<Modal.Content>
					<Row>
						<Column>
							<StyledDeactContent>
								{
									'Did you mean to click on ‘De‐activate Account’. This will result in you losing all your coin. Are you sure?'
								}
							</StyledDeactContent>
						</Column>
					</Row>
					<StyledCancelButton
						onClick={() => setFirstPopupOpen(false)}
					>
						CANCEL
					</StyledCancelButton>
					<StyledSendButton
						onClick={() => handleYesFirstDeactivate()}
					>
						YES
					</StyledSendButton>
				</Modal.Content>
			</StyledModal>
		);
	};

	const RenderDeactivateSecond = () => {
		return (
			<StyledModal open={secondPopupOpen}>
				<Modal.Content>
					<Row>
						<Column>
							<StyledDeactContent>
								{
									'Sorry to see you go. Just checking again, you 100% sure you want to give up all your coin?'
								}
							</StyledDeactContent>
						</Column>
					</Row>
					<StyledCancelButton
						onClick={() => setSecondPopupOpen(false)}
					>
						CANCEL
					</StyledCancelButton>
					<StyledSendButton onClick={() => handleDeactivate()}>
						YES
					</StyledSendButton>
				</Modal.Content>
			</StyledModal>
		);
	};

	const RenderPaypalPopup = () => {
		return (
			<StyledModal open={paypalPopupOpen}>
				<Modal.Content>
					<Row>
						<Column>
							<StyledDeactContent>
								{paypalPopupMsg}
							</StyledDeactContent>
						</Column>
					</Row>
					<Row>
						<StyledOkButton
							onClick={() => setPaypalPopupOpen(false)}
						>
							OK
						</StyledOkButton>
					</Row>
				</Modal.Content>
			</StyledModal>
		);
	};

	return (
		<StyledRegister>
			<StyledContainer>
				{edit === true ? (
					<NavHeader
						title={'update profile'}
						handleCloseModal={props.handleCloseModal}
					/>
				) : (
					<NavHeader
						title={'registration'}
						handleCloseModal={props.handleCloseModal}
					/>
				)}
				<RegistrationContainer height={height} width={width}>
					<StyledRecapWrapper recapVisible={recapVisible}>
						<div id="recaptchaWidget" />
					</StyledRecapWrapper>
					{otpVisible ? (
						<MobileVerification
							title={'Enter the verification code.'}
							description={`Let's make sure it's really you. We've just sent a text message with a fresh verification code to your number ending in ******
							${data.phoneNumber.substr(data.phoneNumber.length - 4)}
							`}
						/>
					) : (
						<Form>
							<ImageUploadButton
								onRedirect={loadPhoto}
								imageUrl={profImageUrl()}
							/>
							<input
								id="image"
								name="image"
								type="file"
								ref={inputOpenFileRef}
								style={{ display: 'none' }}
								accept="image/*"
								onChange={fileChange}
							/>

							{edit === true ? (
								<StyledTitle
									onClick={() => handleClickDeactivate()}
								>{`De-activate Account?`}</StyledTitle>
							) : null}

							{ReverificationButton()}

							<StyledGrid>
								<StyledColumn width={8}>
									<InputField
										label={'Name *'}
										placeholder={'First Name'}
										name={'firstName'}
										onChange={handleChange}
										onClick={handleFocus}
										value={data.firstName}
									/>
								</StyledColumn>
								<StyledColumn
									width={8}
									style={{ paddingTop: 35 }}
								>
									<InputField
										placeholder={'Last Name'}
										name={'lastName'}
										onChange={handleChange}
										onClick={handleFocus}
										value={data.lastName}
									/>
								</StyledColumn>
							</StyledGrid>

							<StyledGrid>
								<StyledColumn width={5}>
									<InputField
										label={'Code'}
										name={'countryCode'}
										type="tel"
										onChange={handleChange}
										onClick={handleFocus}
										maxLength="3"
										value={
											data.countryCode
												? data.countryCode
												: process.env
														.REACT_APP_CUSTOM_NODE_ENV ===
														'production' ||
												  process.env
														.REACT_APP_CUSTOM_NODE_ENV ===
														'staging'
												? '+61'
												: '+94'
										}
										disabled
									/>
								</StyledColumn>
								<StyledColumnConfirm width={11}>
									<InputField
										label={'Phone Number *'}
										name={'localPhoneNumber'}
										type="tel"
										onChange={handleChange}
										onClick={(e) => handleClickPhone(e)}
										maxLength="10"
										value={data.localPhoneNumber}
										// disabled={
										// 	confirmationData.is_otp_confirmed
										// }
									/>
									{confirmationData.is_otp_confirmed ? (
										<StyledCheckIcon />
									) : null}
								</StyledColumnConfirm>
							</StyledGrid>

							<StyledGrid>
								<StyledColumn width={16}>
									<InputField
										label={'Date of Birth'}
										type={'date'}
										name={'birthDate'}
										onChange={handleChange}
										onClick={handleFocus}
										value={data.birthDate}
									/>
								</StyledColumn>
							</StyledGrid>

							<StyledGrid>
								<StyledColumn width={8}>
									<SelectField
										label={'Gender'}
										key={gender.key}
										options={gender}
										name={'gender'}
										onChange={handleChangeSelect}
										value={data.gender}
										defaultValue={gender[0].value}
									/>
								</StyledColumn>
								<StyledColumn width={8}>
									<InputField
										disabled
										label={'Location'}
										name={'location'}
										// onChange={handleChange}
										// onClick={handleFocus}
										value={
											data.longitude && data.latitude
												? 'Success'
												: 'Waiting..'
										}
									/>
								</StyledColumn>
							</StyledGrid>

							<StyledGrid>
								<StyledColumnConfirm>
									<InputField
										label={'E-mail *'}
										name={'email'}
										onChange={handleChange}
										onClick={(e) => handleClickEmail(e)}
										value={data.email}
										disabled={edit && !isEmail}
										type={'email'}
									/>
									{confirmationData.is_email_confirmed ? (
										<StyledCheckIcon />
									) : null}
								</StyledColumnConfirm>
							</StyledGrid>

							<StyledGrid>
								<StyledColumnConfirm>
									<InputField
										label={'PayPal Email'}
										name={'payPalEmail'}
										onChange={handleChange}
										onClick={(e) => handleClickPayPal(e)}
										value={data.payPalEmail}
										type={'email'}
										// disabled={
										// 	confirmationData.is_paypal_confirmed
										// }
									/>
									{confirmationData.is_paypal_confirmed ? (
										<StyledCheckIcon />
									) : null}
								</StyledColumnConfirm>
							</StyledGrid>

							{edit === true && isEmail === true ? (
								<Row>
									<Column width={8}>
										<ChangePassword>
											Changed Password
										</ChangePassword>
									</Column>
									<Column width={8}>
										<ToggleRadio
											checked={check}
											onChange={handleToggle}
										/>
									</Column>
								</Row>
							) : (
								''
							)}
							{edit === true ? (
								check === true ? (
									<StyledGrid>
										<StyledColumn>
											<StyledGrid>
												<StyledColumn>
													<InputField
														label={'Old Password *'}
														type={'password'}
														name={'oldPassword'}
														onChange={handleChange}
														onClick={handleFocus}
														value={data.oldPassword}
													/>
												</StyledColumn>
											</StyledGrid>

											<StyledGrid>
												<StyledColumn>
													<InputField
														label={'Password *'}
														type={'password'}
														name={'password'}
														onChange={handleChange}
														onClick={handleFocus}
														value={data.password}
													/>
												</StyledColumn>
											</StyledGrid>

											<StyledGrid>
												<StyledColumn>
													<InputField
														label={
															'Confirm Password *'
														}
														type={'password'}
														disabled={false}
														name={'confirmPassword'}
														onChange={handleChange}
														onClick={handleFocus}
														value={
															data.confirmPassword
														}
													/>
												</StyledColumn>
											</StyledGrid>
										</StyledColumn>
									</StyledGrid>
								) : (
									''
								)
							) : (
								<>
									<StyledGrid>
										<StyledColumn>
											<InputField
												label={'Password *'}
												type={'password'}
												name={'password'}
												onChange={handleChange}
												onClick={handleFocus}
												value={data.password}
											/>
										</StyledColumn>
									</StyledGrid>

									<StyledGrid>
										<StyledColumn>
											<InputField
												label={'Confirm Password *'}
												type={'password'}
												disabled={false}
												name={'confirmPassword'}
												onChange={handleChange}
												onClick={handleFocus}
												value={data.confirmPassword}
											/>
										</StyledColumn>
									</StyledGrid>
								</>
							)}
							{edit === true ? (
								<StyledLabel />
							) : (
								<StyledLabel>
									* These fields are required
								</StyledLabel>
							)}
							{edit === true ? (
								<RectangularButton
									width={'100%'}
									label={'Save'}
									color={colors.green}
									onRedirect={handleUpdate}
									disabled={isBusy}
								/>
							) : (
								<RectangularButton
									width={'100%'}
									label={'Register'}
									color={colors.green}
									onRedirect={handleOnSubmit}
									disabled={isBusy}
								/>
							)}

							<StyledConfirm
								open={openConfirm}
								onCancel={() => setOpenConfirm(false)}
								content={`Do you want to edit this field? Tap on 'Yes' and check your mail inbox to verify it's you.`}
								cancelButton="No"
								confirmButton="Yes"
								onConfirm={() => handleConfirm()}
							/>
							<RenderDeactivateFirst />
							<RenderDeactivateSecond />
							<RenderPaypalPopup />
						</Form>
					)}
				</RegistrationContainer>
			</StyledContainer>
		</StyledRegister>
	);
};

export default Register;
