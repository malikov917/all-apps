const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');  // Import the package

const apiKey = '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';
const model = 'whisper-1';

async function readAudioBuffer() {
  const filePath = path.join(__dirname, 'uploads', '123.webm');
  const audioBuffer = fs.readFileSync(filePath);

  return audioBuffer;
}

async function transcribeAudio(audioBuffer) {
  const formData = new FormData();
  formData.append('file', audioBuffer, { filename: '123.webm', contentType: 'audio/webm' });
  formData.append('model', model);

  const config = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      ...formData.getHeaders() // Add the form-data headers
    },
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
    if (response.status === 200) {
      const transcription = response.data.text;
      return transcription;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const audioBuffer = await readAudioBuffer();
  const transcription = await transcribeAudio(audioBuffer);

  console.log(transcription);
}

main();
