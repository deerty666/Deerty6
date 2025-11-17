// ثابت لجلب العملاء — استبدله إذا لديك API فعلي
const CLIENTS_API_URL = "";
const MOCK_CLIENTS = [
    { id: '1', name: 'خالد العتيبي', remaining_balance: 550, days_since_last_payment: 15 },
    { id: '2', name: 'سارة محمد', remaining_balance: 120.50, days_since_last_payment: 5 }
];

const clientsListContainer = document.querySelector('#clients-table tbody');
const addDebtBtn = document.getElementById('add-debt-btn');
const recordPaymentBtn = document.getElementById('record-payment-btn');
const appModal = document.getElementById('app-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

function displayClients() {
    clientsListContainer.innerHTML = "";
    let total = 0;

    MOCK_CLIENTS.forEach(client => {
        total += client.remaining_balance;

        clientsListContainer.innerHTML += `
            <tr>
                <td>${client.name}</td>
                <td>${client.remaining_balance.toFixed(2)}</td>
                <td>${client.days_since_last_payment} يوم</td>
                <td>
                    <button class="delete-btn" data-id="${client.id}">حذف</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("total-balance").textContent = total.toFixed(2);
}

function showDebtForm() {
    modalBody.innerHTML = `
        <form id="debt-form">
            <label>اسم العميل</label>
            <input type="text" id="cname" required>

            <label>المبلغ</label>
            <input type="number" id="camount" required>

            <button class="primary-btn" type="submit">حفظ</button>
        </form>
    `;

    appModal.style.display = "flex";

    document.getElementById("debt-form").onsubmit = (e) => {
        e.preventDefault();
        alert("تمت الإضافة (نسخة تجريبية)");
        appModal.style.display = "none";
    };
}

function showPaymentForm() {
    modalBody.innerHTML = `
        <form id="pay-form">
            <label>اسم العميل</label>
            <input type="text" id="cname2" required>

            <label>المبلغ المدفوع</label>
            <input type="number" id="pamount" required>

            <button class="secondary-btn" type="submit">تسجيل الدفع</button>
        </form>
    `;

    appModal.style.display = "flex";

    document.getElementById("pay-form").onsubmit = (e) => {
        e.preventDefault();
        alert("تم تسجيل الدفعة ✔");
        appModal.style.display = "none";
    };
}

closeBtn.onclick = () => appModal.style.display = "none";

addDebtBtn.onclick = showDebtForm;
recordPaymentBtn.onclick = showPaymentForm;

displayClients();

// تسجيل الـ Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
        .then(() => console.log("SW Registered"))
        .catch(err => console.log("SW Error:", err));
}
