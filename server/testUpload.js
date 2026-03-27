const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  const form = new FormData();
  // Ensure we upload a PDF
  const testFilePath = path.join(__dirname, 'test.pdf');
  
  // create dummy pdf if it doesn't exist
  if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 <<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\n>>\n>>\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 55\n>>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n291\n%%EOF');
  }

  form.append('resume', fs.createReadStream(testFilePath));

  try {
    const response = await axios.post('http://localhost:5000/upload', form, {
      headers: form.getHeaders(),
    });
    console.log('Upload successful! Response:', response.data);
  } catch (error) {
    console.error('Upload failed!', error.response ? error.response.data : error.message);
  }
}

testUpload();
