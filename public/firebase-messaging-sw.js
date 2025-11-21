// //sFirebase v9+ SERVICE WORKER (must be JS)
// importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyB1H5vh4H2cmw612RU5WRyns6QTNw3TgHk",
//   authDomain: "counterfitprojecttest.firebaseapp.com",
//   projectId: "counterfitprojecttest",
//   storageBucket:  "counterfitprojecttest.firebasestorage.app",
//   messagingSenderId: "906229447803",
//   appId:  "1:906229447803:web:5310898247bb554b9f36de",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("[SW] Background message:", payload);

//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/logo.png",
//      image: notification.image
//   });
// });
// Firebase v9+ SERVICE WORKER
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// Initialize Firebase in SW
firebase.initializeApp({
  apiKey: "AIzaSyB1H5vh4H2cmw612RU5WRyns6QTNw3TgHk",
  authDomain: "counterfitprojecttest.firebaseapp.com",
  projectId: "counterfitprojecttest",
  storageBucket: "counterfitprojecttest.firebasestorage.app",
  messagingSenderId: "906229447803",
  appId: "1:906229447803:web:5310898247bb554b9f36de",
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  // const title = payload.notification?.title || "Notification";
  // const body = payload.notification?.body || "";
  // const image = payload.notification?.image || "/logo.png";
  // const data = payload.data || {};

  // self.registration.showNotification(title, {
  //   body,
  //   icon: "/logo.png",
  //   image,
  //   data,
  // });
});
