const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// CoffeeStore
// INE2f4fAs2jZauMY

// console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.76h69in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection('coffee');
    const userColltection = client.db("coffeeDB").collection("user");

    app.get('/coffee', async (req, res) => {
      const course = coffeeCollection.find()
      const result = await course.toArray()
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const coffee = req.body
      console.log(id, coffee);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          detail: coffee.detail,
          photo: coffee.photo,
        }
      }
      const result = coffeeCollection.updateOne(filter, updateCoffee, options)
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    ///===============  user relaterd API  =============
    app.get('/user', async (req, res) => {
      const cursor = userColltection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userColltection.insertOne(user);
      console.log(user);
      res.send(result)
    })

    app.patch('/user', async (req, res) =>{
      const user = req.body
      const filter = {email: user.email}
      const updateEmail = {
        $set: {
          lastLoginAt: user.lastLoginAt
        }
      }
      const result = await userColltection.updateOne(filter, updateEmail)
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(id, query);
      const result = await userColltection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee server is running')
})

app.listen(port, () => {
  console.log("server is running on port:", port);
})