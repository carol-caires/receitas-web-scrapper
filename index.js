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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
    console.log("Server running on port "+port);
});
