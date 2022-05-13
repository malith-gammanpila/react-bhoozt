import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';
import { Row, Column, MainHeader } from '../styles/styles';
import { BackButton } from './button';
import useRoute from '../../hooks/route.hook';

const NavHeading = styled(MainHeader)`
	color: ${colors.darkGreen};
	@media ${smallScreen} {
		padding: 0px 0px 0px 0px !important;
	}
	@media ${mediumScreen} {
		padding: 0px 10px 10px 10px;
	}
`;

const StyledRow = styled(Row)`
	padding: 10px !important;
`;

const StyledColumn = styled(Column)`
	text-align: left;
`;

const NavHeader = props => {
	const { handleRedirect } = useRoute();

	return (
		<>
			<StyledRow>
				<StyledColumn
					mobile={1}
					tablet={1}
					computer={1}
					onClick={
						props.handleCloseModal
							? () => props.handleCloseModal()
							: props.onRedirect
							? () => handleRedirect('/login') // TODO
							: null
					}
				>
					<BackButton
					// onRedirect={
					// 	props.handleCloseModal
					// 		? () => props.handleCloseModal()
					// 		: props.onRedirect
					// 		? () => handleRedirect('/login') // TODO
					// 		: null
					// }
					/>
				</StyledColumn>
				<Column width={14}>
					<NavHeading>{props.title}</NavHeading>
				</Column>
				<Column width={1}></Column>
			</StyledRow>
		</>
	);
};

NavHeader.propTypes = {
	title: PropTypes.string.isRequired,
};

export default NavHeader;
