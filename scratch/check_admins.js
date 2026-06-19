const CONFIG = {
    endpoint: 'https://appwrite.etihadalmdina.com/v1',
    projectId: '6a32ee5e0018a83516bc',
    databaseId: '6a32ee91000b40dd8d3c',
    collections: {
        admins: 'admins'
    }
};

async function checkAdmins() {
    try {
        const url = `${CONFIG.endpoint}/databases/${CONFIG.databaseId}/collections/${CONFIG.collections.admins}/documents`;
        const res = await fetch(url, { headers: { 'X-Appwrite-Project': CONFIG.projectId } });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.ok) {
            console.log(`Found ${data.total} admin accounts:`);
            data.documents.forEach(adm => {
                console.log(` - Email: ${adm.email}, Name: ${adm.name || 'N/A'}`);
            });
        } else {
            console.error("Error response:", data);
        }
    } catch(e) {
        console.error(e);
    }
}

checkAdmins();
