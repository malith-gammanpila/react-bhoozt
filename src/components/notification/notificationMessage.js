import React from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { Button } from 'semantic-ui-react';
import { smallScreen, mediumScreen } from '../../utils/media';
import NotifiContainer from '../../containers/notification.container';
import useModal from '../../containers/modal.container';
import { FullscreenModal } from '../common/modal';

const Message = styled.div`
	min-height: 30px;
	margin-bottom: 30px;
	cursor: pointer !important;
	display: flex;
	flex-direction: row;
`;

const Left = styled.div`
	width: 60%;
`;

const Right = styled.div`
	width: 40%;
	padding-right: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const MessageTitle = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  color: ${colors.darkGray}
  font-weight: ${(props) => (props.status === true ? 400 : 800)}
  text-align: left;
`;

const MessageContent = styled(MessageTitle)`
	font-size: 12px;
`;

const StyledButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.green} !important;
	padding: 15px !important;
	width: 100%;
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

const StyledRightButton = styled(StyledButton)`
	box-shadow: 1px 3px 4px ${colors.gray} !important;
	padding: 0 !important;
	text-transform: initial !important;
	@media ${smallScreen} {
		width: 130px;
		height: 35px;
	}
	@media ${mediumScreen} {
		width: 170px;
		height: 45px;
	}
`;

const NotificationMessage = ({
	title,
	content,
	status,
	type,
	data,
	onSelect,
}) => {
	const { handleSayThanks } = NotifiContainer.useContainer();

	const {
		handleOpenShareGrowthGameModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	const handleShareGrowthGame = () => {
		handleOpenShareGrowthGameModal();
	};

	return (
		<Message onClick={onSelect}>
			<Left>
				<MessageTitle status={status}>{title}</MessageTitle>
				<MessageContent status={status}>{content}</MessageContent>
			</Left>
			{type === 'coin_share' ? (
				<Right>
					{data && data.transaction_status === 'pending' ? (
						<StyledRightButton
							onClick={() =>
								handleSayThanks(data.transaction_key)
							}
						>
							Say Thanks
						</StyledRightButton>
					) : null}
				</Right>
			) : type === 'growth' ? (
				<Right>
					<StyledRightButton onClick={() => handleShareGrowthGame()}>
						Share
					</StyledRightButton>
				</Right>
			) : null}
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
				data={data}
			/>
		</Message>
	);
};

export default NotificationMessage;
