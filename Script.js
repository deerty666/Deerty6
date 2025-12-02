/* =========================
   Script.js — Black & Gold Premium
   Features:
   - Single branch (لبن الاحمديه)
   - Favorites (localStorage)
   - Banner عروض اليوم
   - Lazy-loading للصور
   - Fly-to-cart + cart shake
   - Fade/Slide animations
   - All original cart/whatsapp/location logic kept
   ========================= */

/* ====== بيانات الفرع الوحيد ====== */
const BRANCH_CONFIG = {
    'branch1': { 
        whatsapp: '966536803598',
        name: 'لبن الاحمديه',
        deliveryFee: 5,
    }
};
let currentBranchId = 'branch1';
const currentBranch = BRANCH_CONFIG['branch1'];
document.title = `قائمة سحايب ديرتي - فرع ${currentBranch.name}`;

/* ====== بيانات المنيو (مختصرة على branch1) ====== */
const menuData = [
    { section:"الكل", sectionImg: "Dirty55/logo-bg.webp", items:[] },
    { section:"الشوايه", sectionImg: "Dirty55/sh00.webp", items:[
        {id:"sh1", img:"Dirty55/sh00.webp", name:"حبة شواية", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"sh2", img:"Dirty55/sh00.webp", name:"نص شواية بالرز", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]},
        {id:"sh3", img:"Dirty55/sh10.webp", name:"ربع دجاج", basePrice:13, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"شوايه", price:0},{name:"مندي", price:0}
        ]},
        {id:"sh4", img:"Dirty55/sh20.webp", name:"نصف دجاج (ساده)", basePrice:15, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"شوايه", price:0},{name:"مظبي", price:0},{name:"مندي", price:0}
        ]}
    ]},
    { section:"المظبي", sectionImg: "Dirty55/md00.webp", items:[
        {id:"md1", img:"Dirty55/md00.webp", name:"حبة مظبي", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"md2", img:"Dirty55/md00.webp", name:"نص مظبي", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]}
    ]},
    { section:"مندي", sectionImg: "Dirty55/mn00.webp", items:[
        {id:"mn1", img:"Dirty55/mn00.webp", name:"حبة مندي", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"mn2", img:"Dirty55/mn00.webp", name:"نص مندي", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]}
    ]},
    { section:"الأطباق الجانبية", sectionImg:"Dirty55/si00.webp", items:[
        {id:"side0", img:"Dirty55/si08.webp", name:"شوربة", basePrice:8, isBestSeller:true, availableIn:['branch1'], options:[{name:"صحن", price:0}]},
        {id:"side1", img:"Dirty55/si01.webp", name:"جريش", basePrice:0, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"صغير", price:5},{name:"كبير", price:10}
        ]}
    ]},
    { section:"المشروبات", sectionImg:"Dirty55/dr00.webp", items:[
        {id:"bev-p", img:"Dirty55/dr01.webp", name:"ببسي", basePrice:0, availableIn:['branch1'], options:[
            {name:"صغير", price:3},{name:"وسط", price:6},{name:"كبير", price:9}
        ]}
    ]},
    { section:"المقبلات", sectionImg:"Dirty55/ap00.webp", items:[
        {id:"app-khdar", img:"Dirty55/ap01.webp", name:"سلطه خضار", basePrice:0, availableIn:['branch1'], options:[
            {name:"صغير", price:7},{name:"وسط", price:13}
        ]}
    ]},
    { section:"الكنافه", sectionImg:"Dirty55/kn00.webp", items:[
        {id:"kna1", img:"Dirty55/kn01.webp", name:"كنافه قشطه", basePrice:10, availableIn:['branch1'], options:[{name:"", price:0}]}
    ]}
];

