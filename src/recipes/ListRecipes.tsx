import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { PageHeader } from "../shared/components"
import { Recipe, Ingredient } from "./types"

export const LIST_RECIPES_URL = "http://localhost:8000/api/recipe/recipes/"

export const formatIngredients = (ingredients: Ingredient[]) =>
  ingredients.map((ingredient) => ingredient.name).join(", ")

const Wrapper = styled.div`
  max-width: 1280px;
  width 100%;
  margin: 0 auto;
`

export const ListRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetch(LIST_RECIPES_URL)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
  }, [])
  return (
    <Wrapper>
      <PageHeader>Recipe Library</PageHeader>
      {recipes.map((recipe) => (
        <div key={recipe.name}>
          <h2>{recipe.name}</h2>
          <hr />
          <p>{recipe.description}</p>
          <h3>Ingredients:</h3>
          <p>{formatIngredients(recipe.ingredients)}</p>
        </div>
      ))}
    </Wrapper>
  )
}
