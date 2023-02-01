import React from "react";
import CreateEvent from "./../../../components/CreateEvent/CreateEvent";
import { useRouter } from "next/router";

type Props = {};

const EditEventPage = (props: Props) => {
  const router = useRouter();
  console.log(router.query.eventId);
  return <CreateEvent type="edit" id={router.query.eventId}></CreateEvent>;
};

export default EditEventPage;