/* ====== Process menu (best sellers) ====== */
function processMenuData(data) {
    let bestSellers = [];
    let processedMenuData = [];

    data.forEach(section => {
        if (section.section === "الكل") {
            processedMenuData.push(section);
            return;
        }
        let regularItems = [];
        section.items.forEach(item => {
            const itemWithSection = {...item, actualSection: item.actualSection || section.section};
            if (item.isBestSeller === true) bestSellers.push(itemWithSection);
            else regularItems.push(itemWithSection);
        });
        if (regularItems.length > 0 || section.sectionAvailableIn) {
            let newSection = {...section, items: regularItems};
            processedMenuData.push(newSection);
        }
    });

    if (bestSellers.length > 0) {
        let bestSellerSection = {
            section: "الأكثر مبيعاً 🏆",
            sectionImg: "Deerty6/best_seller_icon.webp",
            items: bestSellers,
            sectionAvailableIn: ['branch1']
        };
        processedMenuData.splice(1, 0, bestSellerSection);
    }
    return processedMenuData;
}
const processedMenuData = processMenuData(menuData);

/* ====== Global UI elements (assumes IDs exist in HTML) ====== */
const sectionsEl = document.getElementById('sections');
const menuList = document.getElementById('menuList');
const cartBtn = document.getElementById('cartBtn') || document.getElementById('cartIcon') || document.createElement('div');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsEl = document.getElementById('cartItems');
const totalBreakdownEl = document.getElementById('totalBreakdown');
const sendWhatsapp = document.getElementById('sendWhatsapp');
const clearCart = document.getElementById('clearCart');
const installAppBtn = document.getElementById('installAppBtn');
const searchBar = document.getElementById('searchBar');
const optionModal = document.getElementById('optionModal');
const modalTitle = document.getElementById('modalTitle');
const modalOptions = document.getElementById('modalOptions');
const modalConfirm = document.getElementById('modalConfirm');
const itemNoteInput = document.getElementById('itemNote');
const getLocationBtn = document.getElementById('getLocationBtn');
const locationStatus = document.getElementById('locationStatus');
const notificationPrompt = document.getElementById('notificationPrompt');
const allowNotificationsBtn = document.getElementById('allowNotifications');
const denyNotificationsBtn = document.getElementById('denyNotifications');

