import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import { NavBar } from "./components"
import { CreateRecipe, ListRecipes, URLS } from "../recipes"

const App = () => (
  <div>
    <Router>
      <NavBar />
      <Switch>
        <Route exact path={URLS.CREATE}>
          <CreateRecipe />
        </Route>
        <Route exact path={URLS.LIST}>
          <ListRecipes />
        </Route>
        <Redirect to={URLS.LIST} />
      </Switch>
    </Router>
  </div>
)

export default App
