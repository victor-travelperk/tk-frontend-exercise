import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

import { COLORS } from "../../shared/styles"
import { ROUTES as recipeRoutes } from "../../recipes"

const Wrapper = styled.nav`
  border-bottom: 0.0625rem solid ${COLORS.CULTURED};
`

const List = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  text-align: center;
  width: 10rem;
`

export const NavBar = () => (
  <Wrapper>
    <List>
      <ListItem>
        <Link to={recipeRoutes.LIST}>List recipes</Link>
      </ListItem>
      <ListItem>
        <Link to={recipeRoutes.CREATE}>Create recipe</Link>
      </ListItem>
    </List>
  </Wrapper>
)
