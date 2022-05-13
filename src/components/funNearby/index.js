import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Confirm } from 'semantic-ui-react';

import { mediumScreen, smallScreen } from '../../utils/media';
import { keyFrame } from './KeyFrames';
import { Container } from '../styles/styles';
import NavHeader from '../common/navHeader';
import Kokopo from '../../assets/images/kk-bird.png';
import Logo from '../../assets/images/small-logo.svg';
import { colors } from '../../utils/colors';

import { FindGeoGames } from '../../api/calls/geo.api';

import useWindowDimensions from '../../hooks/windowDimention.hook';
import { usePosition } from '../../containers/position.container';
import messages from '../../containers/messages.container';
import useRoute from '../../hooks/route.hook';
import HomeContainer from '../../containers/home.container';
import GameContainer from '../../containers/game.container';
import AnalyticContainer from '../../containers/analytic.container';

const FunContainer = styled.div`
	margin: 0 auto;
	padding: 25px 0px;
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 50}px`};
	}
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 77}px`};
	}
`;

const StyledBackground = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	@media ${smallScreen} {
		margin-top: ${(props) => `${props.height / 2 - 50}px`} !important;
	}
	@media ${mediumScreen} {
		margin-top: ${(props) => `${props.height / 2 - 75}px`} !important;
	}
	height: -webkit-fill-available;
`;

const StyledCenter = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
`;
const StyledCenter2 = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
	animation-delay: -0.5s;
`;
const StyledCenter3 = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
	animation-delay: -1s;
`;
const StyledCenter4 = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
	animation-delay: -1.5s;
`;
const StyledCenter5 = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
	animation-delay: -2s;
`;
const StyledCenter6 = styled.div`
	background-color: transparent;
	width: 2em;
	height: 2em;
	border-radius: 50%;
	position: absolute;
	animation: ${keyFrame} 3s ease-in infinite;
	animation-delay: -2.5s;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${Logo}) !important;
`;

const StyledGame = styled.div`
	height: 3.5em;
	width: 3.5em;
	z-index: 1000;
	cursor: pointer !important;
	position: absolute;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${Kokopo}) !important;
	margin-left: ${(props) => props.randLeft}px !important;
	margin-top: ${(props) => props.randTop}px !important;
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

const FunNearby = ({ handleCloseModal }) => {
	const { latitude, longitude, error } = usePosition();
	const { notifySuccess, notifyError } = messages();
	const { setGameId } = GameContainer.useContainer();
	const { mpSearchGeoGames } = AnalyticContainer.useContainer();
	const { height, width } = useWindowDimensions();
	const [geoGames, setGeoGames] = useState();
	const [coords, setCoords] = useState([]);
	const { handleRedirect } = useRoute();
	const {
		handleGeoGameCode,
		setTempGameId,
		closeAllPopups,
		setCloseAllPopups,
		handleGameClick,
	} = HomeContainer.useContainer();

	const [open, setOpen] = useState(false);
	const [loaded, setloaded] = useState(false);
	const [game, setGame] = useState();

	useEffect(() => {
		console.log('OPEN', open); // DEBUG
	}, [open]);

	useEffect(() => {
		if (closeAllPopups === true) {
			setCloseAllPopups(false);
			handleCloseModal();
		}
	}, [closeAllPopups]);

	useEffect(() => {
		if (latitude && longitude && !error && loaded === false) {
			console.log(latitude, longitude);
			getGeoGames(latitude, longitude);
		}
	}, [latitude, longitude, error]);

	const handleConfirm = (func) => {
		setOpen(false);
	};

	const handleClosePopup = () => {
		console.log('triggerd..');
		setGame(null);
		setOpen(false);
	};

	/**
	 * Generate random integer within a range
	 */
	const getRandomInt = () => {
		let limit = width <= height ? width : height;
		let min = Math.ceil(-limit / 3);
		let max = Math.floor(limit / 3);
		let rand = 0;
		do {
			rand = Math.floor(Math.random() * (max - min + 1)) + min;
		} while (rand < -100 && rand > 100);
		return rand;
	};

	/**
	 * Fetch geotagged games
	 * @param {number} latitude
	 * @param {number} longitude
	 */
	const getGeoGames = async (latitude, longitude) => {
		const [code, response] = await FindGeoGames(latitude, longitude);
		if (code >= 300) {
			setTimeout(() => {
				notifyError(response.message);
			}, 3000);

			// Mixpanel analytics
			mpSearchGeoGames(0, 'Failure');
		} else if (code === 200) {
			console.log(response);
			setloaded(true);
			if (response.content && response.content.games) {
				notifySuccess(response.message);
				setGeoGames(response.content.games);
				response.content.games.forEach((element) => {
					let x = getRandomInt();
					let y = getRandomInt();
					setCoords((coords) => [...coords, { x: x, y: y }]);
				});

				// Mixpanel analytics
				mpSearchGeoGames(response.content.games.length, 'Success');
			} else {
				notifyError(response.message);

				// Mixpanel analytics
				mpSearchGeoGames(0, 'Try Again');
			}
		}
	};

	/**
	 * Handle tap confirm
	 * @param {Object} g
	 */
	const handleTapGame = (g) => {
		handleGeoGameCode(g.game_code).then((id) => {
			handleGameClick(id);
			setTempGameId(id);
			setGameId(id);
			setTimeout(() => {
				handleRedirect('/game');
			}, 500);
		});
		handleCloseModal();
	};

	const handleOpen = (game) => {
		setGame(game);
		setOpen(true);
	};

	const Radar = () => {
		return (
			<StyledCenter>
				<StyledCenter2>
					<StyledCenter3>
						<StyledCenter4>
							<StyledCenter5>
								<StyledCenter6 />
							</StyledCenter5>
						</StyledCenter4>
					</StyledCenter3>
				</StyledCenter2>
			</StyledCenter>
		);
	};

	return (
		<Container>
			<NavHeader title={'Map'} handleCloseModal={handleCloseModal} />
			<FunContainer height={height}>
				<StyledBackground height={height}>
					{geoGames && coords.length === geoGames.length
						? geoGames.map((g, index) => (
								<StyledGame
									randLeft={coords[index].x}
									randTop={coords[index].y}
									onClick={() => handleOpen(g)}
								></StyledGame>
						  ))
						: null}
					<Radar />
				</StyledBackground>
				<StyledConfirm
					open={open}
					onCancel={() => handleClosePopup()}
					content={`Play Now?`}
					cancelButton="Later"
					confirmButton="Yes"
					onConfirm={() => handleConfirm(handleTapGame(game))}
				/>
			</FunContainer>
		</Container>
	);
};

export default FunNearby;
