import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import assets from "../../assets";
import AppBtn from "../../components/common/Btn";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";

const NotFound = () => {
  const navigate = useNavigate();
  const { setCurrentPageTitle } = useGlobalState();
  React.useEffect(() => {
    setCurrentPageTitle("Opps, Invalid Route!");
  }, []);
  return (
    <NotFoundCtr>
      <div className="_img">
        <img src={assets.notfound} alt="404" />
      </div>
      <AppBtn onClick={() => navigate("/")} btnBG="var(--color-yellow)">
        Rescue Me !
      </AppBtn>
    </NotFoundCtr>
  );
};
const NotFoundCtr = styled.div`
  ${mixins.flexColCenter}
  height: 100%;
  ._img {
    width: 20vw;
    height: 20vw;
    min-height: 100px;
    min-width: 100px;
    max-height: 200px;
    max-width: 200px;
  }
`;

export default NotFound;
