/* eslint-disable no-param-reassign */
const scrapper = require('./tools/scrapper');
const request = require('./tools/request');

module.exports = {
  async search(searchStr) {
    searchStr = searchStr.replace(/ /g, '+');
    let res;
    await request.searchRecipes(searchStr)
      .then((resp) => {
        res = scrapper.parseRecipesList(resp);
      })
      .catch((err) => err);
    return res;
  },
  async get_recipe(id) {
    let res;
    await request.getRecipeByID(id)
      .then((resp) => {
        res = scrapper.parseRecipe(resp);
      })
      .catch((err) => err);
    return res;
  },
};
