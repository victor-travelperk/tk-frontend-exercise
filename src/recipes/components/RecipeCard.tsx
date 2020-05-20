import React from "react"
import styled from "styled-components"
import { Link, generatePath } from "react-router-dom"

import { Box } from "../../shared/components"
import { formatIngredients } from "../utils/formatting"
import { Recipe } from "../types"
import { URLS } from "../urls"

const Wrapper = styled.div`
  border: 0.1875rem solid black;
  padding: 1rem;
`

const EditLink = styled(Link)`
  border: 0.1875rem solid black;
  padding: 0.5rem;
`

const RemoveRecipeButton = styled.button`
  border: 0.1875rem solid black;
  cursor: pointer;
  padding: 0.5rem;
`

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

type Props = {
  recipe: Recipe
  onDelete: () => void
}

export const RecipeCard = ({ recipe, onDelete }: Props) => (
  <Wrapper>
    <h2>{recipe.name}</h2>
    <hr />
    <p>{recipe.description}</p>
    <h3>Ingredients:</h3>
    <p>{formatIngredients(recipe.ingredients)}</p>
    <ActionsWrapper>
      <Box mr="1">
        <RemoveRecipeButton
          aria-label={`remove recipe ${recipe.name}`}
          onClick={onDelete}
        >
          Delete
        </RemoveRecipeButton>
      </Box>
      <EditLink to={generatePath(URLS.EDIT, { id: recipe.id })}>Edit</EditLink>
    </ActionsWrapper>
  </Wrapper>
)
