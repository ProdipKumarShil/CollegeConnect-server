const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require("dotenv").config()

// middleware
app.use(cors())
app.use(express.json())

// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "img-src 'self' data:"); // Allow loading images from 'self' and data URIs
//   next();
// });

app.get('/', (req, res) => {
  res.send("Server is running🚀");
})


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const admissionDB = collegeDB.collection("admission")
    const feedback = collegeDB.collection("feedback")
    
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

    // get single college
    app.get('/colleges/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)};
      const result = await collegeData.findOne(query)
      res.send(result)
    })

    // post admission data
    app.post('/admission', async(req, res) => {
      const admissionData = req.body
      const result = await admissionDB.insertOne(admissionData)
      if(result.insertedId){
        res.send({insert: true})
      }
      else{
        res.send({insert:false})
      }
    })

    // post feedback
    app.post('/feedback', async(req, res) => {
      const userFeedback = req.body
      const result = await feedback.insertOne(userFeedback)
      if (result.insertedId) {
        res.send({ insert: true });
      } else {
        res.send({ insert: false });
      }
    })

    app.get('/allFeedback', async(req, res) => {
      const result = await feedback.find().toArray()
      res.send(result)
    })

    app.get('/myCollege/:email', async(req, res) => {
      const email = req.params.email
      const query = {email: email}
      const result = await admissionDB.find(query).toArray()
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