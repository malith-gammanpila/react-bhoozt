import React from 'react';
import styled from 'styled-components';
import { Card } from 'semantic-ui-react';

import { ButtonImage } from '../common/button';
import { smallScreen, mediumScreen } from '../../utils/media';
import { colors } from '../../utils/colors';
import { Column, Row } from '../styles/styles';
import userRoute from '../../hooks/route.hook';
import Moment from 'moment';
import Logo from '../../assets/images/small-logo.svg';
import Friends from '../../assets/images/friends.svg';
import GameContainer from '../../containers/game.container';
import messages from '../../containers/messages.container';
import TutorialContainer from '../../containers/tutorial.container';
import NetworkContainer from '../../containers/network.container';

const StyledCard = styled(Card)`
	margin: 0 auto !important;
	@media ${smallScreen} {
		width: 100% !important;
	}
	@media ${mediumScreen} {
		width: 100% !important;
	}
	margin-bottom: 10px !important;
	box-shadow: none !important;
	border: 0.5px solid ${colors.green} !important;
	cursor: pointer;
`;

const StyledImage = styled(ButtonImage)`
	bottom: 0px;
	border-radius: 50%;
	background-color: ${colors.lightGray};
	// background-image: url(${(props) => props.image}) !important;
	@media ${smallScreen} {
		left: 5px;
		width: 55px;
		height: 55px;
	}
	@media ${mediumScreen} {
		left: 20px;
		width: 60px;
		height: 60px;
	}
`;

const StyledLabelContainer = styled.div`
	display: flex;
	align-items: center !important;
	@media ${smallScreen} {
		justify-content: flex-end;
		height: 30px;
	}
	@media ${mediumScreen} {
		justify-content: center;
		height: 30px;
	}
	background-image: url(${(props) => props.image}) !important;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
`;

const StyledLabel = styled.p`
background-color: ${(props) =>
	props.type === 'left'
		? colors.darkGray
		: props.type === 'red'
		? colors.red
		: colors.green};
padding: 3px 15px;
border-radius: 15px;
min-width: 65px;
color: ${colors.white}
font-weight: 300;
@media ${smallScreen} {
  font-size: 14px !important;
}
@media ${mediumScreen} {
  font-size: 16px !important;
}
`;

const StyledRow = styled(Row)`
	align-items: center !important;
`;

const API_ENDPOINT_IMAGE = process.env.REACT_APP_API_ENDPOINT_IMAGE;

const GameListCard = ({
	logo,
	expire_at,
	pieces,
	game,
	onSelect,
	gameType,
	is_friend_game,
}) => {
	const { handleRedirect } = userRoute();
	const { setGameId } = GameContainer.useContainer();
	const { setIsPublic } = TutorialContainer.useContainer();
	const { notifyError } = messages();
	const { isOnline } = NetworkContainer.useContainer();

	const logoColSizeMobile = is_friend_game ? 4 : 8;
	const logoColSizetablet = is_friend_game ? 10 : 12;
	const logoColSizeLaptop = is_friend_game ? 10 : 12;

	// console.log('Game:', game.id); // DEBUG

	const remainDates = (expire) => {
		const today = Moment(new Date());
		const expireDate = Moment(expire);
		const remainDays = expireDate.diff(today, 'days');
		if (remainDates !== null) {
			return remainDays;
		} else {
			return '0';
		}
	};

	const handleRouteGame = () => {
		if (isOnline) {
			setGameId(game.id);
			if (
				game.pieces_info.player_game_piece_count > 0 ||
				!game.is_public
			) {
				handleRedirect(`/game`);
				onSelect();
				setIsPublic(gameType);
			} else {
				notifyError('Click MORE on home page to win more pieces');
			}
		} else {
			notifyError('Please check your internet connection');
		}
	};

	return (
		<StyledCard>
			<Card.Content onClick={() => handleRouteGame()}>
				<StyledRow>
					<Column
						mobile={logoColSizeMobile}
						tablet={logoColSizetablet}
						computer={logoColSizeLaptop}
					>
						<StyledImage
							image={logo ? `${API_ENDPOINT_IMAGE}${logo}` : Logo}
						/>
					</Column>
					{is_friend_game ? (
						<Column mobile={4} tablet={2} computer={2}>
							<StyledLabelContainer
								image={Friends}
							></StyledLabelContainer>
						</Column>
					) : null}
					<Column mobile={4} tablet={2} computer={2}>
						<StyledLabelContainer>
							<StyledLabel type={'left'}>{`${remainDates(
								expire_at
							)}D`}</StyledLabel>
						</StyledLabelContainer>
					</Column>
					<Column mobile={4} tablet={2} computer={2}>
						<StyledLabelContainer>
							<StyledLabel type={'right'}>
								{pieces ? pieces : ''}
							</StyledLabel>
						</StyledLabelContainer>
					</Column>
				</StyledRow>
			</Card.Content>
		</StyledCard>
	);
};

export default GameListCard;
