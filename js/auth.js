import {auth} from "./firebase.js";
import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user.email);

    }else {
        console.log("No user is signed in.");
    }
});

export async function logoutUser() {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error signing out:", error);
    }
}