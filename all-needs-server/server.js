const express = require('express');
const multer  = require('multer');
const path = require("path");
const bodyParser = require('body-parser');
const { join } = require('path');
const OpenAISummarizer = require('./ai/open-ai-service');

const app = express();
app.set("port", process.env.PORT || 3000);

const uiLinks = `<a href="/">HOME</a>
                <a href="/marketing-ai-helper">Marketing AI Helper</a>
                <a href="/check-puppeteer">check puppeteer</a>
                <a href="/test">test</a>`;

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.webm')
    }
});

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.send(`
        <p>You are on the HOME page. . Right now its ${Date()}</p>
        ${uiLinks}
    `);
});

app.post('/ai/voice-to-text/audio', upload.single('audio'), async (req, res) => {

    const openAIService = new OpenAISummarizer();
    const transcription = await openAIService.readAndTranscribeAudio(req.file.filename);

    res.json({ transcription });
    res.sendStatus(200);
});

app.listen(app.get("port"), () =>
    console.log("app running on port", app.get("port"))
);
