// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import {
	getFirestore,
	doc,
	getDoc,
	updateDoc
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAEh1bISiciiSr2B7Ww0xu1YPDBf-Oe5HE",
	authDomain: "insta-clone-5469d.firebaseapp.com",
	projectId: "insta-clone-5469d",
	storageBucket: "insta-clone-5469d.appspot.com",
	messagingSenderId: "96290045530",
	appId: "1:96290045530:web:21ac29cd33f2f6996c6263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// getProfileDetails and initialize
const userRef = doc(db, "users", "user-1");
const userSnap = await getDoc(userRef);
const user = userSnap.data();
document.getElementById("profilePic").src = user.profilePic;

window.profilePictureSelectHandler = function (event) {
	// const file = document.getElementById("chooseProfileImage").files[0];
	const file = event.target.files[0];
	const fileId = `${Date.now().toString()}${Math.floor(
		Math.random() * (1000000 - 1 + 1) + 1
	)}`;

	const profileRef = ref(storage, fileId);
	uploadBytes(profileRef, file).then(() => {
		getDownloadURL(profileRef).then((result) => {
			updateDoc(userRef, {
				profilePic: result
			});
		});
	});
};
