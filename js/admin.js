// Rahalaty Admin Dashboard Panel JavaScript Logic

document.addEventListener('DOMContentLoaded', async () => {
    // Check session safety
    if (sessionStorage.getItem('rahalaty_admin_logged_in') !== 'true') {
        window.location.replace('login');
        return;
    }

    // Bind logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('هل تريد بالتأكيد تسجيل الخروج؟')) {
                sessionStorage.clear();
                window.location.replace('login');
            }
        });
    }

    // Load config values into fields
    loadAppwriteFormConfig();

    // Initialize Database
    try {
        await window.db.init();
    } catch (e) {
        console.error('Failed to initialize database:', e);
    }

    // Check Appwrite Status
    updateAppwriteConnectionStatus();

    // Load tables if connected
    if (window.db.isAppwriteConnected()) {
        try {
            await loadOverviewStats();
            await loadBookingsTable();
            await loadSurveysTable();
            await loadSubscribersTable();
            await loadTestimonialsTable();
        } catch (err) {
            console.error('Failed to load admin dashboard tables:', err);
            alert('حدث خطأ أثناء تحميل البيانات من Appwrite. يرجى التأكد من صحة الجداول والصلاحيات.');
        }
    } else {
        alert('يرجى تهيئة إعدادات الاتصال بـ Appwrite في التبويب الخاص بها للتمكن من إدارة الموقع.');
    }

    // Handle Appwrite Form submit
    const confForm = document.getElementById('appwriteConfigForm');
    if (confForm) {
        confForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const endpoint = document.getElementById('appwriteEndpoint').value.trim();
            const projectId = document.getElementById('appwriteProjectId').value.trim();
            const databaseId = document.getElementById('appwriteDatabaseId').value.trim();

            // Save settings locally
            localStorage.setItem('rahalaty_appwrite_endpoint', endpoint);
            localStorage.setItem('rahalaty_appwrite_project_id', projectId);
            localStorage.setItem('rahalaty_appwrite_database_id', databaseId);

            alert('تم حفظ إعدادات الاتصال بنجاح. جاري إعادة تحميل الصفحة لتطبيق التغييرات...');
            window.location.reload();
        });
    }
});

function loadAppwriteFormConfig() {
    const conf = window.CONFIG.appwrite;
    
    const endpointInput = document.getElementById('appwriteEndpoint');
    const projectInput = document.getElementById('appwriteProjectId');
    const dbInput = document.getElementById('appwriteDatabaseId');

    const storedEndpoint = localStorage.getItem('rahalaty_appwrite_endpoint');
    const storedProjectId = localStorage.getItem('rahalaty_appwrite_project_id');
    const storedDatabaseId = localStorage.getItem('rahalaty_appwrite_database_id');

    if (storedEndpoint) conf.endpoint = storedEndpoint;
    if (storedProjectId) conf.projectId = storedProjectId;
    if (storedDatabaseId) conf.databaseId = storedDatabaseId;

    if (endpointInput) endpointInput.value = conf.endpoint;
    if (projectInput) projectInput.value = conf.projectId || '';
    if (dbInput) dbInput.value = conf.databaseId;
}

function updateAppwriteConnectionStatus() {
    const statusBadge = document.getElementById('statsAppwriteStatus');
    if (!statusBadge) return;

    const connected = window.db.isAppwriteConnected();
    if (connected) {
        statusBadge.innerHTML = '<span class="badge bg-success">متصل بـ Appwrite</span>';
    } else {
        statusBadge.innerHTML = '<span class="badge bg-danger">غير متصل بـ Appwrite</span>';
    }
}

async function loadOverviewStats() {
    const bookings = await window.db.getBookings();
    const subs = await window.db.getSubscribers();
    const reviews = await window.db.getTestimonials(false);

    document.getElementById('statsBookingsCount').textContent = bookings.length;
    document.getElementById('statsSubscribersCount').textContent = subs.length;
    document.getElementById('statsTestimonialsCount').textContent = reviews.length;

    // Exchange rates
    const settings = await window.db.getSettings();
    document.getElementById('rateEGP').value = settings.exchangeRateEGP || 50.0;
    document.getElementById('rateEUR').value = settings.exchangeRateEUR || 0.92;
    document.getElementById('rateSAR').value = settings.exchangeRateSAR || 3.75;
    document.getElementById('rateAED').value = settings.exchangeRateAED || 3.67;
}

