(function () {
  'use strict';

  const parseJSON = v => { try { return JSON.parse(v); } catch (e) { return null; } };
  const formatMoney = cents => '$' + (Number(cents) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const safe = v => String(v || '');

  const itemsContainer = document.getElementById('checkout__items_container');
  const orderNumEl = document.getElementById('checkout__detail_orderNumber');
  const dateEl = document.getElementById('checkout__detail_date');
  const billingEl = document.getElementById('checkout__detail_billing');
  const shippingEl = document.getElementById('checkout__detail_shipping');
  const subtotalEl = document.getElementById('checkout__detail_subtotal');
  const shippingCostEl = document.getElementById('checkout__detail_shippingCost');
  const totalEl = document.getElementById('checkout__detail_total');

  const btnEdit = document.getElementById('btnEdit');
  const btnCancel = document.getElementById('btnCancel');


  let raw = localStorage.getItem('checkout__latest_order');
  let order = parseJSON(raw);


  function dispatchCartUpdated() {
    try {
      window.dispatchEvent(new Event('cart.updated'));
      localStorage.setItem('___cart_sync_ping', Date.now().toString());
      localStorage.removeItem('___cart_sync_ping');
    } catch (e) { /* ignore */ }
  }

  function syncCartFromOrder() {
    if (!order || !order.cart) {
      const empty = { items: [], updatedAt: new Date().toISOString() };
      localStorage.setItem('cart_v1', JSON.stringify(empty));
      dispatchCartUpdated();
      return;
    }
    const cartForKey = {
      items: (order.cart.items || []).map(it => ({
        id: it.id,
        title: it.title,
        price_cents: Number(it.price_cents || 0),
        qty: Number(it.qty || 0),
        img: it.img || ''
      })),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('cart_v1', JSON.stringify(cartForKey));
    dispatchCartUpdated();
  }


  function formatDateFrom(orderObj) {
    const created = new Date(orderObj.createdAt || Date.now());
    const mm = String(created.getMonth() + 1).padStart(2, '0');
    const dd = String(created.getDate()).padStart(2, '0');
    const yy = String(created.getFullYear()).slice(-2);
    return `${mm}.${dd}.${yy}`;
  }

  function recomputeTotalsAndSave() {
    const items = (order && order.cart && order.cart.items) ? order.cart.items : [];
    let subtotal = 0;
    items.forEach(it => {
      subtotal += Number(it.price_cents || 0) * Number(it.qty || 0);
    });
    order.subtotal_cents = subtotal;
    order.total_cents = subtotal + Number(order.shipping_cents || 0 || 0);
    subtotalEl.textContent = formatMoney(order.subtotal_cents || 0);
    shippingCostEl.textContent = formatMoney(order.shipping_cents || 0);
    totalEl.textContent = formatMoney(order.total_cents || 0);
    localStorage.setItem('checkout__latest_order', JSON.stringify(order));
    try { syncCartFromOrder(); } catch (e) { /* ignore sync failures */ }
  }

  
  function renderNoOrder() {
    itemsContainer.innerHTML = '<div style="padding:30px;color:#666;">No order found. Return to <a href="checkout.html">checkout</a>.</div>';
    orderNumEl.textContent = '—';
    dateEl.textContent = '—';
    billingEl.textContent = '—';
    shippingEl.textContent = '—';
    subtotalEl.textContent = '$0.00';
    shippingCostEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
  }

  let editing = false;
  let removeMode = false;

  function renderItems() {
    itemsContainer.innerHTML = '';
    if (!order || !order.cart || !Array.isArray(order.cart.items) || order.cart.items.length === 0) {
      renderNoOrder();
      return;
    }

    orderNumEl.textContent = safe(order.orderNumber || '0000');
    dateEl.textContent = formatDateFrom(order);
    billingEl.innerHTML = `<div style="font-size:13px;color:#333;">${(order.billing && order.billing.name) || 'Name'}</div>
      <div style="font-size:13px;color:#666;margin-top:6px;white-space:pre-line;">${safe(order.billing && order.billing.address)}</div>`;
    shippingEl.innerHTML = `<div style="font-size:13px;color:#333;">${(order.shipping && order.shipping.name) || 'Name'}</div>
      <div style="font-size:13px;color:#666;margin-top:6px;white-space:pre-line;">${safe(order.shipping && order.shipping.address)}</div>`;

    itemsContainer.classList.toggle('editing', editing);
    itemsContainer.classList.toggle('remove-mode', removeMode);

    (order.cart.items || []).forEach((it, idx) => {
      const itemTotal = Number(it.price_cents || 0) * Number(it.qty || 1);
      const row = document.createElement('div');
      row.className = 'checkout__order-row';
      row.dataset.index = idx;
      row.innerHTML = `
        <div class="checkout__product-thumb"><img src="${(it.img || 'https://via.placeholder.com/150')}" alt="${(it.title || 'Product')}"></div>
        <div class="checkout__product-details">
          <div class="checkout__product-title">${(it.title || 'Untitled')}</div>
          <div class="checkout__product-variant">${(it.variant || '')}</div>
        </div>
        <div class="qty-center">
          <div class="qty-display">x ${Number(it.qty || 1)}</div>
          <div class="qty-controls" aria-hidden="${!editing}">
            <button class="qty-minus" aria-label="Decrease quantity">−</button>
            <div class="qty-value">${Number(it.qty || 1)}</div>
            <button class="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="price_and_trash">
        <div class="line-total">${formatMoney(itemTotal)}</div>
        <div class="trash-icon" title="Remove item" aria-label="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
          </svg>
        </div>
        </div>
      `;
      itemsContainer.appendChild(row);
    });

    recomputeTotalsAndSave();
  }

  
  if (!order) {
    renderNoOrder();
    return;
  }

  btnEdit && btnEdit.addEventListener('click', () => {
    editing = !editing;
    btnEdit.textContent = editing ? 'Done Editing' : 'Edit';
    if (editing && removeMode) {
      removeMode = false;
      btnCancel && (btnCancel.textContent = 'Cancel Order');
    }
    renderItems();
  });

  btnCancel && btnCancel.addEventListener('click', () => {
    removeMode = !removeMode;
    btnCancel.textContent = removeMode ? 'Exit Remove Mode' : 'Cancel Order';
    if (removeMode && editing) {
      editing = false;
      btnEdit && (btnEdit.textContent = 'Edit');
    }
    renderItems();
  });

  itemsContainer.addEventListener('click', (e) => {
    const plus = e.target.closest('.qty-plus');
    const minus = e.target.closest('.qty-minus');
    const trash = e.target.closest('.trash-icon');
    const row = e.target.closest('.checkout__order-row');
    if (!row) return;
    const idx = Number(row.dataset.index);

    if (plus) {
      order.cart.items[idx].qty = Number(order.cart.items[idx].qty || 1) + 1;
      recomputeTotalsAndSave();
      renderItems();
      return;
    }
    if (minus) {
      order.cart.items[idx].qty = Math.max(1, Number(order.cart.items[idx].qty || 1) - 1);
      recomputeTotalsAndSave();
      renderItems();
      return;
    }
    if (trash && removeMode) {
      order.cart.items.splice(idx, 1);
      if (!order.cart.items.length) {
        order.subtotal_cents = 0;
        order.total_cents = Number(order.shipping_cents || 0);
        localStorage.setItem('checkout__latest_order', JSON.stringify(order));
        syncCartFromOrder(); 
        renderNoOrder();
        return;
      }
      recomputeTotalsAndSave();
      renderItems();
      return;
    }
  });

 
  window.addEventListener('cart.updated', () => {
    raw = localStorage.getItem('checkout__latest_order');
    order = parseJSON(raw);
    renderItems();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'cart_v1' || e.key === 'checkout__latest_order' || e.key === '___cart_sync_ping') {
      raw = localStorage.getItem('checkout__latest_order');
      order = parseJSON(raw);
      renderItems();
    }
  });

  window.addEventListener('pageshow', () => {
    raw = localStorage.getItem('checkout__latest_order');
    order = parseJSON(raw);
    renderItems();
  });

 
  renderItems();

})();