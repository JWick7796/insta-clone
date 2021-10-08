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

// Initializations
let selectedNewPostFile = undefined;
let user = undefined;
let alreadyReversed = false;
console.log(alreadyReversed);

async function updateUser() {
	let userRef = doc(db, "users", "user-1");
	let userSnap = await getDoc(userRef);
	user = userSnap.data();
	document.getElementById("profileContainer").innerHTML = await renderProfile(
		user
	);
	document.getElementById("mainContainer").innerHTML = await renderPosts(
		user.posts
	);
	selectedNewPostFile = undefined;
}

function likeDisplay(likes) {
	if (likes === 1) {
		return `1 Like`;
	} else {
		return `${likes} Likes`;
	}
}

const getCommentsArray = (comments) => {
	let commentsHtml = "";
	comments.forEach((cmt) => {
		commentsHtml += `
		<span style="margin-top: 2px">
			<span style="font-weight: bold">
				${cmt.userName}
			</span>
			:&nbsp;
			<span>${cmt.comment}</span>
		</span>
		`;
	});

	return commentsHtml;
};

async function showThumbnailPosts(posts) {
	let postsHtml = "";
	let revPosts = [...posts];
	revPosts.reverse();
	revPosts.forEach((element) => {
		postsHtml += `
		<div style="width: fit-content; margin: 5px">
			<img
				src="${element.postURL}"
				alt=""
				width="55"
				height="55"
				style="border-radius: 50px; object-fit: cover"
			/>
		</div>
		`;
	});
	return postsHtml;
}

const renderProfile = async (user) => {
	return `
	<div class="main-container__profile-profile-picture">
						<img id="profilePic" class="profile-pic" src="${user.profilePic}" />
					</div>
					<div class="main-container__profile-title">
						<h3 id="userName">${user.userName}</h3>
						<div
							id="userTitle"
							style="
								color: gray;
								font-weight: 600;
								font-size: 0.9rem;
							"
						>${user.title}</div>
					</div>
					<div class="main-container__profile-about">
						<div id="name" style="font-weight: bold">${user.name}</div>
						<div
							id="about"
							style="
								margin-top: 10px;
								color: grey;
								text-align: justify;
							"
						>${user.about}</div>
					</div>
					<div style="font-weight: bold; margin-top: 10%">
						Your Posts
					</div>
					<div class="main-container__profile-posts">
					${await showThumbnailPosts(user.posts)}
					</div>
					<div class="main-container__profile-create-post">
						<button
							style="
								width: 80%;
								height: 45;
								font-size: 1.1em;
								color: white;
								font-family: 'Montserrat';
								box-shadow: 0px 7px 10px 2px pink;
								border-radius: 7px;
								border-style: none;
								background-image: linear-gradient(
									to right,
									#fe509f,
									#f2579d,
									#fb703f,
									#b95937
								);
							"
							onclick = "openCreateNewPostView()"
						>
							Create Post
						</button>
					</div>
	`;
};

const renderNewPost = (user) => {
	return `
  		<div
  		style="
	  		display: flex;
	  		flex-direction: column;
	  		justify-content: center;
	  		align-items: center;
	  		height: 100%;
  		"
		>
		<div>
			  <img
				  src="./resources/placeholder.jpg"
				  id="imagePreview"
				  width="300"
		  		  height="300"
		          alt=""
		          style="object-fit: cover; border-radius: 10px"
	  			/>
 		</div>
  		<div
	  		style="
		 	 margin-top: 15px;
		 	 width: 78%;
		  	 display: flex;
		  	 justify-content: center;
	  		"
  		>
	  		<label class="custom-file-upload">
		 		 <input
			  		type="file"
			  		onchange="postImageListerner(event)"
		  	/>Upload Image</label>
  		</div>
  			<div
	  			class="caption-container"
	  			style="
		  		margin-top: 50px;
		  		width: 80%;
		  		display: flex;
		  		justify-content: center;
	  		"
  		>
	  		<textarea
		 	 class="caption-input"
		 	 placeholder="Enter Caption"
			  id="imageCaption"
			  cols="30"
			  rows="10"
	 		></textarea>
  		</div>
  		<div
	  		style="
		  		display: flex;
				height: 10%;
		  		justify-content: center;
		  		width: 100%;
				margin-top: 7%;
	  		"
  		>
	  		<button
		  		style="
			  		align-self: flex-end;
			  		height: 45px;
			  		font-size: 1.1em;
					width: 80%;
			  		color: white;
			  		font-family: 'Montserrat';
			  		box-shadow: 0px 7px 10px 2px pink;
			  		border-radius: 7px;
			  		border-style: none;
			  		background-image: linear-gradient(
						  to right,
						  #fe509f,
						  #f2579d,
						  #fb703f,
						  #b95937
			  		);
		  		"
		  		onclick="createNewPost()"
	  		>
		  		Create Post
	  		</button>
  		</div>
	</div>
  `;
};

