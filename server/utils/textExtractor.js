const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

module.exports = { extractTextFromFile };
