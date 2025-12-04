// ==================================
// cartManager.js
// ==================================

export let cart = JSON.parse(localStorage.getItem('deerty_cart') || '[]');
export let favorites = JSON.parse(localStorage.getItem('deerty_favs') || '[]');

export function saveCart(){
    localStorage.setItem('deerty_cart', JSON.stringify(cart));
}

export function addToCart(item){
    const obj = {...item};
    delete obj.branchDiscounts;
    delete obj.isBestSeller;
    delete obj.availableIn;
    
    const key = obj.id + (obj.selectedOption?`-${obj.selectedOption.name}`:'') + (obj.note ? `-${obj.note}` : '');
    const found = cart.find(i => i.key === key);
    
    if(found) found.qty += 1;
    else cart.push({...obj, key});
    
    saveCart();
}

export function updateQty(idx, change){
    if(!cart[idx]) return;
    cart[idx].qty += change;
    if(cart[idx].qty < 1) cart.splice(idx,1);
    saveCart();
}

export function removeItem(idx){
    cart.splice(idx,1);
    saveCart();
}

export function toggleFavorite(itemId){
    const idx = favorites.indexOf(itemId);
    if(idx === -1) favorites.push(itemId);
    else favorites.splice(idx,1);
    localStorage.setItem('deerty_favs', JSON.stringify(favorites));
}
