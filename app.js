// ==================================
// app.js
// ==================================

// 1. استيراد جميع الأجزاء
import { currentBranch, processedMenuData, currentBranchId } from './config.js'; 
import { cart, updateQty, removeItem, addToCart, toggleFavorite, favorites } from './cartManager.js';
import * as UI from './uiRender.js';

// ====== حالة التطبيق العامة ====== 
let currentSection = processedMenuData[0].section;
let selectedItem = null;
let selectedOption = null;
let selectedItemImage = null;
let deferredPrompt = null; // PWA Install event

// ====== عناصر الواجهة العامة (المستخدمة في app.js فقط) ======
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const sendWhatsapp = document.getElementById('sendWhatsapp');
const clearCart = document.getElementById('clearCart');
const searchBar = document.getElementById('searchBar');
const modalConfirm = document.getElementById('modalConfirm');
const itemNoteInput = document.getElementById('itemNote');
const installAppBtn = document.getElementById('installAppBtn');


// 2. منطق المودال (Show Options)
function showOptions(item, skipOptions = false, itemImage = null){
    selectedItem = item;
    selectedOption = item.options && item.options.length>0 ? item.options[0] : null;
    selectedItemImage = itemImage;
    
    // ... (منطق عرض المودال الأصلي)
    document.getElementById('modalTitle').innerText = item.name;
    document.getElementById('optionModal').style.display = 'flex';
}

// 3. منطق واتساب وإرسال الطلب
function handleSendWhatsapp(){
    // ... (منطق إنشاء رسالة الواتساب)
    cart.length = 0; 
    UI.renderCart(cart, currentBranch); 
    // ... 
}

// 4. منطق PWA التثبيت
function handleInstallClick() {
    if (deferredPrompt) deferredPrompt.prompt();
    if (installAppBtn) installAppBtn.style.display = 'none';
    deferredPrompt = null;
}

// 5. دالة التهيئة الرئيسية
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
    // ب. ربط وظائف التحكم (CartManager) بالـ window
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
