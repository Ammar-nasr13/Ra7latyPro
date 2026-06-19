// Rahalaty Database & Appwrite Service Layer

const STATIC_COUNTRIES = [
    { id: 'egypt', name_ar: 'مصر', name_en: 'Egypt', slug: 'egypt', flag: '🇪🇬' },
    { id: 'france', name_ar: 'فرنسا', name_en: 'France', slug: 'france', flag: '🇫🇷' },
    { id: 'italy', name_ar: 'إيطاليا', name_en: 'Italy', slug: 'italy', flag: '🇮🇹' },
    { id: 'spain', name_ar: 'إسبانيا', name_en: 'Spain', slug: 'spain', flag: '🇪🇸' },
    { id: 'uae', name_ar: 'الإمارات', name_en: 'UAE', slug: 'uae', flag: '🇦🇪' },
    { id: 'turkey', name_ar: 'تركيا', name_en: 'Turkey', slug: 'turkey', flag: '🇹🇷' },
    { id: 'indonesia', name_ar: 'إندونيسيا', name_en: 'Indonesia', slug: 'indonesia', flag: '🇮🇩' },
    { id: 'usa', name_ar: 'أمريكا', name_en: 'USA', slug: 'usa', flag: '🇺🇸' },
    { id: 'maldives', name_ar: 'جزر المالديف', name_en: 'Maldives', slug: 'maldives', flag: '🇲🇻' },
    { id: 'japan', name_ar: 'اليابان', name_en: 'Japan', slug: 'japan', flag: '🇯🇵' },
    { id: 'morocco', name_ar: 'المغرب', name_en: 'Morocco', slug: 'morocco', flag: '🇲🇦' },
    { id: 'greece', name_ar: 'اليونان', name_en: 'Greece', slug: 'greece', flag: '🇬🇷' },
    { id: 'switzerland', name_ar: 'سويسرا', name_en: 'Switzerland', slug: 'switzerland', flag: '🇨🇭' },
    { id: 'albania', name_ar: 'ألبانيا', name_en: 'Albania', slug: 'albania', flag: '🇦🇱' }
];

const STATIC_DESTINATIONS = [
    {
        id: 1,
        name_ar: 'الغردقة', name_en: 'Hurghada',
        desc_ar: 'مدينة ساحلية رائعة على البحر الأحمر، مشهورة بشعابها المرجانية وشواطئها الذهبية ورياضات الغوص والسنوركل.',
        desc_en: 'A stunning coastal city on the Red Sea, famous for its coral reefs, golden beaches, and world-class diving.',
        category: 'beach',
        is_featured: true,
        sort_order: 1,
        image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80'
    },
    {
        id: 2,
        name_ar: 'شرم الشيخ', name_en: 'Sharm El-Sheikh',
        desc_ar: 'جنة الشعاب المرجانية والمنتجعات الفاخرة بين جبال سيناء وأزرق البحر الأحمر.',
        desc_en: 'Paradise of coral reefs and luxury resorts nestled between the Sinai mountains and the Red Sea.',
        category: 'beach',
        is_featured: true,
        sort_order: 2,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'
    },
    {
        id: 3,
        name_ar: 'الأقصر وأسوان', name_en: 'Luxor & Aswan',
        desc_ar: 'معابد الفراعنة ووادي الملوك الأسطوري والإبحار على النيل بين الحضارات.',
        desc_en: 'Pharaonic temples, the Valley of the Kings, and Nile cruises between ancient civilizations.',
        category: 'heritage',
        is_featured: true,
        sort_order: 3,
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=80'
    },
    {
        id: 4,
        name_ar: 'القاهرة', name_en: 'Cairo',
        desc_ar: 'قلب مصر النابض بين الأهرامات والمتحف المصري وأزقة الحي الإسلامي العريق.',
        desc_en: 'The beating heart of Egypt between the Pyramids, the Egyptian Museum, and the ancient Islamic Quarter.',
        category: 'culture',
        is_featured: true,
        sort_order: 4,
        image: 'https://images.unsplash.com/photo-1539768942893-daf525e2a97e?w=1200&q=80'
    },
    {
        id: 5,
        name_ar: 'مرسى مطروح', name_en: 'Marsa Matrouh',
        desc_ar: 'أنقى شواطئ البحر المتوسط بمياهه الفيروزية الشفافة ورماله الناصعة البياض.',
        desc_en: "The Mediterranean's purest beaches with crystal-clear turquoise waters and pristine white sands.",
        category: 'beach',
        is_featured: false,
        sort_order: 5,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
    },
    {
        id: 6,
        name_ar: 'سيناء', name_en: 'Sinai',
        desc_ar: 'جبال سيناء الشاهقة وجبل موسى المقدس وشواطئ العقبة الرائعة.',
        desc_en: 'The towering Sinai mountains, sacred Mount Moses, and the stunning Gulf of Aqaba beaches.',
        category: 'adventure',
        is_featured: false,
        sort_order: 6,
        image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1200&q=80'
    }
];

