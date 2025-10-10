// (function(){
//   // helpers
//   function parseJSON(v){ try{ return JSON.parse(v); }catch(e){ return null; } }
//   function formatMoney(cents){ return '$' + (Number(cents)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
//   function safe(v){ return String(v||''); }
//   function escapeHtml(str){ return String(str||'').replace(/[&<>"'`=\/]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s])); }

//   let orders = parseJSON(localStorage.getItem('orders_v1')) || [];
//   const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
//   if(latest && latest.orderNumber){
//     const exists = orders.some(o => String(o.orderNumber) === String(latest.orderNumber));
//     if(!exists){
//       orders.unshift(latest);
//       localStorage.setItem('orders_v1', JSON.stringify(orders));
//     }
//   }

//   const tbody = document.getElementById('ordersBody');
//   const table = document.getElementById('ordersTable');
//   let toolbar = document.getElementById('ordersToolbar');
//   if(!toolbar){
//     toolbar = document.createElement('div');
//     toolbar.id = 'ordersToolbar';
//     toolbar.style.display = 'flex';
//     toolbar.style.justifyContent = 'flex-end';
//     toolbar.style.margin = '12px 0';
//     toolbar.style.gap = '8px';
//     table.parentNode.insertBefore(toolbar, table.nextSibling);
//   }

//   let removeBtn = document.getElementById('removeSelectedBtn');
//   if(!removeBtn){
//     removeBtn = document.createElement('button');
//     removeBtn.id = 'removeSelectedBtn';
//     removeBtn.textContent = 'Remove selected';
//     removeBtn.style.display = 'none';
//     removeBtn.className = 'btn';
//     toolbar.appendChild(removeBtn);
//   }

//   function buildItemHref(orderObj, itemIndex){
//     const ordNum = encodeURIComponent(orderObj.orderNumber || orderObj.orderId || Date.now());
//     return `order-product.html?order=${ordNum}&item=${itemIndex}`;
//   }

//   function humanDate(ts){
//     try {
//       const d = new Date(ts || Date.now());
//       const time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
//       const date = d.toLocaleDateString();
//       return `${time} • ${date}`;
//     } catch(e) { return '—'; }
//   }

//   function fulfillmentClass(s){
//     const key = String(s||'').toUpperCase();
//     if(key === 'PENDING') return 'ful-pending';
//     if(key === 'UNFULFILLED') return 'ful-unfulfilled';
//     if(key === 'RECEIVED') return 'ful-received';
//     return 'ful-pending';
//   }

//   function render(){
//     tbody.innerHTML = '';
//     if(!orders.length){
//       tbody.innerHTML = '<tr><td colspan="10" style="padding:18px;color:#666">No orders yet. Your recent order may appear after checkout.</td></tr>';
//       hideRemoveBtn();
//       return;
//     }

//     orders.forEach((ord, oi) => {
//       const total = Number(ord.total_cents || ord.subtotal_cents || 0);
//       const qty = (ord.cart && Array.isArray(ord.cart.items)) ? ord.cart.items.reduce((s,i)=>s+(Number(i.qty||0)),0) : 0;
//       const publisher = (ord.cart && ord.cart.items && ord.cart.items[0] && ord.cart.items[0].title) || '—';
//       const time = humanDate(ord.createdAt);
//       const orderNumber = safe(ord.orderNumber || `#${oi+1}`);

//       const paymentSent = ord.payment_sent === false ? false : true;
//       const fulfillment = ord.fulfillment_status || 'PENDING';

//       const tr = document.createElement('tr');

//       tr.innerHTML = `
//         <td><input class="order-checkbox checkbox" type="checkbox" aria-label="select order" data-order="${escapeHtml(orderNumber)}"></td>
//         <td><div class="order-id">#${escapeHtml(orderNumber)}</div></td>
//         <td class="publisherCell"></td>
//         <td class="total">${formatMoney(total)}</td>
//         <td class="time">${escapeHtml(time)}</td>
//         <td class="qty">${qty} item(s)</td>
//         <td class="shipping">${escapeHtml(ord.shipping_label || 'Standard')}</td>
//         <td><div class="payment-yes">${paymentSent ? 'PAYMENT SENT' : 'PAYMENT NOT SENT'}</div></td>
//         <td><div class="status-pill ${fulfillmentClass(fulfillment)}">${escapeHtml(fulfillment)}</div></td>
//         <td class="actionsCell"></td>
//       `;

