import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './PopupWithFilters.module.css';
import stylesButton from '../UI/ServiceButton/ServiceButton.module.css';
import FilterWithCheckbox from '../UI/FilterWithCheckbox/FilterWithCheckbox';
import FilterWithServices from '../UI/FilterWithServices/FilterWithServices';
import RemoveSearch from '../UI/icons/RemoveSearch';
import ClearFilters from '../UI/icons/ClearFilters';
import encodeQueryString from '../../utils/encodeQuerryString';
import {
	fetchListServices,
	fetchListTypes,
	selectFilters,
	openPopup,
	onChange,
	clearFilters,
} from '../../store/filters/filters-slice';
import { fetchListFilteredCarWashes } from '../../store/carWashes/carWashes-slice';

function PopupWithFilters() {
	const dispatch = useDispatch();
	const {
		listServices,
		listTypes,
		popupOpened,
		washOpened,
		washAroundClock,
		washRaiting,
	} = useSelector(selectFilters);
	const [arrServiceButtons, setArrServiceButtons] = useState([]);
	const [arrServices, setArrServices] = useState([]);

	const styleActive = stylesButton.active;

	const request = {
		is_open: washOpened,
		is_around_the_clock: washAroundClock,
		high_rating: washRaiting,
		services: arrServices.length ? arrServices : '',
		type: '',
	};

	const handleClickFilterButton = (e) => {
		const { classList, id, value } = e.target;
		if (classList.contains(styleActive)) {
			classList.remove(styleActive);
			setArrServiceButtons(arrServiceButtons.filter((item) => item.id !== id));
			setArrServices(arrServices.filter((i) => i !== value));
		} else {
			classList.add(styleActive);
			setArrServiceButtons([...arrServiceButtons, { id }]);
			setArrServices([...arrServices, value]);
		}
	};

	const handleApplyfilters = () => {
		dispatch(fetchListFilteredCarWashes(encodeQueryString(request)));
	};

	const handleClearFilters = () => {
		dispatch(clearFilters());
		arrServiceButtons.map((item) =>
			document.getElementById(item.id).classList.remove(styleActive)
		);
		dispatch(
			fetchListFilteredCarWashes(
				`${request.opened}&${request.aroundClock}&${request.raiting}&${request.services}`
			)
		);
	};

	useEffect(() => {
		dispatch(fetchListServices());
		dispatch(fetchListTypes());
	}, [dispatch]);

	useEffect(() => {
		const closePopupHandler = (e) => {
			if (e.target.classList.contains(styles.opened)) {
				dispatch(openPopup(false));
			}
		};

		document.addEventListener('click', closePopupHandler);
		return () => {
			document.removeEventListener('click', closePopupHandler);
		};
	}, [dispatch]);

	return (
		<div
			className={
				popupOpened ? `${styles.popup} ${styles.opened}` : styles.popup
			}
		>
			<div className={styles.container}>
				<button
					className={styles.close}
					aria-label="Кнопка закрытия попапа"
					onClick={() => dispatch(openPopup(false))}
				>
					<RemoveSearch />
				</button>
				<h2 className={styles.header}>Фильтр</h2>
				<div className={styles.filters}>
					<FilterWithCheckbox
						onChange={() => dispatch(onChange('washOpened'))}
						checked={washOpened}
						filterName="Открыто сейчас"
					/>
					<FilterWithCheckbox
						onChange={() => dispatch(onChange('washAroundClock'))}
						checked={washAroundClock}
						filterName="Круглосуточно"
					/>
					<FilterWithServices
						title="Услуга"
						services={listServices}
						onClick={handleClickFilterButton}
					/>
					<FilterWithServices
						title="Формат"
						services={listTypes}
						onClick={handleClickFilterButton}
					/>
					<FilterWithCheckbox
						onChange={() => dispatch(onChange('washRaiting'))}
						checked={washRaiting}
						filterName="Рейтинг 4+"
					/>
				</div>
				<div className={styles.buttons}>
					<button
						className={styles.clear}
						aria-label="Очистить фильтры"
						onClick={handleClearFilters}
					>
						<ClearFilters />
						Очистить фильтры
					</button>
					<button
						className={styles.apply}
						aria-label="Применить фильтры"
						onClick={handleApplyfilters}
					>
						Применить фильтры
					</button>
				</div>
			</div>
		</div>
	);
}

export default PopupWithFilters;
