/* eslint-disable react/no-array-index-key */
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Star from '../UI/Star/Star';
import SendButton from '../UI/SendButton/SendButton';
import styles from './StarRating.module.css';
import { REACT_APP_SITE_KEY } from '../../utils/constants';

export default function StarRating({
	numTotalStars,
	initialRating,
	closePopup,
}) {
	const dispatch = useDispatch();

	function getColor(isUserHovering, i, numSelectedStars, numHoveringStars) {
		const threshold = isUserHovering ? numHoveringStars : numSelectedStars;
		return i < threshold ? 'yellow' : 'grey';
	}

	const recaptcha = useRef();
	const [numSelectedStars, setNumSelectedStars] = useState(initialRating);
	const [numHoveringStars, setNumHoveringStars] = useState(null);
	const [isUserHovering, setIsUserHovering] = useState(false);
	const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

	const isButtonActive = numSelectedStars > 0 && isCaptchaVerified;

	async function submitForm(event) {
		event.preventDefault();
		const captchaValue = recaptcha.current.getValue();
		if (!captchaValue) {
			alert('Пожалуйста, подтвердите, что Вы не робот.');
			setIsCaptchaVerified(false);
		} else {
			setIsCaptchaVerified(true);
			// make form submission
			alert('Отзыв успешно отправлен!');
			dispatch(closePopup());
		}
	}

	return (
		<form onSubmit={submitForm} className={styles.starRating}>
			<div
				onMouseEnter={() => setIsUserHovering(true)}
				onMouseLeave={() => setIsUserHovering(false)}
				className={styles.stars}
			>
				{Array.from({ length: numTotalStars }).map((e, i) => (
					<Star
						key={i}
						color={getColor(
							isUserHovering,
							i,
							numSelectedStars,
							numHoveringStars
						)}
						handleSelect={() => setNumSelectedStars(i + 1)}
						handleHover={() => setNumHoveringStars(i + 1)}
					/>
				))}
			</div>
			<ReCAPTCHA
				ref={recaptcha}
				sitekey={REACT_APP_SITE_KEY}
				onChange={() => setIsCaptchaVerified(true)}
			/>
			<SendButton
				type="submit"
				value="Отправить"
				onClick={() => {}}
				disabled={!isButtonActive}
			/>
		</form>
	);
}

StarRating.propTypes = {
	numTotalStars: PropTypes.number.isRequired,
	initialRating: PropTypes.number.isRequired,
	closePopup: PropTypes.func.isRequired,
};
