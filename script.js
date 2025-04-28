// تحديد تاريخ البداية
let startDate = new Date('2023-12-16T00:00:00');
const oneDay = 24 * 60 * 60 * 1000; // عدد الميلي ثانية في اليوم
const oneYear = 365 * oneDay; // عدد الميلي ثانية في السنة

// عناصر DOM
const daysCounter = document.getElementById('days-counter');
const monthsCounter = document.getElementById('months-counter');
const weeksCounter = document.getElementById('weeks-counter');
const hoursCounter = document.getElementById('hours-counter');
const minutesCounter = document.getElementById('minutes-counter');
const secondsCounter = document.getElementById('seconds-counter');
const mainTitle = document.getElementById('main-title');
const themeButton = document.getElementById('theme-button');
const refreshBtn = document.getElementById('refresh-btn');
const shareBtn = document.getElementById('share-btn');
const customDateBtn = document.getElementById('custom-date-btn');
const customDateModal = document.getElementById('custom-date-modal');
const customDateInput = document.getElementById('custom-date-input');
const saveDateBtn = document.getElementById('save-date');
const closeModal = document.querySelector('.close-modal');
const anniversaryCelebration = document.getElementById('anniversary-celebration');
const celebrationClose = document.getElementById('celebration-close');
const soundToggle = document.getElementById('sound-toggle');
const startDateDisplay = document.getElementById('start-date-display');
const currentDateDisplay = document.getElementById('current-date-display');
const currentTimeDisplay = document.getElementById('current-time-display');
const totalHours = document.getElementById('total-hours');
const totalMinutes = document.getElementById('total-minutes');
const totalSeconds = document.getElementById('total-seconds');
const eventSelector = document.getElementById('event-selector');
const eventDays = document.getElementById('event-days');
const screenshotBtn = document.getElementById('screenshot-btn');
const colorToggle = document.getElementById('color-toggle');
const colorPanel = document.querySelector('.color-panel');
const colorOptions = document.querySelectorAll('.color-option');

// متغيرات للصوت
let isMuted = true;
let anniversarySound;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحقق من وجود تاريخ مخصص في التخزين المحلي
    const savedDate = localStorage.getItem('startDate');
    if (savedDate) {
        startDate = new Date(savedDate);
    }

    // تحقق من وضع السمة المظلمة
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-theme');
    }

    // تحقق من السمة اللونية المحفوظة
    const savedTheme = localStorage.getItem('colorTheme');
    if (savedTheme) {
        document.body.classList.add(`theme-${savedTheme}`);
    }

    // تحقق من حالة الصوت
    isMuted = localStorage.getItem('muted') !== 'false';
    if (isMuted) {
        document.body.classList.add('muted');
    }

    // تهيئة الصوت
    initializeSound();

    // تحديث العدادات
    updateCounters();
    
    // تحريك العنوان
    animateTitle();
    
    // تحديث العدادات كل ثانية
    setInterval(updateCounters, 1000);
    
    // التحقق من الزائر العائد
    checkReturningVisitor();
    
    // تحديث عرض التاريخ
    updateDateDisplay();
    
    // تحديث الوقت الحالي
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // تحديث عداد المناسبات القادمة
    updateEventCountdown();
    setInterval(updateEventCountdown, 3600000); // تحديث كل ساعة
    
    // إضافة تأثير نبض للعداد الرئيسي
    daysCounter.classList.add('pulse-effect');
});

// تهيئة الصوت
function initializeSound() {
    anniversarySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    anniversarySound.volume = 0.5;
}

// تحديث العدادات
function updateCounters() {
    const now = new Date();
    const timeDiff = now - startDate;
    const daysDiff = Math.floor(timeDiff / oneDay);
    
    // تحديث عداد الأيام مع تأثير العد
    animateCounter(daysCounter, daysDiff);
    
    // حساب وتحديث الشهور والأسابيع والساعات
    const monthsDiff = Math.floor(daysDiff / 30);
    const weeksDiff = Math.floor(daysDiff / 7);
    const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
    
    monthsCounter.textContent = monthsDiff;
    weeksCounter.textContent = weeksDiff;
    hoursCounter.textContent = hoursDiff;
    
    // تحديث الدقائق والثواني
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    minutesCounter.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsCounter.textContent = seconds < 10 ? `0${seconds}` : seconds;
    
    // تحديث إجمالي الوقت المنقضي
    const totalHoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
    const totalMinutesDiff = Math.floor(timeDiff / (60 * 1000));
    const totalSecondsDiff = Math.floor(timeDiff / 1000);
    
    totalHours.textContent = totalHoursDiff.toLocaleString();
    totalMinutes.textContent = totalMinutesDiff.toLocaleString();
    totalSeconds.textContent = totalSecondsDiff.toLocaleString();
    
    // تغيير نمط الموقع حسب عدد الأيام
    updateSiteStyle(daysDiff);
    
    // التحقق من ذكرى سنوية
    checkAnniversary(daysDiff);
    
    // تحديث عرض التاريخ
    updateDateDisplay();
}

