import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import { parse } from 'fast-csv';
import synchronizedShuffle from 'synchronized-array-shuffle';
import sanitizeHtml from 'sanitize-html';
import urlRegex from 'url-regex';
import natural from 'natural';
import svm from 'svm';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SVM = new svm.SVM();

const M = 5572;
const MTest = 5000;
const MTrain = M - MTest;

let X = [];
let y = [];

// Load spam data
const stream = fs
  .createReadStream('../server/spam.csv')
  .pipe(parse())
  .on('data', fromFile)
  .on('end', init);

function fromFile(data) {
  if (data[0] !== 'spam' && data[0] !== 'ham') {
    return;
  }

  let label = data[0];
  let feature = data[1];

  y.push(label);
  X.push(feature);
}

function normalizeUrl(string) {
  return string.replace(urlRegex(), ' httpaddress ');
}

function createVocabularyList(X) {
  const groupedByWord = X.reduce((group, xs) => {
    xs.forEach(word => {
      if (group[word]) {
        group[word]++;
      } else {
        group[word] = 1;
      }
    });

    return group;
  }, {});

  const POPULARITY = 5;
  const groupedByPopularWord = Object.keys(groupedByWord).reduce((list, word) => {
    const count = groupedByWord[word];

    if (count > POPULARITY) {
      list.push(word);
    }

    return list;
  }, []);

  return groupedByPopularWord;
}

function featureExtraction(vocabularyList) {
  return function createFeatureVector(xs) {
    return vocabularyList.map((vocable) => {
      if (xs.includes(vocable)) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

function getDataSets(X, y, size) {
  if (size > M) {
    return;
  }

  const XTrain = [];
  const yTrain = [];
  const XTest = [];
  const yTest = [];

  Array(M).fill().map((v, i) => {
    if (i < size) {
      XTrain.push(X[i]);
      yTrain.push(y[i]);
    } else {
      XTest.push(X[i]);
      yTest.push(y[i]);
    }
  });

  return { XTrain, yTrain, XTest, yTest };
}

function trainWithNaturalsBayesClassifier(XTrain, yTrain) {
  const classifier = new natural.BayesClassifier();

  Array(MTrain).fill().forEach((v, i) => classifier.addDocument(XTrain[i], yTrain[i]));
  classifier.train();

  return classifier;
}

function init() {
  /* ------------------------ */
  //  Train & Predict with SVM //
  /* ------------------------ */

  console.log('Started training with SVM, this will take time ...');

  y = y.map(v => v === 'spam' ? 1 : -1);

  const shuffled = synchronizedShuffle([X, y]);
  const { XTrain, yTrain, XTest, yTest } = getDataSets(shuffled[0], shuffled[1], MTrain);

  if (XTrain.length > 0 && yTrain.length > 0) {
    SVM.train(XTrain, yTrain);
    const YPredict = SVM.predict(XTest);
    const trueHits = YPredict.filter((v, i) => v === yTest[i]).length;
    const accuracy = (trueHits / MTest) * 100;
    console.log(accuracy);
  } else {
    console.log('No training data available for SVM.');
  }

  // Set up a route for proxying requests
  app.post('/', async (req, res) => {
    const { url_text } = req.body;
    console.log('Received URL:', url_text);

    try {
      const hostname = await getHostname(url_text);
     // const isSpam = detectSpam(hostname);
      res.send({ hostname});
    } catch (error) {
      console.error('Error:', error.message, url_text);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/spam', async (req, res) => {
    try {
      const sms_text = req.body.sms_text;

  
      if (!sms_text) {
        return res.status(400).send('Bad Request: Missing sms_text in the request body');
      }
  
      console.log('Received SMS:', sms_text);
  
      const isSpam = detectSpam(sms_text);
      console.log('Is Spam:', isSpam);
  
      res.send({ isSpam });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Proxy server is running at http://localhost:${PORT}`);
  });
}

function detectSpam(sms_text) {
  const isSpam = SVM.predict(sms_text)[0];
  return isSpam;
}

async function getHostname(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }

    const html = await response.text();
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    console.log('Hostname:', hostname);
    return hostname;
  } catch (error) {
    console.error('Error in getHostname:', error.message);
    throw error;
  }
}
