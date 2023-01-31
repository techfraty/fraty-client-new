import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import assets from "../../assets";
import { mixins } from "../../styles/global.theme";
import ChirpCard from "../ChirpCard";
import Chirps from "../../pages/Chirps/index";
const ChirpsPreview = ({ height, chirps, eventID }) => {
  const navigate = useNavigate();
  const openAllChirps = () => {
    navigate(`/chirps/${eventID}`);
  };

  return (
    <ChirpsCtr>
      <div className="_header">
        <h5 className="_label">Chirps</h5>
        <span className="_link" onClick={openAllChirps}>
          See all chirps
        </span>
      </div>
      <Chirps height={height}></Chirps>
    </ChirpsCtr>
  );
};

const ChirpsCtr = styled.div`
  width: 100%;
  ${mixins.flexCol};
  gap: 1rem;
  ._header {
    ${mixins.flexRowCenter}
    justify-content: space-between;
    ._label {
      font-family: var(--ff-buttonFont);
      font-size: var(--fs-r2);
    }
    ._link {
      font-size: var(--fs-s);
      cursor: pointer;
    }
  }
  ._noChirpsFound {
    border: 1px solid var(--color-primary);
    padding: 1rem;
    background-size: cover;
    ${mixins.flexRowCenter}
    gap:1rem;
    cursor: pointer;
    font-size: var(--fs-r2);
    ._placeholder {
      width: 50px;
    }
  }
`;
export default ChirpsPreview;
