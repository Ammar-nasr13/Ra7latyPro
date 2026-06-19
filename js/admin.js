// Rahalaty Admin Dashboard Panel JavaScript Logic

document.addEventListener('DOMContentLoaded', async () => {
    // Check session safety
    if (sessionStorage.getItem('rahalaty_admin_logged_in') !== 'true') {
        window.location.replace('login.html');
        return;
    }

    // Bind logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('هل تريد بالتأكيد تسجيل الخروج؟')) {
                sessionStorage.clear();
                window.location.replace('login.html');
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
            const bucketId = document.getElementById('appwriteBucketId').value.trim();

            // Save settings locally
            localStorage.setItem('rahalaty_appwrite_endpoint', endpoint);
            localStorage.setItem('rahalaty_appwrite_project_id', projectId);
            localStorage.setItem('rahalaty_appwrite_database_id', databaseId);
            localStorage.setItem('rahalaty_appwrite_bucket_id', bucketId);

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
    const bucketInput = document.getElementById('appwriteBucketId');

    const storedEndpoint = localStorage.getItem('rahalaty_appwrite_endpoint');
    const storedProjectId = localStorage.getItem('rahalaty_appwrite_project_id');
    const storedDatabaseId = localStorage.getItem('rahalaty_appwrite_database_id');
    const storedBucketId = localStorage.getItem('rahalaty_appwrite_bucket_id');

    if (storedEndpoint) conf.endpoint = storedEndpoint;
    if (storedProjectId) conf.projectId = storedProjectId;
    if (storedDatabaseId) conf.databaseId = storedDatabaseId;
    if (storedBucketId) conf.bucketId = storedBucketId;

    if (endpointInput) endpointInput.value = conf.endpoint;
    if (projectInput) projectInput.value = conf.projectId || '';
    if (dbInput) dbInput.value = conf.databaseId;
    if (bucketInput) bucketInput.value = conf.bucketId || '';
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
        
        // Map raw values to detailed Arabic text for clarity
        const travelTypeMap = {
            family: 'مع العائلة 👨‍👩‍👧‍👦',
            couple: 'مع الشريك 💑',
            solo: 'منفرداً 👤',
            friends: 'مع الأصدقاء 👥'
        };
        const budgetMap = {
            low: 'اقتصادي (أقل من 500$)',
            medium: 'متوسط (من 500$ إلى 1500$)',
            high: 'مرتفع (من 1500$ إلى 3000$)',
            luxury: 'فاخر (أكثر من 3000$)'
        };
        const climateMap = {
            beach: 'شاطئ وبحر 🏖️',
            desert: 'صحراء وتاريخ 🏜️',
            mountain: 'جبال وطبيعة 🏔️',
            city: 'مدن ومعالم 🏙️'
        };
        const durationMap = {
            weekend: 'عطلة نهاية الأسبوع (2-3 أيام)',
            week: 'أسبوع (4-7 أيام)',
            twoweeks: 'أسبوعين (8-14 يوم)',
            month: 'شهر أو أكثر 📅'
        };

        const tType = travelTypeMap[s.travel_type] || s.travel_type || '-';
        const bgt = budgetMap[s.budget] || s.budget || '-';
        const clm = climateMap[s.preferred_climate || s.climate] || s.preferred_climate || s.climate || '-';
        const dur = durationMap[s.duration_preference || s.duration] || s.duration_preference || s.duration || '-';

        table.innerHTML += `
            <tr>
                <td>
                    <div class="fw-bold" style="color: #0D2137; font-size: 0.95rem;">${s.name}</div>
                    <div class="small text-muted mb-1" dir="ltr">${s.phone || ''} | ${s.email}</div>
                    ${s.message ? `
                        <div class="mt-1 p-2 rounded bg-light border-start border-warning border-3 small text-secondary" style="font-style: italic; max-width: 320px; font-size: 0.82rem;">
                            <strong>ملاحظات العميل:</strong> "${s.message}"
                        </div>
                    ` : ''}
                </td>
                <td class="small fw-bold text-dark">${tType}</td>
                <td class="small fw-bold text-dark">${bgt}</td>
                <td class="small fw-bold text-dark">${clm}</td>
                <td class="small fw-bold text-dark">${dur}</td>
                <td class="small text-muted">${dateStr ? dateStr.slice(0, 10) : '-'}</td>
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
        alert('يرجى الاتصال وإدخل معرف مشروع Appwrite صالح أولاً!');
        return;
    }

    const seedBtn = document.getElementById('seedDbBtn');
    seedBtn.disabled = true;
    seedBtn.textContent = 'جاري رفع البيانات...';

    const conf = window.CONFIG.appwrite;
    const dbId = conf.databaseId;

    try {
        const { Query } = Appwrite;

        // 1. Upload Countries
        const countries = window.db.staticCountries;
        const countryIdMap = {};
        for (const c of countries) {
            const list = await window.db.databases.listDocuments(dbId, conf.collections.countries, [
                Query.equal('slug', [c.slug])
            ]);
            let docId;
            if (list.documents.length > 0) {
                docId = list.documents[0].$id;
            } else {
                const payload = {
                    name_ar: c.name_ar,
                    name_en: c.name_en,
                    slug: c.slug,
                    flag: c.flag
                };
                const newDoc = await window.db.databases.createDocument(dbId, conf.collections.countries, Appwrite.ID.unique(), payload);
                docId = newDoc.$id;
            }
            countryIdMap[c.id] = docId;
            countryIdMap[c.slug] = docId;
        }

        // 2. Upload Destinations
        const dests = window.db.staticDestinations;
        const destIdMap = {};

        for (const d of dests) {
            const list = await window.db.databases.listDocuments(dbId, conf.collections.destinations, [
                Query.equal('name_en', [d.name_en])
            ]);
            
            const cSlug = d.country_slug || 'egypt';
            const countryDocId = countryIdMap[cSlug] || '';
            
            let docId;
            if (list.documents.length > 0) {
                const existingDoc = list.documents[0];
                docId = existingDoc.$id;
                const updatePayload = {};
                if (!existingDoc.country_id || existingDoc.country_id !== countryDocId) {
                    updatePayload.country_id = countryDocId;
                }
                if (!existingDoc.image_url && d.image) {
                    updatePayload.image_url = d.image;
                }
                if (Object.keys(updatePayload).length > 0) {
                    await window.db.databases.updateDocument(dbId, conf.collections.destinations, docId, updatePayload);
                }
            } else {
                const payload = {
                    country_id: countryDocId,
                    name_ar: d.name_ar,
                    name_en: d.name_en,
                    description_ar: d.desc_ar,
                    description_en: d.desc_en,
                    category: d.category,
                    is_featured: d.is_featured,
                    sort_order: d.sort_order,
                    image_url: d.image,
                    meta_title_ar: d.name_ar,
                    meta_title_en: d.name_en,
                    meta_desc_ar: d.desc_ar ? d.desc_ar.slice(0, 150) : '',
                    meta_desc_en: d.desc_en ? d.desc_en.slice(0, 150) : '',
                    meta_keywords_ar: d.name_ar,
                    meta_keywords_en: d.name_en
                };
                const newDoc = await window.db.databases.createDocument(dbId, conf.collections.destinations, Appwrite.ID.unique(), payload);
                docId = newDoc.$id;
            }
            destIdMap[d.id] = docId;
        }

        // 3. Upload Trips
        const trips = window.db.staticTrips;
        for (const t of trips) {
            const list = await window.db.databases.listDocuments(dbId, conf.collections.trips, [
                Query.equal('title_en', [t.title_en])
            ]);
            
            const destId = destIdMap[t.destination_id] || '';
            
            if (list.documents.length > 0) {
                const existingDoc = list.documents[0];
                const updatePayload = {};
                if (!existingDoc.destination_id || existingDoc.destination_id !== destId) {
                    updatePayload.destination_id = destId;
                }
                if (!existingDoc.image_url && t.image) {
                    updatePayload.image_url = t.image;
                }
                if (Object.keys(updatePayload).length > 0) {
                    await window.db.databases.updateDocument(dbId, conf.collections.trips, existingDoc.$id, updatePayload);
                }
            } else {
                const payload = {
                    destination_id: destId,
                    title_ar: t.title_ar,
                    title_en: t.title_en,
                    desc_ar: t.desc_ar || '',
                    desc_en: t.desc_en || '',
                    highlights_ar: t.highlights_ar || [],
                    highlights_en: t.highlights_en || [],
                    included_ar: [],
                    included_en: [],
                    excluded_ar: [],
                    excluded_en: [],
                    itinerary_ar: [],
                    itinerary_en: [],
                    price: parseFloat(t.price) || 0,
                    currency: t.currency || '$',
                    duration: String(t.duration) + ' أيام',
                    category: t.category || 'beach',
                    climate: t.climate || 'beach',
                    travel_type: t.travel_type || [],
                    budget_tier: t.budget_tier || 'medium',
                    color_from: t.color_from || '#0099CC',
                    color_to: t.color_to || '#FF6633',
                    is_egyptian: t.is_egyptian || false,
                    spots_total: parseInt(t.spots_total) || 20,
                    spots_left: parseInt(t.spots_left) || 20,
                    departure_dates: t.departure_dates || [],
                    is_active: true,
                    sort_order: parseInt(t.id) || 0,
                    meta_title_ar: t.title_ar,
                    meta_title_en: t.title_en,
                    meta_desc_ar: t.desc_ar ? t.desc_ar.slice(0, 150) : '',
                    meta_desc_en: t.desc_en ? t.desc_en.slice(0, 150) : '',
                    meta_keywords_ar: t.title_ar,
                    meta_keywords_en: t.title_en,
                    image_url: t.image || ''
                };
                
                await window.db.databases.createDocument(dbId, conf.collections.trips, Appwrite.ID.unique(), payload);
            }
        }

        alert('تم تهيئة قاعدة البيانات وربط جميع الدول والوجهات والرحلات الافتراضية بنجاح!');
        if (typeof window.loadCountriesTable === 'function') await window.loadCountriesTable();
        if (typeof window.loadDestinationsTable === 'function') await window.loadDestinationsTable();
        if (typeof window.loadTripsTable === 'function') await window.loadTripsTable();
    } catch (err) {
        console.error(err);
        alert(`عذراً، حدث خطأ أثناء الرفع: \n${err.message}`);
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
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-warning me-2"></div>جاري التحميل...</td></tr>`;

    try {
        const docs = await window.db.getDestinations();

        if (!docs.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted"><i class="fa-solid fa-map-location-dot fa-2x mb-2 d-block opacity-25"></i>لا توجد وجهات بعد. أضف أول وجهة!</td></tr>`;
            return;
        }

        tbody.innerHTML = docs.map((d, i) => `
            <tr>
                <td class="fw-bold text-muted">${i + 1}</td>
                <td>
                    ${d.image ? `<img src="${d.image}" style="width:70px;height:50px;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'">` : '<span class="text-muted">—</span>'}
                </td>
                <td class="fs-4">${d.flag || '—'}</td>
                <td class="fw-semibold">${d.name_ar || '—'}</td>
                <td class="text-muted small">${d.name_en || '—'}</td>
                <td class="text-muted small">${d.slug || '—'}</td>
                <td><span class="badge bg-secondary">${d.category || '—'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary rounded-pill me-1" onclick="editDestination('${d.$id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteDestination('${d.$id}')">
                        <i class="fa-solid fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Destinations load error:', err);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-danger">خطأ في التحميل: ${err.message}</td></tr>`;
    }
};

window.deleteDestination = async function (docId) {
    if (!confirm('هل تريد حذف هذه الوجهة؟ لا يمكن التراجع!')) return;
    try {
        const conf = window.CONFIG.appwrite;
        await window.db.databases.deleteDocument(conf.databaseId, conf.collections.destinations, docId);
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
        const docs = await window.db.getDestinations();
        
        if (!docs.length) {
            select.innerHTML = '<option value="">لا توجد وجهات مضافة بعد. أضف وجهة أولاً!</option>';
            return;
        }
        
        select.innerHTML = '<option value="">اختر الوجهة...</option>' + 
            docs.map(d => `<option value="${d.$id}">${d.flag || ''} ${d.name_ar} (${d.name_en})</option>`).join('');
    } catch (err) {
        console.error('Error loading destinations dropdown:', err);
        select.innerHTML = '<option value="">فشل تحميل الوجهات</option>';
    }
};

// Wire forms
document.addEventListener('DOMContentLoaded', () => {
    // 1. Add/Edit Destination Form
    const destForm = document.getElementById('addDestinationForm');
    if (destForm) {
        destForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveDestBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>جاري الحفظ...';

            try {
                const conf = window.CONFIG.appwrite;
                const nameAr = document.getElementById('dest_name_ar').value.trim();
                const nameEn = document.getElementById('dest_name_en').value.trim();
                const descAr = document.getElementById('dest_description_ar').value.trim();
                const descEn = document.getElementById('dest_description_en').value.trim();
                const countryId = document.getElementById('dest_country_id').value;
                const sortOrder = parseInt(document.getElementById('dest_sort_order').value) || 0;
                const category = document.getElementById('dest_category').value;
                const isFeatured = document.getElementById('dest_is_featured').value === 'true';
                const imageUrl = document.getElementById('dest_image_url').value.trim();

                const payload = {
                    country_id: countryId,
                    name_ar: nameAr,
                    name_en: nameEn,
                    description_ar: descAr,
                    description_en: descEn,
                    category: category,
                    is_featured: isFeatured,
                    sort_order: sortOrder,
                    image_url: imageUrl,
                    meta_title_ar: nameAr,
                    meta_title_en: nameEn,
                    meta_desc_ar: descAr.slice(0, 150),
                    meta_desc_en: descEn.slice(0, 150),
                    meta_keywords_ar: nameAr,
                    meta_keywords_en: nameEn
                };

                const editId = destForm.dataset.editId;
                if (editId) {
                    await window.db.databases.updateDocument(conf.databaseId, conf.collections.destinations, editId, payload);
                } else {
                    await window.db.databases.createDocument(conf.databaseId, conf.collections.destinations, Appwrite.ID.unique(), payload);
                }

                bootstrap.Modal.getInstance(document.getElementById('addDestinationModal')).hide();
                destForm.reset();
                delete destForm.dataset.editId;

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

    // 2. Add/Edit Trip Form
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

                const editId = tripForm.dataset.editId;
                if (editId) {
                    await databases.updateDocument(conf.databaseId, conf.collections.trips, editId, payload);
                } else {
                    await databases.createDocument(conf.databaseId, conf.collections.trips, ID.unique(), payload);
                }

                bootstrap.Modal.getInstance(document.getElementById('addTripModal')).hide();
                tripForm.reset();
                delete tripForm.dataset.editId;

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

    // 3. Add/Edit Country Form
    const countryForm = document.getElementById('countryForm');
    if (countryForm) {
        countryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveCountryBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>جاري الحفظ...';

            try {
                const conf = window.CONFIG.appwrite;
                const nameAr = document.getElementById('country_name_ar').value.trim();
                const nameEn = document.getElementById('country_name_en').value.trim();
                const slug = document.getElementById('country_slug').value.trim();
                const flag = document.getElementById('country_flag').value.trim();

                const payload = {
                    name_ar: nameAr,
                    name_en: nameEn,
                    slug: slug,
                    flag: flag
                };

                const editId = countryForm.dataset.editId;
                if (editId) {
                    await window.db.databases.updateDocument(conf.databaseId, conf.collections.countries, editId, payload);
                } else {
                    await window.db.databases.createDocument(conf.databaseId, conf.collections.countries, Appwrite.ID.unique(), payload);
                }

                bootstrap.Modal.getInstance(document.getElementById('countryModal')).hide();
                countryForm.reset();
                delete countryForm.dataset.editId;

                await window.loadCountriesTable();
                await window.loadCountriesDropdown();
                await window.loadOverviewStats();

            } catch (err) {
                alert('خطأ في الحفظ: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الدولة';
            }
        });
    }

    // Load initial dropdowns
    window.loadDestinationsDropdown();
    window.loadCountriesDropdown();

    // Wire shown.bs.tab events for lazy loading
    const countriesTabBtn = document.getElementById('countries-tab');
    if (countriesTabBtn) {
        countriesTabBtn.addEventListener('shown.bs.tab', () => window.loadCountriesTable());
    }
    const destTabBtn = document.getElementById('destinations-tab');
    if (destTabBtn) {
        destTabBtn.addEventListener('shown.bs.tab', () => {
            window.loadDestinationsTable();
            window.loadCountriesDropdown();
        });
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
        
        // Fetch trips, destinations, and countries
        const [tripsRes, destsRes, countriesRes] = await Promise.all([
            databases.listDocuments(conf.databaseId, conf.collections.trips),
            databases.listDocuments(conf.databaseId, conf.collections.destinations),
            databases.listDocuments(conf.databaseId, conf.collections.countries)
        ]);
        
        const trips = tripsRes.documents;
        const dests = destsRes.documents;
        const countries = countriesRes.documents;

        if (!trips.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted"><i class="fa-solid fa-plane fa-2x mb-2 d-block opacity-25"></i>لا توجد رحلات بعد. أضف أول رحلة!</td></tr>`;
            return;
        }

        tbody.innerHTML = trips.map(t => {
            const dest = dests.find(d => String(d.$id) === String(t.destination_id) || String(d.id) === String(t.destination_id));
            let countryDisplay = '<span class="text-muted">غير محدد</span>';
            if (dest) {
                const country = countries.find(c => String(c.$id) === String(dest.country_id));
                if (country) {
                    countryDisplay = `${country.flag || '🌍'} ${country.name_ar}`;
                } else {
                    countryDisplay = `🌍 ${dest.name_ar}`;
                }
            }
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
                        <button class="btn btn-sm btn-outline-primary rounded-pill me-1" onclick="editTrip('${t.$id}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
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

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRIES CRUD & MODALS
// ─────────────────────────────────────────────────────────────────────────────

window.loadCountriesTable = async function () {
    const tbody = document.getElementById('adminCountriesTable');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><div class="spinner-border spinner-border-sm text-warning me-2"></div>جاري التحميل...</td></tr>`;

    try {
        const docs = await window.db.getCountries();

        if (!docs.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted"><i class="fa-solid fa-earth-americas fa-2x mb-2 d-block opacity-25"></i>لا توجد دول بعد. أضف أول دولة!</td></tr>`;
            return;
        }

        tbody.innerHTML = docs.map((c, i) => `
            <tr>
                <td class="fw-bold text-muted">${i + 1}</td>
                <td class="fs-4">${c.flag || '—'}</td>
                <td class="fw-semibold">${c.name_ar || '—'}</td>
                <td class="text-muted small">${c.name_en || '—'}</td>
                <td class="text-muted small">${c.slug || '—'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary rounded-pill me-1" onclick="editCountry('${c.$id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteCountry('${c.$id}')">
                        <i class="fa-solid fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Countries load error:', err);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">خطأ في التحميل: ${err.message}</td></tr>`;
    }
};

window.loadCountriesDropdown = async function() {
    const select = document.getElementById('dest_country_id');
    if (!select) return;
    try {
        const countries = await window.db.getCountries();
        if (!countries.length) {
            select.innerHTML = '<option value="">لا توجد دول مضافة بعد. أضف دولة أولاً!</option>';
            return;
        }
        select.innerHTML = '<option value="">اختر الدولة...</option>' + 
            countries.map(c => `<option value="${c.$id}">${c.flag || ''} ${c.name_ar} (${c.name_en})</option>`).join('');
    } catch (err) {
        console.error('Error loading countries dropdown:', err);
        select.innerHTML = '<option value="">فشل تحميل الدول</option>';
    }
};

window.showAddCountryModal = function() {
    const form = document.getElementById('countryForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    document.getElementById('countryModalTitle').innerHTML = '<i class="fa-solid fa-earth-americas me-2 text-warning"></i>إضافة دولة جديدة';
    document.getElementById('saveCountryBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الدولة';
    new bootstrap.Modal(document.getElementById('countryModal')).show();
};

window.editCountry = async function(id) {
    try {
        const conf = window.CONFIG.appwrite;
        const doc = await window.db.databases.getDocument(conf.databaseId, conf.collections.countries, id);
        
        const form = document.getElementById('countryForm');
        if (form) {
            form.dataset.editId = id;
            document.getElementById('country_name_ar').value = doc.name_ar || '';
            document.getElementById('country_name_en').value = doc.name_en || '';
            document.getElementById('country_slug').value = doc.slug || '';
            document.getElementById('country_flag').value = doc.flag || '';
            
            document.getElementById('countryModalTitle').innerHTML = '<i class="fa-solid fa-earth-americas me-2 text-warning"></i>تعديل الدولة';
            document.getElementById('saveCountryBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>تعديل';
            new bootstrap.Modal(document.getElementById('countryModal')).show();
        }
    } catch (err) {
        alert('خطأ في تحميل بيانات الدولة: ' + err.message);
    }
};

window.deleteCountry = async function(id) {
    if (!confirm('هل تريد حذف هذه الدولة؟ سيؤدي ذلك إلى خلل في الوجهات التابعة لها! لا يمكن التراجع!')) return;
    try {
        const conf = window.CONFIG.appwrite;
        await window.db.databases.deleteDocument(conf.databaseId, conf.collections.countries, id);
        await window.loadCountriesTable();
        await window.loadCountriesDropdown();
    } catch (err) {
        alert('خطأ في الحذف: ' + err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DESTINATIONS EDIT/DELETE
// ─────────────────────────────────────────────────────────────────────────────

window.editDestination = async function(id) {
    try {
        const conf = window.CONFIG.appwrite;
        const doc = await window.db.databases.getDocument(conf.databaseId, conf.collections.destinations, id);
        
        const form = document.getElementById('addDestinationForm');
        if (form) {
            await window.loadCountriesDropdown();
            form.dataset.editId = id;
            document.getElementById('dest_name_ar').value = doc.name_ar || '';
            document.getElementById('dest_name_en').value = doc.name_en || '';
            document.getElementById('dest_country_id').value = doc.country_id || '';
            document.getElementById('dest_sort_order').value = doc.sort_order || 0;
            document.getElementById('dest_category').value = doc.category || 'beach';
            document.getElementById('dest_is_featured').value = String(doc.is_featured);
            document.getElementById('dest_description_ar').value = doc.description_ar || '';
            document.getElementById('dest_description_en').value = doc.description_en || '';
            const url = doc.image_url || '';
            document.getElementById('dest_image_url').value = url;
            const previewImg = document.getElementById('dest_image_preview');
            const placeholder = document.getElementById('dest_upload_placeholder');
            if (previewImg && placeholder) {
                if (url) {
                    previewImg.src = url;
                    previewImg.classList.remove('d-none');
                    placeholder.classList.add('d-none');
                } else {
                    previewImg.src = '';
                    previewImg.classList.add('d-none');
                    placeholder.classList.remove('d-none');
                }
            }
            
            document.getElementById('destinationModalTitle').innerHTML = '<i class="fa-solid fa-map-pin me-2 text-warning"></i>تعديل الوجهة';
            document.getElementById('saveDestBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>تعديل';
            new bootstrap.Modal(document.getElementById('addDestinationModal')).show();
        }
    } catch (err) {
        alert('خطأ في تحميل بيانات الوجهة: ' + err.message);
    }
};

window.deleteDestination = async function (docId) {
    if (!confirm('هل تريد حذف هذه الوجهة؟ لا يمكن التراجع!')) return;
    try {
        const conf = window.CONFIG.appwrite;
        await window.db.databases.deleteDocument(conf.databaseId, conf.collections.destinations, docId);
        await window.loadDestinationsTable();
        await window.loadDestinationsDropdown();
    } catch (err) {
        alert('خطأ في الحذف: ' + err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TRIPS EDIT
// ─────────────────────────────────────────────────────────────────────────────

window.editTrip = async function(id) {
    try {
        const conf = window.CONFIG.appwrite;
        const { Client, Databases } = Appwrite;
        const client = new Client().setEndpoint(conf.endpoint).setProject(conf.projectId);
        const databases = new Databases(client);
        
        const doc = await databases.getDocument(conf.databaseId, conf.collections.trips, id);
        
        const form = document.getElementById('addTripForm');
        if (form) {
            await window.loadDestinationsDropdown();
            form.dataset.editId = id;
            
            document.getElementById('trip_destination_id').value = doc.destination_id || '';
            document.getElementById('trip_title_ar').value = doc.title_ar || '';
            document.getElementById('trip_title_en').value = doc.title_en || '';
            document.getElementById('trip_desc_ar').value = doc.desc_ar || '';
            document.getElementById('trip_desc_en').value = doc.desc_en || '';
            document.getElementById('trip_price').value = doc.price || 0;
            document.getElementById('trip_currency').value = doc.currency || '$';
            document.getElementById('trip_duration').value = doc.duration || '';
            document.getElementById('trip_spots_total').value = doc.spots_total || 20;
            document.getElementById('trip_spots_left').value = doc.spots_left || 20;
            document.getElementById('trip_category').value = doc.category || 'beach';
            document.getElementById('trip_climate').value = doc.climate || 'beach';
            document.getElementById('trip_travel_type').value = (doc.travel_type || []).join(',');
            document.getElementById('trip_budget_tier').value = doc.budget_tier || 'medium';
            document.getElementById('trip_is_egyptian').value = String(doc.is_egyptian);
            document.getElementById('trip_is_active').value = String(doc.is_active);
            document.getElementById('trip_sort_order').value = doc.sort_order || 0;
            document.getElementById('trip_color_from').value = doc.color_from || '#0099CC';
            document.getElementById('trip_color_to').value = doc.color_to || '#FF6633';
            const url = doc.image_url || '';
            document.getElementById('trip_image_url').value = url;
            const previewImg = document.getElementById('trip_image_preview');
            const placeholder = document.getElementById('trip_upload_placeholder');
            if (previewImg && placeholder) {
                if (url) {
                    previewImg.src = url;
                    previewImg.classList.remove('d-none');
                    placeholder.classList.add('d-none');
                } else {
                    previewImg.src = '';
                    previewImg.classList.add('d-none');
                    placeholder.classList.remove('d-none');
                }
            }
            
            document.getElementById('trip_highlights_ar').value = (doc.highlights_ar || []).join('\n');
            document.getElementById('trip_highlights_en').value = (doc.highlights_en || []).join('\n');
            document.getElementById('trip_included_ar').value = (doc.included_ar || []).join('\n');
            document.getElementById('trip_included_en').value = (doc.included_en || []).join('\n');
            document.getElementById('trip_excluded_ar').value = (doc.excluded_ar || []).join('\n');
            document.getElementById('trip_excluded_en').value = (doc.excluded_en || []).join('\n');
            document.getElementById('trip_itinerary_ar').value = (doc.itinerary_ar || []).join('\n');
            document.getElementById('trip_itinerary_en').value = (doc.itinerary_en || []).join('\n');
            
            document.getElementById('trip_meta_title_ar').value = doc.meta_title_ar || '';
            document.getElementById('trip_meta_title_en').value = doc.meta_title_en || '';
            document.getElementById('trip_meta_desc_ar').value = doc.meta_desc_ar || '';
            document.getElementById('trip_meta_desc_en').value = doc.meta_desc_en || '';
            document.getElementById('trip_meta_keywords_ar').value = doc.meta_keywords_ar || '';
            document.getElementById('trip_meta_keywords_en').value = doc.meta_keywords_en || '';

            document.getElementById('tripModalTitle').innerHTML = '<i class="fa-solid fa-plane me-2 text-warning"></i>تعديل الرحلة';
            document.getElementById('saveTripBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>تعديل';
            new bootstrap.Modal(document.getElementById('addTripModal')).show();
        }
    } catch (err) {
        alert('خطأ في تحميل بيانات الرحلة: ' + err.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP MODALS AUTO-RESET / AUTO-LOAD EVENT LISTENERS
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const destModalEl = document.getElementById('addDestinationModal');
    if (destModalEl) {
        destModalEl.addEventListener('hidden.bs.modal', () => {
            const form = document.getElementById('addDestinationForm');
            if (form) {
                form.reset();
                delete form.dataset.editId;
            }
            const statusEl = document.getElementById('dest_upload_status');
            if (statusEl) statusEl.innerHTML = '';
            
            // Reset preview
            const previewImg = document.getElementById('dest_image_preview');
            const placeholder = document.getElementById('dest_upload_placeholder');
            if (previewImg && placeholder) {
                previewImg.src = '';
                previewImg.classList.add('d-none');
                placeholder.classList.remove('d-none');
            }
            const urlInput = document.getElementById('dest_image_url');
            if (urlInput) urlInput.value = '';

            document.getElementById('destinationModalTitle').innerHTML = '<i class="fa-solid fa-map-pin me-2 text-warning"></i>إضافة وجهة جديدة';
            document.getElementById('saveDestBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الوجهة';
        });
        destModalEl.addEventListener('show.bs.modal', () => {
            window.loadCountriesDropdown();
        });
    }

    const tripModalEl = document.getElementById('addTripModal');
    if (tripModalEl) {
        tripModalEl.addEventListener('hidden.bs.modal', () => {
            const form = document.getElementById('addTripForm');
            if (form) {
                form.reset();
                delete form.dataset.editId;
            }
            const statusEl = document.getElementById('trip_upload_status');
            if (statusEl) statusEl.innerHTML = '';

            // Reset preview
            const previewImg = document.getElementById('trip_image_preview');
            const placeholder = document.getElementById('trip_upload_placeholder');
            if (previewImg && placeholder) {
                previewImg.src = '';
                previewImg.classList.add('d-none');
                placeholder.classList.remove('d-none');
            }
            const urlInput = document.getElementById('trip_image_url');
            if (urlInput) urlInput.value = '';

            document.getElementById('tripModalTitle').innerHTML = '<i class="fa-solid fa-plane me-2 text-warning"></i>إضافة رحلة جديدة';
            document.getElementById('saveTripBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الرحلة';
        });
        tripModalEl.addEventListener('show.bs.modal', () => {
            window.loadDestinationsDropdown();
        });
    }

    const countryModalEl = document.getElementById('countryModal');
    if (countryModalEl) {
        countryModalEl.addEventListener('hidden.bs.modal', () => {
            const form = document.getElementById('countryForm');
            if (form) {
                form.reset();
                delete form.dataset.editId;
            }
            document.getElementById('countryModalTitle').innerHTML = '<i class="fa-solid fa-earth-americas me-2 text-warning"></i>إضافة دولة جديدة';
            document.getElementById('saveCountryBtn').innerHTML = '<i class="fa-solid fa-save me-1"></i>حفظ الدولة';
        });
    }

    // File upload listeners
    const destFileInp = document.getElementById('dest_image_file');
    if (destFileInp) {
        destFileInp.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const statusEl = document.getElementById('dest_upload_status');
            if (statusEl) statusEl.innerHTML = '<span class="text-warning"><i class="spinner-border spinner-border-sm me-1"></i>جاري رفع الصورة...</span>';
            try {
                const url = await window.db.uploadFile(file);
                document.getElementById('dest_image_url').value = url;
                
                // Show preview
                const previewImg = document.getElementById('dest_image_preview');
                const placeholder = document.getElementById('dest_upload_placeholder');
                if (previewImg && placeholder) {
                    previewImg.src = url;
                    previewImg.classList.remove('d-none');
                    placeholder.classList.add('d-none');
                }
                
                if (statusEl) statusEl.innerHTML = '<span class="text-success"><i class="fa-solid fa-check me-1"></i>تم رفع الصورة بنجاح!</span>';
            } catch (err) {
                console.error(err);
                if (statusEl) statusEl.innerHTML = `<span class="text-danger"><i class="fa-solid fa-times me-1"></i>فشل الرفع: ${err.message}</span>`;
            }
        });
    }

    const tripFileInp = document.getElementById('trip_image_file');
    if (tripFileInp) {
        tripFileInp.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const statusEl = document.getElementById('trip_upload_status');
            if (statusEl) statusEl.innerHTML = '<span class="text-warning"><i class="spinner-border spinner-border-sm me-1"></i>جاري رفع الصورة...</span>';
            try {
                const url = await window.db.uploadFile(file);
                document.getElementById('trip_image_url').value = url;
                
                // Show preview
                const previewImg = document.getElementById('trip_image_preview');
                const placeholder = document.getElementById('trip_upload_placeholder');
                if (previewImg && placeholder) {
                    previewImg.src = url;
                    previewImg.classList.remove('d-none');
                    placeholder.classList.add('d-none');
                }
                
                if (statusEl) statusEl.innerHTML = '<span class="text-success"><i class="fa-solid fa-check me-1"></i>تم رفع الصورة بنجاح!</span>';
            } catch (err) {
                console.error(err);
                if (statusEl) statusEl.innerHTML = `<span class="text-danger"><i class="fa-solid fa-times me-1"></i>فشل الرفع: ${err.message}</span>`;
            }
        });
    }
});

// Dynamic sitemap generator
window.generateSitemapXML = async function() {
    if (!window.db.isAppwriteConnected()) {
        alert('يرجى الاتصال بـ Appwrite أولاً!');
        return;
    }
    const btn = document.getElementById('generateSitemapBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="spinner-border spinner-border-sm me-1"></i>جاري التصدير...';
    }
    try {
        const conf = window.CONFIG.appwrite;
        
        // Fetch destinations and trips from database
        const [destsRes, tripsRes] = await Promise.all([
            window.db.databases.listDocuments(conf.databaseId, conf.collections.destinations),
            window.db.databases.listDocuments(conf.databaseId, conf.collections.trips)
        ]);
        
        const dests = destsRes.documents;
        const trips = tripsRes.documents;
        
        const today = new Date().toISOString().split('T')[0];
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Core pages
        xml += `  <!-- Core Pages -->\n`;
        xml += `  <url>\n    <loc>https://ra7laty.com/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>https://ra7laty.com/destinations</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>https://ra7laty.com/survey</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        
        // Destinations
        xml += `  <!-- Dynamic Destinations -->\n`;
        dests.forEach(d => {
            xml += `  <url>\n    <loc>https://ra7laty.com/destination-details?id=${d.$id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
        
        // Trips
        xml += `  <!-- Dynamic Trips -->\n`;
        trips.forEach(t => {
            xml += `  <url>\n    <loc>https://ra7laty.com/trip-details?id=${t.$id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        });
        
        xml += `</urlset>\n`;
        
        // Download XML file
        const blob = new Blob([xml], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sitemap.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء تصدير خريطة الموقع: ' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-download me-1"></i> تصدير خريطة الموقع (sitemap.xml)';
        }
    }
};
