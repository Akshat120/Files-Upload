require('dotenv').config();
const app = require('./app');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client;
  app.listen(3000,()=>{
      console.log('Server Started.');
  });
});
