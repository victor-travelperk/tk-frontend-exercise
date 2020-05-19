export type Ingredient = {
  name: string
}

export type Recipe = {
  id: number
  name: string
  description: string
  ingredients: Ingredient[]
}