// تحريك العداد
function animateCounter(element, targetValue) {
    const currentValue = parseInt(element.textContent);
    if (isNaN(currentValue) || currentValue !== targetValue) {
        // إذا كان العداد يظهر لأول مرة، نبدأ العد من الصفر
        if (isNaN(currentValue)) {
            let count = 0;
            const interval = setInterval(() => {
                element.textContent = count;
                element.style.animation = 'countUp 0.2s ease-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 200);
                
                count++;
                if (count > targetValue) {
                    clearInterval(interval);
                }
            }, 30);
        } else {
            // إذا كان العداد موجودًا بالفعل، نحدثه مباشرة
            element.textContent = targetValue;
        }
    }
}

// تحريك العنوان
function animateTitle() {
    mainTitle.style.opacity = '1';
    mainTitle.style.transform = 'translateY(0)';
}

// تحديث نمط الموقع حسب عدد الأيام
function updateSiteStyle(days) {
    const container = document.querySelector('.container');
    
    if (days < 30) {
        // نمط بسيط وهادئ
        document.documentElement.style.setProperty('--primary-color', '#4a6fa5');
        document.documentElement.style.setProperty('--secondary-color', '#166088');
    } else if (days < 100) {
        // نمط متوسط
        document.documentElement.style.setProperty('--primary-color', '#4776E6');
        document.documentElement.style.setProperty('--secondary-color', '#8E54E9');
    } else {
        // نمط متقدم
        document.documentElement.style.setProperty('--primary-color', '#FF416C');
        document.documentElement.style.setProperty('--secondary-color', '#FF4B2B');
    }
}

// التحقق من ذكرى سنوية
function checkAnniversary(days) {
    // التحقق من مرور سنة كاملة (365 يوم)
    if (days === 365 || days === 730 || days === 1095) {
        showAnniversaryCelebration();
    }
}

// عرض احتفال الذكرى السنوية
function showAnniversaryCelebration() {
    anniversaryCelebration.style.display = 'flex';
    
    // تشغيل الصوت إذا كان مسموحًا
    if (!isMuted) {
        anniversarySound.play();
    }
    
    // تهيئة الألعاب النارية
    const fireworks = document.querySelectorAll('.fireworks');
    fireworks.forEach(firework => {
        setFireworkAnimation(firework);
    });
}

// تعيين حركة الألعاب النارية
function setFireworkAnimation(firework) {
    // توليد موقع عشوائي للألعاب النارية
    const x = (Math.random() - 0.5) * 500;
    const y = (Math.random() - 0.5) * 500;
    
    firework.style.setProperty('--x', `${x}px`);
    firework.style.setProperty('--y', `${y}px`);
    
    // إعادة تعيين الحركة بعد انتهائها
    setTimeout(() => {
        setFireworkAnimation(firework);
    }, 2000);
}

// التحقق من الزائر العائد
function checkReturningVisitor() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().toISOString();
    
    if (lastVisit) {
        // إذا كان زائر عائد، نعرض رسالة ترحيب مختلفة
        const timeDiff = new Date() - new Date(startDate);
        const daysDiff = Math.floor(timeDiff / oneDay);
        mainTitle.textContent = ` معا للأبد ❤👫🏻    `;
    }
    
    // تحديث تاريخ آخر زيارة
    localStorage.setItem('lastVisit', now);
}

// تحديث عرض التاريخ
function updateDateDisplay() {
    // تنسيق تاريخ البداية
    const day = startDate.getDate();
    const month = startDate.getMonth() + 1;
    const year = startDate.getFullYear();
    startDateDisplay.textContent = `${day}/${month}/${year}`;
    
    // تنسيق التاريخ الحالي
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    currentDateDisplay.textContent = `${currentDay}/${currentMonth}/${currentYear}`;
}

