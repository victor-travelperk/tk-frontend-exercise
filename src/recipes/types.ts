export type Ingredient = {
  name: string
}

export type Recipe = {
  name: string
  description: string
  ingredients: Ingredient[]
}

export type RecipeDetail = Recipe & {
  id: number
}