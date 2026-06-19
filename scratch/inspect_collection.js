const CONFIG = {
    endpoint: 'https://appwrite.etihadalmdina.com/v1',
    projectId: '6a32ee5e0018a83516bc',
    databaseId: '6a32ee91000b40dd8d3c',
    collections: {
        destinations: 'destinations',
        trips: 'trips'
    }
};

async function inspect() {
    try {
        for (const [key, colId] of Object.entries(CONFIG.collections)) {
            const url = `${CONFIG.endpoint}/databases/${CONFIG.databaseId}/collections/${colId}`;
            const res = await fetch(url, {
                headers: {
                    'X-Appwrite-Project': CONFIG.projectId
                }
            });
            console.log(`=== Collection: ${key} (${colId}) ===`);
            console.log("Status:", res.status);
            const data = await res.json();
            if (res.ok) {
                console.log("Attributes:");
                data.attributes.forEach(attr => {
                    console.log(` - ${attr.key} (${attr.type}, required: ${attr.required}, array: ${attr.array})`);
                });
            } else {
                console.error(data);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

inspect();
