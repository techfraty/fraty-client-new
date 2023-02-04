import EventPage from "@/components/NewEvent";
import React from "react";
import { useRouter } from "next/router";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { fetchServices, BE_URL } from "@/util/services";
import axios from "axios";

// get server side props
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { eventId } = context.query;
  console.log(eventId);
  if (!eventId) return { props: { event: {}, eventId } };
  try {
    const res = await axios.get(BE_URL + `/fraty/fetch/${eventId}`, {
      params: {
        token: "",
      },
    });
    console.log(res.data.data);
    return {
      props: {
        event: res.data.data.event,
        eventId,
      },
    };
  } catch (error) {
    console.log("ERR_FETCH_EVENT_DETAILS", error);
    return {
      props: {
        event: {},
        eventId,
      },
    };
  }
};

const EventNextPage: InferGetServerSidePropsType<typeof getServerSideProps> = (
  props: any
) => {
  const router = useRouter();
  return (
    <EventPage eventIDParam={router.query.eventId} event={props.event || {}} />
  );
};

export default EventNextPage;
