import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"
import { normalize } from "styled-normalize"
import { App } from "./app/App"
import * as serviceWorker from "./serviceWorker"

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto Slab', serif;
    overflow-x: hidden;
  }
`

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
