import React from "react";
import CreateEvent from "./../../../components/CreateEvent/CreateEvent";
import { useRouter } from "next/router";

type Props = {};

const EditEventPage = (props: Props) => {
  const router = useRouter();
  return (
    <CreateEvent type="edit" id={router.query.eventId as string}></CreateEvent>
  );
};

export default EditEventPage;
