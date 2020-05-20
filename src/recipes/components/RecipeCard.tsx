import React from "react"
import styled from "styled-components"
import { Link, generatePath } from "react-router-dom"

import { Box } from "../../shared/components"
import { COLORS } from "../../shared/styles"
import { Recipe } from "../types"
import { ROUTES } from "../constants"

const Wrapper = styled.div`
  border: 0.1875rem solid ${COLORS.BLACK};
  padding: 1rem;
`

const EditLink = styled(Link)`
  color: ${COLORS.BLACK};
  border: 0.1875rem solid ${COLORS.BLACK};
  padding: 0.5rem;
  text-decoration: none;
`

const RemoveRecipeButton = styled.button`
  background: none;
  border: 0.1875rem solid ${COLORS.BLACK};
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
    <ul>
      {recipe.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient.name}</li>
      ))}
    </ul>
    <ActionsWrapper>
      <Box mr="1">
        <RemoveRecipeButton
          aria-label={`remove recipe ${recipe.name}`}
          onClick={onDelete}
        >
          Delete
        </RemoveRecipeButton>
      </Box>
      <EditLink to={generatePath(ROUTES.EDIT, { id: recipe.id })}>
        Edit
      </EditLink>
    </ActionsWrapper>
  </Wrapper>
)
