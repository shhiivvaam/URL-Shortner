const express = require("express");
const path = require("path");
require('dotenv').config();

const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter")
const URL = require('./models/url');

const app = express();
const PORT = process.env.PORT  || 8001;

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));
// app.set('views', path.join(__dirname, 'views'));

app.use(express.json());  // to read the data from body
app.use(express.urlencoded({ extended: false }));    // for parsing some FORM Data


app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
});

app.use('/', staticRouter);
app.use('/url', urlRoute);
app.get('/url/:shortId', async (req, res) => {
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