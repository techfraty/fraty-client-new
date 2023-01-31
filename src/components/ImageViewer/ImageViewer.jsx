import React from "react";
import styled from "styled-components";
import assets from "../../assets";

const ImageViewer = ({ imageUrl, handleClose }) => {
  return (
    <ModalContiner>
      <div className="wrapper">
        <img src={imageUrl} alt="" style={{ width: "100%", height: "100%" }} />
      </div>
      <img
        src={assets.icons.close}
        className="closebtn"
        alt="close"
        onClick={() => handleClose()}
      />
    </ModalContiner>
  );
};

export default ImageViewer;
const ModalContiner = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 235, 233, 0.2);
  backdrop-filter: blur(10px);

  .wrapper {
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

  .closebtn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`;
