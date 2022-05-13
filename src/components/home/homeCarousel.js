import React from 'react';
import { CarouselProvider } from 'pure-react-carousel';
import styled from 'styled-components';

import HomeContainer from '../../containers/home.container';
import { Container, StyledContent, StyledFooter } from '../styles/styles';
import Header from '../common/header';
import Ticker from '../common/ticker';
import { Advertisement, GameAdvertisement } from '../common/advertisements';
import Footer from '../common/footer';
import CarouselIndicator from '../common/carouselIndicators';
import CarouselHOC from './carouselHOC';
import GamePhaseContent from './gamePhaseContent';
import Hamburger from '../../assets/images/hamburger.svg';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { SubRoutes } from '../../routes';
import GameInfo from '../game/gameInfo';
import GameContainer from '../../containers/game.container';
import Tutorial from '../common/tutorial';
import { useEffect } from 'react';

const StyledCarouselProvider = styled(CarouselProvider)`
	// background-color: rgba(0, 0, 0, 0.3);
	width: ${(props) => props.width}px !important;
`;

const HomeCarousel = (props) => {
	const {
		header,
		showGamePhase,
		path,
		infoVisible,
	} = HomeContainer.useContainer();
	const { height, width } = useWindowDimensions();

	return (
		<GameContainer.Provider>
			<Container height={height}>
				<StyledCarouselProvider
					naturalSlideWidth={1}
					naturalSlideHeight={1}
					totalSlides={3}
					width={width}
				>
					{(() => {
						if (
							showGamePhase === true ||
							path === '/game' ||
							path === '/paypal'
						) {
							return (
								<Header
									title={header}
									// image={Back}
									action={'back'}
								/>
							);
						} else if (path === '/forward') {
							return (
								<Header
									title={header}
									// image={Back}
									action={'goBack'}
								/>
							);
						} else {
							return (
								<Header
									title={header}
									image={Hamburger}
									action={'sidebar'}
								/>
							);
						}
					})()}

					<>
						<Ticker />
						<StyledContent height={height} path={path}>
							{showGamePhase === true ? (
								<GamePhaseContent />
							) : (
								<SubRoutes />
							)}
						</StyledContent>
						<StyledFooter>
							{path === '/game' ? (
								<GameAdvertisement />
							) : (
								<Advertisement />
							)}
							{path === '/game' &&
							header === 'game' &&
							infoVisible ? (
								<GameInfo />
							) : null}

							{/* Load Tutorial Modals */}
							<Tutorial />
							<Footer infoVisible={infoVisible} />
							{showGamePhase === false &&
							path !== '/game' &&
							path !== '/redeem' &&
							path !== '/paypal' &&
							path !== '/forward' ? (
								<CarouselIndicator slides={3} />
							) : (
								''
							)}
						</StyledFooter>
						<CarouselHOC />
					</>
				</StyledCarouselProvider>
			</Container>
		</GameContainer.Provider>
	);
};

export default HomeCarousel;
