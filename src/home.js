const addPostButton = document.querySelector('.add-post');
const postForm = document.querySelector('.post-form');
const createPostButton = document.querySelector('.post-form button');
const postContainer = document.querySelector('.post-container');
const buttonContainer = document.querySelector(".button-container");
const buttons = buttonContainer.querySelectorAll(".button");
const mapContainer = document.getElementById('map-container');
const closeButton = document.getElementById('closeButton');
let map;


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: { lat: 0, lng: 0 },
	  zoom: 2, 
	});
  }

  function showMapPopup() {
	buttonContainer.style.display = 'none';
	mapContainer.style.display = 'block';
	addPostButton.style.display = 'none';
	hidePosts();
  }
  
  function closeMapPopup() {
	mapContainer.style.display = 'none';
	buttonContainer.style.display = 'flex';
	addPostButton.style.display = 'flex';
	loadPosts();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
	const button1 = document.getElementById('button1');
	
	button1.addEventListener('click', () => {
	  showMapPopup();
	});
	
	closeButton.addEventListener('click', () => {
	  closeMapPopup();
	});

	loadPosts();
  });


async function loadPosts() {
	try {
	  const response = await fetch('/getposts');
	  if (response.ok) {
		const responseData = await response.json();
		responseData.forEach(post => {
		  addPostToPage(post.text);
		});
	  } else {
		console.error('Failed to fetch posts.');
	  }
	} catch (error) {
	  console.error('Error fetching posts:', error);
	}
  }

  
  window.addEventListener('DOMContentLoaded', () => {
	var profilePicHeader = document.getElementById('profilePicHeader');
	var usernameHeader = document.getElementById('usernameHeader');
  
	var savedProfilePicture = localStorage.getItem('profilePicture');
	if (savedProfilePicture) {
	  profilePicHeader.src = savedProfilePicture;
	}
  
	var savedUsername = localStorage.getItem('username');
	if (savedUsername) {
	  usernameHeader.textContent = savedUsername;
	}
  });
  
  addPostButton.addEventListener('click', () => {
	addPostButton.style.display = 'none';
	postForm.style.display = 'flex';
	buttonContainer.style.display = 'none'; 
	hidePosts();
  });


async function createPost() {
	const textarea = postForm.querySelector('textarea');
	const text = textarea.value;
	const savedUsername = localStorage.getItem('username');

	const requestBody = {
		text: text,
		username: savedUsername,
	};

	try {
		const response = await fetch('/createpost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (response.ok) {
			const responseData = await response.json();

			console.log('Response Data:', responseData);

			if (responseData.error) {
				buttonContainer.style.display = 'flex';
				postForm.style.display = 'none';
				addPostButton.style.display = 'flex';
			} else {
				addPostToPage(responseData.text);
				buttonContainer.style.display = 'flex';
				postForm.style.display = 'none';
				addPostButton.style.display = 'flex';
				loadPosts();

	
			}
		} else {
			alert('Failed to create post. Please try again.');
			buttonContainer.style.display = 'flex';
			postForm.style.display = 'none';
			addPostButton.style.display = 'flex';
		}
	} catch (error) {
		console.error('Error creating post:', error);
		alert('An error occurred while creating the post.');
		buttonContainer.style.display = 'block';
	}
}

function previewImage(event) {
	const imagePreview = document.getElementById('image-preview');
	const file = event.target.files[0];
	const reader = new FileReader();

	reader.onload = function () {
		const imgElement = document.createElement('img');
		imgElement.src = reader.result;
		imgElement.alt = 'Image Preview';
		imagePreview.innerHTML = '';
		imagePreview.appendChild(imgElement);
	};

	if (file) {
		reader.readAsDataURL(file);
	}
}

function hidePosts() {
	const posts = document.querySelectorAll('.post');
	posts.forEach((post) => {
		post.classList.add('hidden-post');
	});
}
  

async function fetchComments(postId) {
	try {
	  const response = await fetch(`/comments/${postId}`);
	  const data = await response.json();
	  return data.comments;
	} catch (error) {
	  console.error('Error fetching comments:', error);
	  return [];
	}
  }

