document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // REVEAL ON SCROLL
    // =============================================
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 120;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // =============================================
    // STICKY HEADER
    // =============================================
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = '';
            return;
        }
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'rgba(0,0,0,0.85)';
            header.style.backdropFilter = 'blur(12px)';
        }
        lastScroll = currentScroll;
    });

    // =============================================
    // PAGE HERO LOAD ANIMATION
    // =============================================
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) setTimeout(() => pageHero.classList.add('loaded'), 80);

    // =============================================
    // MOUSE TRACKING
    // =============================================
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // =============================================
    // FILTER TABS
    // =============================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // =============================================
    // ACTIVE NAV HIGHLIGHT
    // =============================================
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPath) link.style.opacity = '0.5';
    });

    // =============================================
    // CART STATE
    // =============================================
    let cart = loadCart();

    function saveCart() {
        localStorage.setItem('archetype-cart', JSON.stringify(cart));
    }

    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem('archetype-cart')) || [];
        } catch {
            return [];
        }
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function updateCartCountUI() {
        const countEl = document.getElementById('cart-count');
        if (countEl) countEl.textContent = getCartCount();
    }

    function addToCart(product, size) {
        const existing = cart.find(i => i.id === product.id && i.size === size);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                qty: 1
            });
        }
        saveCart();
        updateCartCountUI();
        renderCartItems();
    }

    function removeFromCart(id, size) {
        cart = cart.filter(i => !(i.id === id && i.size === size));
        saveCart();
        updateCartCountUI();
        renderCartItems();
    }

    function changeQty(id, size, delta) {
        const item = cart.find(i => i.id === id && i.size === size);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id, size);
        } else {
            saveCart();
            updateCartCountUI();
            renderCartItems();
        }
    }

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">&#9675;</div>
                    <p>Your cart is empty</p>
                </div>`;
            if (subtotalEl) subtotalEl.textContent = '0€';
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-price">${item.price * item.qty}€</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn" data-id="${item.id}" data-size="${item.size}" data-delta="-1">−</button>
                        <span class="cart-qty-num">${item.qty}</span>
                        <button class="cart-qty-btn" data-id="${item.id}" data-size="${item.size}" data-delta="1">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
                </div>
            </div>
        `).join('');

        if (subtotalEl) subtotalEl.textContent = `${getCartTotal()}€`;

        // Qty buttons
        container.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                changeQty(btn.dataset.id, btn.dataset.size, parseInt(btn.dataset.delta));
            });
        });

        // Remove buttons
        container.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id, btn.dataset.size);
            });
        });
    }

    // =============================================
    // CART DRAWER
    // =============================================
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartClose = document.getElementById('cart-close');
    const cartContinueBtn = document.getElementById('cart-continue-btn');
    const cartTrigger = document.getElementById('cart-trigger');

    function openCart() {
        if (!cartOverlay) return;
        renderCartItems();
        cartOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (!cartOverlay) return;
        cartOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (cartTrigger) cartTrigger.addEventListener('click', e => { e.preventDefault(); openCart(); });
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartContinueBtn) cartContinueBtn.addEventListener('click', closeCart);

    // =============================================
    // QUICK VIEW MODAL
    // =============================================
    const qvOverlay = document.getElementById('qv-overlay');
    const qvBackdrop = document.getElementById('qv-backdrop');
    const qvClose = document.getElementById('qv-close');
    const qvImg = document.getElementById('qv-img');
    const qvBadge = document.getElementById('qv-badge');
    const qvName = document.getElementById('qv-name');
    const qvPrice = document.getElementById('qv-price');
    const qvDesc = document.getElementById('qv-desc');
    const qvSizes = document.getElementById('qv-sizes');
    const qvAddBtn = document.getElementById('qv-add-btn');
    const qvSizeError = document.getElementById('qv-size-error');

    let currentProduct = null;
    let selectedSize = null;

    function openQV(card) {
        currentProduct = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseInt(card.dataset.price),
            badge: card.dataset.badge || '',
            desc: card.dataset.desc,
            sizes: card.dataset.sizes ? card.dataset.sizes.split(',') : [],
            image: card.dataset.image
        };
        selectedSize = null;

        // Populate modal
        qvImg.src = currentProduct.image;
        qvImg.alt = currentProduct.name;
        qvName.textContent = currentProduct.name;
        qvPrice.textContent = `${currentProduct.price}€`;
        qvDesc.textContent = currentProduct.desc;
        qvBadge.textContent = currentProduct.badge;

        // Size buttons
        qvSizes.innerHTML = currentProduct.sizes.map(s =>
            `<button class="qv-size-btn" data-size="${s}">${s}</button>`
        ).join('');

        qvSizes.querySelectorAll('.qv-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                qvSizes.querySelectorAll('.qv-size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = btn.dataset.size;
                qvSizeError.classList.remove('visible');
                qvAddBtn.classList.remove('added');
                qvAddBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Add to Cart`;
            });
        });

        // Reset add button state
        qvSizeError.classList.remove('visible');
        qvAddBtn.classList.remove('added');
        qvAddBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Add to Cart`;

        qvOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeQV() {
        if (!qvOverlay) return;
        qvOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Bind product cards
    document.querySelectorAll('.collection-page-grid .product-card').forEach(card => {
        card.addEventListener('click', () => openQV(card));
    });

    if (qvBackdrop) qvBackdrop.addEventListener('click', closeQV);
    if (qvClose) qvClose.addEventListener('click', closeQV);

    // Add to cart from modal
    if (qvAddBtn) {
        qvAddBtn.addEventListener('click', () => {
            if (!selectedSize) {
                qvSizeError.classList.add('visible');
                return;
            }
            addToCart(currentProduct, selectedSize);

            // Confirmation feedback
            qvAddBtn.classList.add('added');
            qvAddBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Added to Cart`;

            // Close QV and open Cart after short delay
            setTimeout(() => {
                closeQV();
                setTimeout(() => openCart(), 350);
            }, 700);
        });
    }

    // Escape key closes both overlays
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeQV();
            closeCart();
        }
    });

    // Init cart count
    updateCartCountUI();
});