/* ====== App state ====== */
let cart = JSON.parse(localStorage.getItem('deerty_cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('deerty_favs') || '[]'); // store array of item ids
let userLocation = null;
let deferredPrompt = null;
let currentSection = processedMenuData[0].section; // initial
let selectedItem = null;
let selectedOption = null;
let selectedItemImage = null;

/* ====== Banner (عرض اليوم) render ====== */
function renderTopBanner(){
    // If there's already a banner element, skip
    if(document.getElementById('topBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'topBanner';
    banner.className = 'banner';
    banner.innerText = '🎉 عرض اليوم: نفر حاشي مكموت بـ 50 ريال فقط — اطلب الآن!';
    // insert before sectionsEl if possible
    if(sectionsEl && sectionsEl.parentNode){
        sectionsEl.parentNode.insertBefore(banner, sectionsEl);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }
}

/* ====== Render sections (with animation) ====== */
function renderSections(){
    if(!sectionsEl) return;
    sectionsEl.innerHTML = '';
    processedMenuData.forEach((sec, idx) => {
        if (sec.section !== "الكل" && sec.sectionAvailableIn && !sec.sectionAvailableIn.includes(currentBranchId)) return;
        const sectionDisplayName = sec.section === "الكل" ? `فرع ${currentBranch.name}` : sec.section;
        const card = document.createElement('div');
        card.className = 'sec-card';
        card.innerHTML = `
            <img src="${sec.sectionImg}" alt="${sec.section}" onerror="this.style.opacity=.35" loading="lazy">
            <div class="sec-name">${sectionDisplayName}</div>
        `;
        if(sec.section === currentSection) card.classList.add('active');
        card.onclick = () => {
            document.querySelectorAll('.sec-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentSection = sec.section;
            renderMenu(currentSection);
            if(searchBar) searchBar.value = '';
            // smooth scroll to top of menu
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
        sectionsEl.appendChild(card);
    });
    renderMenu(currentSection);
}

/* ====== Render Menu (with favorites and lazy images) ====== */
function renderMenu(sectionName, searchTerm = ''){
    if(!menuList) return;
    menuList.innerHTML = '';
    let itemsToRender = [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if(sectionName === "الكل") {
        itemsToRender = processedMenuData.flatMap(sec => sec.section !== "الكل" ? sec.items.map(item => ({...item, actualSection: item.actualSection || sec.section})) : []);
    } else {
        const sec = processedMenuData.find(s => s.section === sectionName);
        if(!sec) return;
        itemsToRender = sec.items;
    }

    // filter by branch availability
    const branchFilteredItems = itemsToRender.filter(item => item.availableIn && item.availableIn.includes(currentBranchId));
    const filteredItems = branchFilteredItems.filter(item => item.name.toLowerCase().includes(normalizedSearch));

    if(filteredItems.length === 0 && normalizedSearch.length > 0) {
        menuList.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--light-text);">لا توجد نتائج بحث في قسم "${sectionName}" في فرع ${currentBranch.name}</p>`;
        return;
    }

    if(filteredItems.length === 0 && normalizedSearch.length === 0 && sectionName !== "الكل") {
        menuList.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--light-text);">لا تتوفر وجبات في قسم "${sectionName}" حالياً في فرع ${currentBranch.name}.</p>`;
        return;
    }

    // Render each item
    filteredItems.forEach(item => {
        const isAvailable = item.isAvailable !== false;
        const discountedPriceForBranch = item.branchDiscounts ? item.branchDiscounts[currentBranchId] : null;
        const hasDiscount = discountedPriceForBranch && discountedPriceForBranch < item.basePrice;
        const isBestSeller = item.isBestSeller === true;
        const displayedSection = item.actualSection || sectionName;
        const favActive = favorites.includes(item.id) ? 'active' : '';

        let priceDisplay;
        if (hasDiscount) {
            priceDisplay = `<span class="old-price">${item.basePrice} ريال</span> <span class="discount-price">${discountedPriceForBranch} ريال</span>`;
        } else {
            priceDisplay = item.basePrice > 0 ? `${item.basePrice} ريال` : (item.options && item.options.length>0 && item.options[0].price>0 ? `ابتداءً من ${item.options[0].price} ريال` : `${item.options && item.options[0]?item.options[0].price:0} ريال`);
        }

        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.position = 'relative';
        // Build inner HTML with lazy loading images and fav button
        card.innerHTML = `
            <button class="fav-btn ${favActive}" data-id="${item.id}" title="أضف للمفضلة">♥</button>
            ${ isBestSeller ? '<span class="best-seller-badge">الأكثر مبيعاً 🏆</span>' : '' }
            <div class="img-wrap">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
            </div>
            <div class="item-body">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="item-name">${item.name}</h3>
                    <div style="font-size:0.9rem;color:rgba(255,255,255,0.8)">${priceDisplay}</div>
                </div>
                <p style="margin:6px 0 0; color:rgba(255,255,255,0.6); font-size:0.9rem;">${displayedSection}</p>
                <button class="add-btn" ${!isAvailable ? 'disabled' : ''}>${!isAvailable ? 'غير متوفر' : 'أضف للسلة'}</button>
            </div>
        `;

        // Favorite toggle
        const favBtn = card.querySelector('.fav-btn');
        favBtn.onclick = (e) => {
            e.stopPropagation();
            const id = favBtn.dataset.id;
            toggleFavorite(id, favBtn);
        };

        // Add button click
        const addBtn = card.querySelector('.add-btn');
        if(isAvailable && addBtn){
            addBtn.onclick = () => {
                const itemForCart = {...item};
                if(hasDiscount) itemForCart.basePrice = discountedPriceForBranch;
                delete itemForCart.actualSection;
                const needsOptions = itemForCart.options && (itemForCart.options.length > 1 || (itemForCart.options.length === 1 && itemForCart.options[0].name !== ""));
                const imgEl = card.querySelector('img');
                if(needsOptions) showOptions(itemForCart, false, imgEl); else showOptions(itemForCart, true, imgEl);
            };
        }

        menuList.appendChild(card);

        // small entrance animation stagger
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 450ms cubic-bezier(.2,.9,.2,1)';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 60 + Math.random()*200);
    });
}

/* ====== Favorites logic ====== */
function toggleFavorite(itemId, btnEl){
    const idx = favorites.indexOf(itemId);
    if(idx === -1) {
        favorites.push(itemId);
        btnEl.classList.add('active');
    } else {
        favorites.splice(idx,1);
        btnEl.classList.remove('active');
    }
    localStorage.setItem('deerty_favs', JSON.stringify(favorites));
    // Optional small feedback
    btnEl.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}], {duration:220, easing:'ease'});
}

/* ====== Show options modal (supports notes) ====== */
function showOptions(item, skipOptions = false, itemImage = null){
    selectedItem = item;
    selectedOption = item.options && item.options.length>0 ? item.options[0] : null;
    selectedItemImage = itemImage;

    if(!optionModal) {
        // fallback: direct add to cart without modal
        addToCart({...selectedItem, qty:1, selectedOption: selectedOption, note: null});
        if(selectedItemImage) { flyToCart(selectedItemImage); flashCartButton(); }
        return;
    }

    modalTitle.innerText = item.name || 'تفاصيل';
    itemNoteInput.value = '';
    if(skipOptions || !item.options || (item.options.length <=1 && item.options[0] && item.options[0].name==="")) {
        modalOptions.style.display = 'none';
    } else {
        modalOptions.style.display = 'block';
        modalOptions.innerHTML = '';
        item.options.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'opt-btn';
            b.innerText = opt.name + (opt.price>0?` +${opt.price} ريال`:'');
            b.onclick = () => {
                selectedOption = opt;
                document.querySelectorAll('#modalOptions .opt-btn').forEach(btn => btn.style.backgroundColor = 'var(--gold)');
                b.style.backgroundColor = '#a07c4c';
            };
            modalOptions.appendChild(b);
        });
    }
    optionModal.style.display = 'flex';
}

