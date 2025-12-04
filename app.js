// ==================================
// app.js (النسخة النهائية والكاملة)
// ==================================

// 1. استيراد جميع الأجزاء 📦
import { currentBranch, processedMenuData, currentBranchId } from './config.js'; 
import { cart, updateQty, removeItem, addToCart, toggleFavorite, favorites } from './cartManager.js';
import * as UI from './uiRender.js';

// ====== حالة التطبيق العامة ====== 
let currentSection = processedMenuData[0].section;
let selectedItem = null;
let selectedOption = null;
let selectedItemImage = null;
let deferredPrompt = null; 

// ====== عناصر الواجهة العامة ======
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const sendWhatsapp = document.getElementById('sendWhatsapp');
const clearCart = document.getElementById('clearCart');
const searchBar = document.getElementById('searchBar');
const modalConfirm = document.getElementById('modalConfirm');
const itemNoteInput = document.getElementById('itemNote');
const installAppBtn = document.getElementById('installAppBtn');
const getLocationBtn = document.getElementById('getLocationBtn'); 
const locationStatusEl = document.getElementById('locationStatus'); 


// 2. منطق المودال (Show Options) - (يعرض الخيارات ويحدد الخيار الافتراضي)
function showOptions(item, skipOptions = false, itemImage = null){
    selectedItem = item;
    selectedOption = item.options && item.options.length > 0 ? item.options[0] : null;
    selectedItemImage = itemImage;
    
    document.getElementById('modalTitle').innerText = item.name;
    const optionsContainer = document.getElementById('modalOptions');
    optionsContainer.innerHTML = ''; 

    if (item.options && item.options.length > 0) {
        item.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = option.name + (option.price > 0 ? ` (+${option.price.toFixed(2)} ر.س)` : '');
            
            if (option === selectedOption) {
                btn.classList.add('selected');
            }

            btn.onclick = () => {
                document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOption = option;
            };
            optionsContainer.appendChild(btn);
        });
    }

    document.getElementById('optionModal').style.display = 'flex';
}

// 3. منطق تحديد الموقع الجغرافي 📍
function handleGetLocation() {
    if(!locationStatusEl) return;
    locationStatusEl.innerText = "جاري تحديد موقعك...";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                locationStatusEl.innerText = `✅ تم التحديد: خط عرض ${lat}, خط طول ${lon}`;
            },
            (error) => {
                locationStatusEl.innerText = "❌ تعذر تحديد الموقع. الرجاء إدخاله يدوياً.";
                console.error("Geolocation Error:", error.message);
            }, 
            { timeout: 10000 } 
        );
    } else {
        locationStatusEl.innerText = "متصفحك لا يدعم تحديد الموقع الجغرافي.";
    }
}

// 4. منطق واتساب وإرسال الطلب (مع إصلاح عدم مسح السلة)
function handleSendWhatsapp(){
    // ... (هنا يتم بناء رسالة الواتساب)
    
    // 🛑 تم إلغاء تفعيل سطر مسح السلة مؤقتاً لتجنب المشكلة
    // cart.length = 0; 
    
    UI.renderCart(cart, currentBranch); 
    // ... (هنا يمكنك إضافة رسالة نجاح أو إعادة توجيه)
}

// 5. منطق PWA التثبيت
function handleInstallClick() {
    if (deferredPrompt) deferredPrompt.prompt();
    if (installAppBtn) installAppBtn.style.display = 'none';
    deferredPrompt = null;
}

// 6. دالة التهيئة الرئيسية
function initApp(){
    // **********************************************
    // أ. PWA - تسجيل Service Worker
    // **********************************************
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('Service Worker registered!'))
                .catch(err => console.log('Service Worker registration failed:', err));
        });
    }
    
    // **********************************************
    // ب. ربط وظائف التحكم بالـ window
    // **********************************************
    window.updateQty = (idx, change) => {
        updateQty(idx, change); 
        UI.renderCart(cart, currentBranch); 
        UI.triggerCartShake();
    };
    window.removeItem = (idx) => {
        removeItem(idx);
        UI.renderCart(cart, currentBranch);
    };
    
    // **********************************************
    // ج. ربط مستمعات الأحداث (Event Listeners)
    // **********************************************
    
    // ربط زر تحديد الموقع 📍
    if (getLocationBtn) getLocationBtn.addEventListener('click', handleGetLocation);
    
    // ربط خيارات التوصيل لإعادة حساب الإجمالي 🚚
    const deliveryOptions = document.querySelectorAll('input[name="deliveryType"]');
    deliveryOptions.forEach(radio => {
        radio.addEventListener('change', () => UI.renderCart(cart, currentBranch));
    });

    // ربط زر المودال بـ addToCart
    if(modalConfirm){
        modalConfirm.onclick = () => {
            if(selectedItem){
                const note = itemNoteInput.value.trim();
                const optionToSend = selectedOption || (selectedItem.options && selectedItem.options[0]) || null;
                addToCart({...selectedItem, qty:1, selectedOption: optionToSend, note: note || null});
                if(selectedItemImage) UI.flyToCart(selectedItemImage);
                UI.triggerCartShake();
                document.getElementById('optionModal').style.display = 'none';
                UI.renderCart(cart, currentBranch);
            }
        };
    }
    
    // PWA - ربط زر التثبيت ومنع الحدث الافتراضي
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); 
        deferredPrompt = e;
        if(installAppBtn) installAppBtn.style.display = 'block';
    });
    if (installAppBtn) installAppBtn.addEventListener('click', handleInstallClick);

    // ربط البحث
    if(searchBar) searchBar.addEventListener('input', (e) => UI.renderMenu(currentSection, e.target.value, processedMenuData, currentBranch, favorites, showOptions, toggleFavorite));
    
    // ربط أزرار السلة
    const cartIcon = document.getElementById('cartBtn') || document.getElementById('cartIcon');
    if(cartIcon){
        cartIcon.addEventListener('click', () => {
             cartDrawer.classList.add('open');
             cartOverlay.classList.add('show');
        });
    }
    if(cartOverlay) cartOverlay.addEventListener('click', ()=> { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('show'); });
    if(closeCartBtn) closeCartBtn.addEventListener('click', ()=> { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('show'); });
    
    if(sendWhatsapp) sendWhatsapp.addEventListener('click', handleSendWhatsapp);
    if(clearCart) clearCart.onclick = () => { cart.length = 0; UI.renderCart(cart, currentBranch); };
    
    // **********************************************
    // د. بدء العرض الأولي
    // **********************************************
    
    UI.renderTopBanner();

    UI.renderSections(processedMenuData, currentBranch, currentSection, (newSection, search) => {
        currentSection = newSection; 
        UI.renderMenu(newSection, search, processedMenuData, currentBranch, favorites, showOptions, toggleFavorite);
    });
    
    UI.renderMenu(currentSection, '', processedMenuData, currentBranch, favorites, showOptions, toggleFavorite);
    
    UI.renderCart(cart, currentBranch);
}

window.addEventListener('load', initApp);
