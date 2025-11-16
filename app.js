// ** الثوابت والروابط: يجب استبدال هذه الروابط بروابطك الفعلية! **
const CLIENTS_API_URL = 'https://your-low-code-platform.com/api/clients';
const DEBT_TRANSACTION_API_URL = 'https://your-low-code-platform.com/api/transactions/debt';
const PAYMENT_TRANSACTION_API_URL = 'https://your-low-code-platform.com/api/transactions/payment';

// تعريف عناصر DOM الرئيسية
const clientsListContainer = document.querySelector('#clients-table tbody');
const addDebtBtn = document.getElementById('add-debt-btn');
const recordPaymentBtn = document.getElementById('record-payment-btn');
const appModal = document.getElementById('app-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

// بيانات عملاء وهمية لملء القائمة المنسدلة مؤقتاً
const MOCK_CLIENTS = [
    { id: '1', name: 'خالد العتيبي' },
    { id: '2', name: 'سارة محمد' },
    { id: '3', name: 'أحمد علي' }
];

// ** دالة العرض الرئيسية (READ) **
async function displayClients() {
    // استخدم البيانات الوهمية إذا لم يتم توفير رابط API فعال
    const mockClientsData = [
        { id: '1', name: 'خالد العتيبي', remaining_balance: 550.00, days_since_last_payment: 15 },
        { id: '2', name: 'سارة محمد', remaining_balance: 120.50, days_since_last_payment: 5 },
    ];
    let clients = mockClientsData;
    
    try {
        const response = await fetch(CLIENTS_API_URL);
        if (response.ok) {
            clients = await response.json(); 
        }
    } catch (error) {
        console.warn('استخدام بيانات وهمية لعدم توفر API:', error);
    }
    
    clientsListContainer.innerHTML = ''; 
    let totalBalance = 0;

    clients.forEach(client => {
        totalBalance += client.remaining_balance;
        const rowHTML = `
            <tr>
                <td>${client.name}</td>
                <td>${client.remaining_balance.toFixed(2)}</td>
                <td>${client.days_since_last_payment} يوماً</td>
                <td>
                    <button class="share-btn">مشاركة 📤</button>
                    <button class="delete-btn" data-client-id="${client.id}">حذف 🗑️</button>
                </td>
            </tr>
        `;
        clientsListContainer.innerHTML += rowHTML;
    });

    document.getElementById('total-balance').textContent = totalBalance.toFixed(2);
}


// ** دالة ملء القائمة المنسدلة (MUST BE DEFINED) **
function populateClientsSelect(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    select.innerHTML = '<option value="">-- اختر من القائمة --</option>';
    
    MOCK_CLIENTS.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
    });
}


// ** وظائف الإرسال والتعامل مع API (MUST BE DEFINED) **
async function saveDebtRecord(record) {
    console.log('محاولة إرسال دين جديد:', record);
    alert('تم محاكاة حفظ الدين! (استبدل هذه الدالة باتصال API حقيقي)');
    appModal.style.display = 'none';
    displayClients();
}

async function recordPaymentTransaction(record) {
    console.log('محاولة إرسال دفعة:', record);
    alert('تم محاكاة تسجيل الدفعة! (استبدل هذه الدالة باتصال API حقيقي)');
    appModal.style.display = 'none';
    displayClients();
}

async function deleteClientRecord(clientId) {
    console.log('محاولة حذف العميل:', clientId);
    alert('تم محاكاة حذف العميل! (استبدل هذه الدالة باتصال DELETE API حقيقي)');
    displayClients();
}

// ** معالجات النماذج (MUST BE DEFINED) **
function handleDebtSubmission(event) {
    event.preventDefault(); 
    const client = document.getElementById('client-select').value;
    const amount = parseFloat(document.getElementById('amount-input').value); 
    const item = document.getElementById('item-name-input').value;
    const date = document.getElementById('date-input').value;
    saveDebtRecord({ client_id: client, amount: amount, description: item, date: date });
}

function handlePaymentSubmission(event) {
    event.preventDefault(); 
    const clientId = document.getElementById('payment-client-select').value;
    const paidAmount = parseFloat(document.getElementById('payment-amount-input').value); 
    const paymentDate = document.getElementById('payment-date-input').value;
    recordPaymentTransaction({ client_id: clientId, amount: paidAmount, date: paymentDate });
}

// ** دوال عرض النماذج (MUST BE DEFINED) **
function showDebtForm() {
    modalBody.innerHTML = `
        <form id="debt-form" class="modal-form">
            <h2>إضافة دين جديد ➕</h2>
            <label for="client-select">اختر العميل:</label>
            <select id="client-select" required></select>
            <label for="amount-input">المبلغ 💵:</label>
            <input type="number" id="amount-input" step="0.01" required min="0"> 
            <label for="item-name-input">الوصف 🏷️:</label>
            <input type="text" id="item-name-input" required maxlength="100"> 
            <label for="date-input">التاريخ 🗓️:</label>
            <input type="date" id="date-input" required value="${new Date().toISOString().slice(0, 10)}"> 
            <button type="submit" class="primary-btn submit-btn">حفظ الدين الجديد</button>
        </form>`;
    populateClientsSelect('client-select');
    appModal.style.display = 'block';
    document.getElementById('debt-form').addEventListener('submit', handleDebtSubmission);
}

function showPaymentForm() {
    modalBody.innerHTML = `
        <form id="payment-form" class="modal-form">
            <h2>تسجيل دفعة 💰</h2>
            <label for="payment-client-select">اختر العميل:</label>
            <select id="payment-client-select" required></select>
            <label for="payment-amount-input">المبلغ المدفوع 💵:</label>
            <input type="number" id="payment-amount-input" step="0.01" required min="0"> 
            <label for="payment-date-input">التاريخ 🗓️:</label>
            <input type="date" id="payment-date-input" required value="${new Date().toISOString().slice(0, 10)}"> 
            <button type="submit" class="secondary-btn submit-btn">تسجيل الدفعة 💰</button>
        </form>`;
    populateClientsSelect('payment-client-select');
    appModal.style.display = 'block';
    document.getElementById('payment-form').addEventListener('submit', handlePaymentSubmission);
}


// ** التهيئة والـ Event Listeners **
function initApp() {
    displayClients(); 

    // ربط الأزرار (يجب أن تعمل الآن)
    addDebtBtn.addEventListener('click', showDebtForm);
    recordPaymentBtn.addEventListener('click', showPaymentForm);

    // مستمع إغلاق النافذة المنبثقة 
    closeBtn.addEventListener('click', () => { appModal.style.display = 'none'; modalBody.innerHTML = ''; });
    window.onclick = (event) => { if (event.target == appModal) { appModal.style.display = 'none'; modalBody.innerHTML = ''; } };

    // مستمع تفويض الأحداث لحذف العميل 
    clientsListContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('delete-btn')) {
            const clientIdToDelete = target.getAttribute('data-client-id');
            if (confirm(`هل أنت متأكد من حذف العميل رقم ${clientIdToDelete}؟`)) {
                deleteClientRecord(clientIdToDelete); 
            }
        }
    });

}

// ** 🚩 التعديل الحاسم: تشغيل التطبيق بعد تحميل DOM 🚩 **
window.addEventListener('DOMContentLoaded', initApp);


// ** وظيفة تسجيل الـ Service Worker لـ PWA **
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => { console.log('ServiceWorker registered:', registration.scope); })
            .catch(error => { console.log('ServiceWorker registration failed:', error); });
    });
}
