import React, { useEffect, useState } from 'react';
import OTPInput, { ResendOTP } from '../../utils/otp-input-react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';

// Styles
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import close from '../../assets/images/close.svg';

// Containers
import OtpContainer from '../../containers/otp.container';

const StyledInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const StyledRecapWrapper = styled.div`
	margin: 0 auto !important;
	display: ${(props) => (props.recapVisible ? 'flex' : 'none')};
`;

const StyledHead = styled.div`
	width: 100%;
`;

const StyledCloseButton = styled(Button)`
	float: right;
	background-color: transparent !important;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	margin-right: 0px !important;
	margin-top: 0px !important;
	padding: 0em !important;
`;

const BackgroundImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${close}) !important;
	@media ${smallScreen} {
		width: 20px;
		height: 20px;
	}
	@media ${mediumScreen} {
		width: 20px;
		height: 20px;
	}
`;

const MobileVerification = (props) => {
	const {
		recapVisible,
		setRecapVisible,
		handleVerifyMobileNumber,
		otpError,
		setOtpError,
		disabled,
		setDisabled,
		setMobileVisible,
		setOtpVisible,
		handleCloseOtp,
	} = OtpContainer.useContainer();

	const [otp, setOtp] = useState('');

	// Send entered code on change
	useEffect(() => {
		if (otp.length >= 6) {
			setDisabled(true);
			handleVerifyMobileNumber(otp);
		}
	}, [otp]);

	const handelResendClick = () => {
		setDisabled(false);
		setOtp('');
		setOtpError();
		setRecapVisible(true);
		setOtpVisible(false);
		setMobileVisible(true);
		// console.log('Retrying..');
	};

	const handelTimeOut = () => {
		if (otp.length < 6 && !otpError) {
			setDisabled(true);
			setOtpError(
				'Timeout! You are taking too long to verify your mobile number. Try Resend Code.'
			);
			// console.log('OTP Timeout!');
		}
	};

	return (
		<StyledInputContainer>
			<StyledHead>
				<StyledCloseButton onClick={() => handleCloseOtp()}>
					<BackgroundImage />
				</StyledCloseButton>
			</StyledHead>
			{props.title ? (
				<span
					style={{
						color: `${colors.darkGreen}`,
						fontSize: '20px',
						fontWeight: '600',
						margin: '20px 5px',
					}}
				>{`${props.title}`}</span>
			) : null}

			{props.description ? (
				<span
					style={{
						color: `${colors.darkGray}`,
						fontSize: '18px',
						maxWidth: '540px',
						margin: '20px 5px',
						textAlign: 'center',
					}}
				>{`${
					recapVisible
						? 'Before you proceed to the verification, please complete the captcha below.'
						: props.description
				}`}</span>
			) : null}

			<StyledRecapWrapper recapVisible={recapVisible}>
				<div id="recaptchaWidget" />
			</StyledRecapWrapper>

			{!recapVisible ? (
				<OTPInput
					value={otp}
					onChange={setOtp}
					autoFocus
					OTPLength={6}
					otpType="number"
					disabled={disabled}
					secure={false}
					inputStyles={{
						border: 0,
						borderBottom: `1px solid ${colors.lightGray}`,
						width: '35px',
						height: '60px',
						color: 'black',
						fontSize: '15px',
						margin: '0px 5px',
					}}
				/>
			) : null}
			{otpError ? (
				<span
					style={{
						color: '#ff5969',
						fontSize: '18px',
						maxWidth: '540px',
						margin: '20px 5px',
						textAlign: 'center',
					}}
				>{`${otpError}`}</span>
			) : null}
			{!recapVisible ? (
				<div onClick={() => handelResendClick()}>
					<ResendOTP
						maxTime={120}
						handelResendClick={() => handelResendClick()}
						style={{
							height: '30px',
							backgroundColor: 'Transparent',
							border: 'none',
							cursor: 'pointer',
							outline: 'none',
						}}
						onTimerComplete={() => handelTimeOut()}
					/>
				</div>
			) : null}
		</StyledInputContainer>
	);
};

export default MobileVerification;
