// الحفاظ على Capital S بناءً على طلبك
let data = JSON.parse(localStorage.getItem("sahayibMenu")) || [];
let cart = [];
let activeCatIdx = 0;
let invNum = parseInt(localStorage.getItem("sahayibInvNum")) || 1001;

function render() {
    const catDiv = document.getElementById("categoriesContainer");
    const itemDiv = document.getElementById("itemsContainer");
    const select = document.getElementById("catSelect");
    
    catDiv.innerHTML = ""; itemDiv.innerHTML = ""; select.innerHTML = "";
    
    data.forEach((cat, idx) => {
        catDiv.innerHTML += `
            <div class="cat-box ${idx === activeCatIdx ? 'active' : ''}" onclick="activeCatIdx=${idx}; render();">
                <button class="delete-btn no-print" onclick="deleteCat(event, ${idx})">×</button>
                ${cat.name}
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIdx]) {
        data[activeCatIdx].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card" onclick="addToCart('${item.name}', ${item.price})">
                    <button class="delete-btn no-print" onclick="deleteItem(event, ${activeCatIdx}, ${iIdx})">×</button>
                    <div style="font-weight:bold;">${item.name}</div>
                    <div class="price">${item.price} ر.س</div>
                </div>`;
        });
    }
}

function addToCart(name, price) {
    const exist = cart.find(i => i.name === name);
    if (exist) exist.qty++;
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
            <div class="item-row">
                <div style="font-weight:bold;">${item.name}</div>
                <div style="font-size:12px;">الكمية: ${item.qty} × ${item.price} ر.س</div>
                <div class="no-print" style="margin-top:5px;">
                    <input placeholder="ملاحظة..." value="${item.note}" oninput="cart[${i}].note=this.value" style="width:80%; font-size:11px;">
                    <button onclick="cart.splice(${i},1); updateCart()" style="background:red; color:white; border:none; border-radius:4px; padding:2px 5px;">حذف</button>
                </div>
                ${item.note ? `<div class="print-only" style="font-size:10px; color:#555;">* ${item.note}</div>` : ""}
            </div>`;
    });
    
    let delivery = parseFloat(document.getElementById("deliveryFee").value) || 0;
    document.getElementById("dispDelivery").innerText = delivery.toFixed(2);
    document.getElementById("totalPrice").innerText = (subtotal + delivery).toFixed(2);
    document.getElementById("invNum").innerText = invNum;
}

function printOrder() {
    document.getElementById("dispName").innerText = "👤 العميل: " + document.getElementById("customerName").value;
    document.getElementById("dispPhone").innerText = "📞 الجوال: " + document.getElementById("customerPhone").value;
    window.print();
    invNum++;
    localStorage.setItem("sahayibInvNum", invNum);
    updateCart();
}

function sendWhatsApp() {
    let phone = document.getElementById("customerPhone").value;
    if(!phone) return alert("أدخل رقم الجوال");
    let text = `*🧾 فاتورة سحايب ديرتي*%0A👤 العميل: ${document.getElementById("customerName").value}%0A--------------------------%0A`;
    cart.forEach(i => { text += `• ${i.name} [${i.qty}] = ${(i.qty * i.price).toFixed(2)} ر.س%0A`; });
    text += `🚚 التوصيل: ${document.getElementById("deliveryFee").value} ر.س%0A💰 *الإجمالي: ${document.getElementById("totalPrice").innerText} ريال*`;
    window.open(`https://wa.me/966${phone.startsWith('0') ? phone.substring(1) : phone}?text=${text}`, '_blank');
}

function addCategory() { const n = document.getElementById("newCatName").value; if(n){ data.push({name:n, items:[]}); save(); document.getElementById("newCatName").value=""; } }
function addItem() { const idx = document.getElementById("catSelect").value; const n = document.getElementById("newItemName").value; const p = document.getElementById("newItemPrice").value; if(n && p){ data[idx].items.push({name:n, price:parseFloat(p)}); save(); document.getElementById("newItemName").value=""; document.getElementById("newItemPrice").value=""; } }
function deleteCat(e, i) { e.stopPropagation(); if(confirm("حذف القسم؟")){ data.splice(i,1); save(); } }
function deleteItem(e, ci, ii) { e.stopPropagation(); if(confirm("حذف الصنف؟")){ data[ci].items.splice(ii,1); save(); } }
function save() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { cart = []; updateCart(); }

render(); updateCart();
