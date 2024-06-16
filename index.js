const express = require("express");
require('dotenv').config();

const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require('./models/url');

const app = express();
const PORT = 8001;
app.use(express.json());  // to read the data from body

app.use('/url', urlRoute);
app.use('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        }
    });
    res.redirect(entry.redirectURL);
});

connectToMongoDB(process.env.mongodb)
    .then(() => { console.log("MongoDB connected") })
    .catch(() => { console.log("Something went wrong with MongoDB") });

app.listen(PORT, () => { console.log(`Server Started on PORT : ${PORT}`) });