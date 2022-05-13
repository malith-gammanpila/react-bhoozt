import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './components/signIn/login';
import Home from './components/home/home';
import Register from './components/signIn/register';
import Profile from './components/signIn/profile';
import ForgotPass from './components/signIn/ForgotPass';
import Notification from './components/notification/notification';
import Game from './components/game/game';
import Redeem from './components/redeem/redeem';
import Forward from './components/forward';
import PayPal from './components/redeem/payPal';
import Loader from './components/common/loader';
import CardCarousel from './components/home/carousel';
// import FunNearby from './components/funNearby';

const isUserAvailable = () => {
	let bhooztUser = JSON.parse(localStorage.getItem('bhooztUser'));
	let headers = JSON.parse(localStorage.getItem('bhooztHeaders'));

	return (
		bhooztUser != null &&
		bhooztUser.id > -1 &&
		bhooztUser.email.length > 0 &&
		headers != null
	);
};

const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /login page
		<Route
			{...rest}
			render={(props) =>
				isUserAvailable() ? (
					<Component
						{...props}
						toNotifications={
							rest.path === '/notification' ? true : false
						}
					/>
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				isUserAvailable() && restricted ? (
					<Redirect to="/play" />
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};

const MainRoutes = () => {
	return (
		<Switch>
			<PublicRoute exact path="/" component={Loader} restricted={false} />
			<PublicRoute
				exact
				path="/resetpassword"
				component={ForgotPass}
				restricted={true}
			/>
			<PublicRoute
				exact
				path="/login"
				component={Login}
				restricted={true}
			/>
			{/* <PublicRoute
				exact
				path="/register"
				component={Register}
				restricted={true}
			/> */}
			<PrivateRoute exact path="/:path" component={Home} />
			{/* <PrivateRoute exact path="/profile" component={Profile} /> */}
		</Switch>
	);
};

const SubRoutes = () => {
	return (
		<>
			<PrivateRoute exact path="/play" component={CardCarousel} />
			<PrivateRoute exact path="/game" component={Game} />
			<PrivateRoute exact path="/forward" component={Forward} />
			<PrivateRoute exact path="/paypal" component={PayPal} />
			{/* <PrivateRoute exact path="/redeem" component={Redeem} /> */}
			{/* <PrivateRoute exact path="/fun" component={FunNearby} /> */}
			{/* <PrivateRoute exact path="/notification" component={Notification} /> */}
		</>
	);
};

export { MainRoutes, SubRoutes };
