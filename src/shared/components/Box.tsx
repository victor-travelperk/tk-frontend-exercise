import styled from "styled-components"

import { SPACES } from "../styles"

type Props = {
  mb?: keyof typeof SPACES
  mr?: keyof typeof SPACES
}

// Use this component when you need to add margins between components
export const Box = styled.div<Props>`
  margin-bottom: ${(props) => props.mb && SPACES[props.mb]};
  margin-right: ${(props) => props.mr && SPACES[props.mr]};
`
