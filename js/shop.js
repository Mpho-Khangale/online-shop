import { db, auth } from "./firebase.js";

import {
    collection, getDocs, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const productsGrid = document.getElementById("productsGrid");
const searchBar = document.getElementById("searchBar");
const filterButtons = document.querySelectorAll(".filter-btn");

let allProducts = [];
let currentCategory = "All";


// Fetch products from Firestore
async function fetchProducts() {

    try {

        const productsSnapshot = await getDocs(collection(db, "products"));

        allProducts = [];

        productsSnapshot.forEach((doc) => {

            const product = doc.data();

            allProducts.push({
                id: doc.id,
                ...product
            });

        });

        displayProducts(allProducts);

    } catch (error) {

        console.error("Error fetching products:", error);

        productsGrid.innerHTML = `
            <p>Failed to load products. Please try again later.</p>
        `;
    }
}


// Display products
function displayProducts(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;

        return;
    }


    products.forEach((product) => {

        const productCard = document.createElement("div");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img
                src="${product.imageURL}"
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <p class="price">
                R${product.price}
            </p>

            <p>
                ${product.description}
            </p>

            <button
                class="btn add-to-cart"
                data-id="${product.id}"
            >
                Add to Cart
            </button>
        `;

        productsGrid.appendChild(productCard);

    });


    // Add click events to Add to Cart buttons
    const addToCartButtons =
        document.querySelectorAll(".add-to-cart");


    addToCartButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const productId =
                button.dataset.id;

            addToCart(productId);

        });

    });

}


// Add product to user's Firestore cart
async function addToCart(productId) {

    // Check if user is logged in
    if (!auth.currentUser) {

        alert("Please log in before adding items to your cart.");

        window.location.href = "login.html";

        return;
    }


    try {

        const userId = auth.currentUser.uid;

        const product =
            allProducts.find(
                (item) => item.id === productId
            );


        if (!product) {

            console.error("Product not found.");

            return;
        }


        // Reference to user's cart item
        const cartItemRef = doc(db, "users", userId, "cart", productId);


        // Check whether product is already in cart
        const cartItemSnapshot =
            await getDoc(cartItemRef);


        if (cartItemSnapshot.exists()) {

            const existingItem = cartItemSnapshot.data();


            await setDoc(cartItemRef, {

                ...existingItem,

                quantity: existingItem.quantity + 1

            });

        } else {

            await setDoc(cartItemRef, {

                productId: product.id,

                name: product.name,

                price: product.price,

                imageURL: product.imageURL,

                quantity: 1

            });

        }


        alert(`${product.name} added to cart!`);


    } catch (error) {

        console.error(
            "Error adding product to cart:",
            error
        );

    }

}


// Filter products
function filterProducts() {

    const searchTerm =
        searchBar.value.toLowerCase().trim();


    const filteredProducts =
        allProducts.filter((product) => {

            const matchesCategory =
                currentCategory === "All" ||
                product.category === currentCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                product.description
                    .toLowerCase()
                    .includes(searchTerm);


            return matchesCategory && matchesSearch;

        });


    displayProducts(filteredProducts);

}


// Search products
searchBar.addEventListener("input", () => {

    filterProducts();

});


// Category buttons
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        currentCategory =
            button.dataset.category;


        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        filterProducts();

    });

});


// Start
fetchProducts();