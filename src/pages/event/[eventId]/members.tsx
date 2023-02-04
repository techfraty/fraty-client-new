import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import MemberCard from "../../../components/MemberCard";
import { useAuthContext } from "../../../context/auth.context";
import { useGlobalState } from "../../../context/global.context";
import { mixins } from "../../../styles/global.theme";
import { fetchServices } from "../../../util/services";
import { useRouter } from "next/router";
import { NextPage } from "next";

const MembersList: NextPage = () => {
  const router = useRouter();
  const { setCurrentPageTitle, setCustomBackHeaderLink }: any =
    useGlobalState();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails, currentUser }: any = useAuthContext();
  const { fetchEventDetails } = fetchServices;
  const state: any = {
    Eventid: router.query.eventId,
    wallet: currentUser?.phoneNumber,
  };

  useEffect(() => {
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
      let waitingIds: Array<any> = [];
      if (waitlist) {
        waiting = await fetchServices.fetchWaithinglist(state?.Eventid);
        waitingIds = waiting?.data?.map((ev: any) => ev._id);
      }
      const filteredMembers = data?.members?.filter(
        (member: any) =>
          member?._id !== data?.creator &&
          waitingIds?.findIndex((e) => e === member?._id) === -1
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
      {members?.map((member: any, idx) => (
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