//       const pubCell = tr.querySelector('.publisherCell');
//       if(ord.cart && ord.cart.items && ord.cart.items.length){
//         const item = ord.cart.items[0];
//         const a = document.createElement('a');
//         a.href = `order-product-detail.html?order=${encodeURIComponent(orderNumber)}`;
//         a.className = 'product-link';
//         a.innerHTML = `<img class="cusstom-thumb" src="${escapeHtml(item.img||'https://via.placeholder.com/150')}" alt="${escapeHtml(item.title||'')}"><div><div class="publisher-product-title">${escapeHtml(item.title||'Untitled')}</div><div style="color:var(--muted);font-size:13px">${escapeHtml(item.publisher||'')}</div></div>`;
//         pubCell.appendChild(a);
//       } else {
//         pubCell.textContent = '—';
//       }

//       const actionsCell = tr.querySelector('.actionsCell');
//       const viewA = document.createElement('a');
//       viewA.href = `order-product-detail.html?order=${encodeURIComponent(orderNumber)}`;
//       viewA.className = 'view-link';
//       viewA.textContent = 'View';
//       viewA.style.marginRight = '10px';
//       actionsCell.appendChild(viewA);

//       tbody.appendChild(tr);
//     });

//     attachCheckboxHandlers();
//     hideRemoveBtnIfNone();
//   }

//   function attachCheckboxHandlers(){
//     if (!tbody._hasCheckboxHandler) {
//       tbody.addEventListener('change', (e) => {
//         const cb = e.target.closest('.order-checkbox');
//         if (!cb) return;
//         hideRemoveBtnIfNone();
//       });
//       tbody._hasCheckboxHandler = true;
//     }
//   }

//   function getSelectedOrderNumbers(){
//     const checked = Array.from(tbody.querySelectorAll('.order-checkbox:checked'));
//     return checked.map(cb => cb.dataset.order).filter(Boolean);
//   }

//   function hideRemoveBtn(){
//     removeBtn.style.display = 'none';
//     removeBtn.dataset.count = '0';
//     removeBtn.textContent = 'Remove selected';
//   }

//   function hideRemoveBtnIfNone(){
//     const sel = getSelectedOrderNumbers();
//     if (sel.length) {
//       removeBtn.style.display = 'inline-block';
//       removeBtn.dataset.count = String(sel.length);
//       removeBtn.textContent = `Remove selected (${sel.length})`;
//     } else {
//       hideRemoveBtn();
//     }
//   }

//   let confirmModal = document.getElementById('bulkRemoveModal');
//   if(!confirmModal){
//     confirmModal = document.createElement('div');
//     confirmModal.id = 'bulkRemoveModal';
//     confirmModal.innerHTML = `
//       <div class="custom-modal-backdrop" id="bulkRemoveBackdrop" style="display:none;position:fixed;inset:0;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:9999">
//         <div style="background:#fff;padding:18px;border-radius:10px;min-width:320px;max-width:92%;box-shadow:0 12px 30px rgba(0,0,0,0.2);">
//           <h3 style="margin:0 0 8px">Remove selected items?</h3>
//           <p style="margin:0 0 12px;color:#666">This will remove the selected orders from your Orders list. This action cannot be undone.</p>
//           <div style="display:flex;justify-content:flex-end;gap:8px">
//             <button id="bulkRemoveNo" style="padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#fff;cursor:pointer">No</button>
//             <button id="bulkRemoveYes" style="padding:8px 12px;border-radius:8px;border:0;background:#e53e3e;color:#fff;cursor:pointer">Yes, remove</button>
//           </div>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(confirmModal);
//   }

//   function showBulkModal(){ document.getElementById('bulkRemoveBackdrop').style.display = 'flex'; }
//   function hideBulkModal(){ document.getElementById('bulkRemoveBackdrop').style.display = 'none'; }

//   function removeSelectedOrders(orderNumbers){
//     if(!Array.isArray(orderNumbers) || !orderNumbers.length) return;
//     orders = orders.filter(o => !orderNumbers.includes(String(o.orderNumber)));
//     localStorage.setItem('orders_v1', JSON.stringify(orders));

