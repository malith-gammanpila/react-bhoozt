import React from 'react';
import styled from 'styled-components';
import { Select } from 'semantic-ui-react';

import { colors } from '../../utils/colors';
import { smallScreen, mediumScreen } from '../../utils/media';

const StyledSelect = styled(Select)`
	min-height: 43px;
	margin: 5px auto;
	min-width: 100% !important;
	@media ${smallScreen} {
		font-size: 15px !important;
	}
	@media ${mediumScreen} {
		font-size: 16px !important;
	}
	&&&.ui.selection.dropdown {
		color: ${colors.darkGray} !important;
		border: 0.5px solid ${colors.gray} !important;
	}
	&&&.ui.selection.active.dropdown .menu {
		border: 0.5px solid ${colors.gray} !important;
	}
`;

const StyledLabel = styled.p`
  text-align: left;
  color: ${colors.darkGreen}
  margin-bottom: 0px !important;
  width: 100%;
  @media ${smallScreen} {
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    font-size: 16px !important;
  }
`;
const SelectField = ({
	label,
	type,
	name,
	value,
	options,
	disabled,
	onChange,
	placeholder,
	defaultValue,
}) => {
	return (
		<>
			<StyledLabel>{label}</StyledLabel>
			<StyledSelect
				options={options}
				disabled={disabled}
				onChange={onChange}
				placeholder={placeholder}
				name={name}
				label={label}
				defaultValue={defaultValue}
			/>
		</>
	);
};

export default SelectField;
