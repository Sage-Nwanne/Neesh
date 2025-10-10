function showAddress() {
    const addressElements = document.querySelectorAll('.checkout-small');
    const iconElements = document.querySelectorAll('.checkout_editimage_container');
    const addRemoveLinks = document.querySelectorAll('.checkout__add-remove');

    addressElements.forEach((address, index) => {
        const hasAddress = address.textContent.trim() !== '';

        if (iconElements[index]) {
            iconElements[index].style.display = hasAddress ? 'block' : 'none';
        }

        if (addRemoveLinks[index]) {
            addRemoveLinks[index].style.display = hasAddress ? 'none' : 'block';
        }
    });
}

document.addEventListener('DOMContentLoaded', showAddress);

        (function () {
            function toCents(v) {
                if (typeof v === 'number') return Math.round(v);
                if (typeof v === 'string') v = v.replace(/[^0-9.-]+/g, '') || '0';
                return Math.round(Number(v) * 100);
            }
            function formatMoney(cents) {
                return '$' + (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            function escapeHtml(str) { return String(str || '').replace(/[&<>"'`=\/]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' }[s])); }


            function syncCheckoutOrderFromCart() {
  const cart = loadCart();
  let order = (function(){ try{ return JSON.parse(localStorage.getItem('checkout__latest_order')) || {}; }catch(e){return {};}})();

  order.cart = cart;
  order.subtotal_cents = calculateSubtotal(cart);
  order.shipping_cents = order.shipping_cents || SHIPPING_CENTS;
  order.total_cents = Number(order.subtotal_cents || 0) + Number(order.shipping_cents || 0);
  order.updatedAt = new Date().toISOString();

  localStorage.setItem('checkout__latest_order', JSON.stringify(order));
  window.dispatchEvent(new Event('cart.updated'));
}

            
            const CART_KEY = 'cart_v1';
            function loadCart() {
                try {
                    const raw = localStorage.getItem(CART_KEY);
                    if (!raw) return { items: [] };
                    const parsed = JSON.parse(raw);
                    if (!parsed.items || !Array.isArray(parsed.items)) return { items: [] };
                    return parsed;
                } catch (e) {
                    console.error('cart load error', e);
                    return { items: [] };
                }
            }
            function saveCart(cart) {
                cart.updatedAt = new Date().toISOString();
                localStorage.setItem(CART_KEY, JSON.stringify(cart));
                window.dispatchEvent(new Event('cart.updated'));
            }
            function calculateSubtotal(cart) {
                return cart.items.reduce((acc, it) => acc + (Number(it.price_cents || 0) * Number(it.qty || 0)), 0);
            }

            
            const cartListEl = document.getElementById('cartList');
            const cartTitleEl = document.getElementById('cartTitle');
            const subtotalText = document.getElementById('subtotalText');
            const shippingText = document.getElementById('shippingText');
            const totalText = document.getElementById('totalText');

            const SHIPPING_CENTS = 360;

            function renderCart() {
                const cart = loadCart();
                const items = cart.items || [];

                const totalQty = items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
                cartTitleEl.innerHTML = `Cart &nbsp; <small style="color:#000;font-size:16px;font-weight:500;">${totalQty}</small>`;

                cartListEl.innerHTML = '';

                if (!items.length) {
                    cartListEl.innerHTML = '<div style="padding:14px;color:#666;">Your cart is empty.</div>';
                    subtotalText.textContent = formatMoney(0);
                    totalText.textContent = formatMoney(0 + SHIPPING_CENTS);
                    return;
                }

                items.forEach(item => {
                    const itemTotal = Number(item.price_cents || 0) * Number(item.qty || 0);

                    const wrapper = document.createElement('div');
                    wrapper.className = 'cart-item';
                    wrapper.dataset.id = item.id;

                    wrapper.innerHTML = `
          <div class="left-image">
            <img src="${escapeHtml(item.img || '')}" alt="${escapeHtml(item.title)}">
          </div>
          <div class="cart-item-details">
            <div class="top-div">
              <div><strong>${escapeHtml(item.title || '')}</strong></div>
            </div>

            <div class="bottom-div">
              <div class="quantity-control" data-id="${escapeHtml(item.id)}">
                <button class="qty-btn" data-action="decrease" data-id="${escapeHtml(item.id)}">−</button>
                <div class="qty-number" data-role="qty">${escapeHtml(String(item.qty))}</div>
                <button class="qty-btn" data-action="increase" data-id="${escapeHtml(item.id)}">+</button>
              </div>

              <div style="font-weight:700;">${formatMoney(itemTotal)}</div>
            </div>
          </div>
        `;

                    cartListEl.appendChild(wrapper);
                });

                const subtotal = calculateSubtotal(cart);
                subtotalText.textContent = formatMoney(subtotal);
                shippingText.textContent = formatMoney(SHIPPING_CENTS);
                const total = subtotal + SHIPPING_CENTS;
                totalText.textContent = formatMoney(total);
            }


            cartListEl.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const id = e.target.dataset.id;
                if (!action || !id) return;

                const cart = loadCart();
                const idx = cart.items.findIndex(x => x.id === id);
                if (idx === -1) return;

                if (action === 'remove') {
                    cart.items.splice(idx, 1);
                    saveCart(cart);
                    renderCart();
                    syncCheckoutOrderFromCart();
                    return;
                }

                if (action === 'decrease' || action === 'increase') {
                    let qty = Number(cart.items[idx].qty || 0);
                    qty = action === 'increase' ? qty + 1 : qty - 1;
                    qty = Math.max(0, Math.floor(qty));
                    if (qty <= 0) {
                        cart.items.splice(idx, 1);
                    } else {
                        cart.items[idx].qty = qty;
                    }
                    saveCart(cart);
                    renderCart();
                    syncCheckoutOrderFromCart();
                    return;
                }
            });


            cartListEl.addEventListener('dblclick', (e) => {
                const el = e.target.closest('[data-role="qty"]');
                if (!el) return;
                const id = el.closest('.quantity-control')?.dataset.id;
                if (!id) return;

                const current = parseInt(el.textContent, 10) || 1;
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 1;
                input.value = current;
                input.style.width = '60px';
                input.style.fontWeight = '700';

                // replace
                el.replaceWith(input);
                input.focus();

                input.addEventListener('blur', () => {
                    const val = Math.max(1, Math.floor(Number(input.value) || 1));
                    const cart = loadCart();
                    const idx = cart.items.findIndex(x => x.id === id);
                    if (idx > -1) {
                        cart.items[idx].qty = val;
                        saveCart(cart);
                    }
                    renderCart();
                });

                input.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Enter') input.blur();
                    if (ev.key === 'Escape') renderCart();
                });
            });

document.getElementById('payBtn').addEventListener('click', () => {
const cart = loadCart();
const subtotal = calculateSubtotal(cart);
const shipping_cents = SHIPPING_CENTS;
const total_cents = subtotal + shipping_cents;

const order = {
  orderNumber: Math.floor(1000 + Math.random() * 9000),
  createdAt: new Date().toISOString(),
  cart,
  shipping_cents,
  subtotal_cents: subtotal,
  total_cents: total_cents,
  billing: { name: 'John Doe', address: '123 Test Street' },
  shipping: { name: 'John Doe', address: '123 Test Street' }
};

localStorage.setItem('checkout__latest_order', JSON.stringify(order));
window.location.href = 'thankyou.html';
 });
window.addEventListener('storage', (e) => {
  if (e.key === 'cart_v1' || e.key === 'checkout__latest_order') renderCart();
});
window.addEventListener('pageshow', renderCart);

        })();



  var acc = document.getElementsByClassName("customaccordion");

  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");

      var correctpanel = this.nextElementSibling;
      if (correctpanel.style.display === "block") {
        correctpanel.style.display = "none";
      } else {
        correctpanel.style.display = "block";
      }

      var checkouticon = this.querySelector("img");
      if (checkouticon) {
        checkouticon.classList.toggle("rotate");
      }
    });
  }