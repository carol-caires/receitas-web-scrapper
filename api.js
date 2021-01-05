const html = require('./tools/html');
const request = require('./tools/request')

module.exports = {
    search: async function (searchStr) {
        searchStr = searchStr.replace(/ /g, '+')
        let res
        await request.searchRecipe(searchStr)
        .then((resp) => {
            res = html.parse(resp)
        })
        .catch((err) => {
            return err
        })
        return res
    }
}