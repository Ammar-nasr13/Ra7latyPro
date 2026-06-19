// Rahalaty Site Configuration
const CONFIG = {
    domain: 'https://ra7laty.com',
    whatsappNumber: '+201000000000',
    contactEmail: 'info@ra7laty.com',
    appwrite: {
        endpoint: 'https://appwrite.etihadalmdina.com/v1',
        projectId: '6a32ee5e0018a83516bc',
        databaseId: '6a32ee91000b40dd8d3c',
        collections: {
            destinations: 'destinations',
            trips: 'trips',
            bookings: 'bookings',
            testimonials: 'testimonials',
            subscribers: 'newsletter_subscribers',
            surveys: 'survey_responses',
            settings: 'settings'
        }
    }
};
window.CONFIG = CONFIG;
