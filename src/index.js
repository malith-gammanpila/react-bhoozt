import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import 'semantic-ui-css/semantic.min.css';
import App from './app';
import * as serviceWorker from './serviceWorker';

console.log('ENV =', process.env.REACT_APP_CUSTOM_NODE_ENV);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register(
			process.env.REACT_APP_CUSTOM_NODE_ENV === 'production'
				? './firebase-messaging-sw.js'
				: './dev-firebase-messaging-sw.js'
		)
		.then(function(registration) {
			console.log(
				'Registration successful, scope is:',
				registration.scope
			);
		})
		.catch(function(err) {
			console.log('Service worker registration failed, error:', err);
		});
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
