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
        catDiv.innerHTML += `<div class="cat-box ${idx === activeCatIndex ? 'active' : ''}" onclick="changeCategory(${idx})">${cat.name}</div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card" onclick="addToCart('${item.name}', ${item.price})">
                    <button class="no-print" style="position:absolute; top:5px; left:5px; border:none; background:#ffeded; color:#e74c3c; border-radius:50%; width:22px; height:22px; cursor:pointer;" onclick="event.stopPropagation(); deleteSingleItem(${activeCatIndex}, ${iIdx})">×</button>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price-tag">${item.price} ر.س</div>
                </div>`;
        });
    }
}

function changeCategory(index) { activeCatIndex = index; render(); }

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
            <div style="border-bottom: 1px dashed #ccc; padding: 5px 0; font-size: 13px;">
                <div style="display:flex; justify-content:space-between; font-weight:bold;">
                    <span>${item.name} × ${item.qty}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <div class="no-print" style="margin-top:5px; display:flex; gap:5px;">
                    <button onclick="updateQty(${i}, 1)" style="width:25px; background:#27ae60; color:white; border:none; border-radius:4px;">+</button>
                    <button onclick="updateQty(${i}, -1)" style="width:25px; background:#e67e22; color:white; border:none; border-radius:4px;">-</button>
                    <input placeholder="ملاحظة الصنف..." value="${item.note || ''}" oninput="cart[${i}].note = this.value; localStorage.setItem('sahayibCart', JSON.stringify(cart));" style="height:25px; font-size:11px; margin:0;">
                </div>
                ${item.note ? `<div style="font-size:11px; color:#555;">* ${item.note}</div>` : ""}
            </div>`;
    });

    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function printOrder() {
    if(cart.length === 0) return alert("السلة فارغة");
    
    // ربط الخانات للطباعة
    document.getElementById('pNameDisp').innerHTML = document.getElementById('customerName').value ? `<b>العميل:</b> ${document.getElementById('customerName').value}` : "";
    document.getElementById('pPhoneDisp').innerHTML = document.getElementById('customerPhone').value ? `<b>الجوال:</b> ${document.getElementById('customerPhone').value}` : "";
    document.getElementById('pLocDisp').innerHTML = document.getElementById('customerLocation').value ? `<b>الموقع:</b> ${document.getElementById('customerLocation').value}` : "";
    document.getElementById('pTimeDisp').innerHTML = document.getElementById('customerTime').value ? `<b>الموعد:</b> ${document.getElementById('customerTime').value.replace('T', ' ')}` : "";

    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    updateCart();
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("أدخل رقم الجوال");
    phone = phone.replace(/\D/g, ''); if (phone.startsWith('0')) phone = '966' + phone.substring(1);

    let text = `*🧾 فاتورة مطعم سحايب ديرتي*%0A*رقم:* ${invoiceNumber}%0A-----------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} (${item.qty}) = *${(item.qty * item.price).toFixed(2)}*%0A${item.note ? `  _ملاحظة: ${item.note}_%0A` : ""}`;
    });
    text += `-----------------------%0A*الموقع:* ${document.getElementById('customerLocation').value || 'غير محدد'}%0A*الموعد:* ${document.getElementById('customerTime').value}%0A*الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n) { data.push({name: n, items: []}); saveMenu(); document.getElementById("newCatName").value=""; } }
function deleteCategory() { const idx = document.getElementById("catSelect").value; if(confirm("حذف القسم؟")) { data.splice(idx, 1); activeCatIndex = 0; saveMenu(); } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); } }
function deleteSingleItem(c, i) { if(confirm("حذف الصنف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("تفريغ السلة؟")) { cart = []; updateCart(); } }

render(); updateCart();
