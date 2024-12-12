import { handleSearch } from "./search.js";
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const form = document.getElementById("searchForm");

// Check if userInfo exists in local storage
if (!localStorage.getItem("userInfo")) {
  const userInfoObj = {
    username: "",
    loggedIn: false,
    watchlist: [],
  };
  localStorage.setItem("userInfo", JSON.stringify(userInfoObj));
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const deleteForm = document.getElementById("delete-form");

  // Check if user logged in has a valid account if not logout
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.loggedIn) {
    const response = await fetch("/check_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userInfo.username }),
    });

    const result = await response.json();
    if (result.status === "success") {
      console.log("User is already logged in");
      updateUIForLoggedInUser();
    } else if (result.status === "error") {
      console.log("Session expired or invalid");
      logout();
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("pwd").value;

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.status === "success") {
        userInfo.loggedIn = true;
        userInfo.username = result.username;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log(result.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        console.log(result.message);
      }
      statusPopup(result.status, result.message);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("pwd").value;

      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.status === "success") {
        userInfo.loggedIn = true;
        userInfo.username = result.username;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log(result.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.log(result.message);
      }
      statusPopup(result.status, result.message);
    });
  }

  if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = userInfo.username;
      const password = document.getElementById("pwd").value;
      try {
        const response = await fetch("/delete_account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        console.log(result);
        if (result.status === "success") {
          console.log(result.message);
          setTimeout(() => {
            logout();
          }, 2000);
        } else {
          console.log(result.message);
        }
        statusPopup(result.status, result.message);
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // Check login state on page load
  const loggedIn = userInfo.loggedIn;
  if (loggedIn === true) {
    updateUIForLoggedInUser();
  } 
});

//update ui for logged in user
function updateUIForLoggedInUser() {
    const logoutBtn = document.getElementById("logOutBtn");
    const deleteAccountBtn = document.getElementById("settingsDeleteLink");
    const loggedInUserTxtEL = document.getElementById("loggedInUserText");
    const username = userInfo.username;
    loggedInUserTxtEL.textContent = `${username}`;
    logoutBtn.textContent = "Log Out";    
    deleteAccountBtn.classList.remove("hide-element");
}

function statusPopup(status, message) {
  const authPopupEl = document.getElementById("authStatusPopupEl");
  const authMsg = document.getElementById("authMessage");

  if (status === "success") {
    authPopupEl.classList.remove("hide-element");
    authPopupEl.classList.remove("error");
    authPopupEl.classList.add("success");
    authMsg.textContent = message;
  } else if (status === "error") {
    authPopupEl.classList.remove("hide-element");
    authPopupEl.classList.remove("success");
    authPopupEl.classList.add("error");
    authMsg.textContent = message;
  }
}

//logout handler
function logout() {
  userInfo.loggedIn = false;
  userInfo.username = "";
  userInfo.watchlist = [];
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  window.location.href = "/";
}
const logoutBtn = document.getElementById("logOutBtn");
if (userInfo.loggedIn == true && userInfo.username != ""){
logoutBtn.addEventListener("click", logout);  
}
else{
  logoutBtn.addEventListener("click", function(){
    window.location.href = "/login";
  });
}



//Allows search on login/signup pages
form.addEventListener("submit", handleSearch);

// localStorage.clear();
