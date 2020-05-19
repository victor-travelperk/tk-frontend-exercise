import styled from "styled-components"

import { COLORS } from "../../shared/styles"

export type NotificationType = "SUCCESS" | "DANGER"

export const Notification = styled.div<{ type: NotificationType }>`
  color: ${COLORS.WHITE};
  background-color: ${(props) =>
    props.type === "SUCCESS" ? COLORS.GREEN_SHEEN : COLORS.TAWNY};
  padding: 1rem;
  border-radius: 0.25rem;
`
