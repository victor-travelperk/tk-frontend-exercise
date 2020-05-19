import styled from "styled-components"

import { COLORS } from "../../shared/styles"

type Props = {
  backgroundColor?: string
}

export const Button = styled.button<Props>`
  color: ${COLORS.WHITE};
  background-color: ${(props) => props.backgroundColor || COLORS.CAROLINA_BLUE};
  border-radius: 0.25rem;
  border: none;
  padding: 0.5rem;
  width: 100%;
`
