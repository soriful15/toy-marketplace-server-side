const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
// middleware
require('dotenv').config()
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Toy Market Place is running')
})

app.listen(port, () => {
  console.log(`Toy Market Place is running on port ${port}`)
})