import EventPage from "@/components/NewEvent";
import React from "react";
import { useRouter } from "next/router";

type Props = {};

const EventNextPage = (props: Props) => {
  const router = useRouter();
  return <EventPage eventIDParam={router.query.eventId} />;
};

export default EventNextPage;
