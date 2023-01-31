import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { AUTH_TOKEN } from "../util/constants";
import { authServices, fetchServices } from "../util/services";

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    let currUser = localStorage.getItem(AUTH_TOKEN);

    if (currUser) {
      setToken(currUser);
    }
  }, []);
  useEffect(() => {
    if (!token) return;
    const fetchUserDetails = async () => {
      const { getUserDetails } = authServices;
      const res = await getUserDetails(token);
      // const events = await fetchAllMyEvents(res?.userinfo?.wallet);
      // events?.data?.map((event) => {
      //   localStorage.setItem(
      //     event.event,
      //     JSON.stringify({ token, inWaitingRoom: event.inWaitingRoom })
      //   );
      // });
      // console.log({ events, res });
      setUserDetails(res?.userinfo);
    };
    setCurrentUser(decodeToken(token));
    fetchUserDetails();
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userDetails,
        setUserDetails,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}
