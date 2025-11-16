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
    // ... (تستخدم بيانات وهمية كاحتياطي) ...
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
        clientsListContainer.innerHTML = '<tr><td colspan="4">تعذر تحميل بيانات العملاء. يرجى التأكد من رابط API.</td></tr>';
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


// ** دالة إرسال الدين الجديد (CREATE - POST) **
async function saveDebtRecord(record) {
    const api_url = DEBT_TRANSACTION_API_URL;
    try {
        const response = await fetch(api_url, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record) 
        });
        if (response.ok) {
            alert('تم إضافة الدين الجديد بنجاح! 🎉');
            appModal.style.display = 'none';
            displayClients();
        } else {
            alert('فشل في حفظ سجل الدين. تأكد من إعدادات API.');
        }
    } catch (error) {
        console.error('خطأ في إرسال طلب الدين:', error);
        alert('حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    }
}


// ** دالة تسجيل الدفعة (CREATE - POST) - مُحدَّثة للاتصال بـ API **
async function recordPaymentTransaction(record) {
    const api_url = PAYMENT_TRANSACTION_API_URL;

    try {
        const response = await fetch(api_url, {
            method: 'POST', // تستخدم POST لإضافة سجل دفعة جديد
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record) // بيانات الدفعة
        });

        if (response.ok) {
            alert('تم تسجيل الدفعة بنجاح! 🟢');
            appModal.style.display = 'none';
            displayClients();
        } else {
            alert('فشل في تسجيل الدفعة. تأكد من إعدادات API.');
        }
    } catch (error) {
        console.error('خطأ في إرسال طلب الدفعة:', error);
        alert('حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    }
}


// ** دالة الحذف (DELETE) **
async function deleteClientRecord(clientId) {
    const DELETE_CLIENT_API_URL = `${CLIENTS_API_URL}/${clientId}`; 
    try {
        const response = await fetch(DELETE_CLIENT_API_URL, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`تم حذف العميل رقم ${clientId} بنجاح! 🗑️`);
            displayClients(); 
        } else {
            alert('فشل في عملية حذف العميل!');
        }
    } catch (error) {
        console.error('خطأ في إرسال طلب الحذف:', error);
    }
}


// ** الدوال المتبقية (معالجات النماذج وعرضها) **
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
    addDebtBtn.addEventListener('click', showDebtForm);
    recordPaymentBtn.addEventListener('click', showPaymentForm);
    closeBtn.addEventListener('click', () => { appModal.style.display = 'none'; modalBody.innerHTML = ''; });
    window.onclick = (event) => { if (event.target == appModal) { appModal.style.display = 'none'; modalBody.innerHTML = ''; } };
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

// تشغيل التطبيق بعد تحميل DOM 
window.addEventListener('DOMContentLoaded', initApp);


// ** وظيفة تسجيل الـ Service Worker لـ PWA **
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => { console.log('ServiceWorker registered:', registration.scope); })
            .catch(error => { console.log('ServiceWorker registration failed:', error); });
    });
}
