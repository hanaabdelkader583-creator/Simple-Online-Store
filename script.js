let products = []; 

$(document).ready(function() {
    console.log("jQuery Loaded & Document Ready");
    
    // Initialize Store
    initStore();
    
    // Mobile Menu Toggle
    $('#mobileMenuBtn').on('click', function() {
        $('#navMenu').toggleClass('active');
    });

    $(document).on('click', '.add-to-cart-btn', function() {
        const id = $(this).data('id');
        addToCart(id);
    });

    $(document).on('click', '.qty-btn', function() {
        const id = $(this).data('id');
        const change = $(this).data('change'); // +1 or -1
        const currentQty = parseInt($(this).siblings('.quantity-display').text());
        updateQuantity(id, currentQty + change);
    });

    $(document).on('click', '.remove-btn', function() {
        const id = $(this).data('id');
        removeFromCart(id);
    });

    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        filterProducts(category);
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });

    $(document).on('click', '#placeOrderBtn', function() {
        placeOrder();
    });

    $('#openAddProductBtn').on('click', openAddProductModal);
    $('.modal-close').on('click', closeProductModal);
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });

    $(document).on('click', '.edit-product-btn', function() {
        const id = $(this).data('id');
        editProduct(id);
    });
    
    $(document).on('click', '.delete-product-btn', function() {
        const id = $(this).data('id');
        deleteProduct(id);
    });
});

// --- 2. DATA FETCHING  ---
function initStore() {
    $.get('server.php?action=get_products', function(data) {
        products = data; 
        
        if ($('#productGrid').length || $('#bestSellers').length) displayProducts(); 
        if ($('#cartContainer').length) displayCart();
        if ($('#checkoutContainer').length) displayCheckout();
        if ($('#adminGrid').length) displayAdminGrid();

        updateCartBadge();
    }).fail(function() {
        console.error("Error loading products");
    });
}

// --- 3. DISPLAY LOGIC ---
function displayProducts(filterCategory = 'All') {

    if ($('#bestSellers').length) {
        const bestSellersHTML = products.slice(0, 4).map(p => createProductCard(p)).join('');
        $('#bestSellers').html(bestSellersHTML);
    }

    // Product Grid (Products Page)
    if ($('#productGrid').length) {
        const filtered = filterCategory === 'All' 
            ? products 
            : products.filter(p => p.category === filterCategory);
            
        const gridHTML = filtered.map(p => createProductCard(p)).join('');
        $('#productGrid').html(gridHTML);
    }
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" class="product-image" onerror="this.src='https://via.placeholder.com/150'">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <button class="btn btn-primary add-to-cart-btn" style="width: 100%;" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>`;
}

// --- 4. CART ACTIONS ---
function addToCart(productId) {
    productId = parseInt(productId);
    let cartString = localStorage.getItem('cart');
    cartString = cartString ? cartString + "," + productId : String(productId);
    localStorage.setItem('cart', cartString);
    showToast("Added to cart!", "success");
    updateCartBadge();
}

function getCart() {
    const cartString = localStorage.getItem('cart');
    if (!cartString) return [];
    const cartIds = cartString.split(',').map(id => parseInt(id));
    
    let cartMap = {};
    cartIds.forEach(id => { cartMap[id] = (cartMap[id] || 0) + 1; });

    let finalCart = [];
    Object.keys(cartMap).forEach(idStr => {
        let id = parseInt(idStr);
        let product = products.find(p => parseInt(p.id) === id);
        if (product) {
            let item = {...product}; 
            item.quantity = cartMap[id];
            finalCart.push(item);
        }
    });
    return finalCart;
}

