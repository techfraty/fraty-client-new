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
import goingImage from "../../assets/images/backgrounds/star_going.svg";
import notGoingImage from "../../assets/images/backgrounds/star_not.svg";
import maybeImage from "../../assets/images/backgrounds/star_maybe.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import calendarWhiteIcon from "../../assets/icons/calendarWhite.svg";
import clockIcon from "../../assets/icons/clock.svg";
import locationIcon from "../../assets/icons/location.svg";
import shareIcon from "../../assets/icons/share.svg";
import ticketIcon from "../../assets/icons/ticket.svg";
import cupIcon from "../../assets/icons/cup.svg";
import { FRATY_EVENTS } from "../../util/constants";
import { formToCurrency } from "../../util/utils";

const EventHeader = ({ poapCallback, event }) => {
  const { eventID: eventIDParam } = useParams();
  const { userInfo, userCred } = useGlobalState();
  const [copyStatus, setCopyStatus] = useState(false);

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

  useEffect(() => {
    console.log({ event });
  }, [event]);

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
          <img src={calendarWhiteIcon} alt="" />
        </AppBtn>
        {/* <AppBtn
          square={true}
          btnBG={"#6597B3"}
          onClick={poapCallback}
          isDisabled={userInfo?.user?.POAP}
          display="flex"
        >
          <span>
            {userInfo?.user?.POAP ? "POAP Claimed !" : "Claim your POAP !"}
          </span>
          <img src={cupIcon} alt="" />
        </AppBtn> */}
        {/* <AppBtn onClick={copyLink}>
          <img src={assets.icons.share} alt="" />
          <span>
            {copyStatus ? "Referral Copied!" : "Refer to your friend"}
          </span>
        </AppBtn> */}
        <AppBtn
          display="flex"
          square={true}
          btnBG={"#E8A237"}
          onClick={copyEventShareLink}
        >
          <span>{copyStatus ? "Event link copied!" : "Share event"}</span>
          <img src={shareIcon} alt="" />
        </AppBtn>
        {/* {event?.showLocation && (
          <AppBtn
            margin={"5px 0"}
            onClick={() => window.open(`${event?.locationURL}`, "_blank")}
            square={true}
            btnBG="#EA664D"
            display="flex"
            width={"100%"}
          >
            <span>{event?.location}</span>
            <img src={locationIcon} alt="" />
          </AppBtn>
        )} */}
      </div>
      <div className="_reaction">
        <div className="_reactionImg _reaction_going">
          {/* <img src={goingImage} alt="going-to-event" /> */}
          <img
            src={assets.reactions.going2}
            alt="going"
            className="overlay_image_reaction"
          />
        </div>
        <p className="_reactionLabel">I'm Going</p>
      </div>
    </EventHeaderCtr>
  );
};

