document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const credentialForm = document.getElementById('credentialForm');
    const urlList = document.getElementById('urlList');
    const credentialsList = document.getElementById('credentialsList');
    const downloadCsvBtn = document.getElementById('downloadCsv');
    const downloadPdfBtn = document.getElementById('downloadPdf');

    // Function to load URLs from localStorage and display them
    function loadUrls() {
        const urls = JSON.parse(localStorage.getItem('urls')) || [];
        urls.sort((a, b) => a.title.localeCompare(b.title)); // Sort URLs by title
        urlList.innerHTML = '';
        urls.forEach(url => {
            const urlItem = document.createElement('div');
            urlItem.className = 'url-item';
            urlItem.innerHTML = `
                <a href="${url.link}" target="_blank">${url.title}</a>
                <span> - Added on: ${url.time}</span>
            `;
            urlList.appendChild(urlItem);
        });
    }

    // Function to load credentials from localStorage and display them
    function loadCredentials() {
        const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
        credentials.sort((a, b) => a.username.localeCompare(b.username)); // Sort credentials by username
        credentialsList.innerHTML = '';
        credentials.forEach(cred => {
            const credItem = document.createElement('div');
            credItem.className = 'credential-item';
            credItem.innerHTML = `
                <strong>Username:</strong> ${cred.username}<br>
                <strong>Password:</strong> ${cred.password}<br>
                <strong>URL:</strong> <a href="${cred.url}" target="_blank">${cred.url}</a><br>
                <strong>Description:</strong> ${cred.description || 'N/A'}<br>
                <strong>Added on:</strong> ${cred.time || 'N/A'}
            `;
            credentialsList.appendChild(credItem);
        });
    }

    // Function to save a new URL to localStorage
    function saveUrl(title, link, time) {
        const urls = JSON.parse(localStorage.getItem('urls')) || [];
        urls.push({ title, link, time });
        localStorage.setItem('urls', JSON.stringify(urls));
    }

    // Function to save new credentials to localStorage
    function saveCredential(username, password, url, description) {
        const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
        credentials.push({ username, password, url, description, time: new Date().toLocaleString() });
        localStorage.setItem('credentials', JSON.stringify(credentials));
    }

    // Handle URL form submission
    urlForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('urlTitle').value;
        const link = document.getElementById('urlLink').value;
        const time = new Date().toLocaleString();

        saveUrl(title, link, time);
        loadUrls();

        urlForm.reset();
    });

    // Handle Credential form submission
    credentialForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('credUsername').value;
        const password = document.getElementById('credPassword').value;
        const url = document.getElementById('credUrl').value;
        const description = document.getElementById('credDescription').value;

        saveCredential(username, password, url, description);
        loadCredentials();

        credentialForm.reset();
    });

    // Function to download URLs and credentials as a PDF
    function downloadPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("My URLs:", 10, 10);

        const urls = JSON.parse(localStorage.getItem('urls')) || [];
        let y = 20;
        urls.forEach((url, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${url.title}`, 10, y);
            doc.text(`URL: ${url.link}`, 10, y + 10);
            doc.text(`Added on: ${url.time}`, 10, y + 20);
            y += 30;
        });

        doc.addPage();
        doc.setFontSize(16);
        doc.text("My Credentials:", 10, 10);

        const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
        y = 20;
        credentials.forEach((cred, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. Username: ${cred.username}`, 10, y);
            doc.text(`Password: ${cred.password}`, 10, y + 10);
            doc.text(`URL: ${cred.url}`, 10, y + 20);
            doc.text(`Description: ${cred.description || 'N/A'}`, 10, y + 30);
            doc.text(`Added on: ${cred.time}`, 10, y + 40);
            y += 50;
        });

        doc.setFontSize(10);
        doc.text("Developed by Teraita Inc", 10, doc.internal.pageSize.height - 20);
        doc.text("https://teraita.vercel.app/", 10, doc.internal.pageSize.height - 10);

        doc.save('data.pdf');
    }

    // Function to download URLs and credentials as a CSV
    function downloadCsv() {
        const urls = JSON.parse(localStorage.getItem('urls')) || [];
        const credentials = JSON.parse(localStorage.getItem('credentials')) || [];

        const csvData = [
            ['Type', 'Title/Username', 'Link/URL', 'Added on/Password', 'Description']
        ];

        urls.forEach(url => {
            csvData.push(['URL', url.title, url.link, url.time, '']);
        });

        credentials.forEach(cred => {
            csvData.push(['Credential', cred.username, cred.url, cred.password, cred.description || '']);
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
    }

    // Add event listeners for download buttons
    downloadCsvBtn.addEventListener('click', downloadCsv);
    downloadPdfBtn.addEventListener('click', downloadPdf);

    // Initial load of URLs and credentials
    loadUrls();
    loadCredentials();
});
