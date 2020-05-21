import React from "react"
import { render, screen } from "@testing-library/react"
import { App } from "../App"

describe("App", () => {
  it("renders list route by default", () => {
    render(<App />)

    expect(screen.getByText("List recipes")).toBeInTheDocument()
  })
})
