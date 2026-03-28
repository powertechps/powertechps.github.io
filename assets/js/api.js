// ملف api.js - مسؤول عن التواصل مع قاعدة البيانات (Google Sheets)

async function fetchProducts() {
    try {
        console.log("جاري الاتصال بجوجل شيت...");
        
        // لقد قمنا بوضع الرابط هنا مباشرة لنتجاوز أي مشكلة في ملف config
        const googleLink = "https://script.google.com/macros/s/AKfycbylems6tNTuwSP8Q0nelQ3X3NgKxiPKvBjvN3a0f4Hl7hq8kzE23Hw0Pn2cZ2pnyPRQcw/exec";
        
        const response = await fetch(googleLink, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const data = await response.json();
        
        // سنطبع البيانات في الكونسول لنراها بأعيننا
        console.log("تم استلام البيانات من جوجل بنجاح!", data);
        
        return data.data || data; 
        
    } catch (error) {
        console.error("حدث خطأ أثناء جلب المنتجات:", error);
        return [];
    }
}