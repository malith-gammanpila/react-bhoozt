import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Container } from '../styles/styles';
import NavHeader from '../common/navHeader';
import NotificationMessage from './notificationMessage';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import { smallScreen, mediumScreen } from '../../utils/media';
import NotifiContainer from '../../containers/notification.container';

const NotificationContainer = styled.div`
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 51}px`};
	}
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 68}px`};
	}
	margin: 0 auto;
	padding: 25px 35px;
`;

const Notification = (props) => {
	const { height } = useWindowDimensions();
	const {
		notificationHistory,
		handleClick,
		fetchNotificationHistory,
	} = NotifiContainer.useContainer();

	useEffect(() => {
		fetchNotificationHistory();
	}, []);

	return (
		<>
			<Container>
				<NavHeader
					title={'Notifications'}
					handleCloseModal={props.handleCloseModal}
				/>
				<NotificationContainer height={height}>
					{notificationHistory.map((notification) => (
						<NotificationMessage
							key={notification.notification_id}
							title={notification.title}
							content={notification.message}
							status={notification.is_read}
							type={notification.type}
							data={notification.data}
							onSelect={() =>
								handleClick(notification.notification_id)
							}
						/>
					))}
				</NotificationContainer>
			</Container>
		</>
	);
};

export default Notification;
