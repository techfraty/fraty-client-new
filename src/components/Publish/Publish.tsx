import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import AppBtn from "../common/Btn";
import Modal from "../Modal/Modal";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  fetchServices,
  patchServices,
  postServices,
} from "../../util/services";
import { AUTH_TOKEN } from "../../util/constants";
import { useAuthContext } from "../../context/auth.context";
import Loader from "../Loader";
import Button from "../Button/Button";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import shareIcon from "../../assets/icons/share.svg";
import ticketIcon from "../../assets/icons/ticket.svg";
import { useRouter } from "next/router";
import Image from "next/image";

const Publish = ({ id, type }: any) => {
  // const { address, isConnected } = useAccount();
  const {
    showModalPublish,
    setShowModalPublish,
    formData,
    setSelectedEvent,
    selectedEvent,
    setFormData,
    eventId,
    setEventId,
    setCurrentPageTitle,
    setDraftEvents,
    draftEvents,
    setCustomBackHeaderLink,
  } = useGlobalState();
  const { userDetails, currentUser } = useAuthContext();
  const [formDataStor, setFormDataStor] = useState<any>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [editView, setEditView] = useState(false);

  useEffect(() => {
    async function getDraftEvents() {
      setLoading(true);
      const res = await fetchServices.fetchDraftEvents();
      if (res) {
        console.log(res.data.data);
        setDraftEvents(res.data?.data);
      }
      setLoading(false);
    }
    getDraftEvents();
  }, []);

  useEffect(() => {
    if (draftEvents?.length && id) {
      const currDraftEvent = draftEvents.find((item: any) => item.id === id);
      if (currDraftEvent) {
        setFormDataStor(currDraftEvent);
      }
    }
  }, [draftEvents, id]);

  const publish = async () => {
    setLoading(true);
    console.log({ formDataStor });
    if (!formDataStor?.creator) return;
    if (!currentUser) {
      toast.error("Please login to publish event");
    }
    if (currentUser.id._id !== formDataStor?.creator) {
      toast.error("Hmm, seems like you are not the creator of this event");
      return;
    }

    formDataStor.creator = currentUser?.id?._id;
    formDataStor.publishStatus = "published";
    await patchServices
      .updateEvent({ publishStatus: "published", _id: id })
      .then((response) => {
        setEventId(response.data.eventId);
        console.log(response);
        toast.success("Event published");
        setShowModalPublish(true);
        // navigate("/")
        console.log(formDataStor);

        setDraftEvents((prev: any) =>
          prev.filter((ev: any) => ev.id !== formDataStor.id)
        );
      })
      .catch(function (response) {
        toast.error("Request failed");
        console.log(response);
      });
    setLoading(false);
  };
  const updateEvent = () => {
    router.push(`/createparty/edit/${id}`);
  };
  // if(editView){

  const { isLoading: loadingEvent } = useQuery({
    queryKey: ["fetchEventDetailsFull"],
    queryFn: async () =>
      fetchServices.fetchEventDetailsFull({
        eventID: id,
      }),
    onSuccess: (data) => setSelectedEvent(data.event),
    cacheTime: 0, //disabled cache for every new response
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (!token) {
      router.replace(`/event/${id}`);
    }
    if (currentUser && selectedEvent?.creator) {
      if (currentUser?.id?._id !== selectedEvent?.creator) {
        router.replace(`/event/${id}`);
      }
    }
  }, [formDataStor, selectedEvent, userDetails, currentUser, id, type, router]);
  // }

  useEffect(() => {
    setEditView(false);

    if (type === "publish") {
      setEditView(false);
    } else {
      setEditView(true);
    }
  }, [formData, type]);

  useEffect(() => {
    setCurrentPageTitle(formDataStor?.name || "Publish");
  }, [setCurrentPageTitle, formDataStor]);

  useEffect(() => {
    setCustomBackHeaderLink(`/event/${id}`);
  }, [setCustomBackHeaderLink, id]);

  const DeleteEvent = async () => {
    //delete event
    const { deleteEvent } = postServices;
    console.log(selectedEvent);
    const data = await deleteEvent(selectedEvent?._id);
    console.log(data);
    router.replace("/");
    setDraftEvents((prev: any) =>
      prev.filter((ev: any) => ev.id !== formDataStor.id)
    );
    toast.success("Event deleted");
  };
  return (
    <EventCtr>
      {loadingEvent ? (
        <Loader />
      ) : (
        <>
          {showModalPublish ? <Modal eventid={eventId} /> : null}
          <div className="_eventDetails">
            <div className="_eventImg">
              {editView ? (
                <Image src={selectedEvent?.image} alt="" />
              ) : formDataStor?.image ? (
                <Image src={formDataStor?.image} alt="" />
              ) : formDataStor?.imageUrl ? (
                <Image src={formDataStor?.imageUrl} alt="" />
              ) : (
                <Image
                  src="https://media1.giphy.com/media/3o7TKw4EWO6QR7YIKY/giphy.gif?cid=d469b3393ul8gb60blkcp2gzq6tis0bns27om87b75lvjm4t&rid=giphy.gif&ct=g"
                  alt=""
                />
              )}
            </div>
            {selectedEvent?.waitList === "true" ? (
              <AppBtn
                square={true}
                btnBG={"var(--color-green)"}
                className="btnStyle"
                onClick={() =>
                  router.push(`/waitinglist/${selectedEvent?._id}`)
                }
              >
                See Waiting list
              </AppBtn>
            ) : null}

            <div className="__hostedby_container">
              {editView ? (
                <p>Hosted By {selectedEvent?.organizer}</p>
              ) : (
                <p>Hosted By {formDataStor?.organizer}</p>
              )}
            </div>
            <div className="theamBox">
              <p>
                {editView
                  ? selectedEvent?.description
                  : formDataStor?.description}
              </p>
            </div>
            <div className="twob">
              <p className="_time">
                <Image src={calendarIcon} alt="" />
                <span>
                  {editView
                    ? dayjs(selectedEvent?.eventStartDate).format("MMM DD")
                    : dayjs(formDataStor?.eventStartDate).format("MMM DD")}
                </span>
              </p>
              <p className="_time">
                <Image src={clockIcon} alt="" />
                <span>
                  {editView
                    ? selectedEvent?.eventStartTime
                    : formDataStor?.eventStartTime}
                </span>
              </p>
            </div>
            {formDataStor?.costPerPerson ? (
              <p className="_time">
                <Image src={ticketIcon} alt="" />
                <span>
                  ₹
                  {editView
                    ? selectedEvent?.costPerPerson
                    : formDataStor?.costPerPerson}{" "}
                  per person
                </span>
              </p>
            ) : null}

            <div style={{ width: "100%" }}>
              <Button
                textColor="white"
                bgColor="var(--color-orange)"
                fullWidth
                onClick={() => {
                  window.open(selectedEvent?.locationURL, "_blank");
                }}
                icon={<Image src={assets.icons.locationWhite} alt="" />}
              >
                {editView ? selectedEvent?.location : formDataStor?.location}
              </Button>

              {/* {formDataStor?.url ? (
                <div
                  className="_location btnStyle"
                  style={{
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#E8A237",
                  }}
                >
                  <p>{formDataStor?.url}</p>
                  <Image src={assets.icons.link} alt="link" />
                </div>
              ) : selectedEvent?.url ? (
                <div
                  className="_location btnStyle"
                  style={{
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#E8A237",
                  }}
                >
                  <p>{selectedEvent?.url}</p>
                  <img src={assets.icons.link} alt="link" />
                </div>
              ) : null} */}
            </div>
          </div>
          <div className="_rsvpReactions">
            <div className="_reaction">
              <div className="_reactionImg">
                <Image src={assets.reactions.going} alt="going-to-event" />
              </div>
              <p className="_reactionLabel">I'm Going !</p>
            </div>
            <div className="_reaction">
              <div className="_reactionImg">
                <Image
                  src={assets.reactions.maybe}
                  alt="mayber-going-to-event"
                />
              </div>
              <p className="_reactionLabel">Maybe !</p>
            </div>
            <div className="_reaction">
              <div className="_reactionImg">
                <Image src={assets.reactions.nope} alt="not-going-to-event" />
              </div>
              <p className="_reactionLabel">Not Going !</p>
            </div>
          </div>
          <div className="bro">
            {editView && (
              <AppBtn
                square={true}
                btnBG={"var(--color-orange)"}
                className="btnStyle"
                onClick={updateEvent}
              >
                Edit Event
              </AppBtn>
            )}
            <br />
            <br />
            <AppBtn
              square={true}
              btnBG={"var(--color-green)"}
              className="btnStyle"
              onClick={publish}
            >
              Publish Event
            </AppBtn>
            <br />
            <br />
            {editView && (
              <AppBtn
                square={true}
                btnBG={"#BAA1F2"}
                className="btnStyle"
                onClick={DeleteEvent}
              >
                Delete Event
              </AppBtn>
            )}
          </div>
        </>
      )}
    </EventCtr>
  );
};