function displayCart() {
    const cart = getCart();
    const $container = $('#cartContainer');

    if (cart.length === 0) {
        $container.html(`
            <div class="cart-empty">
                <h2>Your cart is empty</h2>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `);
        return;
    }

    let subtotal = 0;
    const itemsHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn qty-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn qty-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>`;
    }).join('');

    const shipping = 10;
    const total = subtotal + shipping;

    $container.html(`
        <h1 class="section-title">Shopping Cart</h1>
        <div class="cart-items">${itemsHTML}</div>
        <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-row"><span>Shipping:</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="summary-row summary-total"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
            <a href="checkout.html" class="btn btn-primary" style="width: 100%; display:block; text-align:center; margin-top:1rem;">Proceed to Checkout</a>
        </div>
    `);
}

function updateQuantity(id, newQty) {
    let cartString = localStorage.getItem('cart');
    if (!cartString) return;
    
    let currentIds = cartString.split(',').map(x => parseInt(x));
    currentIds = currentIds.filter(x => x !== id);
    
    for(let i=0; i<newQty; i++) {
        currentIds.push(id);
    }
    
    if(currentIds.length === 0) localStorage.removeItem('cart');
    else localStorage.setItem('cart', currentIds.join(','));
    
    displayCart();
    updateCartBadge();
}

function removeFromCart(idToRemove) {
    let cartString = localStorage.getItem('cart');
    if (!cartString) return;
    let newIds = cartString.split(',').map(id => parseInt(id)).filter(id => id !== idToRemove);
    
    if (newIds.length === 0) localStorage.removeItem('cart');
    else localStorage.setItem('cart', newIds.join(','));
    
    displayCart();
    updateCartBadge();
}

// --- 5. CHECKOUT ---
function displayCheckout() {
    const cart = getCart();
    const $container = $('#checkoutContainer');
    
    if (cart.length === 0) {
        $container.html('<h2>Cart is empty</h2><a href="products.html" class="btn btn-primary">Go Shopping</a>');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 10; // Shipping
    
    $container.html(`
        <div class="checkout-container">
            <div class="checkout-section">
                <h2>Shipping Info</h2>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="c_name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="c_email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="c_address" class="form-control" required>
                    </div>
                    <button type="button" id="placeOrderBtn" class="btn btn-primary" style="width: 100%;">
                        Confirm & Pay $${total.toFixed(2)}
                    </button>
                </form>
            </div>
            <div class="checkout-section">
                <h2>Order Summary</h2>
                <p>Items: ${cart.length}</p>
                <h3>Total: $${total.toFixed(2)}</h3>
            </div>
        </div>
    `);
}

function placeOrder() {
    const name = $('#c_name').val().trim();
    const email = $('#c_email').val().trim();
    const address = $('#c_address').val().trim();
    
    // Validation
    if(!name || !email || !address) {
        showToast("Please fill all fields!", "error");
        return;
    }

    // Regex Email Check
    if (!isValidEmail(email)) {
        showToast("Invalid Email Format for Order", "error");
        return;
    }

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 10;
    const orderDetails = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

    $.post('server.php?action=place_order', {
        name: name,
        email: email,
        address: address,
        total: total,
        details: orderDetails
    }, function(data) {
        if(data.status === "success") {
            showToast("Order Placed Successfully!", "success");
            localStorage.removeItem('cart');
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            showToast("Error: " + data.message, "error");
        }
    }, 'json').fail(function() {
        showToast("Connection Error", "error");
    });
}

// --- 6. AUTHENTICATION (AJAX) ---
function handleRegister() {
    const name = $('#signupName').val().trim();
    const email = $('#signupEmail').val().trim();
    const password = $('#signupPassword').val();

    // 1. Regex Validation for Name (Letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        showToast("Name must contain letters only", "error");
        return;
    }

    // 2. Regex Validation for Email
    if (!isValidEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    // 3. Password Length Validation
    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    const formData = { name: name, email: email, password: password };

    $.post('server.php?action=register', formData, function(data) {
        if(data.status === "success") {
            showToast(data.message, 'success');
            $('#signupForm')[0].reset(); 
        } else {
            showToast(data.message, 'error');
        }
    }, 'json');
}

function handleLogin() {
    const formData = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
    };

    $.post('server.php?action=login', formData, function(data) {
        if(data.status === "success") {
            showToast(data.message, 'success');
            localStorage.setItem('currentUser', JSON.stringify({
                name: data.user.full_name,
                email: formData.email
            }));
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } else {
            showToast(data.message, 'error');
        }
    }, 'json');
}

// --- 7. ADMIN FUNCTIONS ---
function displayAdminGrid() {
    const html = products.map(p => `
        <div class="admin-card">
            <img src="${p.image}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 1rem;">
            <h3>${p.name}</h3>
            <p>${p.category} - $${parseFloat(p.price).toFixed(2)}</p>
            <div class="admin-actions">
                <button class="btn btn-secondary edit-product-btn" data-id="${p.id}">Edit</button>
                <button class="btn btn-danger delete-product-btn" data-id="${p.id}">Delete</button>
            </div>
        </div>
    `).join('');
    $('#adminGrid').html(html);
}

function openAddProductModal() {
    $('#productForm')[0].reset();
    $('#productId').val(''); 
    $('#modalTitle').text('Add New Product');
    $('#productModal').addClass('active');
}

function closeProductModal() {
    $('#productModal').removeClass('active');
}

function editProduct(id) {
    const p = products.find(prod => parseInt(prod.id) === parseInt(id));
    if(!p) return;
    
    $('#productId').val(p.id);
    $('#productName').val(p.name);
    $('#productCategory').val(p.category);
    $('#productPrice').val(p.price);
    $('#productImage').val(p.image);
    $('#modalTitle').text('Edit Product');
    $('#productModal').addClass('active');
}

function saveProduct() {
    const id = $('#productId').val();
    const formData = {
        name: $('#productName').val(),
        category: $('#productCategory').val(),
        price: $('#productPrice').val(),
        image: $('#productImage').val()
    };
    
    let url = 'server.php?action=add_product';
    if(id) {
        formData.id = id;
        url = 'server.php?action=update_product';
    }

    $.post(url, formData, function(data) {
        if(data.status === "success") {
            alert(data.message); 
            window.location.reload(); 
        } else {
            alert("Server Error: " + data.message);
        }
    }, 'json');
}

function deleteProduct(id) {
    if(confirm("Are you sure?")) {
        $.post('server.php?action=delete_product', {id: id}, function(data) {
            alert(data.message);
            window.location.reload();
        }, 'json');
    }
}

// --- 8. UTILS ---
function filterProducts(category) {
    displayProducts(category);
}

function updateCartBadge() {
    const count = localStorage.getItem('cart') ? localStorage.getItem('cart').split(',').length : 0;
    $('#cartBadge').text(count);
}

function showToast(msg, type) {
    let $container = $('#toastContainer');
    if ($container.length === 0) {
        $('body').append('<div id="toastContainer" class="toast-container"></div>');
        $container = $('#toastContainer');
    }
    
    const $toast = $('<div>').text(msg)
        .addClass('toast')
        .addClass(type)
        .css({
            padding: '15px 25px',
            marginBottom: '10px',
            borderRadius: '5px',
            color: '#fff',
            backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        });
        
    $container.append($toast);
    setTimeout(() => $toast.remove(), 3000);
}
function isValidEmail(email) {
    // Standard Email Regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}