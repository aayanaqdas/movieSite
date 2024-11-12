const userInfo = JSON.parse(localStorage.getItem('userInfo'));

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');


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
                userInfo.username = username;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                window.location.href = '/';
            } else {
                console.log(result.message);
                // document.getElementById('loginMessage').textContent = result.message;
            }
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
                userInfo.username = username;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                window.location.href = '/';
            } else {
                console.log(result.message);
                // document.getElementById('signupMessage').textContent = result.message;
            }
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






// localStorage.clear();