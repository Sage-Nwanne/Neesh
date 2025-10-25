(function () {
    const mainImgs = Array.from(document.querySelectorAll(".main-img"));
    const thumbs = Array.from(document.querySelectorAll(".thumb"));
    const prevBtn = document.querySelector(".arrow.prev");
    const nextBtn = document.querySelector(".arrow.next");
    const thumbsContainer = document.querySelector(".thumbs");

    let current = 0;
    const total = mainImgs.length;

    mainImgs.forEach((img, i) => (img.id = `main-image-${i}`));

    function showIndex(idx, direction) {
        if (idx < 0) idx = total - 1;
        if (idx >= total) idx = 0;
        if (idx === current) return;

        const old = current;
        current = idx;

        mainImgs.forEach((img, i) => {
            if (i === current) {
                img.style.opacity = "1";
                img.style.transform = "scale(1)";
            } else {
                img.style.opacity = "0";
                img.style.transform = "scale(1)";
            }
        });

        thumbs.forEach((t, i) => {
            t.classList.toggle("active", i === current);
            t.setAttribute("aria-selected", i === current ? "true" : "false");
        });

        const activeThumb = thumbs[current];
        if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
            activeThumb.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }

    thumbsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".thumb");
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        showIndex(idx);
    });

    prevBtn.addEventListener("click", () => showIndex(current - 1));
    nextBtn.addEventListener("click", () => showIndex(current + 1));

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            showIndex(current - 1);
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            showIndex(current + 1);
        }
    });

    document.querySelector(".main-viewport").addEventListener("click", (e) => {
        if (e.target.closest(".arrow")) return;
        showIndex(current + 1);
    });

    showIndex(0);
})();

