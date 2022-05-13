import React from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { mediumScreen, smallScreen } from '../../utils/media';
import { colors } from '../../utils/colors';
import Close from '../../assets/images/close.svg';
import Back from '../../assets/images/back.svg';
import Profile from '../../assets/images/user_image.svg';
import Facebook from '../../assets/images/facebook-icon.png';
import Google from '../../assets/images/google-icon.png';

const StyledRectButton = styled(Button)`
  color: ${(props) =>
		props.backgroundcolor === colors.white
			? colors.darkGray
			: colors.white} !important;
  border: 1px solid ${(props) =>
		props.backgroundcolor === colors.white
			? colors.lightGray
			: colors.white} !important;
  margin: 5px auto !important;
  font-weight: 400 !important;
  background-color: ${(props) => props.backgroundcolor}!important;
  @media ${smallScreen} {
    width: ${(props) => (props.width === undefined ? '300px' : props.width)};

    font-size: 16px !important;
  }
  @media ${mediumScreen} {
    width: ${(props) => (props.width === undefined ? '500px' : props.width)}
    font-size: 20px !important;
  }
`;

const ButtonIcon = styled.div`
	position: relative;
	bottom: 20px;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) =>
		props.image === 'facebook'
			? Facebook
			: props.image === 'google'
			? Google
			: ''}) !important;
	width: 20px;
	height: 20px;
	@media ${smallScreen} {
		bottom: 16px;
		left: 15px;
	}
	@media ${mediumScreen} {
		left: 90px;
	}
`;

const ButtonText = styled.div`
	position: relative;
	height: 20px;
`;

const StyledCloseButton = styled(Button)`
	float: right;
	background-color: transparent !important;
	border-radius: 50%;
	padding: 0 !important;
	@media ${smallScreen} {
		margin-right: 0px !important;
		margin-top: 0px !important;
		width: 20px;
		height: 20px;
	}
	@media ${mediumScreen} {
		margin-right: 0px !important;
		margin-top: 0px !important;
		width: 30px;
		height: 30px;
	}
`;

const CloseButtonImage = styled.div`
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${Close}) !important;
	@media ${smallScreen} {
		width: 20px;
		height: 20px;
	}
	@media ${mediumScreen} {
		width: 30px;
		height: 30px;
	}
`;

const StyledBackButton = styled(Button)`
	background-position: left !important;
	background-repeat: no-repeat !important;
	background-size: auto !important;
	background-image: url(${Back}) !important;
	float: left;
	background-color: transparent !important;
	@media ${smallScreen} {
		width: 24px;
		height: 24px;
		margin-top: 3px !important;
	}
	@media ${mediumScreen} {
		width: 30px;
		height: 30px;
		margin-top: 10px !important;
	}
	border-radius: 50%;
	margin-left: 10px !important;
`;

const StyledUploadButton = styled(Button)`
	margin: 20px 0 20px 0 !important;
	background-color: transparent !important;
	border-radius: 50%;
	@media ${smallScreen} {
		width: 90px;
		height: 90px;
	}
	@media ${mediumScreen} {
		width: 130px;
		height: 130px;
	}
`;

const UploadButtonImage = styled.div`
	position: relative;
	bottom: 10px;
	right: 20px;
	background-repeat: no-repeat;
	background-size: cover;
	background-image: url(${(props) => (props.image ? props.image : Profile)});
	border-radius: 50%;
	@media ${smallScreen} {
		width: 90px;
		height: 90px;
	}
	@media ${mediumScreen} {
		width: 130px;
		height: 130px;
	}
`;

const RectangularButton = ({
	type,
	label,
	color,
	onRedirect,
	width,
	disabled,
}) => {
	return (
		<StyledRectButton
			width={width}
			backgroundcolor={color}
			onClick={onRedirect}
			disabled={disabled}
		>
			<ButtonText>
				{label}
				<ButtonIcon image={type} />
			</ButtonText>
		</StyledRectButton>
	);
};

const CloseButton = ({ onRedirect }) => {
	return (
		<StyledCloseButton onClick={onRedirect}>
			<CloseButtonImage />
		</StyledCloseButton>
	);
};

const BackButton = ({ onRedirect }) => {
	return <StyledBackButton onClick={onRedirect} />;
};

const ImageUploadButton = ({ onRedirect, imageUrl }) => {
	let content;
	if (imageUrl && imageUrl.length > 0) {
		content = <UploadButtonImage image={imageUrl} />;
	} else {
		content = <UploadButtonImage />;
	}

	return (
		<StyledUploadButton onClick={onRedirect}>{content}</StyledUploadButton>
	);
};

const StyledRoundButton = styled(Button)`
	background-color: transparent !important;
	width: 120px;
	height: 120px;
	border-radius: 50% !important;
	margin: 0 auto !important;
`;

const ButtonImage = styled.div`
	background-repeat: no-repeat;
	background-size: cover;
	position: relative;
	right: 20px;
	bottom: 10px;
	background-image: url(${(props) => props.image}) !important;
	@media ${smallScreen} {
		width: 140px;
		height: 90px;
	}
	@media ${mediumScreen} {
		width: 190px;
		height: 122px;
	}
`;

const StyledImageButton = styled(Button)`
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: cover !important;
	background-image: url(${(props) => props.image}) !important;
	background-color: transparent !important;
	box-shadow: 1px 5px 10px ${colors.gray} !important;
	@media ${smallScreen} {
		border-radius: 10px !important;
		width: 140px;
		height: 90px;
	}
	@media ${mediumScreen} {
		border-radius: 20px !important;
		width: 235px;
		height: 150px;
	}
`;

const NewStyledImageButton = styled(Button)`
	border: 5px solid yellow;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${(props) => props.image}) !important;
	background-color: transparent !important;
	height: 100%;
	width: 100%;
	max-width: 40px;
`;

const NewStyledImageButtonBig = styled(Button)`
	border: 5px solid yellow;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-image: url(${(props) => props.image}) !important;
	background-color: transparent !important;
	height: 100%;
	width: 100%;
	max-width: 70px;
`;

const ImageButton = ({ onRedirect, image, disabled }) => {
	return (
		<StyledImageButton
			onClick={onRedirect}
			image={image}
			disabled={disabled}
		/>
	);
};

const NewImageButton = ({ onRedirect, image, disabled }) => {
	return (
		<NewStyledImageButton
			onClick={onRedirect}
			image={image}
			disabled={disabled}
		/>
	);
};

const NewImageButtonBig = ({ onRedirect, image, disabled }) => {
	return (
		<NewStyledImageButtonBig
			onClick={onRedirect}
			image={image}
			disabled={disabled}
		/>
	);
};

const RoundedButton = () => {
	return (
		<StyledRoundButton>
			<ButtonImage />
		</StyledRoundButton>
	);
};

export {
	RectangularButton,
	ImageButton,
	CloseButton,
	BackButton,
	ImageUploadButton,
	StyledRoundButton,
	ButtonImage,
	RoundedButton,
	NewImageButton,
	NewImageButtonBig,
};
