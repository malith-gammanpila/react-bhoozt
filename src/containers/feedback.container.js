import { useState } from 'react';
import { AppFeedback } from '../api/calls/feedback.api';
import messages from '../containers/messages.container';

const useFeedbackModal = () => {
	const { notifyError, notifySuccess } = messages();

	const [isShow, setIsShow] = useState(false);
	const [message, setMessage] = useState('');

	const handleOpenFeedback = () => {
		setIsShow(true);
	};

	const handleChange = (e) => {
		e.preventDefault();
		setMessage(e.target.value);
	};

	const handleCloseFeedback = () => (isShow ? setIsShow(false) : null);

	const handleSubmitFeedback = async () => {
		if (message !== '') {
			const [code, res] = await AppFeedback(message);
			if (code >= 300) {
				// notifyError(
				// 	res && res.message !== undefined
				// 		? res.message
				// 		: 'Something Went Wrong'
				// );
			} else {
				if (res && res.status === 1) {
					notifySuccess(
						res.message !== undefined
							? res.message
							: '"Your feedback is appreciated"'
					);
				}
			}
		}
	};

	return {
		isShow,
		message,
		handleOpenFeedback,
		handleCloseFeedback,
		handleChange,
		handleSubmitFeedback,
	};
};

export default useFeedbackModal;
