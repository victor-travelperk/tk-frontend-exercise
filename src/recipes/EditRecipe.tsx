import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Box, PageHeader, Wrapper } from "../shared/components"
import { COLORS } from "../shared/styles"
import {
  Button,
  ButtonRemoveItem,
  Label,
  TextArea,
  Notification,
  Input,
} from "./components"
import { NotificationType } from "./components/Notification"
import { Recipe } from "./types"
import { serializeRecipe } from "./utils/serializing"

export const getEditRecipe = (id: number) =>
  `http://localhost:8000/api/recipe/recipes/${id}/`

export const EditRecipe = () => {
  const { id } = useParams()
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

  useEffect(() => {
    fetch(getEditRecipe(id))
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Non-successful status code")
      })
      .then((data: Recipe) => {
        setName(data.name)
        setDescription(data.description)
        setIngredients(data.ingredients.map((ingredient) => ingredient.name))
      })
      .catch(() =>
        setNotification({
          type: "DANGER",
          content: "Couldn't load the recipe data",
        }),
      )
  }, [id])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    fetch(getEditRecipe(id), {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: serializeRecipe(name, description, ingredients),
    })
      .then((response) => {
        if (response.ok) {
          setNotification({
            type: "SUCCESS",
            content: "Recipe updated successfully!",
          })
          return
        }
        throw new Error("Non-successful status code")
      })
      .catch(() => {
        setNotification({
          type: "DANGER",
          content: "Error creating recipe",
        })
      })
  }

  const submitDisabled =
    name === "" || description === "" || ingredients.length === 0

  return (
    <Wrapper maxWidth="18.75rem">
      <PageHeader>Edit Recipe</PageHeader>
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
            type="text"
            required
            maxLength={50}
          ></Input>
        </Box>

        <Box mb="2">
          <Label htmlFor="description">Description*</Label>
          <TextArea
            id="description"
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
          Update
        </Button>
      </form>
    </Wrapper>
  )
}
