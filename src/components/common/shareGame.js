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
import GameContainer from '../../containers/game.container';
import { CreatePvtGameInvitation } from '../../api/calls/game.api';
import messages from '../../containers/messages.container';
import AnalyticContainer from '../../containers/analytic.container';

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

const StyledFullContentContainer = Styled(StyledContentContainer)`
	height: 100%;
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

const StyledCreateLinkBtn = Styled(StyledCopyBtn)`
	margin-top: auto !important;
	margin-bottom: auto !important;
`;

const ShareGame = (props) => {
	const { height, width } = useWindowDimensions();
	const { user } = HomeContainer.useContainer();
	const { mpSharePvtGame } = AnalyticContainer.useContainer();
	const { notifyError, notifySuccess } = messages();
	const { gameId, game } = GameContainer.useContainer();
	const [referral, setReferral] = useState();
	const [referralMsg, setReferralMsg] = useState();
	const [title, setTitle] = useState();
	const [copied, setCopied] = useState(false);
	const [isBusy, setIsBusy] = useState(false);

	useEffect(() => {
		if (referral) {
			setTitle(
				`Use this game invitation link to play Bhoozt ${referral}`
			);
			setReferralMsg(`${referral}`);
		}
	}, [referral]);

	const onCopy = () => {
		setCopied(true);
	};

	const handleCreateInvitation = async (gameId) => {
		setIsBusy(true);
		const [status, data] = await CreatePvtGameInvitation(gameId);

		if (status >= 300) {
			notifyError(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Something went wrong'
			);
			setIsBusy(false);

			// Mixpanel analytics
			if (game && game.title) {
				mpSharePvtGame(gameId, game.title, 'Failure');
			}
		} else {
			setReferral(data.content.link || '');
			notifySuccess(
				data && data.message !== undefined && data.message.length > 0
					? data.message
					: 'Game invitation created successfully'
			);
			setIsBusy(false);

			// Mixpanel analytics
			if (game && game.title) {
				mpSharePvtGame(gameId, game.title, 'Success');
			}
		}
	};

	return (
		<StyledContainer width={width} height={height}>
			<StyledWrapper>
				<StyledNavHeader
					title={'Invite To Game'}
					handleCloseModal={props.handleCloseModal}
				/>
				{referral && referral.length > 0 ? (
					<StyledContentContainer>
						<StyledBtnContainer>
							<FacebookShareButton
								url={referralMsg}
								quote={title}
							>
								<FacebookIcon size={32} round />
								<p>Facebook</p>
							</FacebookShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<LinkedinShareButton
								url={referralMsg}
								quote={title}
							>
								<LinkedinIcon size={32} round />
								<p>LinkedIn</p>
							</LinkedinShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<FacebookMessengerShareButton
								url={referralMsg}
								quote={title}
							>
								<FacebookMessengerIcon size={32} round />
								<p>Messenger</p>
							</FacebookMessengerShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<TwitterShareButton url={referralMsg} quote={title}>
								<TwitterIcon size={32} round />
								<p>Twitter</p>
							</TwitterShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<ViberShareButton url={referralMsg} quote={title}>
								<ViberIcon size={32} round />
								<p>Viber</p>
							</ViberShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<WhatsappShareButton
								url={referralMsg}
								quote={title}
							>
								<WhatsappIcon size={32} round />
								<p>WhatsApp</p>
							</WhatsappShareButton>
						</StyledBtnContainer>
						<StyledBtnContainer>
							<EmailShareButton url={referralMsg} quote={title}>
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
				) : (
					<StyledFullContentContainer>
						<StyledCopyToClipboard text={referral}>
							<StyledCreateLinkBtn
								onClick={() => handleCreateInvitation(gameId)}
								disabled={isBusy}
							>
								Create Invitation Link
							</StyledCreateLinkBtn>
						</StyledCopyToClipboard>
					</StyledFullContentContainer>
				)}
			</StyledWrapper>
		</StyledContainer>
	);
};

export default ShareGame;
