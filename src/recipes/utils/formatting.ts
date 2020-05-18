import { Ingredient } from "../types"

export const formatIngredients = (ingredients: Ingredient[]) =>
  ingredients.map((ingredient) => ingredient.name).join(", ")