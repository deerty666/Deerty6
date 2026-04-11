let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = JSON.parse(localStorage.getItem("sahayibCart")) || [];
let invoiceNumber = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;

function syncPrintData() {
    document.getElementById('pName').innerText = document.getElementById('customerName').value || '---';
    document.getElementById('pPhone').innerText = document.getElementById('customerPhone').value || '---';
    document.getElementById('pLoc').innerText = document.getElementById('customerLocation').value || '---';
    document.getElementById('pNotes').innerText = document.getElementById('customerNotes').value || '---';
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
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
        menuDiv.innerHTML += `<div class="category-header" onclick="toggleCategory('${catId}')">
            <span>📂 ${cat.name}</span> <span>🔽</span>
        </div>`;
        
        let itemsHtml = `<div class="items-container" id="${catId}" style="${filter ? 'display:block' : ''}">`;
        cat.items.forEach((item, iIdx) => {
            itemsHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                    <span>${item.name} (${item.price} ر.س)</span>
                    <div style="display:flex; gap:5px;">
                        <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">🛒</button>
                        <button class="del-item-btn" onclick="deleteSingleItem(${cIdx}, ${iIdx})">🗑️</button>
                    </div>
                </div>`;
        });
        menuDiv.innerHTML += itemsHtml + `</div>`;
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
                <div style="display:flex; justify-content:space-between;">
                    <div><b>${item.name}</b>
                        <div class="no-print" style="display:flex; gap:5px; margin-top:5px;">
                            <button class="qty-btn" onclick="updateQty(${i}, 1)">+</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${i}, -1)" style="background:#e67e22;">-</button>
                        </div>
                    </div>
                    <b>${item.qty * item.price} ر.س</b>
                </div>
                <input class="no-print" placeholder="ملاحظة..." value="${item.note}" oninput="cart[${i}].note=this.value; syncPrintData()">
                ${item.note ? `<div class="print-only" style="font-size:11px; font-weight:bold;">- ${item.note}</div>` : ""}
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
    if(!phone) return alert("ادخل رقم العميل");
    phone = phone.replace(/\D/g, ''); 
    if (phone.startsWith('0')) phone = '966' + phone.substring(1);

    let text = `*🧾 فاتورة مطعم سحايب ديرتي* %0A*رقم الفاتورة:* ${invoiceNumber}%0A-----------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} (${item.qty} × ${item.price} = *${item.qty * item.price} ريال*)%0A`;
        if(item.note) text += `  ملاحظة: _${item.note}_%0A`;
    });
    text += `-----------------------%0A*الإجمالي:* ${document.getElementById("totalPrice").innerText} ريال`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function printOrder() {
    if (cart.length === 0) return;
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
    if(n) { data.push({name: n, items: []}); saveMenu(); }
}

function addItem() {
    const c = document.getElementById("catSelect").value;
    const n = document.getElementById("newItemName").value;
    const p = document.getElementById("newItemPrice").value;
    if(n && p) { data[c].items.push({name: n, price: parseFloat(p)}); saveMenu(); }
}

function deleteSingleItem(c, i) { if(confirm("حذف؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { cart = []; updateCart(); }

render();
updateCart();
