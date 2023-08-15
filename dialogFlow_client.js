const dialogflow = require('@google-cloud/dialogflow');
const { v4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

app.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const projectId = 'your_project_id';
    const sessionClient = new dialogflow.SessionsClient({ keyFilename: 'your_key_file_path' });
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, v4());

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.message,
          languageCode: 'en-US',
        },
      },
    };

    // Log the request input
    console.log(`Request input: ${req.body.message}`);

    const responses = await sessionClient.detectIntent(request);


    console.log('Full response from Dialogflow:', responses);

    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.json({ response: result.fulfillmentText });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
