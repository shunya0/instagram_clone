import React, { useEffect, useContext } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

import AuthContext from "../contexts/auth/Auth.context";
import ProtectedRoute from "./ProtectedRoute";

// different routes
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import CreatePost from "../screens/CreatePost.js";

const Routing = () => {
	const { state } = useContext(AuthContext);

	// check if we are already authenticated
	useEffect(() => {
		state.isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />;
	});

	return (
		<BrowserRouter>
			<Switch>
				{/* Public routes */}
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />

				{/* Separate the protected routes from public ones */}
				<ProtectedRoute exact path="/" component={Home} />
				<ProtectedRoute exact path="/create" component={CreatePost} />

				{/* <Route component={NotFound} /> */}
			</Switch>
		</BrowserRouter>
	);
};

export default Routing;
