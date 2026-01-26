document.addEventListener("DOMContentLoaded", () => {

/* ===== ADMIN ===== */
const ADMIN_KEY = "admin";
if (new URLSearchParams(location.search).get("admin") === "1") {
  const p = prompt("كلمة مرور الإدارة");
  if (p === "1234") {
    localStorage.setItem(ADMIN_KEY, "1");
    alert("تم تفعيل الكنترول");
  }
}
const isAdmin = localStorage.getItem(ADMIN_KEY) === "1";

/* ===== DATA ===== */
let menuData = JSON.parse(localStorage.getItem("menuData")) || [
 {section:"الشواية",items:[
  {id:1,name:"دجاج شواية",price:25,img:"images/a1.webp",on:true},
  {id:2,name:"نص شواية",price:13,img:"images/a2.webp",on:true}
 ]},
 {section:"المندي",items:[
  {id:3,name:"دجاج مندي",price:27,img:"images/b1.webp",on:true},
  {id:4,name:"نص مندي",price:14,img:"images/b2.webp",on:true}
 ]},
 {section:"المشروبات",items:[
  {id:5,name:"بيبسي",price:3,img:"images/c1.webp",on:true},
  {id:6,name:"ماء",price:1,img:"images/c2.webp",on:true}
 ]},
 {section:"الإضافات",items:[
  {id:7,name:"رز",price:5,img:"images/d1.webp",on:true},
  {id:8,name:"سلطة",price:4,img:"images/d2.webp",on:true}
 ]}
];
const save=()=>localStorage.setItem("menuData",JSON.stringify(menuData));

/* ===== UI ===== */
const sections=document.getElementById("sections");
const menu=document.getElementById("menu");
const cartBtn=document.getElementById("cartBtn");
const cartBox=document.getElementById("cart");
const cartCount=document.getElementById("cartCount");

let current=0;
let cart=[];

/* ===== SECTIONS ===== */
menuData.forEach((s,i)=>{
 const b=document.createElement("div");
 b.className="section";
 b.textContent=s.section;
 b.onclick=()=>render(i);
 sections.appendChild(b);
});
render(0);

function render(i){
 current=i;
 menu.innerHTML="";
 menuData[i].items.forEach(item=>{
  if(!item.on && !isAdmin) return;

  const div=document.createElement("div");
  div.className="card";
  div.innerHTML=`
    <img src="${item.img}">
    <h4>${item.name}</h4>
    <p>${item.price} ريال</p>
    ${item.on?`<button>أضف</button>`:""}
    ${isAdmin?`
      <div class="admin-tools">
        <button onclick="editPrice(${item.id})">💰</button>
        <button onclick="toggleItem(${item.id})">${item.on?"⛔":"▶️"}</button>
      </div>`:""}
  `;
  if(item.on) div.querySelector("button").onclick=()=>add(item.id);
  menu.appendChild(div);
 });
}

/* ===== ADMIN ACTIONS ===== */
window.editPrice=(id)=>{
 const item=find(id);
 const p=prompt("السعر الجديد",item.price);
 if(p){item.price=+p;save();render(current);}
};
window.toggleItem=(id)=>{
 const item=find(id);
 item.on=!item.on;save();render(current);
};
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
  el.innerHTML+=`${i.name} × ${i.qty}
    <button onclick="chg(${idx},1)">+</button>
    <button onclick="chg(${idx},-1)">-</button><br>`;
 });
 cartCount.textContent=c;
}
window.chg=(i,v)=>{
 cart[i].qty+=v;
 if(cart[i].qty<=0) cart.splice(i,1);
 drawCart();
};

/* ===== CART TOGGLE ===== */
cartBtn.onclick=()=>cartBox.classList.toggle("show");

/* ===== LOCATION ===== */
document.getElementById("locBtn").onclick=()=>{
 navigator.geolocation.getCurrentPosition(p=>{
  document.getElementById("locText").textContent=
   p.coords.latitude+","+p.coords.longitude;
 });
};

/* ===== SEND ===== */
document.getElementById("send").onclick=()=>{
 let t="طلب:%0A";
 cart.forEach(i=>t+=`${i.name} × ${i.qty}%0A`);
 window.open("https://wa.me/966XXXXXXXXX?text="+t);
};

});
