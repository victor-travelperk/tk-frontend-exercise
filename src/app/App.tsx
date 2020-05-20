import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import { NavBar } from "./components"
import { CreateRecipe, ListRecipes, EditRecipe, ROUTES } from "../recipes"

export const App = () => (
  <>
    <Router>
      <header>
        <NavBar />
      </header>
      <main>
        <Switch>
          <Route exact path={ROUTES.CREATE}>
            <CreateRecipe />
          </Route>
          <Route exact path={ROUTES.LIST}>
            <ListRecipes />
          </Route>
          <Route exact path={ROUTES.EDIT}>
            <EditRecipe />
          </Route>
          <Redirect to={ROUTES.LIST} />
        </Switch>
      </main>
    </Router>
  </>
)
