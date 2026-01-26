/* ===== ADMIN ===== */
const ADMIN_KEY="admin";
if(new URLSearchParams(location.search).get("admin")==="1"){
  if(prompt("كلمة مرور الإدارة")==="1234"){
    localStorage.setItem(ADMIN_KEY,"1");
    alert("تم تفعيل الكنترول");
  }
}
const isAdmin=localStorage.getItem(ADMIN_KEY)==="1";

/* ===== DATA ===== */
let menuData=JSON.parse(localStorage.getItem("menuData"))||[
 {section:"الشواية",items:[
  {id:1,name:"دجاج شواية",price:25,img:"md02.webp",on:true},
  {id:2,name:"نص شواية",price:13,img:"mn02.webp",on:true}
 ]},
 {section:"المندي",items:[
  {id:3,name:"دجاج مندي",price:27,img:"md02.webp",on:true},
  {id:4,name:"نص مندي",price:14,img:"mn02.webp",on:true}
 ]},
 {section:"المشروبات",items:[
  {id:5,name:"بيبسي",price:3,img:"dr00.webp",on:true},
  {id:6,name:"عصير",price:5,img:"dr05.webp",on:true}
 ]},
 {section:"الإضافات",items:[
  {id:7,name:"سلطة",price:4,img:"ap01.webp",on:true},
  {id:8,name:"حمص",price:5,img:"ap03.webp",on:true}
 ]}
];
const save=()=>localStorage.setItem("menuData",JSON.stringify(menuData));

/* ===== UI ===== */
const sections=document.getElementById("sections");
const menu=document.getElementById("menu");
const cartBtn=document.getElementById("cartBtn");
const cartBox=document.getElementById("cart");
const cartCount=document.getElementById("cartCount");

let current=0,cart=[];

/* ===== RENDER ===== */
menuData.forEach((s,i)=>{
 const b=document.createElement("div");
 b.className="section"+(i===0?" active":"");
 b.textContent=s.section;
 b.onclick=()=>render(i);
 sections.appendChild(b);
});
render(0);

function render(i){
 current=i;
 document.querySelectorAll(".section").forEach(e=>e.classList.remove("active"));
 sections.children[i].classList.add("active");
 menu.innerHTML="";
 menuData[i].items.forEach(item=>{
  if(!item.on&&!isAdmin)return;
  menu.innerHTML+=`
   <div class="card">
    <img src="${item.img}">
    <h4>${item.name}</h4>
    <p>${item.price} ريال</p>
    ${item.on?`<button onclick="add(${item.id})">أضف</button>`:""}
    ${isAdmin?`
      <div class="admin-tools">
        <button onclick="edit(${item.id})">💰</button>
        <button onclick="toggle(${item.id})">${item.on?"⛔":"▶️"}</button>
      </div>`:""}
   </div>`;
 });
}

/* ===== ADMIN ===== */
function edit(id){
 const it=find(id);
 const p=prompt("السعر الجديد",it.price);
 if(p){it.price=+p;save();render(current);}
}
function toggle(id){
 const it=find(id);
 it.on=!it.on;save();render(current);
}
const find=id=>menuData.flatMap(s=>s.items).find(i=>i.id===id);

/* ===== CART ===== */
function add(id){
 const it=find(id);
 const ex=cart.find(i=>i.id===id);
 ex?ex.qty++:cart.push({...it,qty:1});
 drawCart();
}
function drawCart(){
 const el=document.getElementById("cartItems");
 el.innerHTML="";
 let c=0;
 cart.forEach((i,idx)=>{
  c+=i.qty;
  el.innerHTML+=`
   <div class="cart-item">
    ${i.name} × ${i.qty}
    <div class="cart-controls">
      <button onclick="chg(${idx},1)">+</button>
      <button onclick="chg(${idx},-1)">-</button>
    </div>
   </div>`;
 });
 cartCount.textContent=c;
}
function chg(i,v){
 cart[i].qty+=v;
 if(cart[i].qty<=0)cart.splice(i,1);
 drawCart();
}

/* ===== CART TOGGLE ===== */
cartBtn.onclick=()=>cartBox.classList.toggle("show");

/* ===== LOCATION ===== */
document.getElementById("locBtn").onclick=()=>{
 navigator.geolocation.getCurrentPosition(p=>{
  document.getElementById("locText").textContent=
   p.coords.latitude+", "+p.coords.longitude;
 });
};

/* ===== SEND ===== */
document.getElementById("send").onclick=()=>{
 let t="طلب:%0A";
 cart.forEach(i=>t+=`${i.name} × ${i.qty}%0A`);
 window.open("https://wa.me/966XXXXXXXXX?text="+t);
};