/* modal confirm */
if(modalConfirm){
    modalConfirm.onclick = () => {
        if(selectedItem){
            const note = itemNoteInput.value.trim();
            const optionToSend = selectedOption || (selectedItem.options && selectedItem.options[0]) || null;
            addToCart({...selectedItem, qty:1, selectedOption: optionToSend, note: note || null});
            if(selectedItemImage) flyToCart(selectedItemImage);
            // cart shake
            triggerCartShake();
            const originalText = modalConfirm.innerText;
            modalConfirm.innerText = "تمت الإضافة! ✅";
            modalConfirm.disabled = true;
            setTimeout(()=>{
                modalConfirm.innerText = originalText;
                modalConfirm.disabled = false;
                optionModal.style.display = 'none';
            }, 1100);
        } else {
            optionModal.style.display = 'none';
        }
    };
}

/* close modal when click outside */
if(optionModal) optionModal.addEventListener('click', (e)=>{
    if(e.target.id === 'optionModal') optionModal.style.display = 'none';
});

/* ====== Cart functions (save, add, render) ====== */
function saveCart(){
    localStorage.setItem('deerty_cart', JSON.stringify(cart));
    renderCart();
}

function flashCartButton(){
    if(cartBtn){
        cartBtn.classList.add('flash-cart-btn');
        setTimeout(()=> cartBtn.classList.remove('flash-cart-btn'), 350);
    }
}

