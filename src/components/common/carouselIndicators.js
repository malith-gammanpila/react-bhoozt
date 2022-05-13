import React from 'react';
import PropTypes from 'prop-types';
import { Dot } from 'pure-react-carousel';
import styled from 'styled-components';

import { colors } from '../../utils/colors';
import HomeContainer from '../../containers/home.container';

const Button = styled.button`
	width: 7px;
	height: 7px;
	background-color: ${props =>
		props.status === 'active' ? colors.darkGray : colors.lightGray};
	border: none;
	border-radius: 50%;
	padding: 0;
	margin-left: 2px;
	margin-right: 2px;
	// display: flex;
	// flex-direction: row;
	// align-items: center;
	// justify-content: center;
`;

const CarouselIndicator = ({ slides }) => {
	const { slide: currentSlide } = HomeContainer.useContainer();
	return (
		<>
			{[...Array(slides).keys()].map(slide => (
				<Button
					as={Dot}
					key={slide}
					status={slide === currentSlide ? 'active' : ''}
					slide={slide}
				/>
			))}
		</>
	);
};

CarouselIndicator.propTypes = {
	slides: PropTypes.number.isRequired,
};

export default CarouselIndicator;
