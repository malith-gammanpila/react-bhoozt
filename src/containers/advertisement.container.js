import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import { bhooztAds } from '../database/bhoozt_defaults.data';
import { AdImpressions, AdClick } from '../api/calls/analytics.api';
import HomeContainer from './home.container';
import AnalyticContainer from './analytic.container';

const useAdvertisement = () => {
	const { settings } = HomeContainer.useContainer();
	const { mpAdClick } = AnalyticContainer.useContainer();

	const [ads, setAds] = useState([]);
	const [advertisements, setAdvertisements] = useState('');
	const [gameAds, setGameAds] = useState([]);

	useEffect(() => {
		fetchAdvertisement();
	}, []);

	const fetchAdvertisement = async () => {
		const response = await bhooztAds();
		if (response !== null && response.length > 0) {
			setAds(response);
		}
	};

	useEffect(() => {
		// Loop Advertisements
		const loadAds = async () => {
			if (settings !== undefined && settings !== null) {
				var currentAdIndex = 0;
				var interval =
					(settings.advertisement_changing_interval !== undefined &&
					settings.advertisement_changing_interval > 0
						? settings.advertisement_changing_interval
						: 5) * 1000;
				while (currentAdIndex !== ads.length) {
					setAdvertisements(ads[currentAdIndex]);
					currentAdIndex =
						currentAdIndex === ads.length - 1
							? 0
							: (currentAdIndex += 1);
					await sleep(interval);
				}
			}
		};
		loadAds();
	}, [ads, settings]);

	useEffect(() => {
		// Count Impression
		const impressionCount = ads.map((ad) => ({
			ad_id: ad.id,
			impressions: ad.id === advertisements.id ? 1 : 0,
		}));
		adImpression(impressionCount);
	}, [advertisements, ads]);

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Analytics - Ads Impressions
	const adImpression = async (impression) => {
		await AdImpressions(JSON.stringify(impression));
	};

	// Analytics - Ads Click
	const handleClickAd = async (adId) => {
		await AdClick(adId);

		//Mixpanel analytics
		const allAds = [...ads, ...gameAds];
		let index = allAds.findIndex((ad) => ad.id === adId);
		let ad = allAds[index];
		console.log(ad);
		if (ad && ad.id && ad.title && ad.url && ad.game_id) {
			mpAdClick(ad.id, ad.title, ad.url, true);
		} else if (ad && ad.id && ad.title && ad.url) {
			mpAdClick(ad.id, ad.title, ad.url, false);
		}
	};

	return {
		fetchAdvertisement,
		advertisements,
		handleClickAd,
		setGameAds,
		gameAds,
		sleep,
		adImpression,
	};
};

const AdvertisementContainer = createContainer(useAdvertisement);

export default AdvertisementContainer;