//     const latestRaw = localStorage.getItem('checkout__latest_order');
//     if(latestRaw){
//       try {
//         const latest = JSON.parse(latestRaw);
//         if(latest && orderNumbers.includes(String(latest.orderNumber))){
//           localStorage.removeItem('checkout__latest_order');
//         }
//       } catch(e){}
//     }

//     localStorage.setItem('orders_updated_at', String(Date.now()));
//     try { window.dispatchEvent(new Event('cart.updated')); } catch(e){}
//     render();
//   }

//   document.getElementById('bulkRemoveYes').addEventListener('click', () => {
//     const selected = getSelectedOrderNumbers();
//     removeSelectedOrders(selected);
//     hideBulkModal();
//     setTimeout(() => { window.location.href = 'order.html?refresh=' + Date.now(); }, 120);
//   });
//   document.getElementById('bulkRemoveNo').addEventListener('click', hideBulkModal);

//   removeBtn.addEventListener('click', (e) => {
//     const selected = getSelectedOrderNumbers();
//     if (!selected.length) return;
//     showBulkModal();
//   });

//   render();

//   window.addEventListener('storage', (e) => {
//     if(e.key === 'orders_v1' || e.key === 'checkout__latest_order' || e.key === 'cart_v1' || e.key === '___cart_sync_ping' || e.key === 'orders_updated_at'){
//       orders = parseJSON(localStorage.getItem('orders_v1')) || [];
//       const lt = parseJSON(localStorage.getItem('checkout__latest_order'));
//       if(lt && lt.orderNumber){
//         const exists = orders.some(o => String(o.orderNumber) === String(lt.orderNumber));
//         if(!exists){
//           orders.unshift(lt);
//           localStorage.setItem('orders_v1', JSON.stringify(orders));
//         }
//       }
//       render();
//     }
//   });

//   window.addEventListener('cart.updated', () => {
//     orders = parseJSON(localStorage.getItem('orders_v1')) || [];
//     render();
//   });

//   window.addEventListener('pageshow', () => {
//     orders = parseJSON(localStorage.getItem('orders_v1')) || [];
//     render();
//   });

//   if (new URLSearchParams(location.search).has('refresh')) {
//     orders = parseJSON(localStorage.getItem('orders_v1')) || [];
//     render();
//   }
// })();



