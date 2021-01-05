const html = require('./tools/html');
const request = require('./tools/request')

module.exports = {
    search: async function (searchStr) {
        searchStr = searchStr.replace(/ /g, '+')
        let res
        await request.searchRecipes(searchStr)
        .then((resp) => {
            res = html.parseRecipesList(resp)
        })
        .catch((err) => {
            return err
        })
        return res
    },
    get_recipe: async function (id) {
        await request.getRecipeByID(id)
        .then((resp) => {
            res = html.parseRecipe(resp)
        })
        .catch((err) => {
            return err
        })
        return res
    }
}