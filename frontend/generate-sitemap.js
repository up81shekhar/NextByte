import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

// Yahan tum apne questions ki list fetch kar sakte ho ya hardcode kar sakte ho
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/admin/login', changefreq: 'monthly', priority: 0.5 },
  // Yahan dynamic loop laga dena jo tumhare database se saare question URLs le aaye
];

const stream = new SitemapStream({ hostname: 'https://nextbyte-gold.vercel.app/' });

streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  createWriteStream('./public/sitemap.xml').write(data)
);