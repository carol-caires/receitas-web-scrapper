# Receitas Web Scrapper

O **Receitas Web Scrapper** foi desenvolvido a partir da necessidade de se ter o conteúdo do site de receitas [*Tudo Gostoso*](https://www.tudogostoso.com.br/) disponível em uma API para uso em outros projetos.

Atualmente é possível pesquisar e visualizar receitas.

## Como rodar

`npm start`

O serviço roda sobre o *nodemon*, ou seja, irá reinicializar sozinho a cada vez que for alterado ou for interrompido devido a erros internos.

## Variáveis de ambiente

```python
PORT = 3000 # se não estiver definida, considera o valor 3000
```

## Testes de integração

A implementar.

## Referência da API

### `GET search/:title`  
Busca uma lista de receitas que contenha, o valor de `:title` no título.

#### Parâmetros
- **title**: título da receita ou parte dele *[obrigatório]*

#### Retorno

`HTTP 200`: Um array contendo as receitas encontradas para o título informado. Cada receita contém os campos:

- **id**: identificador único da receita
- **title**: título da receita

`HTTP 400`: Um objeto com a propriedade `erro` contendo a descrição do erro.

#### Exemplo de resposta

```JSON
[
  {
    "title": "Bolo de aveia com cacau no micro-ondas",
    "id": "307527-bolo-de-aveia-com-cacau-no-micro-ondas"
  },
  {
    "title": "Bolo de doido",
    "id": "179005-bolo-de-doido"
  },
  {
    "title": "Bolo xadrez com brigadeiro",
    "id": "300777-bolo-xadrez-com-brigadeiro"
  }
]
```

### `GET recipe/:id`

Busca uma receita através de seu identificador único.

#### Parâmetros
- **id**: identificador único da receita obtido através da chamada do endpoint de busca *[obrigatório]*

#### Retorno

`HTTP 200`: Um objeto contendo as seguintes propriedades:

- **title**: título da receita
- **stats**: estatísticas da receita com os seguintes campos
    - **prepare_time_minutes**: tempo de preparação, em minutos
    - **portion_output**: quantidade de porções que a receita rende
    - **favorites**: quantas pessoas favoritaram a receita
- **ingredients**: lista de ingredientes
    - **title**: título da parte da receita (massa, cobertura, etc). Quando a receita não tiver seções, é retornada apenas uma seção com esse campo preenchido com *default*
    - **items**: array com a descrição dos ingredientes
- **instructions**: 
    - **title**: título da parte da receita
    - **items**: array com os passos das instruções

`HTTP 400`: Um objeto com a propriedade `erro` contendo a descrição do erro.

#### Exemplo de resposta

```json
{
  "title": "Picanha invertida",
  "stats": {
    "prepare_time_minutes": 90,
    "portion_output": 5,
    "favorites": 7933
  },
  "ingredients": [
    {
      "title": "default",
      "items": [
        "1 picanha de cerca de 1,5 kg",
        "400 g de provolone",
        "100 g de bacon",
        "Orégano",
        "Sal grosso"
      ]
    }
  ],
  "instructions": [
    {
      "title": "default",
      "items": [
        "Fure a picanha no sentido diagonal, deixando 1,5 cm nas laterais.",
        "Vire a ponta para dentro, deixando no avesso, cuidado no corte para não atravessar as laterais de um lado ao outro.",
        "Recheie com o provolone picado temperado com orégano e o bacon, também picado.",
        "Feche as aberturas com palitos.",
        "Salgue com o sal grosso.",
        "Coloque no forno a 200ºC em uma assadeira untada ou se preferir leve para churrasqueira.",
        "Deixe assar a seu gosto, virando de 15 em 15 minutos."
      ]
    }
  ]
}
```