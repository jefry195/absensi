const SPREADSHEET_ID = "1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOHaNtWI6vARI8aMnkoJh6oC06AzDR1sHDd21Q5R8VhqgG5f1soYnSNmIJHvXzjOM/exec";

const GIDS = {
    users: '0',
    settings: '775821409',
    attendance: '1528320542'
};

/**
 * Fetch CSV data from Google Sheets by GID
 */
async function fetchSheetCSV(gid) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Error fetching GID ${gid}:`, error);
        return null;
    }
}

/**
 * Forward POST payload to Google Apps Script Web App
 */
async function postToAppsScript(payload) {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return { success: true, raw: text };
        }
    } catch (error) {
        console.error('Error posting to Google Apps Script:', error);
        return { success: false, message: error.message };
    }
}

module.exports = {
    SPREADSHEET_ID,
    APPS_SCRIPT_URL,
    GIDS,
    fetchSheetCSV,
    postToAppsScript
};