const renderPosts = async (posts) => {
	let postsHtml = "";
	let revPosts = [...posts];
	revPosts.reverse();
	revPosts.forEach((post) => {
		postsHtml +=
			`
		<div class="card-post">
		<img
			src="${post.postURL}"
			style="
				width: 100%;
				height: 450px;
				object-fit: cover;
				border-radius: 10px;
			"
		/>
		<div style="padding: 0 15px; font-size: 1.1em; color: grey; margin-top: 3px;">${
			post.caption
		}</div>
		<div style="padding: 5px; display: flex; margin-top: 10px;">
			<img
				style="margin-left: 5px; cursor: pointer; ${
					post.alreadyLiked ? "pointer-events: none;" : ""
				}"
				src="${
					post.alreadyLiked
						? "./resources/red-heart.svg"
						: "./resources/heart-thin.svg"
				}"
				width="35"
				height="35"
				onclick='likeHandler(event, "` +
			post.postURL +
			`")'
			/>
			<img
				style="margin-left: 5px; cursor: pointer"
				src="./resources/comment.svg"
				width="35"
				height="35"
				onclick="commentButtonClickHandler(event)"
			/>
			<div
				style="
					display: flex;
					flex: 1 1;
					flex-direction: row;
					justify-content: flex-end;
					margin-top: 5px;
					position: relative;
					visibility: hidden;
				"
			>
				<input
					type="text"
					id="comment-box"
					placeholder="Enter Your Comment"
					style="
						align-self: flex-end;
						height: 100%;
						width: 85%;
						padding: 0 5px;
					"
				/>
				<img
					style="margin-left: 2px; cursor: pointer"
					src="./resources/add-comment.svg"
					width="35"
					height="35"
					onclick='commentHandler(event, "` +
			post.postURL +
			`")'
				/>
			</div>
		</div>
		<div style="padding: 5px; height: 12%">
			<div
				style="
					margin-left: 7px;
					color: grey;
					font-size: 0.9em;
				"
			>
				${likeDisplay(post.likes)}
			</div>
			<div
				style="
					display: flex;
					margin-left: 7px;
					margin-top: 15px;
					flex-direction: column;
					height: 50%;
					overflow: auto;
				"
			>
				${getCommentsArray(post.comments)}
			</div>
		</div>
	</div>
		`;
	});
	return postsHtml;
};

window.likeHandler = function (event, postURL) {
	var index = user.posts.findIndex((obj) => obj.postURL === postURL);
	user.posts[index].likes += 1;
	user.posts[index].alreadyLiked = true;
	event.target.src = "./resources/red-heart.svg";
	updateDoc(userRef, user).then(async (result) => {
		await updateUser();
	});
};

window.commentButtonClickHandler = function (event) {
	event.target.nextElementSibling.style.visibility = "visible";
};

window.commentHandler = function (event, postURL) {
	var index = user.posts.findIndex((obj) => obj.postURL === postURL);
	let comment = event.target.previousElementSibling.value;
	user.posts[index].comments.push({
		userName: "johnWick",
		comment: comment
	});
	updateDoc(userRef, user).then(async (result) => {
		await updateUser();
	});
};

// getProfileDetails and initialize
const userRef = doc(db, "users", "user-1");
const userSnap = await getDoc(userRef);
user = userSnap.data();
document.getElementById("profileContainer").innerHTML = await renderProfile(
	user
);
document.getElementById("mainContainer").innerHTML = await renderPosts(
	user.posts
);

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
				name: "Harsh W"
			});
		});
	});
};

window.postImageListerner = function (event) {
	selectedNewPostFile = event.target.files[0];
	const fileSrc = URL.createObjectURL(selectedNewPostFile);
	document.getElementById("imagePreview").src = fileSrc;
};

window.closeNewPostView = function () {
	console.log(selectedNewPostFile);
};

window.openCreateNewPostView = function () {
	document.getElementById("profileContainer").innerHTML = renderNewPost(user);
};

window.createNewPost = async function () {
	const file = selectedNewPostFile;
	const fileId = `${Date.now().toString()}${Math.floor(
		Math.random() * (1000000 - 1 + 1) + 1
	)}`;
	const profileRef = ref(storage, fileId);
	const caption = document.getElementById("imageCaption").value;
	if (!file || !caption) {
		document.getElementById("profileContainer").innerHTML =
			await renderProfile(user);
		return;
	}
	uploadBytes(profileRef, file).then(() => {
		getDownloadURL(profileRef).then((result) => {
			updateDoc(userRef, {
				posts: [
					...user.posts,
					{
						postURL: result,
						caption: caption,
						likes: 0,
						comments: []
					}
				]
			}).then(async (result) => {
				await updateUser();
			});
		});
	});
};
