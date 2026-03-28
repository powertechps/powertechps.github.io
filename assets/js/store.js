// ==========================================
// ملف store.js - مدير المنتجات والفلترة
// ==========================================

let allProducts = [];

// 1. دالة رسم الهياكل العظمية (تأثير التحميل)
function renderSkeletons() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    let skeletonHTML = '';
    // عرض 8 هياكل عظمية مؤقتة بنفس مقاسات بطاقاتك
    for(let i = 0; i < 8; i++) {
        skeletonHTML += `
        <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
            <div class="pro-product-card shadow-sm border-0 h-100">
                <div class="skeleton" style="height: 200px; width: 100%; border-radius: 12px 12px 0 0;"></div>
                <div class="pro-card-body p-3">
                    <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 10px; border-radius: 4px;"></div>
                    <div class="skeleton" style="height: 15px; width: 50%; margin-bottom: 20px; border-radius: 4px;"></div>
                    <div class="d-flex justify-content-between align-items-end mt-3">
                        <div class="skeleton" style="height: 25px; width: 40%; border-radius: 4px;"></div>
                        <div class="skeleton" style="height: 35px; width: 35px; border-radius: 50%;"></div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    container.innerHTML = skeletonHTML;
}

// 2. دالة جلب المنتجات 
async function initStore() {
    try {
        // ⚠️ الخطوة السحرية: إظهار الهيكل العظمي أولاً ليراه العميل أثناء الانتظار
        renderSkeletons();

        // جلب البيانات من قاعدة البيانات (جوجل شيت)
        allProducts = await fetchProducts(); 
        
        // مسح الهيكل العظمي ورسم المنتجات الحقيقية
        renderProducts(allProducts); 
    } catch (error) {
        console.error("خطأ أثناء جلب المنتجات:", error);
        const container = document.getElementById('products-container');
        if(container) {
            container.innerHTML = `
            <div class="col-12 text-center text-danger p-5">
                <i class="fas fa-wifi fa-3x mb-3"></i>
                <h5>عذراً، حدث خطأ في الاتصال. يرجى تحديث الصفحة.</h5>
            </div>`;
        }
    }
}

// 3. دالة فلترة المنتجات 
function filterCategory(categoryName) {
    // أ. تلوين الزر النشط (بطريقة ذكية تبحث في أمر onclick بدلاً من النص الظاهر)
    const categoryButtons = document.querySelectorAll('.category-item');
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        // إذا كان أمر onclick يحتوي على اسم القسم، قم بتلوينه
        const onclickAttr = btn.getAttribute('onclick') || "";
        if (onclickAttr.includes(categoryName)) {
            btn.classList.add('active');
        }
    });

    // ب. الفلترة الفعلية
    let filteredProducts = [];
    if (categoryName === 'الكل') {
        filteredProducts = allProducts; 
    } else {
        filteredProducts = allProducts.filter(product => {
            const sub = (product.subCategory || "").trim();
            const main = (product.mainCategory || "").trim();
            return sub === categoryName || main === categoryName;
        });
    }

    // ج. رسم المنتجات
    renderProducts(filteredProducts);
}

// 4. تشغيل المتجر وإضافة ميزة "السحب بالماوس" ونظام البحث
document.addEventListener('DOMContentLoaded', () => {
    initStore(); // جلب المنتجات

    // === كود السحب بالماوس لشريط الأقسام ===
    const slider = document.querySelector('.category-scroll-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing'; 
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // === نظام البحث الذكي (Live Search) ===
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim().toLowerCase();
            
            const filteredProducts = allProducts.filter(product => 
                (product.name && product.name.toLowerCase().includes(searchTerm)) || 
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
            
            renderProducts(filteredProducts);
        });
    }
    
});

// ==========================================
// نظام نافذة تفاصيل المنتج (Modal & Tech Table)
// ==========================================

function openProductModal(productId) {
    // 1. البحث عن المنتج في المصفوفة
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    // 2. السحر: تحويل النص إلى جدول (Technical_Table)
    let techTableHTML = '';
    // افترض أن اسم العمود في جوجل شيت هو tech_spec أو Technical_Table
    const techData = product.Technical_Table || product.tech_spec; 
    
    if (techData) {
        // نفصل النص بعلامة |
        const rows = techData.split('|'); 
        techTableHTML = `
        <div class="tech-table-wrapper">
            <h6 class="fw-bold mb-3"><i class="fas fa-cogs text-primary"></i> المواصفات التقنية</h6>
            <table class="tech-table">
                <tbody>`;
        
        // نمر على كل صف ونفصله بعلامة :
        rows.forEach(row => {
            const parts = row.split(':');
            if (parts.length === 2) {
                techTableHTML += `<tr><th>${parts[0].trim()}</th><td>${parts[1].trim()}</td></tr>`;
            }
        });
        
        techTableHTML += `</tbody></table></div>`;
    }

    // 3. بناء محتوى النافذة (HTML)
    const modalBody = document.getElementById('modalBodyContent');
    const isOutOfStock = product.stock <= 0;
    
    modalBody.innerHTML = `
        <div class="row g-0">
            <div class="col-md-5 bg-light d-flex align-items-center justify-content-center p-4" style="min-height: 300px;">
                <img src="${product.image}" class="img-fluid" style="max-height: 350px; object-fit: contain; mix-blend-mode: darken;" alt="${product.name}">
            </div>
            
            <div class="col-md-7 p-4 p-md-5 d-flex flex-column">
                <div class="mb-2">
                    <span class="badge bg-primary rounded-pill px-3 py-2">${product.category || 'عام'}</span>
                    ${isOutOfStock ? '<span class="badge bg-danger rounded-pill px-3 py-2 ms-2">نفدت الكمية</span>' : ''}
                </div>
                
                <h3 class="fw-bold text-dark mb-2">${product.name}</h3>
                <h2 class="text-primary fw-bold mb-3">${product.price} ₪</h2>
                
                <p class="text-muted" style="line-height: 1.8;">
                    ${product.description || 'لا يتوفر وصف مفصل لهذا المنتج حالياً.'}
                </p>

                ${techTableHTML}
                
                <div class="d-flex gap-3 mt-auto pt-4">
                    <button class="btn ${isOutOfStock ? 'btn-secondary disabled' : 'btn-primary'} flex-grow-1 py-3 rounded-pill fw-bold fs-5 shadow-sm" 
                            ${isOutOfStock ? '' : `onclick="addToCart('${product.id}')"`}>
                        <i class="fas fa-cart-plus me-2"></i> ${isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}
                    </button>
                    
                    <button class="btn btn-outline-dark py-3 px-4 rounded-pill shadow-sm" 
                            onclick="shareProduct('${product.name}', '${product.price}')" title="مشاركة المنتج">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // 4. إظهار النافذة ومنع خلفية الموقع من التمرير (Scroll)
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = ''; // إعادة التمرير للموقع
}

// دالة المشاركة الذكية (تدعم الجوال والكمبيوتر)
function shareProduct(name, price) {
    const shareText = `🔥 شوف هالمنتج الرهيب: ${name}\n💰 السعر: ${price} شيكل!\nمتوفر الآن في متجرنا: `;
    const storeUrl = window.location.href;

    if (navigator.share) {
        // إذا كان جوال، سيفتح قائمة المشاركة (واتساب، فيسبوك، الخ)
        navigator.share({ title: name, text: shareText, url: storeUrl })
            .catch(console.error);
    } else {
        // إذا كان كمبيوتر، ينسخ النص للحافظة
        navigator.clipboard.writeText(shareText + storeUrl);
        alert("تم نسخ تفاصيل المنتج للحافظة! يمكنك لصقها وإرسالها لأصدقائك.");
    }
}
