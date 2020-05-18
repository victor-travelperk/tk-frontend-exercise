import React from "react"
import styled from "styled-components"

import { formatIngredients } from "../utils/formatting"
import { Recipe } from "../types"

const Wrapper = styled.div`
  border: 3px solid black;
  padding: 1rem;
`

type Props = {
  recipe: Recipe
}

export const RecipeCard = ({ recipe }: Props) => (
  <Wrapper>
    <h2>{recipe.name}</h2>
    <hr />
    <p>{recipe.description}</p>
    <h3>Ingredients:</h3>
    <p>{formatIngredients(recipe.ingredients)}</p>
  </Wrapper>
)
