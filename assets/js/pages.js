const pages = {

  home: () => `
    <section class="hero-section">
      <div class="container text-center">
        <h1>مرحباً بك في powr tech</h1>
        <p>متجرك المتخصص في القطع الإلكترونية</p>
      </div>
    </section>
  `,

  electronics: () => `
    <section class="container py-5">
      <h2 class="text-center mb-4">القطع الإلكترونية</h2>
      <div id="products-container"></div>
    </section>
  `,

  kits: () => `
    <section class="container py-5">
      <h2 class="text-center mb-4">الحقائب التعليمية</h2>
      <p class="text-center">سيتم عرض المنتجات هنا</p>
    </section>
  `,

  tools: () => `
    <section class="container py-5">
      <h2 class="text-center mb-4">المعدات والأدوات</h2>
      <p class="text-center">سيتم عرض المنتجات هنا</p>
    </section>
  `,

  pcb: () => `
    <section class="container py-5">
      <h2 class="text-center mb-4">تصميم وطباعة PCB</h2>
      <p class="text-center">اختر نوع الخدمة</p>
      <div class="row text-center">
        <div class="col-md-4">
          <button class="btn btn-primary w-100">تصميم فقط</button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-success w-100">طباعة فقط</button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-warning w-100">تصميم + طباعة</button>
        </div>
      </div>
    </section>
  `
};