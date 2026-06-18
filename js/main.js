// Rahalaty Common Layout, Translations, and Currency Utilities

const TEXTS = {
    ar: {
        siteName: 'رحلاتي',
        siteTagline: 'سفر وسياحة',
        navHome: 'الرئيسية',
        navTrips: 'الرحلات',
        navDestinations: 'كل الوجهات',
        navDestinationsShort: 'الوجهات',
        navEgypt: 'وجهات مصر',
        navEgyptShort: 'مصر',
        navSurvey: 'الاستبيان',
        navMyResults: 'رحلتي المقترحة',
        navCta: 'احجز رحلتك',
        discoverWorld: 'اكتشف العالم معنا',
        heroTitleSpan1: 'رحلتك الحلم',
        heroTitleSpan2: 'تبدأ من هنا',
        heroDesc: 'أكثر من 50 وجهة سياحية حول العالم بأجواء مصرية دافئة وخبرة تزيد على 10 سنوات',
        btnExplore: 'اكتشف الرحلات',
        btnSurvey: 'ابدأ الاستبيان',
        egyptSectionTitle: 'اكتشف جمال مصر',
        egyptSectionSub: 'من شواطئ البحر الأحمر إلى معابد الفراعنة الخالدة',
        worldSectionTitle: 'رحلاتنا حول العالم',
        worldSectionSub: 'استكشف باقاتنا السياحية المميزة للوجهات العالمية والمحلية',
        filterAll: 'الكل',
        filterBeach: 'شواطئ وبحر',
        filterCulture: 'ثقافة ومعالم',
        filterAdventure: 'مغامرات وطبيعة',
        filterEgypt: 'رحلات مصر',
        filterGlobal: 'رحلات عالمية',
        stats1Label: 'وجهة سياحية',
        stats2Label: 'سنوات خبرة',
        stats3Label: 'عميل سعيد',
        stats4Label: 'دعم متواصل',
        newsletterTitle: 'اشترك في نشرتنا البريدية',
        newsletterSub: 'ليصلك أحدث العروض والرحلات الحصرية أولاً بأول',
        subscribeBtn: 'اشترك الآن',
        newsletterPlaceholder: 'بريدك الإلكتروني...',
        searchPlaceholder: 'ابحث عن رحلة أو بلد...',
        footerDesc: 'رحلاتي هي شريكك المثالي لاستكشاف العالم بأجود الخدمات وخبرة تزيد على 10 سنوات وبأجواء مصرية دافئة.',
        footerRights: 'جميع الحقوق محفوظة © 2026 رحلاتي.',
        footerContact: 'اتصل بنا',
        backToDests: '← العودة إلى كل الوجهات',
        exploreRelatedTrips: 'الرحلات المتاحة لهذه الوجهة',
        durationDays: 'أيام',
        spotsLeftLabel: 'مقعد متاح',
        bookTripBtn: 'احجز رحلتك الآن',
        highlightsTitle: 'أبرز مميزات الرحلة',
        itineraryTitle: 'برنامج الرحلة',
        includedTitle: 'ما تشمله الرحلة',
        excludedTitle: 'ما لا تشمله الرحلة',
        datesTitle: 'تواريخ المغادرة المتاحة',
        reviewsTitle: 'آراء عملائنا',
        currencySelectLabel: 'تحويل العملة',
        pricePerPerson: 'سعر الرحلة للشخص الواحد',
        bookingTitle: 'حجز رحلتك',
        bookingSub: 'املأ البيانات التالية لتأكيد حجزك معنا وسنتواصل معك فوراً',
        labelName: 'الاسم الكامل',
        labelEmail: 'البريد الإلكتروني',
        labelPhone: 'رقم الهاتف',
        labelAdults: 'عدد البالغين',
        labelChildren: 'عدد الأطفال (تحت 12 سنة)',
        labelTravelDate: 'تاريخ السفر المفضّل',
        labelPayment: 'طريقة الدفع المفضلّة',
        labelNotes: 'ملاحظات إضافية',
        adultsPriceLabel: 'سعر البالغين',
        childrenPriceLabel: 'سعر الأطفال',
        totalPriceLabel: 'الإجمالي الكلي',
        confirmBookingBtn: 'تأكيد الحجز والدفع',
        confirmedTitle: 'تم تأكيد الحجز بنجاح!',
        confirmedSub: 'شكراً لثقتك برحلاتي. رقم مرجع الحجز الخاص بك هو:',
        leaveReviewTitle: 'رأيك يهمنا',
        leaveReviewSub: 'يرجى تقييم تجربتك معنا ومشاركتنا تعليقك لتحسين خدماتنا',
        labelRating: 'التقييم',
        labelReviewText: 'تعليقك',
        submitReviewBtn: 'إرسال التقييم',
        backToHome: 'العودة للرئيسية',
        surveyCtaTitle: 'مش عارف تختار رحلتك؟',
        surveyCtaSub: 'أجب على 4 أسئلة بسيطة وسنختار لك أنسب الرحلات بناءً على تفضيلاتك وميزانيتك',
        featInstant: 'نتائج فورية',
        featTailored: 'رحلات مخصصة لك',
        featFree: 'مجاناً تماماً',
        surveyPageTitle: 'استبيان الرحلات',
        surveyPageSub: 'أجب على هذه الأسئلة لنجد لك الرحلة المثالية التي تبحث عنها',
        stepOf: 'خطوة %s من 4',
        labelMessage: 'ملاحظات إضافية (اختياري)',
        btnBack: '→ رجوع',
        btnNext: 'التالي ←',
        btnSubmit: 'اعرض رحلاتي المقترحة ✨',
        step1Title: 'أولاً — بياناتك الشخصية',
        step1Sub: 'حتى نتواصل معك بنتائج الاستبيان والعروض المخصصة',
        step2Title: 'ثانياً — نوع رحلتك',
        step2Sub: 'مع من ستسافر في مغامرتك القادمة؟',
        step3Title: 'ثالثاً — تفضيلاتك',
        step3Sub: 'أخبرنا عن ميزانيتك، المناخ والمدة المفضلة للسفر',
        step4Title: 'رابعاً — ملاحظات إضافية',
        step4Sub: 'أي طلبات أو تفاصيل خاصة تريد إضافتها؟',
        optFamily: 'مع العائلة',
        optCouple: 'مع الشريك',
        optSolo: 'منفرداً',
        optFriends: 'مع الأصدقاء',
        optBudgetLow: 'اقتصادي (أقل من $500)',
        optBudgetMed: 'متوسط ($500 - $1500)',
        optBudgetHigh: 'مرتفع ($1500 - $3000)',
        optBudgetLux: 'فاخر (أكثر من $3000)',
        optCliBeach: 'شاطئ وبحر',
        optCliDesert: 'صحراء وتاريخ',
        optCliMountain: 'جبال وطبيعة',
        optCliCity: 'مدن ومعالم',
        optDurWeekend: 'عطلة نهاية الأسبوع (2-3 أيام)',
        optDurWeek: 'أسبوع (4-7 أيام)',
        optDurTwoWeeks: 'أسبوعين (8-14 يوم)',
        optDurMonth: 'شهر أو أكثر',
        summaryTitle: '📋 ملخص إجاباتك',
        resultsTitle: 'رحلاتك المقترحة يا %s! 🎉',
        resultsSub: 'بناءً على إجابات الاستبيان، اخترنا لك هذه الرحلات المذهلة التي تناسبك تماماً:',
        matchBadge: 'مطابقة لتفضيلاتك',
        retakeSurvey: '← أعد الاستبيان',
        noMatchTitle: 'لا توجد رحلات مطابقة تماماً لتفضيلاتك',
        noMatchSub: 'ولكن إليك أفضل رحلاتنا المقترحة التي قد تنال إعجابك:',
        inputNamePlaceholder: 'اكتب اسمك الكامل هنا...',
        inputMessagePlaceholder: 'مثلاً: فندق 5 نجوم، غرف مطلة على البحر، الخ...',
        lastSeats: 'آخر مقاعد!',
        viewTripsArrow: 'استكشف الرحلات ←',
        detailsBtn: 'التفاصيل',
        contactWhatsAppBtn: 'واتساب',
        budgetLabel: 'الميزانية:',
        climateLabel: 'المناخ:',
        durationLabel: 'المدة:',
        travelTypeLabel: 'نوع السفر:',
        alertSuccessSub: 'تم تسجيل بريدك بنجاح في القائمة البريدية لرحلاتي!',
        alertSuccessReview: 'شكراً لك! تم إرسال تقييمك بنجاح وسيتم عرضه قريباً.'
    },
    en: {
        siteName: 'Rahalaty',
        siteTagline: 'TRAVEL & TOURS',
        navHome: 'Home',
        navTrips: 'Trips',
        navDestinations: 'Destinations',
        navDestinationsShort: 'Destinations',
        navEgypt: 'Egypt Tours',
        navEgyptShort: 'Egypt',
        navSurvey: 'Survey',
        navMyResults: 'My Recommended Trip',
        navCta: 'Book a Trip',
        discoverWorld: 'Discover the World With Us',
        heroTitleSpan1: 'Your Dream Trip',
        heroTitleSpan2: 'Starts Here',
        heroDesc: 'Over 50 destinations around the world with warm Egyptian hospitality and 10+ years of experience',
        btnExplore: 'Explore Trips',
        btnSurvey: 'Start Survey',
        egyptSectionTitle: 'Discover Egypt',
        egyptSectionSub: 'From the Red Sea sandy beaches to the eternal temples of the Pharaohs',
        worldSectionTitle: 'World Trips',
        worldSectionSub: 'Explore our premium international and domestic tour packages',
        filterAll: 'All',
        filterBeach: 'Beach & Sea',
        filterCulture: 'Culture & Heritage',
        filterAdventure: 'Adventure & Nature',
        filterEgypt: 'Egypt Trips',
        filterGlobal: 'Global Trips',
        stats1Label: 'Destinations',
        stats2Label: 'Years of Experience',
        stats3Label: 'Happy Customers',
        stats4Label: 'Continuous Support',
        newsletterTitle: 'Subscribe to Our Newsletter',
        newsletterSub: 'Get the latest exclusive offers and trip packages directly to your inbox',
        subscribeBtn: 'Subscribe Now',
        newsletterPlaceholder: 'Your email address...',
        searchPlaceholder: 'Search for a trip or country...',
        footerDesc: 'Rahalaty is your perfect partner to explore the world with premium services, 10+ years of experience, and warm Egyptian hospitality.',
        footerRights: 'All rights reserved © 2026 Rahalaty.',
        footerContact: 'Contact Us',
        backToDests: '← Back to All Destinations',
        exploreRelatedTrips: 'Available Trips for this Destination',
        durationDays: 'days',
        spotsLeftLabel: 'seats left',
        bookTripBtn: 'Book Your Trip Now',
        highlightsTitle: 'Trip Highlights',
        itineraryTitle: 'Itinerary Schedule',
        includedTitle: 'What is Included',
        excludedTitle: 'What is Excluded',
        datesTitle: 'Available Departure Dates',
        reviewsTitle: 'Customer Testimonials',
        currencySelectLabel: 'Convert Currency',
        pricePerPerson: 'Price per person',
        bookingTitle: 'Book Your Trip',
        bookingSub: 'Fill in the following details to confirm your trip booking and we will contact you shortly',
        labelName: 'Full Name',
        labelEmail: 'Email Address',
        labelPhone: 'Phone Number',
        labelAdults: 'Number of Adults',
        labelChildren: 'Number of Children (under 12)',
        labelTravelDate: 'Preferred Travel Date',
        labelPayment: 'Preferred Payment Method',
        labelNotes: 'Additional Notes',
        adultsPriceLabel: 'Adult Price',
        childrenPriceLabel: 'Child Price',
        totalPriceLabel: 'Grand Total',
        confirmBookingBtn: 'Confirm Booking & Pay',
        confirmedTitle: 'Booking Confirmed Successfully!',
        confirmedSub: 'Thank you for booking with Rahalaty. Your booking reference is:',
        leaveReviewTitle: 'We Value Your Feedback',
        leaveReviewSub: 'Please rate your experience with us and share your review to improve our services',
        labelRating: 'Rating',
        labelReviewText: 'Your Review',
        submitReviewBtn: 'Submit Review',
        backToHome: 'Back to Home',
        surveyCtaTitle: 'Not sure which trip to choose?',
        surveyCtaSub: 'Answer 4 simple questions and we will match you with the best trips based on your preferences and budget',
        featInstant: 'Instant Results',
        featTailored: 'Tailored Match',
        featFree: '100% Free',
        surveyPageTitle: 'Travel Preference Survey',
        surveyPageSub: 'Answer these questions and our system will find the perfect vacation for you',
        stepOf: 'Step %s of 4',
        labelMessage: 'Additional Notes (Optional)',
        btnBack: '← Back',
        btnNext: 'Next →',
        btnSubmit: 'Show Recommended Trips ✨',
        step1Title: 'First — Personal Details',
        step1Sub: 'So we can reach out with your results and tailored promotions',
        step2Title: 'Second — Travel Companions',
        step2Sub: 'Who will be joining you on your next adventure?',
        step3Title: 'Third — Preferences',
        step3Sub: 'Tell us about your budget, preferred climate, and trip duration',
        step4Title: 'Fourth — Additional Notes',
        step4Sub: 'Any special requests or details you want to add?',
        optFamily: 'With Family',
        optCouple: 'With Partner',
        optSolo: 'Solo Traveller',
        optFriends: 'With Friends',
        optBudgetLow: 'Budget (Under $500)',
        optBudgetMed: 'Medium ($500 - $1500)',
        optBudgetHigh: 'High ($1500 - $3000)',
        optBudgetLux: 'Luxury (Over $3000)',
        optCliBeach: 'Beach & Coastal',
        optCliDesert: 'Desert & Heritage',
        optCliMountain: 'Mountains & Nature',
        optCliCity: 'Cities & Culture',
        optDurWeekend: 'Weekend Break (2-3 days)',
        optDurWeek: 'One Week (4-7 days)',
        optDurTwoWeeks: 'Two Weeks (8-14 days)',
        optDurMonth: 'One Month or more',
        summaryTitle: '📋 Summary of Responses',
        resultsTitle: 'Your Recommended Trips, %s! 🎉',
        resultsSub: 'Based on your preferences, we have curated these matches for you:',
        matchBadge: 'Matches Preferences',
        retakeSurvey: '← Retake Survey',
        noMatchTitle: 'No exact matches found',
        noMatchSub: 'However, here are our best overall recommendations that you might love:',
        inputNamePlaceholder: 'Type your full name here...',
        inputMessagePlaceholder: 'e.g. 5-star hotel, sea-view rooms, quiet places...',
        lastSeats: 'Last seats!',
        viewTripsArrow: 'View Trips →',
        detailsBtn: 'Details',
        contactWhatsAppBtn: 'WhatsApp',
        budgetLabel: 'Budget:',
        climateLabel: 'Climate:',
        durationLabel: 'Duration:',
        travelTypeLabel: 'Travel Style:',
        alertSuccessSub: 'Your email has been subscribed successfully to Rahalaty newsletter!',
        alertSuccessReview: 'Thank you! Your review has been submitted successfully and will be displayed soon.'
    }
};

