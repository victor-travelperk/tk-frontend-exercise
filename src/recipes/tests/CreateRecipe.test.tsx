import React from "react"
import faker from "faker"
import { MemoryRouter } from "react-router-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import fetchMock from "fetch-mock"

import {
  CreateRecipe,
  CREATE_RECIPE_URL,
  serializeRecipe,
} from "../CreateRecipe"

const renderCreateRecipe = () =>
  render(
    <MemoryRouter>
      <CreateRecipe />
    </MemoryRouter>,
  )

afterEach(() => {
  fetchMock.reset()
})

describe("CreateRecipe", () => {
  it("successfully creates recipe", async () => {
    fetchMock.post(CREATE_RECIPE_URL, 201)

    renderCreateRecipe()

    const newRecipe = {
      name: faker.random.word(),
      description: faker.random.words(3),
      ingredients: [faker.random.word(), faker.random.word()],
    }

    // Validate page title
    expect(screen.getByText("Create Recipe")).toBeInTheDocument()

    // Validate form fields
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: newRecipe.name },
    })
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: newRecipe.description },
    })

    for (const ingredient of newRecipe.ingredients) {
      fireEvent.change(screen.getByPlaceholderText("New ingredient"), {
        target: { value: ingredient },
      })
      fireEvent.click(screen.getByText("ADD"))

      // New ingredient input should be empty
      expect(screen.getByPlaceholderText("New ingredient")).toBeEmpty()

      // New ingredient should've been added to the list
      expect(screen.getByText(ingredient)).toBeInTheDocument()
    }

    fireEvent.click(screen.getByText("Create"))

    const fetchCall = fetchMock.lastCall(
      CREATE_RECIPE_URL,
    ) as fetchMock.MockCall
    expect(fetchCall[1]?.body).toEqual(
      serializeRecipe(
        newRecipe.name,
        newRecipe.description,
        newRecipe.ingredients,
      ),
    )

    expect(await screen.findByText("Recipe created!")).toBeInTheDocument()
  })

  it("renders error message when server error occurs", async () => {
    fetchMock.post(CREATE_RECIPE_URL, 500)

    renderCreateRecipe()

    const newRecipe = {
      name: faker.random.word(),
      description: faker.random.words(3),
      ingredients: [faker.random.word(), faker.random.word()],
    }

    // Validate form fields
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: newRecipe.name },
    })
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: newRecipe.description },
    })

    for (const ingredient of newRecipe.ingredients) {
      fireEvent.change(screen.getByPlaceholderText("New ingredient"), {
        target: { value: ingredient },
      })
      fireEvent.click(screen.getByText("ADD"))
    }

    fireEvent.click(screen.getByText("Create"))

    expect(await screen.findByText("Error creating recipe")).toBeInTheDocument()
  })

  it("can remove ingredients before creating recipe", () => {
    renderCreateRecipe()

    const ingredients = [faker.random.word(), faker.random.word()]

    for (const ingredient of ingredients) {
      fireEvent.change(screen.getByPlaceholderText("New ingredient"), {
        target: { value: ingredient },
      })
      fireEvent.click(screen.getByText("ADD"))

      // New ingredient should've been added to the list
      expect(screen.getByText(ingredient)).toBeInTheDocument()

      // Remove ingredient
      fireEvent.click(screen.getByLabelText(`remove ingredient ${ingredient}`))

      // Ingredient should not be gone
      expect(screen.queryByText(ingredient)).not.toBeInTheDocument()
    }
  })
})
