import React, { useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import styled from 'styled-components';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';

import useRoute from '../../hooks/route.hook';
import useModal from '../../containers/modal.container';
import { smallScreen, mediumScreen } from '../../utils/media';
import { colors } from '../../utils/colors';
import { MainHeader, Container } from '../styles/styles';
import { InputField } from '../common/input';
import { RectangularButton, CloseButton } from '../common/button';

import {
	PopupModal,
	FullscreenModal,
	VerifyMobileModal,
} from '../common/modal';
import useLogin from '../../containers/login.container';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import HomeContainer from '../../containers/home.container';
import messages from '../../containers/messages.container';
import PushContainer from '../../containers/push.container';

const LoginContainer = styled.div`
	margin: 0 auto;
	padding: 25px 0px;
	@media ${smallScreen} {
		width: 300px !important;
		min-height: ${(props) => `${props.height}px`};
	}
	@media ${mediumScreen} {
		width: 500px !important;
		min-height: ${(props) => `${props.height}px`};
	}
`;

const StyledMainHeader = styled(MainHeader)`
	padding-top: 0 !important;
`;

const StyledHeader = styled(Header)`
	color: ${colors.darkGray} !important;
	text-align: center;
	padding: 10px !important;
	font-weight: 400 !important;
	@media ${smallScreen} {
		font-size: 20px !important;
	}
	@media ${mediumScreen} {
		font-size: 30px !important;
	}
`;

const StyledSeparator = styled.p`
	color: ${colors.darkGray} !important;
	padding: 0px 10px 10px 10px;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 22px !important;
	}
`;

const StyledRow = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
	@media ${smallScreen} {
		height: 20px;
	}
	@media ${mediumScreen} {
		height: 30px;
	}
`;

const ForgotWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

const Login = (props) => {
	const { handleRedirect } = useRoute();
	const { setPath } = HomeContainer.useContainer();
	const { width, height } = useWindowDimensions();
	const { notifyError, notifyLongError } = messages();
	const { pushData } = PushContainer.useContainer();

	const {
		isBusy,
		setIsBusy,
		data,
		handleChange,
		handleSubmit,
		handleSubmitAnonymousUser,
		socialLogin,
	} = useLogin();
	const {
		handleOpenRegisterModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	useRoute(() => {
		setTimeout(function () {
			const message = 'Your notification here';
			this.props.enqueueSnackbar(message, {
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'left',
				},
			});
		}, 3000);
	}, []);

	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	useEffect(() => {
		if (
			pushData &&
			pushData.pgi_token &&
			pushData.pgi_token !== '' &&
			pushData.pgi_token !== null
		) {
			handleSubmitAnonymousUser(null, pushData.pgi_token);
		}
	}, [pushData]);

	// facebook login
	const responseFacebook = async (response) => {
		// console.log(response);
		await socialLogin('facebook', response);
	};

	// google login
	const responseGoogleSuccess = async (response) => {
		// console.log('success: ' + JSON.stringify(response));
		await socialLogin('google', response);
	};

	// google login
	const responseGoogleFailed = async (response) => {
		// console.log('failed: ' + JSON.stringify(response));
	};

	const handleGoRegistration = () => {
		setIsBusy(true);
		notifyLongError(
			'Heads up. To ensure we can verify it’s you, please use your proper email address and mobile # to which we can send a verification message. Thank you.'
		);
		setTimeout(() => {
			setIsBusy(false);
			handleOpenRegisterModal();
		}, 6000);
	};

	return (
		<>
			<>
				<Container
					style={{ width: width, overflowY: 'auto' }}
					height={height}
				>
					<LoginContainer height={height}>
						<StyledRow>
							<CloseButton
								onRedirect={(e) =>
									handleSubmitAnonymousUser(e, null)
								}
							/>
						</StyledRow>
						<StyledMainHeader>Bhoozt</StyledMainHeader>
						<RectangularButton
							label={'Create New Account'}
							color={colors.red}
							disabled={isBusy}
							onRedirect={() => handleGoRegistration()}
						/>
						<StyledHeader>Existing User - Sign In</StyledHeader>
						<InputField
							placeholder={'Existing User Email'}
							value={data.email}
							name="email"
							onChange={handleChange}
						/>
						<InputField
							placeholder={'Existing Password'}
							value={data.password}
							name="password"
							onChange={handleChange}
							type="password"
						/>
						<RectangularButton
							label={'Sign in'}
							color={colors.green}
							onRedirect={handleSubmit}
							disabled={isBusy}
						/>
						<ForgotWrapper>
							<PopupModal
								type="password"
								label={'Forgot Password'}
							/>
							<PopupModal type="email" label={'Forgot Email'} />
						</ForgotWrapper>
						<StyledSeparator>OR</StyledSeparator>
						<FacebookLogin
							appId={process.env.REACT_APP_FACEBOOK_API_KEY}
							autoLoad={false}
							callback={responseFacebook}
							redirectUri={
								process.env.REACT_APP_FACEBOOK_REDIRECT_URI
							}
							fields="id,email,first_name,last_name,birthday,gender,picture.type(large)"
							scope="public_profile"
							state={
								'?' +
								new URLSearchParams(
									window.location.search
								).toString()
							}
							disableMobileRedirect={true}
							render={(renderProps) => (
								<RectangularButton
									label={'Sign in with Facebook'}
									color={colors.blue}
									type={'facebook'}
									onRedirect={renderProps.onClick}
								/>
							)}
						/>
						<GoogleLogin
							clientId={process.env.REACT_APP_GOOGLE_API_KEY}
							render={(renderProps) => (
								<RectangularButton
									label={'Sign in with Google'}
									color={colors.white}
									type={'google'}
									onRedirect={renderProps.onClick}
									disabled={renderProps.disabled}
								/>
							)}
							buttonText="Login"
							onSuccess={responseGoogleSuccess}
							onFailure={responseGoogleFailed}
							cookiePolicy={'single_host_origin'}
						/>
						<RectangularButton
							label={'Sign in later'}
							color={colors.yellow}
							onRedirect={(e) =>
								handleSubmitAnonymousUser(e, null)
							}
							disabled={isBusy}
						/>
						{/* -------------------------------------------------------------- //DEBUG */}
						{/* <RectangularButton
							label={'xx'}
							onRedirect={() => handleRedirect('/password/reset')}
						/> */}
						{/* -------------------------------------------------------------------- */}
					</LoginContainer>
				</Container>
			</>

			{/* Modal for profile and register */}
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>

			<VerifyMobileModal />
		</>
	);
};

export default Login;
