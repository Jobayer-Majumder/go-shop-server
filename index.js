const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config({ path: './.env' })


const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jobayer.eggfq.mongodb.net/goShop?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const pdCollection = client.db("goShop").collection("product");
  const orderCollection = client.db("goShop").collection("orders");

  // <<<< created get api from here (
  app.get('/getProducts', (req, res) => {
    pdCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  app.get('/checkOut/:id', (req, res) => {
    const pdId = req.params.id;
    pdCollection.find({ _id: ObjectId(pdId) })
      .toArray((err, document) => {
        res.send(document)
      });
  });

  app.get('/getOrder', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  app.get('/manageProduct', (req, res) => {
    pdCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      });
  });
  // <<<< get api end )


  // created post api from here (
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    pdCollection.insertOne(product)
      .then(result => {
        res.redirect('/')
      })
  });

  app.post('/addOrder', (req, res) => {
    const orderInfo = req.body;
    orderCollection.insertOne(orderInfo)
      .then(result => {
        res.send(result)
      })
  });
  // end of post api ) 


  // created delete api from here (
  app.delete('/deleteProduct/:id', (req, res) => {
    const pdId = ObjectId(req.params.id);
    pdCollection.deleteOne({ _id: pdId })
      .then(result => {
        res.redirect('/')
        console.log(result)
      })
  });
  // end of delete api )

});


app.listen(process.env.PORT || port, () => console.log('listening port', port))