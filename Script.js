// استخدام الحرف الكبير S كما في توجيهاتك
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
                <button class="delete-btn no-print" onclick="deleteCategory(event, ${idx})">🗑️</button>
            </div>`;
        select.innerHTML += `<option value="${idx}">${cat.name}</option>`;
    });

    if (data[activeCatIndex]) {
        data[activeCatIndex].items.forEach((item, iIdx) => {
            itemDiv.innerHTML += `
                <div class="item-card">
                    <button class="delete-btn no-print" onclick="deleteItem(event, ${activeCatIndex}, ${iIdx})" style="width:20px; height:20px;">🗑️</button>
                    <div onclick="addToCart('${item.name}', ${item.price})">
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="color:#e67e22; font-weight:bold;">${item.price} ر.س</div>
                    </div>
                </div>`;
        });
    }
}

function changeCategory(index) { activeCatIndex = index; render(); }

// وظائف الحذف
function deleteCategory(event, index) {
    event.stopPropagation();
    if(confirm(`هل أنت متأكد من حذف قسم "${data[index].name}" بالكامل؟`)) {
        data.splice(index, 1);
        activeCatIndex = 0;
        saveMenu();
    }
}

function deleteItem(event, catIdx, itemIdx) {
    event.stopPropagation();
    if(confirm("هل تريد حذف هذا الصنف؟")) {
        data[catIdx].items.splice(itemIdx, 1);
        saveMenu();
    }
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.price * item.qty;
        cartDiv.innerHTML += `
            <div style="margin-bottom: 8px;">
                <div class="item-row">
                    <span>${item.name}</span>
                    <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
                <div style="text-align:right; font-size:10px;">الكمية: ${item.qty}</div>
            </div>`;
    });
    document.getElementById("totalPrice").innerText = (subtotal + 5).toFixed(2); // إضافة رسوم التوصيل الثابتة 5
}

function printOrder() {
    document.getElementById('pNameDisp').innerText = "👤 العميل: " + document.getElementById('customerName').value;
    document.getElementById('pPhoneDisp').innerText = "📞 الجوال: " + document.getElementById('customerPhone').value;
    window.print();
}

function addCategory() {
    const name = document.getElementById("newCatName").value;
    if(name) { data.push({name: name, items: []}); saveMenu(); document.getElementById("newCatName").value = ""; }
}

function addItem() {
    const idx = document.getElementById("catSelect").value;
    const name = document.getElementById("newItemName").value;
    const price = document.getElementById("newItemPrice").value;
    if(name && price) {
        data[idx].items.push({name: name, price: parseFloat(price)});
        saveMenu();
        document.getElementById("newItemName").value = "";
        document.getElementById("newItemPrice").value = "";
    }
}

function saveMenu() { localStorage.setItem("sahayibMenu", JSON.stringify(data)); render(); }
function clearCart() { cart = []; updateCart(); }

render();
