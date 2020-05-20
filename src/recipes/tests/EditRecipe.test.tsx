import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import { MemoryRouter, generatePath, Route } from "react-router-dom"
import fetchMock from "fetch-mock"

import { URLS } from "../urls"
import { EditRecipe, getEditRecipe } from "../EditRecipe"
import { serializeRecipe } from "../utils/serializing"
import { getRecipe } from "./stubs"

const recipe = getRecipe()

const renderEditRecipe = () =>
  render(
    <MemoryRouter
      initialEntries={[generatePath(URLS.EDIT, { id: recipe.id })]}
      initialIndex={0}
    >
      <Route path={URLS.EDIT}>
        <EditRecipe />
      </Route>
    </MemoryRouter>,
  )

afterEach(() => {
  fetchMock.reset()
})

describe("EditRecipe", () => {
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

    fireEvent.click(screen.getByText("Update"))

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
  it("renders error message when server error occurs during update", async () => {
    const editUrl = getEditRecipe(recipe.id)
    fetchMock.get(editUrl, recipe).patch(editUrl, 500)

    renderEditRecipe()

    // Save recipe with same values to trigger the save functionality
    fireEvent.click(screen.getByText("Update"))

    expect(await screen.findByText("Error creating recipe")).toBeInTheDocument()
  })
})
