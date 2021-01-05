const express = require("express");
const app = express();
const api = require('./api')

app.get("/bolo", (req, res, next) => {
    api.search()
    .then((resp) => {
        res.json(resp)
    })
    .catch((err) => {
        console.log(err)
        return res.status(500).json({"error": err})
    })
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
