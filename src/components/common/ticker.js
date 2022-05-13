import React from 'react';
import styled from 'styled-components';

import { colors } from '../../utils/colors';
import { mediumScreen, smallScreen } from '../../utils/media';
import HomeContainer from '../../containers/home.container';

const TickerContent = styled.marquee`
	padding: 10px;
	height: 30px;
	whitespace: 'wrap';
	overflow-x: 'auto';
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 20px;
	}
`;

const Ticker = () => {
	const { tickers } = HomeContainer.useContainer();
	const screenWidth = window.innerWidth >= 768 ? 800 : window.innerWidth;

	const tickerData = () => {
		if (tickers && tickers.length > 0) {
			return tickers.map((item, index) => {
				if (index === tickers.length - 1) {
					return (
						<span key={index} style={{ display: 'inline' }}>
							{item.text}
						</span>
					);
				} else {
					return (
						<span
							key={index}
							style={{ display: 'inline', marginRight: screenWidth }}
						>
							{item.text}
						</span>
					);
				}
			});
		}
	};

	const marqueeHolder = () => {
		if (tickers && tickers.length > 0) {
			return <TickerContent>{tickerData()}</TickerContent>;
		} else {
			return <></>;
		}
	};

	return <>{marqueeHolder()}</>;
};

export default Ticker;
