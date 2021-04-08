const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require('dotenv').config()
const app = express();
const bodyParser = require("body-Parser");
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//mongodb configurations

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvcf9.mongodb.net/t-shirt-planet?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


client.connect((err) => {

  //Collections
  const productsCollection = client.db("t-shirt-planet").collection("products");
  const ordersCollection = client.db("t-shirt-planet").collection("orders");

  //Products Database
  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //Adding Product To Database
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log("adding new event: ", newProduct);
    productsCollection.insertOne(newProduct).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });


  //Find a Prodouct By Key
  app.get("/product/:key", (req, res) => {
    const id = ObjectID(req.params.key);
    productsCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });


  // Deleting a product By Admin
  app.delete("deleteProduct/:_id", (req, res) => {
    console.log(req.params._id)
    const _id = ObjectID(req.params._id);
    productsCollection.deleteOne({ _id: _id }).toArray((err, documents) =>
      res.send(!!documents.value)
    );
  });


  //Review Orders by admin
  app.get("/orders", (req, res) => {
    ordersCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //Adding Order by user
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    console.log("adding new event: ", newOrder);
    ordersCollection.insertOne(newOrder).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

 
  //To get user database by email

  app.get("/order/", (req, res) => {
    ordersCollection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });



  //   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
