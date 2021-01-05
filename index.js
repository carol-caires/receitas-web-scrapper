const express = require("express");
const app = express();
const api = require('./api')

app.get("/search/:name", (req, res, next) => {
    api.search(req.params.name)
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
