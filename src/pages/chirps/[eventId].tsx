import ChirpsPreview from "@/components/ChirpsPreview";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const ChirpsPage = (props: Props) => {
  const router = useRouter();
  return <ChirpsPreview eventID={`${router.query.eventId}`} />;
};

export default ChirpsPage;
