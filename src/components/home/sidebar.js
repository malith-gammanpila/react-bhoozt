import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Segment, Sidebar, Confirm } from 'semantic-ui-react';

import { Container, StyledContent, Row, Column } from '../styles/styles';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import useRoute from '../../hooks/route.hook';
import HomeContainer from '../../containers/home.container';
import useFeedbackModal from '../../containers/feedback.container';
import HomeCarousel from '../home/homeCarousel';
import { FeedbackModal } from '../common/modal';
import User from '../../assets/images/user_image.svg';
import Profile from '../../assets/images/profile.svg';
import Referral from '../../assets/images/share-referral.svg';
import Feedback from '../../assets/images/feedback.svg';
import Logout from '../../assets/images/logout.svg';
import FunNear from '../../assets/images/fun-nearby.svg';
import Kokopo from '../../assets/images/kk-bird.png';
import HowItWorks from '../../assets/images/how-it-works.svg';
import Friends from '../../assets/images/friends.svg';
import {
	clearDefaults,
	FCMToken,
	userDefaults,
} from '../../database/bhoozt_defaults.data';
import profileContainer from '../../containers/profile.container';

import useModal from '../../containers/modal.container';
import { FullscreenModal } from '../../components/common/modal';
import { BhooztFirebaseUnRegistration } from '../../api/calls/push.api';
import { messaging } from '../../push-notification';

const SidebarContainer = styled(Container)`
	// border-style: dotted;
	// border-color: blue;
	// border-width: 1px;
	height: ${(props) => `${props.height}px`};
`;

const SliderItems = styled.a`
	color: ${colors.darkGreen} !important;
	padding: 7px 20px;
	display: flex;
	justify-content: flex-start;
	cursor: pointer;
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 20px;
	}
`;

const KkWrapper = styled.div`
	flex-direction: row !important;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin-bottom: 20px;
	@media ${smallScreen} {
		font-size: 14px; !important;
	}
	@media ${mediumScreen} {
		font-size: 16px; !important;
	}
	color: ${colors.darkGreen} !important;
`;

const KkBird = styled.div`
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${Kokopo}) !important;
	height: 40px;
	width: 40px;
	margin-right: 5px;
`;

const KkLabel = styled.div`
	align-self: center;
	margin-left: 5px;
`;

const SlidingContainer = styled(StyledContent)`
	min-height: ${(props) => `${props.height - 50}px`};
	padding: 50px 30px;
`;

const ProfileImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) => props.image}) !important;
	text-align: center;
	margin: 0 auto;
	margin-bottom: 10px;
	border-radius: 50%;
	@media ${smallScreen} {
		width: 100px;
		height: 100px;
	}
	@media ${mediumScreen} {
		width: 150px;
		height: 150px;
	}
`;

const Icon = styled(ProfileImage)`
	width: 28px !important;
	height: 28px !important;
	background-size: auto;
	background-image: url(${(props) => props.image}) !important;
	cursor: pointer;
	border-radius: 0 !important;
`;

const StyledRow = styled(Row)`
	padding: 0 10px !important;
	@media ${smallScreen} {
		height: 60px;
	}
	@media ${mediumScreen} {
		height: 60px;
	}
`;

const LogoutContainer = styled(Row)`
	padding: 0 40px !important;
`;

const StyledSegment = styled(Segment)`
	border: 0px solid transparent !important;
	box-shadow: 0px 0px 0px 0px transparent !important;
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

