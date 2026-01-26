/* ====== بيانات الفروع - يرجى تعديل أرقام الواتساب والأسماء حسب الرغبة ====== */
const BRANCH_CONFIG = {
    'branch1': { 
        whatsapp: '966550541112', // ⭐️ رقم واتساب فرع الرياض (كمثال)
        name: 'الجوافة', // اسم الفرع في الرسائل وعنوان الصفحة
        deliveryFee: 5,
   
    },
    'branch3': {
        whatsapp: '966550541112', // ⚠️ يرجى تغيير رقم الواتساب لفرع مكة
        name: 'طريق الرديف ', 
        deliveryFee: 5,
    }
};

/* ====== متغير لتحديد الفرع الحالي من الرابط ====== */
let currentBranchId = 'branch1'; // القيمة الافتراضية
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('branch')) {
    currentBranchId = urlParams.get('branch');
}
const currentBranch = BRANCH_CONFIG[currentBranchId] || BRANCH_CONFIG['branch1'];
document.title = `قائمة  - فرع ${currentBranch.name}`; // تحديث عنوان الصفحة باسم الفرع
// ====== Admin Control (مخفي) ======
const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';

let adminPrices = JSON.parse(localStorage.getItem('admin_prices') || '{}');
let adminDisabled = JSON.parse(localStorage.getItem('admin_disabled') || '{}');
/* ====== بيانات المنيو - تم تحديث جميع مسارات الصور إلى صيغة WEBP وباسم قصير (مثال:sh01.webp) ====== */
const menuData = [
    // 1. القسم الجديد: الكل
    { 
       section:"الكل",
sectionImg: "logo-bg55.webp", // صورة عامة
items:[]
},
{
section:"الاطباق الرئيسية",
sectionImg: "sh00.webp", // صورة القسم
items:[
// الوجبة 1
{id:"sh1", img:"sh00.webp", name:"مكشن سليط كنعد بلدي", basePrice:38, availableIn: ['branch1','branch2', 'branch3'], options:[]},

// الوجبة 2: تم تغيير اسمها  
        {id:"sh2", img:"sh01.webp", name:"مكشن سليط جمبري", basePrice:43, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
          
          
        // الوجبة 2: تم تغيير اسمها  
        {id:"sh3", img:"sh00.webp", name:"مرسة بلدي", basePrice:13, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2: تم تغيير اسمها  
        {id:"sh4", img:"sh00.webp", name:"مرسة ملكي بلدي", basePrice:18, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2: تم تغيير اسمها  
        {id:"sh5", img:"sh60.webp", name:"سلطة يوناني", basePrice:10, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
              
        // الوجبة 2: تم تغيير اسمها  
        {id:"sh6", img:"sh00.webp", name:"سلطة خضراء", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 3: نص شواية سادة  
        {id:"sh7", img:"sh10.webp", name:"مكشن سليط ملوخية كنعد",  
         basePrice:34,  
         isBestSeller: false,  
         availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
             
        // الوجبة 4: العرض الاقتصادي الجديد  
        {  
            id:"sh8",   
            img:"sh20.webp",   
            name:"حايسيه",   
            basePrice:18,   
            isBestSeller: false,   
            availableIn: ['branch1', 'branch2', 'branch3'],   
            options:[]  
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                  
{   
    section:"الاسماك",   
    sectionImg: "md00.webp",  
    items:[  
        // الوجبة 1  
        {id:"md1", img:"md00.webp", name:"جمبري", basePrice:94, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md2", img:"md20.webp", name:"هامور", basePrice:85, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
              
        // الوجبة 2  
        {id:"md3", img:"md30.webp", name:"شعور", basePrice:80, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md4", img:"md40.webp", name:"قاروص", basePrice:75, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md5", img:"md50.webp", name:"دنياس", basePrice:80, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
     
        // الوجبة 2  
        {id:"md6", img:"md60.webp", name:"بياض", basePrice:70, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
            
        // الوجبة 2  
        {id:"md7", img:"md70.webp", name:"حريد", basePrice:70, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md8", img:"md80.webp", name:"كنعد بلدي", basePrice:110, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md9", img:"md90.webp", name:"سلمون", basePrice:110, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md11", img:"md10.webp", name:"فارس", basePrice:83, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md12", img:"md011.webp", name:"عربي", basePrice:83, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"md13", img:"md12.webp", name:"بلوط", basePrice:60, availableIn: ['branch1', 'branch2', 'branch3'], options:[]  
        
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                        
      
              
{   
    section:"مغشات سليط سمسم",   
    sectionImg: "mn00.webp",  
    items:[  
        // الوجبة 1  
        {id:"mn1", img:"mn00.webp", name:"مكشن بامية سليط", basePrice:13, availableIn: ['branch1','branch2', 'branch3'], options:[]},   
              
        // الوجبة 2  
        {id:"mn2", img:"mn00.webp", name:"مكشن ملوخية سليط", basePrice:13, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"mn3", img:"mn00.webp", name:"مكشن خضار سليط", basePrice:13, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"mn4", img:"mn00.webp", name:"مكشن قوار سليط", basePrice:13, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"mn5", img:"mn00.webp", name:"مكشن باطاطس سليط", basePrice:13, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"mn6", img:"mn00.webp", name:"مكشن حلبة خضار", basePrice:18, availableIn: ['branch1', 'branch2', 'branch3'], options:[]  
           
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                     
{   
    section:"الارز",   
    sectionImg: "mf01.webp",  
    items:[  
        // الوجبة 1  
        {id:"mdf1", img:"mf01.webp", name:"رز صياديه", basePrice:11.50, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 1  
        {id:"mdf2", img:"mf01.webp", name:"رز ابيض", basePrice:11.50, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
              
        // الوجبة 2  
        {id:"mdf3", img:"mf11.webp", name:"رز مكس", basePrice:11.50, availableIn: ['branch1', 'branch2', 'branch3'], options:[]  
            
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                    
{   
    section:"الصوصات",   
    sectionImg: "mq00.webp",  
    items:[  
        // الوجبة 1  
        {id:"mq1", img:"mq00.webp", name:"حمر", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
          
        {id:"mq2", img:"mq00.webp", name:"سحاوق جبن", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
        {id:"mq3", img:"mq00.webp", name:"زبادي مصلح", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
        {id:"mq4", img:"mq00.webp", name:"حلبة", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
        {id:"mq5", img:"mq00.webp", name:"دقة فلفل زبادي", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
        {id:"mq6", img:"mq00.webp", name:"طحينه", basePrice:5, availableIn: ['branch1', 'branch2', 'branch3'], options:[]  
      
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                  
{   
    section:"المشروبات",   
    sectionImg: "dr00.webp",  
    items:[  
        // الوجبة 1  
        {id:"bev-p", img:"dr00.webp", name:"ببسي", basePrice:3, availableIn: ['branch1', 'branch2', 'branch3'], options:[]},  
            
        // الوجبة 2  
        
        {id:"bev1-q", img:"dr05.webp", name:"عصير نجران", basePrice:3, availableIn: ['branch1', 'branch2', 'branch3'], options:[]  
      
  
                } // إغلاق الوجبة sh8  
    ] // <--- أضف هذا لإغلاق قائمة الوجبات (items) ✅  
}, // <--- أضف هذا لإغلاق القسم الأول بالكامل ✅  
                  
      
        {   
    section: "بوكسات الجمعات",   
    sectionImg: "small_box.webp",   
    sectionAvailableIn: ['branch1', 'branch2', 'branch3'],   
    items: [  
        {  
            id: "box_small",   
            img: "small_box.webp",   
            name: "بوكس صغير",   
            description:"يتكون من 5 أصناف سمك مقلي/ورز/مقبلات/ومرسه/وتنميت جمبري",   
            basePrice: 50,   
            isBestSeller: true,  
            availableIn: ['branch1', 'branch2', 'branch3'],   
            options: [{name: "عادي", price: 0}]  
        },  
        {  
            id: "box_medium",   
            img: "small_box.webp",   
            name: "بوكس وسط",   
            description:"يتكون من 8 أصناف  سمك مقلي/سمك/رز مكس/مقبلات/مرسه/مكش بطاطس/بطاطس مقلي/٣ماء",   
            basePrice: 80,   
            isBestSeller: true,  
            availableIn: ['branch1', 'branch2', 'branch3'],   
            options: [{name: "عادي", price: 0}]  
        },  
        {  
            id: "box_large",   
            img: "small_box.webp",   
            name: "بوكس كبير",   
            description: "يتكون من 10 أصناف سمك مقلي/سمك تنور/نص كيلو روبيان/ملكي/مكش خضار/بطاطس/مقبلات/رز مكس/حسيه ",   
            basePrice: 110,   
            isBestSeller: true,  
            availableIn: ['branch1', 'branch2', 'branch3'],   
            options: [{name: "عادي", price: 0}]  
        }  
    ]  
}

];
/* ====== دالة معالجة البيانات لتقديم "الأكثر مبيعاً" في بداية القائمة ====== */
function processMenuData(data) {
    let bestSellers = []; 
    let processedMenuData = []; 

    // 1. المرور على جميع الأقسام والوجبات واستخراج الأكثر مبيعاً
    data.forEach(section => {
        // نتخطى قسم "الكل" لأننا سنقوم بتجميعه لاحقاً
        if (section.section === "الكل") {
            processedMenuData.push(section); 
            return;
        }

        let regularItems = []; 
        
        section.items.forEach(item => {
            // نضيف خاصية actualSection لتذكر القسم الأصلي
            const itemWithSection = {...item, actualSection: item.actualSection || section.section}; 

            if (item.isBestSeller === true) {
                bestSellers.push(itemWithSection);
            } else {
                regularItems.push(itemWithSection);
            }
        });

        // 2. إنشاء نسخة من القسم الأصلي تحتوي فقط على الوجبات المتبقية
        // شرط: إذا كان القسم يحتوي على أي وجبات متبقية، أو كانت لديه خاصية توافر محددة
        if (regularItems.length > 0 || section.sectionAvailableIn) {
            let newSection = {...section, items: regularItems}; 
            processedMenuData.push(newSection);
        }
    });

    // 3. إنشاء قسم جديد خاص بالأكثر مبيعاً وإضافته في البداية
    if (bestSellers.length > 0) {
        let bestSellerSection = {
            section: "الأكثر مبيعاً 🏆", 
            sectionImg: "best_seller_icon.webp", 
            items: bestSellers,
            sectionAvailableIn: ['branch1', 'branch2', 'branch3'] 
        };
        // إضافة قسم الأكثر مبيعاً بعد قسم "الكل" مباشرة
        processedMenuData.splice(1, 0, bestSellerSection);
    }
    
    // 4. إرجاع مصفوفة البيانات الجديدة والمعالجة
    return processedMenuData;
}

// نستخدم الدالة الجديدة لمعالجة القائمة مرة واحدة
const processedMenuData = processMenuData(menuData); 

/* ====== Admin Save / Toggle ====== */
function savePrice(itemId) {
    const input = document.getElementById(`price-${itemId}`);
    if (!input) return;

    const newPrice = parseFloat(input.value);
    if (isNaN(newPrice)) return;

    adminPrices[itemId] = newPrice;
    localStorage.setItem('admin_prices', JSON.stringify(adminPrices));

    // 🔥 إعادة رسم القائمة لتحديث السعر فورًا
    renderMenu(currentSection);
}

function savePrice(itemId) {
    const input = document.getElementById(`price-${itemId}`);
    if (!input) return;

    const newPrice = parseFloat(input.value);
    if (isNaN(newPrice)) return;

    adminPrices[itemId] = newPrice;
    localStorage.setItem('admin_prices', JSON.stringify(adminPrices));

    renderMenu(currentSection);

    // 📱 حل مشكلة Safari / iPhone
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(() => {
            location.reload();
        }, 300);
    }
}
/* ====== متغيرات PWA و SearchBar ====== */
let deferredPrompt = null;
let currentSection = processedMenuData[0].section; // استخدام البيانات المعالجة لتحديد القسم الحالي
const installAppBtn = document.getElementById('installAppBtn');
const searchBar = document.getElementById('searchBar');


/* ====== سلة الطلبات والعناصر ====== */
let cart = JSON.parse(localStorage.getItem('deerty_cart') || '[]');
const sectionsEl = document.getElementById('sections');
const menuList = document.getElementById('menuList');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsEl = document.getElementById('cartItems');
const totalBreakdownEl = document.getElementById('totalBreakdown'); 
const sendWhatsapp = document.getElementById('sendWhatsapp');
const clearCart = document.getElementById('clearCart');

// 📍 عناصر تحديد الموقع (جديد)
const getLocationBtn = document.getElementById('getLocationBtn');
const locationStatus = document.getElementById('locationStatus');
let userLocation = null; // لتخزين إحداثيات الموقع (Lat, Lng)

/* Option modal */
const optionModal = document.getElementById('optionModal');
const modalTitle = document.getElementById('modalTitle');
const modalOptions = document.getElementById('modalOptions');
const modalConfirm = document.getElementById('modalConfirm');
const itemNoteInput = document.getElementById('itemNote'); 

let selectedItem = null;
let selectedOption = null;
let selectedItemImage = null; // 🚀 NEW: لتخزين مرجع صورة المنتج المختار (للتأثير)

/* ====== Render sections ====== */
function renderSections(){
    sectionsEl.innerHTML = '';
    processedMenuData.forEach((sec,idx)=>{
        // منطق إخفاء القسم بالكامل 
        if (sec.section !== "الكل" && sec.sectionAvailableIn && !sec.sectionAvailableIn.includes(currentBranchId)) {
            return; // يتم تخطي هذا القسم إذا لم يكن متوفراً في الفرع الحالي
        }

        // تحديد اسم العرض: "فرع الرياض" لقسم "الكل" فقط، واسم القسم للأقسام الأخرى
        const sectionDisplayName = sec.section === "الكل" ? `فرع ${currentBranch.name}` : sec.section;

        const card = document.createElement('div');
        card.className = 'sec-card';
        card.innerHTML = `
            <img src="${sec.sectionImg}" alt="${sec.section}" onerror="this.style.opacity=.35">
            <div class="sec-name">${sectionDisplayName}</div>
        `;

        if(sec.section === currentSection) card.classList.add('active'); 

        card.onclick=()=>{
            document.querySelectorAll('.sec-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentSection = sec.section;
            renderMenu(currentSection);
            searchBar.value = ''; 
        };
        sectionsEl.appendChild(card);
    });
    renderMenu(currentSection);
}


/* ====== Render menu - تطبيق الخصم الخاص بالفرع (واستخدام processedMenuData) ====== */
function renderMenu(sectionName, searchTerm = ''){
    menuList.innerHTML='';
    let itemsToRender = [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if(sectionName === "الكل") {
        itemsToRender = processedMenuData.flatMap(sec => 
            sec.section !== "الكل" ? 
            sec.items.map(item => ({...item, actualSection: item.actualSection || sec.section})) : 
            []
        );
    } else {
        // استخدام processedMenuData للعثور على القسم
        const sec = processedMenuData.find(s=>s.section===sectionName); 
        if(!sec) return;
        itemsToRender = sec.items;
    }

    // تصفية الوجبات حسب توافرها في الفرع الحالي
    const branchFilteredItems = itemsToRender.filter(item => {
        // تحقق مما إذا كانت الوجبة متوفرة في الفرع المحدد حالياً
        return item.availableIn && Array.isArray(item.availableIn) && item.availableIn.includes(currentBranchId);
    });

    const filteredItems = branchFilteredItems.filter(item => {
        return item.name.toLowerCase().includes(normalizedSearch);
    });

    if(filteredItems.length === 0 && normalizedSearch.length > 0) {
        menuList.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--light-text);">لا توجد نتائج بحث في قسم "${sectionName}" في فرع ${currentBranch.name}</p>`;
        return;
    }

    if (filteredItems.length === 0 && normalizedSearch.length === 0 && sectionName !== "الكل") {
        menuList.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--light-text);">لا تتوفر وجبات في قسم "${sectionName}" حالياً في فرع ${currentBranch.name}.</p>`;
        return;
    }

    filteredItems.forEach(item=>{
// ====== Admin overrides ======
if (adminPrices[item.id] !== undefined) {
    item.basePrice = adminPrices[item.id];
}

if (adminDisabled[item.id] === true) {
    item.isAvailable = false;
}

if (isAdmin && adminDisabled[item.id] === true) {
    item.isAvailable = false;
}
        const isAvailable = item.isAvailable !== false; 
        // تحديد السعر المخفض الخاص بالفرع الحالي
        const discountedPriceForBranch = item.branchDiscounts ? item.branchDiscounts[currentBranchId] : null;
        // تحديد ما إذا كان هناك خصم يطبق على هذا الفرع
        const hasDiscount = discountedPriceForBranch && discountedPriceForBranch < item.basePrice;
        const isBestSeller = item.isBestSeller === true; 

        let buttonText = "أضف للسلة";
        let buttonAttributes = ""; 
        let cardClassAddition = ""; 
        let bestSellerBadge = ''; 

        if (!isAvailable) {
            buttonText = "غير متوفر مؤقتاً ⛔";
            buttonAttributes = "disabled"; 
            cardClassAddition = " unavailable-card"; 
        } else if (hasDiscount) {
            cardClassAddition = " discount-card"; 
        }

        if (isBestSeller) {
            bestSellerBadge = '<span class="best-seller-badge">الأكثر مبيعاً 🏆</span>';
        }

        let priceDisplay;
        if (hasDiscount) {
            priceDisplay = `
                <span class="old-price">${item.basePrice} ريال</span> 
                <span class="discount-price">${discountedPriceForBranch} ريال</span>
            `;
        } else {
            priceDisplay = item.basePrice > 0 ? `${item.basePrice} ريال` : 
                (item.options.length > 0 && item.options[0].price > 0 ? `ابتداءً من ${item.options[0].price} ريال` : `${item.options[0].price} ريال`);
        }

        // نستخدم actualSection إذا كانت الوجبة في قسم "الأكثر مبيعاً" أو "الكل"، وإلا نستخدم اسم القسم الحالي
        const displayedSection = item.actualSection || sectionName; 

       
        const card = document.createElement('div');
card.className = 'card' + cardClassAddition;

card.innerHTML = `
    <img src="${item.img}" alt="${item.name}" onerror="this.style.opacity=.35">
    ${bestSellerBadge}
    <h3>${item.name}</h3>
    <p>${displayedSection}</p>

    ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}

    <div class="price">${priceDisplay}</div>

    ${isAdmin ? `
    <div class="admin-controls">
        <input type="number" min="0" step="0.5"
            id="price-${item.id}"
            value="${item.basePrice}">

        <button type="button"
onclick="event.stopPropagation(); savePrice(&quot;${item.id}&quot;)">💾</button>
        <button type="button"
onclick="event.stopPropagation(); toggleItem(&quot;${item.id}&quot;)">
            ${item.isAvailable === false ? '▶️ تفعيل' : '⛔ إيقاف'}
        </button>
    </div>
    ` : ''}

    <button class="add-btn" ${buttonAttributes}>
        ${buttonText}
    </button>
`;

        if (isAvailable) {
            card.querySelector('.add-btn').onclick = function() {
                const itemForCart = {...item};
                
                // 🚀 NEW: الحصول على مرجع الصورة لبطاقة المنتج الحالية
                const itemImage = card.querySelector('img'); 
                
                // تعيين السعر الأساسي للخصم إذا كان موجوداً لهذا الفرع
                if(hasDiscount){
                    itemForCart.basePrice = discountedPriceForBranch;
                }

                delete itemForCart.actualSection;
                const needsOptions = item.options.length > 1 || (item.options.length === 1 && item.options[0].name !== "");

                if(needsOptions){
                    showOptions(itemForCart, false, itemImage); // 🚀 MODIFIED: تمرير itemImage
                } else {
                    itemNoteInput.value = ''; 
                    showOptions(itemForCart, true, itemImage); // 🚀 MODIFIED: تمرير itemImage
                }
            };
        }
        menuList.appendChild(card);
    });
}


/* ====== Show options modal - لدعم الملاحظات ====== */
// 🚀 MODIFIED: إضافة itemImage للمُعاملات
function showOptions(item, skipOptions = false, itemImage = null){ 
    selectedItem = item;
    selectedOption = item.options.length > 0 ? item.options[0] : null; 
    selectedItemImage = itemImage; // 🚀 NEW LINE: قم بتخزين الصورة هنا

    modalTitle.innerText = item.name;
    itemNoteInput.value = ''; 

    if(skipOptions || item.options.length <= 1 && item.options[0].name === ""){
        modalOptions.style.display = 'none';
    } else {
        modalOptions.style.display = 'block';
        modalOptions.innerHTML='';
        item.options.forEach(opt=>{
            const b=document.createElement('button');
            b.className='opt-btn';
            if(opt === selectedOption) b.style.backgroundColor = '#a07c4c'; 
            b.innerText = opt.name + (opt.price>0?` +${opt.price} ريال`:'');
            b.onclick = ()=>{
                selectedOption=opt;
                document.querySelectorAll('#modalOptions .opt-btn').forEach(btn => btn.style.backgroundColor = 'var(--gold)');
                b.style.backgroundColor = '#a07c4c';
            };
            modalOptions.appendChild(b);
        });
    }
    optionModal.style.display='flex';
}


/* ====== Confirm modal ====== */
optionModal.addEventListener('click', (e) => {
    if (e.target.id === 'optionModal') {
        optionModal.style.display = 'none';
    }
});


modalConfirm.onclick = ()=>{
    if(selectedItem){
        const note = itemNoteInput.value.trim();
        const optionToSend = selectedOption || (selectedItem.options.length > 0 ? selectedItem.options[0] : null);

        addToCart({...selectedItem, qty:1, selectedOption:optionToSend, note: note || null}); 
        
        // 🚀 NEW: استدعاء تأثير الطيران بعد الإضافة
        if (selectedItemImage) {
            flyToCart(selectedItemImage);
        }

        const originalText = modalConfirm.innerText;
        modalConfirm.innerText = "تمت الإضافة! ✅";
        modalConfirm.style.backgroundColor = '#4CAF50';
        modalConfirm.disabled = true;

        setTimeout(() => {
            modalConfirm.innerText = originalText;
            modalConfirm.style.backgroundColor = 'var(--gold)'; 
            modalConfirm.disabled = false;
            optionModal.style.display='none';
        }, 1200);

    } else {
        optionModal.style.display='none';
    }
};


/* ====== Cart functions - تم تحديثها لحذف خصائص الفروع عند الإضافة للسلة ====== */
function saveCart(){ 
    localStorage.setItem('deerty_cart',JSON.stringify(cart)); 
    renderCart(); 
}


function flashCartButton() {
    cartBtn.classList.add('flash-cart-btn');
    setTimeout(() => {
        cartBtn.classList.remove('flash-cart-btn');
    }, 400); 
}


function addToCart(item){
    const obj={...item};
    delete obj.branchDiscounts; 
    delete obj.isBestSeller; 
    delete obj.availableIn; 

    const key = obj.id 
      + (obj.selectedOption?`-${obj.selectedOption.name}`:'') 
      + (obj.note ? `-${obj.note}` : '');

    const found = cart.find(i=>i.key===key);

    if(found){
        found.qty += 1;
    }else{
        cart.push({
            ...obj,
            key,
            qty: 1,
            time: Date.now() // ⭐ الإضافة هنا
        });
    }

    saveCart();
    flashCartButton();
}

/* ====== renderCart - عرض الإجمالي التفصيلي باستخدام رسوم الفرع الحالي ====== */
function renderCart(){
    cartItemsEl.innerHTML='';
    let subtotal = 0;
    let count = 0;
    const branchDeliveryFee = currentBranch.deliveryFee || 0;

    // ترتيب السلة
    if (Array.isArray(cart)) {
        cart.sort((a,b)=> (b.time || 0) - (a.time || 0));
    }

    cart.forEach((it,idx)=>{
        const price = (it.basePrice || 0) + (it.selectedOption ? it.selectedOption.price : 0);
        const row = document.createElement('div');
        row.className = 'cart-row';

        const noteHtml = it.note
            ? `<div class="item-note-display">📝 ملاحظة: ${it.note}</div>`
            : '';

        row.innerHTML = `
            <div style="flex-grow:1; min-width:60%">
                <div style="font-weight:800">
                    ${it.name}
                    ${it.selectedOption && !['نفر','طبق','عبوة'].includes(it.selectedOption.name)
                        ? ' — ' + it.selectedOption.name
                        : ''}
                </div>
                <div style="font-size:.9rem;color:rgba(255,255,255,.7)">
                    ${it.qty} × ${price} ريال
                </div>
                ${noteHtml}
            </div>
            <div class="controls">
                <button onclick="updateQty(${idx},-1)">-</button>
                <div style="min-width:26px;text-align:center">${it.qty}</div>
                <button onclick="updateQty(${idx},1)">+</button>
                <button onclick="removeItem(${idx})"
                    style="margin-left:6px;background:var(--red);color:#fff;padding:6px;border-radius:6px;border:none;cursor:pointer">
                    حذف
                </button>
            </div>
        `;

        cartItemsEl.appendChild(row);
        subtotal += price * it.qty;
        count += it.qty;
    });

    const deliveryTypeEl = document.querySelector('input[name="deliveryType"]:checked');
const deliveryType = deliveryTypeEl ? deliveryTypeEl.value : 'pickup';
const currentDeliveryFee = deliveryType === 'delivery' ? branchDeliveryFee : 0;
const finalTotal = subtotal + currentDeliveryFee;
    totalBreakdownEl.innerHTML = `
        <div class="total-line">
            <span>إجمالي المنتجات:</span>
            <span>${subtotal} ريال</span>
        </div>
        <div class="total-line">
            <span>رسوم التوصيل:</span>
            <span>${currentDeliveryFee} ريال</span>
        </div>
        <div class="total-line final-total-line">
            <span>الإجمالي النهائي:</span>
            <span id="cartTotalBottom">${finalTotal} ريال</span>
        </div>
    `;

    cartCount.innerText = count;
    cartCount.style.display = count === 0 ? 'none' : 'inline-block';
    localStorage.setItem('deerty_cart', JSON.stringify(cart));
}

/* ====== Cart Quantity Controls ====== */

// ➕ ➖ تعديل الكمية
function updateQty(index, change) {
    if (!cart[index]) return;

    cart[index].qty += change;

    // إذا وصلت الكمية 0 نحذف الصنف
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(); // يحفظ ويعيد رسم السلة
}

// 🗑 حذف عنصر كامل
function removeItem(index) {
    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart(); // يحفظ ويعيد رسم السلة
}
/* ====== Cart UI and WhatsApp - يستخدم رقم الواتساب الخاص بالفرع ====== */
const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('show');
    cartDrawer.setAttribute('aria-hidden','true');
    cartBtn.style.display = 'block'; 
};


cartBtn.addEventListener('click',()=>{
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('show');
    cartDrawer.setAttribute('aria-hidden','false');
    renderCart();
    cartBtn.style.display = 'none'; 
});


cartOverlay.addEventListener('click', closeCart);
closeCartBtn.addEventListener('click', closeCart);


sendWhatsapp.addEventListener('click', () => {
    if(cart.length===0){ alert('السلة فارغة'); return; }
    
    // 💡 التعديل الأول: قراءة العنوان اليدوي من حقل "manualAddress"
    const manualAddressNote = document.getElementById('manualAddress').value.trim(); 
    
    const branchDeliveryFee = currentBranch.deliveryFee || 0;
    const whatsappNumber = currentBranch.whatsapp;

    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
    // 📍 متغيرات رسائل الواتساب
    const lines=['طلب جديد من مطاعم :'];
    let subtotal = 0;

    cart.forEach(it=>{
        const price=(it.basePrice || 0)+(it.selectedOption?it.selectedOption.price:0);
        const optionText = it.selectedOption && it.selectedOption.name !== 'نفر' && it.selectedOption.name !== 'طبق' && it.selectedOption.name !== 'عبوة' ? ` — ${it.selectedOption.name}` : '';
        const noteText = it.note ? ` (ملاحظة: ${it.note})` : '';

        lines.push(`${it.qty} × ${it.name}${optionText} ${noteText} — ${price*it.qty} ريال`);
        subtotal+=price*it.qty;
    });

    lines.push('---');
    lines.push(`1. إجمالي المنتجات: ${subtotal} ريال`);

    if(deliveryType==='delivery'){ 
        lines.push(`2. نوع الطلب: توصيل (فرع ${currentBranch.name})`); 
        lines.push(`3. رسوم التوصيل: ${branchDeliveryFee} ريال`); 
        subtotal += branchDeliveryFee; // إضافة رسوم التوصيل للإجمالي
        
        // 📍 إضافة إحداثيات الموقع إذا كانت متوفرة (تم التعديل)
        if (userLocation) {
            lines.push(`4. إحداثيات موقع التوصيل:`);
            lines.push(`   * خط العرض (Lat): ${userLocation.lat}`);
            lines.push(`   * خط الطول (Lng): ${userLocation.lng}`);
            // (تم تصحيح رابط الخريطة إلى الصيغة الصحيحة)
            lines.push(`   * رابط الخريطة: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`); 
            lines.push(`⚠️ الموقع المحدد هو إحداثيات GPS ويجب على العميل تأكيد العنوان التفصيلي مع الموظف.`);
        } else {
             lines.push(`4. الموقع: لم يتم تحديد الموقع عبر الزر. يرجى تزويد الموظف بالعنوان كاملاً.`);
        }
        
    } else {
        lines.push(`2. نوع الطلب: استلام من الفرع (فرع ${currentBranch.name})`); 
    }
    
    // 💡 التعديل الثاني: إضافة العنوان اليدوي / ملاحظات التوصيل (التي تم قراءتها في البداية)
    if (manualAddressNote) {
        lines.push(`---`); 
        lines.push(`5. ملاحظات التوصيل / العنوان اليدوي: ${manualAddressNote}`);
    }

    lines.push('---');
    lines.push(`الإجمالي النهائي: ${subtotal} ريال`);
    // استخدام رقم الواتساب الخاص بالفرع
    const url=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url,'_blank');

    cart = [];
    saveCart(); 
    closeCart();
});


/* ====== منطق الإشعارات المنبثقة (Soft Prompt Notification) - جديد ومحسن ====== */
const notificationPrompt = document.getElementById('notificationPrompt');
const allowNotificationsBtn = document.getElementById('allowNotifications');
const denyNotificationsBtn = document.getElementById('denyNotifications');

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log("Notification permission granted.");
            // إشعار ترحيبي
            new Notification('أهلاً بك في الجنوب للاسماك!', {
                body: 'تم تفعيل الإشعارات بنجاح. سنعلمك بأحدث العروض!',
                icon: '/Dirty55/Icon-192.png' 
            });
        } else {
            console.log("Notification permission denied or ignored.");
        }
    });
}

function showNotificationPrompt() {
    // التحقق أولاً: هل المتصفح يدعم الإشعارات؟
    if (!('Notification' in window)) {
        return;
    }
    
    // التحقق ثانياً: هل تم سؤال المستخدم من قبل؟
    if (localStorage.getItem('notifications_asked')) {
        return;
    }

    // التحقق ثالثاً: هل الإذن ممنوح بالفعل؟
    if (Notification.permission === 'granted') {
        localStorage.setItem('notifications_asked', 'true'); // للتأكد
        return;
    }

    // إظهار النافذة المنبثقة المخصصة
    notificationPrompt.style.display = 'flex';
}

// 1. عند النقر على "نعم، أريد ذلك"
allowNotificationsBtn.addEventListener('click', () => {
    // 🚨 إخفاء النافذة المخصصة فورا قبل طلب إذن المتصفح لحل مشكلة زر الرجوع
    notificationPrompt.style.display = 'none'; 
    
    // وضع علامة في التخزين المحلي لمنع الظهور مرة أخرى
    localStorage.setItem('notifications_asked', 'true');
    
    // طلب الإذن الفعلي من النظام
    requestNotificationPermission();
});

// 2. عند النقر على "لا شكراً"
denyNotificationsBtn.addEventListener('click', () => {
    // إخفاء ووضع علامة في التخزين المحلي
    notificationPrompt.style.display = 'none';
    localStorage.setItem('notifications_asked', 'true');
});


// ====== منطق التشغيل الجديد: PWA فقط + تأخير 10 ثوانٍ ======
function initNotificationPrompt() {
    // تحديد ما إذا كان التطبيق يعمل في وضع PWA المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) {
        // إذا كان التطبيق مثبتاً: تأخير الظهور لمدة 10 ثوانٍ
        console.log("App is installed (Standalone mode). Delaying notification prompt for 10 seconds.");
        setTimeout(showNotificationPrompt, 10000); // 10000ms = 10 ثوانٍ
    }
    // إذا لم يكن مثبتاً (في المتصفح)، لن تظهر الرسالة.
}

// استدعاء دالة التهيئة عند تحميل الصفحة
window.addEventListener('load', initNotificationPrompt); 
/* ====== نهاية منطق الإشعارات المنبثقة ====== */


// 🚀 ------------------------------------------
// ✨ دالة تحديد الموقع (Geolocation) (جديد)
// ------------------------------------------
function onSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    userLocation = { lat: latitude, lng: longitude }; // تخزين الإحداثيات

    // إنشاء رابط لموقع جوجل ماب
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // تحديث حالة الموقع
    locationStatus.innerHTML = `
        ✅ تم تحديد الموقع بنجاح! 
        <br>
        <a href="${mapLink}" target="_blank" style="color: var(--gold); text-decoration: underline; font-weight: bold;">عرض على الخريطة</a>
    `;
    locationStatus.style.color = '#4CAF50';
    getLocationBtn.disabled = false;
    getLocationBtn.innerText = '📍 تحديث الموقع';
}

function onError(error) {
    let message = 'حدث خطأ أثناء تحديد الموقع.';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = '🚫 رفض المستخدم طلب تحديد الموقع.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = '❌ معلومات الموقع غير متوفرة حالياً.';
            break;
        case error.TIMEOUT:
            message = '⏳ انتهت مهلة طلب تحديد الموقع.';
            break;
        case error.UNKNOWN_ERROR:
            message = '🚨 خطأ غير معروف.';
            break;
    }
    
    locationStatus.innerText = message;
    locationStatus.style.color = 'var(--red)';
    getLocationBtn.disabled = false;
    getLocationBtn.innerText = '📍 تحديد موقع التوصيل الحالي (حاول مجدداً)';
    userLocation = null; // مسح الموقع السابق في حالة الخطأ
}

function getMyLocation() {
    locationStatus.innerText = 'جاري البحث عن موقعك... 📡';
    locationStatus.style.color = '#aaa';
    getLocationBtn.disabled = true;

    if (!navigator.geolocation) {
        locationStatus.innerText = '❌ المتصفح لا يدعم تحديد الموقع الجغرافي.';
        locationStatus.style.color = 'var(--red)';
        getLocationBtn.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        onSuccess, 
        onError,
        { 
            enableHighAccuracy: true, // طلب دقة أعلى
            timeout: 10000,          // مهلة 10 ثواني 
            maximumAge: 0            // لا تستخدم بيانات مخزنة مؤقتاً
        } 
    );
}

// 📍 ربط زر تحديد الموقع بالدالة (جديد)
getLocationBtn.addEventListener('click', getMyLocation);
// ------------------------------------------


/* ====== PWA Install Logic / Search Logic / Init ====== */
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installAppBtn.style.display = 'block';
});


installAppBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        installAppBtn.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
    }
});


searchBar.addEventListener('input', (e) => {
    renderMenu(currentSection, e.target.value);
});


// ====== إضافة منطق الـ Sticky Header (التثبيت مع الظل) باستخدام منطقك المفضل ======
const stickyHeaderHeight = 80; 
window.addEventListener('scroll', () => {
    const sectionsTop = sectionsEl.getBoundingClientRect().top; // نستخدم sectionsEl
    
    // إذا كان العنصر في موضع التثبيت (أو تجاوزه)
    if (sectionsTop <= stickyHeaderHeight) {
        sectionsEl.classList.add('sections-sticky');
    } else {
        sectionsEl.classList.remove('sections-sticky');
    }
});


renderSections(); 
renderCart();


// تسجيل العامل الخدمي (Service Worker) الخفيف لضمان التحديث الفوري
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // تم التأكد من المسار إلى /Dirty55/
        navigator.serviceWorker.register('service-worker.js') .then(reg => {
            console.log('Service Worker Registered!', reg.scope);
        })
        .catch(err => {
            console.error('Service Worker Registration failed:', err);
        });
    });
}


// 🚀 ------------------------------------------
// ✨ دالة تأثير سقوط الصورة إلى السلة (Fly-to-Cart)
// ------------------------------------------
function flyToCart(imgElement) {
    // 1. استنساخ الصورة
    const flyingImg = imgElement.cloneNode(true);
    flyingImg.className = "flying-img"; // تطبيق الأنماط
    document.body.appendChild(flyingImg);

    // 2. تحديد موقع الصورة الأصلية
    const rect = imgElement.getBoundingClientRect();
    flyingImg.style.top = rect.top + "px";
    flyingImg.style.left = rect.left + "px";

    // 3. تحديد موقع زر السلة
    const cartRect = document.getElementById("cartBtn").getBoundingClientRect();

    // 4. بدء الحركة
    setTimeout(() => {
        // تحريك الصورة إلى زر السلة وتصغيرها
        flyingImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`;
        flyingImg.style.opacity = "0";
    }, 10);

    // 5. إزالة الصورة بعد انتهاء الحركة
    setTimeout(() => {
        flyingImg.remove();
    }, 800);
}
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'clearCart') {

        if (!confirm('هل أنت متأكد من مسح السلة بالكامل؟')) return;

        cart = [];
        localStorage.removeItem('deerty_cart');
        renderCart();
        closeCart(); // اختياري
    }
});
// 🔥 FIX iOS Cache (مهم للآيفون)
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(reg => reg.unregister());
        });
    }
}
// ------------------------------------------
