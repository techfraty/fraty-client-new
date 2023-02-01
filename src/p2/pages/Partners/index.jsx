import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
const Partners = () => {
  const { setCurrentPageTitle } = useGlobalState();
  const { state: partners } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!partners) {
      navigate("/");
    }
    setCurrentPageTitle("Partners");
  }, []);

  return (
    <PartnersCtr>
      {partners?.map((partner, idx) => (
        <div
          className="_partner"
          key={idx + partner.name}
          onClick={() => window.open(`${partner.url}`, "_blank")}
        >
          <img src={partner?.logo} alt="logo" />
        </div>
      ))}
    </PartnersCtr>
  );
};

const PartnersCtr = styled.div`
  ${mixins.flexRowCenter};
  gap: 1.5rem;
  flex-wrap: wrap;
  ._partner {
    flex: 1;
    max-width: 300px;
    flex-basis: 300px;
  }
`;

export default Partners;
