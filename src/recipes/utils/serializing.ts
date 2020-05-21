export const serializeRecipe = (
  name: string,
  description: string,
  ingredients: string[],
) =>
  JSON.stringify({
    description,
    ingredients: ingredients.map((ingredient) => ({ name: ingredient })),
    name,
  })