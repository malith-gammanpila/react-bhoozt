importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');

var firebaseConfig = {
	apiKey: 'AIzaSyD5OrcnOPEz1Pj12H1Ub5omsab6HG5A0-8',
	authDomain: 'bhoozt-app-1543989139915.firebaseapp.com',
	databaseURL: 'https://bhoozt-app-1543989139915.firebaseio.com',
	projectId: 'bhoozt-app-1543989139915',
	storageBucket: 'bhoozt-app-1543989139915.appspot.com',
	messagingSenderId: '482408933659',
	appId: '1:482408933659:web:cf6a0f08afa4cf7b9c4bbe',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	const promiseChain = clients
		.matchAll({
			type: 'window',
			includeUncontrolled: true,
		})
		.then(windowClients => {
			for (let i = 0; i < windowClients.length; i++) {
				const windowClient = windowClients[i];
				windowClient.postMessage(payload);
			}
		})
		.then(() => {
			return registration.showNotification('my notification title');
		});
	return promiseChain;
});

self.addEventListener('push', function(event) {
	// console.log('event', event);
	console.log('message', JSON.parse(event.data.text()));
	// console.log("event-data-json", JSON.parse(event.data.text()));

	try {
		const message = JSON.parse(event.data.text());
		const notification = message.notification;
		const title = notification.title;
		const options = {
			body: notification.body,
			data: {
				C: message.data.C,
				G: message.data.G,
				N: message.data.N,
			},
		};
		event.waitUntil(self.registration.showNotification(title, options));
	} catch (e) {
		console.log(e);
	}
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	// console.log('onClick', event); // DEBUG

	let t = ''; // title
	let b = ''; // body
	let g = ''; // game code
	let c = ''; // coins
	let n = ''; // notification

	if (event.notification.data.N) {
		n = event.notification.data.N;
	}

	try {
		t = event.notification.title;
		b = event.notification.body;

		if (
			event.notification.data &&
			event.notification.data.G &&
			event.notification.data.C
		) {
			g = event.notification.data.G;
			c = event.notification.data.C;
		}
	} catch (e) {
		console.log('Error found reading notification data');
	}

	return clients.openWindow(
		'/?t=' + t + '&b=' + b + '&g=' + g + '&c=' + c + '&n=' + n
	);
	// event.waitUntil(
	//     clients.matchAll({ includeUncontrolled: true, type: 'window'}).then( windowClients => {
	//         // Check if there is already a window/tab open with the target URL
	//         let url = "localhost:3000";
	//
	//         for (var i = 0; i < windowClients.length; i++) {
	//             var client = windowClients[i];
	//             // If so, just focus it.
	//             if (client.url.includes(url) && 'focus' in client) {
	//                 return client.focus();
	//             }
	//         }
	//         // If not, then open the target URL in a new window/tab.
	//         if (clients.openWindow) {
	//             return clients.openWindow('/?t='+t+'&b='+b+'&g='+g+'&c='+c);
	//         }
	//     })
	// );

	// event.waitUntil(clients.openWindow('/'));
});
