import React from "react";
import styled from "styled-components";
import { useState } from "react";
import assets from "../../assets";
import { useGlobalState } from "../../context/global.context";
import { useNavigate, useParams } from "react-router-dom";
import crossIcon from "../../assets/images/icons/close.svg";
import Button from "../Button/Button";
const Modal = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [copyStatus, setCopyStatus] = useState(false);
  const copyEventShareLink = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/event/${eventId}`
    );
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  const { setShowModalPublish } = useGlobalState();
  return (
    <ModalContiner>
      <div className="voxWrapper">
        <div className="headModal">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Share your party! 🍾</h2>
            <img
              src={crossIcon}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowModalPublish(false);
                navigate("/");
                localStorage.removeItem("FormData");
              }}
            />
          </div>
          <p style={{ width: "100%" }}>Invite your friends to the party.</p>
        </div>
        <div className="btnBox">
          <div className="boxbtn" onClick={copyEventShareLink}>
            {!copyStatus ? <p>Share link</p> : <p>link Copied</p>}
            <img src={assets.icons.link} alt="" />
          </div>
        </div>
        <div className="btnBox">
          <Button
            fullWidth
            textColor="white"
            className="continueBtn"
            bgColor="#EA664D"
            onClick={() => {
              navigate(`/event/${eventId}`, { replace: true });
            }}
          >
            Continue to party Page
          </Button>
        </div>
      </div>
    </ModalContiner>
  );
};

export default Modal;
const ModalContiner = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000081;
  .continueBtn {
    padding: 5px 0;
  }
  .voxWrapper {
    background: #f5ebe9;
    border: 1px solid #000000;

    padding: 24px 16px;
    width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .headModal {
    gap: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    h2 {
      font-size: 24px;
      font-weight: 700;
    }
    p {
      font-size: 14px;
      font-weight: 350;
    }
  }
  .btnBox {
    min-width: 100%;
    text-align: center;
    font-size: 14px;
    gap: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .boxbtn {
    background: #62aa70;
    border: 1px solid rgba(98, 170, 112, 1);
    padding: 11px 0;
    text-align: center;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: 16px;
    color: white;
    font-size: 16px !important;
    font-family: var(--ff-light);
  }
  .btnp {
    cursor: pointer;
    width: min-content;
  }
`;
