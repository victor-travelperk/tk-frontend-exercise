import styled from "styled-components"

import { SPACES } from "../styles"

type Props = {
  maxWidth?: string
}

export const Wrapper = styled.section<Props>`
  margin: ${SPACES["2"]} auto 0;
  max-width: ${(props) => props.maxWidth || "80rem"};
  position: relative;
  width 100%;
`
