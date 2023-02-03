import React from "react";
import styled from "styled-components";
import assets from "../../assets";
import { mixins } from "../../styles/global.theme";
import Button from "../Button/Button";
import AppBtn from "../common/Btn";

const NotGoingPopup = ({ closeModal, text, proceed }) => {
  return (
    <NotGoinPopupCtr>
      <div className="_popupMessage">
        <div className="_reactionImg">
          <img src={assets.reactions.alright} alt="" />
        </div>
        <p className="_note">{text}</p>
        <div className="_btns">
          <Button
            bgColor={"var(--color-purple)"}
            onClick={() => {
              proceed();
              closeModal();
            }}
          >
            Proceed
          </Button>
          <Button
            className="_btn"
            bgColor={"var(--color-green)"}
            onClick={closeModal}
          >
            Reconsider
          </Button>
        </div>
      </div>
    </NotGoinPopupCtr>
  );
};

const NotGoinPopupCtr = styled.div`
  width: 100%;
  min-height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  ${mixins.gridCenter}
  /* From https://css.glass */
  background: rgba(46, 46, 46, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
  ._reactionImg {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  ._popupMessage {
    width: 100%;
    height: 100%;
    max-width: 350px;
    max-height: 350px;
    border-radius: 1rem;
    padding: 1rem;
    font-size: var(--fs-r2);
    background: var(--bg-primary);
    ${mixins.flexColCenter}
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    gap: 1rem;
    ._note {
      text-align: center;
    }
    ._btns {
      width: 100%;
      ${mixins.flexColCenter}
      gap:1rem;
    }
  }
`;
export default NotGoingPopup;
