import React from 'react';
import styled from 'styled-components';

import { CenteredContainer } from '../styles/styles';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import useWindowDimensions from '../../hooks/windowDimention.hook';

const StyledCenteredContainer = styled(CenteredContainer)`
	@media ${smallScreen} {
		height: ${(props) =>
			props.height - 230 - 60 - 10 - 80 + 50 - 20}px !important;
		min-height: ${(props) => `${props.height - 360}px`};
	}
	@media ${mediumScreen} {
		height: ${(props) =>
			props.height - 230 - 60 - 10 - 80 - 15}px !important;
		min-height: ${(props) => `${props.height - 400}px`};
	}
`;

const Heading = styled.p`
	margin: 0 auto;
	padding: 0 0 20px 0;
	font-weight: 600;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 20px;
	}
	@media ${mediumScreen} {
		font-size: 24px;
	}
`;

const Description = styled.p`
	margin: 0 auto;
	padding: 0 0 10px 0;
	width: 250px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 12px;
	}
	@media ${mediumScreen} {
		font-size: 16px;
	}
`;

const GameWinContent = ({ msg, grandPrizeCoins }) => {
	const { height } = useWindowDimensions();

	return (
		<StyledCenteredContainer height={height}>
			<Heading>Congratulations</Heading>
			{grandPrizeCoins > 0 ? (
				<Description>
					{`You just won ${grandPrizeCoins} coins. YEAH!`}
				</Description>
			) : null}
			<Description>{`${msg}`}</Description>
		</StyledCenteredContainer>
	);
};

export default GameWinContent;