window.saveAdminSettings = async function() {
    const egp = parseFloat(document.getElementById('rateEGP').value);
    const eur = parseFloat(document.getElementById('rateEUR').value);
    const sar = parseFloat(document.getElementById('rateSAR').value);
    const aed = parseFloat(document.getElementById('rateAED').value);

    try {
        await window.db.updateSettings('exchangeRateEGP', egp);
        await window.db.updateSettings('exchangeRateEUR', eur);
        await window.db.updateSettings('exchangeRateSAR', sar);
        await window.db.updateSettings('exchangeRateAED', aed);
        alert('تم حفظ أسعار الصرف بنجاح وتحديث أسعار التذاكر.');
    } catch (e) {
        console.error(e);
        alert('فشل حفظ إعدادات أسعار الصرف على Appwrite.');
    }
};

// ─── BOOKINGS TABLE ──────────────────────────────────────────────────
async function loadBookingsTable() {
    const table = document.getElementById('adminBookingsTable');
    if (!table) return;
    table.innerHTML = '';

    const bookings = await window.db.getBookings();
    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">لا توجد حجوزات مسجلة بعد.</td></tr>';
        return;
    }

    bookings.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    bookings.forEach(b => {
        const isCancelled = b.status === 'cancelled';
        const cancelBtn = isCancelled
            ? `<span class="badge bg-secondary">ملغى</span>`
            : `<button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${b.$id}')">إلغاء</button>`;
        const statusBadge = isCancelled
            ? `<span class="badge bg-danger">ملغى</span>`
            : `<span class="badge bg-success">مؤكد</span>`;

        table.innerHTML += `
            <tr>
                <td class="fw-bold text-secondary">${b.reference}</td>
                <td>
                    <div class="fw-bold">${b.name}</div>
                    <div class="small text-muted" dir="ltr">${b.phone} | ${b.email}</div>
                </td>
                <td class="fw-semibold">${b.trip_title}</td>
                <td>${b.travel_date}</td>
                <td>${b.adults} ب / ${b.children} ط</td>
                <td class="fw-bold text-warning">$${b.total_price}</td>
                <td>${statusBadge}</td>
                <td>${cancelBtn}</td>
            </tr>
        `;
    });
}

window.cancelBooking = async function(id) {
    if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
        try {
            await window.db.cancelBooking(id);
            await loadBookingsTable();
            await loadOverviewStats();
            alert('تم إلغاء الحجز بنجاح.');
        } catch (err) {
            console.error(err);
            alert('فشل إلغاء الحجز على Appwrite.');
        }
    }
};

// ─── SURVEY RESPONSES TABLE ──────────────────────────────────────────
async function loadSurveysTable() {
    const table = document.getElementById('adminSurveysTable');
    if (!table) return;
    table.innerHTML = '';

    try {
        const surveys = await window.db.getSurveys();
        renderSurveys(surveys);
    } catch (e) {
        console.error(e);
        table.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">فشل تحميل استجابات الاستبيانات.</td></tr>';
    }
}

function renderSurveys(list) {
    const table = document.getElementById('adminSurveysTable');
    if (list.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">لا توجد استجابات استبيان بعد.</td></tr>';
        return;
    }
    
    list.sort((a,b) => new Date(b.$createdAt || b.created_at) - new Date(a.$createdAt || a.created_at));

    list.forEach(s => {
        const dateStr = s.$createdAt || s.created_at;
        table.innerHTML += `
            <tr>
                <td>
                    <div class="fw-bold">${s.name}</div>
                    <div class="small text-muted" dir="ltr">${s.phone || ''} | ${s.email}</div>
                </td>
                <td class="text-capitalize">${s.travel_type}</td>
                <td class="text-capitalize">${s.budget}</td>
                <td class="text-capitalize">${s.preferred_climate || s.climate || ''}</td>
                <td class="text-capitalize">${s.duration_preference || s.duration || ''}</td>
                <td>${dateStr ? dateStr.slice(0, 10) : '-'}</td>
            </tr>
        `;
    });
}

