import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Formik, Form, Field, FieldArray } from "formik"

import { Box, PageHeader, Wrapper } from "../shared/components"
import { API_HOST } from "../shared/constants"
import {
  Button,
  ButtonRemoveItem,
  Label,
  TextArea,
  Notification,
  Input,
  ValidationError,
} from "./components"
import { NotificationType } from "./components/Notification"
import { Recipe } from "./types"
import { serializeRecipe } from "./utils/serializing"
import { RecipeSchema } from "./schema/validations"

export const getEditRecipe = (id: number) =>
  `${API_HOST}/api/recipe/recipes/${id}/`

export const EditRecipe = () => {
  const { id } = useParams()
  const [cachedRecipe, setCachedRecipe] = useState({
    name: "",
    description: "",
    ingredients: [] as string[],
  })
  const [newIngredient, setNewIngredient] = useState<string>("")
  const [notification, setNotification] = useState<{
    type: NotificationType
    content: string
  } | null>(null)

  useEffect(() => {
    fetch(getEditRecipe(id))
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Non-successful status code")
      })
      .then((data: Recipe) => {
        setCachedRecipe({
          name: data.name,
          description: data.description,
          ingredients: data.ingredients.map((ingredient) => ingredient.name),
        })
      })
      .catch(() =>
        setNotification({
          type: "DANGER",
          content: "Couldn't load the recipe data",
        }),
      )
  }, [id])

  const handleSubmit = (values: {
    name: string
    description: string
    ingredients: string[]
  }) => {
    fetch(getEditRecipe(id), {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: serializeRecipe(
        values.name,
        values.description,
        values.ingredients,
      ),
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

  return (
    <Wrapper maxWidth="18.75rem">
      <PageHeader>Edit Recipe</PageHeader>
      {notification && (
        <Box mb="2">
          <Notification type={notification.type}>
            {notification.content}
          </Notification>
        </Box>
      )}
      <Formik
        initialValues={cachedRecipe}
        validationSchema={RecipeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values }) => (
          <Form>
            <Box mb="2">
              <Label htmlFor="name">Name*</Label>
              <Field as={Input} name="name" id="name" autoFocus />
              {errors.name && touched.name && (
                <ValidationError>{errors.name}</ValidationError>
              )}
            </Box>

            <Box mb="2">
              <Label htmlFor="description">Description*</Label>
              <Field as={TextArea} name="description" id="description" />
              {errors.description && touched.description && (
                <ValidationError>{errors.description}</ValidationError>
              )}
            </Box>

            <h2>Ingredients*</h2>
            <FieldArray
              name="ingredients"
              render={(arrayHelpers) => (
                <>
                  <div style={{ display: "flex" }}>
                    <Input
                      onChange={(event) => setNewIngredient(event.target.value)}
                      value={newIngredient}
                      placeholder="New ingredient"
                      maxLength={50}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          arrayHelpers.push(newIngredient)
                          setNewIngredient("")
                          event.preventDefault()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        arrayHelpers.push(newIngredient)
                        setNewIngredient("")
                      }}
                      disabled={newIngredient === ""}
                      style={{ flexBasis: "0" }}
                    >
                      ADD
                    </Button>
                  </div>
                  <ul>
                    {values.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient}{" "}
                        <ButtonRemoveItem
                          type="button"
                          aria-label={`remove ingredient ${ingredient}`}
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          X
                        </ButtonRemoveItem>
                      </li>
                    ))}
                    {errors.ingredients}
                  </ul>
                </>
              )}
            />
            <Button type="submit">Update</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}
