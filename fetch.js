const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'guns.lol',
  path: '/joguesujo',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('fetched_guns.html', data);
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
  });
}).on('error', (err) => {
  console.error(err);
});
