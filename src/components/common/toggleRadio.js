import React from 'react';
import styled from 'styled-components';

const StyledRadio = styled.div`
  padding: 25px 0px 0px 5px; !important;
  float: right;

  .switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 14px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #bababa;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 21px;
    width: 21px;
    left: -4px;
    bottom: -3.5px;
    background-color: #52cbbe;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #bceee8;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #bceee8;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(21px);
    -ms-transform: translateX(21px);
    transform: translateX(21px);
  }
`;

const ToggleRadio = ({ check, onChange }) => {
	return (
		<StyledRadio>
			<label className="switch">
				<input type="checkbox" checked={check} onChange={onChange} />
				<span className="slider"></span>
			</label>
		</StyledRadio>
	);
};

export default ToggleRadio;
