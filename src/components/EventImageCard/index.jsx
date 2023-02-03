import Image from "next/image";
import React from "react";
import styled from "styled-components";

const EventImageCard = ({ imgSrc, size, onClickImage, idx }) => {
  return (
    <EventImageCardCtr size={size} onClick={() => onClickImage(idx)}>
      <Image src={imgSrc} alt="event" />
    </EventImageCardCtr>
  );
};
const EventImageCardCtr = styled.div`
  min-width: ${(props) => props.size ?? "100px"};
  height: ${(props) => props.size ?? "100px"};
  background: var(--bg-primary);
  overflow: hidden;
  cursor: pointer;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export default EventImageCard;
