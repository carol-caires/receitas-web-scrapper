const DomParser = require('dom-parser');

module.exports = {
  parse(str) {
    const parser = new DomParser();
    const doc = parser.parseFromString(str);
    const recipes = doc.getElementsByClassName('recipe-card');
    if (recipes.length == 0) {
      console.error('no recipe found');
      return;
    }

    const maxRecipes = 10;

    let retRecipes = [];
    for (i = 0; i < maxRecipes; i++) {
      const titles = recipes[i].getElementsByClassName('title');
      const links = recipes[i].getElementsByClassName('link');

      const regex = /\/receita\/(\S+).html/gm;
      let m; let
        recipe_id;

      if (titles.length > 0 && links.length > 0) {
        const title = titles[0].innerHTML;
        const link = links[0].getAttribute('href');
        while ((m = regex.exec(link)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          if (m.length > 1) {
            recipe_id = m[1];
          }
        }

        retRecipes = retRecipes.concat({
          title: titles[0].innerHTML,
          id: recipe_id,
        });
      }
    }
    return retRecipes;
  },
};
