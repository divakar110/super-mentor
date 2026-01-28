document.getElementById('clipBtn').addEventListener('click', async () => {
    const btn = document.getElementById('clipBtn');
    const status = document.getElementById('status');

    btn.disabled = true;
    btn.innerText = "Clipping...";
    status.innerText = "";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Determine environment (Local vs Prod) - defaulted to prod for "Deploy" request, 
        // but let's try to detect or just default to Prod? 
        // Or checking generic "localhost" permissions??
        // Let's default to Prod URL for the "Deployed" version, but users can edit it.
        const API_URL = "https://anti-gravity.vercel.app/api/ingest";
        // const API_URL = "http://localhost:3000/api/ingest"; // Uncomment for local dev

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: tab.url })
        });

        if (response.ok) {
            status.innerHTML = "<span class='success'>Saved to Notebook! ✨</span>";
            btn.innerText = "Success";
        } else {
            const data = await response.json();
            if (response.status === 401) {
                status.innerHTML = "<span class='error'>Unauthorized. Please log in as Admin on the website.</span>";
            } else {
                status.innerHTML = `<span class='error'>Error: ${data.error || "Failed"}</span>`;
            }
            btn.innerText = "Try Again";
            btn.disabled = false;
        }

    } catch (e) {
        console.error(e);
        status.innerHTML = "<span class='error'>Network Error. Check console.</span>";
        btn.innerText = "Try Again";
        btn.disabled = false;
    }
});
