const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable Cross-Origin Resource Sharing

// API endpoint to get job data
app.get('/api/jobs', async (req, res) => {
    const sheetUrl = process.env.SHEET_URL;

    if (!sheetUrl || sheetUrl.includes('YOUR_GOOGLE_SHEET_EXPORT_URL_HERE')) {
        return res.status(500).json({ message: "Server configuration error: SHEET_URL is not defined in the .env file." });
    }

    try {
        const response = await fetch(sheetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet data. Status: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/csv')) {
            // This is a strong indicator that the URL is wrong, private, or not a direct CSV export link.
            // Google often returns a 200 OK with an HTML page in these cases.
            throw new Error('Received non-CSV data from the sheet URL. Please ensure the URL is a public Google Sheet with "/export?format=csv" at the end.');
        }

        let csvText = await response.text();
        
        // Remove Byte Order Mark (BOM) if present, as it can interfere with parsing
        if (csvText.charCodeAt(0) === 0xFEFF) {
            csvText = csvText.substring(1);
        }

        const json = csvToJson(csvText);

        if (json.length === 0) {
            return res.json([]);
        }

        const actualHeaders = Object.keys(json[0]).map(h => h.toLowerCase().trim());
        const requiredHeaders = ['job title', 'description', 'last date', 'start date', 'category'];
        const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));

        if (missingHeaders.length > 0) {
            throw new Error(`The sheet is missing required columns: ${missingHeaders.join(', ')}.`);
        }

        const parsedJobs = json.map((row, index) => ({
            id: row['id'] || `job-${index}`,
            jobTitle: row['job title'] || 'No Title',
            description: row['description'] || 'No Description',
            category: row['category'] || 'Other',
            lastDate: row['last date'],
            startDate: row['start date'],
            salary: row['salary'],
            responsibilities: row['responsibilities'],
            location: row['location'],
            employmentType: row['employment type'] || row['job type'],
            requiredDocuments: row['required documents'],
            sourceSheetLink: row['link'],
            blogContent: row['blog content'],
        }));

        res.json(parsedJobs);
    } catch (error) {
        console.error('Error in /api/jobs:', error);
        res.status(500).json({ message: error.message || "An internal server error occurred." });
    }
});

// Serve static assets from the root directory
app.use(express.static(path.join(__dirname)));

// For any request that doesn't match an API route or a static file,
// send back the main index.html file. This is essential for single-page applications.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * A robust CSV to JSON converter that handles newlines and commas within quoted fields.
 * This function is moved from the frontend to the backend.
 * @param csv The CSV string to parse.
 * @returns An array of objects.
 */
const csvToJson = (csv) => {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    csv = csv.replace(/\r\n/g, '\n').trim();

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField);
                currentField = '';
            } else if (char === '\n') {
                currentLine.push(currentField);
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    currentLine.push(currentField);
    lines.push(currentLine);

    const nonEmptyLines = lines.filter(line => line.length > 1 || (line.length === 1 && line[0].trim() !== ''));
    if (nonEmptyLines.length < 2) return [];

    const headers = nonEmptyLines.shift().map(h => h.trim().toLowerCase());
    
    return nonEmptyLines.map(line => {
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = line[i] ? line[i].trim() : '';
        });
        return obj;
    });
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
