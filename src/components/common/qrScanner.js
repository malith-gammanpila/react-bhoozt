import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import GameContainer from '../../containers/game.container';
import QrContainer from '../../containers/qr.container';
import { Column, Row } from '../styles/styles';
import QrReader from 'react-qr-reader';
import { mediumScreen, smallScreen } from '../../utils/media';
import { colors } from '../../utils/colors';

const StyledHeader = styled(Header)`
	text-align: center;
	margin: 0 !important;
	text-transform: uppercase !important;
	color: ${colors.darkGreen} !important;
	@media ${smallScreen} {
		font-size: 12px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const StyledMainHeader = styled(StyledHeader)`
	text-transform: uppercase !important;
	font-weight: 400 !important;
	padding: 20px 10px !important;
	@media ${smallScreen} {
		font-size: 18px !important;
	}
	@media ${mediumScreen} {
		font-size: 20px !important;
	}
`;

const StyledSubHeader = styled(StyledMainHeader)`
	text-transform: capitalize !important;
	@media ${smallScreen} {
		font-size: 16px !important;
	}
	@media ${mediumScreen} {
		font-size: 18px !important;
	}
`;

const StyledContent = styled(StyledSubHeader)`
	text-transform: none !important;
	@media ${smallScreen} {
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
`;

const QrScanner = () => {
	const { setGameId } = GameContainer.useContainer();
	const {
		isQrVisible,
		handleCloseQrModal,
		setResult,
		setError,
		validated,
		msg,
		gameId,
	} = QrContainer.useContainer();

	useEffect(() => {
		gameId ? setGameId(gameId) : setGameId();
	}, [gameId]);

	return (
		<>
			<Row>
				<Column>
					{validated ? null : (
						<QrReader
							delay={500}
							onError={(e) => setError(e)}
							onScan={(r) => setResult(r)}
							showViewFinder={false}
							style={{ width: '100%', height: '200' }}
						/>
					)}
				</Column>
			</Row>
			<Row>
				<Column>
					<StyledContent>{`${msg || 'Scanning..'}`}</StyledContent>
				</Column>
			</Row>
		</>
	);
};

export default QrScanner;
