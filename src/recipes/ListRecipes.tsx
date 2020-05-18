import React, { useEffect, useState } from "react"
import { Recipe, Ingredient } from "./types"

export const LIST_RECIPES_URL = "http://localhost:8000/api/recipe/recipes"

export const formatIngredients = (ingredients: Ingredient[]) =>
  ingredients.map((ingredient) => ingredient.name).join(",")

export const ListRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetch(LIST_RECIPES_URL)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
  }, [])
  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.name}>
          <h2>{recipe.name}</h2>
          <hr />
          <p>{recipe.description}</p>
          <h3>Ingredients:</h3>
          <p>{formatIngredients(recipe.ingredients)}</p>
        </div>
      ))}
    </div>
  )
}
