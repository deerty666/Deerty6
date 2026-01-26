body{
  margin:0;
  font-family:Tahoma;
  background:#111;
  color:#fff;
}

header{
  background:#000;
  padding:15px;
  text-align:center;
  font-size:20px;
}

#sections{
  display:flex;
  gap:10px;
  padding:10px;
  overflow-x:auto;
}

.section{
  background:#333;
  padding:10px 15px;
  border-radius:10px;
  cursor:pointer;
  white-space:nowrap;
}

.section.active{
  background:#c39e6a;
  color:#000;
}

#menu{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
  padding:10px;
}

.card{
  background:#222;
  border-radius:10px;
  overflow:hidden;
  position:relative;
}

.card img{
  width:100%;
  height:120px;
  object-fit:cover;
}

.card h4,.card p{
  margin:5px 10px;
}

.card button{
  background:#c39e6a;
  border:none;
  padding:10px;
  width:100%;
  cursor:pointer;
}

/* 🛒 زر السلة */
#cartBtn{
  position:fixed;
  bottom:15px;
  right:15px;
  padding:12px 15px;
  border-radius:10px;
  background:#fff;
  color:#000;
  z-index:1000;
}

/* 🛒 Drawer السلة */
#cart{
  position:fixed;
  top:0;
  right:0;
  width:320px;
  height:100%;
  background:#111;
  padding:15px;
  transform:translateX(100%);
  transition:.3s;
  z-index:999;
}

#cart.show{transform:translateX(0)}

#cart h3{
  margin-top:0;
  text-align:center;
}

.cart-item{
  border-bottom:1pxć dashed #333;
  padding:8px 0;
}

.cart-controls{
  display:flex;
  gap:5px;
}

.cart-controls button{
  background:#c39e6a;
  border:none;
  padding:4px 10px;
}

.cart-options{
  display:flex;
  justify-content:space-between;
  margin:10px 0;
}

#locBtn,#send{
  width:100%;
  margin-top:10px;
  padding:10px;
  background:#c39e6a;
  border:none;
  font-weight:bold;
}

#locText{
  font-size:12px;
  color:#aaa;
  margin-top:5px;
}