function addToCart(item){
    const obj = {...item};
    delete obj.branchDiscounts;
    delete obj.isBestSeller;
    delete obj.availableIn;
    const key = obj.id + (obj.selectedOption?`-${obj.selectedOption.name}`:'') + (obj.note ? `-${obj.note}` : '');
    const found = cart.find(i => i.key === key);
    if(found) found.qty += 1;
    else cart.push({...obj, key});
    saveCart();
    flashCartButton();
    triggerCartShake();
}

/* cart render */
function renderCart(){
    if(!cartItemsEl || !totalBreakdownEl) return;
    cartItemsEl.innerHTML = '';
    let subtotal = 0;
    let count = 0;
    const branchDeliveryFee = currentBranch.deliveryFee || 0;

    cart.forEach((it, idx) => {
        const price = (it.basePrice || 0) + (it.selectedOption?it.selectedOption.price:0);
        const row = document.createElement('div');
        row.className = 'cart-row';
        const noteHtml = it.note ? `<div class="item-note-display">📝 ملاحظة: ${it.note}</div>` : '';
        row.innerHTML = `
            <div style="flex-grow:1; min-width:60%">
                <div style="font-weight:800">${it.name}${it.selectedOption && it.selectedOption.name !== 'نفر' && it.selectedOption.name !== 'طبق' && it.selectedOption.name !== 'عبوة' ? ' — '+it.selectedOption.name : ''}</div>
                <div style="font-size:0.9rem;color:rgba(255,255,255,0.7)">${it.qty} × ${price} ريال</div>
                ${noteHtml}
            </div>
            <div class="controls">
                <button onclick="updateQty(${idx},-1)">-</button>
                <div style="min-width:26px;text-align:center">${it.qty}</div>
                <button onclick="updateQty(${idx},1)">+</button>
                <button onclick="removeItem(${idx})" style="margin-left:6px;background:var(--red);color:#fff;padding:6px;border-radius:6px;border:none;cursor:pointer">حذف</button>
            </div>
        `;
        cartItemsEl.appendChild(row);
        subtotal += price * it.qty;
        count += it.qty;
    });

    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
    const currentDeliveryFee = deliveryType === 'delivery' ? branchDeliveryFee : 0;
    let finalTotal = subtotal + currentDeliveryFee;

    totalBreakdownEl.innerHTML = `
        <div class="total-line"><span>إجمالي المنتجات:</span><span>${subtotal} ريال</span></div>
        <div class="total-line"><span>رسوم التوصيل:</span><span>${currentDeliveryFee} ريال</span></div>
        <div class="total-line final-total-line"><span>الإجمالي النهائي:</span><span id="cartTotalBottom">${finalTotal} ريال</span></div>
    `;

    if(cartCount) {
        cartCount.innerText = count;
        cartCount.style.display = count===0 ? 'none' : 'inline-block';
    }
    localStorage.setItem('deerty_cart', JSON.stringify(cart));
}

/* update qty & remove */
function updateQty(idx, change){
    if(!cart[idx]) return;
    cart[idx].qty += change;
    if(cart[idx].qty < 1) cart.splice(idx,1);
    saveCart();
}
function removeItem(idx){
    cart.splice(idx,1);
    saveCart();
}

/* clear cart */
if(clearCart) clearCart.onclick = () => {
    cart = [];
    saveCart();
};

/* delivery type change */
document.querySelectorAll && document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
    radio.addEventListener('change', renderCart);
});

/* ====== Cart UI open/close and send Whatsapp ====== */
const closeCart = () => {
    if(cartDrawer) {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('show');
        cartDrawer.setAttribute('aria-hidden','true');
    }
    if(cartBtn) cartBtn.style.display = 'block';
};

