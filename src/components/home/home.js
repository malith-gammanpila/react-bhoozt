import React, { useEffect } from 'react';

import HomeContainer from '../../containers/home.container';
import profileContainer from '../../containers/profile.container';
import SidebarMenu from './sidebar';
import { SquareModal } from '../common/modal';
import GameContainer from '../../containers/game.container';
import TutorialContainer from '../../containers/tutorial.container';
import { messaging } from '../../push-notification';
import { FCMToken } from '../../database/bhoozt_defaults.data';
import { BhooztFirebaseRegistration } from '../../api/calls/push.api';
import PushContainer from '../../containers/push.container';
import MetaTags from 'react-meta-tags';

const Home = (props) => {
	const { handleMsgData, setPushData } = PushContainer.useContainer();

	useEffect(() => {
		if (props.location.search !== '') {
			setPushData(getParamsFromUrl(props.location.search));
		}
		messaging &&
			messaging
				.requestPermission()
				.then(async function () {
					let token = await FCMToken();
					if (token == null || token.length === 0) {
						const token = await messaging.getToken();
						await BhooztFirebaseRegistration(token);
						console.log('FCM Token', token);
					} else {
						console.log('FCM Token', await FCMToken());
					}
				})
				.catch(function (err) {
					console.log('Unable to get permission to notify.', err);
				});

		// Push message listener
		// navigator.serviceWorker.addEventListener('message', (message) => {
		// 	if (message.data) {
		// 		handleMsgData(message.data);
		// 	}
		// });
	}, []);

	const getParamsFromUrl = (url) => {
		url = decodeURI(url);
		if (typeof url === 'string') {
			let params = url.split('?');
			let eachParamsArr = params[1].split('&');
			let obj = {};
			if (eachParamsArr && eachParamsArr.length) {
				eachParamsArr.map((param) => {
					let keyValuePair = param.split('=');
					let key = keyValuePair[0];
					let value = keyValuePair[1];
					obj[key] = value;
				});
			}
			return obj;
		}
	};

	return (
		<>
			<MetaTags>
				<meta
					name="description"
					content="Here is a link to a bit of fun. See if you can solve this."
				/>
			</MetaTags>
			<HomeContainer.Provider>
				<profileContainer.Provider>
					<GameContainer.Provider>
						<TutorialContainer.Provider>
							<SidebarMenu />
							<SquareModal />
						</TutorialContainer.Provider>
					</GameContainer.Provider>
				</profileContainer.Provider>
			</HomeContainer.Provider>
		</>
	);
};

export default Home;
