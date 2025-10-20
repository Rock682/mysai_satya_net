# Excel Job Board with Secure Backend

This project displays job listings from a Google Sheet. It now includes a Node.js backend to securely handle the Google Sheet URL, preventing it from being exposed in the frontend code.

## Project Structure

- **Frontend**: A React application located in the root directory (`index.tsx`, `App.tsx`, etc.).
- **Backend**: A Node.js/Express server located in `server.js`.

## How It Works

1. The Node.js server starts and can serve both the frontend files and the backend API.
2. When you access the server's URL, it sends the `index.html` and the React application to your browser.
3. The React app then makes a request to a relative API endpoint (`/api/jobs`).
4. The same Node.js server receives this API request, privately reads the Google Sheet URL from a secure `.env` file, fetches the data, converts it to JSON, and sends it back to the React app.
5. The React app receives the JSON data and displays the job listings.

## Setup and Running Instructions

To run this project, you need to set up and run the server.

### Prerequisites

You must have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Create the `.env` File

This is the most important step for securing your sheet URL.

1. In the main root directory of the project, create a new file named `.env`.
2. Open the `.env` file and add your Google Sheet URL like this:

   ```
   SHEET_URL="YOUR_GOOGLE_SHEET_EXPORT_URL_HERE"
   ```

   Replace `"YOUR_GOOGLE_SHEET_EXPORT_URL_HERE"` with the actual URL. Make sure the URL ends with `/export?format=csv`.

   **This file is already listed in `.gitignore`, so it will not be committed to your repository.**

### Step 2: Install Dependencies

Open your terminal in the project's root directory and run the following command to install the necessary packages for the server:

```bash
npm install
```

### Step 3: Run the Server

Once the installation is complete, start the server with this command:

```bash
npm start
```

You should see a message in your terminal:
`Server is running on http://localhost:3001`

**Leave this terminal window open.**

### Step 4: Access the Application

Open your web browser and navigate to `http://localhost:3001`. The server will now serve the entire application, including the frontend and the backend API.
