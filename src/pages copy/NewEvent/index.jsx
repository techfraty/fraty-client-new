import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import ChirpsPreview from "../../components/ChirpsPreview";
import AppBtn from "../../components/common/Btn";
import GalleryPreview from "../../components/GalleryPreview";
import Loader from "../../components/Loader";
import { useConnect, useAccount } from "wagmi";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { authServices, fetchServices, postServices } from "../../util/services";
import { atcb_action } from "add-to-calendar-button";
import NotGoingPopup from "../../components/NotGoingPopup";
import PaymentPopup from "../../components/PaymentPopup/PaymentPopup";
import AuthModal from "../../components/AuthModal/AuthModal";
import { useAuthContext } from "../../context/auth.context";
import Waiting from "../Waiting/Waiting";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import locationIcon from "../../assets/icons/location.svg";
import shareIcon from "../../assets/icons/share.svg";
import ticketIcon from "../../assets/icons/ticket.svg";
import { FRATY_EVENTS } from "../../util/constants";
import { formToCurrency } from "../../util/utils";
import EventHeader from "./EventHeaderComponent";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Helmet } from "react-helmet";

const EventPage = () => {
  const {
    selectedEvent,
    setSelectedEvent,
    setCurrentPageTitle,
    setUserInfo,
    userCred,
    showpopup,
    setshowPopup,
    paymentConfompopup,
    setPatmetConform,
    setCustomBackHeaderLink,
  } = useGlobalState();
  const { eventID: eventIDParam, rsvpStatus } = useParams();
  const [copyStatus, setCopyStatus] = useState(false);
  const { state: event } = useLocation();
  const alreadyRSVPed = useRef(false);

  const [userIntereseted, setUserInterested] = useState(false);
  const [userConnected, setUserConnected] = useState(false);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [userSubmittedPoll, setUserSubmittedPoll] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalCallback, setAuthModalCallback] = useState(false);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [isEventCreator, setIsEventCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const signupRef = useRef(null);
  const reactionContainerRef = useRef(null);
  const [lightBoxToggler, setLightBoxToggler] = useState(false);
  const [lightBoxIdx, setLightBoxIdx] = useState(0);
  const [notGoingModalText, setNotGoingModalText] = useState("");
  const [notGoingModalAfterRsvp, setNotGoingModalAfterRsvp] = useState(false);
  const [members, setMembers] = useState([]);
  const { currentUser, userDetails } = useAuthContext();

  function isValidEventID(eventID) {
    return eventID !== undefined && eventID !== null && eventID?.length === 24;
  }

  const navigate = useNavigate();
  console.log({ loading });
  /*
    Fetch event details
  */
  useEffect(() => {
    async function fetchEventDetails() {
      setIsLoading(true);
      try {
        const res = await fetchServices.fetchEventDetailsFull({
          eventID: eventIDParam,
        });
        setSelectedEvent(res.event);
        setCurrentPageTitle(res.event.name);
      } catch (error) {
        console.log("ERR_FETCH_EVENT_DETAILS", error);
      }
      setIsLoading(false);
    }
    if (!isValidEventID(eventIDParam)) {
      setCustomBackHeaderLink("/");
    }
    fetchEventDetails();
  }, [eventIDParam, setSelectedEvent, setCurrentPageTitle]);

  /*
    Check if user is event creator
  */
  useEffect(() => {
    if (currentUser && selectedEvent?._id) {
      setCustomBackHeaderLink("/");
      setIsEventCreator(selectedEvent?.creator === currentUser?.id?._id);
    }
  }, [currentUser, selectedEvent, setCustomBackHeaderLink]);

  /*
    Check and save eventId in localstorage
    to display viewed events on home page
  */
  useEffect(() => {
    const prevEvents = JSON.parse(localStorage.getItem(FRATY_EVENTS)) || [];
    if (!prevEvents.includes(eventIDParam) && isValidEventID(eventIDParam)) {
      prevEvents.push(eventIDParam);
      localStorage.setItem(FRATY_EVENTS, JSON.stringify(prevEvents));
    }
  }, [eventIDParam]);

  const copyEventShareLink = () => {
    console.log(window.location);
    window.navigator.clipboard.writeText(
      `${window.location.origin}/event/${eventIDParam}`
    );
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  const { data: eventImages, isLoading: loadingImages } = useQuery({
    queryKey: ["fetchAllImages"],
    queryFn: async () => fetchServices.fetchAllImages(eventIDParam),
    enabled: isEventCreator || hasRsvpd,
    refetchInterval: 5000,
    cacheTime: 0, //disabled cache for every new response
  });

  const { data: chirps, isLoading: loadingChirps } = useQuery({
    queryKey: ["fetchAllChurps"],
    queryFn: async () => fetchServices.fetchAllChirps(eventIDParam),
    enabled: isEventCreator || hasRsvpd,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    cacheTime: 0, //disabled cache for every new response
  });
  // console.log({ userDetails });
  const { isLoading: authLoading, mutate: rsvpUser } = useMutation(
    authServices.rsvpUser,
    {
      onSuccess: (res) => {
        const userToken = res.token;
        const userData = res.message.user;
        console.log({ res });
        setInWaitingRoom(res?.message?.inWaitingRoom);
        const user = { token: userToken, ...userData };
        setUserInfo(user);
        setHasRsvpd(true);
        setLoading(false);
        const formData = new FormData();
        // Update the formData object
        const { uploadChirp } = postServices;
        formData.append("text", `${userDetails?.name} has joined the event.`);
        formData.append("event", selectedEvent?._id);

        uploadChirp({ formData: formData, eventID: selectedEvent?._id });
        if (selectedEvent?.waitList === false) setInWaitingRoom(false);
        if (!alreadyRSVPed.current)
          toast.success("User Onborded Successfully !");
      },
      onError: (err) => {
        toast.error("User Onborded Failure !");
        console.log("User Onboard Failure.");

        setLoading(false);
      },
    }
  );

  const confirmUserRequest = () => {
    setLoading(true);
    rsvpUser({
      wallet: currentUser.phoneNumber,
      name: currentUser.name,
      eventID: selectedEvent._id,
      referral: window.localStorage.getItem("referral") ?? "",
    });
  };

  //   const showAllPartners = () => {
  //     navigate("/partners", { state: selectedEvent?.partners });
  //   };
  //   const showAllSpeakers = () => {
  //     navigate("/speakers", { state: selectedEvent?.speakers });
  //   };
  //   const showAllItenary = () => {
  //     navigate("/itenary", { state: selectedEvent?.iternary });
  //   };
  //   const showFAQ = () => {
  //     navigate("/faq", { state: selectedEvent?.faq });
  //   };
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { fetchEventDetails } = fetchServices;
      const data = await fetchEventDetails({
        eventID: selectedEvent?._id,
        address: currentUser?.phoneNumber,
      });
      console.log(data);
      const filteredMembers = data?.members?.filter(
        (m) => m?.wallet !== userDetails?.wallet
      );
      setMembers(filteredMembers);
      setLoading(false);
    };
    fetchEvents();
  }, [selectedEvent?._id, currentUser?.phoneNumber]);
  useEffect(() => {
    const fetchFratyUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetchServices.fetchFratyUser(
          currentUser?.phoneNumber,
          selectedEvent?._id
        );
        console.log(res);
        setInWaitingRoom(res?.data?.inWaitingRoom);
        if (selectedEvent?.waitList === false) setInWaitingRoom(false);
        setHasRsvpd(true);
      } catch (err) {
        setHasRsvpd(false);
      }
      setIsLoading(false);
    };
    if (currentUser?.phoneNumber && selectedEvent?._id) {
      fetchFratyUser();
    }
  }, [currentUser, selectedEvent]);

  useEffect(() => {
    setCurrentPageTitle(selectedEvent?.name);
  }, [selectedEvent, setCurrentPageTitle]);

  function removeEventFromLocalStorage(eventId) {
    let prevEvents = JSON.parse(localStorage.getItem(FRATY_EVENTS));
    if (prevEvents) {
      prevEvents = prevEvents.filter((e) => e !== eventId);
      localStorage.setItem(FRATY_EVENTS, JSON.stringify(prevEvents));
    }
  }

  function navigateToResponse(type) {
    return navigate(`/event/${eventIDParam}/${type}`, { replace: true });
  }

  function handleClickRSVPResponse(type) {
    if (!type) return;

    if (!currentUser) {
      setShowAuthModal(true);
      setAuthModalCallback(() => () => navigateToResponse(type));
      return;
    }

    switch (type) {
      case "yes":
        setUserInterested(true);

        if (!selectedEvent?.upi?.trim()) {
          confirmUserRequest();
          removeEventFromLocalStorage(eventIDParam);
        } else {
          setShowPaymentPopup(true);
        }
        break;
      case "no":
      case "maybe":
        setNotGoingModalText(
          " Alright, maybe you'll be interested in other events!"
        );
        setNotGoingModalAfterRsvp(false);
        setshowPopup(true);
        setUserInterested(false);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (rsvpStatus !== undefined && rsvpStatus !== null && rsvpStatus?.length) {
      handleClickRSVPResponse(rsvpStatus);
    }
  }, [rsvpStatus]);

  function handleSignup() {
    if (!userConnected) {
      // connect({ connector: connectors[0] })
      setShowAuthModal(true);
      return;
    }
    setShowPaymentPopup(true);
  }

  function handleClickEditEvent() {
    navigate(`/createParty/edit/${selectedEvent?._id}`);
  }

  function handleClickRSVPNow() {
    if (reactionContainerRef.current) {
      reactionContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function checkIfUserInWaitingRoom() {
    return (
      !isEventCreator &&
      hasRsvpd &&
      inWaitingRoom &&
      selectedEvent?.waitList === true
    );
  }

  /*
    Check if event is valid
  */
  function isValidEvent() {
    return selectedEvent && selectedEvent._id;
  }

  if (isLoading || loading) return <Loader />;
  console.log(selectedEvent, inWaitingRoom, hasRsvpd, isEventCreator);
  const getImageTop = () => {
    const top = (selectedEvent?.name?.length / 33) * 40 + 70;
    return `${top}px`;
  };
  const { removeRsvpUser } = authServices;
  const removeRSVP = async () => {
    console.log({ userDetails });
    const data = removeRsvpUser({
      wallet: userDetails?.wallet,
      eventId: selectedEvent?._id,
    });
    console.log(data);
    setHasRsvpd(false);
  };
  const removeRSVPHandler = () => {
    setshowPopup(true);
    setUserInterested(false);
    setNotGoingModalText("Do you really want to miss such an awesome Event?");
    setNotGoingModalAfterRsvp(true);
  };

  return (
    <EventCtr>
      <Helmet>
        <title>Event on Fraty!</title>
        <meta
          name="description"
          content="Hey, checkout this event on fraty.in"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Event on Fraty!" />
        <meta
          property="og:description"
          content="Hey, checkout this event on fraty.in"
        />
        <meta
          property="og:image"
          content="https://www.meme-arsenal.com/memes/cc93311366bfbca1bff40222ec269da9.jpg"
        ></meta>
      </Helmet>
      {/* <PaymentPopup></PaymentPopup> */}
      {!isLoading && !isValidEvent() ? (
        <h2>Seems like you're at the wrong page!</h2>
      ) : (
        <>
          {showPaymentPopup ? (
            <PaymentPopup
              upi={selectedEvent?.upi}
              confirmUserRequest={confirmUserRequest}
              handleClose={() => setShowPaymentPopup(false)}
              cost={selectedEvent?.costPerPerson}
            />
          ) : null}
          <div
            className={
              selectedEvent?.waitList === true
                ? "_eventDetails "
                : "_eventDetails"
            }
          >
            <div
              className="_eventImg"
              style={{
                top: getImageTop(),
              }}
            >
              <img src={selectedEvent?.image} alt="" />
            </div>
            {checkIfUserInWaitingRoom() && (
              <div className="waitinglistWarring">
                <h2>You&apos;re in the waitlist!</h2>
                <p>This event requires manual approval from host</p>
              </div>
            )}
            {isEventCreator && selectedEvent?.waitList === true && (
              <AppBtn
                square={true}
                onClick={() => {
                  navigate(`/waitinglist/${selectedEvent?._id}`);
                }}
                btnBG=" #6597B3"
              >
                See Waiting List
              </AppBtn>
            )}
            <p className="_organizer">Hosted By {selectedEvent?.organizer}</p>
            {(isEventCreator || (hasRsvpd && !inWaitingRoom)) && (
              <EventHeader
                hasRsvpd={hasRsvpd}
                isEventCreator={isEventCreator}
                event={selectedEvent}
                removeRSVPHandler={removeRSVPHandler}
                selectedEvent={selectedEvent}
                reactionContainerRef={reactionContainerRef}
              />
            )}
            <div className="discbox">
              <p>{selectedEvent?.description}</p>
            </div>
            <div className="inlinbox">
              <p className="_time">
                <img src={calendarIcon} alt="" />
                <span>
                  {dayjs(selectedEvent?.eventStartDate).format("MMM DD")}
                </span>
              </p>
              <p className="_time">
                <img src={clockIcon} alt="" />
                <span>{selectedEvent?.eventStartTime}</span>
              </p>
            </div>
            {selectedEvent?.costPerPerson && (
              <p className="_ticket">
                <img src={ticketIcon} alt="" />
                <span>
                  {formToCurrency(selectedEvent?.costPerPerson)} per person
                </span>
              </p>
            )}
            {(selectedEvent?.showLocation || hasRsvpd) && (
              <AppBtn
                margin={"15px 0"}
                onClick={() => {
                  if (selectedEvent?.locationURL?.length > 0) {
                    window.open(`${selectedEvent?.locationURL}`, "_blank");
                  } else {
                    toast.warning("Location link not available");
                  }
                }}
                square={true}
                btnBG="#EA664D"
                display="flex"
                width={"100%"}
              >
                <span>{selectedEvent?.location}</span>
                <img src={locationIcon} alt="" />
              </AppBtn>
            )}

            {!isEventCreator && !hasRsvpd && (
              <div style={{ width: "100%" }}>
                <AppBtn
                  margin={"15px 0"}
                  width={"100%"}
                  onClick={copyEventShareLink}
                  square={true}
                  btnBG="#E8A237"
                  display="flex"
                >
                  <span>
                    {copyStatus ? "Event link copied!" : "Share this event"}
                  </span>
                  <img src={shareIcon} alt="" />
                </AppBtn>
              </div>
            )}
            {!isEventCreator && !hasRsvpd && !inWaitingRoom && (
              <div className="_rsvpReactions" ref={reactionContainerRef}>
                <div
                  className="_reaction"
                  onClick={() => handleClickRSVPResponse("yes")}
                >
                  <div className="_reactionImg _reaction_going">
                    {/* <img src={goingImage} alt="going-to-event" /> */}
                    <img
                      src={assets.reactions.going}
                      alt="going-to-event"
                      className="overlay_image_reaction"
                    />
                  </div>
                  <p className="_reactionLabel">I'm Going !</p>
                </div>
                <div
                  className="_reaction"
                  onClick={() => handleClickRSVPResponse("maybe")}
                >
                  <div className="_reactionImg _reaction_going maybe">
                    {/* <img src={maybeImage} alt="going-to-event" /> */}
                    <img
                      src={assets.reactions.maybe}
                      alt="mayber-going-to-event"
                      className="overlay_image_reaction"
                    />
                  </div>
                  <p className="_reactionLabel">Maybe !</p>
                </div>
                <div
                  className="_reaction"
                  onClick={() => handleClickRSVPResponse("no")}
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
            )}
            {/* {selectedEvent?.waitList !== "true" ? */}
            <div
              style={{ width: "100%", position: "relative" }}
              className="_eventActivity"
            >
              {!isEventCreator && (!hasRsvpd || inWaitingRoom) && (
                <div className="__custom_bgBlur"></div>
              )}
              {!isEventCreator && (!hasRsvpd || inWaitingRoom) && (
                <>
                  <h2>Restricted Access</h2>
                  <p>
                    Only RSVP&apos;d guests can view event activity & see
                    who&apos;s going
                  </p>
                </>
              )}
              <div className="_rsvpConfirmationBtns">
                {/* {!currentUser && (
                  <div ref={signupRef} style={{ width: "100%" }}>
                    <AppBtn
                      btnBG={"#BAA1F2"}
                      square={true}
                      className="btnStyle qq"
                      onClick={handleSignup}
                      width="100%"
                    >
                      Sign up to RSVP
                    </AppBtn>
                  </div>
                )} */}
                {/* {!isEventCreator &&
                  currentUser &&
                  !hasRsvpd &&
                  !inWaitingRoom && (
                    <div ref={signupRef} style={{ width: "100%" }}>
                      <AppBtn
                        btnBG={"#BAA1F2"}
                        square={true}
                        className="btnStyle qq"
                        onClick={handleClickRSVPNow}
                        width="100%"
                      >
                        RSVP Now
                      </AppBtn>
                    </div>
                  )} */}
              </div>
              {(hasRsvpd || isEventCreator) && (
                <>
                  {" "}
                  <AppBtn
                    margin={"5px 0"}
                    display="flex"
                    square={true}
                    btnBG={"#6597B3"}
                    width={"100%"}
                    onClick={() => {
                      navigate("/members", {
                        state: {
                          Eventid: selectedEvent?._id,
                          wallet: currentUser?.phoneNumber,
                          isEventCreator,
                        },
                      });
                    }}
                  >
                    <span>Members list</span>
                    {members?.length === 0 && (
                      <img src={assets.icons.users} alt="" />
                    )}
                    {members?.length > 0 && (
                      <span className="member_count">{members?.length}</span>
                    )}
                  </AppBtn>
                  <GalleryPreview
                    images={eventImages}
                    eventID={eventIDParam}
                    onClickImage={(idx) => {
                      setLightBoxToggler(true);
                      setLightBoxIdx(idx);
                    }}
                  />
                  <ChirpsPreview chirps={chirps} eventID={eventIDParam} />
                </>
              )}
            </div>
          </div>
          {isEventCreator && (
            <div className="_editCoverBtn">
              <AppBtn
                square={true}
                textColor="black"
                btnBG={"#BAA2F2"}
                className="btnStyle"
                onClick={handleClickEditEvent}
              >
                Edit Event <img src={assets.icons.edit} alt="edit" />
              </AppBtn>
            </div>
          )}
          {!userIntereseted && showpopup ? (
            <NotGoingPopup
              text={notGoingModalText}
              proceed={
                notGoingModalAfterRsvp
                  ? () => {
                      //function to remove user rsvp
                      removeRSVP();
                    }
                  : () => {
                      navigate("/");
                    }
              }
              closeModal={() => setshowPopup(false)}
            />
          ) : null}
          {showAuthModal && (
            <AuthModal
              event={selectedEvent._id}
              handleClose={() => setShowAuthModal(false)}
              onSuccessfullLogin={authModalCallback}
            />
          )}
          <Lightbox
            open={lightBoxToggler}
            close={() => setLightBoxToggler(false)}
            index={lightBoxIdx}
            slides={eventImages?.map((img) => ({ src: img.image }))}
          />
        </>
      )}
    </EventCtr>
  );
};

const EventCtr = styled.div`
  .waitinglistWarring {
    background: rgba(186, 161, 242, 0.5);
    ${"" /* border: 1px solid #000000; */}
    backdrop-filter: blur(2.5px);

    width: 100%;
    padding: 30px 45px;
    text-align: center;
    h2 {
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
    }
    p {
      font-weight: 350;
      font-size: 12px;
      line-height: 130%;
      margin-top: 12px;
    }
  }
  .member_count {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    background-color: #fff;
    color: #6597b3;
  }
  ._pollsCtr {
    width: 100%;
    ._polls {
      margin: 1rem 0;
      ${mixins.flexCol};
      gap: 1rem;

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
      transition: "all .5s ease";
    }
  }
  .disnon {
    pointer-events: none;
  }
  ._eventDetails {
    margin-top: 310px;
    ${"" /* ${mixins.flexColCenter} */}
    gap:2rem;
  }
  .overlayRSVP {
    backdrop-filter: blur(8px);
    border-radius: 15px;
    border: 1px solid;
    position: relative;
    padding-top: 15px;
    width: 100%;
  }
  .overlayRSVPinner {
    padding: 20px;
    z-index: 10;
    width: 100%;
  }
  .rsvpblur {
    filter: blur(8px);
    -webkit-filter: blur(8px);
  }
  .rsvpon {
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
        cursor: not-allowed;
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
  ._eventImg {
    width: 100%;
    overflow: hidden;
    height: 310px;
    overflow: hidden;
    position: absolute;
    top: 70px;
    max-width: var(--max-app-width);

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 1;
    position: relative;
  }
  .btnStyle .qq {
    width: 200px !important;
  }

  .inlinbox {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 20px;
  }
  .discbox {
    color: #00000080;
    background: transparent;
    text-align: center;
    border-radius: 24px;
    font-weight: 400;
    font-size: 14px;
    line-height: 97.5%;
    width: 100%;
    padding: 10px;
    margin: 1rem 0;
  }
  ._time,
  ._ticket {
    ${"" /* font-size: var(--fs-r2); */}
    font-size:12px;
    font-family: var(--ff-buttonFont);
    ${mixins.flexRowCenter}
    gap:.5rem;
  }

  ._ticket {
    margin: 1rem 0;
  }

  ._location {
  }
  ._organizer {
    ${"" /* font-size: var(--fs-r2); */}
    font-size:16px;
    font-weight: 750;
    font-family: var(--ff-title);
    text-align: center;
    margin: 2rem 0;
  }

  ._reaction_going {
    display: flex;
    justify-content: center;
    position: relative;
  }

  ._rsvpReactions {
    width: 100%;
    margin: 2rem 0;
    ${mixins.flexRowCenter}
    justify-content: space-between;
    gap: 1rem;
    margin: 2rem 0;
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
        transition: all 500ms ease;
        img {
          height: 100%;
          width: 100%;

          object-fit: cover;
          object-position: center;
          transition: 0.2s ease;
          border-radius: 100%;
        }
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
  .overlay_image_reaction {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .__custom_bgBlur {
    position: absolute;
    top: 20px;
    left: -2.5%;
    width: 105%;
    height: 150%;
    background: rgba(245, 235, 233, 0.3);
    backdrop-filter: blur(6px);
    z-index: 1;
    border: 1px solid black;
    border-bottom: none;
    border-radius: 15px 15px 0 0;
  }
  @media screen and (max-width: 670px) {
    ._eventImg {
      left: 0;
    }
  }
  ._editCoverBtn {
    margin: 0 auto;
    width: 100%;
    max-width: var(--max-app-width);
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  ._eventActivity {
    padding-top: 1rem;
    > h2,
    > p {
      z-index: 2;
      position: relative;
      text-align: center;
      width: 100%;
    }
    h2 {
      margin-top: 1rem;
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
      margin-bottom: 10px;
    }
    p {
      font-weight: 400;
      font-size: 12px;
      line-height: 140%;
    }
  }
`;

export default EventPage;
