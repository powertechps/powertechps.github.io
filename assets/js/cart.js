// ==========================================
// ملف cart.js - مدير سلة المشتريات
// ==========================================

// تهيئة السلة عند تحميل الصفحة (تحديث العداد)
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// 1. جلب السلة من الذاكرة
function getCart() {
    return JSON.parse(localStorage.getItem('techCart')) || [];
}

// 2. حفظ السلة في الذاكرة
function saveCart(cart) {
    localStorage.setItem('techCart', JSON.stringify(cart));
    updateCartBadge(); // تحديث الأيقونة الحمراء الصغيرة
}

// 3. إضافة منتج للسلة
function addToCart(productId) {
    // نبحث عن المنتج في المخزن (allProducts الموجودة في store.js)
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    let cart = getCart();
    // هل المنتج موجود مسبقاً في السلة؟
    const existingItem = cart.find(item => item.id == productId);

    if (existingItem) {
        // التأكد من أن الكمية المطلوبة لا تتجاوز المخزون الفعلي
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
            showToast(`تمت زيادة كمية [ ${product.name} ] في السلة 🛒`, 'success');
        } else {
            showToast(`عذراً، لقد وصلت للحد الأقصى من المخزون المتاح 🚫`, 'error');
            return; 
        }
    } else {
        // إضافة منتج جديد كلياً
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            maxStock: product.stock 
        });
        showToast(`تمت إضافة [ ${product.name} ] للسلة بنجاح ✅`, 'success');
    }

    saveCart(cart);
}

// 4. تحديث عداد السلة 
function updateCartBadge() {
    const cart = getCart();
    // حساب إجمالي عدد القطع
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // ⚠️ التعديل تم هنا: جعلنا الكود يبحث عن floating-cart-badge الخاص بك
    const badge = document.getElementById('floating-cart-badge');
    
    if (badge) {
        badge.innerText = totalItems;
        // إظهار العداد فقط إذا كان هناك منتجات
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// 5. نظام الإشعارات الأنيق (Toast) بدلاً من الـ Alert المزعج
function showToast(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    // إظهاره بحركة ناعمة
    setTimeout(() => toast.classList.add('show'), 50);
    
    // إخفاؤه وحذفه بعد 3 ثوانٍ
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}