import React, { useEffect, useState } from "react"
import { Box, PageHeader, Wrapper } from "../shared/components"
import { API_HOST } from "../shared/constants"
import { Recipe } from "./types"
import {
  RecipeCard,
  NoRecipesPlaceholder,
  Notification,
  LoadingMessage,
  Input,
  Button,
} from "./components"
import { NotificationType } from "./components/Notification"

export const getListRecipesUrl = (name?: string) =>
  name
    ? `${API_HOST}/api/recipe/recipes/?name=${name}`
    : `${API_HOST}/api/recipe/recipes/`
export const getRemoveRecipeUrl = (id: number) =>
  `${API_HOST}/api/recipe/recipes/${id}/`

export const ListRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [nameFilter, setNameFilter] = useState<string>("")
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

  const fetchRecipes = (name?: string) => {
    fetch(getListRecipesUrl(name))
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
        <Box mb="2">
          <Notification type={notification.type}>
            {notification.content}
          </Notification>
        </Box>
      )}
      {recipes === null && <LoadingMessage>Loading...</LoadingMessage>}
      {showEmtpyPlaceholder && (
        <NoRecipesPlaceholder>
          No recipes yet, go create some!
        </NoRecipesPlaceholder>
      )}
      {recipes && (
        <>
          <Box mb="1" style={{ display: "flex" }}>
            <Input
              autoFocus
              type="text"
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
              placeholder="Filter by name"
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  fetchRecipes(nameFilter)
                  event.preventDefault()
                }
              }}
            />
            <Button
              onClick={() => fetchRecipes(nameFilter)}
              type="button"
              style={{ flexBasis: "0" }}
            >
              SEARCH
            </Button>
          </Box>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100%",
              gridRowGap: "0.5rem",
            }}
          >
            {recipes.map((recipe) => (
              <div key={recipe.id}>
                <RecipeCard
                  recipe={recipe}
                  onDelete={() => removeRecipe(recipe.id)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </Wrapper>
  )
}
