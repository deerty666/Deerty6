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
                    <button class="no-print" style="position:absolute; top:4px; left:4px; border:none; background:#ffeded; color:#e74c3c; border-radius:50%; width:20px; height:20px; font-size:10px;" onclick="event.stopPropagation(); deleteSingleItem(${activeCatIndex}, ${iIdx})">×</button>
                    <div style="font-size:13px; font-weight:bold; margin-bottom:5px;">${item.name}</div>
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

function updateCart() {
    const cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.price * item.qty;
        cartDiv.innerHTML += `
            <div style="border-bottom: 1px dashed #ccc; padding: 4px 0;">
                <div style="display:flex; justify-content:space-between; font-weight:bold;">
                    <span>${item.name} × ${item.qty}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <input class="no-print" placeholder="ملاحظة..." value="${item.note || ''}" oninput="cart[${i}].note = this.value; localStorage.setItem('sahayibCart', JSON.stringify(cart));" style="font-size:10px; height:18px; margin-top:2px;">
                ${item.note ? `<div style="font-size:10px; color:#e74c3c;">* ${item.note}</div>` : ""}
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function printOrder() {
    if(cart.length === 0) return alert("السلة فارغة");
    document.getElementById('pNameDisp').innerHTML = document.getElementById('customerName').value ? "👤 <b>العميل:</b> " + document.getElementById('customerName').value : "";
    document.getElementById('pPhoneDisp').innerHTML = document.getElementById('customerPhone').value ? "📞 <b>الجوال:</b> " + document.getElementById('customerPhone').value : "";
    document.getElementById('pLocDisp').innerHTML = document.getElementById('customerLocation').value ? "📍 <b>الموقع:</b> " + document.getElementById('customerLocation').value : "";
    document.getElementById('pTimeDisp').innerHTML = document.getElementById('customerTime').value ? "⏰ <b>الموعد:</b> " + document.getElementById('customerTime').value.replace('T', ' ') : "";
    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("أدخل رقم جوال العميل أولاً");
    
    let text = `*🧾 فاتورة حجز مسبق مؤقتة*%0A`;
    text += `*مطعم سحايب ديرتي*%0A`;
    text += `--------------------------%0A`;
    text += `👤 *العميل:* ${document.getElementById('customerName').value || 'غير محدد'}%0A`;
    text += `📍 *الموقع:* ${document.getElementById('customerLocation').value || 'غير محدد'}%0A`;
    text += `⏰ *الموعد:* ${document.getElementById('customerTime').value.replace('T', ' ') || 'غير محدد'}%0A`;
    text += `--------------------------%0A`;
    text += `*📦 الطلبات:*%0A`;
    cart.forEach(item => {
        text += `• ${item.name} × ${item.qty} = *${(item.qty * item.price).toFixed(2)} ر.س*%0A`;
        if(item.note) text += `   _(ملاحظة: ${item.note})_%0A`;
    });
    text += `--------------------------%0A`;
    text += `🚚 *التوصيل:* ${document.getElementById("deliveryFee").value} ر.س%0A`;
    text += `💰 *الإجمالي النهائي: ${document.getElementById("totalPrice").innerText} ريال*%0A%0A`;
    text += `*شكراً لتعاملكم مع سحايب ديرتي!* ✨`;

    window.open(`https://wa.me/966${phone.startsWith('0') ? phone.substring(1) : phone}?text=${text}`, '_blank');
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n) { data.push({name: n, items: []}); saveMenu(); } }
function deleteCategory() { const idx = document.getElementById("catSelect").value; if(confirm("حذف القسم؟")) { data.splice(idx,1); saveMenu(); } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); } }
function deleteSingleItem(c, i) { if(confirm("حذف الصنف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("مسح السلة؟")) { cart = []; updateCart(); } }

render(); updateCart();
