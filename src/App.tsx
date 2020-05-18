import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { ListRecipes } from "./recipes"

const App = () => (
  <div>
    <Router>
      <Switch>
        <Route path="/">
          <ListRecipes />
        </Route>
      </Switch>
    </Router>
  </div>
)

export default App
