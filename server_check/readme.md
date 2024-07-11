To write a Node.js REST server that queries different server endpoints and retrieves information such as their status and headers, you can use the `express` framework and the `axios` library for making HTTP requests. Below is a basic implementation:

1. **Install the necessary packages**:
   ```bash
   npm init -y
   npm install express axios
   ```

2. **Create the server**:
   Create a file named `server.js` and add the following code:

   ```javascript
   const express = require('express');
   const axios = require('axios');

   const app = express();
   const port = 3000;

   app.use(express.json());

   app.post('/check', async (req, res) => {
       const { url } = req.body;

       if (!url) {
           return res.status(400).json({ error: 'URL is required' });
       }

       try {
           const response = await axios.get(url);
           const headers = response.headers;
           const status = response.status;
           res.json({ status, headers });
       } catch (error) {
           if (error.response) {
               res.json({ status: error.response.status, headers: error.response.headers });
           } else if (error.request) {
               res.status(500).json({ error: 'No response received from the server' });
           } else {
               res.status(500).json({ error: error.message });
           }
       }
   });

   app.listen(port, () => {
       console.log(`Server is running on http://localhost:${port}`);
   });
   ```

3. **Running the server**:
   Start the server by running:
   ```bash
   node server.js
   ```

4. **Testing the server**:
   You can test the server using a tool like `curl`, `Postman`, or any HTTP client. Here’s an example using `curl`:
   ```bash
   curl -X POST http://localhost:3000/check -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
   ```

### Explanation:
- **Express Server Setup**: We set up a basic Express server that listens on port 3000.
- **Endpoint**: The `/check` endpoint accepts a POST request with a JSON body containing the `url` to be checked.
- **Axios Request**: We use `axios` to send a GET request to the provided URL and retrieve the status and headers.
- **Error Handling**: We handle different types of errors (e.g., no response from the server, network errors, etc.) and respond with appropriate status codes and messages.

This basic implementation can be expanded with additional features such as:
- Validating the URL format.
- Supporting different HTTP methods (GET, POST, etc.).
- More detailed logging and error handling.
- Caching results to avoid querying the same URL multiple times in a short period.

Would you like to add any specific features or customizations to this server?
