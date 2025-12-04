// ==================================
// config.js
// ==================================

export const BRANCH_CONFIG = {
    'branch1': { 
        whatsapp: '966536803598',
        name: 'لبن الاحمديه',
        deliveryFee: 5,
    }
};
export const currentBranchId = 'branch1';
export const currentBranch = BRANCH_CONFIG[currentBranchId];

export const menuData = [
    { section:"الكل", sectionImg: "logo-bg.webp", items:[] },
    { section:"الشوايه", sectionImg: "sh00.webp", items:[
        {id:"sh1", img:"sh00.webp", name:"حبة شواية", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"sh2", img:"sh00.webp", name:"نص شواية بالرز", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]},
        {id:"sh3", img:"sh10.webp", name:"ربع دجاج", basePrice:13, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"شوايه", price:0},{name:"مندي", price:0}
        ]},
        {id:"sh4", img:"sh20.webp", name:"نصف دجاج (ساده)", basePrice:15, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"شوايه", price:0},{name:"مظبي", price:0},{name:"مندي", price:0}
        ]}
    ]},
    { section:"المظبي", sectionImg: "md00.webp", items:[
        {id:"md1", img:"md00.webp", name:"حبة مظبي", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"md2", img:"md00.webp", name:"نص مظبي", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]}
    ]},
    { section:"مندي", sectionImg: "mn00.webp", items:[
        {id:"mn1", img:"mn00.webp", name:"حبة مندي", basePrice:46, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:4},{name:"رز مندي", price:4},{name:"رز مثلوثه", price:4}
        ]},
        {id:"mn2", img:"mn00.webp", name:"نص مندي", basePrice:24, availableIn:['branch1'], options:[
            {name:"رز شعبي", price:0},{name:"رز بشاور", price:1},{name:"رز مندي", price:1},{name:"رز مثلوثه", price:1}
        ]}
    ]},
    { section:"الأطباق الجانبية", sectionImg:"si00.webp", items:[
        {id:"side0", img:"si08.webp", name:"شوربة", basePrice:8, isBestSeller:true, availableIn:['branch1'], options:[{name:"صحن", price:0}]},
        {id:"side1", img:"si01.webp", name:"جريش", basePrice:0, isBestSeller:true, availableIn:['branch1'], options:[
            {name:"صغير", price:5},{name:"كبير", price:10}
        ]}
    ]},
    { section:"المشروبات", sectionImg:"dr00.webp", items:[
        {id:"bev-p", img:"dr01.webp", name:"ببسي", basePrice:0, availableIn:['branch1'], options:[
            {name:"صغير", price:3},{name:"وسط", price:6},{name:"كبير", price:9}
        ]}
    ]},
    { section:"المقبلات", sectionImg:"ap00.webp", items:[
        {id:"app-khdar", img:"ap01.webp", name:"سلطه خضار", basePrice:0, availableIn:['branch1'], options:[
            {name:"صغير", price:7},{name:"وسط", price:13}
        ]}
    ]},
    { section:"الكنافه", sectionImg:"kn00.webp", items:[
        {id:"kna1", img:"kn01.webp", name:"كنافه قشطه", basePrice:10, availableIn:['branch1'], options:[{name:"", price:0}]}
    ]}
];

export function processMenuData(data) {
    let bestSellers = [];
    let processedMenuData = [];
    data.forEach(section => {
        if (section.section === "الكل") { processedMenuData.push(section); return; }
        let regularItems = [];
        section.items.forEach(item => {
            const itemWithSection = {...item, actualSection: item.actualSection || section.section};
            if (item.isBestSeller === true) bestSellers.push(itemWithSection);
            else regularItems.push(itemWithSection);
        });
        if (regularItems.length > 0 || section.sectionAvailableIn) {
            let newSection = {...section, items: regularItems};
            processedMenuData.push(newSection);
        }
    });

    if (bestSellers.length > 0) {
        let bestSellerSection = {
            section: "الأكثر مبيعاً 🏆",
            sectionImg: "best_seller_icon.webp",
            items: bestSellers,
            sectionAvailableIn: ['branch1']
        };
        processedMenuData.splice(1, 0, bestSellerSection);
    }
    return processedMenuData;
}

export const processedMenuData = processMenuData(menuData);