const EventHeaderCtr = styled.div`
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
`;

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
  } = useGlobalState();
  const { eventID: eventIDParam } = useParams();
  const { address, isConnected } = useAccount();
  const [copyStatus, setCopyStatus] = useState(false);
  const { state: event } = useLocation();
  const alreadyRSVPed = useRef(false);
  const [userIntereseted, setUserInterested] = useState(false);
  const [userConnected, setUserConnected] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [userSubmittedPoll, setUserSubmittedPoll] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [isEventCreator, setIsEventCreator] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const signupRef = useRef(null);

  const { currentUser, userDetails } = useAuthContext();

  function isValidEventID(eventID) {
    return eventID !== undefined && eventID !== null && eventID?.length === 24;
  }

  const navigate = useNavigate();
  useEffect(() => {
    // if (localStorage.getItem(selectedEvent?._id)) {
    //   console.log(
    //     JSON.parse(localStorage.getItem(selectedEvent._id))?.inWaitingRoom
    //   );
    //   setInWaitingRoom(
    //     JSON.parse(localStorage.getItem(selectedEvent._id))?.inWaitingRoom
    //   );
    // }
    const prevEvents = JSON.parse(localStorage.getItem(FRATY_EVENTS)) || [];
    console.log({ prevEvents, eventIDParam });
    if (!prevEvents.includes(eventIDParam) && isValidEventID(eventIDParam)) {
      prevEvents.push(eventIDParam);
      localStorage.setItem(FRATY_EVENTS, JSON.stringify(prevEvents));
    }
  }, [eventIDParam]);

  const { connect, connectors } = useConnect({
    onSuccess(data) {
      connectToMetaMask(data.account);
    },
    onError() {
      toast.error("Registeration Error. Retry!");
    },
  });

  const copyEventShareLink = () => {
    window.navigator.clipboard.writeText(
      `${window.location.host}/event/${eventIDParam}`
    );
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };
  const connectToMetaMask = async (wallet) => {
    const account = wallet;
    setUserConnected(true);
    window.localStorage.setItem(
      selectedEvent?._id,
      JSON.stringify({ wallet: account, token: null })
    );
  };

  const { isLoading: loadingEvent } = useQuery({
    queryKey: ["fetchEventDetailsFull"],
    queryFn: async () =>
      fetchServices.fetchEventDetailsFull({
        eventID: eventIDParam,
      }),
    onSuccess: (data) => {
      setSelectedEvent(data.event);
    },
    refetchInterval: false,
    cacheTime: 0, //disabled cache for every new response
  });
  const { data: eventImages, isLoading: loadingImages } = useQuery({
    queryKey: ["fetchAllImages"],
    queryFn: async () => fetchServices.fetchAllImages(eventIDParam),
    enabled: userConfirmed,
    refetchInterval: 5000,
    cacheTime: 0, //disabled cache for every new response
  });
  // const { data: polls, isLoading: loadingPolls } = useQuery({
  //   queryKey: ["fetchAllPolls"],
  //   queryFn: async () => fetchServices.fetchAllPolls(eventIDParam),
  //   enabled: userConfirmed,
  //   refetchInterval: 2000,
  //   cacheTime: 0, //disabled cache for every new response
  // });
  const { data: chirps, isLoading: loadingChirps } = useQuery({
    queryKey: ["fetchAllChurps"],
    queryFn: async () => fetchServices.fetchAllChirps(eventIDParam),
    enabled: userConfirmed,
    refetchInterval: false,
    cacheTime: 0, //disabled cache for every new response
  });
  const { isLoading: uploadingPollRes, mutate: submitPollRes } = useMutation(
    postServices.submitUserPollRes,
    {
      onSuccess: () => {
        setUserSubmittedPoll(true);
      },
      onError: (err) => {
        toast.error("Response not recorded!");
      },
    }
  );
  const getUserPollRespons = (choice) => {
    submitPollRes({
      choice: choice,
      eventID: eventIDParam,
    });
  };
  const noInterested = () => {
    setshowPopup(true);
    setUserInterested(false);
  };
  const interestedCallback = () => {
    if (!userConnected) {
      return;
    }
    setUserInterested(true);
    // setshowPopup(true)
    // setPatmetConform(false)
  };
  const claimPOAP = () => {
    navigate("/mint-poap", {
      state: { ...selectedEvent?.POAP, eventID: selectedEvent?._id },
    });
  };

  // const { isLoading: loadingUser } = useQuery({
  //   queryKey: ["fetchUserDetails"],
  //   queryFn: async () => authServices.getUserDetails(eventIDParam),
  //   onSuccess: (data) => {
  //     setUserInfo(data);
  //     if (data?.user?.Polls !== "false") {
  //       setUserSubmittedPoll(true);
  //     } else {
  //       setUserSubmittedPoll(false);
  //     }
  //   },
  //   onError: (err) => toast.error("Error Fetching user."),
  //   cacheTime: 0, //disabled cache for every new response
  //   enabled: userConfirmed,
  // });

  const { isLoading: authLoading, mutate: loginUser } = useMutation(
    authServices.userLogin,
    {
      onSuccess: (res) => {
        const userToken = res.token;
        const userData = res.message.user;
        console.log({ res });
        setInWaitingRoom(res?.message?.inWaitingRoom === "true");
        const user = { token: userToken, ...userData };
        const userLS = JSON.parse(window.localStorage.getItem(eventIDParam));
        if (window.localStorage.getItem("wallet")) {
          window.localStorage.setItem(
            eventIDParam,
            JSON.stringify({
              wallet: window.localStorage.getItem("wallet"),
              token: userToken,
            })
          );
        } else {
          window.localStorage.setItem(
            eventIDParam,
            JSON.stringify({ wallet: userLS?.wallet, token: userToken })
          );
        }

        setUserInfo(user);
        setUserConfirmed(true);
        if (!alreadyRSVPed.current)
          toast.success("User Onborded Successfully !");
      },
      onError: (err) => {
        toast.error("User Onborded Failure !");
        console.log("User Onboard Failure.");
      },
    }
  );

  const confirmUserRequest = () => {
    loginUser({
      wallet: currentUser.phoneNumber,
      name: currentUser.name,
      eventID: selectedEvent._id,
      referral: window.localStorage.getItem("referral") ?? "",
    });
  };

  const showAllPartners = () => {
    navigate("/partners", { state: selectedEvent?.partners });
  };
  const showAllSpeakers = () => {
    navigate("/speakers", { state: selectedEvent?.speakers });
  };
  const showAllItenary = () => {
    navigate("/itenary", { state: selectedEvent?.iternary });
  };
  const showFAQ = () => {
    navigate("/faq", { state: selectedEvent?.faq });
  };

  useEffect(() => {
    if (isConnected && address) {
      window.localStorage.setItem("wallet", address);
      if (event?.rsvp) {
        //login if already RSVPed
        alreadyRSVPed.current = true;
        confirmUserRequest();
      } else alreadyRSVPed.current = false;
      setUserConnected(true);
    } else {
      setUserConnected(false);
    }
  }, [isConnected, address, setUserConnected, event?.rsvp]);

  // useEffect(() => {
  //   if (JSON.parse(window.localStorage.getItem(eventIDParam))?.token) {
  //     setUserConfirmed(true);
  //   } else {
  //     setUserConfirmed(false);
  //   }
  // }, [setCurrentPageTitle, setUserConfirmed, eventIDParam]);

  useEffect(() => {
    const fetchFratyUser = async () => {
      try {
        const res = await fetchServices.fetchFratyUser(
          currentUser?.phoneNumber,
          selectedEvent?._id
        );
        console.log(res);
        setInWaitingRoom(res?.data?.inWaitingRoom === "true");
        setUserConfirmed(true);
      } catch (err) {
        setUserConfirmed(false);
      }
    };
    if (currentUser?.phoneNumber && selectedEvent?._id) {
      fetchFratyUser();
      if (currentUser?.id?._id === selectedEvent?.creator) {
        setIsEventCreator(true);
      }
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

  function handleClickRSVPResponse(type) {
    if (!type) return;

    if (!currentUser) {
      signupRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    switch (type) {
      case "yes":
        setUserInterested(true);

        if (selectedEvent?.upi.trim().length === 0) {
          confirmUserRequest();
          removeEventFromLocalStorage(eventIDParam);
        } else {
          setShowPaymentPopup(true);
        }
        break;
      case "no":
      case "maybe":
        setshowPopup(true);
        setUserInterested(false);
        break;
      default:
        break;
    }
  }

  function handleSignup() {
    if (!userConnected) {
      // connect({ connector: connectors[0] })
      setShowAuthModal(true);
      return;
    }
    setPatmetConform(true);
  }

  function handleClickEditEvent() {
    navigate(`/createParty/edit/${selectedEvent?._id}`);
  }
  console.log(inWaitingRoom);

  return (
    <EventCtr>
      {/* <PaymentPopup></PaymentPopup> */}
      {loadingEvent && <Loader></Loader>}
      {!selectedEvent?.creator && !loadingEvent ? (
        <h2>Seems like you're at the wrong page :(</h2>
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
          {!loadingEvent && (
            <div
              className={
                selectedEvent?.waitList === "true"
                  ? "_eventDetails "
                  : "_eventDetails"
              }
            >
              <div className="_eventImg">
                <img src={selectedEvent?.image} alt="" />
              </div>
              {selectedEvent?.waitList === "true" &&
              userConfirmed &&
              inWaitingRoom ? (
                <div className="waitinglistWarring">
                  <h2>You’re in the waitlist!</h2>
                  <p>This event requires manual approval from host</p>
                </div>
              ) : null}
              {selectedEvent?.waitList === "true" &&
                selectedEvent?.creator === userDetails?._id && (
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
              {userConfirmed ? (
                <EventHeader poapCallback={claimPOAP} event={selectedEvent} />
              ) : null}

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
              <div className="discbox">
                <p>{selectedEvent?.description}</p>
              </div>
              {selectedEvent?.costPerPerson ? (
                <p className="_ticket">
                  <img src={ticketIcon} alt="" />
                  <span>
                    {formToCurrency(selectedEvent?.costPerPerson)} per person
                  </span>
                </p>
              ) : null}

              {selectedEvent?.showLocation && (
                <AppBtn
                  margin={"15px 0"}
                  onClick={() =>
                    window.open(`${selectedEvent?.locationURL}`, "_blank")
                  }
                  square={true}
                  btnBG="#EA664D"
                  display="flex"
                  width={"100%"}
                >
                  <span>{selectedEvent?.location}</span>
                  <img src={locationIcon} alt="" />
                </AppBtn>
              )}
              {!userConfirmed && (
                <div style={{ width: "100%" }}>
                  {!userConfirmed && (
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
                  )}
                </div>
              )}
              {!userConfirmed ? (
                <div className="_rsvpReactions">
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
              ) : null}
              {/* {selectedEvent?.waitList !== "true" ? */}
              {!currentUser && (
                <div className="overlayRSVP ">
                  <div className="overlayRSVPinner">
                    {
                      <div className="_rsvpConfirmationBtns">
                        <h2>Restricted Access</h2>
                        <p>
                          Only RSVP’d guests can view event activity & see who’s
                          going
                        </p>
                        {!window.localStorage.getItem(selectedEvent?._id) &&
                        !userConnected ? (
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
                        ) : (
                          <AppBtn
                            className="btnStyle"
                            onClick={() => {
                              if (
                                !userCred ||
                                userCred === "null" ||
                                userCred === "undefined"
                              ) {
                                navigate("/user-cred", { state: event });
                              } else {
                                confirmUserRequest();
                              }
                            }}
                            btnBG={"var(--color-purple)"}
                            loading={authLoading}
                          >
                            <img src={assets.icons.star} alt="" />
                            <span>RSVP Now</span>
                          </AppBtn>
                        )}
                      </div>
                    }
                  </div>
                </div>
              )}
              <div style={{ width: "100%", position: "relative" }}>
                {inWaitingRoom && <div className="__custom_bgBlur"></div>}
                {userConfirmed && !inWaitingRoom && (
                  <>
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
                          },
                        });
                      }}
                    >
                      <span>Members list</span>
                      <img src={assets.icons.users} alt="" />
                    </AppBtn>
                  </>
                )}

                {!loadingImages && eventImages ? (
                  <GalleryPreview images={eventImages} eventID={eventIDParam} />
                ) : null}
                {userConfirmed &&
                !inWaitingRoom &&
                selectedEvent?.members?.length > 0 ? (
                  <AppBtn
                    onClick={() =>
                      navigate("/members", {
                        state: {
                          Eventid: selectedEvent?._id,
                          wallet: currentUser?.phoneNumber,
                        },
                      })
                    }
                    btnBG={"#6597B3"}
                  >
                    <img src={assets.icons.users} alt="" />
                    <span>Members list</span>
                  </AppBtn>
                ) : null}

                {!loadingChirps && chirps && (
                  <ChirpsPreview chirps={chirps} eventID={eventIDParam} />
                )}
                {isEventCreator && (
                  <div>
                    <AppBtn
                      position={"fixed"}
                      square={true}
                      btnBG={"#BAA2F2"}
                      className="btnStyle"
                      onClick={handleClickEditEvent}
                    >
                      Edit Cover
                    </AppBtn>
                  </div>
                )}
              </div>
            </div>
          )}
          {!userIntereseted && showpopup ? (
            <NotGoingPopup closeModal={() => setshowPopup(false)} />
          ) : null}
          {showAuthModal && (
            <AuthModal
              event={selectedEvent._id}
              handleClose={() => setShowAuthModal(false)}
            />
          )}

          {/* {imageGa} */}
        </>
      )}
    </EventCtr>
  );
};

function incrementTimeBy2Hours(time) {
  const [hour, minutes] = time.split(":");
  const newHour = parseInt(hour) + 2;
  return `${newHour}:${minutes}`;
}

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
    width: 100%;
    height: 310px;
    overflow: hidden;
    position: absolute;
    top: 70px;
    max-width: calc(calc(var(--max-app-width)) - 2rem);

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
    h2 {
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
      margin-bottom: 10px;
    }
    p {
      font-weight: 400;
      font-size: 12px;
      line-height: 140%;
      max-width: 263px;
      margin-bottom: 15px;
    }
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
    ${mixins.flexRowCenter}
    justify-content: space-between;
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
    top: 0;
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
`;

export default EventPage;
