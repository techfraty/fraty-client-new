import React from "react";
import styled from "styled-components";

const Button = ({
  children,
  onClick,
  icon,
  bgColor = "white",
  textColor = "black",
  type = "button",
  fullWidth = false,
  className = "",
}) => {
  return (
    <StyledButton
      style={{
        color: textColor,
        backgroundColor: bgColor,
        width: fullWidth ? "100%" : "inherit",
      }}
      type={type}
      onClick={onClick}
      className={className}
    >
      <span style={{ justifyContent: icon ? "space-between" : "center" }}>
        <span>{children}</span>
        {icon && <span>{icon}</span>}
      </span>
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  & {
    border: none;
    font-size: 15px;

    font-family: var(--ff-light);
  }
  > span {
    display: flex;
    align-items: center;
    padding: 8px 16px;
  }
`;
