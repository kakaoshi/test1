window.onload = function() {
    displayPosts();
};

function displayPosts() {
    let postsContainer = document.getElementById('posts-container');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    postsContainer.innerHTML = '';

    posts.forEach((post, index) => {
        let postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Create a clickable link for the username
        let postUsername = document.createElement('a');
        postUsername.textContent = post.username;
        postUsername.href = `profile.html?username=${encodeURIComponent(post.username)}`;
        postUsername.classList.add('username-link');

        let postContent = document.createElement('p');
        postContent.textContent = post.content;

        let postTimestamp = document.createElement('small');
        postTimestamp.textContent = post.timestamp;

        let likeButton = document.createElement('button');
        likeButton.textContent = `Like (${post.likes || 0})`;
        likeButton.onclick = function() { updateLikes(index, 'like'); };

        let dislikeButton = document.createElement('button');
        dislikeButton.textContent = `Dislike (${post.dislikes || 0})`;
        dislikeButton.onclick = function() { updateLikes(index, 'dislike'); };

        let commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';
        commentButton.onclick = function() {
            window.location.href = `comment_section.html?postIndex=${index}`;
        };

        // Append the clickable username link instead of a plain h3 tag
        postDiv.append(postUsername, postContent, postTimestamp, likeButton, dislikeButton, commentButton);
        postsContainer.appendChild(postDiv);
    });
}

function updateLikes(postIndex, action) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to like or dislike a post.');
        window.location.href = 'login.html';
        return;
    }

    let post = posts[postIndex];
    post.likedBy = post.likedBy || [];    // Array to track users who liked
    post.dislikedBy = post.dislikedBy || []; // Array to track users who disliked

    if (action === 'like') {
        // If user has not liked the post already
        if (!post.likedBy.includes(username)) {
            post.likedBy.push(username);
            post.likes = (post.likes || 0) + 1;

            // If user had previously disliked, remove that action
            if (post.dislikedBy.includes(username)) {
                post.dislikedBy = post.dislikedBy.filter(user => user !== username);
                post.dislikes = Math.max((post.dislikes || 0) - 1, 0);
            }
        } else {
            alert('You have already liked this post.');
        }
    } else if (action === 'dislike') {
        // If user has not disliked the post already
        if (!post.dislikedBy.includes(username)) {
            post.dislikedBy.push(username);
            post.dislikes = (post.dislikes || 0) + 1;

            // If user had previously liked, remove that action
            if (post.likedBy.includes(username)) {
                post.likedBy = post.likedBy.filter(user => user !== username);
                post.likes = Math.max((post.likes || 0) - 1, 0);
            }
        } else {
            alert('You have already disliked this post.');
        }
    }

    function searchUser() {
        const username = document.getElementById('search-bar').value.trim();
        
        if (username) {
            fetch(`/api/users/${username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        window.location.href = `profile.html?username=${username}`;
                    } else {
                        alert("User not found");
                    }
                })
                .catch(err => console.error('Error:', err));
        }
    }
    
    // Update localStorage with the modified post data
    localStorage.setItem('posts', JSON.stringify(posts));

    // Refresh the posts to show updated like and dislike counts
    displayPosts();
}

async function searchUser() {
    const username = document.getElementById('search-bar').value.trim();

    if (username) {
        try {
            const response = await fetch('http://localhost:3000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const result = await response.json();

            if (result.found) {
                // Redirect to the user’s profile page if found
                window.location.href = result.profileUrl;
            } else {
                // Redirect to the homepage if user not found
                window.location.href = 'homepage.html';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
