import React from "react"
import {
  act,
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import fetchMock from "fetch-mock"

import {
  ListRecipes,
  getListRecipesUrl,
  getRemoveRecipeUrl,
} from "../ListRecipes"
import { getRecipe } from "./stubs"

const renderListRecipes = () =>
  render(
    <MemoryRouter>
      <ListRecipes />
    </MemoryRouter>,
  )

describe("ListRecipes", () => {
  it("renders recipe data", async () => {
    const recipe = getRecipe()
    fetchMock.get(getListRecipesUrl(), [recipe])

    renderListRecipes()

    expect(screen.getByText("Loading...")).toBeInTheDocument()

    expect(await screen.findByText(recipe.name)).toBeInTheDocument()
    expect(screen.getByText(recipe.description)).toBeInTheDocument()
    for (const ingredient of recipe.ingredients) {
      expect(screen.getByText(ingredient.name)).toBeInTheDocument()
    }
  })

  it("renders default message if no data is present", async () => {
    fetchMock.get(getListRecipesUrl(), [])
    await act(async () => {
      renderListRecipes()
    })

    expect(screen.getByText("No recipes yet, go create some!"))
  })

  it("renders an error message when fetch recipes fails", async () => {
    fetchMock.get(getListRecipesUrl(), 500)
    await act(async () => {
      renderListRecipes()
    })
    expect(
      screen.getByText("Wops! An error occurred while retrieving the recipes"),
    )
  })

  describe("name filter", () => {
    const firstRecipe = getRecipe()
    const secondRecipe = getRecipe()

    it("can filter by pressing enter", async () => {
      fetchMock.get(getListRecipesUrl(), [firstRecipe, secondRecipe])

      await act(async () => {
        renderListRecipes()
      })

      const filterInput = screen.getByPlaceholderText("Filter by name")

      fetchMock.get(getListRecipesUrl(secondRecipe.name), [secondRecipe])

      fireEvent.change(filterInput, {
        target: { value: secondRecipe.name },
      })

      await act(async () => {
        fireEvent.keyPress(filterInput, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        })
      })

      expect(screen.queryByText(firstRecipe.name)).not.toBeInTheDocument()
      expect(screen.queryByText(secondRecipe.name)).toBeInTheDocument()
    })

    it("can filter by pressing search", async () => {
      fetchMock.get(getListRecipesUrl(), [firstRecipe, secondRecipe])

      await act(async () => {
        renderListRecipes()
      })

      const filterInput = screen.getByPlaceholderText("Filter by name")

      fetchMock.get(getListRecipesUrl(secondRecipe.name), [secondRecipe])

      fireEvent.change(filterInput, {
        target: { value: secondRecipe.name },
      })

      await act(async () => {
        fireEvent.click(screen.getByText("SEARCH"))
      })

      expect(screen.queryByText(firstRecipe.name)).not.toBeInTheDocument()
      expect(screen.queryByText(secondRecipe.name)).toBeInTheDocument()
    })
  })
  describe("delete recipe", () => {
    beforeEach(() => {
      // We'll assume the user always confirms deleting
      window.confirm = jest.fn(() => true)
    })
    it("can remove recipe from list", async () => {
      const firstRecipe = getRecipe()
      const secondRecipe = getRecipe()

      fetchMock
        .get(getListRecipesUrl(), [firstRecipe, secondRecipe])
        .delete(getRemoveRecipeUrl(firstRecipe.id), 204)

      await act(async () => {
        renderListRecipes()
      })

      // The second time get is called only the second recipe should be returned
      fetchMock.get(getListRecipesUrl(), [secondRecipe])

      const removeFirstRecipeBtn = screen.getByLabelText(
        `remove recipe ${firstRecipe.name}`,
      )

      fireEvent.click(removeFirstRecipeBtn)

      expect(window.confirm).toHaveBeenCalled()

      // List should no longer contain the recipe
      await waitForElementToBeRemoved(() => screen.getByText(firstRecipe.name))
      expect(screen.queryByText(firstRecipe.name)).not.toBeInTheDocument()
      expect(screen.queryByText(secondRecipe.name)).toBeInTheDocument()
    })

    it("renders error message when server error occurs while deleting recipe", async () => {
      const recipe = getRecipe()

      fetchMock
        .get(getListRecipesUrl(), [recipe])
        .delete(getRemoveRecipeUrl(recipe.id), 500)

      await act(async () => {
        renderListRecipes()
      })

      const removeFirstRecipeBtn = screen.getByLabelText(
        `remove recipe ${recipe.name}`,
      )

      fireEvent.click(removeFirstRecipeBtn)

      expect(
        await screen.findByText("There was an error while deleting recipe"),
      ).toBeInTheDocument()
    })
  })
})
