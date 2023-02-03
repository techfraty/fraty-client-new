import Publish from "@/components/Publish/Publish";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const PublishPage = (props: Props) => {
  const router = useRouter();
  return <Publish id={router.query.eventId} type="publish" />;
};

export default PublishPage;
