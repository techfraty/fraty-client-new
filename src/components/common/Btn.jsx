import styled from "styled-components";
import { mixins } from "../../styles/global.theme";

const AppBtnStx = styled.button`
  position: relative;
  width: 100%;
  padding: 0.5rem 15px;
  text-align: center;

  border: 1px solid var(--color-primary);
  border-radius: 2rem;
  cursor: pointer;
  color: var(--color-primary);
  background: var(--bg-primary);
  &:active {
    box-shadow: none;
    position: relative;
    top: 0.2em;
  }
  ._btnText {
    width: 100%;
    font-size: ${(props) => props.fontSize ?? "var(--fs-s)"};
    ${mixins.flexRowCenter};
    gap: 0.5rem;
    font-family: var(--ff-light);
  }

  &:disabled {
    opacity: 0.7;
    cursor: no-drop;
  }
  /* span{
    font-size: 16px !important;
 
  } */
`;

const AppBtn = (props) => {
  return (
    <AppBtnStx
      fontSize={props.fontSize}
      style={{
        width: props?.width,
        background: props?.btnBG,
        borderRadius: props?.square ? "0" : "2rem",
        color: props.textColor || (props?.square ? "white" : "black"),
        border: props?.square ? "none" : "1px solid var(--color-primary)",
        backdropFilter: props?.backdropFilter,
        margin: props?.margin,
        padding: "10px",
        position: props?.position,
        bottom: "0",
        left: "0",
        fontFamily: props?.font,
      }}
      onClick={props.onClick}
      disabled={props?.isDisabled ?? false}
    >
      {props.loading ? (
        <span className="_btnText">
          {props?.loadingText ?? "Processing. . ."}
        </span>
      ) : (
        <span
          className="_btnText"
          style={{
            display: props?.display,
            justifyContent: props?.display ? "space-between" : "center",
            fontWeight: props?.fontWeight,
          }}
        >
          {props.children}
        </span>
      )}
    </AppBtnStx>
  );
};
export default AppBtn;
