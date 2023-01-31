import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";

const Itenary = () => {
  const { setCurrentPageTitle } = useGlobalState();
  const { state: itenary } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!itenary) {
      navigate("/");
    }
    setCurrentPageTitle("Itinerary");
  }, [setCurrentPageTitle]);

  return (
    <ItenaryCtr>
      {itenary?.map((item, idx) => {
        return (
          <div className="_item" key={idx + item?.day}>
            <p className="_eventDay">{item?.day}</p>
            {item?.events?.map((event, idx) => {
              return (
                <div
                  className="_event"
                  key={idx + event?.event}
                  style={
                    parseInt(idx) % 5 === 0
                      ? { background: "var(--color-orange)" }
                      : parseInt(idx) % 5 >= 4
                      ? { background: "var(--color-purple)" }
                      : parseInt(idx) % 5 >= 3
                      ? { background: "var(--color-blue)" }
                      : parseInt(idx) % 5 >= 2
                      ? { background: "var(--color-yellow)" }
                      : { background: "var(--color-green)" }
                  }
                >
                  <div className="_eventTime">
                    {event?.start} {event?.end ? ` - ${event?.end}` : null}
                  </div>
                  <div className="_eventName">{event?.event}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </ItenaryCtr>
  );
};

const ItenaryCtr = styled.div`
  width: 100%;
  ${mixins.flexCol}
  gap:1rem;

  ._item {
    border: 1px solid var(--color-primary);
    border-radius: 1rem;
    overflow: hidden;
  }
  ._eventDay {
    padding: 1.25rem 1rem;
    font-size: var(--fs-r2);
    border-bottom: 1px solid var(--color-primary);
  }
  ._event {
    padding: 0.75rem;
    ${mixins.flexRowCenter};
    gap: 0.5rem;
    justify-content: space-between;
    font-size: var(--fs-s);

    ._eventTime {
      max-width: 40%;
      font-size: 0.7rem;
    }
    ._eventName {
      font-size: var(--fs-s);
      max-width: 60%;
      text-align: right;
    }
  }
`;

export default Itenary;
