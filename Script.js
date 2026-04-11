let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = JSON.parse(localStorage.getItem("sahayibCart")) || [];
let invoiceNumber = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;
let activeCatIndex = 0;

function render() {
    const catDiv = document.getElementById("categoriesContainer");
    const itemDiv = document.getElementById("itemsContainer");
    const select = document.getElementById("catSelect");
    
    catDiv.innerHTML = "";
    itemDiv.innerHTML = "";
    select.innerHTML = "";

    data.forEach((cat, idx) => {
        // عرض الأقسام كمربعات اختيار
        catDiv.innerHTML += `
            <div class="cat-box ${idx === activeCatIndex ? 'active' : ''}" onclick="changeCategory(${idx})">
                ${cat.name}
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    // عرض الأصناف للقسم النشط فقط
    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card" onclick="addToCart('${item.name}', ${item.price})">
                    <button class="del-mini no-print" onclick="event.stopPropagation(); deleteSingleItem(${activeCatIndex}, ${iIdx})">🗑️</button>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price-tag">${item.price} ر.س</div>
                </div>`;
        });
    }
}

function changeCategory(index) {
    activeCatIndex = index;
    render();
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });
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
                <div style="display:flex; flex-direction:column; flex:1;">
                    <span style="font-weight:bold;">${item.name}</span>
                    <div class="no-print" style="margin-top:5px;">
                        <button onclick="updateQty(${i}, 1)" style="width:30px; padding:2px; background:#27ae60; color:white; border:none; border-radius:5px;">+</button>
                        <span style="padding:0 8px;">${item.qty}</span>
                        <button onclick="updateQty(${i}, -1)" style="width:30px; padding:2px; background:#e67e22; color:white; border:none; border-radius:5px;">-</button>
                    </div>
                </div>
                <b>${(item.qty * item.price).toFixed(2)} ر.س</b>
            </div>`;
    });
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    let finalTotal = subtotal + delivery;
    document.getElementById("totalPrice").innerText = finalTotal.toFixed(2);
    document.getElementById("invNum").innerText = invoiceNumber;
    localStorage.setItem("sahayibCart", JSON.stringify(cart));
}

function addCategory() {
    const name = document.getElementById("newCatName").value;
    if(name) { data.push({name, items: []}); saveMenu(); document.getElementById("newCatName").value=""; }
}

function deleteCategory() {
    const idx = document.getElementById("catSelect").value;
    if(idx === "") return;
    if(confirm(`حذف قسم "${data[idx].name}" بالكامل؟`)) {
        data.splice(idx, 1);
        activeCatIndex = 0;
        saveMenu();
    }
}

function addItem() {
    const idx = document.getElementById("catSelect").value;
    const name = document.getElementById("newItemName").value;
    const price = document.getElementById("newItemPrice").value;
    if(name && price) {
        data[idx].items.push({name, price: parseFloat(price)});
        saveMenu();
        document.getElementById("newItemName").value = "";
        document.getElementById("newItemPrice").value = "";
    }
}

function deleteSingleItem(c, i) { if(confirm("حذف الصنف من المنيو؟")) { data[c].items.splice(i,1); saveMenu(); } }
function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { if(confirm("تفريغ السلة؟")) { cart = []; updateCart(); } }

function printOrder() {
    if(cart.length === 0) return alert("السلة فارغة!");
    window.print();
    invoiceNumber++;
    localStorage.setItem("sahayibInvNum", invoiceNumber);
    updateCart();
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("سجل رقم الجوال أولاً");
    phone = phone.replace(/\D/g, ''); 
    if (phone.startsWith('0')) phone = '966' + phone.substring(1);

    let text = `*🧾 فاتورة مطعم سحايب ديرتي*%0A*رقم:* ${invoiceNumber}%0A-----------------------%0A`;
    cart.forEach(item => {
        text += `• ${item.name} (${item.qty} × ${item.price}) = *${(item.qty * item.price).toFixed(2)} ريال*%0A`;
    });
    text += `-----------------------%0A*الإجمالي النهائي: ${document.getElementById("totalPrice").innerText} ريال*%0A%0Aشكراً لتعاملكم معنا! ✨`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

render();
updateCart();
