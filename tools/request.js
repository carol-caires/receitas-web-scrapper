
const html = require('./html');
const { promisify } = require('util');
const constants = require('../constants')

module.exports = {
    searchRecipes: function(searchStr){
        const url = constants.tg_base_url+'/busca?q='+searchStr
        return request(url)
    },
    getRecipeByID: function(id){
        const url = constants.tg_base_url+'/receita/'+id+'.html'
        return request(url)
    }
}

function request(url) {
    let data = '';
    const get = promisify(require('https').get);

    return new Promise((resolve, reject) => {
        get(url)
        .then((resp) => console.log(typeof resp))
        .catch(resp => {
            resp.on('data', (chunk) => data += chunk)
            resp.on('end', () => resolve(data))
            resp.on('error', () => reject("Error: " + err.message))
        });

    })
}