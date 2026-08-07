import {initializeApp} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAR_5sNM_gGvDkhbbTG9aSK0xorGp3EPuU",
    authDomain: "urbanthreadsstore-45857.firebaseapp.com",
    projectId: "urbanthreadsstore-45857",
    storageBucket: "urbanthreadsstore-45857.firebasestorage.app",
    messagingSenderId: "979799075182",
    appId: "1:979799075182:web:cd990336036938effe397f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth};