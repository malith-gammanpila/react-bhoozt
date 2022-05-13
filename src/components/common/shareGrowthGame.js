import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
	FacebookShareButton,
	FacebookMessengerShareButton,
	FacebookMessengerIcon,
	LinkedinShareButton,
	TwitterShareButton,
	PinterestShareButton,
	VKShareButton,
	OKShareButton,
	TelegramShareButton,
	WhatsappShareButton,
	RedditShareButton,
	EmailShareButton,
	TumblrShareButton,
	LivejournalShareButton,
	MailruShareButton,
	ViberShareButton,
	WorkplaceShareButton,
	LineShareButton,
	WeiboShareButton,
	PocketShareButton,
	InstapaperShareButton,
	FacebookIcon,
	TwitterIcon,
	LinkedinIcon,
	PinterestIcon,
	VKIcon,
	OKIcon,
	TelegramIcon,
	WhatsappIcon,
	RedditIcon,
	TumblrIcon,
	MailruIcon,
	EmailIcon,
	LivejournalIcon,
	ViberIcon,
	WorkplaceIcon,
	LineIcon,
	PocketIcon,
	InstapaperIcon,
	WeiboIcon,
} from 'react-share';
import { FullscreenModal } from './modal';
import { Modal, Container, Button } from 'semantic-ui-react';
import NavHeader from './navHeader';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { largeScreen, smallScreen } from '../../utils/media';
import { colors } from '../../utils/colors';
import HomeContainer from '../../containers/home.container';
import AnalyticContainer from '../../containers/analytic.container';
import useModal from '../../containers/modal.container';

const URL = process.env.REACT_APP_URL;

const StyledContainer = Styled(Container)`
  height: ${(props) => props.height}px;
  padding-right: 1px;
`;

const StyledWrapper = Styled.div`
  margin: 0 auto 0 auto !important;
  @media ${largeScreen} {
    border-left: 0.2px solid ${colors.darkGray};
    border-right: 0.2px solid ${colors.darkGray};
  }
  max-width: 800px !important;
  height: 100%;
`;

const StyledNavHeader = Styled(NavHeader)`
@media ${smallScreen} {
	padding-left: 0px !important;
	backgroung-color: red;
}
`;

const StyledContentContainer = Styled.div`
  &&& {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 80%;
    overflow-y: scroll;
  }
`;

const StyledBtnContainer = Styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-basis: 33%
  height: 100px;
  align-self: flex-start;
`;

const StyledCopyToClipboard = Styled(CopyToClipboard)`

`;

const StyledCopyBtn = Styled(Button)`
	flex-basis: 100%
	height:50px;
	@media ${smallScreen} {
		margin-left: 10px !important;
		margin-right: 10px !important;
	}
	@media ${largeScreen} {
		margin-left: 100px !important;
		margin-right: 100px !important;
	}
`;

const ShareGrowthGame = (props) => {
	const { height, width } = useWindowDimensions();
	const { user } = HomeContainer.useContainer();
	const { mpTellFriends } = AnalyticContainer.useContainer();

	const [referral, setReferral] = useState();
	const [referralMsg, setReferralMsg] = useState();
	const [title, setTitle] = useState();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		console.log('props:', props.data.link);
	}, [props]);

	useEffect(() => {
		setCopied(false);
		setReferral(
			`${props.data.link}&ref=${
				user && user.referral_code ? user.referral_code : null
			}`
		);
		setReferralMsg(
			`${props.data.link}&ref=${
				user && user.referral_code ? user.referral_code : null
			}`
		);
	}, []);

	useEffect(() => {
		if (referral) {
			setTitle(
				`Use this referral to play Bhoozt ${props.data.link}&ref=${
					user && user.referral_code ? user.referral_code : null
				}`
			);
		}
	}, [referral]);

	const onCopy = () => {
		setCopied(true);
		mpTellFriends('Copy Link');
	};

	return (
		<StyledContainer width={width} height={height}>
			<StyledWrapper>
				<StyledNavHeader
					title={'Share'}
					handleCloseModal={props.handleCloseModal}
				/>
				<StyledContentContainer>
					<StyledBtnContainer>
						<FacebookShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Facebook')}
						>
							<FacebookIcon size={32} round />
							<p>Facebook</p>
						</FacebookShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<LinkedinShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Linkedin')}
						>
							<LinkedinIcon size={32} round />
							<p>LinkedIn</p>
						</LinkedinShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<FacebookMessengerShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Messenger')}
						>
							<FacebookMessengerIcon size={32} round />
							<p>Messenger</p>
						</FacebookMessengerShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<TwitterShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Tweeter')}
						>
							<TwitterIcon size={32} round />
							<p>Twitter</p>
						</TwitterShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<ViberShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Viber')}
						>
							<ViberIcon size={32} round />
							<p>Viber</p>
						</ViberShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<WhatsappShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('WhatsApp')}
						>
							<WhatsappIcon size={32} round />
							<p>WhatsApp</p>
						</WhatsappShareButton>
					</StyledBtnContainer>
					<StyledBtnContainer>
						<EmailShareButton
							url={referralMsg}
							quote={title}
							onClick={() => mpTellFriends('Email')}
						>
							<EmailIcon size={32} round />
							<p>Email</p>
						</EmailShareButton>
					</StyledBtnContainer>
					{/* {copied ? null : ( */}
					<StyledCopyToClipboard text={referral}>
						<StyledCopyBtn
							onClick={() => onCopy()}
							disabled={copied}
						>
							Copy Link
						</StyledCopyBtn>
					</StyledCopyToClipboard>
					{/* )} */}
				</StyledContentContainer>
			</StyledWrapper>
		</StyledContainer>
	);
};

export default ShareGrowthGame;
