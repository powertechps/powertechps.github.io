// ==========================================
// ملف ui.js - موظف العرض (يقرأ البيانات الحقيقية من جوجل شيت)
// ==========================================

function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return; 

    // حالة عدم وجود منتجات
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">عذراً، لا توجد منتجات في هذا القسم حالياً.</h4>
            </div>`;
        return;
    }

    let htmlContent = '';

    products.forEach(product => {
        
        // 1. التحقق من الكمية (Stock)
        const isOutOfStock = product.stock <= 0;
        const btnTitle = isOutOfStock ? 'نفذت الكمية' : 'إضافة للسلة';
        const btnStyle = isOutOfStock ? 'background-color: #a4b0be; cursor: not-allowed; box-shadow: none; transform: none;' : '';
        const icon = isOutOfStock ? '<i class="fas fa-ban"></i>' : '<i class="fas fa-shopping-cart"></i>';
        const disableAttr = isOutOfStock ? 'disabled' : '';

        // 2. قراءة الشارة (Badge)
        const badgeHTML = product.badge ? `<span class="pro-discount-badge">${product.badge}</span>` : '';

        // 3. قراءة السعر القديم (Old Price)
        const oldPriceHTML = product.oldPrice ? `<span class="pro-old-price">${product.oldPrice} ₪</span>` : '';

        // 4. قراءة التقييم (Rating)
        const ratingHTML = product.rating ? `
            <div class="pro-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span class="rating-count">(${product.rating})</span>
            </div>
        ` : '';

        // 5. بناء بطاقة المنتج 
        htmlContent += `
        <div class="col-xl-3 col-lg-4 col-md-6 mb-4"> 
            <div class="pro-product-card">
                
                <div class="pro-card-image-wrapper" onclick="openProductModal('${product.id}')" style="cursor: pointer;" title="عرض التفاصيل">
                    ${badgeHTML} <span class="pro-category-badge">${product.subCategory || 'عام'}</span>
                    <img src="${product.image || 'https://via.placeholder.com/300'}" loading="lazy" alt="${product.name}">
                </div>
                
                <div class="pro-card-body">
                    ${ratingHTML} 
                    
                    <h5 class="pro-product-title" onclick="openProductModal('${product.id}')" style="cursor: pointer; color: #0d6efd;" title="عرض التفاصيل">
                        ${product.name || 'منتج بدون اسم'}
                    </h5>
                    
                    <p class="pro-product-desc">${product.description || 'لا يوجد وصف متاح.'}</p>
                    
                    <div class="pro-card-footer">
                        <div class="pro-price">
                            ${product.price || 0} <span>شيكل</span>
                            ${oldPriceHTML} 
                        </div>
                            
                        <button class="pro-add-btn" title="${btnTitle}" style="${btnStyle}" ${disableAttr} onclick="addToCart('${product.id}')">
                            ${icon}
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
        `;
    });
    
    container.innerHTML = htmlContent;
}