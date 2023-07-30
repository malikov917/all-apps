require('dotenv').config({ path: '../.env' });
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

class OpenAIService {
  constructor() {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }

  async readAudioBuffer(fileName) {
    const filePath = path.join(path.resolve(__dirname, '..'), 'uploads', fileName);
    const audioBuffer = fs.readFileSync(filePath);

    return audioBuffer;
  }

  async transcribeAudio(audioBuffer, fileName) {
    const formData = new FormData();
    formData.append('file', audioBuffer, { fileName, contentType: 'audio/webm' });
    formData.append('model', 'whisper-1');

    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders()
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

  async readAndTranscribeAudio(fileName) {
    const audioBuffer = await this.readAudioBuffer(fileName);
    const transcription = await this.transcribeAudio(audioBuffer, fileName);

    return transcription;
  }
}

module.exports = OpenAIService;
