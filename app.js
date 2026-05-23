const STORAGE_KEY = "deerty_drivers_settlement_v1";

const defaultData = {
  businessName: "مطاعم ومطابخ سحايب ديرتي",
  date: new Date().toISOString().slice(0,10),
  drivers: [
    {name:"فؤاد",account:0,extra:0,network:0,fuel:0,apartments:0,expense:0},
    {name:"الجابر",account:0,extra:0,network:0,fuel:0,apartments:0,expense:0},
    {name:"مجاهد",account:0,extra:0,network:0,fuel:0,apartments:0,expense:0}
  ]
};

let data = loadData();

function loadData(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
  } catch(e){
    return defaultData;
  }
}

function saveData(){
  data.businessName =
    document.getElementById("businessName").innerText.trim()
    || defaultData.businessName;

  data.date =
    document.getElementById("settlementDate").value
    || defaultData.date;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function money(n){
  return (parseFloat(n) || 0).toFixed(2);
}

function render(){

  document.getElementById("businessName").innerText =
    data.businessName || defaultData.businessName;

  document.getElementById("settlementDate").value =
    data.date || defaultData.date;

  const body = document.getElementById("driversBody");
  body.innerHTML = "";

  data.drivers.forEach((d,i)=>{

    const net =
      (parseFloat(d.account)||0)
      +(parseFloat(d.extra)||0)
      -(parseFloat(d.network)||0)
      -(parseFloat(d.fuel)||0)
      -(parseFloat(d.apartments)||0)
      -(parseFloat(d.expense)||0);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input
          class="nameInput"
          value="${escapeHtml(d.name)}"
          oninput="updateField(${i}, 'name', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.account}"
          oninput="updateField(${i}, 'account', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.extra}"
          oninput="updateField(${i}, 'extra', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.network}"
          oninput="updateField(${i}, 'network', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.fuel}"
          oninput="updateField(${i}, 'fuel', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.apartments}"
          oninput="updateField(${i}, 'apartments', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${d.expense}"
          oninput="updateField(${i}, 'expense', this.value)"
        >
      </td>

      <td class="netCell">
        ${money(net)}
      </td>

      <td class="no-print">
        <button
          class="iconBtn deleteBtn"
          onclick="deleteDriver(${i})"
        >
          حذف
        </button>
      </td>
    `;

    body.appendChild(tr);
  });

  updateTotals();
  saveData();
}

function updateField(i, field, value){

  if(field === "name"){
    data.drivers[i][field] = value;
  } else {
    data.drivers[i][field] = parseFloat(value) || 0;
  }

  updateTotals();
  saveData();

  document.querySelectorAll(".netCell")[i].innerText =
    money(
      (parseFloat(data.drivers[i].account)||0)
      +(parseFloat(data.drivers[i].extra)||0)
      -(parseFloat(data.drivers[i].network)||0)
      -(parseFloat(data.drivers[i].fuel)||0)
      -(parseFloat(data.drivers[i].apartments)||0)
      -(parseFloat(data.drivers[i].expense)||0)
    );
}

function addDriver(){

  const input = document.getElementById("driverName");
  const name = input.value.trim();

  if(!name){
    alert("اكتب اسم السواق أولاً");
    return;
  }

  data.drivers.push({
    name,
    account:0,
    extra:0,
    network:0,
    fuel:0,
    apartments:0,
    expense:0
  });

  input.value = "";

  render();
}

function deleteDriver(i){

  if(confirm("حذف هذا السواق؟")){

    data.drivers.splice(i,1);

    render();
  }
}

function resetDay(){

  if(!confirm("تصفير مبالغ اليوم مع بقاء أسماء السواقين؟"))
    return;

  data.drivers = data.drivers.map(d=>({
    ...d,
    account:0,
    extra:0,
    network:0,
    fuel:0,
    apartments:0,
    expense:0
  }));

  render();
}

function updateTotals(){

  const totals = data.drivers.reduce((a,d)=>{

    a.account += parseFloat(d.account)||0;
    a.extra += parseFloat(d.extra)||0;
    a.network += parseFloat(d.network)||0;
    a.fuel += parseFloat(d.fuel)||0;
    a.apartments += parseFloat(d.apartments)||0;
    a.expense += parseFloat(d.expense)||0;

    return a;

  },{
    account:0,
    extra:0,
    network:0,
    fuel:0,
    apartments:0,
    expense:0
  });

  const deductions =
    totals.network
    + totals.fuel
    + totals.apartments
    + totals.expense;

  const net =
    totals.account
    + totals.extra
    - deductions;

  document.getElementById("sumAccount").innerText = money(totals.account);
  document.getElementById("sumExtra").innerText = money(totals.extra);
  document.getElementById("sumDeductions").innerText = money(deductions);
  document.getElementById("sumNet").innerText = money(net);

  document.getElementById("tAccount").innerText = money(totals.account);
  document.getElementById("tExtra").innerText = money(totals.extra);
  document.getElementById("tNetwork").innerText = money(totals.network);
  document.getElementById("tFuel").innerText = money(totals.fuel);
  document.getElementById("tApartments").innerText = money(totals.apartments);
  document.getElementById("tExpense").innerText = money(totals.expense);
  document.getElementById("tNet").innerText = money(net);
}

function exportJSON(){

  saveData();

  const blob = new Blob(
    [JSON.stringify(data,null,2)],
    {type:"application/json"}
  );

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "backup-drivers-settlement.json";

  a.click();
}

document.getElementById("importFile")
.addEventListener("change", async (e)=>{

  const file = e.target.files[0];

  if(!file) return;

  data = JSON.parse(await file.text());

  render();
});

document.getElementById("businessName")
.addEventListener("input", saveData);

document.getElementById("settlementDate")
.addEventListener("change", saveData);

function escapeHtml(str){

  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[s]));
}

if("serviceWorker" in navigator){

  window.addEventListener("load",()=>{

    navigator.serviceWorker.register("service-worker.js");
  });
}

render();
