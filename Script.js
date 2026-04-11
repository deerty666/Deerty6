// استخدام S كبيرة في اسم الملف بناءً على توجيهاتك
let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = [];
let activeCatIndex = 0;

function render() {
    const catDiv = document.getElementById("categoriesContainer");
    const itemDiv = document.getElementById("itemsContainer");
    const select = document.getElementById("catSelect");
    catDiv.innerHTML = ""; itemDiv.innerHTML = ""; select.innerHTML = "";
    
    data.forEach((cat, idx) => {
        catDiv.innerHTML += `
            <div class="cat-box ${idx === activeCatIndex ? 'active' : ''}" onclick="changeCategory(${idx})">
                ${cat.name}
                <button class="delete-icon no-print" onclick="deleteCategory(event, ${idx})">×</button>
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div style="position:relative; background:white; border:1px solid #ddd; padding:10px; border-radius:10px; text-align:center; cursor:pointer;">
                    <button class="delete-icon no-print" onclick="deleteItem(event, ${activeCatIndex}, ${iIdx})">×</button>
                    <div onclick="addToCart('${item.name}', ${item.price})">
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="color:#e67e22;">${item.price} ر.س</div>
                    </div>
                </div>`;
        });
    }
}

function changeCategory(index) { activeCatIndex = index; render(); }

// إدارة السلة والكميات
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
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
            <div style="border-bottom: 1px dashed #ccc; padding: 5px 0;">
                <div class="item-row">
                    <span>${item.name}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <div class="no-print" style="display:flex; align-items:center; gap:5px; margin-top:4px;">
                    <div class="qty-controls">
                        <button class="qty-btn btn-plus" onclick="updateQty(${i}, 1)">+</button>
                        <span style="font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn btn-minus" onclick="updateQty(${i}, -1)">-</button>
                    </div>
                    <input placeholder="ملاحظة.." value="${item.note}" oninput="cart[${i}].note = this.value" style="flex:1; font-size:11px; padding:2px;">
                </div>
                <div class="print-only" style="font-size:9px; text-align:right;">
                    الكمية: ${item.qty} ${item.note ? ` | ملاحظة: ${item.note}` : ''}
                </div>
            </div>`;
    });
    
    let delivery = parseFloat(document.getElementById("deliveryInput").value) || 0;
    document.getElementById("dispDelivery").innerText = delivery.toFixed(2);
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
}

// الوظائف النهائية
function printOrder() {
    document.getElementById('dispName').innerText = "👤 العميل: " + document.getElementById('customerName').value;
    document.getElementById('dispPhone').innerText = "📞 الجوال: " + document.getElementById('customerPhone').value;
    document.getElementById('dispLoc').innerText = "📍 الموقع: " + document.getElementById('customerLoc').value;
    window.print();
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("يرجى إدخال رقم الجوال");
    let msg = `*🧾 فاتورة سحايب ديرتي*%0A👤 العميل: ${document.getElementById('customerName').value}%0A--------------------------%0A`;
    cart.forEach(i => { msg += `• ${i.name} [${i.qty}] = ${(i.qty * i.price).toFixed(2)} ر.س ${i.note ? `(%0A_ملاحظة: ${i.note}_)` : ''}%0A`; });
    msg += `--------------------------%0A💰 الإجمالي: ${document.getElementById("totalPrice").innerText} ريال`;
    window.open(`https://wa.me/966${phone.startsWith('0') ? phone.substring(1) : phone}?text=${msg}`, '_blank');
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n) { data.push({name: n, items: []}); saveMenu(); } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); } }
function deleteCategory(e, i) { e.stopPropagation(); if(confirm("حذف القسم؟")) { data.splice(i, 1); saveMenu(); } }
function deleteItem(e, ci, ii) { e.stopPropagation(); if(confirm("حذف الصنف؟")) { data[ci].items.splice(ii, 1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { cart = []; updateCart(); }

render(); updateCart();
