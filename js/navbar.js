import {auth} from "./firebase.js";
import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

//updating the navbar based on user authentication state
onAuthStateChanged(auth, (user) => {
    if(!navLinks){
        return;
    }

    if (user) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="cart.html">Cart</a></li>
            <li><span class="user-email">${user.email}</span></li>
            <li><button id="logoutButton">Logout</button></li>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = "index.html";
            } catch (error){
                console.error("Error logging out", error);
            }
        });

    }else {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="cart.html">Cart</a></li>
            <li><a href="login.html">Login</a></li>
        `;
    }

});