if(cartBtn){
    cartBtn.addEventListener('click', () => {
        if(cartDrawer){
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('show');
            cartDrawer.setAttribute('aria-hidden','false');
        }
        renderCart();
        cartBtn.style.display = 'none';
    });
}
if(cartOverlay) cartOverlay.addEventListener('click', closeCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

/* Whatsapp send */
if(sendWhatsapp) sendWhatsapp.addEventListener('click', () => {
    if(cart.length === 0){ alert('السلة فارغة'); return; }
    const manualAddressNote = document.getElementById('manualAddress')?.value.trim() || '';
    const branchDeliveryFee = currentBranch.deliveryFee || 0;
    const whatsappNumber = currentBranch.whatsapp;
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
    const lines = ['طلب جديد من مطاعم سحايب ديرتي:'];
    let subtotal = 0;
    cart.forEach(it => {
        const price = (it.basePrice || 0) + (it.selectedOption?it.selectedOption.price:0);
        const optionText = it.selectedOption && it.selectedOption.name !== 'نفر' && it.selectedOption.name !== 'طبق' && it.selectedOption.name !== 'عبوة' ? ` — ${it.selectedOption.name}` : '';
        const noteText = it.note ? ` (ملاحظة: ${it.note})` : '';
        lines.push(`${it.qty} × ${it.name}${optionText} ${noteText} — ${price*it.qty} ريال`);
        subtotal += price*it.qty;
    });
    lines.push('---');
    lines.push(`1. إجمالي المنتجات: ${subtotal} ريال`);
    if(deliveryType === 'delivery') {
        lines.push(`2. نوع الطلب: توصيل (فرع ${currentBranch.name})`);
        lines.push(`3. رسوم التوصيل: ${branchDeliveryFee} ريال`);
        subtotal += branchDeliveryFee;
        if(userLocation){
            lines.push(`4. إحداثيات موقع التوصيل:`);
            lines.push(`   * خط العرض (Lat): ${userLocation.lat}`);
            lines.push(`   * خط الطول (Lng): ${userLocation.lng}`);
            lines.push(`   * رابط الخريطة: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`);
            lines.push(`⚠️ الموقع المحدد هو إحداثيات GPS ويجب على العميل تأكيد العنوان التفصيلي مع الموظف.`);
        } else {
            lines.push(`4. الموقع: لم يتم تحديد الموقع عبر الزر. يرجى تزويد الموظف بالعنوان كاملاً.`);
        }
    } else {
        lines.push(`2. نوع الطلب: استلام من الفرع (فرع ${currentBranch.name})`);
    }
    if(manualAddressNote){
        lines.push('---');
        lines.push(`5. ملاحظات التوصيل / العنوان اليدوي: ${manualAddressNote}`);
    }
    lines.push('---');
    lines.push(`الإجمالي النهائي: ${subtotal} ريال`);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
    cart = [];
    saveCart();
    closeCart();
});

/* ====== Notification prompt logic (kept) ====== */
function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            new Notification('أهلاً بك في سحايب ديرتي!', {
                body: 'تم تفعيل الإشعارات بنجاح. سنعلمك بأحدث العروض!',
                icon: 'Dirty55/Icon-192.png'
            });
        }
    });
}
function showNotificationPrompt() {
    if (!('Notification' in window)) return;
    if (localStorage.getItem('notifications_asked')) return;
    if (Notification.permission === 'granted') {
        localStorage.setItem('notifications_asked', 'true');
        return;
    }
    if(notificationPrompt) notificationPrompt.style.display = 'flex';
}
if(allowNotificationsBtn) allowNotificationsBtn.addEventListener('click', () => {
    if(notificationPrompt) notificationPrompt.style.display = 'none';
    localStorage.setItem('notifications_asked', 'true';
    requestNotificationPermission();
});
if(denyNotificationsBtn) denyNotificationsBtn.addEventListener('click', () => {
    if(notificationPrompt) notificationPrompt.style.display = 'none';
    localStorage.setItem('notifications_asked', 'true');
});
function initNotificationPrompt(){
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(isStandalone) setTimeout(showNotificationPrompt, 10000);
}

/* ====== PWA install prompt ====== */
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(installAppBtn) installAppBtn.style.display = 'block';
});
if(installAppBtn) installAppBtn.addEventListener('click', async () => {
    if(deferredPrompt){
        installAppBtn.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
    }
});

