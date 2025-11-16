// ** الثوابت والروابط (يجب استبدال الروابط) **
const CLIENTS_API_URL = 'https://your-low-code-platform.com/api/clients';
const TRANSACTION_API_BASE_URL = 'https://your-low-code-platform.com/api/transactions';

// تعريف عناصر DOM الرئيسية
const clientsListContainer = document.querySelector('#clients-table tbody');
const addDebtBtn = document.getElementById('add-debt-btn');
const recordPaymentBtn = document.getElementById('record-payment-btn');
const appModal = document.getElementById('app-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');


// ** دالة العرض الرئيسية (READ) - مُحدثة بزر الحذف **
async function displayClients() {
    try {
        const response = await fetch(CLIENTS_API_URL);
        const clients = await response.json(); 

        clientsListContainer.innerHTML = ''; 
        let totalBalance = 0;

        clients.forEach(client => {
            totalBalance += client.remaining_balance;
            
            // بناء سطر HTML مع زر الحذف وربطه بالـ client.id
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
        console.error('حدث خطأ في جلب البيانات:', error);
        // عرض رسالة خطأ للمستخدم
        clientsListContainer.innerHTML = '<tr><td colspan="4">تعذر تحميل بيانات العملاء.</td></tr>';
    }
}


// ** دالة الحذف (DELETE) **
async function deleteClientRecord(clientId) {
    // بناء رابط الحذف بالمعرّف
    const DELETE_CLIENT_API_URL = `${CLIENTS_API_URL}/${clientId}`; 

    try {
        const response = await fetch(DELETE_CLIENT_API_URL, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert(`تم حذف العميل رقم ${clientId} وجميع سجلات معاملاته بنجاح! 🗑️`);
            displayClients(); 
        } else {
            alert('فشل في عملية حذف العميل!');
        }
    } catch (error) {
        console.error('خطأ في إرسال طلب الحذف:', error);
    }
}


// ** وظائف الإرسال (CREATE & UPDATE) - غير معدلة **
async function saveDebtRecord(record) { /* ... (كود إرسال الدين هنا) ... */ }
async function recordPaymentTransaction(record) { /* ... (كود إرسال الدفعة هنا) ... */ }
function handleDebtSubmission(event) { /* ... (كود معالجة إرسال الدين هنا) ... */ }
function handlePaymentSubmission(event) { /* ... (كود معالجة إرسال الدفعة هنا) ... */ }
function populateClientsSelect(selectElementId) { /* ... (كود ملء القائمة المنسدلة هنا) ... */ }
function showDebtForm() { /* ... (كود عرض نموذج الدين هنا) ... */ }
function showPaymentForm() { /* ... (كود عرض نموذج الدفعة هنا) ... */ }


// ** التهيئة والـ Event Listeners - مُحدثة بمستمع الحذف **
function initApp() {
    displayClients(); 

    // ربط أزرار النقر
    addDebtBtn.addEventListener('click', showDebtForm);
    recordPaymentBtn.addEventListener('click', showPaymentForm);

    // إغلاق النافذة المنبثقة
    closeBtn.addEventListener('click', () => { appModal.style.display = 'none'; modalBody.innerHTML = ''; });
    window.onclick = (event) => { if (event.target == appModal) { appModal.style.display = 'none'; modalBody.innerHTML = ''; } };

    // ** مستمع تفويض الأحداث لحذف العميل (الجديد) **
    clientsListContainer.addEventListener('click', (event) => {
        const target = event.target;
        
        // التحقق من أن النقر كان على زر الحذف
        if (target.classList.contains('delete-btn')) {
            const clientIdToDelete = target.getAttribute('data-client-id');
            
            if (confirm(`هل أنت متأكد من حذف العميل رقم ${clientIdToDelete}؟ سيتم حذف جميع سجلات معاملاته.`)) {
                deleteClientRecord(clientIdToDelete); 
            }
        }
    });

}

// تشغيل التطبيق
initApp();


// ** وظيفة تسجيل الـ Service Worker لـ PWA **
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => { console.log('ServiceWorker registered:', registration.scope); })
            .catch(error => { console.log('ServiceWorker registration failed:', error); });
    });
}
