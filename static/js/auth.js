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
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', username);
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
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', username);
                window.location.href = '/';
            } else {
                console.log(result.message);
                // document.getElementById('signupMessage').textContent = result.message;
            }
        });
    }
    // Check login state on page load
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
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
    const loggedInUserEL = document.getElementById('loggedInUser');
    const loggedInUserTxtEL = document.getElementById('loggedInUserText');
    const username = localStorage.getItem('username');
    loggedInUserEL.classList.remove('hide-element');
    loggedInUserTxtEL.textContent = `${username}`;
    loginBtn.classList.add('hide-element');
    logoutBtn.classList.remove('hide-element');
};

//logout handler
if(localStorage.getItem('loggedIn') === 'true') {
    const logoutBtn = document.getElementById('settingsLogoutLink');
    logoutBtn.onclick = function logout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location.href = '/';
    }
}


// localStorage.clear();