import React, { useEffect, useState } from 'react';
import { Search, Tab, Confirm, Icon, Popup, Button } from 'semantic-ui-react';

import { FullscreenModal } from '../common/modal';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import ProfileImg from '../../assets/images/user_image.svg';
import { mediumScreen, smallScreen } from '../../utils/media';
import { Container } from '../styles/styles';
import NavHeader from '../common/navHeader';
import Plus from '../../assets/images/plus.svg';
import Minus from '../../assets/images/minus.svg';
import Accept from '../../assets/images/accept.svg';
import Reject from '../../assets/images/reject.svg';

import useWindowDimensions from '../../hooks/windowDimention.hook';
import FriendsContainer from '../../containers/friends.container';
import useModal from '../../containers/modal.container';

const API_ENDPOINT_IMAGE = process.env.REACT_APP_API_ENDPOINT_IMAGE;

const ContentContainer = styled.div`
	// background-color: #eee;
	margin: 0 auto;
	padding: 25px 0px 10px 0px;
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 77}px`};
		width: 720px;
	}
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 50}px`};
		width: 90%;
	}
`;

const StyledSearch = styled(Search)`
	&& .prompt {
		border-radius: 5px;
		@media ${smallScreen} {
			width: 335px;
		}
		@media ${mediumScreen} {
			width: 720px;
		}
	}
	&& .results.transition {
		width: 100%;
		margin-top: 40px;
		@media ${smallScreen} {
			max-height: ${(props) => `${props.height - 255}px`};
		}
		@media ${mediumScreen} {
			max-height: ${(props) => `${props.height - 280}px`};
		}
		overflow-y: scroll;
	}
	&& .ui.icon.input > i.icon:not(.link) {
		pointer-events: unset;
	}
	&& .ui.icon.input > i.icon {
		cursor: pointer;
	}
`;

const StyledErrorWrapper = styled.div`
	height: 20px;
	width: 100%;
	// background-color: #ddd;
	color: ${colors.red};
	font-size: 14px;
	text-align: left;
	display: flex;
	align-items: center;
`;

const StyledTab = styled(Tab)`
	margin: 20px auto;
	.ui.menu .item {
		color: ${colors.darkGray} !important;
		flex: 1;
		justify-content: center;
		background-color: #f7f7f7;
	}
	&& .ui.menu {
		align-items: center;
		justify-content: center;
		border: none;
		background-color: transparent;
		box-shadow: none;
	}
	&& .ui.menu .item:before {
		width: 0;
	}
	&& .ui.menu > .item:first-child {
		border-radius: 4px 0 0 4px;
	}
	&&& .ui.menu > .item:last-child {
		border-radius: 0 4px 4px 0;
	}
	&& .active.item,
	.active.item:hover {
		background-color: ${colors.green} !important;
		color: ${colors.white} !important;
	}
	&& .ui.segment {
		border: none;
		@media ${smallScreen} {
			height: ${(props) => `${props.height - 255 - 35}px`};
		}
		@media ${mediumScreen} {
			height: ${(props) => `${props.height - 280 - 35}px`};
		}
		overflow-y: scroll;
		::-webkit-scrollbar {
			display: block;
			background: #fff;
			width: 3px;
		}
		::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.1);
			border-radius: 0;
		}
	}
`;

const StyledCard = styled.div`
	display: flex;
	width: 100%;
	flex-direction: row;
	cursor: default;
	margin: 10px 0;
`;

const StyledCardImage = styled.div`
	@media ${smallScreen} {
		width: 50px;
		height: 50px;
	}
	@media ${mediumScreen} {
		width: 70px;
		height: 70px;
	}
	border-radius: 50%;
	background-color: ${colors.lightGray};
	background-image: url(${(props) => props.image}) !important;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin: auto 0;
`;

const StyledCardContent = styled.div`
	flex: 1;
	flex-direction: column;
	padding: 15px;
	margin: auto 0;
	text-align: left !important;
`;

const StyledCardName = styled.div`
	color: ${colors.darkGray};
	font-weight: 700;
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
`;

const StyledCardStatus = styled.div`
	color: ${colors.gray};
	font-size: 14px;
`;

const StyledCardBtns = styled.div`
	@media ${smallScreen} {
		width: 100px;
		height: 50px;
	}
	@media ${mediumScreen} {
		width: 140px;
		height: 70px;
	}
	margin: auto 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const StyledCardBtn = styled.div`
	// border-radius: 50%;
	// background-color: #f7f7f7;
	@media ${smallScreen} {
		width: 35px;
		height: 35px;
		margin: 0 5px;
	}
	@media ${mediumScreen} {
		width: 40px;
		height: 40px;
		margin: 0 10px;
	}
	font-size: 20px;
	font-weight: 700;
	color: ${colors.green};
	background-image: url(${(props) => props.image}) !important;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
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

const StyledFooterWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

