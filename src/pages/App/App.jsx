import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import authService from '../../services/authService';
import Users from '../Users/Users';
import Pet from '../../pages/Pet/Pet'
import EditPet from '../../pages/EditPet/EditPet'
import './App.css';
import AddPet from '../../components/AddPet/AddPet';
import * as petAPI from '../../services/petService';
import OwnerFeed from '../OwnerFeed/OwnerFeed';

class App extends Component {
	state = {
		user: authService.getUser(),
		pets: [],
		followedPets: [],
	};

	handleLogout = () => {
		authService.logout();
		this.setState({ user: null });
	};

	handleSignupOrLogin = () => {
		this.setState({ user: authService.getUser() });
	};

	handleAddPet = async (newPetData) => {
		const newPet = await petAPI.create(newPetData);
		newPet.addedBy = this.state.user._id;
		this.setState(
			(state) => ({
				pets: [...state.pets, newPet],
			}),
			() => this.props.history.push('/')
		);
	};
	// [] Call petsAPI services to get all followed pets
	// async componentDidMount() {
	// 	const followedPets = await petsAPI.getPets();
	// 	this.setState({followedPets});
	// 	console.log(this.state)
	// }

	async componentDidMount() {
		const pets = await petAPI.getPets(this.state.pets);
		this.setState({ pets });
		console.log(this.state);
	}

	render() {
		const { user } = this.state;
		return (
			<>
				<NavBar user={user} handleLogout={this.handleLogout} />
				<div id='main-container'>
				<Route
					exact
					path="/"
					render={() =>
						user ? (
							<OwnerFeed user={this.state.user} />
						) : (
							<Redirect to="/login" />
						)
					}
				/>
				<Route
					exact
					path="/signup"
					render={({ history }) => (
						<Signup
							history={history}
							handleSignupOrLogin={this.handleSignupOrLogin}
						/>
					)}
				/>
				<Route
					exact
					path="/login"
					render={({ history }) => (
						<Login
							history={history}
							handleSignupOrLogin={this.handleSignupOrLogin}
						/>
					)}
				/>
				<Route
					exact
					path="/users"
					render={() => (user ? <Users /> : <Redirect to="/login" />)}
				/>
				<Route
					exact
					path="/pet"
					render={({ history }) => ( user ?
						<Pet
							history={history}
							user={user}
						/>
						:
						<Redirect to="/login" />
					)}
				/>
				<Route
					exact
					path="/edit-pet"
					render={({ history, location }) => ( user ?
						<EditPet
							history={history}
							location={location}
						/>
						:
						<Redirect to="/login" />
					)}
				/>
				</div>
					path="/pets/add"
					render={() => (
						<AddPet
							user={this.state.user}
							handleAddPet={this.handleAddPet}
						/>
					)}
				/>
			</>
		);
	}
}

export default App;
