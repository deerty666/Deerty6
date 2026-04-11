// استخدام S كبيرة كما هو متبع في مشروعك
let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = JSON.parse(localStorage.getItem("sahayibCart")) || [];
let invoiceNumber = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;

function syncPrintData() {
    document.getElementById('pName').innerText = document.getElementById('customerName').value || '---';
    document.getElementById('pPhone').innerText = document.getElementById('customerPhone').value || '---';
    document.getElementById('pLoc').innerText = document.getElementById('customerLocation').value || '---';
    document.getElementById('pNotes').innerText = document.getElementById('customerNotes').value || '---';
}

function filterMenu() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    render(term);
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
                <span>📂 ${cat.name}</span> <span>🔽</span>
            </div>
            <div class="items-container" id="${catId}" style="${filter ? 'display:block' : ''}">
                ${cat.items.map((item, iIdx) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                        <span>${item.name} (${item.price} ر.س)</span>
                        <div style="display:flex; gap:5px;">
                            <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">🛒 إضافة</button>
                            <button class="del-item-btn" onclick="deleteSingleItem(${cIdx}, ${iIdx})">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>`;
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name: name, price: price, qty: 1, note: "" });
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
                <div class="item-row">
                    <div style="flex:1;">
                        <b>${item.name}</b>
                        <div class="no-print" style="display:flex; gap:10px; margin-top:5px;">
                            <button class="qty-btn" onclick="updateQty(${i}, 1)">+</button>
                            <span style="font-weight:bold;">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${i}, -1)" style="background:#e67e22;">-</button>
                        </div>
                    </div>
                    <div style="font-weight:bold;">${item.qty} × ${item.price} ر.س</div>
                </div>
                <input class="no-print" placeholder="ملاحظة..." value="${item.note}" oninput="cart[${i}].note=this.value; syncPrintData()">
                ${item.note ? `<div class="print-only" style="font-size:10px; font-weight:bold; color:red;">* ${item.note}</div>` : ""}
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
    if(!phone) return alert("أدخل رقم العميل");
    phone = phone.replace(/\D/g, ''); 
    if (phone.startsWith('0')) phone = '966' + phone.substring(1);
    let text = `*🧾 فاتورة مطعم سحايب ديرتي*%0A*رقم:* ${invoiceNumber}%0A--------------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} [${item.qty} × ${item.price}] = *${(item.qty * item.price).toFixed(2)}*%0A${item.note ? ` _ملاحظة: ${item.note}_%0A` : ""}`;
    });
    text += `--------------------------%0A*🚚 التوصيل:* ${document.getElementById("deliveryFee").value}%0A*💰 الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function printOrder() {
    if (cart.length === 0) return alert("السلة فارغة!");
    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    updateCart();
}

function toggleCategory(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === "block" ? "none" : "block";
}

function addCategory() {
    const n = document.getElementById("newCatName").value;
    if(n) { data.push({name: n, items: []}); saveMenu(); document.getElementById("newCatName").value=""; }
}

function addItem() {
    const c = document.getElementById("catSelect").value;
    const n = document.getElementById("newItemName").value;
    const p = document.getElementById("newItemPrice").value;
    if(n && p) { data[c].items.push({name: n, price: parseFloat(p)}); saveMenu(); document.getElementById("newItemName").value=""; document.getElementById("newItemPrice").value=""; }
}

function deleteSingleItem(c, i) { if(confirm("حذف الصنف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { cart = []; updateCart(); localStorage.removeItem("sahayibCart"); }
function resetMenu() { if(confirm("مسح المنيو بالكامل؟")) { data = []; saveMenu(); } }

render();
updateCart();
syncPrintData();
