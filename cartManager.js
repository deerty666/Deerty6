// ==================================
// cartManager.js (النسخة النهائية لتشغيل السلة والمفضلة)
// ==================================

// حالة السلة والمفضلة 🛒
export let cart = [];
// استخدام localStorage لتخزين المفضلة
export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// دالة تحديث الكمية
export function updateQty(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            removeItem(index);
        }
    }
}

// دالة إزالة المنتج
export function removeItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    }
}

// دالة إضافة منتج للسلة
export function addToCart(item) {
    let existingItem = cart.find(cartItem => 
        cartItem.id === item.id && 
        cartItem.selectedOption?.name === item.selectedOption?.name
    );

    if (existingItem) {
        existingItem.qty += item.qty;
    } else {
        cart.push(item);
    }
}

// دالة تبديل حالة المفضلة (القلب) ❤️
export function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    if (index > -1) {
        favorites.splice(index, 1); // إزالة من المفضلة
    } else {
        favorites.push(itemId); // إضافة إلى المفضلة
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
