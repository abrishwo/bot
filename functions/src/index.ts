// functions/index.ts

import * as functions from 'firebase-functions';
import next  from 'next';

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  exports.nextjs = functions.https.onRequest((req, res) => {
    return handle(req, res);
  });
});
