/* eslint-disable import/no-anonymous-default-export */
import { FETCH_USER_DATA, LOGOUT } from "../types";

export default (state, action) => {
	const { payload, type } = action;

	switch (type) {
		case FETCH_USER_DATA:
			return {
				...state,
				isAuthenticated: true,
				user: payload,
			};
		case LOGOUT:
			return { isAuthenticated: true };
		default:
			return state;
	}
};
