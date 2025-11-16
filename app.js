// روابط وهمية – غيّرها بروابط API الحقيقية
const CLIENTS_API_URL = 'https://your-low-code-platform.com/api/clients';
const DEBT_TRANSACTION_API_URL = 'https://your-low-code-platform.com/api/transactions/debt';
const PAYMENT_TRANSACTION_API_URL = 'https://your-low-code-platform.com/api/transactions/payment';

const clientsListContainer = document.querySelector('#clients-table tbody');
const addDebtBtn = document.getElementById('add-debt-btn');
const recordPaymentBtn = document.getElementById('record-payment-btn');
const appModal = document.getElementById('app-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

// بيانات مؤقتة
const MOCK_CLIENTS = [
    { id: '1', name: 'خالد العتيبي' },
    { id: '2', name: 'سارة محمد' },
    { id: '3', name: 'أحمد علي' }
];

async function displayClients() {

    const mockData = [
        { id: '1', name: 'خالد العتيبي', remaining_balance: 550.00, days_since_last_payment: 15 },
        { id: '2', name: 'سارة محمد', remaining_balance: 120.50, days_since_last_payment: 5 },
    ];

    let clients = mockData;

    try {
        const res = await fetch(CLIENTS_API_URL);
        if (res.ok) clients = await res.json();
    } catch (e) {
        console.warn("تعذر تحميل API");
    }

    clientsListContainer.innerHTML = "";
    let total = 0;

    clients.forEach(client => {
        total += client.remaining_balance;

        clientsListContainer.innerHTML += `
            <tr>
                <td>${client.name}</td>
                <td>${client.remaining_balance.toFixed(2)}</td>
                <td>${client.days_since_last_payment} يوم</td>
                <td>
                    <button class="share-btn">مشاركة 📤</button>
                    <button class="delete-btn" data-client-id="${client.id}">حذف 🗑️</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('total-balance').textContent = total.toFixed(2);
}

function populateClientsSelect(id) {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">-- اختر --</option>';
    MOCK_CLIENTS.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

// حفظ دين
async function saveDebtRecord(rec) {
    try {
        const res = await fetch(DEBT_TRANSACTION_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rec)
        });

        if (res.ok) {
            alert("تم إضافة الدين بنجاح");
            appModal.style.display = "none";
            displayClients();
        }
    } catch (err) {
        alert("خطأ في الاتصال بالخادم");
    }
}

// تسجيل دفعة
async function recordPaymentTransaction(rec) {
    try {
        const res = await fetch(PAYMENT_TRANSACTION_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rec)
        });

        if (res.ok) {
            alert("تم تسجيل الدفعة");
            appModal.style.display = "none";
            displayClients();
        }
    } catch (err) {
        alert("خطأ في الاتصال بالخادم");
    }
}

// حذف عميل
async function deleteClientRecord(id) {
    try {
        const res = await fetch(`${CLIENTS_API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("تم الحذف");
            displayClients();
        }
    } catch (e) {
        alert("تعذر الحذف");
    }
}

// الفورم
function showDebtForm() {
    modalBody.innerHTML = `
        <form id="debt-form">
            <h2>إضافة دين جديد</h2>

            <label>اختر العميل</label>
            <select id="client-select"></select>

            <label>المبلغ</label>
            <input type="number" id="amount-input" step="0.01" required>

            <label>الوصف</label>
            <input type="text" id="item-name-input" required>

            <label>التاريخ</label>
            <input type="date" id="date-input" value="${new Date().toISOString().slice(0,10)}">

            <button class="primary-btn">حفظ</button>
        </form>
    `;

    populateClientsSelect("client-select");
    appModal.style.display = "flex";

    document.getElementById("debt-form").onsubmit = e => {
        e.preventDefault();
        saveDebtRecord({
            client_id: document.getElementById("client-select").value,
            amount: parseFloat(document.getElementById("amount-input").value),
            description: document.getElementById("item-name-input").value,
            date: document.getElementById("date-input").value
        });
    };
}

function showPaymentForm() {
    modalBody.innerHTML = `
        <form id="payment-form">
            <h2>تسجيل دفعة</h2>

            <label>اختر العميل</label>
            <select id="payment-client-select"></select>

            <label>المبلغ</label>
            <input type="number" id="payment-amount-input" step="0.01" required>

            <label>التاريخ</label>
            <input type="date" id="payment-date-input" value="${new Date().toISOString().slice(0,10)}">

            <button class="secondary-btn">تسجيل</button>
        </form>
    `;

    populateClientsSelect("payment-client-select");
    appModal.style.display = "flex";

    document.getElementById("payment-form").onsubmit = e => {
        e.preventDefault();
        recordPaymentTransaction({
            client_id: document.getElementById("payment-client-select").value,
            amount: parseFloat(document.getElementById("payment-amount-input").value),
            date: document.getElementById("payment-date-input").value
        });
    };
}

// تشغيل
function initApp() {
    displayClients();

    addDebtBtn.onclick = showDebtForm;
    recordPaymentBtn.onclick = showPaymentForm;

    closeBtn.onclick = () => appModal.style.display = "none";
    window.onclick = e => { if (e.target === appModal) appModal.style.display = "none"; };

    clientsListContainer.onclick = e => {
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.dataset.clientId;
            if (confirm("حذف العميل؟")) deleteClientRecord(id);
        }
    };
}

document.addEventListener("DOMContentLoaded", initApp);

// تسجيل Service Worker (مهم جداً)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("SW Registered"))
            .catch(err => console.log("SW Failed", err));
    });
}
