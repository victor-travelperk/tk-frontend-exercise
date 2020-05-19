import React from "react"
import { act, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import fetchMock from "fetch-mock"

import { ListRecipes, LIST_RECIPES_URL } from "../ListRecipes"
import { formatIngredients } from "../utils/formatting"
import { getRecipe } from "./stubs"

afterEach(() => {
  fetchMock.reset()
})

const renderListRecipes = () =>
  render(
    <MemoryRouter>
      <ListRecipes />
    </MemoryRouter>,
  )

describe("ListRecipes", () => {
  it("renders recipe data", async () => {
    const recipe = getRecipe()
    fetchMock.get(LIST_RECIPES_URL, [recipe])
    await act(async () => {
      renderListRecipes()
    })
    expect(screen.getByText(recipe.name)).toBeInTheDocument()
    expect(screen.getByText(recipe.description)).toBeInTheDocument()
    expect(
      screen.getByText(formatIngredients(recipe.ingredients)),
    ).toBeInTheDocument()
  })

  it("renders default message if no data is present", async () => {
    fetchMock.get(LIST_RECIPES_URL, [])
    await act(async () => {
      renderListRecipes()
    })

    expect(screen.getByText("No recipes yet, go create some!"))
  })

  it("renders an error message when fetch recipes fails", async () => {
    fetchMock.get(LIST_RECIPES_URL, 500)
    await act(async () => {
      renderListRecipes()
    })
    expect(
      screen.getByText("Wops! An error occurred while retrieving the recipes"),
    )
  })
})