const SidebarMenu = () => {
	const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const {
		sidebarVisibility,
		setSidebarVisibility,
		user,
	} = HomeContainer.useContainer();
	const { profile } = profileContainer.useContainer();
	const {
		handleOpenProfileModal,
		handleOpenShareReferralModal,
		handleOpenFunModal,
		handleOpenFriendsModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	const {
		handleOpenFeedback,
		handleCloseFeedback,
		isShow,
	} = useFeedbackModal();

	const [open, setOpen] = useState(false);
	const [openShareReferral, setOpenShareReferral] = useState(false);

	const show = () => {
		setSidebarVisibility(false);
		setTimeout(() => {
			setOpen(true);
		}, 700);
	};

	const handleConfirm = (logoutUser) => {
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const logoutUser = async () => {
		let user = await userDefaults();
		let token = await FCMToken();
		if (
			user &&
			user.user_role !== 'anonymous' &&
			token &&
			token.length > 0
		) {
			try {
				await BhooztFirebaseUnRegistration();
				await messaging.deleteToken(token);
			} catch (e) {
				// console.log(e);
			}
		}
		await clearDefaults();
		handleRedirect('/');
	};

	const profImageUrl = () => {
		if (
			profile &&
			profile.provider &&
			profile.provider !== 'email' &&
			!profile.image
		) {
			return profile && profile.socialImage ? profile.socialImage : User;
		} else {
			return profile && profile.image
				? process.env.REACT_APP_API_ENDPOINT_IMAGE + profile.image
				: User;
		}
	};

	// /**
	//  * Handle share referral open
	//  */
	// const handleOpenShareReferral = () => {
	// 	setOpenShareReferral(true);
	// };

	// /**
	//  * Handle share referral close
	//  */
	// const handleCloseShareReferral = () => {
	// 	setOpenShareReferral(false);
	// };

	return (
		<Container>
			<Sidebar.Pushable as={StyledSegment} onClick={handleCancel}>
				<Sidebar
					style={{ width: 300 }}
					as={Menu}
					animation="overlay"
					icon="labeled"
					onHide={() => setSidebarVisibility(false)}
					vertical
					visible={sidebarVisibility}
				>
					<Container>
						<SlidingContainer height={height}>
							<ProfileImage image={profImageUrl()} />
							<KkWrapper>
								{user.user_role !== 'anonymous' ? (
									<>
										<KkBird />
										<KkLabel>{`${user.karma_points}`}</KkLabel>
									</>
								) : null}
							</KkWrapper>
							<StyledRow>
								<Column width={2}>
									<Icon
										image={Profile}
										onClick={() => {
											handleOpenProfileModal();
											// setSidebarVisibility(false);
										}}
									/>
								</Column>
								<Column width={14}>
									<SliderItems
										onClick={() => {
											setSidebarVisibility(false);
											setTimeout(() => {
												handleOpenProfileModal();
											}, 550);
										}}
									>
										User Profile
									</SliderItems>
								</Column>
							</StyledRow>
							<StyledRow>
								<Column width={2}>
									<Icon
										image={Friends}
										onClick={() => {
											setSidebarVisibility(false);
											setTimeout(() => {
												handleOpenFriendsModal();
											}, 550);
										}}
									/>
								</Column>
								<Column width={14}>
									<SliderItems
										onClick={() => {
											setSidebarVisibility(false);
											setTimeout(() => {
												handleOpenFriendsModal();
											}, 550);
										}}
									>
										Friends
									</SliderItems>
								</Column>
							</StyledRow>
							<StyledRow>
								<Column width={2}>
									<Icon
										image={FunNear}
										onClick={() => {
											handleOpenFunModal();
										}}
									/>
								</Column>
								<Column width={14}>
									<SliderItems
										onClick={() => handleOpenFunModal()}
									>
										Fun Nearby
									</SliderItems>
								</Column>
							</StyledRow>
							<StyledRow>
								<Column width={2}>
									<Icon
										image={Feedback}
										onClick={() => {
											setSidebarVisibility(false);
											setTimeout(() => {
												handleOpenFeedback();
											}, 550);
										}}
									/>
								</Column>
								<Column width={14}>
									<SliderItems
										onClick={() => {
											setSidebarVisibility(false);
											setTimeout(() => {
												handleOpenFeedback();
											}, 550);
										}}
									>
										Feedback
									</SliderItems>
								</Column>
							</StyledRow>

							<StyledRow>
								<Column width={2}>
									<a
										href="https://bhoozt.com/faq/"
										target="_blank"
									>
										<Icon image={HowItWorks} />
									</a>
								</Column>
								<Column width={14}>
									<a
										href="https://bhoozt.com/faq/"
										target="_blank"
									>
										<SliderItems>How to play?</SliderItems>
									</a>
								</Column>
							</StyledRow>

							<FeedbackModal />
						</SlidingContainer>
						<LogoutContainer>
							<Column width={2}>
								<Icon
									image={Logout}
									onClick={() => handleRedirect('/')}
								/>
							</Column>
							<Column width={14}>
								<SliderItems onClick={show}>Logout</SliderItems>
								<StyledConfirm
									open={open}
									onCancel={handleCancel}
									content="Are you sure you want to Log Out?"
									cancelButton="NO"
									confirmButton="YES"
									onConfirm={() =>
										handleConfirm(logoutUser())
									}
								/>
							</Column>
						</LogoutContainer>
					</Container>
				</Sidebar>

				<Sidebar.Pusher dimmed={sidebarVisibility}>
					<SidebarContainer>
						<HomeCarousel />
						{/* <Home /> */}
					</SidebarContainer>
				</Sidebar.Pusher>
			</Sidebar.Pushable>

			{/* Modal for profile */}
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>

			{/* Feedback Modal */}
			<FeedbackModal handleSend={handleCloseFeedback} isShow={isShow} />
		</Container>
	);
};

export default SidebarMenu;