const STATIC_TRIPS = [
    {
        id: 1,
        title_ar: 'غردقة الساحرة', title_en: 'Magical Hurghada',
        country_ar: 'مصر', country_en: 'Egypt', flag: '🇪🇬',
        price: 350, currency: '$', duration: 5,
        category: 'beach', climate: 'beach',
        travel_type: ['family', 'couple', 'friends'],
        budget_tier: 'low',
        color_from: '#0099CC', color_to: '#FF6633',
        is_egyptian: true, spots_total: 20, spots_left: 5,
        departure_dates: ['2026-06-20', '2026-07-10', '2026-08-05', '2026-09-01'],
        desc_ar: 'استمتع بشواطئ الغردقة الرائعة وغوص في أعماق البحر الأحمر، رحلة لا تُنسى بأسعار مناسبة.',
        desc_en: 'Enjoy the stunning beaches of Hurghada and dive into the Red Sea depths — an unforgettable trip at affordable prices.',
        highlights_ar: ['غوص وسنوركل', 'رياضات مائية', 'رحلة صحراوية', 'كورنيش الغردقة'],
        highlights_en: ['Diving & Snorkeling', 'Water Sports', 'Desert Safari', 'Hurghada Corniche'],
        destination_id: 1,
        image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80'
    },
    {
        id: 2,
        title_ar: 'شرم الشيخ الأسطوري', title_en: 'Legendary Sharm El-Sheikh',
        country_ar: 'مصر', country_en: 'Egypt', flag: '🇪🇬',
        price: 420, currency: '$', duration: 6,
        category: 'beach', climate: 'beach',
        travel_type: ['couple', 'family', 'friends'],
        budget_tier: 'low',
        color_from: '#00B4D8', color_to: '#F77F00',
        is_egyptian: true, spots_total: 18, spots_left: 3,
        departure_dates: ['2026-06-25', '2026-07-15', '2026-08-10'],
        desc_ar: 'جنة الشعاب المرجانية وأجمل شواطئ مصر في رحلة مثيرة بين الجبال والبحر.',
        desc_en: "Paradise of coral reefs and Egypt's most beautiful beaches in an exciting journey between mountains and sea.",
        highlights_ar: ['نعمة باي', 'جزيرة تيران', 'سوق شرم', 'رحلة الصحراء'],
        highlights_en: ['Naama Bay', 'Tiran Island', 'Sharm Market', 'Desert Trip'],
        destination_id: 2,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'
    },
    {
        id: 3,
        title_ar: 'الأقصر وأسوان — أرض الفراعنة', title_en: 'Luxor & Aswan — Land of Pharaohs',
        country_ar: 'مصر', country_en: 'Egypt', flag: '🇪🇬',
        price: 500, currency: '$', duration: 7,
        category: 'culture', climate: 'desert',
        travel_type: ['family', 'couple', 'solo'],
        budget_tier: 'medium',
        color_from: '#8B4513', color_to: '#C5A028',
        is_egyptian: true, spots_total: 15, spots_left: 9,
        departure_dates: ['2026-07-01', '2026-07-22', '2026-09-03'],
        desc_ar: 'رحلة في أعماق التاريخ المصري القديم بين معابد الكرنك وأبو سمبل والمتحف الفرعوني.',
        desc_en: 'A journey into ancient Egyptian history between Karnak temples, Abu Simbel, and the Pharaonic museum.',
        highlights_ar: ['معبد الكرنك', 'أبو سمبل', 'وادي الملوك', 'رحلة النيل'],
        highlights_en: ['Karnak Temple', 'Abu Simbel', 'Valley of Kings', 'Nile Cruise'],
        destination_id: 3,
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=80'
    },
    {
        id: 4,
        title_ar: 'باريس — مدينة الأنوار', title_en: 'Paris — City of Lights',
        country_ar: 'فرنسا', country_en: 'France', flag: '🇫🇷',
        price: 1500, currency: '$', duration: 7,
        category: 'culture', climate: 'city',
        travel_type: ['couple', 'solo'],
        budget_tier: 'high',
        color_from: '#003087', color_to: '#ED2939',
        is_egyptian: false, spots_total: 20, spots_left: 12,
        departure_dates: ['2026-07-05', '2026-08-12', '2026-09-10'],
        desc_ar: 'استكشف عاصمة الفنون والموضة، من برج إيفل إلى متحف اللوفر في رحلة رومانسية لا مثيل لها.',
        desc_en: 'Explore the capital of arts and fashion, from the Eiffel Tower to the Louvre in an unparalleled romantic journey.',
        highlights_ar: ['برج إيفل', 'متحف اللوفر', 'الشانزليزيه', 'قصر فرساي'],
        highlights_en: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées', 'Palace of Versailles'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80'
    },
    {
        id: 5,
        title_ar: 'روما — العاصمة الأبدية', title_en: 'Rome — The Eternal City',
        country_ar: 'إيطاليا', country_en: 'Italy', flag: '🇮🇹',
        price: 1300, currency: '$', duration: 6,
        category: 'culture', climate: 'city',
        travel_type: ['couple', 'family', 'solo'],
        budget_tier: 'high',
        color_from: '#009246', color_to: '#CE2B37',
        is_egyptian: false, spots_total: 16, spots_left: 7,
        departure_dates: ['2026-07-28', '2026-08-01', '2026-09-18'],
        desc_ar: 'تجول في شوارع التاريخ بين الكولوسيوم والفاتيكان وينابيع تريفي في مدينة خالدة.',
        desc_en: 'Walk through streets of history between the Colosseum, Vatican, and Trevi Fountain in an eternal city.',
        highlights_ar: ['الكولوسيوم', 'الفاتيكان', 'نافورة تريفي', 'البانثيون'],
        highlights_en: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80'
    },
    {
        id: 6,
        title_ar: 'برشلونة — مدينة الفن', title_en: 'Barcelona — City of Art',
        country_ar: 'إسبانيا', country_en: 'Spain', flag: '🇪🇸',
        price: 1200, currency: '$', duration: 6,
        category: 'adventure', climate: 'beach',
        travel_type: ['friends', 'couple', 'solo'],
        budget_tier: 'high',
        color_from: '#AA151B', color_to: '#F1BF00',
        is_egyptian: false, spots_total: 20, spots_left: 14,
        departure_dates: ['2026-07-08', '2026-08-20', '2026-09-01'],
        desc_ar: 'من معمار غاودي الفريد إلى شواطئ لا باركيتا المذهلة، برشلونة تجمع الفن والمتعة معاً.',
        desc_en: "From Gaudí's unique architecture to the stunning beaches of La Barceloneta, Barcelona combines art and fun.",
        highlights_ar: ['الساغرادا فاميليا', 'لاس رامبلاس', 'شاطئ برشلونة', 'الحي القوطي'],
        highlights_en: ['Sagrada Família', 'Las Ramblas', 'Barcelona Beach', 'Gothic Quarter'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80'
    },
    {
        id: 7,
        title_ar: 'دبي — مدينة المستقبل', title_en: 'Dubai — City of the Future',
        country_ar: 'الإمارات', country_en: 'UAE', flag: '🇦🇪',
        price: 900, currency: '$', duration: 5,
        category: 'adventure', climate: 'desert',
        travel_type: ['family', 'couple', 'friends'],
        budget_tier: 'high',
        color_from: '#00732F', color_to: '#C0392B',
        is_egyptian: false, spots_total: 25, spots_left: 2,
        departure_dates: ['2026-06-22', '2026-07-18', '2026-08-25'],
        desc_ar: 'تسوق في أفخم المراكز التجارية وتزلج على الثلج بينما الصحراء تمتد خارج النافذة.',
        desc_en: 'Shop in the most luxurious malls and ski on snow while the desert stretches outside the window.',
        highlights_ar: ['برج خليفة', 'دبي مول', 'ميناء جميرا', 'رحلة الصحراء'],
        highlights_en: ['Burj Khalifa', 'Dubai Mall', 'Jumeirah Port', 'Desert Safari'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'
    },
    {
        id: 8,
        title_ar: 'إسطنبول — جسر الحضارات', title_en: 'Istanbul — Bridge of Civilizations',
        country_ar: 'تركيا', country_en: 'Turkey', flag: '🇹🇷',
        price: 700, currency: '$', duration: 6,
        category: 'culture', climate: 'city',
        travel_type: ['family', 'couple', 'friends', 'solo'],
        budget_tier: 'medium',
        color_from: '#E30A17', color_to: '#2E4053',
        is_egyptian: false, spots_total: 22, spots_left: 10,
        departure_dates: ['2026-07-03', '2026-07-28', '2026-09-05'],
        desc_ar: 'مدينة تجمع بين شرق وغرب، بين آيا صوفيا والبسفور والبازارات الشرقية العريقة.',
        desc_en: 'A city that brings together East and West, between Hagia Sophia, the Bosphorus, and ancient Eastern bazaars.',
        highlights_ar: ['آيا صوفيا', 'القصر الكبير', 'البازار المسقوف', 'جسر البسفور'],
        highlights_en: ['Hagia Sophia', 'Topkapi Palace', 'Grand Bazaar', 'Bosphorus Bridge'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80'
    },
    {
        id: 9,
        title_ar: 'بالي — جنة الأرض', title_en: 'Bali — Heaven on Earth',
        country_ar: 'إندونيسيا', country_en: 'Indonesia', flag: '🇮🇩',
        price: 800, currency: '$', duration: 10,
        category: 'beach', climate: 'beach',
        travel_type: ['couple', 'friends', 'solo'],
        budget_tier: 'medium',
        color_from: '#FF6B35', color_to: '#1A936F',
        is_egyptian: false, spots_total: 18, spots_left: 6,
        departure_dates: ['2026-07-12', '2026-08-09', '2026-10-11'],
        desc_ar: 'جزيرة الآلهة ذات المعابد والشلالات والشواطئ البركانية الخلابة وثقافة فريدة من نوعها.',
        desc_en: 'Island of the gods with temples, waterfalls, volcanic beaches, and a unique culture like no other.',
        highlights_ar: ['معبد أولوواتو', 'تراسات أوبود', 'شاطئ كوتا', 'كانيون أيانغ'],
        highlights_en: ['Uluwatu Temple', 'Ubud Terraces', 'Kuta Beach', 'Ayung Canyon'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'
    },
    {
        id: 10,
        title_ar: 'نيويورك — المدينة التي لا تنام', title_en: 'New York — The City That Never Sleeps',
        country_ar: 'أمريكا', country_en: 'USA', flag: '🇺🇸',
        price: 2500, currency: '$', duration: 8,
        category: 'adventure', climate: 'city',
        travel_type: ['friends', 'couple', 'solo'],
        budget_tier: 'luxury',
        color_from: '#3C3B6E', color_to: '#B22234',
        is_egyptian: false, spots_total: 15, spots_left: 8,
        departure_dates: ['2026-07-20', '2026-09-01', '2026-10-05'],
        desc_ar: 'تجربة المدينة الأكثر إثارة في العالم، من تايمز سكوير إلى سنترال بارك والمتحف الأمريكي.',
        desc_en: 'Experience the most exciting city in the world, from Times Square to Central Park and the American Museum.',
        highlights_ar: ['تايمز سكوير', 'سنترال بارك', 'تمثال الحرية', 'برودواي'],
        highlights_en: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=80'
    },
    {
        id: 11,
        title_ar: 'المالديف — المتعة الخالصة', title_en: 'Maldives — Pure Paradise',
        country_ar: 'جزر المالديف', country_en: 'Maldives', flag: '🇲🇻',
        price: 3000, currency: '$', duration: 7,
        category: 'beach', climate: 'beach',
        travel_type: ['couple'],
        budget_tier: 'luxury',
        color_from: '#006994', color_to: '#00C9A7',
        is_egyptian: false, spots_total: 10, spots_left: 1,
        departure_dates: ['2026-08-01', '2026-09-15', '2026-11-03'],
        desc_ar: 'جزر المحيط الهندي الخيالية مع أكواخ فوق الماء وشعاب مرجانية بلورية وغروب شمس لا يوصف.',
        desc_en: 'Dreamy Indian Ocean islands with overwater bungalows, crystal coral reefs, and indescribable sunsets.',
        highlights_ar: ['كوخ فوق الماء', 'الغوص في المرجان', 'غروب المحيط', 'سبا خاص'],
        highlights_en: ['Overwater Bungalow', 'Coral Diving', 'Ocean Sunset', 'Private Spa'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80'
    },
    {
        id: 12,
        title_ar: 'طوكيو — عاصمة المستقبل', title_en: 'Tokyo — Capital of the Future',
        country_ar: 'اليابان', country_en: 'Japan', flag: '🇯🇵',
        price: 2200, currency: '$', duration: 9,
        category: 'culture', climate: 'city',
        travel_type: ['solo', 'couple', 'friends'],
        budget_tier: 'luxury',
        color_from: '#BC002D', color_to: '#2C3E50',
        is_egyptian: false, spots_total: 20, spots_left: 11,
        departure_dates: ['2026-08-15', '2026-09-22', '2026-10-17'],
        desc_ar: 'مزيج مذهل بين التكنولوجيا الحديثة والتراث الياباني الأصيل في مدينة لا تشبه أي مكان آخر.',
        desc_en: 'An amazing blend of modern technology and authentic Japanese heritage in a city unlike anywhere else.',
        highlights_ar: ['جبل فوجي', 'شينجوكو', 'معبد سنسوجي', 'حي أكيهابارا'],
        highlights_en: ['Mount Fuji', 'Shinjuku', 'Senso-ji Temple', 'Akihabara District'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80'
    },
    {
        id: 13,
        title_ar: 'المغرب — مملكة الألوان', title_en: 'Morocco — Kingdom of Colors',
        country_ar: 'المغرب', country_en: 'Morocco', flag: '🇲🇦',
        price: 600, currency: '$', duration: 7,
        category: 'adventure', climate: 'desert',
        travel_type: ['friends', 'family', 'solo'],
        budget_tier: 'medium',
        color_from: '#C1272D', color_to: '#006233',
        is_egyptian: false, spots_total: 20, spots_left: 15,
        departure_dates: ['2026-07-24', '2026-08-22', '2026-09-19'],
        desc_ar: 'من أزقة مراكش الوردية إلى صحراء الصحراء الكبرى وشاطئ أغادير المدهش، رحلة بألف لون.',
        desc_en: 'From the pink alleys of Marrakech to the Sahara Desert and stunning Agadir beach — a journey of a thousand colors.',
        highlights_ar: ['جامع الفنا', 'الصحراء الكبرى', 'فاس القديمة', 'شاطئ أغادير'],
        highlights_en: ["Jemaa el-Fna", 'Sahara Desert', 'Ancient Fez', 'Agadir Beach'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80'
    },
    {
        id: 14,
        title_ar: 'جزر اليونان — أجمل شواطئ أوروبا', title_en: "Greek Islands — Europe's Most Beautiful Beaches",
        country_ar: 'اليونان', country_en: 'Greece', flag: '🇬🇷',
        price: 1100, currency: '$', duration: 8,
        category: 'beach', climate: 'beach',
        travel_type: ['couple', 'friends'],
        budget_tier: 'high',
        color_from: '#0D5EAF', color_to: '#FFFFFF',
        is_egyptian: false, spots_total: 16, spots_left: 4,
        departure_dates: ['2026-07-07', '2026-08-04', '2026-09-02'],
        desc_ar: 'سانتوريني الحالمة وميكونوس الصاخبة وجزر الإيجه الخلابة في رحلة بحرية فريدة.',
        desc_en: 'Dreamy Santorini and vibrant Mykonos and stunning Aegean islands in a unique sea journey.',
        highlights_ar: ['سانتوريني', 'ميكونوس', 'جزيرة كريت', 'أكروبوليس أثينا'],
        highlights_en: ['Santorini', 'Mykonos', 'Crete Island', 'Athens Acropolis'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80'
    },
    {
        id: 15,
        title_ar: 'البر السويسري — قلب الألب', title_en: 'Switzerland — Heart of the Alps',
        country_ar: 'سويسرا', country_en: 'Switzerland', flag: '🇨🇭',
        price: 2800, currency: '$', duration: 8,
        category: 'adventure', climate: 'mountain',
        travel_type: ['family', 'couple'],
        budget_tier: 'luxury',
        color_from: '#D52B1E', color_to: '#FFFFFF',
        is_egyptian: false, spots_total: 12, spots_left: 5,
        departure_dates: ['2026-08-01', '2026-09-15', '2026-10-22'],
        desc_ar: 'تزلج على جبال الألب وتجول في قرى الشوكولاتة وبحيرة جنيف الرائعة في قلب أوروبا.',
        desc_en: 'Ski in the Alps, stroll through chocolate villages, and visit stunning Lake Geneva in the heart of Europe.',
        highlights_ar: ['جبل يونغفراو', 'زيرمات', 'بحيرة جنيف', 'إنترلاكن'],
        highlights_en: ['Jungfrau Mountain', 'Zermatt', 'Lake Geneva', 'Interlaken'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'
    },
    {
        id: 16,
        title_ar: 'البانيا — الكنز الخفي', title_en: 'Albania — The Hidden Gem',
        country_ar: 'ألبانيا', country_en: 'Albania', flag: '🇦🇱',
        price: 450, currency: '$', duration: 6,
        category: 'beach', climate: 'beach',
        travel_type: ['friends', 'solo', 'couple'],
        budget_tier: 'low',
        color_from: '#E41E20', color_to: '#1A3A5C',
        is_egyptian: false, spots_total: 25, spots_left: 18,
        departure_dates: ['2026-07-30', '2026-08-28', '2026-09-25'],
        desc_ar: 'شواطئ البحر الأدرياتيكي والمتوسط بأسعار لا تُصدق وجمال طبيعي بكر لم يكتشفه الكثيرون.',
        desc_en: 'Adriatic and Mediterranean beaches at unbelievable prices with pristine natural beauty few have discovered.',
        highlights_ar: ['شاطئ كاميل', 'جيروكاستر', 'بحيرة شكودر', 'ساراندا'],
        highlights_en: ['Ksamil Beach', 'Gjirokastër', 'Lake Shkodër', 'Saranda'],
        destination_id: null,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
    }
];

class DBService {
    constructor() {
        this.appwriteConnected = false;
        this.sdk = null;
        this.databases = null;
        this.staticCountries = STATIC_COUNTRIES;
        this.staticDestinations = STATIC_DESTINATIONS;
        this.staticTrips = STATIC_TRIPS;
    }

    async init() {
        const conf = window.CONFIG.appwrite;
        
        // Load configurations dynamically from localStorage if overridden by admin
        const storedEndpoint = localStorage.getItem('rahalaty_appwrite_endpoint');
        const storedProjectId = localStorage.getItem('rahalaty_appwrite_project_id');
        const storedDatabaseId = localStorage.getItem('rahalaty_appwrite_database_id');
        
        if (storedEndpoint) conf.endpoint = storedEndpoint;
        if (storedProjectId) conf.projectId = storedProjectId;
        if (storedDatabaseId) conf.databaseId = storedDatabaseId;

        if (conf.projectId && conf.projectId.trim() !== '') {
            try {
                const { Client, Databases } = Appwrite;
                this.sdk = new Client()
                    .setEndpoint(conf.endpoint)
                    .setProject(conf.projectId);
                this.databases = new Databases(this.sdk);
                this.appwriteConnected = true;
                console.log('Appwrite initialized successfully.');
                
                // Auto seed in the background if the database is empty
                this.autoSeed();
            } catch (err) {
                console.error('Failed to initialize Appwrite SDK.', err);
                this.appwriteConnected = false;
            }
        } else {
            console.warn('Appwrite credentials not found.');
            this.appwriteConnected = false;
        }
    }

    async autoSeed() {
        if (!this.appwriteConnected || !this.databases) return;
        const conf = window.CONFIG.appwrite;
        try {
            // 1. Seed Countries
            const countriesRes = await this.databases.listDocuments(conf.databaseId, conf.collections.countries);
            const countryIdMap = {};
            if (countriesRes.total === 0) {
                console.log("Seeding default countries...");
                for (const c of this.staticCountries) {
                    const payload = {
                        name_ar: c.name_ar,
                        name_en: c.name_en,
                        slug: c.slug,
                        flag: c.flag
                    };
                    const doc = await this.databases.createDocument(conf.databaseId, conf.collections.countries, Appwrite.ID.unique(), payload);
                    countryIdMap[c.id] = doc.$id;
                }
            } else {
                countriesRes.documents.forEach(c => {
                    countryIdMap[c.slug] = c.$id;
                    const staticCountry = this.staticCountries.find(sc => sc.slug === c.slug);
                    if (staticCountry) {
                        countryIdMap[staticCountry.id] = c.$id;
                    }
                });
            }

            // 2. Seed Destinations
            const destsRes = await this.databases.listDocuments(conf.databaseId, conf.collections.destinations);
            const destIdMap = {};
            if (destsRes.total === 0) {
                console.log("Seeding default destinations...");
                const egyptDocId = countryIdMap['egypt'] || '';
                for (const d of this.staticDestinations) {
                    const payload = {
                        country_id: egyptDocId, // Default destinations belong to Egypt
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
                    const doc = await this.databases.createDocument(conf.databaseId, conf.collections.destinations, Appwrite.ID.unique(), payload);
                    destIdMap[d.id] = doc.$id;
                }
            } else {
                destsRes.documents.forEach(d => {
                    const staticDest = this.staticDestinations.find(sd => sd.name_en === d.name_en);
                    if (staticDest) {
                        destIdMap[staticDest.id] = d.$id;
                    } else {
                        destIdMap[d.$id] = d.$id;
                    }
                });
            }

            // 3. Seed Trips
            const tripsRes = await this.databases.listDocuments(conf.databaseId, conf.collections.trips);
            if (tripsRes.total === 0) {
                console.log("Seeding default trips...");
                for (const t of this.staticTrips) {
                    const destId = destIdMap[t.destination_id] || '';
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
                    await this.databases.createDocument(conf.databaseId, conf.collections.trips, Appwrite.ID.unique(), payload);
                }
            }

            console.log("Automatic database seeding finished successfully.");
            
            // Refresh tables if loaded in Admin view
            if (typeof window.loadCountriesTable === 'function') window.loadCountriesTable();
            if (typeof window.loadDestinationsTable === 'function') window.loadDestinationsTable();
            if (typeof window.loadTripsTable === 'function') window.loadTripsTable();
        } catch (err) {
            console.error("Automatic seeding failed:", err);
        }
    }

    isAppwriteConnected() {
        return this.appwriteConnected;
    }

    _assertConnected() {
        if (!this.appwriteConnected || !this.databases) {
            throw new Error('Appwrite is not connected. Please check your configuration in the Admin panel.');
        }
    }

    // ─── Destinations ──────────────────────────────────────────────────
    // ─── Countries ─────────────────────────────────────────────────────
    async getCountries() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.countries);
        return response.documents;
    }

    // ─── Destinations ──────────────────────────────────────────────────
    async getDestinations() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.destinations);
        const docs = response.documents;
        
        let countries = [];
        try {
            countries = await this.getCountries();
        } catch (err) {
            console.warn('Failed to load countries in getDestinations:', err);
        }
        
        const FLAG_LOOKUP = {
            'egypt': '🇪🇬', 'مصر': '🇪🇬',
            'france': '🇫🇷', 'فرنسا': '🇫🇷',
            'italy': '🇮🇹', 'إيطاليا': '🇮🇹',
            'spain': '🇪🇸', 'إسبانيا': '🇪🇸',
            'uae': '🇦🇪', 'الإمارات': '🇦🇪',
            'turkey': '🇹🇷', 'تركيا': '🇹🇷',
            'indonesia': '🇮🇩', 'إندونيسيا': '🇮🇩',
            'usa': '🇺🇸', 'أمريكا': '🇺🇸',
            'maldives': '🇲🇻', 'جزر المالديف': '🇲🇻',
            'japan': '🇯🇵', 'اليابان': '🇯🇵',
            'morocco': '🇲🇦', 'المغرب': '🇲🇦',
            'greece': '🇬🇷', 'اليونان': '🇬🇷',
            'switzerland': '🇨🇭', 'سويسرا': '🇨🇭',
            'albania': '🇦🇱', 'ألبانيا': '🇦🇱'
        };

        docs.forEach(d => {
            d.id = d.$id;
            d.desc_ar = d.description_ar || '';
            d.desc_en = d.description_en || '';
            d.image = d.image_url || '';
            
            // Find country details
            const country = countries.find(c => c.$id === d.country_id);
            if (country) {
                d.country_name_ar = country.name_ar;
                d.country_name_en = country.name_en;
                d.flag = country.flag || FLAG_LOOKUP[String(country.name_en).toLowerCase()] || FLAG_LOOKUP[country.name_ar] || '🌍';
            } else {
                d.country_name_ar = '';
                d.country_name_en = '';
                d.flag = d.flag || FLAG_LOOKUP[String(d.name_en).toLowerCase()] || FLAG_LOOKUP[d.name_ar] || '🌍';
            }
            d.slug = d.slug || String(d.name_en).toLowerCase().replace(/[^a-z0-9]/g, '-');
        });
        return docs;
    }

    async getDestination(id) {
        const dests = await this.getDestinations();
        return dests.find(d => String(d.$id) === String(id));
    }

    // ─── Trips ─────────────────────────────────────────────────────────
    async getTrips() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.trips);
        const trips = response.documents;
        
        try {
            const dests = await this.getDestinations();
            
            trips.forEach(t => {
                t.id = t.$id;
                t.image = t.image_url || t.image || '';
                const dest = dests.find(d => String(d.$id) === String(t.destination_id));
                if (dest) {
                    t.destination_name_ar = dest.name_ar;
                    t.destination_name_en = dest.name_en;
                    t.country_ar = dest.country_name_ar;
                    t.country_en = dest.country_name_en;
                    t.flag = dest.flag;
                } else {
                    t.destination_name_ar = '';
                    t.destination_name_en = '';
                    t.country_ar = '';
                    t.country_en = '';
                    t.flag = '🌍';
                }
            });
        } catch (err) {
            console.warn('Failed to map destinations to trips:', err);
            trips.forEach(t => {
                t.id = t.$id;
                t.image = t.image_url || t.image || '';
                t.destination_name_ar = '';
                t.destination_name_en = '';
                t.country_ar = '';
                t.country_en = '';
                t.flag = '🌍';
            });
        }
        
        return trips;
    }

    async getTrip(id) {
        const trips = await this.getTrips();
        return trips.find(t => String(t.id || t.$id) === String(id));
    }

    async updateTripSpots(id, spotsBooked) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const trips = await this.getTrips();
        const trip = trips.find(t => String(t.id || t.$id) === String(id));
        if (trip) {
            trip.spots_left = Math.max(0, (trip.spots_left || 10) - spotsBooked);
            await this.databases.updateDocument(conf.databaseId, conf.collections.trips, trip.$id, {
                spots_left: trip.spots_left
            });
        }
    }

    // ─── Bookings ──────────────────────────────────────────────────────
    async getBookings() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.bookings);
        const list = response.documents;
        
        try {
            const tripsResponse = await this.databases.listDocuments(conf.databaseId, conf.collections.trips);
            const trips = tripsResponse.documents;
            list.forEach(b => {
                const trip = trips.find(t => String(t.$id) === String(b.trip_id) || String(t.id) === String(b.trip_id));
                b.trip_title = trip ? trip.title_ar : 'رحلة غير معروفة';
                b.reference = b.$id;
                b.status = b.booking_status || 'confirmed';
                
                b.travel_date = 'غير محدد';
                if (b.special_requests) {
                    const matchDate = b.special_requests.match(/التاريخ المختار:\s*([^\n]+)/);
                    if (matchDate) b.travel_date = matchDate[1].trim();
                }
                b.created_at = b.$createdAt;
            });
        } catch (err) {
            console.warn('Failed to map trips to bookings:', err);
            list.forEach(b => {
                b.trip_title = 'رحلة';
                b.reference = b.$id;
                b.status = b.booking_status || 'confirmed';
                b.travel_date = 'غير محدد';
                b.created_at = b.$createdAt;
            });
        }
        
        return list;
    }

    async createBooking(booking) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const record = {
            trip_id: String(booking.trip_id),
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            adults: parseInt(booking.adults) || 1,
            children: parseInt(booking.children) || 0,
            total_price: parseFloat(booking.total_price) || 0,
            payment_status: 'pending',
            booking_status: 'confirmed',
            payment_id: booking.payment_method || 'cod',
            special_requests: `التاريخ المختار: ${booking.travel_date || 'غير محدد'}\nطريقة الدفع: ${booking.payment_method || 'غير محدد'}\nملاحظات: ${booking.notes || ''}`
        };

        const doc = await this.databases.createDocument(conf.databaseId, conf.collections.bookings, Appwrite.ID.unique(), record);
        
        try {
            await this.updateTripSpots(booking.trip_id, (parseInt(booking.adults) || 1) + (parseInt(booking.children) || 0));
        } catch (spotsErr) {
            console.error('Error updating spots:', spotsErr);
        }
        
        return doc;
    }

    async cancelBooking(id) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        return await this.databases.updateDocument(conf.databaseId, conf.collections.bookings, id, {
            booking_status: 'cancelled'
        });
    }

    // ─── Testimonials ──────────────────────────────────────────────────
    async getTestimonials(onlyActive = false) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.testimonials);
        const docs = response.documents;
        return onlyActive ? docs.filter(t => t.is_active) : docs;
    }

    async createTestimonial(testimonial) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const record = {
            name: testimonial.name,
            review: testimonial.review,
            rating: parseInt(testimonial.rating),
            is_active: true,
            created_at: new Date().toISOString(),
            reference: testimonial.reference || ''
        };
        return await this.databases.createDocument(conf.databaseId, conf.collections.testimonials, Appwrite.ID.unique(), record);
    }

    async toggleTestimonialActive(id, status) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        return await this.databases.updateDocument(conf.databaseId, conf.collections.testimonials, id, {
            is_active: status
        });
    }

    // ─── Subscribers ──────────────────────────────────────────────────
    async getSubscribers() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.subscribers);
        return response.documents;
    }

    async subscribeNewsletter(email) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const record = {
            email: email
        };
        
        try {
            const { Query } = Appwrite;
            const existing = await this.databases.listDocuments(conf.databaseId, conf.collections.subscribers, [
                Query.equal('email', [email])
            ]);
            if (existing.documents.length > 0) {
                return existing.documents[0];
            }
        } catch (e) {
            console.warn('Subscription check failed or index not ready, saving directly.', e);
        }

        return await this.databases.createDocument(conf.databaseId, conf.collections.subscribers, Appwrite.ID.unique(), record);
    }

    // ─── Surveys ──────────────────────────────────────────────────────
    async getSurveys() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.surveys);
        return response.documents;
    }

    async createSurveyResponse(survey) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const record = {
            name: survey.name,
            email: survey.email,
            phone: survey.phone || '',
            travel_type: survey.travel_type,
            budget: survey.budget,
            climate: survey.climate || survey.preferred_climate || '',
            duration: parseInt(survey.duration || survey.duration_preference) || 7
        };
        const doc = await this.databases.createDocument(conf.databaseId, conf.collections.surveys, Appwrite.ID.unique(), record);
        
        sessionStorage.setItem('survey_response_id', doc.$id);
        sessionStorage.setItem('survey_response_data', JSON.stringify(doc));
        return doc.$id;
    }

    async getSurveyResponse(id) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        try {
            return await this.databases.getDocument(conf.databaseId, conf.collections.surveys, id);
        } catch (e) {
            const sessionData = sessionStorage.getItem('survey_response_data');
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                if (String(parsed.$id || parsed.id) === String(id)) return parsed;
            }
            throw e;
        }
    }

    // ─── Settings ─────────────────────────────────────────────────────
    async getSettings() {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const response = await this.databases.listDocuments(conf.databaseId, conf.collections.settings);
        const settingsObj = {};
        
        const defaults = {
            exchangeRateEGP: 50.0,
            exchangeRateEUR: 0.92,
            exchangeRateSAR: 3.75,
            exchangeRateAED: 3.67,
            siteName: 'رحلاتي'
        };

        response.documents.forEach(d => {
            settingsObj[d.key] = d.value;
        });

        return { ...defaults, ...settingsObj };
    }

    async updateSettings(key, value) {
        this._assertConnected();
        const conf = window.CONFIG.appwrite;
        const list = await this.databases.listDocuments(conf.databaseId, conf.collections.settings);
        const existing = list.documents.find(d => d.key === key);
        if (existing) {
            return await this.databases.updateDocument(conf.databaseId, conf.collections.settings, existing.$id, { value: String(value) });
        } else {
            return await this.databases.createDocument(conf.databaseId, conf.collections.settings, Appwrite.ID.unique(), { key, value: String(value) });
        }
    }
}

const db = new DBService();
window.db = db;
