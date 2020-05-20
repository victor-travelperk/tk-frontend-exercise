import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { PageHeader, Wrapper } from "../shared/components"
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
    }).then((response) => {
      if (response.ok) {
        setNotification({
          type: "SUCCESS",
          content: "Recipe updated successfully!",
        })
      } else {
        setNotification({
          type: "DANGER",
          content: "Error creating recipe",
        })
      }
    })
  }

  return (
    <Wrapper maxWidth="18.75rem">
      <PageHeader>Edit Recipe</PageHeader>
      <form onSubmit={handleSubmit}>
        {notification && (
          <div style={{ marginBottom: "1rem" }}>
            <Notification type={notification.type}>
              {notification.content}
            </Notification>
          </div>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <Label htmlFor="name">Name*</Label>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            id="name"
            type="text"
            required
          ></Input>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <Label htmlFor="description">Description*</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          ></TextArea>
        </div>

        <h2>Ingredients*</h2>
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

        <Button type="submit">Update</Button>
      </form>
    </Wrapper>
  )
}