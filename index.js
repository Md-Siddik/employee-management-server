const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mmuv9dp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const employeeCollection = client.db('EM-Espial').collection('User');
    const workCollection = client.db('EM-Espial').collection('work')

    app.post('/register', async (req, res) => {
      const employee = req.body;
      console.log(employee);
      const result = await employeeCollection.insertOne(employee);
      res.send(result);
    })

    app.get('/register', async (req, res) => {
      const cursor = employeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.patch('/register/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedItem = req.body;
      const item = {
        $set: {
          verified: updatedItem.verified,
        }
      }
      
      const result = await employeeCollection.updateOne(filter, item);
      res.send(result);
    })

    app.get('/register/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await employeeCollection.findOne(query);
      res.send(result);
    })

    app.get('/work-sheet', async (req, res) => {
      const cursor = workCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('em is espiling')
})

app.listen(port, () => {
  console.log(`em-Espial server is running on port ${port}`)
})