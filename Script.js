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
                <input class="no-print" placeholder="ملاحظة..." value="${item.note || ''}" oninput="cart[${i}].note = this.value; localStorage.setItem('sahayibCart', JSON.stringify(cart));" style="font-size:11px; height:22px; margin-top:3px;">
                ${item.note ? `<div style="font-size:11px; color:#e74c3c; font-weight:bold;">* ملاحظة: ${item.note}</div>` : ""}
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function printOrder() {
    if(cart.length === 0) return alert("السلة فارغة");
    // نقل البيانات للطباعة يدوياً
    document.getElementById('pNameDisp').innerHTML = document.getElementById('customerName').value ? "<b>العميل:</b> " + document.getElementById('customerName').value : "";
    document.getElementById('pPhoneDisp').innerHTML = document.getElementById('customerPhone').value ? "<b>الجوال:</b> " + document.getElementById('customerPhone').value : "";
    document.getElementById('pLocDisp').innerHTML = document.getElementById('customerLocation').value ? "<b>الموقع:</b> " + document.getElementById('customerLocation').value : "";
    document.getElementById('pTimeDisp').innerHTML = document.getElementById('customerTime').value ? "<b>الموعد:</b> " + document.getElementById('customerTime').value.replace('T', ' ') : "";

    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    updateCart();
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("أدخل رقم الجوال");
    let text = `*🧾 فاتورة حجز سحايب ديرتي*%0A*الموقع:* ${document.getElementById('customerLocation').value}%0A*الموعد:* ${document.getElementById('customerTime').value}%0A*الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*`;
    window.open(`https://wa.me/966${phone.startsWith('0') ? phone.substring(1) : phone}?text=${text}`, '_blank');
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n) { data.push({name: n, items: []}); saveMenu(); } }
function deleteCategory() { const idx = document.getElementById("catSelect").value; if(confirm("حذف القسم؟")) { data.splice(idx,1); saveMenu(); } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); } }
function deleteSingleItem(c, i) { if(confirm("حذف الصنف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("مسح السلة؟")) { cart = []; updateCart(); } }

render(); updateCart();
