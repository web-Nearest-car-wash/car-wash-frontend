import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import YMap from '../../components/Map/YMap';
import Search from '../../components/UI/Search/Search';
import CardCarWash from '../../components/CardCarWash/CardCarWash';
import {
	fetchListCarWash,
	selectCarWashes,
} from '../../store/carWashes/carWashes-slice';
import Loader from '../../components/UI/Loader/Loader';

function HomePage() {
	const dispatch = useDispatch();
	const { listCarWashes, loading } = useSelector(selectCarWashes);
	const [query, setQuery] = useState('');

	const handleOnChange = (value) => {
		setQuery(value);
	};

	const clearInput = () => {
		setQuery('');
	};

	useEffect(() => {
		dispatch(fetchListCarWash());
	}, [dispatch]);

	return (
		<section className={styles.page}>
			<div className={styles.sidebar}>
				<div className={styles.cardsContainer}>
					{loading ? (
						<Loader />
					) : (
						listCarWashes.map((card) => (
							<Link key={card.id} to={`/carwashes/${card.id}`}>
								<CardCarWash card={card} />
							</Link>
						))
					)}
				</div>
			</div>
			<div className={styles.map}>
				<Search
					query={query}
					onChange={handleOnChange}
					clearInput={clearInput}
					placeholder="Введите название, адрес или услугу"
				/>
				<YMap />
			</div>
		</section>
	);
}

export default HomePage;
