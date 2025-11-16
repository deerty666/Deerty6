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


// ** دالة العرض الرئيسية (READ) - (لن تتسبب في خطأ الآن بفضل try/catch) **
async function displayClients() {
    try {
        const response = await fetch(CLIENTS_API_URL);
        const clients = await response.json(); 

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
                        <button class="share-btn">مشاركة الكشف 📤</button>
                        <button class="delete-btn" data-client-id="${client.id}">حذف 🗑️</button>
                    </td>
                </tr>
            `;
            clientsListContainer.innerHTML += rowHTML;
        });

        document.getElementById('total-balance').textContent = totalBalance.toFixed(2);

    } catch (error) {
        clientsListContainer.innerHTML = '<tr><td colspan="4">تعذر تحميل بيانات العملاء. يرجى التأكد من رابط API.</td></tr>';
    }
}


// ** دالة الحذف (DELETE) ووظائف الإرسال الأخرى (غير معدلة في هذا التعديل) **
async function deleteClientRecord(clientId) { /* ... كود الحذف ... */ }
// ... (بقية الدوال: saveDebtRecord, recordPaymentTransaction, handleDebtSubmission, إلخ) ...


// ** التهيئة والـ Event Listeners **
function initApp() {
    // 1. استدعاء دالة عرض العملاء
    displayClients(); 

    // 2. ربط أزرار النقر الرئيسية (هذا الجزء سيعمل الآن!)
    addDebtBtn.addEventListener('click', showDebtForm);
    recordPaymentBtn.addEventListener('click', showPaymentForm);

    // 3. مستمع الإغلاق للنافذة المنبثقة
    closeBtn.addEventListener('click', () => { appModal.style.display = 'none'; modalBody.innerHTML = ''; });
    window.onclick = (event) => { if (event.target == appModal) { appModal.style.display = 'none'; modalBody.innerHTML = ''; } };

    // 4. مستمع تفويض الأحداث لحذف العميل
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