window.TEXTS = TEXTS;

// ─── TRANSLATION UTILITY ──────────────────────────────────────────────
function getLanguage() {
    return localStorage.getItem('rahalaty_lang') || 'ar';
}

function applyTranslations(lang = 'ar') {
    const texts = TEXTS[lang] || TEXTS['ar'];
    
    // Set document attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Translate all standard text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.innerHTML = texts[key];
        }
    });

    // Translate input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (texts[key]) {
            el.setAttribute('placeholder', texts[key]);
        }
    });

    // Dynamic classes based on LTR/RTL
    if (lang === 'ar') {
        document.body.classList.remove('ltr-layout');
        document.body.classList.add('rtl-layout');
    } else {
        document.body.classList.remove('rtl-layout');
        document.body.classList.add('ltr-layout');
    }
}

// ─── CURRENCY UTILITY ─────────────────────────────────────────────────
const CURRENCY_SYMBOLS = {
    USD: '$', EUR: '€', GBP: '£', EGP: 'E£', SAR: 'ر.س', AED: 'د.إ', KWD: 'د.ك', QAR: 'ر.ق'
};

async function getExchangeRates() {
    const defaultRates = { USD: 1.0, EUR: 0.92, GBP: 0.79, EGP: 47.8, SAR: 3.75, AED: 3.67, KWD: 0.31, QAR: 3.64 };
    try {
        const dbSettings = await window.db.getSettings();
        const rates = { ...defaultRates };
        for (const k in dbSettings) {
            if (k.startsWith('exchangeRate')) {
                const cur = k.replace('exchangeRate', '').toUpperCase();
                rates[cur] = parseFloat(dbSettings[k]);
            }
        }
        return rates;
    } catch (e) {
        return defaultRates;
    }
}

