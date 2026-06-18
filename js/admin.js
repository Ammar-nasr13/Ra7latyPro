// Rahalaty Admin Dashboard Panel JavaScript Logic

document.addEventListener('DOMContentLoaded', async () => {
    // Load config values into fields
    loadAppwriteFormConfig();

    // Check Appwrite Status
    updateAppwriteConnectionStatus();

    // Load tables
    await loadOverviewStats();
    await loadBookingsTable();
    await loadSurveysTable();
    await loadSubscribersTable();
    await loadTestimonialsTable();

    // Handle Appwrite Form submit
    const confForm = document.getElementById('appwriteConfigForm');
    if (confForm) {
        confForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const endpoint = document.getElementById('appwriteEndpoint').value.trim();
            const projectId = document.getElementById('appwriteProjectId').value.trim();
            const databaseId = document.getElementById('appwriteDatabaseId').value.trim();

            // Save settings locally
            await window.db.updateSettings('appwriteEndpoint', endpoint);
            await window.db.updateSettings('appwriteProjectId', projectId);
            await window.db.updateSettings('appwriteDatabaseId', databaseId);

            // Update configuration live
            window.CONFIG.appwrite.endpoint = endpoint;
            window.CONFIG.appwrite.projectId = projectId;
            window.CONFIG.appwrite.databaseId = databaseId;

            // Re-initialize database
            await window.db.init();

            // Refresh UI
            updateAppwriteConnectionStatus();
            alert('تم حفظ إعدادات الاتصال بنجاح. جاري محاولة إعادة الاتصال...');
            window.location.reload();
        });
    }
});

function loadAppwriteFormConfig() {
    const conf = window.CONFIG.appwrite;
    
    // Check if we have overrides in settings
    const endpointInput = document.getElementById('appwriteEndpoint');
    const projectInput = document.getElementById('appwriteProjectId');
    const dbInput = document.getElementById('appwriteDatabaseId');

    // Get settings
    const settings = JSON.parse(localStorage.getItem('rahalaty_settings')) || {};
    if (settings.appwriteEndpoint) conf.endpoint = settings.appwriteEndpoint;
    if (settings.appwriteProjectId) conf.projectId = settings.appwriteProjectId;
    if (settings.appwriteDatabaseId) conf.databaseId = settings.appwriteDatabaseId;

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
        statusBadge.innerHTML = '<span class="badge bg-danger">تخزين محلي (Fallback)</span>';
    }
}

async function loadOverviewStats() {
    const bookings = await window.db.getBookings();
    const subs = JSON.parse(localStorage.getItem('rahalaty_subscribers')) || [];
    const reviews = await window.db.getTestimonials();

    document.getElementById('statsBookingsCount').textContent = bookings.length;
    document.getElementById('statsSubscribersCount').textContent = subs.length;
    document.getElementById('statsTestimonialsCount').textContent = reviews.length;

    // Converted rates
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

    await window.db.updateSettings('exchangeRateEGP', egp);
    await window.db.updateSettings('exchangeRateEUR', eur);
    await window.db.updateSettings('exchangeRateSAR', sar);
    await window.db.updateSettings('exchangeRateAED', aed);

    alert('تم حفظ أسعار الصرف بنجاح وتحديث أسعار التذاكر.');
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

    // Sort by created_at desc
    bookings.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    bookings.forEach(b => {
        const isCancelled = b.status === 'cancelled';
        const cancelBtn = isCancelled
            ? `<span class="badge bg-secondary">ملغى</span>`
            : `<button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${b.$id || b.id}')">إلغاء</button>`;
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
        let bookings = JSON.parse(localStorage.getItem('rahalaty_bookings')) || [];
        const record = bookings.find(b => String(b.id) === String(id));
        if (record) {
            record.status = 'cancelled';
            localStorage.setItem('rahalaty_bookings', JSON.stringify(bookings));
        }

        if (window.db.isAppwriteConnected()) {
            try {
                const conf = window.CONFIG.appwrite;
                // Query booking first to get appwrite doc ID
                const bookingDoc = await window.db.databases.getDocument(conf.databaseId, conf.collections.bookings, id);
                if (bookingDoc) {
                    await window.db.databases.updateDocument(conf.databaseId, conf.collections.bookings, id, { status: 'cancelled' });
                }
            } catch (err) {
                console.error(err);
            }
        }

        await loadBookingsTable();
        await loadOverviewStats();
    }
};

// ─── SURVEY RESPONSES TABLE ──────────────────────────────────────────
async function loadSurveysTable() {
    const table = document.getElementById('adminSurveysTable');
    if (!table) return;
    table.innerHTML = '';

    // Load from local storage for surveys
    if (window.db.isAppwriteConnected()) {
        try {
            const conf = window.CONFIG.appwrite;
            const res = await window.db.databases.listDocuments(conf.databaseId, conf.collections.surveys);
            renderSurveys(res.documents);
            return;
        } catch (e) {
            console.error(e);
        }
    }

    const surveys = JSON.parse(localStorage.getItem('rahalaty_surveys')) || [];
    renderSurveys(surveys);
}

function renderSurveys(list) {
    const table = document.getElementById('adminSurveysTable');
    if (list.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">لا توجد استجابات استبيان بعد.</td></tr>';
        return;
    }
    
    // Sort descending
    list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    list.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>
                    <div class="fw-bold">${s.name}</div>
                    <div class="small text-muted" dir="ltr">${s.phone || ''} | ${s.email}</div>
                </td>
                <td class="text-capitalize">${s.travel_type}</td>
                <td class="text-capitalize">${s.budget}</td>
                <td class="text-capitalize">${s.preferred_climate || s.climate}</td>
                <td class="text-capitalize">${s.duration_preference || s.duration}</td>
                <td><p class="small text-secondary mb-0 text-wrap" style="max-width:250px;">${s.message || '-'}</p></td>
                <td>${s.created_at ? s.created_at.slice(0, 10) : '-'}</td>
            </tr>
        `;
    });
}

// ─── SUBSCRIBERS TABLE ───────────────────────────────────────────────
async function loadSubscribersTable() {
    const table = document.getElementById('adminSubscribersTable');
    if (!table) return;
    table.innerHTML = '';

    // Appwrite
    if (window.db.isAppwriteConnected()) {
        try {
            const conf = window.CONFIG.appwrite;
            const res = await window.db.databases.listDocuments(conf.databaseId, conf.collections.subscribers);
            renderSubscribers(res.documents);
            return;
        } catch (e) {
            console.error(e);
        }
    }

    const subs = JSON.parse(localStorage.getItem('rahalaty_subscribers')) || [];
    renderSubscribers(subs);
}

function renderSubscribers(list) {
    const table = document.getElementById('adminSubscribersTable');
    if (list.length === 0) {
        table.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">لا يوجد مشتركين مسجلين بالقائمة.</td></tr>';
        return;
    }

    list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    list.forEach((s, idx) => {
        table.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td class="fw-bold">${s.email}</td>
                <td>${s.created_at ? s.created_at.slice(0, 19).replace('T', ' ') : '-'}</td>
            </tr>
        `;
    });
}

