let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = JSON.parse(localStorage.getItem("sahayibCart")) || [];
let invoiceNumber = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;

function syncPrintData() {
    document.getElementById('pName').innerText = document.getElementById('customerName').value || '---';
    document.getElementById('pPhone').innerText = document.getElementById('customerPhone').value || '---';
    document.getElementById('pNotes').innerText = document.getElementById('customerNotes').value || '---';
}

function filterMenu() {
    render(document.getElementById("searchInput").value.toLowerCase());
}

function render(filter = "") {
    const menuDiv = document.getElementById("menuDisplay");
    const select = document.getElementById("catSelect");
    menuDiv.innerHTML = "";
    select.innerHTML = "";
    
    data.forEach((cat, cIdx) => {
        select.innerHTML += `<option value="${cIdx}">${cat.name}</option>`;
        const filteredItems = cat.items.filter(i => i.name.toLowerCase().includes(filter));
        if (filter && filteredItems.length === 0) return;

        const catId = "cat-" + cIdx;
        menuDiv.innerHTML += `
            <div class="category-header" onclick="toggleCategory('${catId}')">
                <span>📂 ${cat.name}</span>
                <span>🔽</span>
            </div>
            <div class="items-container" id="${catId}" style="display:block">
                <div class="items-grid">
                    ${filteredItems.map((item, iIdx) => `
                        <div class="item-card" onclick="addToCart('${item.name}', ${item.price})">
                            <button class="del-mini no-print" onclick="event.stopPropagation(); deleteSingleItem(${cIdx}, ${iIdx})">🗑️</button>
                            <div class="item-name">${item.name}</div>
                            <div><span class="item-price-tag">${item.price} ر.س</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1, note: "" });
    updateCart();
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.price * item.qty;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div><b>${item.name}</b></div>
                    <b>${(item.qty * item.price).toFixed(2)} ريال</b>
                </div>
                <div class="no-print" style="display:flex; gap:10px; margin-top:8px;">
                    <button onclick="updateQty(${i}, 1)" style="width:35px; background:#27ae60; color:white; border:none; border-radius:5px;">+</button>
                    <span style="font-weight:bold; padding:0 5px;">${item.qty}</span>
                    <button onclick="updateQty(${i}, -1)" style="width:35px; background:#e67e22; color:white; border:none; border-radius:5px;">-</button>
                </div>
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    document.getElementById("invNum").innerText = invoiceNumber;
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("يرجى إدخال رقم الجوال");
    phone = phone.replace(/\D/g, ''); 
    if (phone.startsWith('0')) phone = '966' + phone.substring(1);

    let text = `*🧾 فاتورة مطعم سحايب ديرتي*%0A*رقم:* ${invoiceNumber}%0A-----------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} (${item.qty} × ${item.price}) = *${(item.qty * item.price).toFixed(2)} ريال*%0A`;
    });
    text += `-----------------------%0A*التوصيل:* ${document.getElementById("deliveryFee").value} ريال%0A*الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*%0A%0Aشكراً لكم!`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function printOrder() {
    if (cart.length === 0) return alert("السلة فارغة");
    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    updateCart();
}

function toggleCategory(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === "none" ? "block" : "none";
}

function addCategory() {
    const n = document.getElementById("newCatName").value;
    if(n) { data.push({name: n, items: []}); saveMenu(); document.getElementById("newCatName").value = ""; }
}

// دالة حذف القسم بالكامل
function deleteCategory() {
    const cIdx = document.getElementById("catSelect").value;
    if (cIdx === "") return alert("اختر القسم أولاً");
    if (confirm(`هل تريد حذف قسم "${data[cIdx].name}" بالكامل؟`)) {
        data.splice(cIdx, 1);
        saveMenu();
    }
}

function addItem() {
    const c = document.getElementById("catSelect").value;
    const n = document.getElementById("newItemName").value;
    const p = document.getElementById("newItemPrice").value;
    if(n && p) { data[c].items.push({name: n, price: parseFloat(p)}); saveMenu(); document.getElementById("newItemName").value=""; document.getElementById("newItemPrice").value=""; }
}

function deleteSingleItem(c, i) { if(confirm("حذف الصنف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("مسح السلة؟")) { cart = []; updateCart(); } }

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js'); });
}

render();
updateCart();
