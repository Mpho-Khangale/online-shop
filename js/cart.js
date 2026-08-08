import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");


let currentUser = null;


// Check authentication
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }


    currentUser = user;

    loadCart();

});


// Load cart
async function loadCart() {

    try {

        const cartReference = collection(
            db,
            "users",
            currentUser.uid,
            "cart"
        );


        const cartSnapshot =
            await getDocs(cartReference);


        cartItems.innerHTML = "";

        let total = 0;


        if (cartSnapshot.empty) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>

                    <p>
                        Add some products from the shop!
                    </p>
                </div>
            `;

            cartTotal.textContent = "R0";

            return;
        }


        cartSnapshot.forEach((doc) => {

            const product = doc.data();


            const itemTotal =
                product.price * product.quantity;


            total += itemTotal;


            const cartItem =
                document.createElement("div");


            cartItem.classList.add("cart-item");


            cartItem.innerHTML = `

                <img
                    src="${product.imageURL}"
                    alt="${product.name}"
                >


                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <p class="cart-item-price">
                        R${product.price}
                    </p>


                    <p class="cart-item-quantity">
                        Quantity: ${product.quantity}
                    </p>

                </div>


                <button
                    class="remove-btn"
                    data-id="${doc.id}"
                >
                    Remove
                </button>

            `;


            cartItems.appendChild(cartItem);

        });


        cartTotal.textContent =
            `R${total.toFixed(2)}`;


    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );


        cartItems.innerHTML = `
            <p>
                Unable to load your cart.
            </p>
        `;

    }

}