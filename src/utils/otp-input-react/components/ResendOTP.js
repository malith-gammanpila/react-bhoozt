import React from 'react';
import PropTypes from 'prop-types';
import useResendOTP from '../hooks/resendOTP';

function ResendOTP({ renderTime, renderButton, style, className, ...props }) {
	const { remainingTime, handelResendClick } = useResendOTP(props);
	return (
		<div
			className={className || ''}
			data-testid="otp-resend-root"
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				backgroundColor: 'Transparent',
				border: 'none',
				cursor: 'pointer',
				outline: 'none',
				margin: '10px 0px',
				...style,
			}}
		>
			{renderButton ? (
				renderButton({
					disabled: remainingTime !== 0,
					onClick: handelResendClick,
					remainingTime,
				})
			) : (
				<button
					style={{
						backgroundColor: 'Transparent',
						border: 'none',
						cursor: 'pointer',
						outline: 'none',
						color: 'rgb(93, 115, 115)',
						...style,
					}}
					disabled={remainingTime !== 0}
					onClick={handelResendClick}
				>
					{remainingTime > 0 ? `Retry (${remainingTime}s)` : `Retry`}
				</button>
			)}
		</div>
	);
}

ResendOTP.defaultProps = {
	maxTime: 60,
	timeInterval: 1000,
	style: {},
};

ResendOTP.propTypes = {
	onTimerComplete: PropTypes.func,
	onResendClick: PropTypes.func,
	renderTime: PropTypes.func,
	renderButton: PropTypes.func,
	maxTime: PropTypes.number,
	timeInterval: PropTypes.number,
	style: PropTypes.object,
	className: PropTypes.string,
};

export default ResendOTP;
