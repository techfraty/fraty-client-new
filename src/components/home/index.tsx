// import { useQuery } from "@tanstack/react-query";
import { useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import Button from "../../components/Button/Button";
import EventCard from "../../components/EventCard";
import Loader from "../../components/Loader";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { fetchServices } from "../../util/services";
import { BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import { toast } from "react-toastify";
import AppBtn from "../../components/common/Btn";
import { DRAFT_EVENTS, FRATY_EVENTS } from "../../util/constants";
import AuthModal from "../../components/AuthModal/AuthModal";
import { useAuthContext } from "../../context/auth.context";
import { useRouter } from "next/router";

const HomePage = () => {
  const [eventsCollection, setEventsCollection] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState<any>([]);
  const [myEvents, setMyEvents] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [fetchingMyEvents, setFetchingMyEvents] = useState(false);
  const [rsvpEvents, setRSVPEvents] = useState([]);
  // const { search } = useLocation();
  const [userConnected, setUserConnected] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("upcoming");
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [fetchingEvents, setFetchingEvents] = useState(false);

  const { userCred, draftEvents, prevEventsFromLS } = useGlobalState();
  const { currentUser } = useAuthContext();
  // const { address } = useAccount();

  // const { connect, connectors } = useConnect({
  //   onSuccess(data) {
  //     connectToMetaMask(data.account);
  //   },
  //   onError() {
  //     toast.error("Registeration Error. Retry!");
  //   },
  // });

  // const connectToMetaMask = async (wallet) => {
  //   const account = wallet;
  //   setUserConnected(true);
  //   window.localStorage.setItem(
  //     JSON.stringify({ wallet: account, token: null })
  //   );
  // };

  // useEffect(() => {
  //   if (search) {
  //     const queryObj = new URLSearchParams(search);
  //     const referral = queryObj.get("referral");
  //     if (referral) {
  //       window.localStorage.setItem("referral", referral);
  //     } else {
  //       window.localStorage.removeItem("referral");
  //     }
  //   }
  // }, [search]);

  const router = useRouter();
  const onEventSelectHost = (event: any) => {
    //state event is shared with the next page
    router.push(`/event/add/edit/${event?._id || event?.id}`);
  };

  const onEventSelect = (event: any) => {
    //state event is shared with the next page
    router.push(`/event/${event?.id || event?._id}`);
  };

  const refetchAllEvents = useCallback(async () => {
    setFetchingEvents(true);
    try {
      const data = await fetchServices.fetchAllEvents(currentUser?.phoneNumber);
      let eventsFromLocal = prevEventsFromLS;
      let tempEventsCollection = [...data.data, ...eventsFromLocal];
      let tempEventsCollectionIds = new Set(
        tempEventsCollection.map((e) => e.id)
      );
      let tempEventsCollectionNoDupes: any = [];
      tempEventsCollectionIds.forEach((id) => {
        tempEventsCollectionNoDupes.push(
          tempEventsCollection.find((e) => e.id === id)
        );
      });
      // setEventsCollection(tempEventsCollectionNoDupes);
      setAllEvents(tempEventsCollectionNoDupes);
    } catch (error) {
      console.log("FETCH_ALL_EVENTS", error);
      toast.error("Error fetching events");
    }
    setFetchingEvents(false);
  }, [currentUser?.phoneNumber, prevEventsFromLS]);

  const filterEvents = async (upcoming: any, attended: any) => {
    setEventsLoading(true);

    await fetchServices
      .fetchAllEvents(currentUser?.phoneNumber, upcoming, attended)
      .then((data) => {
        let eventsFromLocal = prevEventsFromLS;
        let tempEventsCollection = [...data.data, ...eventsFromLocal];
        let tempEventsCollectionIds = new Set(
          tempEventsCollection.map((e) => e.id)
        );
        let tempEventsCollectionNoDupes: any = [];
        tempEventsCollectionIds.forEach((id) => {
          tempEventsCollectionNoDupes.push(
            tempEventsCollection.find((e) => e.id === id)
          );
        });

        setAllEvents(tempEventsCollectionNoDupes);
        setEventsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setEventsLoading(false);
      });
  };

  function hasHappened(event: any) {
    return new Date(event.eventStartDate) < new Date();
  }

  const upcomingAndAttendedEventsFilter = (upcoming: any, attended: any) => {
    setEventsLoading(true);
    fetchServices
      .fetchAllMyRSVPedEvents(currentUser?.phoneNumber)
      .then((data) => {
        const tempEventsCollectionNoDupes: any = [...data?.data];
        if (attended) {
          setAttendedEvents(
            tempEventsCollectionNoDupes.filter(
              (event: any) =>
                new Date(event.eventStartDate) < new Date() &&
                new Date(event.eventStartDate).getDate() < new Date().getDate()
            )
          );
        }
        if (upcoming) {
          setUpcomingEvents(
            tempEventsCollectionNoDupes.filter(
              (event: any) => new Date(event.eventStartDate) >= new Date()
            )
          );
        }
        setEventsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setEventsLoading(false);
      });
  };

  useEffect(() => {
    function handleFilterEvents() {
      switch (selectedFilter) {
        case "all":
          filterEvents(false, false);
          break;
        case "upcoming":
          upcomingAndAttendedEventsFilter(true, false);
          break;
        case "attended":
          upcomingAndAttendedEventsFilter(false, true);
          break;
        case "hosting":
          handleClickHosting();
          break;
        default:
          filterEvents(false, false);
      }
    }
    if (currentUser) {
      handleFilterEvents();
    }
  }, [selectedFilter, currentUser]);

  useEffect(() => {
    if (currentUser && refetchAllEvents) {
      refetchAllEvents();
    } else if (!currentUser) {
      setAllEvents(prevEventsFromLS);
    }
  }, [currentUser, refetchAllEvents, prevEventsFromLS]);

  async function handleClickHosting() {
    setFetchingMyEvents(true);
    try {
      const data = await fetchServices.fetchEventsHosting();
      setMyEvents(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching hosted events");
    }
    setFetchingMyEvents(false);
  }

  function getCurrentCollectionLength() {
    switch (selectedFilter) {
      case "all":
        return allEvents?.length;
      case "upcoming":
        return upcomingEvents?.length;
      case "attended":
        return attendedEvents?.length;
      case "hosting":
        return myEvents?.length;
      default:
        return allEvents?.length;
    }
  }

  return (
    <HomeCtr>
      <h1 className="title">Hey {userCred?.name ?? "babe"}, let's meet?</h1>
      {fetchingEvents ? (
        <Loader />
      ) : (
        <div className="events">
          <div className="_eventSet">
            {/* <p className="subtitle">Events happening</p> */}
            {/* <div className="buttons_row"> */}
            {/* <Button name={"Hosting"} path="/" /> */}
            {/* <Button name={"Drafts"} path="/" /> */}
            {/* </div> */}
            <div>
              <AppBtn
                square={false}
                onClick={() => {}}
                width="100px"
                fontSize={"16px"}
                btnBG={"rgba(245,235,233,0.2)"}
                backdropFilter={"blur(12px)"}
              >
                {/* <Button name={"Upcoming"} path="/" /> */}
                Drafts
              </AppBtn>
            </div>
            <div className="_allEvents">
              <div
                className="add_card"
                onClick={() => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else {
                    router.push("/createparty/add/");
                  }
                }}
              >
                <div className="add_crad_item">
                  <BsPlusLg size={40} />
                  <p>New Party</p>
                </div>
              </div>

              {draftEvents?.map((eventItem: any, idx: any) => (
                <EventCard
                  eventItem={eventItem}
                  key={idx}
                  onClick={() => onEventSelectHost(eventItem)}
                  bg={getBgColor(idx)}
                />
              ))}
            </div>
          </div>
          {/* ) : null} */}

          <div className="_eventSet">
            {/* <p className="subtitle">Events happening</p> */}
            <div className="buttons_row">
              <div className="">
                <AppBtn
                  square={false}
                  onClick={() => setSelectedFilter("upcoming")}
                  styled={{
                    width: "100px",
                    fontWeight: selectedFilter === "upcoming" ? "700" : "400",
                  }}
                  fontSize={"16px"}
                  fontWeight={selectedFilter === "upcoming" ? "700" : "400"}
                  btnBG={
                    selectedFilter === "upcoming" ? "#E8A237" : "transparent"
                  }
                >
                  {/* <Button name={"Upcoming"} path="/" /> */}
                  Upcoming
                </AppBtn>
              </div>
              {currentUser && (
                <div className="">
                  <AppBtn
                    square={false}
                    onClick={() => setSelectedFilter("hosting")}
                    styled={{
                      with: "100px",
                    }}
                    btnBG={
                      selectedFilter === "hosting" ? "#E8A237" : "transparent"
                    }
                    fontSize={"16px"}
                    fontWeight={selectedFilter === "hosting" ? "700" : "400"}
                  >
                    {/* <Button name={"Upcoming"} path="/" /> */}
                    Hosting
                  </AppBtn>
                </div>
              )}
              <div className="">
                <AppBtn
                  square={false}
                  onClick={() => setSelectedFilter("attended")}
                  styled={{
                    width: "100px",
                  }}
                  fontWeight={selectedFilter === "attended" ? "700" : "400"}
                  fontSize={"16px"}
                  btnBG={
                    selectedFilter === "attended" ? "#E8A237" : "transparent"
                  }
                >
                  {/* <Button name={"Upcoming"} path="/" /> */}
                  Attended
                </AppBtn>
              </div>
              <div className="">
                <AppBtn
                  square={false}
                  onClick={() => setSelectedFilter("all")}
                  styled={{
                    width: "100px",
                  }}
                  fontWeight={selectedFilter === "all" ? "700" : "400"}
                  fontSize={"16px"}
                  btnBG={selectedFilter === "all" ? "#E8A237" : "transparent"}
                >
                  {/* <Button name={"Upcoming"} path="/" /> */}
                  All
                </AppBtn>
              </div>

              {/* <div onClick={() => filterEvents(true, false)}>
                <Button name={"Upcoming"} path="/" />
              </div>
              <div onClick={() => filterEvents(false, true)}>
                <Button name={"Attended"} path="/" />
              </div>
              <div onClick={() => filterEvents(false, false)}>
                <Button name={"All"} path="/" />
              </div> */}
            </div>

            <div className="_allEvents">
              {selectedFilter === "all" &&
                allEvents.map((eventItem: any, idx: any) => (
                  <EventCard
                    eventItem={eventItem}
                    key={eventItem.id + idx}
                    onClick={() => onEventSelect(eventItem)}
                    bg={getBgColor(idx)}
                  />
                ))}
              {selectedFilter === "hosting" &&
                myEvents.map((eventItem: any, idx: any) => (
                  <EventCard
                    eventItem={eventItem}
                    key={`${eventItem.id}-${idx}`}
                    onClick={() => onEventSelect(eventItem)}
                    bg={getBgColor(idx)}
                  />
                ))}
              {selectedFilter === "upcoming" &&
                upcomingEvents.map((eventItem: any, idx: any) => (
                  <EventCard
                    eventItem={eventItem}
                    key={`${eventItem.id}-${idx}`}
                    onClick={() => onEventSelect(eventItem)}
                    bg={getBgColor(idx)}
                  />
                ))}
              {selectedFilter === "attended" &&
                attendedEvents.map((eventItem: any, idx: any) => (
                  <EventCard
                    eventItem={eventItem}
                    key={`${eventItem.id}-${idx}`}
                    onClick={() => onEventSelect(eventItem)}
                    bg={getBgColor(idx)}
                  />
                ))}
              {eventsLoading || fetchingMyEvents || fetchingEvents ? (
                <div className="no_events">
                  <p>Loading...</p>
                </div>
              ) : getCurrentCollectionLength() === 0 ? (
                <div className="no_events">
                  <p>No events found</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {showAuthModal && (
        <AuthModal handleClose={() => setShowAuthModal(false)} />
      )}
    </HomeCtr>
  );
};

function getBgColor(idx: any) {
  return parseInt(idx) % 5 === 0
    ? "var(--color-orange)"
    : parseInt(idx) % 5 >= 4
    ? "var(--color-purple)"
    : parseInt(idx) % 5 >= 3
    ? "var(--color-blue)"
    : parseInt(idx) % 5 >= 2
    ? "var(--color-yellow)"
    : "var(--color-green)";
}

const HomeCtr = styled.div`
  ${mixins.flexCol}
  .title {
    font-family: var(--ff-title);
  }
  gap: 1rem;
  ._clipArt {
    width: 20vw;
    min-width: 95px;
  }
  .events {
    ${mixins.flexCol}
    gap: 2rem;
  }
  ._allEvents {
    ${mixins.flexRowCenter};
    justify-content: start;
    gap: 1.5rem;
    overflow-x: scroll;
    /* flex-wrap: wrap; */
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    align-items: stretch;
  }
  .add_card {
    min-width: 277px;
    height: 390px;
    background: rgba(245, 235, 233, 0.2);
    backdrop-filter: blur(12px);
    border: 2px solid #000000;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
  }
  .add_crad_item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-direction: column;
    align-items: center;
  }
  ._eventSet {
    margin-top: 1rem;
    ${mixins.flexCol}
    gap:.5rem;
  }
  ._buttonsRowContainer {
    overflow-x: hidden;
  }
  .buttons_row {
    overflow-x: scroll;
    display: flex;
    justify-content: start;
    gap: 12px;
    ${"" /* width: 100%; */}
    margin-bottom: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
    > div {
      ${"" /* min-width: 70px; */}
    }
    button {
      padding: 0.5rem 2rem !important;
    }
  }
`;
export default HomePage;
