import styled from "styled-components"

import { COLORS } from "../../shared/styles"

type Props = {
  backgroundColor?: string
}

export const Button = styled.button<Props>`
  color: ${COLORS.BLACK};
  background: white;
  border: 0.1875rem solid ${COLORS.BLACK};
  padding: 0.5rem;
  width: 100%;

  &:disabled {
    color: ${COLORS.CULTURED};
    border-color: ${COLORS.QUICK_SILVER};
  }
`
