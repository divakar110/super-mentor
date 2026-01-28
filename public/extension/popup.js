document.getElementById('clipBtn').addEventListener('click', async () => {
    const btn = document.getElementById('clipBtn');
    const status = document.getElementById('status');
    const titleStatus = document.querySelector('h2');

    btn.disabled = true;
    btn.innerText = "Processing...";
    status.innerText = "";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        let shouldScrapeContent = false;
        let scrapedData = null;

        // Check if NotebookLM
        if (tab.url.includes("notebooklm.google.com")) {
            status.innerText = "Detecting NotebookLM Content...";
            shouldScrapeContent = true;

            // Execute script to grab main text
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // Try to grab the main content. This is heuristic as class names change.
                    // The 'Guidance' or 'Study Guide' usually is in a scrollable main container.
                    // Let's grab the entire body text but clean it up slightly? Or just body is fine for RAG.
                    // A better approach for specific components (like "Analysis") needs inspecting the DOM structure manually.
                    // For now, grabbing all visible text is the most robust universal clipper.
                    return document.body.innerText;
                }
            });

            if (results && results[0] && results[0].result) {
                scrapedData = results[0].result;
            }
        }

        // Determine correct API and Payload
        const API_URL = shouldScrapeContent
            ? "https://anti-gravity.vercel.app/api/materials"
            : "https://anti-gravity.vercel.app/api/ingest";

        // Local Dev Override (optional)
        // const API_URL = shouldScrapeContent 
        //     ? "http://localhost:3000/api/materials"
        //     : "http://localhost:3000/api/ingest";

        const payload = shouldScrapeContent ? {
            title: "NotebookLM Export " + new Date().toLocaleDateString(),
            subject: "General",
            type: "pdf", // Treat as 'pdf' type for text content to show up in Study list as a doc
            content: scrapedData,
            url: tab.url
        } : { url: tab.url };

        const response = await fetch(API_URL, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
