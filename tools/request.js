/* eslint-disable no-return-assign */
/* eslint-disable global-require */
const { promisify } = require('util');
const constants = require('../constants');

function request(url) {
  let data = '';
  const get = promisify(require('https').get);

  return new Promise((resolve, reject) => {
    get(url)
      .then((resp) => resp)
      .catch((resp) => {
        resp.on('data', (chunk) => data += chunk);
        resp.on('end', () => resolve(data));
        resp.on('error', (err) => reject(new Error(err)));
      });
  });
}

module.exports = {
  searchRecipes(searchStr) {
    const url = `${constants.tg_base_url}/busca?q=${searchStr}`;
    return request(url);
  },
  getRecipeByID(id) {
    const url = `${constants.tg_base_url}/receita/${id}.html`;
    return request(url);
  },
};
