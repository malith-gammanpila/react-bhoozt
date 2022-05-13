importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

var firebaseConfig = {
	apiKey: 'AIzaSyAHmoCjsV0i8M7kGwto9o3U0f3AGHqbGfE',
	authDomain: 'mg-bhoozt.firebaseapp.com',
	databaseURL: 'https://mg-bhoozt.firebaseio.com',
	projectId: 'mg-bhoozt',
	storageBucket: 'mg-bhoozt.appspot.com',
	messagingSenderId: '820189212587',
	appId: '1:820189212587:web:66c66ec67fda282586ecee',
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