(function () {
    function toCents(v) {
        if (typeof v === "string") v = v.replace(/[^0-9.-]+/g, "") || "0";
        return Math.round(Number(v) * 100);
    }
    function formatMoney(cents) {
        return (
            "$" +
            (cents / 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }
    function escapeHtml(str) {
        return String(str || "").replace(
            /[&<>"'`=\/]/g,
            (s) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;",
                    "`": "&#x60;",
                    "=": "&#x3D;",
                }[s])
        );
    }

    const CART_KEY = "cart_v1";
    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            if (!raw) return { items: [] };
            const parsed = JSON.parse(raw);
            if (!parsed.items || !Array.isArray(parsed.items))
                return { items: [] };
            return parsed;
        } catch (e) {
            console.error("cart load error", e);
            return { items: [] };
        }
    }

    function saveCart(cart) {
        cart.updatedAt = new Date().toISOString();
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCountUI(cart);

        try {
            window.dispatchEvent(new Event("cart.updated"));
            localStorage.setItem("___cart_sync_ping", Date.now().toString());
            localStorage.removeItem("___cart_sync_ping");
        } catch (e) {}
    }

    function findItemIndex(cart, id) {
        return cart.items.findIndex((x) => x.id === id);
    }
    function addToCart(product, qty) {
        qty = Math.max(1, Math.floor(Number(qty) || 1));
        const cart = loadCart();
        const idx = findItemIndex(cart, product.id);
        if (idx > -1) {
            cart.items[idx].qty += qty;
        } else {
            cart.items.push({
                id: product.id,
                title: product.title,
                price_cents: product.price_cents,
                qty: qty,
                img: product.img,
            });
        }
        saveCart(cart);
        renderCart();
        openCart();
    }
    function updateItemQty(id, qty) {
        const cart = loadCart();
        const idx = findItemIndex(cart, id);
        if (idx === -1) return;
        cart.items[idx].qty = Math.floor(qty);
        if (cart.items[idx].qty <= 0) cart.items.splice(idx, 1);
        saveCart(cart);
        renderCart();
    }
    function removeItem(id) {
        const cart = loadCart();
        const idx = findItemIndex(cart, id);
        if (idx === -1) return;
        cart.items.splice(idx, 1);
        saveCart(cart);
        renderCart();
    }
    function clearCart() {
        const cart = { items: [] };
        saveCart(cart);
        renderCart();
    }
    function calculateSubtotal(cart) {
        return cart.items.reduce((acc, it) => acc + it.price_cents * it.qty, 0);
    }

    function renderCart() {
        const cart = loadCart();
        const container =
            document.getElementById("cartItems") ||
            document.querySelector(".cart-items");
        if (!container) return;
        container.innerHTML = "";
        if (!cart.items.length) {
            container.innerHTML =
                '<div style="padding:14px;color:#666;">Your cart is empty.</div>';
        } else {
            cart.items.forEach((item) => {
                const itemTotalCents = item.price_cents * item.qty;
                const el = document.createElement("div");
                el.className = "cart-item";
                el.style.display = "flex";
                el.style.gap = "10px";
                el.style.alignItems = "center";
                el.style.padding = "6px 0";
                el.setAttribute("data-id", item.id);
                // Or if you specifically want the APP_URL:
              
                el.innerHTML = `
          <img src="${escapeHtml(item.img || "")}" alt="${escapeHtml(
                    item.title
                )}" style="width:62px;height:62px;object-fit:cover;border-radius:6px;background:#f6f6f6;">
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(
                item.title
            )}</div>

            <div class="cart-actions" style="display:flex;align-items:center;gap:6px;margin-top:10px;border-bottom:1px solid #ddd;padding-bottom:15px;">
              <button class="cart-qty-btn" data-action="decrease" aria-label="Decrease" style="padding:6px 8px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;">−</button>
              <div style="min-width:34px;text-align:center;font-weight:700;">${
                  item.qty
              }</div>
              <button class="cart-qty-btn" data-action="increase" aria-label="Increase" style="padding:6px 8px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;">+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
       <div class="cart-remove" title="Remove">
    <img src="/assets/image/delete.jpg" alt="delete" data-action="remove" data-id="{{ escapeHtml(item.id) }}">
       </div>
             <div style="font-size:13px;color:#444;margin-top:6px;">
              <strong>${formatMoney(itemTotalCents)}</strong>
            </div>
          </div>
        `;
                el.querySelector('[data-action="decrease"]').addEventListener(
                    "click",
                    () => updateItemQty(item.id, item.qty - 1)
                );
                el.querySelector('[data-action="increase"]').addEventListener(
                    "click",
                    () => updateItemQty(item.id, item.qty + 1)
                );
                el.querySelector(".cart-remove").addEventListener("click", () =>
                    removeItem(item.id)
                );
                container.appendChild(el);
            });
        }

        const subtotalCents = calculateSubtotal(cart);
        const subtotalEl =
            document.getElementById("subtotal") ||
            document.querySelector(".cart-subtotal");
        if (subtotalEl) subtotalEl.textContent = formatMoney(subtotalCents);
        updateCartCountUI(cart);
    }

    function updateCartCountUI(cart) {
        const count = cart.items.reduce((acc, it) => acc + it.qty, 0);
        const el =
            document.getElementById("cartCount") ||
            document.querySelector(".cart-count");
        if (el) {
            el.textContent = String(count);
            el.setAttribute("aria-valuenow", String(count));
        }
    }
    window.addEventListener("cart.updated", () => renderCart());
    window.addEventListener("storage", (e) => {
        if (e.key === "cart_v1" || e.key === "checkout__latest_order")
            renderCart();
    });
    window.addEventListener("pageshow", () => renderCart());

    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    function openCart() {
        if (cartDrawer) cartDrawer.style.right = "0";
        if (cartOverlay) {
            cartOverlay.style.opacity = "1";
            cartOverlay.style.pointerEvents = "auto";
            cartOverlay.setAttribute("aria-hidden", "false");
        }
    }
    function closeCart() {
        if (cartDrawer) cartDrawer.style.right = "-420px";
        if (cartOverlay) {
            cartOverlay.style.opacity = "0";
            cartOverlay.style.pointerEvents = "none";
            cartOverlay.setAttribute("aria-hidden", "true");
        }
    }
    document.getElementById("closeCart")?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);

    function buildProductFromNode(node, fallbackIndex) {
        const dataEl =
            node.querySelector?.(".product-data") ||
            document.querySelector(".product-data");
        const data = dataEl?.dataset || {};

        const id =
            data.productId ||
            `product-${fallbackIndex || Date.now()}-${Math.floor(
                Math.random() * 10000
            )}`;
        const title =
            data.productTitle ||
            node
                .querySelector?.(".product_title, .product-title, h1, h2")
                ?.textContent?.trim() ||
            "Untitled Product";
        const price_cents = toCents(
            data.productPrice ||
                node.querySelector?.(".my_margin_price, .product-price, .price")
                    ?.textContent ||
                0
        );
        const img = data.productImg || node.querySelector?.("img")?.src || "";

        return { id, title, price_cents, img };
    }

    function bindAddButtons() {
        const buttons = Array.from(
            document.querySelectorAll("[data-add-to-cart], .add-to-cart")
        );
        buttons.forEach((btn, idx) => {
            if (btn.dataset.bound === "true") return;

            const card =
                btn.closest(
                    ".product, .product-card, .product-item, .product-wrap, .right_container"
                ) || document.body;
            const product = buildProductFromNode(card, idx);

            const qtyContainer = card.querySelector(".quantity-selector");
            if (qtyContainer && !qtyContainer.dataset.bound) {
                const qtyDisplay =
                    qtyContainer.querySelector(".quantity-display");
                const dec = qtyContainer.querySelector(
                    ".quantity-btn.decrease"
                );
                const inc = qtyContainer.querySelector(
                    ".quantity-btn.increase"
                );
                let qty =
                    parseInt(
                        qtyContainer.dataset.quantity ||
                            (qtyDisplay && qtyDisplay.textContent) ||
                            1,
                        10
                    ) || 1;
                function setQty(n) {
                    qty = Math.max(1, Math.floor(Number(n) || 1));
                    qtyContainer.dataset.quantity = qty;
                    if (qtyDisplay) qtyDisplay.textContent = String(qty);
                }
                dec?.addEventListener("click", () => setQty(qty - 1));
                inc?.addEventListener("click", () => setQty(qty + 1));
                qtyContainer.dataset.bound = "true";
            }

            btn.addEventListener("click", function (e) {
                if (e) e.preventDefault();
                let qty = 1;
                const qc = card.querySelector(".quantity-selector");
                const qd = qc?.querySelector(".quantity-display");
                if (qd) {
                    qty =
                        parseInt(qd.textContent, 10) ||
                        parseInt(qc.dataset.quantity, 10) ||
                        1;
                } else {
                    const globalQty = document.getElementById("quantity");
                    if (globalQty)
                        qty =
                            parseInt(
                                globalQty.textContent || globalQty.value,
                                10
                            ) || 1;
                }

                addToCart(product, qty);

                try {
                    btn.animate(
                        [
                            { transform: "translateY(0)" },
                            { transform: "translateY(-6px)" },
                            { transform: "translateY(0)" },
                        ],
                        { duration: 200 }
                    );
                } catch (e) {}
            });

            btn.dataset.bound = "true";
        });
    }

    function bindProductPageControls() {
        const decreaseBtn = document.getElementById("decrease");
        const increaseBtn = document.getElementById("increase");
        const quantityDisplay = document.getElementById("quantity");
        const addBtn = document.querySelector(".add-to-cart:not([data-bound])");

        let quantity =
            parseInt(quantityDisplay?.textContent || quantityDisplay?.value) ||
            1;
        function setQuantity(n) {
            quantity = Math.max(1, Math.floor(Number(n) || 1));
            if (quantityDisplay) {
                if (quantityDisplay.tagName === "INPUT")
                    quantityDisplay.value = quantity;
                else quantityDisplay.textContent = quantity;
            }
        }

        decreaseBtn?.addEventListener("click", () => setQuantity(quantity - 1));
        increaseBtn?.addEventListener("click", () => setQuantity(quantity + 1));

        if (addBtn) {
            addBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const product = buildProductFromNode(document.body, "single");
                addToCart(product, quantity);
            });
            addBtn.dataset.bound = "true";
        }
    }

    function watchForNewCards() {
        const container =
            document.querySelector(".collection-grid, .products-grid, .grid") ||
            document.body;
        try {
            const mo = new MutationObserver(() => bindAddButtons());
            mo.observe(container, { childList: true, subtree: true });
        } catch (e) {}
    }

    (function init() {
        const existing = loadCart();
        if (!existing || !Array.isArray(existing.items))
            saveCart({ items: [] });
        renderCart();
        bindAddButtons();
        bindProductPageControls();
        watchForNewCards();
    })();

    window.__miniCart = {
        loadCart,
        saveCart,
        addToCart,
        renderCart,
        clearCart,
        openCart,
        closeCart,
    };
})();