window.exportSubscribersCSV = function() {
    const list = JSON.parse(localStorage.getItem('rahalaty_subscribers')) || [];
    if (list.length === 0) {
        alert('لا توجد بيانات لتصديرها.');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Email,Subscribed At\n';

    list.forEach(s => {
        csvContent += `"${s.email}","${s.created_at}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscribers_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ─── TESTIMONIALS / REVIEWS TABLE ────────────────────────────────────
async function loadTestimonialsTable() {
    const table = document.getElementById('adminTestimonialsTable');
    if (!table) return;
    table.innerHTML = '';

    const list = await window.db.getTestimonials();
    if (list.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">لا توجد تقييمات معروضة حالياً.</td></tr>';
        return;
    }

    list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    list.forEach(t => {
        const toggleBtn = t.is_active 
            ? `<button class="btn btn-sm btn-outline-secondary" onclick="toggleReviewActive('${t.$id || t.id}', false)">إخفاء التقييم</button>`
            : `<button class="btn btn-sm btn-outline-success" onclick="toggleReviewActive('${t.$id || t.id}', true)">إظهار التقييم</button>`;
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
}

window.toggleReviewActive = async function(id, status) {
    let list = JSON.parse(localStorage.getItem('rahalaty_testimonials')) || [];
    const record = list.find(t => String(t.id) === String(id));
    if (record) {
        record.is_active = status;
        localStorage.setItem('rahalaty_testimonials', JSON.stringify(list));
    }

    if (window.db.isAppwriteConnected()) {
        try {
            const conf = window.CONFIG.appwrite;
            await window.db.databases.updateDocument(conf.databaseId, conf.collections.testimonials, id, { is_active: status });
        } catch (e) {
            console.error(e);
        }
    }

    await loadTestimonialsTable();
    await loadOverviewStats();
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
        const dests = JSON.parse(localStorage.getItem('rahalaty_destinations')) || [];
        for (const d of dests) {
            // Check if document already exists
            const list = await window.db.databases.listDocuments(dbId, conf.collections.destinations);
            const exists = list.documents.some(doc => parseInt(doc.id) === parseInt(d.id));
            if (!exists) {
                // Remove local ID auto increments to prevent Appwrite crash
                const payload = { ...d };
                delete payload.$id;
                delete payload.$collectionId;
                delete payload.$databaseId;
                delete payload.$permissions;

                await window.db.databases.createDocument(dbId, conf.collections.destinations, Appwrite.ID.unique(), payload);
            }
        }

        // 2. Upload Trips
        const trips = JSON.parse(localStorage.getItem('rahalaty_trips')) || [];
        for (const t of trips) {
            const list = await window.db.databases.listDocuments(dbId, conf.collections.trips);
            const exists = list.documents.some(doc => parseInt(doc.id) === parseInt(t.id));
            if (!exists) {
                const payload = { ...t };
                delete payload.$id;
                delete payload.$collectionId;
                delete payload.$databaseId;
                delete payload.$permissions;
                
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
