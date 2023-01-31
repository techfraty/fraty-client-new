import axios from "axios";
import { AUTH_TOKEN } from "./constants";

export const BE_URL = process.env.REACT_APP_API_URL;

export function authHeader(eventID) {
  const user = JSON.parse(localStorage.getItem(eventID));
  // console.log({ user });
  if (user && user.token) {
    return { Authorization: user.token };
  } else {
    return {};
  }
}

export function customAuthHeader() {
  const user = localStorage.getItem(AUTH_TOKEN);
  if (user) {
    return { Authorization: user };
  }
  return {};
  // console.log({ user
}

//fetch events api calls

const fetchAllEvents = async (address, upcoming = false, attended = false) => {
  if (!address) return;
  const res = await axios.get(
    BE_URL + `/fraty/events/?upcoming=${upcoming}&attended=${attended}`,
    {
      params: {
        wallet: address,
      },
    }
  );
  const allEvents = await res.data;
  return allEvents;
};
const fetchEventsWithIds = async (eventIds) => {
  const res = await axios.get(BE_URL + `/fraty/events-multiple`, {
    headers: customAuthHeader(),
    params: { eventIds },
  });
  return await res.data;
};

const fetchAllMyRSVPedEvents = async (address) => {
  console.log(address);
  const res = await axios.get(BE_URL + `/fraty/myevents/${address}`);
  const allEvents = await res.data;
  return allEvents;
};
const fetchEvents = async (wallet) => {
  const res = await axios.get(BE_URL + `/fraty/events`, {
    params: { wallet },
  });
  const allEvents = await res.data;
  return allEvents;
};

const fetchEventsHosting = async () => {
  const res = await axios.get(BE_URL + `/fraty/events/hosting`, {
    headers: customAuthHeader(),
  });
  const allEvents = await res.data;
  return allEvents;
};

const fetchFratyUser = async (wallet, eventID) => {
  const res = await axios.get(BE_URL + "/fraty/events/fraty-users", {
    params: {
      wallet,
      eventId: eventID,
    },
    headers: customAuthHeader(),
  });
  const fratyusers = await res.data;
  return fratyusers;
};
const fetchEventDetails = async ({ eventID, address }) => {
  console.log(eventID, address);
  if (address) {
    const res = await axios.get(BE_URL + `/fraty/event/${eventID}`, {
      params: {
        wallet: address,
      },
    });
    console.log(res);
    const allEvents = await res.data.data;
    return allEvents;
  }
  const res = await axios.get(BE_URL + `/fraty/event/${eventID}`);
  const allEvents = await res.data.data;

  return allEvents;
};
const fetchEventDetailsFull = async ({ eventID, userId = null }) => {
  const res = await axios.get(BE_URL + `/fraty/fetch/${eventID}`, {
    params: {
      token: localStorage.getItem(AUTH_TOKEN),
    },
  });
  const allEvents = await res.data.data;
  return allEvents;
};
const findUser = async ({ wallet }) => {
  console.log(wallet);
  const res = await axios.get(BE_URL + `/fraty/find`, {
    params: {
      wallet: wallet,
    },
  });
  const data = await res.data;
  return data;
};
const fetchAllImages = async (eventID) => {
  const res = await axios.post(
    BE_URL + `/fraty/images`,
    {
      event: eventID,
    },
    {
      headers: customAuthHeader(),
    }
  );
  const allImages = await res.data.message.image;
  return allImages;
};
const fetchAllPolls = async (eventID) => {
  const res = await axios.post(
    BE_URL + `/fraty/polls`,
    {
      event: eventID,
    },
    {
      headers: customAuthHeader(),
    }
  );
  const allPolls = await res.data.message.polls;
  return allPolls;
};
const fetchAllChirps = async (eventID) => {
  const res = await axios.post(
    BE_URL + `/fraty/chirps`,
    { event: eventID },
    {
      headers: customAuthHeader(),
    }
  );
  const allChirps = await res.data.message.chirps;
  return allChirps;
};
const fetchWaithinglist = async (eventID) => {
  const res = await axios.get(BE_URL + `/fraty/waitingroom/${eventID}`);
  console.log(eventID, res);
  const allChirps = await res.data;
  return allChirps;
};
const fetchTopgifs = async () => {
  const res = await axios.get(BE_URL + `/fraty/giphy/trending/`);
  const allEvents = await res.data;
  return allEvents;
};
const fetchgifsBySerach = async (search) => {
  const res = await axios.get(BE_URL + `/fraty/giphy/search?q=${search}`);
  const allEvents = await res.data;
  return allEvents;
};

const fetchDraftEvents = async () => {
  return await axios.get(BE_URL + `/fraty/events/drafts`, {
    headers: customAuthHeader(),
  });
};

