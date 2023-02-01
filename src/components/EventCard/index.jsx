import React from "react";
import styled from "styled-components";
import { mixins } from "../../styles/global.theme";
import dayjs from "dayjs";

const TimeCard = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(17.5px);
  -webkit-backdrop-filter: blur(17.5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: ${mixins.flexColCenter};
  p {
    font-size: var(--fs-s);
    font-family: var(--ff-content);
    color: var(--color-secondary);
  }
`;

const EventCard = ({ eventItem, bg, onClick }) => {
  console.log(eventItem, dayjs(eventItem.eventStartDate).format("ddd DD / MM"));
  return (
    <EventCardCtr style={bg ? { background: bg } : {}} onClick={onClick}>
      <div className="_cardOverlay">
        {/* <p className="_title">{eventItem.name}</p> */}
        {/* <div className="_info">
          <p className="_date">
            {dayjs(eventItem.date).format("MMM DD, YYYY")}
          </p>
          <p className="_location">{eventItem.location}</p>
        </div> */}
      </div>
      <TimeCard>
        <p>{dayjs(eventItem.eventStartDate).format("ddd DD / MM")}</p>
      </TimeCard>
      <div className="_eventImg">
        <img src={getImageURL(eventItem)} alt="" />
      </div>
      <div className="_eventInfo">
        <p className="_eventName">{eventItem.name}</p>
        <p className="_eventHost">Hosted By {eventItem.organizer}</p>
      </div>
    </EventCardCtr>
  );
};

function getImageURL(eventItem) {
  if (eventItem.image?.includes("https://")) {
    return eventItem.image;
  } else if (eventItem?.imageurl) {
    return eventItem.imageurl;
  } else
    return `https://media4.giphy.com/media/${eventItem.image}/giphy-downsized.gif?cid=57cef7f4367d9667f4103ef86da1ed5c24371074439c4b9b&rid=giphy-downsized.gif&ct=g`;
}

const EventCardCtr = styled.div`
  max-width: 277px;
  min-width: 277px;
  border: 2px solid;
  border-radius: 1rem;
  padding: 0.5rem;
  ${mixins.flexCol};
  flex: 1;
  flex-basis: 300px; //break-point
  gap: 1rem;
  cursor: pointer;
  position: relative;
  &:hover > ._cardOverlay {
    visibility: visible;
  }
  ._cardOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 1rem;
    padding: 1rem;
    ${mixins.flexCol}
    justify-content: space-evenly;
    color: var(--color-secondary);
    ._title {
      font-size: var(--fs-xxl);
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    visibility: hidden;
  }
  ._eventImg {
    width: 100%;
    height: 25vw;
    min-height: 275px;
    max-height: 300px;
    border-radius: 0.75rem;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  ._eventInfo {
    ._eventHost {
      color: var(--color-dull);
      font-size: var(--fs-s);
    }
    ._eventName {
      font-family: var(--ff-light);
      font-weight: 700;
    }
  }
  /* @media (min-width: 45em) {
    max-width: 50%;
  } */
`;
export default EventCard;
