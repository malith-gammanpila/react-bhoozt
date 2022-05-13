import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { smallScreen, mediumScreen } from '../../utils/media';
import { colors } from '../../utils/colors';

const StyledInput = styled(Input)`
	height: 43px;
	margin: 5px auto;
	width: 100%;
	color: ${colors.gray} !important;
	font-size: 16px !important;
	&&.ui.input > input {
		color: ${colors.darkGray} !important;
		border: 0.5px solid ${colors.gray} !important;
	}
	-webkit-text-fill-color: ${colors.darkGray}; /* Override iOS / Android font color change */
	-webkit-opacity: 1; /* Override iOS opacity change affecting text & background color */
	color: ${colors.darkGray}; /* Override IE font color change */
	border: 0.5px solid transparent;
`;

const StyledLabel = styled.p`
  text-align: left;
  color: ${colors.darkGreen}
  margin-top: 0px;
  margin-bottom: 0px!important;
  width: 100%;
  @media ${smallScreen} {
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    font-size: 16px !important;
  }
`;

const InputField = ({
	placeholder,
	label,
	type,
	name,
	value,
	disabled,
	onChange,
	onClick,
	maxLength,
	defaultValue,
}) => {
	return (
		<>
			<StyledLabel>{label}</StyledLabel>
			<StyledInput
				placeholder={placeholder}
				type={type}
				name={name}
				value={value}
				disabled={disabled}
				onChange={onChange}
				onClick={onClick}
				maxLength={maxLength}
				defaultValue={defaultValue}
			/>
		</>
	);
};

export { InputField };
