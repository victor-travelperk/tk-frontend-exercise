import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { PageHeader, Wrapper } from "../shared/components"
import { Recipe } from "./types"
import {
  RecipeCard,
  NoRecipesPlaceholder,
  LoadErrorMessage,
} from "./components"

export const LIST_RECIPES_URL = "http://localhost:8000/api/recipe/recipes/"

const RecipeList = styled.div`
  display: grid;
  grid-row-gap: 0.5rem;
`

export const ListRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    fetch(LIST_RECIPES_URL)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch(() => setError(true))
  }, [])

  const showEmtpyPlaceholder = !error && recipes.length === 0

  return (
    <Wrapper>
      <PageHeader>Recipe Library</PageHeader>
      {error && (
        <LoadErrorMessage>
          Wops! An error occurred while retrieving the recipes
        </LoadErrorMessage>
      )}
      {showEmtpyPlaceholder && (
        <NoRecipesPlaceholder>
          No recipes yet, go create some!
        </NoRecipesPlaceholder>
      )}
      {!error && (
        <RecipeList>
          {recipes.map((recipe) => (
            <div key={recipe.name}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </RecipeList>
      )}
    </Wrapper>
  )
}