export const fetchServices = {
  findUser,
  fetchFratyUser,
  fetchAllEvents,
  fetchAllPolls,
  fetchEventDetails,
  fetchAllImages,
  fetchAllChirps,
  fetchEvents,
  fetchAllMyRSVPedEvents,
  fetchEventDetailsFull,
  fetchTopgifs,
  fetchgifsBySerach,
  fetchWaithinglist,
  fetchDraftEvents,
  fetchEventsWithIds,
  fetchEventsHosting,
};
//post services
const uploadPhoto = async ({ formData, eventID }) => {
  return await axios.post(BE_URL + "/fraty/image", formData, {
    headers: customAuthHeader(),
  });
};
const uploadUserCred = async (wallet, name, profession, social, song) => {
  // console.log(wallet, name, profession, social, song);
  const res = await axios.post(BE_URL + "/fraty/userinfo", {
    wallet: wallet,
    name: name,
    profession: profession,
    social: social,
    song: song,
  });
  return res;
};
const loginUser = async (wallet, name) => {
  // console.log(wallet, name, profession, social, song);
  const res = await axios.post(BE_URL + "/fraty/userlogin", {
    wallet: wallet,
    name: name,
  });
  return res;
};
const uploadChirp = async ({ formData, eventID }) => {
  await axios.post(BE_URL + "/fraty/chirp", formData, {
    headers: customAuthHeader(),
  });
};
const submitUserPollRes = async ({ choice, eventID, wallet }) => {
  await axios.post(
    BE_URL + "/fraty/poll",
    { poll: choice, event: eventID },
    {
      headers: authHeader(eventID),
    }
  );
};
const mintPOAP = async (eventID) => {
  await axios.post(
    BE_URL + "/fraty/mint",
    {},
    {
      headers: authHeader(eventID),
    }
  );
};
const uploadCoverImage = async (formData) => {
  const res = await axios.post(BE_URL + "/fraty/imagetourl", formData, {
    headers: { "Content-Type": "multipart/form-data", ...customAuthHeader() },
  });
  console.log(res);
  const url = await res.data.url;
  return url;
};
const letIn = async (eventID, wallet) => {
  const res = await axios.post(
    BE_URL + `/fraty/waitingroom/letin/${eventID}/${wallet}`
  );
  const url = await res;
  console.log(url, eventID);

  return url;
};
const formSubmition = async (formData) => {
  const res = await axios.post(BE_URL + "/fraty/add/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const url = await res;

  return url;
};
const updateEvent = async (data) => {
  const eventId = data._id;
  delete data._id;
  return await axios.patch(BE_URL + `/fraty/event/${eventId}`, data, {
    headers: customAuthHeader(),
  });
};
const deleteEvent = async (id) => {
  console.log(id);
  return await axios.delete(BE_URL + `/fraty/delete/${id}`, {
    headers: customAuthHeader(),
  });
};

export const postServices = {
  loginUser,
  uploadChirp,
  uploadUserCred,
  mintPOAP,
  uploadPhoto,
  submitUserPollRes,
  uploadCoverImage,
  letIn,
  formSubmition,
  deleteEvent,
};

export const patchServices = {
  updateEvent,
};

//user auth
const getUserDetails = async (token) => {
  const res = await axios.get(BE_URL + `/fraty/`, {
    headers: {
      Authorization: token,
    },
  });
  const userData = await res.data.message;
  return userData;
};

const updateRSVPStatus = async (eventID, wallet, status) => {
  console.log("event ID", eventID, wallet, status);
  const res = await axios.post(BE_URL + `/fraty/rsvp-status`, {
    wallet,
    event: eventID,
    status,
  });
  const userData = await res.data.message;
  return userData;
};
// const userLogin = async ({ wallet, eventID, referral = "" }) => {
//   console.log(wallet, eventID);
//   const res = await axios.post(BE_URL + "/fraty/login", {
//     wallet: wallet,
//     event: eventID,
//     referral: referral,
//   });
//   const userAuthStatus = await res.data;

//   return userAuthStatus;
// };
const rsvpUser = async ({
  wallet: phoneNumber,
  name,
  eventID,
  referral = "",
}) => {
  console.log(phoneNumber, name, eventID);
  const res = await axios.post(BE_URL + "/fraty/rsvp", {
    phoneNumber: phoneNumber,
    name: name,
    event: eventID,
    referral: referral,
  });
  const userAuthStatus = await res.data;

  return userAuthStatus;
};
const removeRsvpUser = async ({ wallet: phoneNumber, eventId }) => {
  console.log(phoneNumber);
  const res = await axios.delete(BE_URL + "/fraty/rsvp-delete", {
    data: { phoneNumber, eventId },
  });
  console.log(res);
  const data = await res.data;

  return data;
};

export const authServices = {
  rsvpUser,
  getUserDetails,
  updateRSVPStatus,
  removeRsvpUser,
};
