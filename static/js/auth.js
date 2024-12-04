import { handleSearch } from "./search.js";
const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const form = document.getElementById("searchForm");

// Check if userInfo exists in local storage
if (!localStorage.getItem("userInfo")){
    const userInfoObj = {
        username: "",
        loggedIn: false,
        watchlist: []
    }
    localStorage.setItem("userInfo", JSON.stringify(userInfoObj));
      }


document.addEventListener("DOMContentLoaded", async() => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Check if user is already logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.loggedIn) {
        const response = await fetch('/check_session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userInfo.username })
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('User is already logged in');
            updateUIForLoggedInUser();
        } else {
            console.log('Session expired or invalid');
            localStorage.removeItem('userInfo');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('pwd').value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.status === 'success') {
                userInfo.loggedIn = true;
                userInfo.username = result.username;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                console.log(result.message);
                setTimeout(() => {
                 window.location.href = '/';
                },1000);
                
            } else {
                console.log(result.message);
            }
            statusPopup(result.status, result.message);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('pwd').value;

            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.status === 'success') {
                userInfo.loggedIn = true;
                userInfo.username = result.username;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                console.log(result.message);
                setTimeout(() => {
                 window.location.href = '/';   
                },2000);
            } else {
                console.log(result.message);

            }
            statusPopup(result.status, result.message);
        });
    }
    // Check login state on page load
    const loggedIn = userInfo.loggedIn;
    if (loggedIn === true) {
        updateUIForLoggedInUser();
    }
    else {
        const loginBtn = document.getElementById('settingsLoginLink');
        loginBtn.classList.remove('hide-element');
    }
});

//update ui for logged in user
function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('settingsLoginLink');
    const logoutBtn = document.getElementById('settingsLogoutLink');
    const loggedInUserTxtEL = document.getElementById('loggedInUserText');
    const username = userInfo.username;
    loggedInUserTxtEL.textContent = `${username}`;
    loginBtn.classList.add('hide-element');
    logoutBtn.classList.remove('hide-element');
};

function statusPopup(status, message) {
    const authPopupEl = document.getElementById('authStatusPopupEl');
    const authMsg = document.getElementById('authMessage');

    if(status === "success"){
        authPopupEl.classList.remove('hide-element');
        authPopupEl.classList.remove('error');
        authPopupEl.classList.add('success');
        authMsg.textContent = message;
    }
    else if(status === "error"){
        authPopupEl.classList.remove('hide-element');
        authPopupEl.classList.remove('success');
        authPopupEl.classList.add('error');
        authMsg.textContent = message;
    }
};



//logout handler
if(userInfo.loggedIn === true) {
    const logoutBtn = document.getElementById('settingsLogoutLink');
    logoutBtn.onclick = function logout() {
        userInfo.loggedIn = false;
        userInfo.username = '';
        userInfo.watchlist = [];
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        window.location.href = '/';
    }
}

//Allows search on login/signup pages
form.addEventListener("submit", handleSearch);



// localStorage.clear();