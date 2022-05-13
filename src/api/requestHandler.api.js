import axios from 'axios';

/**
 * Create axios instance to make Restful API calls
 */

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const Request = axios.create({
	baseURL: API_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
});

const RequestUnhandled = axios.create({
	baseURL: API_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
});

export { Request, RequestUnhandled };
