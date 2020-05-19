import styled from "styled-components"

type Props = {
  maxWidth?: string
}

export const Wrapper = styled.section<Props>`
  margin: 1rem auto 0;
  max-width: ${(props) => props.maxWidth || "1280px"};
  position: relative;
  width 100%;
`