/* ====== Geolocation ====== */
function onSuccess(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    userLocation = { lat: latitude, lng: longitude };
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    if(locationStatus) {
        locationStatus.innerHTML = `✅ تم تحديد الموقع بنجاح! <br><a href="${mapLink}" target="_blank" style="color: var(--gold); text-decoration: underline; font-weight: bold;">عرض على الخريطة</a>`;
        locationStatus.style.color = '#4CAF50';
    }
    if(getLocationBtn) {
        getLocationBtn.disabled = false;
        getLocationBtn.innerText = '📍 تحديث الموقع';
    }
}
function onError(error){
    let message = 'حدث خطأ أثناء تحديد الموقع.';
    switch(error.code) {
        case error.PERMISSION_DENIED: message = '🚫 رفض المستخدم طلب تحديد الموقع.'; break;
        case error.POSITION_UNAVAILABLE: message = '❌ معلومات الموقع غير متوفرة حالياً.'; break;
        case error.TIMEOUT: message = '⏳ انتهت مهلة طلب تحديد الموقع.'; break;
        default: message = '🚨 خطأ غير معروف.'; break;
    }
    if(locationStatus){
        locationStatus.innerText = message;
        locationStatus.style.color = 'var(--red)';
    }
    if(getLocationBtn){
        getLocationBtn.disabled = false;
        getLocationBtn.innerText = '📍 تحديد موقع التوصيل الحالي (حاول مجدداً)';
    }
    userLocation = null;
}
function getMyLocation(){
    if(locationStatus) { locationStatus.innerText = 'جاري البحث عن موقعك... 📡'; locationStatus.style.color = '#aaa'; }
    if(getLocationBtn) { getLocationBtn.disabled = true; }
    if(!navigator.geolocation){
        if(locationStatus) { locationStatus.innerText = '❌ المتصفح لا يدعم تحديد الموقع الجغرافي.'; locationStatus.style.color = 'var(--red)'; }
        if(getLocationBtn) getLocationBtn.disabled = false;
        return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}
if(getLocationBtn) getLocationBtn.addEventListener('click', getMyLocation);

/* ====== Service Worker registration (kept) ====== */
if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Deerty6/service-worker.js').then(reg => {
            console.log('Service Worker Registered!', reg.scope);
        }).catch(err => console.error('Service Worker Registration failed:', err));
    });
}

