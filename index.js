const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // get category API
    app.get("/category", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { category_id: id };
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });

    // booking posted

    app.post("/booking", async (req, res) => {
      const bookings = req.body;
      // const name = req.body.product_name;
      // const email = req.body.email;
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
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.listen(port, () => console.log(`Assignment 12 is running on ${port}`));
