// ==================================
// uiRender.js (النسخة النهائية والمصححة مع الرسوم المتحركة)
// ==================================

const sectionsEl = document.getElementById('sections');
const menuList = document.getElementById('menuList');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const totalBreakdownEl = document.getElementById('totalBreakdown');
const optionModal = document.getElementById('optionModal');
const cartBtn = document.getElementById('cartBtn') || document.getElementById('cartIcon');


/* ====== Helper UI functions ====== */
export function flashCartButton(){
    if(cartBtn){
        cartBtn.classList.add('flash-cart-btn');
        setTimeout(()=> cartBtn.classList.remove('flash-cart-btn'), 350);
    }
}

// 🔑 دالة الطيران المصححة والكاملة
export function flyToCart(imgElement) {
    if (!imgElement || !cartBtn) return;
    
    const flyingImg = imgElement.cloneNode(true);
    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    flyingImg.style.position = 'fixed';
    flyingImg.style.left = rect.left + 'px';
    flyingImg.style.top = rect.top + 'px';
    flyingImg.style.width = rect.width + 'px';
    flyingImg.style.height = rect.height + 'px';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.transition = 'all 0.5s cubic-bezier(0.5, -0.5, 0.8, 0.8)';
    flyingImg.style.opacity = '1';
    
    document.body.appendChild(flyingImg);

    // Animate to cart button's center
    flyingImg.style.left = cartRect.left + cartRect.width / 2 - rect.width / 2 + 'px';
    flyingImg.style.top = cartRect.top + cartRect.height / 2 - rect.height / 2 + 'px';
    flyingImg.style.width = '20px';
    flyingImg.style.height = '20px';
    flyingImg.style.opacity = '0';
    
    // Remove after animation and trigger flash
    setTimeout(() => {
        flyingImg.remove();
        flashCartButton();
    }, 500);
}

export function triggerCartShake(){
    const el = document.getElementById("cartBtn") || document.getElementById("cartIcon") || cartBtn;
    if(!el) return;
    el.classList.add('shake');
    setTimeout(()=> el.classList.remove('shake'), 450);
}

// ... (باقي دوال العرض مثل renderTopBanner, renderSections, renderMenu لم تتغير)
export function renderTopBanner(){
    if(document.getElementById('topBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'topBanner';
    banner.className = 'banner';
    banner.innerText = '🎉 عرض اليوم: نفر حاشي مكموت بـ 50 ريال فقط — اطلب الآن!';
    if(sectionsEl && sectionsEl.parentNode){
        sectionsEl.parentNode.insertBefore(banner, sectionsEl);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }
}

export function renderSections(processedMenuData, currentBranch, currentSection, renderMenuFn){
    if(!sectionsEl) return;
    sectionsEl.innerHTML = '';
    processedMenuData.forEach((sec, idx) => {
        if (sec.section !== "الكل" && sec.sectionAvailableIn && !sec.sectionAvailableIn.includes(currentBranch.id)) return;
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
            renderMenuFn(sec.section, ''); 
            document.getElementById('searchBar').value = '';
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
        sectionsEl.appendChild(card);
    });
}

export function renderMenu(sectionName, searchTerm, processedMenuData, currentBranch, favorites, showOptionsFn, toggleFavoriteFn){
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

    const branchFilteredItems = itemsToRender.filter(item => item.availableIn && item.availableIn.includes(currentBranch.id));
    const filteredItems = branchFilteredItems.filter(item => item.name.toLowerCase().includes(normalizedSearch));

    if (filteredItems.length === 0) {
        menuList.innerHTML = `<div style="text-align: center; color: #aaa; padding: 20px;">لا توجد أصناف مطابقة لـ "${searchTerm}" في قسم ${sectionName}.</div>`;
        return;
    }

    filteredItems.forEach(item => {
        const isAvailable = item.isAvailable !== false;
        const favActive = favorites.includes(item.id) ? 'active' : '';

        const card = document.createElement('div');
        card.className = `menu-card ${isAvailable ? '' : 'unavailable'}`;
        card.innerHTML = `
            <div class="fav-btn ${favActive}" data-id="${item.id}">❤️</div>
            <img src="${item.img}" alt="${item.name}" onerror="this.style.opacity=.35" loading="lazy">
            <div class="card-details">
                <div class="name-price">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.basePrice.toFixed(2)} ر.س</div>
                </div>
                ${isAvailable ? `
                    <button class="add-btn">
                        <span class="btn-text">أضف للسلة</span>
                        <span class="icon">🛒</span>
                    </button>` : `<div class="unavailable-tag">غير متوفر حالياً</div>`}
            </div>
        `;

        const favBtn = card.querySelector('.fav-btn');
        favBtn.onclick = (e) => {
            e.stopPropagation();
            const id = favBtn.dataset.id;
            toggleFavoriteFn(id); 
            favBtn.classList.toggle('active');
        };

        const addBtn = card.querySelector('.add-btn');
        if(isAvailable && addBtn){
            addBtn.onclick = () => {
                showOptionsFn({...item, currentBranchId: currentBranch.id}, false, card.querySelector('img'));
            };
        }
        menuList.appendChild(card);
    });
}

// ... (تنسيق عرض السلة)
export function renderCart(cart, currentBranch){
    if(!cartItemsEl || !totalBreakdownEl) return;
    cartItemsEl.innerHTML = '';
    let subtotal = 0;
    let count = 0;
    const branchDeliveryFee = currentBranch.deliveryFee || 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<div class="empty-cart-msg">سلتك فارغة! أضف بعض الأصناف اللذيذة.</div>`;
    }

    cart.forEach((it, idx) => {
        const price = (it.basePrice || 0) + (it.selectedOption?it.selectedOption.price:0);
        const itemTotal = price * it.qty;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="item-info">
                <div class="item-qty">
                    <button class="qty-btn remove" onclick="updateQty(${idx}, -1)">-</button>
                    <span>${it.qty}</span>
                    <button class="qty-btn add" onclick="updateQty(${idx}, 1)">+</button>
                </div>
                <div class="item-name-note">
                    ${it.name}
                    ${it.selectedOption ? `<small>(${it.selectedOption.name})</small>` : ''}
                    ${it.note ? `<small class="note">ملاحظة: ${it.note}</small>` : ''}
                </div>
                <div class="item-price">${itemTotal.toFixed(2)} ر.س</div>
            </div>
            <button class="remove-item" onclick="removeItem(${idx})">❌</button>
        `;
        cartItemsEl.appendChild(itemEl);
        subtotal += itemTotal;
        count += it.qty;
    });

    // Total Breakdown
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
    const isDelivery = deliveryType && deliveryType.value === 'delivery';
    const finalDeliveryFee = isDelivery ? branchDeliveryFee : 0;
    const total = subtotal + finalDeliveryFee;

    totalBreakdownEl.innerHTML = `
        <p><span>المجموع الفرعي:</span> <span>${subtotal.toFixed(2)} ر.س</span></p>
        <p><span>رسوم التوصيل:</span> <span>${finalDeliveryFee.toFixed(2)} ر.س</span></p>
        <h3><span>الإجمالي:</span> <span>${total.toFixed(2)} ر.س</span></h3>
    `;

    if(cartCount) {
        cartCount.innerText = count;
        cartCount.style.display = count===0 ? 'none' : 'inline-block';
    }
}
