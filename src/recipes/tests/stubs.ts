import faker from "faker"
import { Recipe } from "../types"

export const getRecipe = (): Recipe => (
  {
    id: faker.random.number(),
    name: faker.random.words(2),
    description: faker.random.words(10),
    ingredients: [
      {
        name: faker.random.word(),
      },
    ],
  })