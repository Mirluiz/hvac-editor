const http = require('http');
const fs = require('fs')
const path = require('path');


http.createServer((req, res) => {

    let filePath = '.' + req.url;
    if (filePath == './')
        filePath = './index.html';

    const extName = path.extname(filePath);
    let contentType = 'text/html';
    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, function (err,content) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }  else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
    // fs.createReadStream('index.html').pipe(res)
}).listen(3000, '127.0.0.1');