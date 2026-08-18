// ===============================
// SHOPPING CART SYSTEM
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// SAVE CART
// ===============================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(name, price, image = "") {

    // Agar price string mein Rs. waghera ho
    price = Number(String(price).replace(/[^0-9.]/g, ""));

    let existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    // Cart open
    openCart();

    alert(name + " added to cart! 🛒");
}


// ===============================
// OPEN CART
// ===============================

function openCart() {

    const cartSidebar = document.getElementById("cart-sidebar");

    if (cartSidebar) {
        cartSidebar.classList.add("active");
    }

}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {

    const cartSidebar = document.getElementById("cart-sidebar");

    if (cartSidebar) {
        cartSidebar.classList.remove("active");
    }

}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🛒
            </p>
        `;

        if (cartTotal) {
            cartTotal.textContent = "0";
        }

        updateCartCount();

        return;
    }


    // Products
    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        count += item.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img 
                    src="${item.image || 'https://via.placeholder.com/80'}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        Rs. ${item.price.toLocaleString()}
                    </p>


                    <div class="quantity-box">

                        <button 
                            onclick="decreaseQuantity(${index})"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button 
                            onclick="increaseQuantity(${index})"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    });


    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }


    updateCartCount();

}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });


    // Agar cart-count hai
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }


    // Agar cart badge hai
    const cartBadge = document.querySelector(".cart-count");

    if (cartBadge) {
        cartBadge.textContent = count;
    }

}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(index) {

    if (cart[index]) {

        cart[index].quantity += 1;

        saveCart();
        updateCart();

    }

}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(index) {

    if (!cart[index]) return;


    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }


    saveCart();
    updateCart();

}


// ===============================
// REMOVE PRODUCT
// ===============================

function removeFromCart(index) {

    if (cart[index]) {

        cart.splice(index, 1);

        saveCart();
        updateCart();

    }

}


// ===============================
// CHECKOUT
// ===============================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty! 🛒");
        return;

    }


    const checkoutOverlay =
        document.getElementById("checkoutOverlay");


    if (checkoutOverlay) {

        checkoutOverlay.classList.add("active");

        loadCheckoutItems();

    }

}


// ===============================
// CLOSE CHECKOUT
// ===============================

function closeCheckout() {

    const checkoutOverlay =
        document.getElementById("checkoutOverlay");


    if (checkoutOverlay) {

        checkoutOverlay.classList.remove("active");

    }

}


// ===============================
// CHECKOUT PRODUCTS
// ===============================

function loadCheckoutItems() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    if (!checkoutItems) return;


    checkoutItems.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total += item.price * item.quantity;


        checkoutItems.innerHTML += `

            <div class="checkout-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    Rs. ${(item.price * item.quantity).toLocaleString()}
                </strong>

            </div>

        `;

    });


    if (checkoutTotal) {

        checkoutTotal.textContent =
            total.toLocaleString();

    }

}


// ===============================
// PLACE ORDER
// ===============================

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener("submit", function(e) {

        e.preventDefault();


        // Customer information

        const name =
            document.getElementById("customerName")?.value.trim();


        const phone =
            document.getElementById("customerPhone")?.value.trim();


        const address =
            document.getElementById("customerAddress")?.value.trim();


        if (!name || !phone || !address) {

            alert("Please fill all details.");

            return;

        }


        // Calculate total

        let total = 0;


        cart.forEach(item => {

            total += item.price * item.quantity;

        });


        // Create order

        const order = {

            id:
                "ORD-" +
                Date.now(),

            customerName: name,

            phone: phone,

            address: address,

            products: [...cart],

            total: total,

            date:
                new Date().toLocaleString(),

            status: "Pending"

        };


        // Get old orders

        let orders =
            JSON.parse(
                localStorage.getItem("orders")
            ) || [];


        // Add new order

        orders.push(order);


        // Save orders

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );


        // Success message

        alert(
            "Order successfully placed! 🎉\n\n" +
            "Order ID: " +
            order.id
        );


        // Clear cart

        cart = [];

        saveCart();

        updateCart();


        // Close checkout

        closeCheckout();

        closeCart();


        // Reset form

        orderForm.reset();

    });

}


// ===============================
// ADD TO CART BUTTONS
// ===============================

document.addEventListener("DOMContentLoaded", function() {

    updateCart();


    // Cart button
    const cartButtons =
        document.querySelectorAll(
            ".cart-button, .cart-btn"
        );


    cartButtons.forEach(button => {

        button.addEventListener("click", function(e) {

            e.preventDefault();

            openCart();

        });

    });


    // Add to Cart buttons
    const addButtons =
        document.querySelectorAll(
            ".product-card button"
        );


    addButtons.forEach(button => {

        const text =
            button.textContent
                .trim()
                .toLowerCase();


        if (text.includes("add to cart")) {

            button.addEventListener(
                "click",
                function(e) {

                    // Agar already inline onclick hai
                    // to duplicate add na ho
                    if (
                        button.getAttribute(
                            "onclick"
                        )
                    ) {
                        return;
                    }


                    const card =
                        button.closest(
                            ".product-card"
                        );


                    if (!card) return;


                    const nameElement =
                        card.querySelector("h3");


                    const priceElement =
                        card.querySelector(
                            ".price"
                        );


                    const imageElement =
                        card.querySelector("img");


                    if (!nameElement) return;


                    const name =
                        nameElement.textContent.trim();


                    let price = 0;


                    if (priceElement) {

                        price =
                            Number(
                                priceElement.textContent
                                    .replace(
                                        /[^0-9.]/g,
                                        ""
                                    )
                            );

                    }


                    const image =
                        imageElement
                            ? imageElement.src
                            : "";


                    addToCart(
                        name,
                        price,
                        image
                    );

                }
            );

        }

    });

});
function searchProduct() {
    let search = document.getElementById("searchInput").value.toLowerCase();

    let products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        let text = product.textContent.toLowerCase();

        if (text.includes(search)) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
}