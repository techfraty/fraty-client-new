import React from "react";
import styled from "styled-components";
import assets from "../../assets";
import { mixins } from "../../styles/global.theme";
import ChirpCard from "../ChirpCard";
import { useRouter } from "next/router";
import Chirps from "../Chirps";
const ChirpsPreview = ({ height, chirps, eventID }) => {
  const navigate = useRouter();
  const openAllChirps = () => {
    navigate.push(`/chirps/${eventID}`);
  };

  return (
    <ChirpsCtr>
      <div className="_header">
        <h5 className="_label">Chirps</h5>
        <span className="_link" onClick={openAllChirps}>
          See all chirps
        </span>
      </div>
      <Chirps eventID={eventID} height={height}></Chirps>
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
