import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { capitalizeFirst } from '../utils/capitalizer';

const useAnalytic = () => {
	const [userData, setUserData] = useState();

	var mixpanel = require('mixpanel-browser');

	mixpanel.init(
		`${process.env.REACT_APP_MIXPANEL_API_TOKEN}`,
		{
			api_host: `${process.env.REACT_APP_MIXPANEL_API_HOST}`,
		},
		''
	);

	// Set updated user profile on userData change
	useEffect(() => {
		mpSetUserData();
	}, [userData]);

	// Init user
	const mpUserInit = (userData) => {
		if (userData && userData !== []) {
			mixpanel.identify(Number(userData.id));
			mixpanel.register({
				$distinct_id: Number(userData.id),
				'User Role': capitalizeFirst(userData.user_role) || 'Anonumous',
			});
		}
	};

	// Set profile data
	const mpSetUserData = () => {
		if (userData && userData !== []) {
			mixpanel.identify(Number(userData.id));
			mixpanel.people.set({
				$distinct_id: Number(userData.id),
				$email: userData.email || '',
				$name: userData.name || '',
				$avatar:
					`${process.env.REACT_APP_API_ENDPOINT_IMAGE}${userData.image}` ||
					userData.socialImage,
				Provider: capitalizeFirst(userData.provider) || '',
				Karma: Number(userData.karma_points),
				Sex: capitalizeFirst(userData.sex),
				'User Role': capitalizeFirst(userData.user_role) || 'Anonumous',
				'Available Coins': Number(userData.available_coins) || 0,
				'Email Verified': userData.is_email_confirmed || false,
				'Phone Verified': userData.is_otp_confirmed || false,
				'PayPal Verified': userData.isPayPalConfirmed || false,
				'Referral Added': userData.is_referral_added || false,
				'Date of Birth':
					userData.date_of_birth || '2020-01-01T00:00:00Z',
			});
			mixpanel.register({
				$distinct_id: Number(userData.id),
				'User Role': capitalizeFirst(userData.user_role) || 'Anonumous',
			});
		}
	};

	// Track BhooztMe button tap
	// Status = "Success" | "Failure" | "Try Again"
	const mpBhooztMeButtonTap = (status) => {
		mixpanel.track('Bhoozt Me', {
			Status: capitalizeFirst(status),
		});
	};

	// Track tell friends
	// 'Sharing Platform' = "Facebook" | "Linkedin" | "Messenger" | "Tweeter" | "Viber" | "WhatsApp" | "Email" | "Copy Link"
	const mpTellFriends = (platform) => {
		mixpanel.track('Tell Friends', {
			'Sharing Platform': capitalizeFirst(platform),
		});
	};

	// Track notifications
	// 'ID' = 123
	// 'Type' = "Geo_game" | "Coin_share" | "Thank_you" | "Rollback" | "Instant_prize" | "Circle"
	const mpReadNotification = (id, type) => {
		mixpanel.track('Notification Read', {
			ID: Number(id),
			Type: capitalizeFirst(type),
		});
	};

	// Set notification count
	// 'All Notifications' = 123
	// 'New Notifications' = 10
	const mpSetNotoficationCount = (totalCount, newCount) => {
		if (userData && userData !== []) {
			mixpanel.identify(Number(userData.id));
			mixpanel.people.set({
				'All Notifications': Number(totalCount),
				'New Notifications': Number(newCount),
			});
		}
	};

	// Track game clicks
	// 'ID' = 123
	// 'Title' = "Test Game 1"
	// 'Logo' = "IMAGE_BASE_URL+logo_path"
	// 'Public' = true | false
	// 'Sponsor ID' = 123
	// 'Sponsor Name' = "John Doe"
	const mpGameClick = (id, title, logo, isPublic, sponsorId, sponsorName) => {
		mixpanel.track('Game Click', {
			ID: Number(id),
			Title: capitalizeFirst(title),
			Logo: `${process.env.REACT_APP_API_ENDPOINT_IMAGE}${logo}` || '',
			Public: isPublic,
			'Sponsor ID': sponsorId,
			'Sponsor Name': sponsorName,
		});
	};

	// Track Send friend request
	const mpSendFriendRequest = () => {
		mixpanel.track('Send Friend Request');
	};

	// Track withdraw friend request / remove friend
	const mpWithdrawFriendRequest = () => {
		mixpanel.track('Withdraw Friend Request');
	};

	// Track accept friend request
	const mpAcceptFriendRequest = () => {
		mixpanel.track('Accept Friend Request');
	};

	// Set friendship count
	// 'All Friends' = 123
	// 'Friend Requests Received' = 123
	// 'Friend Requests Sent' = 123
	const mpSetFriendshipCount = (friendsCount, receivedCount, sentCount) => {
		if (userData && userData !== []) {
			mixpanel.identify(Number(userData.id));
			mixpanel.people.set({
				'All Friends': Number(friendsCount),
				'Friend Requests Received': Number(receivedCount),
				'Friend Requests Sent': Number(sentCount),
			});
		}
	};

	// Track PayPal button tap
	const mpTapPayPal = () => {
		mixpanel.track('Tap PayPal');
	};

	// Track Pay Forward button tap
	const mpTapPayForward = () => {
		mixpanel.track('Tap PayForward');
	};

	// Track Redeem via PayPal button tap
	// 'Total Coins' = 123
	// 'Requested Coins' = 12
	// Status = "Success" | "Insufficient Coins" | "No PayPal Email" | "Not Eligible"
	const mpRedeemViaPayPal = (coins, requestedCoins, status) => {
		mixpanel.track('Redeem Via PayPal', {
			'Total Coins': coins,
			'Requested Coins': requestedCoins,
			Status: status,
		});
	};

	// Track Share via PayForward button tap
	// 'Total Coins' = 123
	// 'Shared Coins' = 12
	// Status = "Success" | "Insufficient Coins" | "No PayPal Email" | "Not Eligible" | "No Users" | "Wrong Amount"
	const mpShareViaPayForward = (coins, sharedCoins, status) => {
		mixpanel.track('Share Via PayForward', {
			'Total Coins': coins,
			'Shared Coins': sharedCoins,
			Status: status,
		});
	};

	// Track unlock games
	// 'Game ID' = 123
	// 'Game Title' = "Test Game Abc"
	// Status = "Success" | "Failure"
	const mpUnlockGame = (id, title, status) => {
		if (id && title) {
			mixpanel.track('Game Unlock', {
				'Game ID': id,
				'Game Title': title,
				Status: status,
			});
		} else {
			mixpanel.track('Game Unlock', {
				Status: status,
			});
		}
	};

	// Track ad clicks
	// 'ID' = 123
	// 'Title' = "Sample Ad"
	// 'Url' = "http://example.com"
	// 'Game Ad' = true | false
	const mpAdClick = (id, title, url, isGameAd) => {
		mixpanel.track('Ad Click', {
			ID: id,
			Title: title,
			Url: url,
			'Game Ad': isGameAd,
		});
	};

	// Track Back to BhooztMe tap
	// 'Game ID: 123
	// 'Title': "Sample Game"
	const mpBackToBooztMe = (id, title) => {
		mixpanel.track('Back To Bhoozt Me', {
			'Game ID': id,
			Title: title,
		});
	};

	// Track Bhoozt Me Pvt tab
	// 'Game ID: 123
	// 'Title': "Sample Game"
	// Status = "Success" | "Failure" | "Try Again"
	const mpBhooztMePvtButtonTap = (id, title, status) => {
		mixpanel.track('Bhoozt Me Pvt', {
			'Game ID': id,
			Title: title,
			Status: capitalizeFirst(status),
		});
	};

	// Track Private Game share link create tap
	// 'Game ID: 123
	// 'Title': "Sample Game"
	// Status = "Success" | "Failure"
	const mpSharePvtGame = (id, title, status) => {
		mixpanel.track('Share Pvt Game', {
			'Game ID': id,
			Title: title,
			Status: status,
		});
	};

	// Track search geo games
	// 'Game Count' = 123
	// Status = "Success" | "Failure" | "Try Again"
	const mpSearchGeoGames = (gameCount, status) => {
		mixpanel.track('Search Geo Games', {
			'Game Count': gameCount,
			Status: status,
		});
	};

	return {
		setUserData,
		mpUserInit,
		mpBhooztMeButtonTap,
		mpBhooztMePvtButtonTap,
		mpTellFriends,
		mpReadNotification,
		mpSetNotoficationCount,
		mpGameClick,
		mpSendFriendRequest,
		mpWithdrawFriendRequest,
		mpAcceptFriendRequest,
		mpSetFriendshipCount,
		mpTapPayPal,
		mpRedeemViaPayPal,
		mpTapPayForward,
		mpShareViaPayForward,
		mpUnlockGame,
		mpAdClick,
		mpBackToBooztMe,
		mpSharePvtGame,
		mpSearchGeoGames,
	};
};

const AnalyticContainer = createContainer(useAnalytic);

export default AnalyticContainer;
