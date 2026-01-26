/* ========= ADMIN ========= */
const ADMIN_KEY = "admin";
const ADMIN_PASS = "1234"; // غيرها

const params = new URLSearchParams(location.search);
if(params.get("admin")==="1"){
  const p = prompt("كلمة المرور");
  if(p===ADMIN_PASS){
    localStorage.setItem(ADMIN_KEY,"1");
    alert("تم تفعيل التحكم");
  }
}
const isAdmin = localStorage.getItem(ADMIN_KEY)==="1";

/* ========= DATA ========= */
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

function save(){localStorage.setItem("menuData",JSON.stringify(menuData));}

/* ========= RENDER ========= */
const sections=document.getElementById("sections");
const menu=document.getElementById("menu");
let current=0;

menuData.forEach((s,i)=>{
 const d=document.createElement("div");
 d.className="section"+(i===0?" active":"");
 d.textContent=s.section;
 d.onclick=()=>show(i);
 sections.appendChild(d);
});

function show(i){
 current=i;
 document.querySelectorAll(".section").forEach(e=>e.classList.remove("active"));
 sections.children[i].classList.add("active");
 menu.innerHTML="";
 menuData[i].items.forEach(item=>{
  if(!item.on && !isAdmin) return;
  menu.innerHTML+=`
  <div class="card">
   <img src="${item.img}">
   ${isAdmin?`
   <div class="admin-tools">
    <button onclick="editPrice(${item.id})">💰</button>
    <button onclick="toggleItem(${item.id})">${item.on?"⛔":"▶️"}</button>
   </div>`:""}
   <h4>${item.name}</h4>
   <p>${item.price} ريال</p>
   ${item.on?`<button onclick="add(${item.id})">أضف</button>`:""}
  </div>`;
 });
}
show(0);

/* ========= ADMIN ACTIONS ========= */
function editPrice(id){
 const item=find(id);
 const p=prompt("السعر الجديد",item.price);
 if(p){item.price=+p;save();show(current);}
}
function toggleItem(id){
 const item=find(id);
 item.on=!item.on;save();show(current);
}
function find(id){
 return menuData.flatMap(s=>s.items).find(i=>i.id===id);
}

/* ========= CART ========= */
let cart=[];
function add(id){
 const item=find(id);
 const ex=cart.find(i=>i.id===id);
 ex?ex.qty++:cart.push({...item,qty:1});
 renderCart();
}
function renderCart(){
 const el=document.getElementById("cartItems");
 el.innerHTML="";
 let c=0;
 cart.forEach((i,idx)=>{
  c+=i.qty;
  el.innerHTML+=`${i.name} × ${i.qty}
   <button onclick="chg(${idx},1)">+</button>
   <button onclick="chg(${idx},-1)">-</button><br>`;
 });
 document.getElementById("cartCount").textContent=c;
}
function chg(i,v){
 cart[i].qty+=v;
 if(cart[i].qty<=0) cart.splice(i,1);
 renderCart();
}

/* ========= LOCATION ========= */
document.getElementById("locBtn").onclick=()=>{
 navigator.geolocation.getCurrentPosition(p=>{
  document.getElementById("locText").textContent=
   p.coords.latitude+","+p.coords.longitude;
 });
};

/* ========= SEND ========= */
document.getElementById("send").onclick=()=>{
 let t="طلب:%0A";
 cart.forEach(i=>t+=`${i.name} × ${i.qty}%0A`);
 location.href="https://wa.me/966XXXXXXXXX?text="+t;
};
