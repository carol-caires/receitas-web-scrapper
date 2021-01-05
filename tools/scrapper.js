/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
const DomParser = require('dom-parser'); // todo: remove
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const constants = require('../constants');

function extractRecipeID(link) {
  const regex = /\/receita\/(\S+).html/gm;
  let m; let recipeId;
  while ((m = regex.exec(link)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex += 1;
    }

    if (m.length > 1) {
      recipeId = m[1];
    }
  }
  return recipeId;
}

function parseItems(title, element, identifier) {
  const section = { title, items: [] };
  let itemElement;
  if (element.className === 'card-subtitle') {
    itemElement = element.nextElementSibling;
  } else {
    itemElement = element;
  }
  const items = itemElement.querySelectorAll(identifier);
  items.forEach((item) => {
    if (item != null) { section.items = section.items.concat(item.textContent); }
  });
  return section;
}

function extractIngredients(doc) {
  const ingredients = doc.querySelectorAll('div.ingredients-card');
  let ingredientSections = [];
  let section = {};
  ingredients.forEach((ingredient) => {
    let title = 'default';
    const subtitles = ingredient.querySelectorAll('.card-subtitle');
    if (subtitles.length > 0) {
      subtitles.forEach((subElement) => {
        const titleElement = subElement;
        if (titleElement != null) {
          title = titleElement.textContent;
        }
        section = parseItems(title, subElement, 'span.p-ingredient');
        ingredientSections = ingredientSections.concat(section);
      });
    } else {
      section = parseItems(title, ingredient, 'span.p-ingredient');
      ingredientSections = ingredientSections.concat(section);
    }
  });
  return ingredientSections;
}

function extractInstructions(doc) {
  const instructions = doc.querySelectorAll('div.instructions');
  let instructionsSections = [];
  instructions.forEach((instruction) => {
    let title = 'default';
    let section;
    const subtitles = instruction.querySelectorAll('.card-subtitle');
    if (subtitles.length > 0) {
      subtitles.forEach((subElement) => {
        const titleElement = subElement;
        if (titleElement != null) {
          title = subElement.textContent;
        }
        section = parseItems(title, subElement, 'li span');
        instructionsSections = instructionsSections.concat(section);
      });
    } else {
      section = parseItems(title, instruction, 'li span');
      instructionsSections = instructionsSections.concat(section);
    }
  });
  return instructionsSections;
}

function extractStats(doc) {
  const ret = {};

  const regex = /(\D)/gm; // remove any non-digit
  const subst = '';

  const prepareTimeElement = doc.querySelector('time.dt-duration');
  if (prepareTimeElement != null) {
    ret.prepare_time_minutes = Number(prepareTimeElement.textContent.replace(regex, subst));
  }

  const portionOutputElement = doc.querySelector('data.p-yield');
  if (portionOutputElement != null) {
    ret.portion_output = Number(portionOutputElement.textContent.replace(regex, subst));
  }

  const favoritesElement = doc.querySelector('div.like data.num');
  if (favoritesElement != null) {
    ret.favorites = Number(favoritesElement.textContent.replace(regex, subst));
  }

  return ret;
}

function extractTitle(doc) {
  return doc.querySelector('div.recipe-title h1').textContent.replace(/\n/g, '');
}

module.exports = {
  parseRecipesList(str) {
    const parser = new DomParser();
    const doc = parser.parseFromString(str);
    const recipes = doc.getElementsByClassName('recipe-card');
    if (recipes.length === 0) {
      throw new Error('no recipe found');
    }

    const maxRecipes = constants.max_recipes_returned;

    let retRecipes = [];
    for (let i = 0; i < maxRecipes; i += 1) {
      const titles = recipes[i].getElementsByClassName('title');
      const links = recipes[i].getElementsByClassName('link');

      if (titles.length > 0 && links.length > 0) {
        const title = titles[0].textContent;
        const link = links[0].getAttribute('href');

        retRecipes = retRecipes.concat({
          title: title.replace(/\n/g, ''),
          id: extractRecipeID(link),
        });
      }
    }
    return retRecipes;
  },
  parseRecipe(str) {
    const dom = new JSDOM(str);
    const doc = dom.window.document;
    return {
      title: extractTitle(doc),
      stats: extractStats(doc),
      ingredients: extractIngredients(doc),
      instructions: extractInstructions(doc),
    };
  },
};
