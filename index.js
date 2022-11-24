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

    // get category API
    app.get("/category", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.listen(port, () => console.log(`Assignment 12 is running on ${port}`));
