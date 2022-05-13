import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isAndroid } from 'react-device-detect';
import Loading from '../../assets/images/bhoozt_loading.png';
import useLoader from '../../containers/loader.container';
import useRoute from '../../hooks/route.hook';
import { MasterData, TutorialScreens } from '../../api/calls/masterdata.api';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import PushContainer from '../../containers/push.container';
import { RectangularButton } from './button';
import { colors } from '../../utils/colors';

const LoaderWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => `${props.height}px`}
  width: 100vw;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
	right: 0;
	flex-direction: column;
`;

const Title = styled.p`
	font-size: 18px;
	text-align: center;
	color: ${colors.darkGray};
	padding: 25px 0;
	margin-bottom: 0;
`;

const StyledPrompt = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const Loader = (props) => {
	const { isUserAvailable } = useLoader();
	const { handleRedirect } = useRoute();
	const { height } = useWindowDimensions();
	const { setPushData } = PushContainer.useContainer();
	const [isPromptVisible, setIsPromptVisible] = useState(false);

	useEffect(() => {
		if (props.location.search !== '') {
			setPushData(getParamsFromUrl(props.location.search));
		}

		handleOpenPrompt();
	}, [props]);

	// useEffect(() => {
	// 	setTimeout(async function () {
	// 		if (await isUserAvailable()) {
	// 			await MasterData();
	// 			TutorialScreens();
	// 			handleRedirect(`/play`);
	// 		} else {
	// 			handleRedirect(`/login`);
	// 		}
	// 	}, 2000);
	// }, []);

	const handlePlayHere = async () => {
		if (await isUserAvailable()) {
			await MasterData();
			TutorialScreens();
			handleRedirect(`/play`);
		} else {
			handleRedirect(`/login`);
		}
	};

	const handleDownloadApp = (e) => {
		// handleRedirect(`https://bhooztapp.page.link/play`);
		e.preventDefault();
		window.location.href = 'https://bhooztapp.page.link/play';
	};

	const handleOpenPrompt = () => {
		setTimeout(() => {
			if (props.location.search === '' && isAndroid) {
				setIsPromptVisible(true);
			} else {
				handlePlayHere();
			}
		}, 2000);
	};

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
		<LoaderWrapper heigh={height}>
			{!isPromptVisible ? (
				<img
					src={Loading}
					alt="Loading"
					style={{ height: '110px', width: '240px' }}
				/>
			) : (
				<StyledPrompt>
					<img
						src={Loading}
						alt="Loading"
						style={{ height: '110px', width: '240px' }}
					/>
					<Title>Do you want to continue</Title>
					<RectangularButton
						width={'100%'}
						label={'In Browser'}
						color={colors.green}
						onRedirect={handlePlayHere}
					/>
					<RectangularButton
						width={'100%'}
						label={'Download App'}
						color={colors.red}
						onRedirect={(e) => {
							handleDownloadApp(e);
						}}
					/>
				</StyledPrompt>
			)}
		</LoaderWrapper>
	);
};

export default Loader;