// Bookmark functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');

    if (bookmarkBtn) {
        const magazineId = bookmarkBtn.dataset.magazineId;

        // Check if magazine is already bookmarked
        fetch(`/bookmarks/${magazineId}/check`)
            .then(response => response.json())
            .then(data => {
                if (data.bookmarked) {
                    bookmarkBtn.classList.add('bookmarked');
                    bookmarkBtn.querySelector('span').textContent = 'Bookmarked';
                }
            })
            .catch(error => console.error('Error checking bookmark status:', error));

        // Handle bookmark toggle
        bookmarkBtn.addEventListener('click', function(e) {
            e.preventDefault();

            fetch(`/bookmarks/${magazineId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.bookmarked) {
                        bookmarkBtn.classList.add('bookmarked');
                        bookmarkBtn.querySelector('span').textContent = 'Bookmarked';
                    } else {
                        bookmarkBtn.classList.remove('bookmarked');
                        bookmarkBtn.querySelector('span').textContent = 'Bookmark';
                    }
                }
            })
            .catch(error => console.error('Error toggling bookmark:', error));
        });
    }

    // Share/Copy Info functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const magazineId = this.dataset.magazineId;
            const magazineTitle = this.dataset.magazineTitle;
            const shareUrl = `${window.location.origin}/magazine/${magazineId}`;

            // Try Web Share API first (for mobile and modern browsers)
            if (navigator.share) {
                navigator.share({
                    title: magazineTitle,
                    text: `Check out this magazine: ${magazineTitle}`,
                    url: shareUrl
                }).catch(err => console.log('Share cancelled or failed:', err));
            } else {
                // Fallback: Show modal with shareable link and copy button
                showShareModal(magazineTitle, shareUrl);
            }
        });
    }
});

// Share modal functionality
function showShareModal(title, url) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'share-modal-overlay';
    modal.innerHTML = `
        <div class="share-modal">
            <div class="share-modal-header">
                <h3>Share "${title}"</h3>
                <button class="share-modal-close">&times;</button>
            </div>
            <div class="share-modal-content">
                <p>Share this magazine with others:</p>
                <div class="share-link-container">
                    <input type="text" class="share-link-input" value="${url}" readonly>
                    <button class="share-copy-btn">Copy Link</button>
                </div>
                <div class="share-social">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-social-btn facebook">
                        <i class="fab fa-facebook"></i> Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out: ' + title)}" target="_blank" class="share-social-btn twitter">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="share-social-btn linkedin">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle close button
    const closeBtn = modal.querySelector('.share-modal-close');
    closeBtn.addEventListener('click', () => modal.remove());

    // Handle overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Handle copy button
    const copyBtn = modal.querySelector('.share-copy-btn');
    const linkInput = modal.querySelector('.share-link-input');
    copyBtn.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
        }, 2000);
    });
}
