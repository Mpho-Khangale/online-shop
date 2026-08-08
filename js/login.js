import {auth} from "./firebase.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

// Signup form submission

signupForm.addEventListener("submit", async (e) => {
    event.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created:", userCredential.user);

        signupMessage.textContent = "Account created successfully!";
        signupMessage.style.color = "green";
        signupForm.reset();
    } catch (error) {
        console.error(error);
        signupMessage.textContent = error.message;
        signupMessage.style.color = "red";
    }

});

// Login form submission

loginForm.addEventListener("submit", async (e) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);

        loginMessage.textContent = "Logged in successfully!";
        loginMessage.style.color = "green";
        loginForm.reset();

        setTimeout(() => {
            window.location.href = "shop.html";
        }, 1000);
    } catch (error) {
        console.error(error);
        loginMessage.textContent = "Invalid email or password.";
        loginMessage.style.color = "red";
    }
});
