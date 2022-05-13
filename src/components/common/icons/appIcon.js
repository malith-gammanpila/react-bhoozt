import React from 'react';
import styled from 'styled-components';
import IconsCss from './iconsCss';

const IconStyled = styled.i`
	&:before {
		font-family: 'fontello';
		font-style: normal;
		font-weight: normal;
		speak: none;
		display: inline-block;
		text-decoration: inherit;
		width: 1em;
		margin-right: 0.2em;
		text-align: center;
		/* opacity: .8; */
		/* For safety - reset parent styles, that can break glyph codes*/
		font-variant: normal;
		text-transform: none;
		/* fix buttons height, for twitter bootstrap */
		line-height: 1em;
		/* Animation center compensation - margins should be symmetric */
		/* remove if not needed */
		margin-left: 0.2em;
		/* you can be more comfortable with increased icons size */
		/* font-size: 120%; */
		/* Font smoothing. That was taken from TWBS */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* Uncomment for 3D effect */
		/* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
	}
`;

export const AppIcon = ({ className }) => {
	return (
		<div css={IconsCss}>
			<IconStyled className={className} />
		</div>
	);
};
