import React from 'react';
import styled from 'styled-components';
import { TextArea } from 'semantic-ui-react';
import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';

const StyledTextArea = styled(TextArea)`
	width: 100%;
	border-radius: 5px;
	border-color: ${colors.lightGray};
	resize: none;
	color: ${colors.darkGreen};
	padding: 10px;
	@media ${smallScreen} {
		min-height: 150px;
		margin-bottom: 15px;
	}
	@media ${mediumScreen} {
		min-height: 160px;
		margin-bottom: 20px;
	}
`;

const TextAreaField = ({ placeholder, name, value, onChange }) => {
	return (
		<>
			<StyledTextArea
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
		</>
	);
};

export { TextAreaField };