export default Publish;

const EventCtr = styled.div`
  .not-allowed {
    pointer-events: auto !important;
    cursor: not-allowed !important;
  }
  ._pollsCtr {
    width: 100%;
    ._polls {
      margin-top: 1rem;
      ${mixins.flexCol};
      gap: 1rem;
      border: 1px solid var(--color-primary);
      border-radius: 2rem;
      padding: 1.5rem 1rem;
      ._pollQues {
        font-size: var(--fs-r2);
      }
    }
    ._poll {
      ${mixins.flexColCenter};
      border: 1px solid;
      padding: 0.5rem;
      font-size: var(--fs-r2);
      background-color: var(--bg-primary);
      border-radius: 2rem;
      transition: all 0.5s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        opacity: 0.9;
        background: #e0e0e0b3;
      }
    }
    ._pollLabel {
      z-index: 2;
      width: 100%;
      padding-left: 0.5rem;
      font-size: var(--fs-s);
    }
    ._pollPercentFiller {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 2rem;
      transition: "all .5s ease";
    }
  }
  .__hostedby_container {
    p {
      font-family: var(--ff-title);
    }
  }
  .bro {
    margin-top: 40px;
  }
  .save {
    background: #ea664d;
    border: 1px solid #000000;
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
    border-radius: 24px;
    margin-top: 20px;
    cursor: pointer;
  }
  .theamBox {
    color: #7a706d;
    ${"" /* min-height: 100px; */}
    padding: 10px;
    font-size: 20px;
  }
  .theamBoxsmall {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #000000;
    padding: 10px 23px;
    font-size: 20px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  ._eventDetails {
    ${mixins.flexColCenter}
    gap:2rem;
  }
  ._eventBtns {
    width: 100%;
    ${mixins.gridCenter}
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
    ._eventBtn {
      width: 100%;
      padding: 1.5rem 1rem;
      border-radius: 1rem;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      &:disabled {
        background-color: grey !important;
        cursor: not-allowed;import Loader from './../../components/Loader/index';
import { useRouter } from 'next/router';

      }
      &:active {
        box-shadow: none;
        position: relative;
        top: 0.2em;
      }
      &:nth-of-type(1) {
        background: url(${assets.overlays.btn1Overlay}) no-repeat center,
          var(--color-orange);
        background-size: cover;
      }
      &:nth-of-type(2) {
        background: url(${assets.overlays.btn2Overlay}) no-repeat center,
          var(--color-green);
        background-size: cover;
      }
      &:nth-of-type(3) {
        background: url(${assets.overlays.btn3Overlay}) no-repeat center,
          var(--color-yellow);
        background-size: cover;
      }
      &:nth-of-type(4) {
        background: url(${assets.overlays.btn4Overlay}) no-repeat center,
          var(--color-purple);
        background-size: cover;
      }
    }
  }
  .twob {
    display: flex;
    gap: 20px;
  }
  ._eventImg {
    width: 100%;
    height: 310px;

    overflow: hidden;
    position: relative;
    ._info {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(0, 0, 0, 0.5);
      ${mixins.flexCol}
      justify-content: space-evenly;
      padding: 1rem;
      color: var(--color-secondary);

      ._eventName {
        font-size: var(--fs-xl);
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  ._rsvpConfirmationBtns {
    width: 100%;
  }
  ._time {
    font-size: var(--fs-r2);
    ${mixins.flexRowCenter}
    gap:.5rem;
  }
  ._location {
  }
  ._organizer {
    font-size: var(--fs-r2);
    text-align: center;
  }
  ._rsvpReactions {
    width: 100%;
    ${mixins.flexRowCenter}
    justify-content: space-between;
    margin: 2.5rem 0;
    gap: 1rem;
    ._reaction {
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
        border-radius: 100%;
        overflow: hidden;
        border: 2px solid;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: 0.2s ease;
          border-radius: 100%;
          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
`;
