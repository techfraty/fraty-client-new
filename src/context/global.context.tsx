import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
// import { useLocation } from "react-router-dom";
// import { useAccount, useQuery } from "wagmi";
import { FRATY_EVENTS } from "../util/constants";
import { fetchServices } from "../util/services";
import { useAuthContext } from "./auth.context";
import { useRouter } from "next/router";

interface IGlobalContext {
  currentPageTitle: string | null;
  setCurrentPageTitle: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
  userCred: any;
  gifPreview: any;
  setgifPreview: (gif: any) => void;
  showModalPublish: boolean;
  setShowModalPublish: (show: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  events: any;
  setEvents: (events: any) => void;
  showpopup: boolean;
  setshowPopup: (show: boolean) => void;
  paymentConfompopup: boolean;
  setPatmetConform: (show: boolean) => void;
  gifView: boolean;
  setGifview: (show: boolean) => void;
  eventId: string | null;
  setEventId: React.Dispatch<React.SetStateAction<string | null>>;
  draftEvents: any;
  setDraftEvents: (events: any) => void;
  prevEventsFromLS: any;
  setPrevEventsFromLS: (events: any) => void;
  customBackHeaderLink: string | null;
  setCustomBackHeaderLink: (link: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>(
  {} as IGlobalContext
);

export default function GlobalContextProvider({ children }: any) {
  const [currentPageTitle, setCurrentPageTitle] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userCred, setUserCred] = useState(null);
  const [gifPreview, setgifPreview] = useState({
    id: "l4KibWpBGWchSqCRy",
    images: {
      downsized: {
        url: "https://media2.giphy.com/media/xakygoBGtZ17uYqHU9/giphy.gif?cid=57cef7f4e6ktdy21r6pckkro4hupc696981zuad3kqmnc4fg&rid=giphy.gif&ct=g",
      },
    },
  });
  const [showModalPublish, setShowModalPublish] = useState(false);
  const [formData, setFormData] = useState({});
  const [events, setEvents] = useState({});
  const [showpopup, setshowPopup] = useState(false);
  const [paymentConfompopup, setPatmetConform] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [gifView, setGifview] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [draftEvents, setDraftEvents] = useState([]);
  const [prevEventsFromLS, setPrevEventsFromLS] = useState([]);
  const [customBackHeaderLink, setCustomBackHeaderLink] = useState<
    string | null
  >(null);

  // const { pathname } = useLocation();
  const router = useRouter();
  const { pathname } = router;
  // const { address } = useAccount();

  const { currentUser }: any = useAuthContext();

  // useEffect(() => {
  //   async function customFetchAllEvents() {
  //     let data = await fetchServices.fetchEventsWithIds(prevEvents);
  //     setPrevEventsFromLS(data?.data?.events);
  //   }
  //   let prevEvents = JSON.parse(localStorage.getItem(FRATY_EVENTS));
  //   if (prevEvents?.length) {
  //     customFetchAllEvents();
  //   }
  // }, []);

  useEffect(() => {
    async function getDraftEvents() {
      const res = await fetchServices.fetchDraftEvents();
      if (res) {
        setDraftEvents(res.data?.data);
      }
    }
    if (currentUser) {
      getDraftEvents();
    }
  }, [currentUser]);

  // const { isLoading: fetchingUserCred } = useQuery({
  //   queryKey: ["fetchUserCreds"],
  //   queryFn: async () => fetchServices.fetchAllEvents(address),
  //   onSuccess: (data) => {
  //     setUserCred(data.userInfo);
  //   },
  //   refetchInterval: 2000,
  // });

  useEffect(() => {
    if (currentUser) {
      setUserCred(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (pathname === "/") {
      setUserInfo(null);
      setSelectedEvent(null);
    }
  }, [pathname]);

  return (
    <GlobalContext.Provider
      value={{
        currentPageTitle,
        setCurrentPageTitle,
        selectedEvent,
        setSelectedEvent,
        userInfo,
        setUserInfo,
        userCred,
        gifPreview,
        setgifPreview,
        showModalPublish,
        setShowModalPublish,
        formData,
        setFormData,
        events,
        setEvents,
        showpopup,
        setshowPopup,
        paymentConfompopup,
        setPatmetConform,
        gifView,
        setGifview,
        eventId,
        setEventId,
        draftEvents,
        setDraftEvents,
        prevEventsFromLS,
        setPrevEventsFromLS,
        customBackHeaderLink,
        setCustomBackHeaderLink,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GloabalProvider");
  }
  return context;
}
