import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { PageHeader, Wrapper } from "../shared/components"
import { Recipe } from "./types"
import { RecipeCard, NoRecipesPlaceholder, Notification } from "./components"
import { NotificationType } from "./components/Notification"

export const LIST_RECIPES_URL = "http://localhost:8000/api/recipe/recipes/"
export const getRemoveRecipeUrl = (id: number) =>
  `http://localhost:8000/api/recipe/recipes/${id}/`

const RecipeList = styled.div`
  display: grid;
  grid-row-gap: 0.5rem;
`

export const ListRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [notification, setNotification] = useState<{
    type: NotificationType
    content: string
  } | null>(null)

  const removeRecipe = (recipeId: number) => {
    const shouldRemove = window.confirm(
      "Are you sure you want to delete the recipe?",
    )
    if (shouldRemove) {
      fetch(getRemoveRecipeUrl(recipeId), {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchRecipes()
            return
          }
          throw new Error("Non-successful status code")
        })
        .catch(() =>
          setNotification({
            type: "DANGER",
            content: "There was an error while deleting recipe",
          }),
        )
    }
  }

  const fetchRecipes = () => {
    fetch(LIST_RECIPES_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Non-successful status code")
      })
      .then((data) => setRecipes(data))
      .catch(() =>
        setNotification({
          type: "DANGER",
          content: "Wops! An error occurred while retrieving the recipes",
        }),
      )
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const showEmtpyPlaceholder = recipes && recipes.length === 0

  return (
    <Wrapper>
      <PageHeader>Recipe Library</PageHeader>
      {notification && (
        <Notification type={notification.type}>
          {notification.content}
        </Notification>
      )}
      {showEmtpyPlaceholder && (
        <NoRecipesPlaceholder>
          No recipes yet, go create some!
        </NoRecipesPlaceholder>
      )}
      {recipes && (
        <RecipeList>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                onDelete={() => removeRecipe(recipe.id)}
              />
            </div>
          ))}
        </RecipeList>
      )}
    </Wrapper>
  )
}
