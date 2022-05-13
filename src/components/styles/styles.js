import styled from 'styled-components';
import { Grid, Modal } from 'semantic-ui-react';

import { smallScreen, mediumScreen, largeScreen } from '../../utils/media';
import { colors } from '../../utils/colors';

const Container = styled.div`
	display: flex;
	flex-direction: column !important;
	max-width: 800px;
	margin: auto;
	height: ${(props) => `${props.height}px`};
	min-height: 200px;
	text-align: center;
	@media ${largeScreen} {
		border-left: 0.2px solid ${colors.darkGray};
		border-right: 0.2px solid ${colors.darkGray};
	}
`;

const StyledGrid = styled(Grid)`
	margin-top: 0 !important;
`;

const StyledColumn = styled(Grid.Column)`
	padding-bottom: 10px !important;
`;

const StyledFooter = styled.div`
	max-width: 800px;
`;

const StyledContent = styled.div`
	max-width: 800px;
	// background-color: rgba(0, 255, 0, 0.3);
	@media ${smallScreen} {
		height: ${(props) =>
			`${
				props.path === '/game' ? props.height - 270 : props.height - 255
			}px`};
	}
	@media ${mediumScreen} {
		height: ${(props) =>
			`${
				props.path === '/game' ? props.height - 315 : props.height - 295
			}px`};
	}
`;

const Row = styled(Grid)`
	margin: 0 !important;
`;
const Column = styled(Grid.Column)`
	padding: 0px !important;
`;

const CenteredContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	@media ${smallScreen} {
		height: ${(props) => `${props.height - 240}px`};
	}
	@media ${mediumScreen} {
		height: ${(props) => `${props.height - 280}px`};
	}
`;

const MainHeader = styled.h1`
	font-weight: 400;
	color: ${colors.green};
	text-align: center;
	margin: 0px !important;
	text-transform: uppercase;
	@media ${smallScreen} {
		padding: 20px 10px 10px 10px;
		font-size: 24px !important;
	}
	@media ${mediumScreen} {
		padding: 50px 10px 10px 10px;
		font-size: 36px !important;
	}
`;

const StyledModal = styled(Modal)`
	@media ${smallScreen} {
		width: 300px !important;
	}
	@media ${mediumScreen} {
		width: 400px !important;
	}
`;

export {
	Container,
	StyledGrid,
	StyledColumn,
	StyledFooter,
	StyledContent,
	Row,
	Column,
	CenteredContainer,
	MainHeader,
	StyledModal,
};
