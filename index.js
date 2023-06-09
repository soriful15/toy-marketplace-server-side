const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
require('dotenv').config()
app.use(cors());
app.use(express.json());





// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.uwuwq9x.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
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



    const toyCollection = client.db('toyMarket').collection('toyCollection')


    // app get 
    app.get('/allCollection', async (req, res) => {
      const cursor = toyCollection.find().limit(20)
      const result = await cursor.toArray()
      res.send(result)
    })
    // app get dhara id
    app.get('/allCollection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const singleToy = await toyCollection.findOne(query)
      res.send(singleToy)
    })


    // app post
    app.post('/addToy', async (req, res) => {
      const newToy = req.body

      // newToy.createdAt = new price()


      if (!newToy) {
        return res.status(404).send({ message: 'body data not found' })
      }
      console.log(newToy)
      const result = await toyCollection.insertOne(newToy)
      res.send(result)

    })


    app.get("/myToys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { seller_email: req.query.email };
      }

      console.log(req.query.sort);
      let sortOrder;
      if (req.query?.sort === "highest") {
        sortOrder = -1;
      } else if (req.query?.sort === "lowest") {
        sortOrder = 1;
      }

      const result = await toyCollection.find(query).sort({ price: sortOrder }).toArray();
      res.send(result);
    });

    // get delete
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })




    // app  put
    app.put('/allCollection/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)
      const updatedToy = req.body
      console.log(updatedToy)
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedToy.quantity,
          price: updatedToy.price,
          details: updatedToy.details
        }
      }
      const result = await toyCollection.updateOne(filter, updatedDoc, option)
      res.send(result)

    })


    // search
    const indexKeys = { name: 1 }
    const indexOptions = { name: 'name' }
    const result = await toyCollection.createIndex(indexKeys, indexOptions);

    app.get('/toySearch/:text', async (req, res) => {
      const searchText = req.params.text
      const result = await toyCollection.find({

        $or: [
          { name: { $regex: searchText, $options: 'i' } }
        ]
      }).toArray()

      res.send(result)
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
  res.send('Toy Market Place is running')
})

app.listen(port, () => {
  console.log(`Toy Market Place is running on port ${port}`)
})