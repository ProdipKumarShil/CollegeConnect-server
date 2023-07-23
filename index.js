const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require("dotenv").config()

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send("Server is running🚀");
})


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.PASS}@cluster0.ta7i6kc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const collegeDB = client.db("collegeConnect")
    const collegeData = collegeDB.collection("colleges")
    
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    
    // get all the colleges
    app.get('/colleges', async(req, res) => {
      const cursor = collegeData.find()
      const result = await cursor.toArray()
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log("Server is running on ", port)
})