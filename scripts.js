const postsWrapper = document.querySelector(".posts-wrapper");
const popup = document.querySelector(".popup");
const popupTitle = document.getElementById("popupTitle");
const popupBody = document.getElementById("popupBody");
const closePopup = document.getElementById("closePopup");
const postFormWrapper = document.querySelector(".post-form-wrapper");
const newPost = document.getElementById("newPost");
const closePostForm = document.getElementById("closePostForm");
const submitPostForm = document.getElementById("postForm");

function fetchPosts(url, callback) {
    fetch(url, { method: "GET" })
        .then((response) => {
            if (!response.ok) throw response.status;
            return response.json();
        })
        .then((data) => callback(data))
        .catch((error) => {
            const errorMessage = document.createElement("h1");
            errorMessage.innerText = "Server Problem 😣";
            postsWrapper.appendChild(errorMessage);
        });
}

fetchPosts("https://jsonplaceholder.typicode.com/posts", createPostsContent);

function createPostsContent(data) {
    data.forEach((item) => {
        createPostElement(item);
    });
}

newPost.addEventListener("click", () => {
    postFormWrapper.classList.add("active");
});

closePostForm.addEventListener("click", function () {
    postFormWrapper.classList.remove("active");
});


function createPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.setAttribute("id", post.id);

    const postTitle = document.createElement("h2");
    postTitle.textContent = post.title;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-id", post.id);

    postElement.appendChild(postTitle);
    postElement.appendChild(deleteButton);

    postElement.addEventListener("click", function () {
        popup.classList.add("active");
        const postId = this.getAttribute("id");
        const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        fetchPosts(postUrl, (data) => {
            popupTitle.textContent = data.title;
            popupBody.textContent = data.body;
        });
    });

    deleteButton.addEventListener("click", function (e) {
        e.stopPropagation();
        const postId = this.getAttribute("data-id");
        const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        fetch(postUrl, { method: "DELETE" }).then(() => postElement.remove());
    });

    postsWrapper.appendChild(postElement);
}

closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    popupTitle.textContent = "";
    popupBody.textContent = "";
});

popup.addEventListener("click", function (e) {
    if (e.target === this) {
        popup.classList.remove("active");
        popupTitle.textContent = "";
        popupBody.textContent = "";
    }
});

submitPostForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const titleInput = this.querySelector("#postTitle");
    if (titleInput.value.trim() === "") {
        return;
    }
    const newPostData = {
        title: titleInput.value.trim(),
        userId: 11,
    };
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPostData),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .then((post) => {
            postFormWrapper.classList.remove("active");
            titleInput.value = "";
            createPostElement(post);
        });
});