/* ====== Fly-to-cart animation ====== */
function flyToCart(imgElement){
    if(!imgElement) return;
    const flyingImg = imgElement.cloneNode(true);
    flyingImg.className = "flying-img";
    flyingImg.style.position = 'fixed';
    flyingImg.style.zIndex = 9999;
    document.body.appendChild(flyingImg);
    const rect = imgElement.getBoundingClientRect();
    flyingImg.style.top = rect.top + "px";
    flyingImg.style.left = rect.left + "px";
    flyingImg.style.width = rect.width + "px";
    flyingImg.style.height = rect.height + "px";
    const cartRect = (document.getElementById("cartBtn") || document.getElementById("cartIcon") || cartBtn).getBoundingClientRect();
    setTimeout(() => {
        flyingImg.style.transition = 'transform 0.7s cubic-bezier(.2,.9,.2,1), opacity 0.7s';
        flyingImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`;
        flyingImg.style.opacity = "0";
    }, 10);
    setTimeout(()=> flyingImg.remove(), 800);
}

/* ====== Cart shake effect ====== */
function triggerCartShake(){
    const el = document.getElementById("cartBtn") || document.getElementById("cartIcon") || cartBtn;
    if(!el) return;
    el.classList.add('shake');
    setTimeout(()=> el.classList.remove('shake'), 450);
}

/* ====== Initial render and bindings ====== */
function initApp(){
    renderTopBanner();
    renderSections();
    renderCart();
    initNotificationPrompt();

    // Search bar binding
    if(searchBar) searchBar.addEventListener('input', (e) => renderMenu(currentSection, e.target.value));

    // Sticky sections (visual)
    const stickyHeaderHeight = 80;
    window.addEventListener('scroll', () => {
        if(!sectionsEl) return;
        const sectionsTop = sectionsEl.getBoundingClientRect().top;
        if (sectionsTop <= stickyHeaderHeight) sectionsEl.classList.add('sections-sticky'); else sectionsEl.classList.remove('sections-sticky');
    });

    // Render favorites shortcut (optional small button)
    renderFavoritesShortcut();
}

/* ====== Favorites shortcut render (small section) ====== */
function renderFavoritesShortcut(){
    if(!sectionsEl) return;
    if(favorites.length === 0) return;
    // create a "المفضلات" quick card at top if not exists
    if(document.getElementById('favQuickCard')) return;
    const favCard = document.createElement('div');
    favCard.id = 'favQuickCard';
    favCard.className = 'sec-card';
    favCard.innerHTML = `<img src="Dirty55/logo-bg.webp" alt="المفضلات" loading="lazy"><div class="sec-name">المفضلات ❤️</div>`;
    favCard.onclick = () => {
        // build a temporary section view that lists favorite items
        const favItems = processedMenuData.flatMap(s => s.items || []).filter(i => favorites.includes(i.id));
        if(favItems.length === 0) { alert('لا توجد مفضلات حالياً'); return; }
        // render favItems directly
        menuList.innerHTML = '';
        favItems.forEach(item => {
            item.actualSection = item.actualSection || 'مفضلات';
        });
        // Temporarily set a pseudo-section and render using the same renderMenu logic
        const tmpSec = { section: 'المفضلات', items: favItems };
        // render manually to preserve favorite buttons
        menuList.innerHTML = '';
        favItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.position = 'relative';
            const favActive = favorites.includes(item.id) ? 'active' : '';
            card.innerHTML = `
                <button class="fav-btn ${favActive}" data-id="${item.id}" title="أزل من المفضلة">♥</button>
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="item-body">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 class="item-name">${item.name}</h3>
                        <div style="font-size:0.9rem;color:rgba(255,255,255,0.8)">${item.basePrice} ريال</div>
                    </div>
                    <p style="margin:6px 0 0; color:rgba(255,255,255,0.6); font-size:0.9rem;">${item.actualSection}</p>
                    <button class="add-btn">أضف للسلة</button>
                </div>
            `;
            card.querySelector('.fav-btn').onclick = (e) => { e.stopPropagation(); toggleFavorite(item.id, e.target); card.remove(); };
            card.querySelector('.add-btn').onclick = () => { addToCart({...item, qty:1, selectedOption: item.options && item.options[0]}); triggerCartShake(); };
            menuList.appendChild(card);
        });
        window.scrollTo({top:0, behavior:'smooth'});
    };
    sectionsEl.parentNode.insertBefore(favCard, sectionsEl);
}

/* ====== Small helper: add CSS for flying-img if not present ====== */
(function injectSmallStyles(){
    const css = `
    .flying-img { border-radius:12px; pointer-events:none; transition: transform 0.7s, opacity 0.7s; z-index:9999; }
    .opt-btn { background:transparent; border:1px solid rgba(232,192,101,0.12); color: #fff; padding:8px 10px; margin:6px; border-radius:8px; cursor:pointer; }
    .cart-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
    `;
    const s = document.createElement('style'); s.innerHTML = css; document.head.appendChild(s);
})();

/* ====== Start app on load ====== */
window.addEventListener('load', initApp);

/* ====== Expose some functions to global scope (for inline onclicks in HTML) ====== */
window.updateQty = updateQty;
window.removeItem = removeItem;
window.getMyLocation = getMyLocation;
window.renderMenu = renderMenu;
window.toggleFavorite = toggleFavorite;
window.triggerCartShake = triggerCartShake;
