const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();
// middle wares
app.use(cors());
app.use(express.json());

// root api
app.get("/", async (req, res) => {
  res.send("Assignment 12 server is running ");
});

// mongodb database

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.mbnoo25.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("gadgetBazar")
      .collection("categories");
    const productCollection = client
      .db("gadgetBazar")
      .collection("all_products");
    const bookingCollection = client.db("gadgetBazar").collection("bookings");
    const userCollection = client.db("gadgetBazar").collection("users");

    // get category API
    app.get("/category", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    app.get("/category/:name", async (req, res) => {
      const name = req.params.name;
      // console.log(name);
      const query = { category_Name: name };
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/seller/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    // sellers and delete users
    app.get("/seller", async (req, res) => {
      const query = { type: "seller" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/seller/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // users and delete users
    app.get("/user", async (req, res) => {
      const query = { type: "user" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const name = req.body;
      // const query = { category_Name: name };
      const products = await productCollection.insertOne(name);
      res.send(products);
    });

    // booking posted

    app.post("/booking", async (req, res) => {
      const bookings = req.body;

      const query = {
        product_name: bookings.product_name,
        email: bookings.email,
      };
      console.log(query);
      const alreadyBooked = await bookingCollection.find(query).toArray();
      if (alreadyBooked.length) {
        const message = "You have a booking already";
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });

    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      console.log("tokenr", req.headers.authorization);
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // user api

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const quey = {};
      const users = await userCollection.find(quey).toArray();
      res.send(users);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.type });
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        return res.send({ accessToken: token });
      }
      console.log(user);
      res.status(403).send({ accessToken: "" });
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.listen(port, () => console.log(`Assignment 12 is running on ${port}`));
