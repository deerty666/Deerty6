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
        // زر حذف القسم يظهر بجانبه
        catDiv.innerHTML += `
            <div class="cat-box ${idx === activeCatIndex ? 'active' : ''}" onclick="changeCategory(${idx})">
                ${cat.name}
                <button class="delete-cat no-print" onclick="deleteCategory(event, ${idx})">×</button>
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card">
                    <button class="delete-item no-print" onclick="deleteItem(event, ${activeCatIndex}, ${iIdx})">حذف</button>
                    <div onclick="addToCart('${item.name}', ${item.price})">
                        <div style="font-weight:bold; font-size:14px; margin-top:10px;">${item.name}</div>
                        <div style="color:#e67e22; font-weight:bold;">${item.price} ر.س</div>
                    </div>
                </div>`;
        });
    }
}

function changeCategory(index) { activeCatIndex = index; render(); }

// 🗑️ وظائف الحذف الجديدة
function deleteCategory(event, index) {
    event.stopPropagation(); // منع تفعيل تغيير القسم عند الحذف
    if(confirm(`هل تريد حذف قسم "${data[index].name}" بالكامل؟`)) {
        data.splice(index, 1);
        activeCatIndex = 0;
        saveMenu();
    }
}

function deleteItem(event, catIdx, itemIdx) {
    event.stopPropagation();
    if(confirm(`هل تريد حذف هذا الصنف؟`)) {
        data[catIdx].items.splice(itemIdx, 1);
        saveMenu();
    }
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
            <div style="border-bottom: 1px dashed #ccc; padding: 6px 0;">
                <div class="item-row">
                    <span>${item.name}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                    <div class="no-print" style="display:flex; gap:5px;">
                        <button class="qty-btn btn-plus" onclick="updateQty(${i}, 1)">+</button>
                        <span style="font-weight:bold; min-width:20px; text-align:center;">${item.qty}</span>
                        <button class="qty-btn btn-minus" onclick="updateQty(${i}, -1)">-</button>
                    </div>
                    <span class="print-only">الكمية: ${item.qty}</span>
                    <input class="no-print" placeholder="ملاحظة.." value="${item.note || ''}" oninput="cart[${i}].note = this.value; localStorage.setItem('sahayibCart', JSON.stringify(cart));" style="flex:1; font-size:11px; padding:3px;">
                </div>
                ${item.note ? `<div style="font-size:10px; color:red;">* ${item.note}</div>` : ""}
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("pDelivery").innerText = delivery.toFixed(2) + " ريال";
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function printOrder() {
    if(cart.length === 0) return alert("السلة فارغة");
    document.getElementById('pNameDisp').innerHTML = "👤 <b>العميل:</b> " + document.getElementById('customerName').value;
    document.getElementById('pPhoneDisp').innerHTML = "📞 <b>الجوال:</b> " + document.getElementById('customerPhone').value;
    document.getElementById('pLocDisp').innerHTML = "📍 <b>الموقع:</b> " + document.getElementById('customerLocation').value;
    document.getElementById('pTimeDisp').innerHTML = "⏰ <b>الموعد:</b> " + document.getElementById('customerTime').value.replace('T', ' ');
    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    document.getElementById("invNum").innerText = invoiceNumber;
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("أدخل رقم العميل");
    let text = `*🧾 فاتورة سحايب ديرتي*%0A👤 *العميل:* ${document.getElementById('customerName').value}%0A📍 *الموقع:* ${document.getElementById('customerLocation').value}%0A⏰ *الموعد:* ${document.getElementById('customerTime').value.replace('T', ' ')}%0A--------------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} × ${item.qty} = *${(item.qty * item.price).toFixed(2)}*%0A${item.note ? `   _(ملاحظة: ${item.note})_%0A` : ""}`;
    });
    text += `--------------------------%0A💰 *الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*`;
    window.open(`https://wa.me/966${phone.startsWith('0') ? phone.substring(1) : phone}?text=${text}`, '_blank');
}

function addCategory() { 
    const n = document.getElementById("newCatName").value; 
    if(n) { data.push({name: n, items: []}); saveMenu(); document.getElementById("newCatName").value = ""; } 
}
function addItem() { 
    const idx = document.getElementById("catSelect").value; 
    const n = document.getElementById("newItemName").value; 
    const p = document.getElementById("newItemPrice").value; 
    if(n && p) { data[idx].items.push({name: n, price: parseFloat(p)}); saveMenu(); document.getElementById("newItemName").value = ""; document.getElementById("newItemPrice").value = ""; } 
}
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("مسح السلة؟")) { cart = []; updateCart(); } }

render(); updateCart();
