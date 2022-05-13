import * as firebase from 'firebase/app';
import 'firebase/messaging';

const initializedFirebaseApp = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

// below key can be found in
// Project Settings => Cloud Messaging => Web Push
const messaging =
	firebase.messaging.isSupported() && initializedFirebaseApp.messaging();
messaging &&
	messaging.usePublicVapidKey(
		process.env.REACT_APP_FIREBASE_PUBLIC_VAPID_KEY
	);
export { messaging };
