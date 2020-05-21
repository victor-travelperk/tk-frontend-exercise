import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"
import { normalize } from "styled-normalize"
import { App } from "./app/App"

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
