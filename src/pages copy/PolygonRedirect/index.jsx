import React from "react";
import { useNavigate } from "react-router-dom";

const PolygonRedirect = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/event/63806c87bd7b9ae5c823f48b");
  }, []);
  return <></>;
};

export default PolygonRedirect;
