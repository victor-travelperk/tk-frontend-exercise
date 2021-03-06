import React from "react"
import faker from "faker"
import { act, render, fireEvent, screen } from "@testing-library/react"
import { MemoryRouter, generatePath, Route } from "react-router-dom"
import fetchMock from "fetch-mock"

import { ROUTES } from "../constants"
import { EditRecipe, getEditRecipe } from "../EditRecipe"
import { serializeRecipe } from "../utils/serializing"
import { getRecipe } from "./stubs"

const recipe = getRecipe()

const renderEditRecipe = () =>
  render(
    <MemoryRouter
      initialEntries={[generatePath(ROUTES.EDIT, { id: recipe.id })]}
      initialIndex={0}
    >
      <Route path={ROUTES.EDIT}>
        <EditRecipe />
      </Route>
    </MemoryRouter>,
  )

describe("EditRecipe", () => {
  const editUrl = getEditRecipe(recipe.id)
  beforeEach(() => {
    fetchMock.get(editUrl, recipe)
  })
  it("successfully edits recipe", async () => {
    const editUrl = getEditRecipe(recipe.id)
    fetchMock.get(editUrl, recipe)

    renderEditRecipe()

    expect(screen.getByText("Edit Recipe")).toBeInTheDocument()

    // Values from server are present
    expect(await screen.findByDisplayValue(recipe.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(recipe.description)).toBeInTheDocument()
    for (const ingredient of recipe.ingredients) {
      expect(screen.getByText(ingredient.name)).toBeInTheDocument()
    }

    const newRecipeValues = {
      ...getRecipe(),
      id: recipe.id,
    }

    // Set return value of patch to new recipe values
    fetchMock.patch(editUrl, newRecipeValues)

    fireEvent.change(screen.getByLabelText("Name*"), {
      target: { value: newRecipeValues.name },
    })
    fireEvent.change(screen.getByLabelText("Description*"), {
      target: { value: newRecipeValues.description },
    })

    // Remove old ingredients
    for (const ingredient of recipe.ingredients) {
      const removeIngredientButton = screen.getByLabelText(
        `remove ingredient ${ingredient.name}`,
      )
      fireEvent.click(removeIngredientButton)
      expect(screen.queryByText(ingredient.name)).not.toBeInTheDocument()
    }

    // Add new ingredients
    for (const ingredient of newRecipeValues.ingredients) {
      fireEvent.change(screen.getByPlaceholderText("New ingredient"), {
        target: { value: ingredient.name },
      })
      fireEvent.click(screen.getByText("ADD"))
    }

    await act(async () => {
      fireEvent.click(screen.getByText("Update"))
    })

    const fetchCall = fetchMock.lastCall(editUrl) as fetchMock.MockCall
    expect(fetchCall[1]?.body).toEqual(
      serializeRecipe(
        newRecipeValues.name,
        newRecipeValues.description,
        newRecipeValues.ingredients.map((ingredient) => ingredient.name),
      ),
    )

    expect(
      await screen.findByText("Recipe updated successfully!"),
    ).toBeInTheDocument()
  })

  it("renders error when server error occurs while getting the recipe data", async () => {
    const editUrl = getEditRecipe(recipe.id)
    fetchMock.get(editUrl, 500)

    await act(async () => {
      renderEditRecipe()
    })

    expect(
      await screen.findByText("Couldn't load the recipe data"),
    ).toBeInTheDocument()
  })

  it("renders error message when server error occurs during update", async () => {
    const editUrl = getEditRecipe(recipe.id)
    fetchMock.get(editUrl, recipe).patch(editUrl, 500)

    await act(async () => {
      renderEditRecipe()
    })

    // Save recipe with same values to trigger the save functionality
    fireEvent.click(screen.getByText("Update"))

    expect(await screen.findByText("Error creating recipe")).toBeInTheDocument()
  })

  it("can add ingredients by pressing enter", async () => {
    const editUrl = getEditRecipe(recipe.id)
    fetchMock.get(editUrl, recipe)

    await act(async () => {
      renderEditRecipe()
    })

    const ingredients = [faker.random.word(), faker.random.word()]

    for (const ingredient of ingredients) {
      const newIngredientElement = screen.getByPlaceholderText("New ingredient")
      fireEvent.change(newIngredientElement, {
        target: { value: ingredient },
      })
      fireEvent.keyPress(newIngredientElement, {
        key: "Enter",
        code: "Enter",
        charCode: 13,
      })

      // New ingredient should've been added to the list
      expect(await screen.findByText(ingredient)).toBeInTheDocument()
    }
  })

  it("displays validation errors", async () => {
    await act(async () => {
      renderEditRecipe()
    })

    // Validate form fields
    const nameInput = screen.getByLabelText("Name*")
    fireEvent.change(nameInput, {
      target: { value: "" },
    })

    await act(async () => {
      fireEvent.blur(nameInput)
    })

    expect(screen.getByText("Required")).toBeInTheDocument()

    const descriptionInput = screen.getByLabelText("Description*")
    fireEvent.change(descriptionInput, {
      target: { value: "" },
    })
    await act(async () => {
      fireEvent.blur(descriptionInput)
    })

    expect(await screen.findAllByText("Required")).toHaveLength(2)

    // Remove existing ingredients
    for (const ingredient of recipe.ingredients) {
      // Remove ingredient
      await act(async () => {
        fireEvent.click(
          screen.getByLabelText(`remove ingredient ${ingredient.name}`),
        )
      })
    }

    // Trigger ingredients message
    fireEvent.click(screen.getByText("Update"))

    expect(
      await screen.findByText("At least one ingredient is required"),
    ).toBeInTheDocument()
  })
})
