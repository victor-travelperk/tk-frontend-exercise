import React from "react"
import faker from "faker"
import { MemoryRouter } from "react-router-dom"
import { act, render, screen, fireEvent } from "@testing-library/react"
import fetchMock from "fetch-mock"

import { CreateRecipe, CREATE_RECIPE_URL } from "../CreateRecipe"
import { serializeRecipe } from "../utils/serializing"

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
    fireEvent.change(screen.getByLabelText("Name*"), {
      target: { value: newRecipe.name },
    })
    fireEvent.change(screen.getByLabelText("Description*"), {
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

    await act(async () => {
      fireEvent.click(screen.getByText("Create"))
    })

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
    fireEvent.change(screen.getByLabelText("Name*"), {
      target: { value: newRecipe.name },
    })
    fireEvent.change(screen.getByLabelText("Description*"), {
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

  it("can remove ingredients before creating recipe", async () => {
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
      await act(async () => {
        fireEvent.click(
          screen.getByLabelText(`remove ingredient ${ingredient}`),
        )
      })

      // Ingredient should not be gone
      expect(screen.queryByText(ingredient)).not.toBeInTheDocument()
    }
  })

  it("can add ingredients by pressing enter", async () => {
    renderCreateRecipe()

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
    renderCreateRecipe()

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

    // Trigger ingredients message
    fireEvent.click(screen.getByText("Create"))

    expect(
      await screen.findByText("At least one ingredient is required"),
    ).toBeInTheDocument()
  })
})