async function convertPrices(currencyCode) {
    const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
    const rates = await getExchangeRates();
    const rate = rates[currencyCode] || 1.0;
    
    document.querySelectorAll('[data-price-usd]').forEach(el => {
        const usdVal = parseFloat(el.getAttribute('data-price-usd'));
        if (!isNaN(usdVal)) {
            const converted = (usdVal * rate).toFixed(0);
            el.innerHTML = `${symbol}${converted}`;
        }
    });

    localStorage.setItem('rahalaty_currency', currencyCode);
    const label = document.getElementById('currencyBtnLabel');
    if (label) label.textContent = currencyCode;
}

// ─── NAVBAR & MENU UTILITY ────────────────────────────────────────────
function setupNavbar() {
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Insert Mobile Top Header Actions next to Logo dynamically
        const navContainer = navbar.querySelector('.container');
        if (navContainer && !document.querySelector('.mobile-nav-actions')) {
            const mobileActions = document.createElement('div');
            mobileActions.className = 'mobile-nav-actions d-lg-none';
            mobileActions.innerHTML = `
                 <button class="lang-btn btn btn-outline-warning px-2 py-1" style="font-size:0.75rem; border-radius:6px !important;">EN</button>
                 <a href="survey.html" class="btn-gold text-decoration-none py-1 px-2.5" style="font-size:0.75rem; border-radius:6px !important;" data-i18n="navCta">احجز رحلتك</a>
             `;
            // Insert it before the navbar-toggler (or just append inside container, Bootstrap flex handles placement)
            const toggler = document.getElementById('mobileMenuBtn');
            if (toggler) {
                navContainer.insertBefore(mobileActions, toggler);
            } else {
                navContainer.appendChild(mobileActions);
            }
        }
    }

    // Dynamic Mobile Bottom Tab Bar setup
    if (!document.querySelector('.mobile-bottom-nav')) {
        const bottomNav = document.createElement('div');
        bottomNav.className = 'mobile-bottom-nav d-lg-none';
        bottomNav.innerHTML = `
            <a class="bottom-nav-link" href="index.html">
                <i class="fa-solid fa-house"></i>
                <span data-i18n="navHome">الرئيسية</span>
            </a>
            <a class="bottom-nav-link" href="index.html#world-trips">
                <i class="fa-solid fa-plane"></i>
                <span data-i18n="navTrips">الرحلات</span>
            </a>
            <a class="bottom-nav-link" href="destinations.html">
                <i class="fa-solid fa-map-location-dot"></i>
                <span data-i18n="navDestinationsShort">الوجهات</span>
            </a>
            <a class="bottom-nav-link" href="index.html#egypt-destinations">
                <i class="fa-solid fa-monument"></i>
                <span data-i18n="navEgyptShort">مصر</span>
            </a>
            <a class="bottom-nav-link" href="survey.html">
                <i class="fa-solid fa-clipboard-question"></i>
                <span data-i18n="navSurvey">الاستبيان</span>
            </a>
        `;
        document.body.appendChild(bottomNav);

        const updateActiveTab = () => {
            const activePath = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
            const currentHash = window.location.hash || '';
            
            bottomNav.querySelectorAll('.bottom-nav-link').forEach(link => {
                const href = link.getAttribute('href');
                const [linkPath, linkHash] = href.split('#');
                const normalizedLinkPath = (linkPath || 'index.html').replace(/\.html$/, '');
                const normalizedActivePath = activePath === '' ? 'index' : activePath;
                
                const p1 = normalizedLinkPath === '' ? 'index' : normalizedLinkPath;
                const p2 = normalizedActivePath === '' ? 'index' : normalizedActivePath;
                
                let isActive = false;
                if (p1 === p2) {
                    if (linkHash) {
                        isActive = currentHash === '#' + linkHash;
                    } else {
                        isActive = !currentHash || currentHash === '#';
                    }
                }
                
                if (isActive) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };
        
        updateActiveTab();
        window.addEventListener('hashchange', updateActiveTab);
    }

    // Clean up old mobile menu or drawer instances from HTML if any exist
    const oldMenu = document.getElementById('mobileMenu');
    if (oldMenu) oldMenu.remove();
    const oldDrawer = document.getElementById('mobileMenuDrawer');
    if (oldDrawer) oldDrawer.remove();
    const oldBackdrop = document.getElementById('drawerBackdrop');
    if (oldBackdrop) oldBackdrop.remove();
}

// Currency Dropdown toggle
function toggleCurrencyMenu() {
    const menu = document.getElementById('currencyMenu');
    const btn = document.getElementById('currencyBtn');
    if (menu) {
        const open = menu.style.display === 'block';
        menu.style.display = open ? 'none' : 'block';
        btn.setAttribute('aria-expanded', !open);
    }
}

window.toggleCurrencyMenu = toggleCurrencyMenu;
window.selectCurrency = async function(code) {
    await convertPrices(code);
    const menu = document.getElementById('currencyMenu');
    const btn = document.getElementById('currencyBtn');
    if (menu) {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
    }
};

// ─── INITIALIZATION ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    // Clean URL in address bar by removing .html if present (visual cleanup)
    if (window.location.pathname.endsWith('.html')) {
        let cleanPath = window.location.pathname.replace(/\.html$/, '');
        if (cleanPath.endsWith('/index')) {
            cleanPath = cleanPath.slice(0, -5);
        }
        window.history.replaceState({}, '', cleanPath + window.location.search + window.location.hash);
    }

    // Intercept internal links for clean navigation in local file environments
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        
        const href = anchor.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        
        const isLocalFile = window.location.protocol === 'file:';
        if (isLocalFile) {
            e.preventDefault();
            
            let [path, query] = href.split('?');
            let [cleanPath, hash] = path.split('#');
            
            if (cleanPath && !cleanPath.endsWith('.html') && cleanPath !== '/' && cleanPath !== './') {
                cleanPath += '.html';
            } else if (cleanPath === '/' || cleanPath === './') {
                cleanPath = 'index.html';
            }
            
            let finalHref = cleanPath;
            if (query) finalHref += '?' + query;
            if (hash) finalHref += '#' + hash;
            
            window.location.href = finalHref;
        }
    });

    // 1. Initialize Database & Appwrite SDK
    await window.db.init();

    // 2. Setup menu & scrolling
    setupNavbar();

    // Close currency menu clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('currencyMenu');
        const widget = document.getElementById('currencyWidget');
        if (menu && widget && !widget.contains(e.target)) {
            menu.style.display = 'none';
            const btn = document.getElementById('currencyBtn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    // 3. Language & translation loading
    const initialLang = getLanguage();
    applyTranslations(initialLang);

    // Language form toggles
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = getLanguage();
            const next = current === 'ar' ? 'en' : 'ar';
            localStorage.setItem('rahalaty_lang', next);
            applyTranslations(next);
            
            // Dispatch language change trigger
            const ev = new CustomEvent('langChanged', { detail: { lang: next } });
            document.dispatchEvent(ev);

            // Re-render language button labels
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.textContent = next === 'ar' ? 'EN' : 'عربي';
            });
        });
        
        // Initial button text
        btn.textContent = initialLang === 'ar' ? 'EN' : 'عربي';
    });

    // 4. Currency conversion loading
    const savedCurrency = localStorage.getItem('rahalaty_currency') || 'USD';
    await convertPrices(savedCurrency);

    // 5. Handle Newsletter submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();
            if (email) {
                await window.db.subscribeNewsletter(email);
                alert(TEXTS[getLanguage()].alertSuccessSub);
                emailInput.value = '';
            }
        });
    }
});
