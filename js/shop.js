import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const productsGrid = document.getElementById("productsGrid");
const searchBar = document.getElementById("searchBar");
const filterButtons = document.querySelectorAll(".filter-btn");


let allProducts = [];
let currentCategory = "All";


// Fetch products from Firestore
async function fetchProducts() {

    try {

        const productsSnapshot = await getDocs(
            collection(db, "products")
        );

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
            <p>Unable to load products.</p>
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
            <img src="${product.imageURL}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p class="price"> R${product.price} </p>

            <p> ${product.description} </p>

            <button class="btn"> Add to Cart </button>
        `;

        productsGrid.appendChild(productCard);

    });
}


// Filter products
function filterProducts() {

    const searchTerm = searchBar.value.toLowerCase().trim();


    const filteredProducts = allProducts.filter((product) => {

        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;


        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);


        return matchesCategory && matchesSearch;

    });


    displayProducts(filteredProducts);
}


// Search
searchBar.addEventListener("input", () => {

    filterProducts();

});


// Category buttons
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        currentCategory = button.dataset.category;


        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        filterProducts();

    });

});


// Start
fetchProducts();