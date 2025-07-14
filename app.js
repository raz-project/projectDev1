// Import built-in 'http' module to create a web server
const http = require('http');

// Import 'fs' module to interact with the file system (reading files, etc.)
const fs = require('fs');

// Import 'path' module to handle and manipulate file paths safely
const path = require('path');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Construct the full file path to 'index.html' inside the 'web' folder
  const filePath = path.join(__dirname, 'web', 'index.html');

  // Read the HTML file from disk
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If an error occurs (e.g., file not found), send a 500 Internal Server Error response
      res.writeHead(500);
      res.end('Server Error');
    } else {
      // If the file is read successfully, send a 200 OK response with the file content
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

// Start the server and listen on port 80
server.listen(80, () => {
  // Log a message when the server is up and running
  console.log('Server running at http://localhost:8080');
});
