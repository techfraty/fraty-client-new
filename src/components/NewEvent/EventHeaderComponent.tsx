import { atcb_action } from "add-to-calendar-button";
import { useState } from "react";
import styled from "styled-components";
import AppBtn from "../common/Btn";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { incrementTimeBy2Hours } from "../../util/utils";
import assets from "../../assets";

const EventHeader = ({
  event,
  isEventCreator,
  hasRsvpd,
  removeRSVPHandler,
  selectedEvent,
  reactionContainerRef,
}) => {
  const { eventID: eventIDParam } = useParams();
  const { userInfo, userCred } = useGlobalState();
  const [copyStatus, setCopyStatus] = useState(false);
  const [showNotGoing, setshowNotGoing] = useState(false);
  const copyLink = () => {
    window.navigator.clipboard.writeText(
      `${window.location.host}/?referral=${userCred?._id}`
    );
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  const copyEventShareLink = () => {
    window.navigator.clipboard.writeText(
      `${window.location.host}/event/${eventIDParam}`
    );
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  return (
    <EventHeaderCtr>
      <div className="_btns">
        <AppBtn
          square={true}
          btnBG={"#65B378"}
          display="flex"
          onClick={() => {
            atcb_action({
              name: `${event?.name}`,
              startDate: `${event?.eventStartDate}`,
              endDate: `${event?.eventStartDate}`,
              startTime: `${event?.eventStartTime}`,
              endTime: `${incrementTimeBy2Hours(event?.eventStartTime)}`,
              location: `${event?.location}`,
              description: `${event?.description}`,
              options: [
                "Apple",
                "Google",
                "Microsoft365",
                "Outlook.com",
                "Yahoo",
              ],
              timeZone: "Europe/Berlin",
              eventIDParam,
            });
          }}
        >
          <span>Add to Calender</span>
          <img src={assets.icons.calendarWhite} alt="" />
        </AppBtn>
        <AppBtn
          display="flex"
          square={true}
          btnBG={"#E8A237"}
          onClick={copyEventShareLink}
        >
          <span>{copyStatus ? "Event link copied!" : "Share event"}</span>
          <img src={assets.icons.share} alt="" />
        </AppBtn>
      </div>
      <div className="reactionsss">
        <div className={`notgoing_reaction`}>
          <div className="_reaction">
            <div className="_reactionImg _reaction_going">
              {/* <img src={goingImage} alt="going-to-event" /> */}
              <img
                src={assets.reactions.going2}
                alt="going"
                className="overlay_image_reaction"
                onClick={() => {
                  setshowNotGoing((prev) => !prev);
                }}
              />
            </div>
            <p className="_reactionLabel">I'm Going</p>
          </div>
        </div>
        {hasRsvpd &&
          !isEventCreator &&
          new Date(selectedEvent?.eventStartDate) > new Date() &&
          new Date(selectedEvent?.eventStartDate).getDate() >
            new Date().getDate() && (
            <div
              className={`notgoing_reaction ${showNotGoing ? "show" : "hide"}`}
            >
              <div
                className="_rsvpReactions"
                style={{ justifyContent: "space-around" }}
                ref={reactionContainerRef}
              >
                {" "}
                <div
                  className="_reaction"
                  onClick={() => {
                    removeRSVPHandler();
                  }}
                >
                  <div className="_reactionImg _reaction_going">
                    {/* <img src={notGoingImage} alt="going-to-event" /> */}

                    <img
                      src={assets.reactions.nope}
                      alt="not-going-to-event"
                      className="overlay_image_reaction"
                    />
                  </div>
                  <p className="_reactionLabel">Not Going !</p>
                </div>
              </div>
            </div>
          )}
      </div>
    </EventHeaderCtr>
  );
};

export default EventHeader;

const EventHeaderCtr = styled.div`
  position: relative;
  width: 100%;
  ${mixins.flexRowCenter}
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
  ._btns {
    width: 60%;
    ${mixins.flexCol};
    gap: 1rem;
    > button > span {
      font-weight: 700;
    }
  }
  ._reaction {
    position: relative;
    ${mixins.flexColCenter};
    gap: 0.5rem;
    font-size: var(--fs-s);
    cursor: pointer;
    ._reactionImg {
      width: 15vw;
      height: 15vw;
      min-width: 100px;
      min-height: 100px;
      max-width: 125px;
      max-height: 125px;
      overflow: hidden;
      transition: all 500ms ease;
      img {
        border-radius: 100%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: 0.2s ease;
      }
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  ._reaction_going {
    display: flex;
    justify-content: center;
    position: relative;
  }
  .overlay_image_reaction {
    width: 80% !important;
    height: 80% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ._reactionLabel {
    font-family: var(--ff-title);
  }
  .reactionsss {
    position: absolute;
    top: -70px;
    right: 0;
    border-radius: 80px;
    z-index: 100;
    ${"" /* transition: 1s ease; */}
    @media screen and (max-width: 678px) {
      top: -30px;
    }
    :has(.notgoing_reaction.show) {
      backdrop-filter: blur(6px);
      border: 1px solid black;
    }
  }
  .notgoing_reaction {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    height: 220px;
    width: 150px;
    transition: 500ms ease;
    opacity: 1;
    background: transparent;
    z-index: 100;
    @media screen and (max-width: 678px) {
      height: 180px;
      width: 120px;
    }
  }
  .notgoing_reaction.hide {
    display: none;
  }
  .notgoing_reaction.show {
    display: flex;
    opacity: 1;
  }
`;
