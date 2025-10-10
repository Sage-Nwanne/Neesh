    (function () {
      'use strict';
      const parseJSON = v => { try { return JSON.parse(v); } catch (e) { return null; } };
      const formatMoney = cents => '$' + (Number(cents) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const safe = v => String(v || '');

      const orderParam = new URLSearchParams(location.search).get('order');
      const metaRow = document.getElementById('metaRow');
      const billingAddr = document.getElementById('billingAddr');
      const billingExtra = document.getElementById('billingExtra');
      const shippingAddr = document.getElementById('shippingAddr');
      const shippingExtra = document.getElementById('shippingExtra');
      const productsList = document.getElementById('productsList');
      const statSubtotal = document.getElementById('statSubtotal');
      const statShipping = document.getElementById('statShipping');
      const statTotal = document.getElementById('statTotal');
      const paymentStatusEl = document.getElementById('paymentStatus');
      const fulfillmentStatusEl = document.getElementById('fulfillmentStatus');
      const trackingNumberEl = document.getElementById('trackingNumber');
      const trackingDateEl = document.getElementById('trackingDate');
      const updatesList = document.getElementById('updatesList');
      const mapBox = document.getElementById('mapBox');

      const editBtn = document.getElementById('editBtn');
      const contactBtn = document.getElementById('contactBtn');
      const pubProfileBtn = document.getElementById('pubProfileBtn');
      const cancelBtn = document.getElementById('cancelBtn');

      let orders = parseJSON(localStorage.getItem('orders_v1')) || [];
      const latestStored = parseJSON(localStorage.getItem('checkout__latest_order'));
      if (latestStored && latestStored.orderNumber) {
        const exists = orders.some(o => String(o.orderNumber) === String(latestStored.orderNumber));
        if (!exists) {
          orders.unshift(latestStored);
          localStorage.setItem('orders_v1', JSON.stringify(orders));
        }
      }

      let order = null;
      if (orderParam) {
        order = orders.find(o => String(o.orderNumber) === String(orderParam));
      }
      if (!order) order = orders[0] || latestStored || null;

      if (!order) {
        document.body.innerHTML = '<div style="padding:28px;color:#666">Order not found. <a href="order.html">Back to orders</a></div>';
        return;
      }

      let editing = false;

      function dispatchCartUpdated() {
        try {
          window.dispatchEvent(new Event('cart.updated'));
          localStorage.setItem('___cart_sync_ping', Date.now().toString());
          localStorage.removeItem('___cart_sync_ping');
        } catch (e) { }
      }

      function saveOrdersAndSync() {
        const pos = orders.findIndex(o => String(o.orderNumber) === String(order.orderNumber));
        if (pos > -1) orders[pos] = order;
        else orders.unshift(order);
        localStorage.setItem('orders_v1', JSON.stringify(orders));
        const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
        if (latest && String(latest.orderNumber) === String(order.orderNumber)) {
          localStorage.setItem('checkout__latest_order', JSON.stringify(order));
        }
        const cartForKey = {
          items: (order.cart.items || []).map(it => ({
            id: it.id, title: it.title, price_cents: Number(it.price_cents || 0), qty: Number(it.qty || 0), img: it.img || ''
          })),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('cart_v1', JSON.stringify(cartForKey));
        dispatchCartUpdated();
      }

      function removeOrderCompletely() {
        orders = orders.filter(o => String(o.orderNumber) !== String(order.orderNumber));
        localStorage.setItem('orders_v1', JSON.stringify(orders));
        const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
        if (latest && String(latest.orderNumber) === String(order.orderNumber)) {
          localStorage.removeItem('checkout__latest_order');
        }
        localStorage.setItem('cart_v1', JSON.stringify({ items: [], updatedAt: new Date().toISOString() }));
        dispatchCartUpdated();
      }

      function makeMetaBoxes() {
        const orderNum = safe(order.orderNumber);
        const created = new Date(order.createdAt || Date.now());
        const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = created.toLocaleDateString();
        const subtotal = Number(order.subtotal_cents || 0);
        const shipping = Number(order.shipping_cents || 0);
        const total = Number(order.total_cents || subtotal + shipping);
        metaRow.innerHTML = '';

        const leftMeta = [
          { title: 'Order Number', value: `#${orderNum}` },
          { title: 'Date', value: `${time}`, special: `${date}` },
          { title: 'Volume', value: `${(order.cart && order.cart.items && order.cart.items.length) || 0} item(s)` }
        ];
        leftMeta.forEach(m => {
          const div = document.createElement('div');
          div.className = 'meta-box';
          div.innerHTML = `
    <div class="meta-title">${m.title}</div>
    <div class="meta-value">${m.value}</div>
    ${m.special ? `<div class="meta-special">${m.special}</div>` : ''}
  `;
          metaRow.appendChild(div);
        });


        statSubtotal.textContent = formatMoney(subtotal);
        statShipping.textContent = formatMoney(shipping);
        statTotal.textContent = formatMoney(total);

        paymentStatusEl.textContent = (order.payment_status || 'PAYMENT SENT').toUpperCase();
        const ful = (order.fulfillment_status || 'PENDING').toUpperCase();
        fulfillmentStatusEl.textContent = ful;
        fulfillmentStatusEl.className = 'status-pill ' + (ful === 'PENDING' ? 'pill-pending' : (ful === 'RECEIVED' ? 'pill-received' : 'pill-unfulfilled'));

        trackingNumberEl.textContent = order.tracking && order.tracking.tracking_number ? order.tracking.tracking_number : '—';
        trackingDateEl.textContent = order.tracking && order.tracking.last_updated ? new Date(order.tracking.last_updated).toLocaleString() : '';
      }

      function renderAddresses() {
        billingAddr.textContent = (order.billing && (order.billing.name + ', ' + order.billing.address)) || '—';
        billingExtra.textContent = (order.billing && (order.billing.city ? `${order.billing.city} ${order.billing.postcode || ''}` : '')) || '';
        shippingAddr.textContent = (order.shipping && (order.shipping.name + ', ' + order.shipping.address)) || '—';
        shippingExtra.textContent = (order.shipping && (order.shipping.city ? `${order.shipping.city} ${order.shipping.postcode || ''}` : '')) || '';
      }
      function renderProducts() {
        productsList.innerHTML = '';
        (order.cart.items || []).forEach((it, idx) => {
          const row = document.createElement('div');
          row.className = 'product-line';
          row.dataset.index = idx;
          row.innerHTML = `
      <img class="product-thumb" src="${safe(it.img || 'https://via.placeholder.com/150')}" alt="">
      <div class="product-info">
        <div class="product-title">${safe(it.title || 'Untitled')}</div>
        <div class="product-meta">${safe(it.publisher || '')} • ${safe(it.sku || it.id || '')}</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:8px">
          <div class="quantitysmalltext">Quantity</div>
          <div class="quantity_container" style="display: none;">
            <button class="custom-btn qty-decr" data-idx="${idx}" style="padding:6px 8px">−</button>
            <div style="min-width:28px;text-align:center;font-weight:700" class="qty-value">${Number(it.qty || 1)}</div>
            <button class="custom-btn qty-incr" data-idx="${idx}" style="padding:6px 8px">+</button>
          </div>
        </div>
      </div>
    `;
          productsList.appendChild(row);
        });

        const quantityContainers = document.querySelectorAll('.quantity_container');
        quantityContainers.forEach(container => {
          container.style.display = editing ? 'flex' : 'none';
        });
      }


      function renderTrackingAndUpdates() {
        updatesList.innerHTML = '';
        const events = (order.tracking && Array.isArray(order.tracking.events)) ? order.tracking.events.slice().reverse() : [];
        if (!events.length) {
          updatesList.innerHTML = '<div style="padding:18px;color:var(--muted)">No tracking updates available.</div>';
          mapBox.innerHTML = '<div style="text-align:center;color:var(--muted)">No map data</div>';
          setProgress(0);
          return;
        }
        const statusOrder = ['ordered', 'ready', 'in_transit', 'out_for_delivery', 'delivered'];
        const last = events[0];
        const lastStatus = (last.status || '').toLowerCase();
        const progressIdx = Math.max(0, Math.min(statusOrder.indexOf(lastStatus), statusOrder.length - 1));
        setProgress(progressIdx + 1);

        const lastUpdated = new Date(events[0].time || Date.now());
        trackingDateEl.textContent = lastUpdated.toLocaleString();

        events.forEach(ev => {
          const row = document.createElement('div');
          row.className = 'update-row';
          row.innerHTML = `<div class="update-left">${new Date(ev.time).toLocaleString()}</div><div style="flex:1;padding-left:8px">${safe(ev.location || ev.note || ev.status)}</div><div class="update-right">${safe(ev.status)}</div>`;
          updatesList.appendChild(row);
        });

        if (order.tracking && order.tracking.lat && order.tracking.lng) {
          mapBox.innerHTML = `<a href="https://www.google.com/maps?q=${order.tracking.lat},${order.tracking.lng}" target="_blank" style="display:block;width:100%;height:100%;text-decoration:none;color:inherit"><img src="https://maps.googleapis.com/maps/api/staticmap?center=${order.tracking.lat},${order.tracking.lng}&zoom=12&size=600x300&markers=color:green%7C${order.tracking.lat},${order.tracking.lng}" alt="map" style="width:100%;height:100%;object-fit:cover;border-radius:6px"></a>`;
        } else {
          mapBox.innerHTML = `<div style="font-size:13px;color:var(--muted);text-align:center;padding:20px">View larger map<br><a href="#" id="openMapLink">Open map</a></div>`;
          document.getElementById('openMapLink').addEventListener('click', (ev) => { ev.preventDefault(); alert('No map coordinates for this order'); });
        }
      }

      function setProgress(stepsFilled) {
        const all = ['stepOrdered', 'stepReady', 'stepTransit', 'stepOut', 'stepDelivered'];
        all.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (!el) return;
          if (idx < stepsFilled) el.classList.add('fill');
          else el.classList.remove('fill');
        });
      }

      function initialRender() {
        makeMetaBoxes();
        renderAddresses();
        renderProducts();
        renderTrackingAndUpdates();
      }
      initialRender();

      productsList.addEventListener('click', (e) => {
        const incr = e.target.closest('.qty-incr');
        const decr = e.target.closest('.qty-decr');
        if (!incr && !decr) return;
        const idx = Number((incr || decr).dataset.idx);
        const item = order.cart.items[idx];
        if (!item) return;
        if (incr) {
          item.qty = Number(item.qty || 1) + 1;
        } else {
          item.qty = Math.max(1, Number(item.qty || 1) - 1);
        }
        renderProducts();
        recomputeTotalsAndSave();
      });

      function recomputeTotalsAndSave() {
        let subtotal = 0;
        (order.cart.items || []).forEach(it => { subtotal += Number(it.price_cents || 0) * Number(it.qty || 0); });
        order.subtotal_cents = subtotal;
        order.total_cents = subtotal + Number(order.shipping_cents || 0 || 0);
        saveOrdersAndSync();
        makeMetaBoxes();
      }

      editBtn.addEventListener('click', () => {
        editing = !editing;

        const editLabel = editBtn.querySelector('.Edit_Order_wrapper');
        if (editLabel) editLabel.textContent = editing ? 'Done' : 'Edit Order';

        const quantityContainers = document.querySelectorAll('.quantity_container');
        quantityContainers.forEach(container => {
          container.style.display = editing ? 'flex' : 'none';
        });
      });


      contactBtn.addEventListener('click', () => {
        const publisherEmail = order.publisher_email || (order.cart && order.cart.items && order.cart.items[0] && order.cart.items[0].publisher_email) || '';
        if (publisherEmail) window.location.href = `mailto:${publisherEmail}?subject=Order%20${encodeURIComponent(order.orderNumber)}`;
        else alert('No publisher email available.');
      });

      pubProfileBtn.addEventListener('click', () => {
        const profileUrl = order.publisher_profile || '#';
        if (profileUrl === '#') alert('Publisher profile not available.');
        else window.location.href = profileUrl;
      });

      window.addEventListener('storage', (e) => {
        if (e.key === 'orders_v1' || e.key === 'checkout__latest_order' || e.key === 'cart_v1' || e.key === '___cart_sync_ping') {
          orders = parseJSON(localStorage.getItem('orders_v1')) || orders;
          const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
          if (latest && String(latest.orderNumber) === String(order.orderNumber)) order = latest;
          initialRender();
        }
      });

      window.addEventListener('cart.updated', () => {
        orders = parseJSON(localStorage.getItem('orders_v1')) || orders;
        const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
        if (latest && String(latest.orderNumber) === String(order.orderNumber)) order = latest;
        initialRender();
      });

      window.addEventListener('pageshow', () => {
        orders = parseJSON(localStorage.getItem('orders_v1')) || orders;
        const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
        if (latest && String(latest.orderNumber) === String(order.orderNumber)) order = latest;
        initialRender();
      });

    })();

    document.addEventListener("DOMContentLoaded", () => {
      const modal = document.getElementById('cancelOrderModal');
      const yesBtn = document.getElementById('modalYesBtn');
      const noBtn = document.getElementById('modalNoBtn');
      const cancelBtn = document.getElementById('cancelBtn');

      function showModal() {
        modal.classList.add('show');
      }
      function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 250);
      }

      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));
      });

      noBtn.addEventListener('click', closeModal);

      yesBtn.addEventListener('click', () => {
        try {
          let orderNumber = null;
          if (typeof order !== "undefined" && order.orderNumber) {
            orderNumber = String(order.orderNumber);
          } else {
            const latest = JSON.parse(localStorage.getItem('checkout__latest_order') || 'null');
            orderNumber = latest?.orderNumber ? String(latest.orderNumber) : null;
          }
          if (!orderNumber) {
            console.error("No orderNumber found, cannot remove order");
            closeModal();
            return;
          }

          const orders = JSON.parse(localStorage.getItem('orders_v1')) || [];
          const updatedOrders = orders.filter(o => String(o.orderNumber) !== orderNumber);
          localStorage.setItem('orders_v1', JSON.stringify(updatedOrders));

          const latest = JSON.parse(localStorage.getItem('checkout__latest_order') || 'null');
          if (latest && String(latest.orderNumber) === orderNumber) {
            localStorage.removeItem('checkout__latest_order');
          }

          localStorage.setItem('cart_v1', JSON.stringify({ items: [], updatedAt: new Date().toISOString() }));

          closeModal();
          setTimeout(() => {
            window.location.href = 'order.html?refresh=' + Date.now();
          }, 300);

        } catch (err) {
          console.error('Error removing order:', err);
          closeModal();
        }
      });
    });