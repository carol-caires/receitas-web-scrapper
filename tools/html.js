var DomParser = require('dom-parser');
const constants = require('../constants')

module.exports = {
    parse: function (str) {
        var parser = new DomParser();
        var doc = parser.parseFromString(str);
        let recipes = doc.getElementsByClassName("recipe-card");
        if(recipes.length == 0) {
            throw new Error("no recipe found")
        }

        const maxRecipes = constants.max_recipes_returned

        let retRecipes = []
        for(i = 0; i < maxRecipes; i++) {
            let titles = recipes[i].getElementsByClassName("title")
            let links =  recipes[i].getElementsByClassName("link")

            if (titles.length > 0 && links.length > 0) {
                const title = titles[0].textContent
                const link = links[0].getAttribute("href")

                retRecipes = retRecipes.concat({
                    'title': title.replace(/\n/g, ''),
                    'id': extractRecipeID(link)
                })
            }
        }
        return retRecipes
    }
}

function extractRecipeID(link) {
    const regex = /\/receita\/(\S+).html/gm;
    let m, recipe_id;
    while ((m = regex.exec(link)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        if (m.length > 1) {
            recipe_id = m[1]
        }
    }
    return recipe_id
}