const StyledTellFriendsButton = styled(Button)`
  color: ${colors.white}!important;
  border: 1px solid ${colors.green} !important;
  padding: 15px !important;
  margin: 0px 5px !important;
  text-transform: uppercase !important;
  font-weight: 400 !important;
  background-color: ${colors.green}!important;
  @media ${smallScreen} {
    width:100%
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    width:100%
    font-size: 16px !important;
  }
`;

const StyledTellFriendsButtonRed = styled(StyledTellFriendsButton)`
	border: 1px solid ${colors.red} !important;
	background-color: ${colors.red}!important;
`;

const StyledFloatingBtn = styled(Button)`
	position: fixed;
	width: 60px;
	height: 60px;
	bottom: 100px;
	right: ${(props) =>
		`${props.width > 800 ? (props.width - 800) / 2 + 50 : 40}px`};
	background-color: ${colors.red} !important;
	color: #fff !important;
	border-radius: 30px !important;
	text-align: center !important;
	box-shadow: 2px 2px 3px #999 !important;
`;

const StyledFloatingIcon = styled(Icon)`
	margin: 0px !important;
	color: ${colors.white};
`;

const style = {
	borderRadius: 10,
	color: colors.darkGreen,
	opacity: 0.7,
};

const Friends = (props) => {
	const { height, width } = useWindowDimensions();
	const {
		loading,
		users,
		friends,
		updates,
		setUsers,
		searchUsersByName,
		getAllFriends,
		getUpdates,
		sendFriendRequest,
		removeFriend,
		acceptFriend,
	} = FriendsContainer.useContainer();
	const {
		handleOpenShareReferralModal,
		handleOpenCreateFunModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
	const [confirmMsg, setConfirmMsg] = useState('');
	const [selectedId, setSelectedId] = useState();

	const searchRef = React.createRef();

	useEffect(() => {
		getAllFriends();
		getUpdates();
	}, []);

	useEffect(() => {
		let formattedValue = value.replace(/\s/g, '');
		if (formattedValue.length >= 1) {
			searchUsersByName(formattedValue);
		} else {
			setUsers([]);
		}
	}, [value]);

	const setSearchFocus = () => {
		searchRef.current.focus();
	};

	const handleSearchChange = (e, { value }) => {
		setValue(value);
	};

	const handleResultSelect = (e, { value }) => {
		setValue(value);
	};

	const handleAddFriend = (user) => {
		sendFriendRequest(user).then(() => {
			setValue('');
			setUsers([]);
			getUpdates();
		});
	};

	const handleRemoveFriend = (id) => {
		removeFriend(id).then(() => {
			setUsers([]);
			getAllFriends();
			getUpdates();
		});
	};

	const handleAcceptFriend = (id) => {
		acceptFriend(id).then(() => {
			setUsers([]);
			getAllFriends();
			getUpdates();
		});
	};

	const handleOpenPopup = (id, msg) => {
		setSelectedId(id);
		setConfirmMsg(msg);
		setOpen(true);
	};

	const handleClosePopup = () => {
		setSelectedId();
		setOpen(false);
	};

	const handleConfirm = (func) => {
		setSelectedId();
		setOpen(false);
	};

	const handleClearSearch = () => {
		setValue('');
		setUsers([]);
	};

	const panes = [
		{
			menuItem:
				friends.length > 0 ? `Friends (${friends.length})` : 'Friends',
			render: () => (
				<Tab.Pane attached="top">
					{friends && friends.length > 0 ? (
						friends.map((friend) => (
							<StyledCard>
								<StyledCardImage
									image={
										friend.image
											? `${API_ENDPOINT_IMAGE}${friend.image}`
											: friend.socialImage || ProfileImg
									}
								/>
								<StyledCardContent>
									<StyledCardName>
										{friend.name}
									</StyledCardName>
									<StyledCardStatus>Friend</StyledCardStatus>
								</StyledCardContent>
								<StyledCardBtns>
									<Popup
										trigger={
											<StyledCardBtn
												onClick={() =>
													handleOpenPopup(
														friend.id,
														'Are you sure you want to unfriend?'
													)
												}
												image={Minus}
											/>
										}
										content="Unfriend"
										position="top right"
										mouseEnterDelay={2000}
										style={style}
									/>
								</StyledCardBtns>
							</StyledCard>
						))
					) : (
						<StyledCardStatus>
							It's a bit lonely here. Add a few friends...
						</StyledCardStatus>
					)}
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Updates',
			render: () => (
				<Tab.Pane attached="top">
					{updates &&
					((updates.received && updates.received.length > 0) ||
						(updates.sent && updates.sent.length > 0)) ? (
						<>
							{updates.received.map((update) => (
								<StyledCard>
									<StyledCardImage
										image={
											update.image
												? `${API_ENDPOINT_IMAGE}${update.image}`
												: update.socialImage ||
												  ProfileImg
										}
									/>
									<StyledCardContent>
										<StyledCardName>
											{update.name}
										</StyledCardName>
										<StyledCardStatus>
											{update.status &&
											update.status === 'pending'
												? 'Request Pending'
												: 'Request Accepted'}
										</StyledCardStatus>
									</StyledCardContent>
									<StyledCardBtns>
										{update.status &&
										update.status !== 'accepted' ? (
											<>
												<Popup
													trigger={
														<StyledCardBtn
															onClick={() =>
																handleAcceptFriend(
																	update.id
																)
															}
															image={Accept}
														/>
													}
													content="Accept"
													position="top right"
													mouseEnterDelay={2000}
													style={style}
												/>

												<Popup
													trigger={
														<StyledCardBtn
															onClick={() =>
																handleOpenPopup(
																	update.id,
																	'Are you sure you want to remove?'
																)
															}
															image={Reject}
														/>
													}
													content="Reject"
													position="top right"
													mouseEnterDelay={2000}
													style={style}
												/>
											</>
										) : null}
									</StyledCardBtns>
								</StyledCard>
							))}
							{updates.sent.map((update) => (
								<StyledCard>
									<StyledCardImage
										image={
											update.image
												? `${API_ENDPOINT_IMAGE}${update.image}`
												: update.socialImage ||
												  ProfileImg
										}
									/>
									<StyledCardContent>
										<StyledCardName>
											{update.name}
										</StyledCardName>
										<StyledCardStatus>
											{update.status &&
											update.status === 'pending'
												? 'Request Pending'
												: 'Request Accepted'}
										</StyledCardStatus>
									</StyledCardContent>
									<StyledCardBtns>
										{update.status &&
										update.status === 'pending' ? (
											<Popup
												trigger={
													<StyledCardBtn
														onClick={() =>
															handleOpenPopup(
																update.id,
																'Are you sure you want to remove?'
															)
														}
														image={Minus}
													/>
												}
												content="Unfriend"
												position="top right"
												mouseEnterDelay={2000}
												style={style}
											/>
										) : null}
									</StyledCardBtns>
								</StyledCard>
							))}
						</>
					) : (
						<StyledCardStatus>No updates</StyledCardStatus>
					)}
				</Tab.Pane>
			),
		},
	];

	const renderResults = ({
		id,
		name,
		image,
		referral_code,
		is_referral_added,
		socialImage,
		is_already_friends,
	}) => {
		return (
			<StyledCard>
				<StyledCardImage
					image={
						image
							? `${API_ENDPOINT_IMAGE}${image}`
							: socialImage || ProfileImg
					}
				/>
				<StyledCardContent>
					<StyledCardName>{name}</StyledCardName>
					<StyledCardStatus>Add as friend</StyledCardStatus>
				</StyledCardContent>
				<StyledCardBtns>
					{!users[id].is_already_friends ? (
						<StyledCardBtn
							onClick={() => handleAddFriend(users[id])}
							image={Plus}
						/>
					) : null}
				</StyledCardBtns>
			</StyledCard>
		);
	};

	return (
		<Container>
			<NavHeader
				title={'Friends'}
				handleCloseModal={props.handleCloseModal}
			/>
			<ContentContainer height={height} width={width}>
				<StyledSearch
					input={{ ref: searchRef }}
					height={height}
					icon={
						value && value.length > 0 ? (
							<Icon
								name="close"
								link
								onClick={handleClearSearch}
								style={{ color: colors.gray, fontWeight: 100 }}
							/>
						) : (
							<Icon
								name="search"
								link
								onClick={handleClearSearch}
								style={{ color: colors.gray, fontWeight: 100 }}
							/>
						)
					}
					placeholder={'Find friends on Bhoozt'}
					loading={loading}
					showNoResults={false}
					noResultsMessage={'No users found'}
					onSearchChange={handleSearchChange}
					onResultSelect={handleResultSelect}
					results={users}
					value={value}
					resultRenderer={renderResults}
					type="text"
				/>
				<StyledErrorWrapper>
					{value.length === 0
						? null
						: value.length > 0 && value.length < 1
						? `Type atleast 1 letters of your friend's name`
						: value.length >= 1 && users.length === 0
						? 'No users found'
						: null}
				</StyledErrorWrapper>
				<StyledTab
					menu={{ attached: 'top' }}
					panes={panes}
					height={height}
				/>
				<StyledFloatingBtn
					height={height}
					width={width}
					onClick={setSearchFocus}
				>
					<StyledFloatingIcon name="add" />
				</StyledFloatingBtn>
				<StyledFooterWrapper>
					<StyledTellFriendsButtonRed
						onClick={handleOpenCreateFunModal}
					>
						Create Fun
					</StyledTellFriendsButtonRed>
					<StyledTellFriendsButton
						onClick={handleOpenShareReferralModal}
					>
						Share
					</StyledTellFriendsButton>
				</StyledFooterWrapper>
				<StyledConfirm
					open={open}
					onCancel={() => handleClosePopup()}
					content={confirmMsg}
					cancelButton="No"
					confirmButton="Yes"
					onConfirm={() =>
						handleConfirm(handleRemoveFriend(selectedId))
					}
				/>
			</ContentContainer>
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</Container>
	);
};

export default Friends;
