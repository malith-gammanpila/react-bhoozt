import React from 'react';
import styled from 'styled-components';

import { Column, Row } from '../styles/styles';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import InfoModal from './infoModal';
import GameContainer from '../../containers/game.container';
import Moment from 'moment';

const InfoContainer = styled(Row)`
	align-items: center !important;
	@media ${smallScreen} {
		height: 30px;
	}
	@media ${mediumScreen} {
		height: 35px;
	}
`;

const Label = styled.p`
	text-transform: capitalize;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 12px;
	}
	@media ${mediumScreen} {
		font-size: 14px;
	}
`;

const GrandPrizeLable = styled(Label)`
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 16px;
	}
`;

const StyledLabel = styled(Label)`
	background-color: ${colors.darkGray};
	padding: 3px 10px;
	width: 60px;
	border-radius: 15px;
	color: ${colors.white};
`;

const GameInfo = () => {
	const { isLoaded, game, isWon } = GameContainer.useContainer();

	const remainDates = expire => {
		const today = Moment(new Date());
		const expireDate = Moment(expire);
		const remainDays = expireDate.diff(today, 'days');
		if (remainDates !== null) {
			return remainDays;
		} else {
			return '0';
		}
	};

	const calGrandPrice = grandPrize => {
		if (grandPrize >= 1000) {
			return `Win ${grandPrize / 1000}K`;
		} else if (grandPrize >= 100) {
			return `Win ${grandPrize}`;
		} else return '';
	};

	return (
		<InfoContainer>
			<Column width={2}></Column>
			<Column width={2}>
				<InfoModal />
			</Column>
			<Column width={8}>
				<GrandPrizeLable>
					{isLoaded &&
					game.grand_prize &&
					!isWon &&
					game.remaining_grand_prizes > 0
						? calGrandPrice(game.grand_prize)
						: ` `}
				</GrandPrizeLable>
			</Column>
			<Column width={4}>
				<StyledLabel>
					{isLoaded && game.expire_at
						? `${remainDates(game.expire_at)}D`
						: `0D`}
				</StyledLabel>
			</Column>
		</InfoContainer>
	);
};

export default GameInfo;