// تحديث الوقت الحالي
function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    currentTimeDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// تحديث عداد المناسبات القادمة
function updateEventCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let eventDate;
    
    switch (eventSelector.value) {
        case 'ramadan':
            // تقريبي - يجب تحديث هذا كل عام
            eventDate = new Date(`${currentYear}-03-10`);
            if (now > eventDate) {
                eventDate = new Date(`${currentYear + 1}-02-28`);
            }
            break;
        case 'eid-al-fitr':
            // تقريبي - يجب تحديث هذا كل عام
            eventDate = new Date(`${currentYear}-04-10`);
            if (now > eventDate) {
                eventDate = new Date(`${currentYear + 1}-03-31`);
            }
            break;
        case 'eid-al-adha':
            // تقريبي - يجب تحديث هذا كل عام
            eventDate = new Date(`${currentYear}-06-17`);
            if (now > eventDate) {
                eventDate = new Date(`${currentYear + 1}-06-06`);
            }
            break;
        case 'new-year':
            eventDate = new Date(`${currentYear + 1}-01-01`);
            break;
    }
    
    const timeDiff = eventDate - now;
    const daysDiff = Math.ceil(timeDiff / oneDay);
    
    eventDays.textContent = daysDiff > 0 ? daysDiff : 0;
}

// تطبيق تأثير الاهتزاز على عداد الأيام في أيام معينة
function applyShakeEffect(days) {
    if (days % 100 === 0) { // كل 100 يوم
        daysCounter.style.animation = 'shake 0.5s';
        setTimeout(() => {
            daysCounter.style.animation = '';
        }, 500);
        
        // تشغيل الصوت إذا كان مسموحًا
        if (!isMuted) {
            const milestone = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
            milestone.volume = 0.3;
            milestone.play();
        }
    }
}

// تغيير الخلفية حسب وقت اليوم
function updateBackgroundByTime() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        // صباح
        document.documentElement.style.setProperty('--gradient-start', '#FF9966');
        document.documentElement.style.setProperty('--gradient-end', '#FF5E62');
    } else if (hour >= 12 && hour < 18) {
        // ظهر
        document.documentElement.style.setProperty('--gradient-start', '#4776E6');
        document.documentElement.style.setProperty('--gradient-end', '#8E54E9');
    } else {
        // ليل
        document.documentElement.style.setProperty('--gradient-start', '#141E30');
        document.documentElement.style.setProperty('--gradient-end', '#243B55');
    }
}

// أخذ لقطة شاشة للموقع
function takeScreenshot() {
    // إشعار المستخدم بأن هذه الميزة تعمل فقط في بعض المتصفحات
    alert('هذه الميزة تعمل فقط في بعض المتصفحات. يمكنك استخدام زر Print Screen على لوحة المفاتيح أو أخذ لقطة شاشة يدوياً.');
}

// إضافة مستمعي الأحداث
themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-theme'));
});

refreshBtn.addEventListener('click', () => {
    updateCounters();
    refreshBtn.classList.add('active');
    setTimeout(() => {
        refreshBtn.classList.remove('active');
    }, 300);
});

shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        const timeDiff = new Date() - startDate;
        const daysDiff = Math.floor(timeDiff / oneDay);
        
        navigator.share({
            title: 'عداد الأيام',
            text: `لقد مر ${daysDiff} يوم منذ البداية!`,
            url: window.location.href
        });
    } else {
        alert('المشاركة غير متاحة في متصفحك');
    }
});

customDateBtn.addEventListener('click', () => {
    customDateModal.style.display = 'flex';
    customDateInput.value = startDate.toISOString().split('T')[0];
});

closeModal.addEventListener('click', () => {
    customDateModal.style.display = 'none';
});

saveDateBtn.addEventListener('click', () => {
    const newDate = new Date(customDateInput.value);
    if (!isNaN(newDate.getTime())) {
        startDate = newDate;
        localStorage.setItem('startDate', startDate.toISOString());
        updateCounters();
        customDateModal.style.display = 'none';
    }
});

celebrationClose.addEventListener('click', () => {
    anniversaryCelebration.style.display = 'none';
});

soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    document.body.classList.toggle('muted');
    localStorage.setItem('muted', isMuted);
});

eventSelector.addEventListener('change', updateEventCountdown);

screenshotBtn.addEventListener('click', takeScreenshot);

colorToggle.addEventListener('click', () => {
    colorPanel.classList.toggle('active');
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        
        // إزالة جميع السمات اللونية السابقة
        document.body.classList.remove('theme-blue', 'theme-red', 'theme-green', 'theme-purple');
        
        // إضافة السمة اللونية الجديدة
        document.body.classList.add(`theme-${theme}`);
        
        // حفظ التفضيل
        localStorage.setItem('colorTheme', theme);
        
        // إغلاق لوحة الألوان
        colorPanel.classList.remove('active');
    });
});

// إغلاق النافذة المنبثقة عند النقر خارجها
window.addEventListener('click', (event) => {
    if (event.target === customDateModal) {
        customDateModal.style.display = 'none';
    }
    if (event.target === anniversaryCelebration) {
        anniversaryCelebration.style.display = 'none';
    }
});

// تحديث الخلفية حسب الوقت
updateBackgroundByTime();
setInterval(updateBackgroundByTime, 3600000); // تحديث كل ساعة