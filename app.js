// متغيرات عامة
let deferredPrompt = null;
const installButton = document.getElementById('installButton');
const installContainer = document.getElementById('installContainer');

// التحقق من دعم التثبيت
const isInstallable = () => {
    return !window.matchMedia('(display-mode: standalone)').matches && 
           !window.navigator.standalone &&
           !document.referrer.includes('android-app://');
};

// إخفاء زر التثبيت في البداية
if (installContainer) {
    installContainer.style.display = 'none';
}

// التقاط حدث beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt fired');
    // منع ظهور النافذة المنبثقة التلقائية
    e.preventDefault();
    // تخزين الحدث لاستخدامه لاحقاً
    deferredPrompt = e;
    
    // التحقق من إمكانية التثبيت
    if (isInstallable()) {
        // إظهار زر التثبيت
        if (installContainer) {
            installContainer.style.display = 'block';
        }
    }
});

// إضافة مستمع حدث النقر لزر التثبيت
if (installButton) {
    installButton.addEventListener('click', async () => {
        console.log('Install button clicked');
        
        // التحقق من وجود حدث التثبيت
        if (!deferredPrompt) {
            console.log('No deferredPrompt available - trying to trigger install manually');
            
            // محاولة تشغيل التثبيت يدوياً
            if (navigator.getInstalledRelatedApps) {
                try {
                    const relatedApps = await navigator.getInstalledRelatedApps();
                    if (relatedApps.length === 0) {
                        // عرض رسالة للمستخدم
                        alert('لتثبيت التطبيق:\n1. اضغط على قائمة المتصفح (النقاط الثلاث)\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
                    }
                } catch (error) {
                    console.error('Error checking installed apps:', error);
                }
            } else {
                // عرض رسالة للمستخدم
                alert('لتثبيت التطبيق:\n1. اضغط على قائمة المتصفح (النقاط الثلاث)\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
            }
            return;
        }

        try {
            // إظهار نافذة التثبيت
            await deferredPrompt.prompt();
            console.log('Install prompt shown');
            
            // انتظار اختيار المستخدم
            const choiceResult = await deferredPrompt.userChoice;
            console.log('User choice:', choiceResult.outcome);
            
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
        } catch (error) {
            console.error('Error during installation:', error);
            // عرض رسالة بديلة للمستخدم
            alert('لتثبيت التطبيق:\n1. اضغط على قائمة المتصفح (النقاط الثلاث)\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
        } finally {
            // تصفير المتغير وإخفاء الزر
            deferredPrompt = null;
            if (installContainer) {
                installContainer.style.display = 'none';
            }
        }
    });
}

// التحقق إذا كان التطبيق مثبتاً بالفعل
window.addEventListener('appinstalled', (evt) => {
    console.log('Application installed');
    if (installContainer) {
        installContainer.style.display = 'none';
    }
    deferredPrompt = null;
});

// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './'
            });
            console.log('ServiceWorker registered successfully:', registration.scope);
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    });
}

// للتحقق من التغييرات في وضع العرض
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    if (evt.matches) {
        // تم تثبيت التطبيق
        installContainer.style.display = 'none';
    }
});

// التعامل مع النقر على البطاقات
document.addEventListener('DOMContentLoaded', () => {
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) {
                // إضافة تأثير النقر
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                    window.location.href = url;
                }, 150);
            }
        });

        // إضافة تأثير اللمس للموبايل
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', () => {
            card.style.transform = '';
        });
    });
});