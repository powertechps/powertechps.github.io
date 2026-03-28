// ==========================================
// دالة إرسال طلب PCB عبر الواتساب
// ==========================================
function sendPcbWhatsApp() {
    // 1. جلب البيانات من النموذج
    const serviceType = document.getElementById('serviceType').value;
    const layerCount = document.getElementById('layerCount').value; // سيقرأ القيمة المجمدة "1"
    const pcbColor = document.getElementById('pcbColor').value; // سيقرأ القيمة المجمدة "بدون لون"
    const pcbDimensions = document.getElementById('pcbDimensions').value.trim();
    const pcbQuantity = document.getElementById('pcbQuantity').value;
    const pcbNotes = document.getElementById('pcbNotes').value.trim();

    // 2. التحقق من الحقول الإجبارية
    if (!pcbDimensions || !pcbQuantity) {
        alert("يرجى إدخال الأبعاد التقريبية والكمية المطلوبة قبل الإرسال.");
        return;
    }

    // 3. رقم الواتساب الخاص بك (تأكد من وضع رقمك مسبوقاً بمفتاح الدولة بدون أصفار أو +)
    // مثال: 97059XXXXXXX أو 97259XXXXXXX (حسب ما تستخدم للواتس)
    const phoneNumber = "970590000000"; // ⚠️ غيّر هذا الرقم لرقمك الحقيقي

    // 4. بناء رسالة الواتساب المنسقة
    let message = `*طلب خدمات PCB جديد* ⚙️\n\n`;
    message += `*🔹 نوع الخدمة:* ${serviceType}\n`;
    message += `*🔹 عدد الطبقات:* ${layerCount} (طبقة واحدة)\n`;
    message += `*🔹 لون اللوحة:* ${pcbColor}\n`;
    message += `*🔹 الأبعاد:* ${pcbDimensions}\n`;
    message += `*🔹 الكمية:* ${pcbQuantity} قطع\n`;
    
    if (pcbNotes) {
        message += `\n*📝 ملاحظات إضافية:*\n${pcbNotes}\n`;
    }

    message += `\n*-- (سأقوم بإرسال ملفات المخطط/Gerber هنا إذا توفرت) --*`;

    // 5. تحويل النص لترميز يدعمه الرابط (URL Encoding)
    const encodedMessage = encodeURIComponent(message);

    // 6. فتح تطبيق الواتساب
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}