import Publish from "@/components/Publish/Publish";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const EditPublishPage = (props: Props) => {
  const router = useRouter();
  return <Publish id={router.query.eventId} type="edit" />;
};

export default EditPublishPage;
