require('dotenv').config({ path: '../.env' });
const { Configuration, OpenAIApi } = require("openai");

class OpenAIService {
  constructor() {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }
}

module.exports = OpenAIService;
