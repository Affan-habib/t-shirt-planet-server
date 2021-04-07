const express = require("express");
const ObjectID = require("mongodb").ObjectID;
require('dotenv').config()
const app = express();
const bodyParser = require("body-Parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/addProduct", (req, res) => {
  const product = req.body;
  products.insertOne(product);
  res.send("Hello World!");
});

//mongodb

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvcf9.mongodb.net/t-shirt-planet?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("t-shirt-planet").collection("products");
  const ordersCollection = client.db("t-shirt-planet").collection("orders");

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log("adding new event: ", newProduct);
    productsCollection.insertOne(newProduct).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    console.log("adding new event: ", newOrder);
    ordersCollection.insertOne(newProduct).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/product/:key", (req, res) => {
    const id = ObjectID(req.params.key);
    productsCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.delete("deleteProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log("delete this", id);
    ProductsCollection.findOneAndDelete({ _id: id }).then((documents) =>
      res.send(!!documents.value)
    );
  });

  //   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
