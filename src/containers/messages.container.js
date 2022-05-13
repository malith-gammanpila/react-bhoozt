import { Slide, toast } from 'react-toastify';

const messages = () => {
	const notifyError = (text) => {
		toast.dismiss();
		toast.error(text, {
			autoClose: 3000,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifyLongError = (text) => {
		toast.dismiss();
		toast.error(text, {
			autoClose: 6000,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifySuccess = (text) => {
		toast.dismiss();
		toast.success(text, {
			autoClose: 3000,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifyProgress = (text) => {
		toast.dismiss();
		toast.info(text, {
			autoClose: false,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifyTryAgain = (text) => {
		toast.dismiss();
		toast.warn(text, {
			autoClose: false,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifyGameWon = (text) => {
		setTimeout(() => {
			toast.dismiss();
		}, 5000);
		toast(text, {
			autoClose: false,
			draggable: false,
			position: 'top-center',
			hideProgressBar: true,
			transition: Slide,
			closeButton: false,
			closeOnClick: false,
		});
	};

	const notifyForceDismiss = () => toast.dismiss();

	return {
		notifyError,
		notifyLongError,
		notifySuccess,
		notifyProgress,
		notifyForceDismiss,
		notifyTryAgain,
		notifyGameWon,
	};
};

export default messages;
