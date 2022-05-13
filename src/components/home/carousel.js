import React, { useEffect } from 'react';
import { Slider, Slide } from 'pure-react-carousel';
import styled from 'styled-components';

import { smallScreen, mediumScreen } from '../../utils/media';
import HomeContent from './homeContent';
import CoinContent from './coinContent';
import SponsorsContent from './sponsersContent';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import HomeContainer from '../../containers/home.container';

const StyledSlider = styled(Slider)`
	// border-style: solid;
	// border-color: red;
	// border-width: 0.5px;
	// @media ${smallScreen} {
	// 	height: ${props => `${props.height - 270}px`};
	// }
	// @media ${mediumScreen} {
	// 	height: ${props => `${props.height - 320}px`};
	// }
	@media ${smallScreen} {
		height: ${props => `${props.height - 230 - 10}px`};
	}
	@media ${mediumScreen} {
		height: ${props => `${props.height - 270 - 10}px`};
	}
`;

const StyledSponsorsContent = styled(SponsorsContent)`
	background-color: red !important;
`;

const CardCarousel = props => {
	const { setPath } = HomeContainer.useContainer();
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		setPath(props.location.pathname);
	}, [props.location.pathname]);

	return (
		<>
			<StyledSlider height={height} width={width}>
				<Slide tag="a" index={0}>
					<HomeContent />
				</Slide>
				<Slide tag="a" index={1}>
					<StyledSponsorsContent />
				</Slide>
				<Slide tag="a" index={2} style={{ paddingBottom: 0.03 }}>
					<CoinContent />
				</Slide>
			</StyledSlider>
		</>
	);
};

export default CardCarousel;
