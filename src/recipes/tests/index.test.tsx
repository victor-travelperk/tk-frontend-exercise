import React from "react"
import { act, render, screen } from "@testing-library/react"
import fetchMock from "fetch-mock"

import { ListRecipes, LIST_RECIPES_URL } from "../ListRecipes"
import { formatIngredients } from "../utils/formatting"
import { recipeList } from "./stubs"

afterEach(() => {
  fetchMock.reset()
})

describe("ListRecipes", () => {
  it("renders recipe data", async () => {
    fetchMock.get(LIST_RECIPES_URL, recipeList)
    await act(async () => {
      render(<ListRecipes />)
    })
    for (const recipe of recipeList) {
      expect(screen.getByText(recipe.name)).toBeInTheDocument()
      expect(screen.getByText(recipe.description)).toBeInTheDocument()
      expect(
        screen.getByText(formatIngredients(recipe.ingredients)),
      ).toBeInTheDocument()
    }
  })

  it("renders default message if no data is present", async () => {
    fetchMock.get(LIST_RECIPES_URL, [])
    await act(async () => {
      render(<ListRecipes />)
    })

    expect(screen.getByText("No recipes yet, go create some!"))
  })

  it("renders an error message when fetch recipes fails", async () => {
    fetchMock.get(LIST_RECIPES_URL, 500)
    await act(async () => {
      render(<ListRecipes />)
    })
    expect(
      screen.getByText("Wops! An error occurred while retrieving the recipes"),
    )
  })
})
