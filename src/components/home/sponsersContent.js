import React from 'react';
import styled from 'styled-components';

import { smallScreen, mediumScreen } from '../../utils/media';
import HomeContainer from '../../containers/home.container';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import GameListCard from './gameListCard';
import NetworkContainer from '../../containers/network.container';
import messages from '../../containers/messages.container';
import AnalyticContainer from '../../containers/analytic.container';

const CardContainer = styled.div`
	overflow-y: auto;
	margin-left: 20px;
	margin-right: 20px;
	::-webkit-scrollbar {
		width: 0 !important;
	}

	@media ${smallScreen} {
		height: ${(props) => `${props.height - 230 - 10}px`};
	}
	@media ${mediumScreen} {
		height: ${(props) => `${props.height - 270 - 10}px`};
	}
`;

const SponsorsContent = () => {
	const { height } = useWindowDimensions();
	const {
		games,
		handleGameClick,
		setPuzzleSize,
	} = HomeContainer.useContainer();
	const { isOnline } = NetworkContainer.useContainer();
	const { notifyError } = messages();

	const handleClick = (id, size) => {
		if (isOnline) {
			setPuzzleSize(size);
			handleGameClick(id);
		} else {
			notifyError('Please check your internet connection');
		}
	};

	return (
		<CardContainer height={height}>
			{games.map((game) => (
				<GameListCard
					key={game.id}
					logo={game.logo}
					expire_at={game.expire_at}
					pieces={game.pieces_info.out_of_text}
					onSelect={() => handleClick(game.id, game.puzzle_size)}
					gameType={game.is_public}
					is_friend_game={game.is_frind_game}
					game={game}
				/>
			))}
		</CardContainer>
	);
};

export default SponsorsContent;
