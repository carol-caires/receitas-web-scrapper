const express = require('express');

const app = express();
const service = require('./service');

app.get('/search/:name', (req, res) => {
  service.search(req.params.name)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });
});

app.get('/recipe/:id', (req, res) => {
  service.get_recipe(req.params.id)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });
});

let port = process.env.PORT;
if (port == null || port === '') {
  port = 3000;
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
