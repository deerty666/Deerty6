let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = JSON.parse(localStorage.getItem("sahayibCart")) || [];
let invoiceNumber = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;
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
                <button class="delete-btn no-print" onclick="deleteCategory(event, ${idx})">×</button>
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card">
                    <button class="delete-btn no-print" onclick="deleteItem(event, ${activeCatIndex}, ${iIdx})" style="width:18px; height:18px; font-size:11px;">×</button>
                    <div onclick="addToCart('${item.name}', ${item.price})">
                        <div style="font-weight:bold; font-size:14px;">${item.name}</div>
                        <div style="color:#e67e22;">${item.price} ر.س</div>
                    </div>
                </div>`;
        });
    }
}

function changeCategory(index) { activeCatIndex = index; render(); }

// 🗑️ وظائف الحذف
function deleteCategory(event, index) {
    event.stopPropagation();
    if(confirm("حذف هذا القسم بالكامل؟")) { data.splice(index, 1); activeCatIndex = 0; saveMenu(); }
}
function deleteItem(event, cIdx, iIdx) {
    event.stopPropagation();
    if(confirm("حذف هذا الصنف؟")) { data[cIdx].items.splice(iIdx, 1); saveMenu(); }
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
            <div style="border-bottom: 1px dashed #ccc; padding: 4px 0;">
                <div class="item-row">
                    <span>${item.name}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px;">
                    <div class="no-print">
                        <button onclick="updateQty(${i}, 1)">+</button> <b>${item.qty}</b> <button onclick="updateQty(${i}, -1)">-</button>
                    </div>
                    <span class="print-only">الكمية: ${item.qty}</span>
                    <input class="no-print" placeholder="ملاحظة" value="${item.note || ''}" oninput="cart[${i}].note = this.value; localStorage.setItem('sahayibCart', JSON.stringify(cart));" style="width:60px; font-size:9px;">
                </div>
                ${item.note ? `<div style="font-size:9px; color:red;">* ${item.note}</div>` : ""}
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function printOrder() {
    document.getElementById('pNameDisp').innerHTML = "👤 <b>العميل:</b> " + document.getElementById('customerName').value;
    document.getElementById('pPhoneDisp').innerHTML = "📞 <b>الجوال:</b> " + document.getElementById('customerPhone').value;
    document.getElementById('pLocDisp').innerHTML = "📍 <b>الموقع:</b> " + document.getElementById('customerLocation').value;
    document.getElementById('pTimeDisp').innerHTML = "⏰ <b>الموعد:</b> " + document.getElementById('customerTime').value.replace('T', ' ');
    window.print();
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n) { data.push({name: n, items: []}); saveMenu(); } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("مسح السلة؟")) { cart = []; updateCart(); } }

render(); updateCart();
