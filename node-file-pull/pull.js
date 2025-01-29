const fs = require('fs');
const path = require('path');
const axios = require('axios');

const fontsDir = path.join(__dirname, 'fonts');
const fontUrls = [
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  // Add more Google Fonts URLs here
];

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir);
}

async function downloadFont(url) {
  try {
    const response = await axios.get(url, { responseType: 'text' });
    
    // Extract actual font file URLs from the CSS file
    const fontUrls = response.data.match(/https:\/\/fonts.gstatic.com\/[^)]+/g);

    if (fontUrls) {
      for (const fontUrl of fontUrls) {
        const fontName = path.basename(new URL(fontUrl).pathname);
        const fontPath = path.join(fontsDir, fontName);

        // Download and save the font file
        const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(fontPath, fontResponse.data);
        console.log(`Downloaded: ${fontName}`);
      }
    }
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

async function downloadAllFonts() {
  for (const url of fontUrls) {
    await downloadFont(url);
  }
  console.log('All fonts downloaded.');
}

downloadAllFonts();
