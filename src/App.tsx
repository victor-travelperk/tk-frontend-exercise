import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ListRecipes } from "./recipes";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/">
            <ListRecipes />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
