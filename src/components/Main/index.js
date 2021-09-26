import React from 'react';
import { ButtonGroup, Button, Backdrop, CircularProgress } from '@mui/material';

import './Main.css';

const COORDS = {
	'Europe/Berlin': {lat: 52.518611, lng: 13.408333}
}
const FILTERS = [
	{ id: 'pizza', label: 'Pizza' },
	{ id: 'burgers', label: 'Burger' },
	{ id: 'sushi', label: 'Sushi' },
];

class Main extends React.Component {
	state = {
		businesses: [],
		category: '',
		loading: false
	}

	mapsApiLoaded = null;
	mapInstance = null;

	componentDidMount() {
		this.updateData();

		this.mapsApiLoaded = window.setTimeout(this.checkMapsApi.bind(this), 200);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.category !== prevState.category) {
			this.updateData();
		}
	}

	updateData() {
		const { category } = this.state;

		this.setState({ loading: true });
		this.fetchRestaurants(category)
			.then(res => this.setState({
				businesses: res.businesses || [],
				loading: false
			}))
			.catch(err => console.log(err));
	}

	fetchRestaurants = async (category) => {
		const query = {
			limit: 50,
			location: "Berlin, Germany",
			term: "restaurants"
		}
		if (category) {
			query.categories = category;
		}
		const urlParams = new URLSearchParams(query);
		const response = await fetch(`/-/search?${urlParams}`);
		const body = await response.json();

		if (response.status !== 200) {
			throw Error(body.message);
		}
		return body;
	}

	checkMapsApi() {
		if (window.google && window.google.maps) {
			window.clearTimeout(this.mapsApiLoaded);
			this.initMap();
		}
	}

	initMap() {
		const mapEl = document.getElementById('places-map');
		if (mapEl && !this.mapInstance) {
			this.mapInstance = new window.google.maps.Map(mapEl, {
				center: COORDS['Europe/Berlin'],
				zoom: 8
			  });
		}
	}

	handleFilterCategory(category) {
		this.setState({ category });
	}

	render() {
		const { category, loading } = this.state;

		return (
			<main>
				<div id="places-map" className="places-map"></div>
				<div className="filters">
					<ButtonGroup variant="outlined" aria-label="outlined button group">
						{/* TODO: add search field */}
						{FILTERS.map(filter => (
							<Button
								disableElevation
								key={filter.id}
								variant={filter.id === category ? 'contained' : 'outlined'}
								onClick={() => {
									this.handleFilterCategory(filter.id === category ? '' : filter.id)
								}}
							>
								{filter.label}
							</Button>
						))}
					</ButtonGroup>
				</div>
				<div className="main">
					{loading && (
						<Backdrop open>
							<CircularProgress color="inherit" />
						</Backdrop>
					)}
					{this.state.businesses.map(business => {
						return (
							<div className="card" key={business.id}>
								<img src={business.image_url} alt={business.name} />
								<div className="container">
									<h4><a href={business.url}>{business.name}</a></h4>
									{
										business.location &&
										business.location.display_address &&
										(
											<p>
												{business.location.display_address[0]}
												<br />
												{business.location.display_address[1]}
											</p>
										)
									}
									<p>{business.display_phone}</p>
								</div>
							</div>
						)
					})}
				</div>
			</main>
		);
	}
}

export default Main;