function toggleComments(event) {
	const post = event.target.closest('.post');
	const commentContainer = post.querySelector('.comment-container');
	commentContainer.classList.toggle('hidden-comment');
  }		  


  function submitCommentForm(event, postElement) {
	event.preventDefault();
	const commentInput = postElement.querySelector('.comment-input');
	const comment = commentInput.value.trim();
	const postId = postElement.getAttribute('data-post-id');
	const commentData = {
	  postId: postId,
	  comment: comment,
	};
  
	fetch('/submitcomment', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(commentData),
	})
	  .then((response) => response.json())
	  .then((data) => {
		if (data.success) {
		  console.log('Comment submitted successfully');
		  const commentsContainer = postElement.querySelector('.comments-container');
		  const newComment = document.createElement('div');
		  newComment.textContent = comment;
		  newComment.classList.add('comment');
		  commentsContainer.appendChild(newComment);
  
		  commentInput.value = '';
		} else {
		  console.error('Failed to submit comment');
		}
	  })
	  .catch((error) => {
		console.error('Error submitting comment:', error);
	  });
  }

  function deletePost(event, postId) {
	if (!postId) {
	  console.error('Invalid postId:', postId);
	  return;
	}
  
	fetch(`/deletepost/${postId}`, {
	  method: 'DELETE',
	})
	  .then((response) => response.json())
	  .then((data) => {
		if (data.success) {
		  console.log('Post deleted successfully');
		  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
		  if (postElement) {
			postElement.remove();
		  }
		} else {
		  console.error('Failed to delete post');
		}
	  })
	  .catch((error) => {
		console.error('Error deleting post:', error);
	  });
  }
  


  function addPostToPage(text, postId) {
	const postElement = document.createElement('div');
	postElement.classList.add('post');

	const postContent = document.createElement('div');
	postContent.classList.add('post-content');

	const profilePic = document.createElement('img');
	profilePic.src = localStorage.getItem('profilePicture') || 'default.jpg';
	profilePic.alt = 'Profile Picture';
	profilePic.classList.add('profile-pic');

	const postUsername = document.createElement('div');
	postUsername.textContent = localStorage.getItem('username') || 'User';
	postUsername.classList.add('post-username');

	const postText = document.createElement('p');
	postText.textContent = text;
	postText.classList.add('post-text');

	postContent.appendChild(profilePic);
	postContent.appendChild(postUsername);
	postContent.appendChild(postText);

	const postButtons = document.createElement('div');
	postButtons.classList.add('post-buttons');

	const likeButton = document.createElement('button');
	likeButton.textContent = 'Like';

	const commentButton = document.createElement('button');
	commentButton.textContent = 'Comment';

	const shareButton = document.createElement('button');
	shareButton.textContent = 'Share';

	 const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.dataset.postId = postId;

	postButtons.appendChild(likeButton);
	postButtons.appendChild(commentButton);
	postButtons.appendChild(shareButton);
	postButtons.appendChild(deleteButton);
	postElement.appendChild(postContent);
	postElement.appendChild(postButtons);
	postContainer.appendChild(postElement);

	const commentContainer = document.createElement('div');
	commentContainer.classList.add('comment-container', 'hidden-comment');
	postElement.appendChild(commentContainer);

	const commentForm = document.createElement('form');
	commentForm.classList.add('comment-form');
	commentForm.setAttribute('data-post-id', postId);
	commentForm.addEventListener('submit', function (event) {
		event.preventDefault();
		submitCommentForm(event, postElement);
	});

	const commentInput = document.createElement('input');
	commentInput.type = 'text';
	commentInput.classList.add('comment-input');
	commentInput.placeholder = 'Write a comment';

	const commentSubmitButton = document.createElement('button');
	commentSubmitButton.type = 'submit';
	commentSubmitButton.classList.add('comment-submit-button');
	commentSubmitButton.textContent = 'Submit';

	commentForm.appendChild(commentInput);
	commentForm.appendChild(commentSubmitButton);
	commentContainer.appendChild(commentForm);

	const commentsContainer = document.createElement('div');
	commentsContainer.classList.add('comments-container');
	commentContainer.appendChild(commentsContainer);

	commentButton.addEventListener('click', function (event) {
		toggleComments(event);
	});

	deleteButton.addEventListener('click', function (event) {
		deletePost(event, postId);
	});
}