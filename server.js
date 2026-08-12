const http = require('http');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'chamado-servicedesk');
const port = process.env.PORT || 3000;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

function sendText(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(message);
}

http
  .createServer((req, res) => {
    let reqPath;
    try {
      reqPath = decodeURIComponent(req.url.split('?')[0]);
    } catch {
      sendText(res, 400, 'Bad Request');
      return;
    }

    if (reqPath === '/') reqPath = '/index.html';

    const filePath = path.join(publicDir, reqPath);

    // Evita path traversal: o caminho resolvido precisa permanecer
    // dentro do diretório público.
    const relative = path.relative(publicDir, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      sendText(res, 403, 'Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        sendText(res, 404, 'Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mime[ext] || 'application/octet-stream';
      const isHtml = contentType === 'text/html';

      const headers = {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=86400',
      };

      if (req.method === 'HEAD') {
        res.writeHead(200, headers);
        res.end();
        return;
      }

      res.writeHead(200, headers);
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    });
  })
  .listen(port, () => {
    console.log(`Serving ${publicDir} at http://localhost:${port}`);
  });
