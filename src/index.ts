import express from 'express';
import fs from 'fs';
import { getData } from './data';
import cors from 'cors';
import translitRusEng from 'translit-rus-eng';
import { run } from './parse';
import { runCron } from './cron';

const app = express();
app.use(cors());
const port = process.env.PORT || 3004;

runCron();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/results', (req, res) => {
  const files = fs.readdirSync('./src/results');
  const params = getData();

  const result = files.map((file) => {
    const fileContent = fs.readFileSync(`./src/results/${file}`, 'utf8');
    const data = JSON.parse(fileContent);
    const query = params.queries.find((query) => {
      return file.includes(translitRusEng(query, { slug: true }));
    });

    return {
      query,
      skus: params.skus,
      data,
    };
  });

  res.json(result);
});

app.post('/run', (req, res) => {
  run();
  res.json({ status: 'ok' });
});