(function(){
  // helpers
  function parseJSON(v){ try{ return JSON.parse(v); }catch(e){ return null; } }
  function formatMoney(cents){ return '$' + (Number(cents)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function safe(v){ return String(v||''); }
  function escapeHtml(str){ return String(str||'').replace(/[&<>"'`=\/]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s])); }

  let orders = parseJSON(localStorage.getItem('orders_v1')) || [];
  const latest = parseJSON(localStorage.getItem('checkout__latest_order'));
  if(latest && latest.orderNumber){
    const exists = orders.some(o => String(o.orderNumber) === String(latest.orderNumber));
    if(!exists){
      orders.unshift(latest);
      localStorage.setItem('orders_v1', JSON.stringify(orders));
    }
  }

  const tbody = document.getElementById('ordersBody');
  const table = document.getElementById('ordersTable');
  let toolbar = document.getElementById('ordersToolbar');
  if(!toolbar){
    toolbar = document.createElement('div');
    toolbar.id = 'ordersToolbar';
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.margin = '12px 0';
    toolbar.style.gap = '8px';
    table.parentNode.insertBefore(toolbar, table.nextSibling);
  }

  let removeBtn = document.getElementById('removeSelectedBtn');
  if(!removeBtn){
    removeBtn = document.createElement('button');
    removeBtn.id = 'removeSelectedBtn';
    removeBtn.textContent = 'Remove selected';
    removeBtn.style.display = 'none';
    removeBtn.className = 'btn';
    toolbar.appendChild(removeBtn);
  }

  function buildItemHref(orderObj, itemIndex){
    const ordNum = encodeURIComponent(orderObj.orderNumber || orderObj.orderId || Date.now());
    return `order-product.html?order=${ordNum}&item=${itemIndex}`;
  }

  function humanDate(ts){
    try {
      const d = new Date(ts || Date.now());
      const time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const date = d.toLocaleDateString();
      return `${time} • ${date}`;
    } catch(e) { return '—'; }
  }

  function fulfillmentClass(s){
    const key = String(s||'').toUpperCase();
    if(key === 'PENDING') return 'ful-pending';
    if(key === 'UNFULFILLED') return 'ful-unfulfilled';
    if(key === 'RECEIVED') return 'ful-received';
    return 'ful-pending';
  }

  function render(){
  tbody.innerHTML = '';
  if(!orders.length){
    tbody.innerHTML = '<tr><td colspan="10" style="padding:18px;color:#666">No orders yet. Your recent order may appear after checkout.</td></tr>';
    hideRemoveBtn();
    return;
  }

  orders.forEach((ord, oi) => {
    const total = Number(ord.total_cents || ord.subtotal_cents || 0);
    const qty = (ord.cart && Array.isArray(ord.cart.items)) ? ord.cart.items.reduce((s,i)=>s+(Number(i.qty||0)),0) : 0;
    const publisher = (ord.cart && ord.cart.items && ord.cart.items[0] && ord.cart.items[0].title) || '—';
    const time = humanDate(ord.createdAt);

    const orderKey = String(ord.orderNumber ?? ord.orderId ?? `order-${oi}`);
    const orderDisplay = `#${orderKey}`;

    const paymentSent = ord.payment_sent === false ? false : true;
    const fulfillment = ord.fulfillment_status || 'PENDING';

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><input class="order-checkbox checkbox" type="checkbox" aria-label="select order" data-order="${escapeHtml(orderKey)}"></td>
      <td><div class="order-id">${escapeHtml(orderDisplay)}</div></td>
      <td class="publisherCell"></td>
      <td class="total">${formatMoney(total)}</td>
      <td class="time">${escapeHtml(time)}</td>
      <td class="qty">${qty} item(s)</td>
      <td class="shipping">${escapeHtml(ord.shipping_label || 'Standard')}</td>
      <td><div class="payment-yes">${paymentSent ? 'PAYMENT SENT' : 'PAYMENT NOT SENT'}</div></td>
      <td><div class="status-pill ${fulfillmentClass(fulfillment)}">${escapeHtml(fulfillment)}</div></td>
      <td class="actionsCell"></td>
    `;

    const pubCell = tr.querySelector('.publisherCell');
    if(ord.cart && ord.cart.items && ord.cart.items.length){
      const item = ord.cart.items[0];
      const a = document.createElement('a');
      a.href = `order-product-detail.html?order=${encodeURIComponent(orderKey)}`; // use orderKey in link
      a.className = 'product-link';
      a.innerHTML = `<img class="cusstom-thumb" src="${escapeHtml(item.img||'https://via.placeholder.com/150')}" alt="${escapeHtml(item.title||'')}"><div><div class="publisher-product-title">${escapeHtml(item.title||'Untitled')}</div><div style="color:var(--muted);font-size:13px">${escapeHtml(item.publisher||'')}</div></div>`;
      pubCell.appendChild(a);
    } else {
      pubCell.textContent = '—';
    }

    const actionsCell = tr.querySelector('.actionsCell');
    const viewA = document.createElement('a');
    viewA.href = `order-product-detail.html?order=${encodeURIComponent(orderKey)}`;
    viewA.className = 'view-link';
    viewA.textContent = 'View';
    viewA.style.marginRight = '10px';
    actionsCell.appendChild(viewA);

    tbody.appendChild(tr);
  });

  attachCheckboxHandlers();
  hideRemoveBtnIfNone();
}


  function attachCheckboxHandlers(){
    if (!tbody._hasCheckboxHandler) {
      tbody.addEventListener('change', (e) => {
        const cb = e.target.closest('.order-checkbox');
        if (!cb) return;
        hideRemoveBtnIfNone();
      });
      tbody._hasCheckboxHandler = true;
    }
  }

 function getSelectedOrderNumbers(){
  const checked = Array.from(tbody.querySelectorAll('.order-checkbox:checked'));
  return checked.map(cb => cb.dataset.order).filter(Boolean).map(s => String(s));
}

  function hideRemoveBtn(){
    removeBtn.style.display = 'none';
    removeBtn.dataset.count = '0';
    removeBtn.textContent = 'Remove selected';
  }

  function hideRemoveBtnIfNone(){
    const sel = getSelectedOrderNumbers();
    if (sel.length) {
      removeBtn.style.display = 'inline-block';
      removeBtn.dataset.count = String(sel.length);
      removeBtn.textContent = `Remove selected (${sel.length})`;
    } else {
      hideRemoveBtn();
    }
  }

  let confirmModal = document.getElementById('bulkRemoveModal');
  if(!confirmModal){
    confirmModal = document.createElement('div');
    confirmModal.id = 'bulkRemoveModal';
    confirmModal.innerHTML = `
      <div class="custom-modal-backdrop" id="bulkRemoveBackdrop" style="display:none;position:fixed;inset:0;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:9999">
        <div style="background:#fff;padding:18px;border-radius:10px;min-width:320px;max-width:92%;box-shadow:0 12px 30px rgba(0,0,0,0.2);">
          <h3 style="margin:0 0 8px">Remove selected items?</h3>
          <p style="margin:0 0 12px;color:#666">This will remove the selected orders from your Orders list. This action cannot be undone.</p>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <button id="bulkRemoveNo" style="padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#fff;cursor:pointer">No</button>
            <button id="bulkRemoveYes" style="padding:8px 12px;border-radius:8px;border:0;background:#e53e3e;color:#fff;cursor:pointer">Yes, remove</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
  }

  function showBulkModal(){ document.getElementById('bulkRemoveBackdrop').style.display = 'flex'; }
  function hideBulkModal(){ document.getElementById('bulkRemoveBackdrop').style.display = 'none'; }

  function removeSelectedOrders(orderKeys){
  if(!Array.isArray(orderKeys) || !orderKeys.length) return;
  orders = orders.filter(o => {
    const keyA = String(o.orderNumber ?? o.orderId ?? '');
    return !orderKeys.includes(keyA);
  });

  // persist
  localStorage.setItem('orders_v1', JSON.stringify(orders));

  const latestRaw = localStorage.getItem('checkout__latest_order');
  if(latestRaw){
    try {
      const latest = JSON.parse(latestRaw);
      const latestKey = String(latest?.orderNumber ?? latest?.orderId ?? '');
      if(orderKeys.includes(latestKey)){
        localStorage.removeItem('checkout__latest_order');
      }
    } catch(e){}
  }

  localStorage.setItem('orders_updated_at', String(Date.now()));
  try { window.dispatchEvent(new Event('cart.updated')); } catch(e){}
  render();
}

  document.getElementById('bulkRemoveYes').addEventListener('click', () => {
    const selected = getSelectedOrderNumbers();
    removeSelectedOrders(selected);
    hideBulkModal();
    setTimeout(() => { window.location.href = 'order.html?refresh=' + Date.now(); }, 120);
  });
  document.getElementById('bulkRemoveNo').addEventListener('click', hideBulkModal);

  removeBtn.addEventListener('click', (e) => {
    const selected = getSelectedOrderNumbers();
    if (!selected.length) return;
    showBulkModal();
  });

  render();

  window.addEventListener('storage', (e) => {
    if(e.key === 'orders_v1' || e.key === 'checkout__latest_order' || e.key === 'cart_v1' || e.key === '___cart_sync_ping' || e.key === 'orders_updated_at'){
      orders = parseJSON(localStorage.getItem('orders_v1')) || [];
      const lt = parseJSON(localStorage.getItem('checkout__latest_order'));
      if(lt && lt.orderNumber){
        const exists = orders.some(o => String(o.orderNumber) === String(lt.orderNumber));
        if(!exists){
          orders.unshift(lt);
          localStorage.setItem('orders_v1', JSON.stringify(orders));
        }
      }
      render();
    }
  });

  window.addEventListener('cart.updated', () => {
    orders = parseJSON(localStorage.getItem('orders_v1')) || [];
    render();
  });

  window.addEventListener('pageshow', () => {
    orders = parseJSON(localStorage.getItem('orders_v1')) || [];
    render();
  });

  if (new URLSearchParams(location.search).has('refresh')) {
    orders = parseJSON(localStorage.getItem('orders_v1')) || [];
    render();
  }
})();
