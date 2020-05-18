import React from "react"
import { act, render, screen } from "@testing-library/react"
import fetchMock from "fetch-mock"

import {
  ListRecipes,
  LIST_RECIPES_URL,
  formatIngredients,
} from "../ListRecipes"
import { recipeList } from "./stubs"

test("renders default route", async () => {
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
