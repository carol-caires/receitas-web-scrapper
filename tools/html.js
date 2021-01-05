var DomParser = require('dom-parser'); // todo: remove
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const constants = require('../constants')

module.exports = {
    parseRecipesList: function (str) {
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
    },
    parseRecipe: function (str) {
        var dom = new JSDOM(str);
        const doc = dom.window.document
        let ret = {}

        ret.ingredients = extractIngredients(doc)
        ret.instructions = extractInstructions(doc)
        return ret
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

function extractIngredients(doc) {
    const ingredients = doc.querySelectorAll("div.ingredients-card .card-subtitle");
    let ingredient_sections = []
    ingredients.forEach(element => {
        const titleElement = element.querySelector("strong")
        if (titleElement != null) {
            const title = titleElement.textContent
            let section = {title: title, items: []}
            const items = element.nextElementSibling.querySelectorAll("li span.p-ingredient")
            items.forEach(item => {
                if (item != null)
                    section.items = section.items.concat(item.textContent)
            });
            ingredient_sections = ingredient_sections.concat(section)
        }
    });
    return ingredient_sections
}

function extractInstructions(doc) {
    const instructions = doc.querySelectorAll("div.instructions .card-subtitle")
    let instructions_sections = []
    instructions.forEach(element => {
        const titleElement = element.querySelector("strong")
        if (titleElement != null) {
            const title = titleElement.textContent
            let section = {title: title, items: []}
            const items = element.nextElementSibling.querySelectorAll("li span")
            items.forEach(item => {
                if (item != null)
                    section.items = section.items.concat(item.textContent)
            });
            instructions_sections = instructions_sections.concat(section)
        }
    });
    return instructions_sections
}