import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import AdvertisementContainer from '../../containers/advertisement.container';
import HomeContainer from '../../containers/home.container';

const AdvertisementContent = styled.a`
	margin: 30px auto;
	padding: 10px 10px;
	width: 250px;
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 12px;
	}
	@media ${mediumScreen} {
		font-size: 16px;
	}
	&:hover {
		color: ${colors.darkGreen};
	}
`;

const StyledAd = styled.p`
	margin-bottom: 0;
`;

const StyledAdSpaceFill = styled.div`
	@media ${smallScreen} {
		height: 95px;
	}
	@media ${mediumScreen} {
		height: 110px;
	}
`;

const Advertisement = () => {
	const {
		advertisements,
		handleClickAd,
		fetchAdvertisement,
	} = AdvertisementContainer.useContainer();

	useEffect(() => {
		fetchAdvertisement();
	}, []);

	// TODO bring general ad loop function (from container) to here to stop looping in background

	return (
		<AdvertisementContent
			href={advertisements ? advertisements.url : null}
			target="_blank"
			onClick={() =>
				handleClickAd(advertisements ? advertisements.id : null)
			}
		>
			<StyledAd>{advertisements ? advertisements.title : ''}</StyledAd>
			<StyledAd>
				{advertisements ? advertisements.description : ''}
			</StyledAd>
			<StyledAd>
				{advertisements ? advertisements.url_display_text : ''}
			</StyledAd>
		</AdvertisementContent>
	);
};

const GameAdvertisement = () => {
	const { settings } = HomeContainer.useContainer();
	const {
		gameAds,
		handleClickAd,
		sleep,
		adImpression,
	} = AdvertisementContainer.useContainer();

	const [gameAdvertisements, setGameAdvertisements] = useState('');

	/**
	 * Loop game ads
	 */
	useEffect(() => {
		let inter = null;
		const loadGameAds = async () => {
			if (settings !== undefined && settings !== null) {
				var interval =
					(settings.advertisement_changing_interval !== undefined &&
					settings.advertisement_changing_interval > 0
						? settings.advertisement_changing_interval
						: 5) * 1000;

				var currentGameAdIndex = 0;
				// TODO
				const setAdss = async () => {
					setGameAdvertisements(gameAds[currentGameAdIndex]);
					currentGameAdIndex =
						currentGameAdIndex === gameAds.length - 1
							? 0
							: (currentGameAdIndex += 1);
					await sleep(interval);
				};

				inter = setInterval(setAdss, interval);
			}
		};

		loadGameAds();
		return () => {
			clearInterval(inter);
		};
	}, [gameAds, settings]);

	useEffect(() => {
		// Count Impression
		const impressionCount = gameAds.map((ad) => ({
			ad_id: ad.id,
			impressions: ad.id === gameAdvertisements.id ? 1 : 0,
		}));
		adImpression(impressionCount);
	}, [gameAdvertisements, gameAds]);

	return gameAds.length > 0 ? (
		<AdvertisementContent
			href={gameAdvertisements ? gameAdvertisements.url : null}
			target="_blank"
			onClick={() =>
				handleClickAd(gameAdvertisements ? gameAdvertisements.id : null)
			}
		>
			<StyledAd>
				{gameAdvertisements ? gameAdvertisements.title : ''}
			</StyledAd>
			<StyledAd>
				{gameAdvertisements ? gameAdvertisements.description : ''}
			</StyledAd>
			<StyledAd>
				{gameAdvertisements ? gameAdvertisements.url_display_text : ''}
			</StyledAd>
		</AdvertisementContent>
	) : (
		<StyledAdSpaceFill />
	);
};

export { Advertisement, GameAdvertisement };
