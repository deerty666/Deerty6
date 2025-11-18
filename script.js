// ---------- بيانات الأقسام ----------
const sections = [
    {id:1, name:"برغر", img:"https://via.placeholder.com/100"},
    {id:2, name:"بيتزا", img:"https://via.placeholder.com/100"},
    {id:3, name:"مشروبات", img:"https://via.placeholder.com/100"}
];

// ---------- بيانات المنتجات ----------
const menuData = [
    {id:1, section:1, name:"برغر كلاسيك", price:1500, bestSeller:true, available:true, discount:0, img:"https://via.placeholder.com/150"},
    {id:2, section:1, name:"برغر جبن", price:1800, bestSeller:false, available:true, discount:200, img:"https://via.placeholder.com/150"},
    {id:3, section:2, name:"بيتزا مارغريتا", price:2500, bestSeller:true, available:true, discount:0, img:"https://via.placeholder.com/150"},
    {id:4, section:3, name:"كولا", price:500, bestSeller:false, available:true, discount:0, img:"https://via.placeholder.com/150"}
];

// ---------- إنشاء الأقسام ----------
const sectionsContainer = document.getElementById("sections");
sections.forEach(sec=>{
    const div = document.createElement("div");
    div.className="sec-card";
    div.innerHTML = `<img src="${sec.img}" alt="${sec.name}"><p>${sec.name}</p>`;
    div.addEventListener("click",()=>{filterSection(sec.id)});
    sectionsContainer.appendChild(div);
});

// ---------- عرض المنتجات ----------
const menuList = document.getElementById("menuList");
function renderMenu(data){
    menuList.innerHTML="";
    data.forEach(item=>{
        const div = document.createElement("div");
        div.className="card";
        if(item.discount>0) div.classList.add("discount-card");
        if(!item.available) div.classList.add("unavailable-card");
        div.innerHTML = `
            ${item.bestSeller?'<div class="best-seller-badge">الأكثر مبيعاً</div>':''}
            <img src="${item.img}" alt="${item.name}" style="width:100%;height:100px;object-fit:cover;border-radius:6px">
            <h4>${item.name}</h4>
            <p>السعر: ${item.price} ريال</p>
            ${item.discount>0?'<p>خصم: '+item.discount+'</p>':''}
            <button onclick="addToCart(${item.id})">أضف للسلة</button>
        `;
        menuList.appendChild(div);
    });
}
renderMenu(menuData);

// ---------- فلتر القسم ----------
function filterSection(secId){
    renderMenu(menuData.filter(m=>m.section===secId));
}

// ---------- بحث ----------
document.getElementById("searchBar").addEventListener("input",(e)=>{
    const term = e.target.value.toLowerCase();
    renderMenu(menuData.filter(m=>m.name.toLowerCase().includes(term)));
});

// ---------- السلة ----------
let cart = [];
function addToCart(id){
    const item = menuData.find(m=>m.id===id);
    cart.push(item);
    updateCartCount();
    alert(item.name+" تمت إضافته للسلة!");
}
function updateCartCount(){
    document.getElementById("cartCount").textContent=cart.length;
}

// ---------- زر السلة ----------
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
cartBtn.addEventListener("click",()=>{
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
    renderCart();
});
document.getElementById("closeCartBtn").addEventListener("click",()=>{
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
});
document.getElementById("clearCart").addEventListener("click",()=>{
    cart=[];
    updateCartCount();
    renderCart();
});

// ---------- عرض محتويات السلة ----------
function renderCart(){
    const container = document.getElementById("cartItems");
    container.innerHTML="";
    cart.forEach(item=>{
        const div = document.createElement("div");
        div.textContent = `${item.name} - ${item.price} ريال`;
        container.appendChild(div);
    });
    const total = cart.reduce((sum,item)=>sum+item.price,0);
    document.getElementById("totalBreakdown").textContent="الإجمالي: "+total+" ريال";
}

// ---------- واتساب ----------
document.getElementById("sendWhatsapp").addEventListener("click",()=>{
    if(cart.length===0) return alert("السلة فارغة!");
    const message = cart.map(i=>i.name+" : "+i.price+" ريال").join("\n");
    const total = cart.reduce((sum,i)=>sum+i.price,0);
    const url = `https://wa.me/967000000000?text=${encodeURIComponent(message+"\nالإجمالي: "+total+" ريال")}`;
    window.open(url,"_blank");
});
