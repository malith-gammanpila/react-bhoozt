import React, { useEffect } from 'react';
import styled from 'styled-components';

import Check from '../../assets/images/check.svg';
import { colors } from '../../utils/colors';
import { mediumScreen, smallScreen } from '../../utils/media';
import { Column, Container, Row, StyledFooter } from '../styles/styles';
import { RectangularButton } from '../common/button';
import { FullscreenModal } from '../common/modal';
import NavHeader from '../common/navHeader';
import ProfileImg from '../../assets/images/user_image.svg';
import profileContainer from '../../containers/profile.container';
import Moment from 'moment';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import useModal from '../../containers/modal.container';
import messages from '../../containers/messages.container';

const ProfileContainer = styled.div`
	margin: 0 auto;
	padding: 0px;
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 132}px`};
	}
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 167}px`};
	}
`;

const FooterWrapper = styled(StyledFooter)`
	display: flex;
	flex-direction: column;
`;

const ProfileImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) => props.image}) !important;
	text-align: center;
	margin: 0px auto;
	border-radius: 50%;
	@media ${smallScreen} {
		width: 100px;
		height: 100px;
	}
	@media ${mediumScreen} {
		width: 200px;
		height: 200px;
	}
`;
const StyledTitle = styled.p`
	font-weight: 400;
	padding-top: 30px;
	margin-bottom: 10px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 22px;
	}
`;
const StyledSubTitle = styled(StyledTitle)`
color: ${colors.darkGray}
padding-top: 0px;
padding-bottom: 20px;
	@media ${smallScreen} {
		font-size: 14px;
	}
	@media ${mediumScreen} {
		font-size: 20px;
	}
`;

const StyledVersionNumber = styled(StyledSubTitle)`
	align-self: center;
	padding: 0px;
	@media ${smallScreen} {
		font-size: 12px;
	}
	@media ${mediumScreen} {
		font-size: 16px;
	}
`;

const StyledSubTitleEmail = styled(StyledSubTitle)`
	align-self: center;
`;

const StyledItemDetail = styled(StyledSubTitle)`
	text-align: left;
	@media ${smallScreen} {
		padding: 15px 15px 15px 0px;
	}
	@media ${mediumScreen} {
		padding: 15px 15px 15px 0px;
	}
`;
const StyledItem = styled(StyledItemDetail)`
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		padding: 15px 15px 15px 0px;
	}
	@media ${mediumScreen} {
		padding: 15px 15px 15px 0px;
	}
`;

const StyledContainer = styled.div`
	@media ${smallScreen} {
		width: 300px;
	}
	@media ${mediumScreen} {
		width: 500px;
	}
`;

const ProfileDetails = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const StyledCheckIcon = styled.div`
	width: 20px;
	height: 20px;
	margin-top: 15px !important;
	margin-left: 10px !important;
	// position: absolute;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${Check}) !important;
`;

const StyledCheckIconWrapper = styled(StyledCheckIcon)`
	margin-top: -30px !important;
`;

const StyledEmailWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Profile = ({ handleCloseModal }) => {
	const {
		profile,
		confirmationData,
		checkConfirmation,
		isBusy,
		setIsBusy,
	} = profileContainer.useContainer();
	// const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const {
		handleOpenRegisterModal,
		handleCloseModal: handleCloseModals,
		isModalVisible,
		modalType,
	} = useModal();
	const { notifyLongError } = messages();

	useEffect(() => {
		checkConfirmation(); // Check whether email, paypal and phone number is locked
	}, []);

	const loadProfileDetails = () => {
		if (profile.user_role !== 'anonymous') {
			return (
				<StyledContainer>
					<Row>
						<Column mobile={8} tablet={6}>
							<StyledItem>Date of Birth</StyledItem>
						</Column>
						<Column mobile={8} tablet={10}>
							<StyledItemDetail>
								{profile.date_of_birth
									? Moment(profile.date_of_birth).format(
											'YYYY-MM-DD'
									  )
									: ''}
							</StyledItemDetail>
						</Column>
					</Row>
					<Row>
						<Column mobile={8} tablet={6}>
							<StyledItem>Gender</StyledItem>
						</Column>
						<Column mobile={8} tablet={10}>
							<StyledItemDetail>
								{profile.sex
									? profile.sex.toUpperCase().charAt(0) +
									  profile.sex.slice(1)
									: ''}
							</StyledItemDetail>
						</Column>
					</Row>
					<Row>
						<Column mobile={7} tablet={5}>
							<StyledItem>Phone Number</StyledItem>
						</Column>
						<Column mobile={8} tablet={10}>
							<StyledItemDetail>
								{profile.contact_number
									? profile.contact_number
									: ''}
							</StyledItemDetail>
						</Column>
						<Column mobile={1} tablet={1}>
							{confirmationData.is_otp_confirmed ? (
								<StyledCheckIcon />
							) : null}
						</Column>
					</Row>
					<Row>
						<Column mobile={7} tablet={5}>
							<StyledItem>PayPal Email</StyledItem>
						</Column>
						<Column mobile={8} tablet={10}>
							<StyledItemDetail>
								{profile.pay_pal_email
									? profile.pay_pal_email
									: ''}
							</StyledItemDetail>
						</Column>
						<Column mobile={1} tablet={1}>
							{confirmationData.is_paypal_confirmed ? (
								<StyledCheckIcon />
							) : null}
						</Column>
					</Row>
				</StyledContainer>
			);
		}
	};

	const actionButtonText = () => {
		return profile.user_role !== 'anonymous' ? 'Edit Profile' : 'Register';
	};

	const profImageUrl = () => {
		if (
			profile &&
			profile.provider &&
			profile.provider !== 'email' &&
			!profile.image
		) {
			return profile && profile.socialImage
				? profile.socialImage
				: ProfileImg;
		} else {
			return profile && profile.image
				? process.env.REACT_APP_API_ENDPOINT_IMAGE + profile.image
				: ProfileImg;
		}
	};

	const handleGoRegister = () => {
		if (profile.user_role === 'anonymous') {
			setIsBusy(true);
			notifyLongError(
				'Heads up. To ensure we can verify it’s you, please use your proper email address and mobile # to which we can send a verification message. Thank you.'
			);
			setTimeout(() => {
				setIsBusy(false);
				handleOpenRegisterModal();
			}, 6000);
		} else {
			handleOpenRegisterModal();
		}
	};

	return (
		<>
			<Container>
				<NavHeader
					title={'Profile'}
					handleCloseModal={handleCloseModal}
				/>
				<ProfileContainer height={height}>
					<ProfileImage image={profImageUrl()} />
					<StyledTitle>{profile.name}</StyledTitle>
					<StyledEmailWrapper>
						<StyledSubTitleEmail>
							{profile.email}
						</StyledSubTitleEmail>
						{confirmationData.is_email_confirmed ? (
							<StyledCheckIconWrapper />
						) : null}
					</StyledEmailWrapper>
					<ProfileDetails>{loadProfileDetails()}</ProfileDetails>
				</ProfileContainer>
				<FooterWrapper>
					<RectangularButton
						width={'90%'}
						label={actionButtonText()}
						color={colors.green}
						disabled={isBusy}
						onRedirect={() => handleGoRegister()}
					/>
					<StyledVersionNumber>
						v {process.env.REACT_APP_VERSION_NUMBER}
					</StyledVersionNumber>
				</FooterWrapper>
			</Container>

			{/* Modal for register */}
			<FullscreenModal
				handleCloseModal={handleCloseModals}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</>
	);
};

export default Profile;
