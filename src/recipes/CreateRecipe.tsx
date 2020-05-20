import React, { useState } from "react"

import { COLORS } from "../shared/styles"
import { Box, PageHeader, Wrapper } from "../shared/components"
import {
  Button,
  ButtonRemoveItem,
  Label,
  TextArea,
  Notification,
  Input,
} from "./components"
import { NotificationType } from "./components/Notification"
import { serializeRecipe } from "./utils/serializing"

export const CREATE_RECIPE_URL = "http://127.0.0.1:8000/api/recipe/recipes/"

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

  const removeIngredient = (indexToRemove: number) => {
    const newIngredients = ingredients.filter(
      (_, index) => index !== indexToRemove,
    )
    setIngredients(newIngredients)
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

  const submitDisabled =
    name === "" || description === "" || ingredients.length === 0

  return (
    <>
      <Wrapper maxWidth="18.75rem">
        <PageHeader>Create Recipe</PageHeader>
        <form onSubmit={handleSubmit}>
          {notification && (
            <Box mb="2">
              <Notification type={notification.type}>
                {notification.content}
              </Notification>
            </Box>
          )}
          <Box mb="2">
            <Label htmlFor="name">Name*</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              name="name"
              type="text"
              required
              maxLength={50}
            ></Input>
          </Box>

          <Box mb="2">
            <Label htmlFor="description">Description*</Label>
            <TextArea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={250}
            ></TextArea>
          </Box>

          <h2>Ingredients*</h2>
          <div style={{ display: "flex" }}>
            <Input
              onChange={(event) => setNewIngredient(event.target.value)}
              value={newIngredient}
              placeholder="New ingredient"
              maxLength={50}
            />
            <Button
              type="button"
              onClick={() => addIngredient()}
              disabled={newIngredient === ""}
              backgroundColor={COLORS.QUICK_SILVER}
              style={{ flexBasis: "0" }}
            >
              ADD
            </Button>
          </div>

          <ul>
            {ingredients.length === 0 && (
              <p>You must add at least one ingredient</p>
            )}
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient}{" "}
                <ButtonRemoveItem
                  type="button"
                  aria-label={`remove ingredient ${ingredient}`}
                  onClick={() => removeIngredient(index)}
                >
                  X
                </ButtonRemoveItem>
              </li>
            ))}
          </ul>

          <Button type="submit" disabled={submitDisabled}>
            Create
          </Button>
        </form>
      </Wrapper>
    </>
  )
}
