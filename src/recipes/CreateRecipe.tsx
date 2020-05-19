import React, { useState } from "react"

import { COLORS } from "../shared/styles"
import { PageHeader, Wrapper } from "../shared/components"
import { Button, Label, TextArea, Notification, Input } from "./components"
import { NotificationType } from "./components/Notification"

export const CREATE_RECIPE_URL = "http://127.0.0.1:8000/api/recipe/recipes/"

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

export const CreateRecipe = () => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [newIngredient, setNewIngredient] = useState<string>("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [notification, setNotification] = useState<{
    type: NotificationType
    content: string
  } | null>(null)

  const addIngredient = () => {
    setIngredients(ingredients.concat([newIngredient]))
    setNewIngredient("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    fetch(CREATE_RECIPE_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: serializeRecipe(name, description, ingredients),
    }).then((response) => {
      if (response.ok) {
        setNotification({
          type: "SUCCESS",
          content: "Recipe created!",
        })
        resetForm()
      } else {
        setNotification({
          type: "DANGER",
          content: "Error creating recipe",
        })
      }
    })
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setNewIngredient("")
    setIngredients([])
  }

  return (
    <>
      <Wrapper maxWidth="18.75rem">
        <PageHeader>Create Recipe</PageHeader>
        <form onSubmit={handleSubmit}>
          {notification && (
            <div style={{ marginBottom: "1rem" }}>
              <Notification type={notification.type}>
                {notification.content}
              </Notification>
            </div>
          )}
          <div style={{ marginBottom: "1rem" }}>
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              type="text"
            ></Input>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></TextArea>
          </div>

          <h2>Ingredients</h2>
          <div>
            <Input
              onChange={(event) => setNewIngredient(event.target.value)}
              value={newIngredient}
              placeholder="New ingredient"
            />
            <Button
              type="button"
              onClick={() => addIngredient()}
              disabled={newIngredient === ""}
              backgroundColor={COLORS.QUICK_SILVER}
            >
              ADD
            </Button>
          </div>

          <ul>
            {ingredients.length === 0 && (
              <p>You must add at least one ingredient*</p>
            )}
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <Button type="submit">Create</Button>
        </form>
      </Wrapper>
    </>
  )
}
