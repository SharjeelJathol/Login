const {dir} = require("console");
const express = require("express");
const {MongoClient} = require("mongodb");
const bcrypt=require('bcryptjs')

const dotenv=require('dotenv')
dotenv.config({ path: './config.env' });

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    })
); // for parsing application/x-www-form-urlencoded forms that we receive in post requests

// Connection URI
const uri = process.env.URI;
// Create a new MongoClient
const client = new MongoClient(uri);


const dbName = process.env.DBNAME;
const collectionName = process.env.COLLECTIONNAME

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post('/login', (req, res) => {
    const userInfo = {
        _id: req.body.userName,
        password: req.body.password
    }
    async function run() {
        try {
            await client.connect();
            await client.db(dbName).command({
                ping: 1
            })

            const db = client.db(dbName)
            const collection = db.collection(collectionName)

            result = await collection.findOne({
                _id: userInfo._id
            })
            if (result) {
                if (bcrypt.compareSync(userInfo.password, result.password))
                    throw 'You are logged in'
                else
                    throw 'Password incorrect'
            } else
                throw 'User does not exists'
        } catch (e) {
            res.write('<h1>' + e + '</h1>')
        } finally {
            await client.close();
            res.send();
        }
    }
    run().catch(console.dir)
})

app.listen(2000, () => console.log('Listening to port 2000.'))