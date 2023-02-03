import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import MemberCard from "../../../components/MemberCard";
import { useAuthContext } from "../../../context/auth.context";
import { useGlobalState } from "../../../context/global.context";
import { mixins } from "../../../styles/global.theme";
import { fetchServices } from "../../../util/services";
import { useRouter } from "next/router";

const MembersList = () => {
  const router = useRouter();
  const { setCurrentPageTitle, setCustomBackHeaderLink } = useGlobalState();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails, currentUser } = useAuthContext();
  const { fetchEventDetails } = fetchServices;
  const state = {
    Eventid: router.query.eventId,
    wallet: currentUser?.phoneNumber,
  };
  React.useEffect(() => {
    const fetchEvents = async () => {
      console.log(state);
      setLoading(true);
      const data = await fetchEventDetails({
        eventID: state?.Eventid,
        address: state?.wallet,
      });
      console.log({ data });
      const waitlist = data?.waitList;
      let waiting = [];
      let waitingIds = [];
      if (waitlist) {
        waiting = await fetchServices.fetchWaithinglist(state?.Eventid);
        waitingIds = waiting?.data?.map((ev) => ev._id);
      }
      const filteredMembers = data?.members?.filter(
        (m) =>
          m?._id !== data?.creator &&
          waitingIds?.findIndex((e) => e === m?._id) === -1
      );
      setMembers(filteredMembers);
      setLoading(false);
    };
    console.log(state.Eventid);
    setCurrentPageTitle("Members");
    fetchEvents();
  }, [currentUser, router]);

  console.log({ members });
  useEffect(() => {
    setCustomBackHeaderLink(null);
  }, [setCustomBackHeaderLink]);

  return (
    <MemberListCtr>
      {loading && <Loader></Loader>}
      {!loading && (!members || members?.length === 0) && (
        <p>No members present.</p>
      )}
      {members?.map((member, idx) => (
        <MemberCard
          creator={state?.creator}
          isEventCreator={state?.isEventCreator}
          member={member}
          event={state?.Eventid}
          key={member?.id}
          bgColor={member.status !== "not_going" ? "green" : "#C6B1E9"}
          setMembers={setMembers}
        />
      ))}
    </MemberListCtr>
  );
};

const MemberListCtr = styled.div`
  ${mixins.flexCol}
  gap:1rem;
`;
export default MembersList;
