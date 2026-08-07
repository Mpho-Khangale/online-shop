import {db} from "./firebase.js";

import {collection, getDocs} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const productsGrid = document.getElementById("productsGrid");

async function fetchProducts() {
    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        productsGrid.innerHTML = ""; // Clear existing products
        productsSnapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.imageURL}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">R${product.price}</p>
                <button class="btn">Add to Cart</button>
            `;
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching products:", error);

        productGrid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

fetchProducts();