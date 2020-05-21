import React, { useState } from "react"
import { Formik, Form, Field, FieldArray, FormikHelpers } from "formik"

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
import { serializeRecipe } from "./utils/serializing"
import { RecipeSchema } from "./schema/validations"

export const CREATE_RECIPE_URL = `${API_HOST}/api/recipe/recipes/`

export const CreateRecipe = () => {
  const [newIngredient, setNewIngredient] = useState<string>("")
  const [notification, setNotification] = useState<{
    type: NotificationType
    content: string
  } | null>(null)

  const handleSubmit = (
    values: {
      name: string
      description: string
      ingredients: string[]
    },
    {
      resetForm,
    }: FormikHelpers<{
      name: string
      description: string
      ingredients: string[]
    }>,
  ) => {
    fetch(CREATE_RECIPE_URL, {
      method: "POST",
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
            content: "Recipe created!",
          })
          resetForm({})
          return
        }
        throw new Error("Non-successful status code")
      })
      .catch(() =>
        setNotification({
          type: "DANGER",
          content: "Error creating recipe",
        }),
      )
  }

  return (
    <>
      <Wrapper maxWidth="18.75rem">
        <PageHeader>Create Recipe</PageHeader>
        {notification && (
          <Box mb="2">
            <Notification type={notification.type}>
              {notification.content}
            </Notification>
          </Box>
        )}
        <Formik
          initialValues={{
            name: "",
            description: "",
            ingredients: [] as string[],
          }}
          validationSchema={RecipeSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Box mb="2">
                <Label htmlFor="name">Name*</Label>
                <Field as={Input} name="name" id="name" />
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
                        onChange={(event) =>
                          setNewIngredient(event.target.value)
                        }
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
              <Button type="submit">Create</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  )
}
