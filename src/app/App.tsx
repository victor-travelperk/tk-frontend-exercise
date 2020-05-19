import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { NavBar } from "./components"
import { CreateRecipe, ListRecipes, URLS } from "../recipes"

const App = () => (
  <div>
    <Router>
      <NavBar />
      <Switch>
        <Route path={URLS.CREATE}>
          <CreateRecipe />
        </Route>
        <Route path={URLS.LIST}>
          <ListRecipes />
        </Route>
      </Switch>
    </Router>
  </div>
)

export default App