// ─── SUBSCRIBERS TABLE ───────────────────────────────────────────────
async function loadSubscribersTable() {
    const table = document.getElementById('adminSubscribersTable');
    if (!table) return;
    table.innerHTML = '';

    try {
        const subs = await window.db.getSubscribers();
        renderSubscribers(subs);
    } catch (e) {
        console.error(e);
        table.innerHTML = '<tr><td colspan="3" class="text-center text-danger py-4">فشل تحميل قائمة المشتركين.</td></tr>';
    }
}

function renderSubscribers(list) {
    const table = document.getElementById('adminSubscribersTable');
    if (list.length === 0) {
        table.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">لا يوجد مشتركين مسجلين بالقائمة.</td></tr>';
        return;
    }

    list.sort((a,b) => new Date(b.$createdAt || b.created_at) - new Date(a.$createdAt || a.created_at));

    list.forEach((s, idx) => {
        const dateStr = s.$createdAt || s.created_at;
        table.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td class="fw-bold">${s.email}</td>
                <td>${dateStr ? dateStr.slice(0, 19).replace('T', ' ') : '-'}</td>
            </tr>
        `;
    });
}

window.exportSubscribersCSV = async function() {
    try {
        const list = await window.db.getSubscribers();
        if (list.length === 0) {
            alert('لا توجد بيانات لتصديرها.');
            return;
        }

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Email,Subscribed At\n';

        list.forEach(s => {
            const dateStr = s.$createdAt || s.created_at || '';
            csvContent += `"${s.email}","${dateStr}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'subscribers_list.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error(e);
        alert('حدث خطأ أثناء تصدير المشتركين.');
    }
};

// ─── TESTIMONIALS / REVIEWS TABLE ────────────────────────────────────
async function loadTestimonialsTable() {
    const table = document.getElementById('adminTestimonialsTable');
    if (!table) return;
    table.innerHTML = '';

    try {
        const list = await window.db.getTestimonials(false); // get all testimonials for admin
        if (list.length === 0) {
            table.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">لا توجد تقييمات معروضة حالياً.</td></tr>';
            return;
        }

        list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

        list.forEach(t => {
            const toggleBtn = t.is_active 
                ? `<button class="btn btn-sm btn-outline-secondary" onclick="toggleReviewActive('${t.$id}', false)">إخفاء التقييم</button>`
                : `<button class="btn btn-sm btn-outline-success" onclick="toggleReviewActive('${t.$id}', true)">إظهار التقييم</button>`;
            const badge = t.is_active 
                ? `<span class="badge bg-success">نشط</span>` 
                : `<span class="badge bg-secondary">مخفي</span>`;

            table.innerHTML += `
                <tr>
                    <td class="fw-bold">${t.name}</td>
                    <td class="small text-muted">${t.reference || '-'}</td>
                    <td><span class="text-warning">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</span></td>
                    <td><p class="small text-secondary mb-0 text-wrap" style="max-width:300px;">"${t.review}"</p></td>
                    <td>${badge}</td>
                    <td>${toggleBtn}</td>
                </tr>
            `;
        });
    } catch (e) {
        console.error(e);
        table.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">فشل تحميل التقييمات.</td></tr>';
    }
}

window.toggleReviewActive = async function(id, status) {
    try {
        await window.db.toggleTestimonialActive(id, status);
        await loadTestimonialsTable();
        await loadOverviewStats();
        alert(status ? 'تم تفعيل التقييم وعرضه.' : 'تم إخفاء التقييم بنجاح.');
    } catch (e) {
        console.error(e);
        alert('فشل تحديث حالة التقييم على Appwrite.');
    }
};

// ─── SEED APPWRITE DATABASE ──────────────────────────────────────────
window.seedAppwriteDatabase = async function() {
    if (!window.db.isAppwriteConnected()) {
        alert('يرجى الاتصال وإدخال معرف مشروع Appwrite صالح أولاً!');
        return;
    }

    const seedBtn = document.getElementById('seedDbBtn');
    seedBtn.disabled = true;
    seedBtn.textContent = 'جاري رفع البيانات...';

    const conf = window.CONFIG.appwrite;
    const dbId = conf.databaseId;

    try {
        // 1. Upload Destinations
        const dests = window.db.staticDestinations;
        for (const d of dests) {
            // Check if document already exists by querying custom attributes
            const list = await window.db.databases.listDocuments(dbId, conf.collections.destinations);
            const exists = list.documents.some(doc => parseInt(doc.id) === parseInt(d.id));
            if (!exists) {
                const payload = { ...d };
                delete payload.id; // Appwrite custom key mapping
                payload.id = parseInt(d.id);

                await window.db.databases.createDocument(dbId, conf.collections.destinations, Appwrite.ID.unique(), payload);
            }
        }

        // 2. Upload Trips
        const trips = window.db.staticTrips;
        for (const t of trips) {
            const list = await window.db.databases.listDocuments(dbId, conf.collections.trips);
            const exists = list.documents.some(doc => parseInt(doc.id) === parseInt(t.id));
            if (!exists) {
                const payload = { ...t };
                delete payload.id;
                payload.id = parseInt(t.id);
                if (t.destination_id) payload.destination_id = parseInt(t.destination_id);

                await window.db.databases.createDocument(dbId, conf.collections.trips, Appwrite.ID.unique(), payload);
            }
        }

        alert('تم تهيئة قاعدة البيانات ورفع جميع الوجهات (6) والرحلات (16) إلى مشروع Appwrite الخاص بك بنجاح!');
    } catch (err) {
        console.error(err);
        alert(`عذراً، حدث خطأ أثناء الرفع: \n${err.message}\nيرجى التأكد من إنشاء الخصائص (Attributes) بالمسميات الصحيحة وتعيين صلاحيات الكتابة!`);
    } finally {
        seedBtn.disabled = false;
        seedBtn.textContent = 'تهيئة قاعدة البيانات (Seed Data)';
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DESTINATIONS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

window.loadDestinationsTable = async function () {
    const tbody = document.getElementById('adminDestinationsTable');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-warning me-2"></div>جاري التحميل...</td></tr>`;

    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        const res = await databases.listDocuments(conf.databaseId, conf.collections.destinations);
        const docs = res.documents;

        if (!docs.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted"><i class="fa-solid fa-map-location-dot fa-2x mb-2 d-block opacity-25"></i>لا توجد وجهات بعد. أضف أول وجهة!</td></tr>`;
            return;
        }

        tbody.innerHTML = docs.map((d, i) => `
            <tr>
                <td class="fw-bold text-muted">${i + 1}</td>
                <td class="fs-4">${d.flag || '—'}</td>
                <td class="fw-semibold">${d.name_ar || '—'}</td>
                <td class="text-muted small">${d.name_en || '—'}</td>
                <td class="text-muted small">${d.slug || '—'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteDestination('${d.$id}')">
                        <i class="fa-solid fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Destinations load error:', err);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">خطأ في التحميل: ${err.message}</td></tr>`;
    }
};

window.deleteDestination = async function (docId) {
    if (!confirm('هل تريد حذف هذه الوجهة؟ لا يمكن التراجع!')) return;
    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        await databases.deleteDocument(conf.databaseId, conf.collections.destinations, docId);
        await window.loadDestinationsTable();
        await window.loadDestinationsDropdown();
    } catch (err) {
        alert('خطأ في الحذف: ' + err.message);
    }
};

window.loadDestinationsDropdown = async function () {
    const select = document.getElementById('trip_destination_id');
    if (!select) return;
    
    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        const res = await databases.listDocuments(conf.databaseId, conf.collections.destinations);
        const docs = res.documents;
        
        if (!docs.length) {
            select.innerHTML = '<option value="">لا توجد دول مضافة بعد. أضف دولة أولاً!</option>';
            return;
        }
        
        select.innerHTML = '<option value="">اختر الدولة...</option>' + 
            docs.map(d => `<option value="${d.$id}">${d.flag || ''} ${d.name_ar} (${d.name_en})</option>`).join('');
    } catch (err) {
        console.error('Error loading destinations dropdown:', err);
        select.innerHTML = '<option value="">فشل تحميل الدول</option>';
    }
};

// Wire forms
document.addEventListener('DOMContentLoaded', () => {
    // 1. Add Destination Form
    const destForm = document.getElementById('addDestinationForm');
    if (destForm) {
        destForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveDestBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>جاري الحفظ...';

            try {
                const conf = window.CONFIG.appwrite;
                const { Client, Databases, ID } = Appwrite;
                const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
                const databases = new Databases(client);

                const payload = {
                    name_ar: document.getElementById('dest_name_ar').value.trim(),
                    name_en: document.getElementById('dest_name_en').value.trim(),
                    slug: document.getElementById('dest_slug').value.trim(),
                    flag: document.getElementById('dest_flag').value.trim()
                };

                await databases.createDocument(conf.databaseId, conf.collections.destinations, ID.unique(), payload);

                bootstrap.Modal.getInstance(document.getElementById('addDestinationModal')).hide();
                destForm.reset();
                await window.loadDestinationsTable();
                await window.loadDestinationsDropdown();
                await window.loadOverviewStats();

            } catch (err) {
                alert('خطأ في الحفظ: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الوجهة';
            }
        });
    }

    // 2. Add Trip Form
    const tripForm = document.getElementById('addTripForm');
    if (tripForm) {
        tripForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveTripBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>جاري الحفظ...';

            try {
                const conf = window.CONFIG.appwrite;
                const { Client, Databases, ID } = Appwrite;
                const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
                const databases = new Databases(client);

                const splitByLine = (id) => {
                    const el = document.getElementById(id);
                    const val = el ? el.value.trim() : '';
                    return val ? val.split('\n').map(s => s.trim()).filter(Boolean) : [];
                };
                const splitByComma = (id) => {
                    const el = document.getElementById(id);
                    const val = el ? el.value.trim() : '';
                    return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
                };

                const payload = {
                    destination_id: document.getElementById('trip_destination_id').value,
                    title_ar: document.getElementById('trip_title_ar').value.trim(),
                    title_en: document.getElementById('trip_title_en').value.trim(),
                    desc_ar: document.getElementById('trip_desc_ar').value.trim(),
                    desc_en: document.getElementById('trip_desc_en').value.trim(),
                    price: parseFloat(document.getElementById('trip_price').value) || 0,
                    currency: document.getElementById('trip_currency').value.trim() || '$',
                    duration: document.getElementById('trip_duration').value.trim(),
                    category: document.getElementById('trip_category').value,
                    climate: document.getElementById('trip_climate').value,
                    travel_type: splitByComma('trip_travel_type'),
                    budget_tier: document.getElementById('trip_budget_tier').value,
                    is_egyptian: document.getElementById('trip_is_egyptian').value === 'true',
                    is_active: document.getElementById('trip_is_active').value === 'true',
                    spots_total: parseInt(document.getElementById('trip_spots_total').value) || 20,
                    spots_left: parseInt(document.getElementById('trip_spots_left').value) || 20,
                    departure_dates: splitByComma('trip_departure_dates'),
                    sort_order: parseInt(document.getElementById('trip_sort_order').value) || 0,
                    color_from: document.getElementById('trip_color_from').value.trim(),
                    color_to: document.getElementById('trip_color_to').value.trim(),
                    image_url: document.getElementById('trip_image_url').value.trim(),
                    
                    highlights_ar: splitByLine('trip_highlights_ar'),
                    highlights_en: splitByLine('trip_highlights_en'),
                    included_ar: splitByLine('trip_included_ar'),
                    included_en: splitByLine('trip_included_en'),
                    excluded_ar: splitByLine('trip_excluded_ar'),
                    excluded_en: splitByLine('trip_excluded_en'),
                    itinerary_ar: splitByLine('trip_itinerary_ar'),
                    itinerary_en: splitByLine('trip_itinerary_en'),
                    
                    meta_title_ar: document.getElementById('trip_meta_title_ar').value.trim(),
                    meta_title_en: document.getElementById('trip_meta_title_en').value.trim(),
                    meta_desc_ar: document.getElementById('trip_meta_desc_ar').value.trim(),
                    meta_desc_en: document.getElementById('trip_meta_desc_en').value.trim(),
                    meta_keywords_ar: document.getElementById('trip_meta_keywords_ar').value.trim(),
                    meta_keywords_en: document.getElementById('trip_meta_keywords_en').value.trim()
                };

                await databases.createDocument(conf.databaseId, conf.collections.trips, ID.unique(), payload);

                bootstrap.Modal.getInstance(document.getElementById('addTripModal')).hide();
                tripForm.reset();
                // Reset tab back to basic
                const basicTab = document.querySelector('#trip-basic-tab');
                if (basicTab) {
                    const tabInst = bootstrap.Tab.getInstance(basicTab) || new bootstrap.Tab(basicTab);
                    tabInst.show();
                }
                
                await window.loadTripsTable();
                await window.loadOverviewStats();

            } catch (err) {
                alert('خطأ في الحفظ: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الرحلة';
            }
        });
    }

    // Load initial dropdowns
    window.loadDestinationsDropdown();

    // Wire shown.bs.tab events for lazy loading
    const destTabBtn = document.getElementById('destinations-tab');
    if (destTabBtn) {
        destTabBtn.addEventListener('shown.bs.tab', () => window.loadDestinationsTable());
    }
    const tripsTabBtn = document.getElementById('trips-tab');
    if (tripsTabBtn) {
        tripsTabBtn.addEventListener('shown.bs.tab', () => {
            window.loadTripsTable();
            window.loadDestinationsDropdown();
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// TRIPS TABLE & DELETE
// ─────────────────────────────────────────────────────────────────────────────

window.loadTripsTable = async function () {
    const tbody = document.getElementById('adminTripsTable');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-warning me-2"></div>جاري التحميل...</td></tr>`;

    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        
        // Fetch both trips and destinations
        const [tripsRes, destsRes] = await Promise.all([
            databases.listDocuments(conf.databaseId, conf.collections.trips),
            databases.listDocuments(conf.databaseId, conf.collections.destinations)
        ]);
        
        const trips = tripsRes.documents;
        const dests = destsRes.documents;

        if (!trips.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted"><i class="fa-solid fa-plane fa-2x mb-2 d-block opacity-25"></i>لا توجد رحلات بعد. أضف أول رحلة!</td></tr>`;
            return;
        }

        tbody.innerHTML = trips.map(t => {
            const dest = dests.find(d => String(d.$id) === String(t.destination_id) || String(d.id) === String(t.destination_id));
            const countryDisplay = dest ? `${dest.flag || ''} ${dest.name_ar}` : '<span class="text-muted">غير محدد</span>';
            const imgUrl = t.image_url || t.image;
            
            return `
                <tr>
                    <td>
                        ${imgUrl ? `<img src="${imgUrl}" style="width:70px;height:50px;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'">` : '<span class="text-muted">—</span>'}
                    </td>
                    <td>
                        <div class="fw-semibold">${t.title_ar || '—'}</div>
                        <div class="text-muted small">${t.title_en || ''}</div>
                    </td>
                    <td>${countryDisplay}</td>
                    <td class="fw-bold text-success">$${t.price || '—'}</td>
                    <td>${t.duration || '—'}</td>
                    <td>
                        <span class="badge ${(t.spots_left || 0) > 0 ? 'bg-success' : 'bg-danger'}">
                            ${t.spots_left || 0} / ${t.spots_total || 0}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteTrip('${t.$id}')">
                            <i class="fa-solid fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Trips load error:', err);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">خطأ في التحميل: ${err.message}</td></tr>`;
    }
};

window.deleteTrip = async function (docId) {
    if (!confirm('هل تريد حذف هذه الرحلة؟ لا يمكن التراجع!')) return;
    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        await databases.deleteDocument(conf.databaseId, conf.collections.trips, docId);
        await window.loadTripsTable();
        await window.loadOverviewStats();
    } catch (err) {
        alert('خطأ في الحذف: ' + err.message);
    }
};
