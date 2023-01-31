import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import assets from "../../assets";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";

const Speakers = () => {
  const { setCurrentPageTitle } = useGlobalState();
  const { state: speakers } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!speakers) {
      navigate("/");
    }

    setCurrentPageTitle("Event");
  }, [setCurrentPageTitle]);
  return (
    <SpeakersCtr>
      <div className="_allSpeakers">
        {speakers?.map((speaker, idx) => (
          <div className="speaker" key={idx + speaker?.name}>
            <div className="hover_mask">
              <img src={assets.overlays.zigyMask} className="hover_bg" />
            </div>
            <div className="zigy_mask">
              {speaker?.image ? (
                <img
                  src={speaker?.image}
                  className="avatar_img"
                  onError={(e) =>
                    (e.currentTarget.src = assets.overlays.userPlaceholder)
                  }
                />
              ) : (
                <img
                  src={assets.overlays.userPlaceholder}
                  className="avatar_img"
                />
              )}
            </div>
            <p
              className="_speakerName"
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
              {speaker?.name}
            </p>
          </div>
        ))}
      </div>
    </SpeakersCtr>
  );
};
const SpeakersCtr = styled.div`
  ._allSpeakers {
    ${mixins.flexRowCenter}
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 1rem;
  }
  .speaker {
    max-width: fit-content;
    margin: 1rem;
    position: relative;
    width: 20vw;
    max-width: 200px;
    min-width: 120px;
    cursor: pointer;
    &:hover > .hover_mask {
      visibility: visible;
    }
  }
  .zigy_mask,
  .hover_mask {
    width: 100%;
    height: 100%;
    -webkit-mask-image: url(${assets.overlays.zigyMask});
    mask-image: url(${assets.overlays.zigyMask});
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    -webkit-mask-position: center;
    mask-position: center;
    position: relative;
    overflow: hidden;
  }
  .hover_mask {
    transform: scale(1.1);
    transition: 0.2s;
    visibility: hidden;
  }

  .zigy_mask {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
  }
  .zigy_mask > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ._speakerName {
    position: absolute;
    width: 115%;
    min-width: fit-content;
    text-align: center;
    padding: 0.35rem;
    border-radius: 2rem;
    bottom: -10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translateX(-5%);
    font-size: clamp(0.8rem, 1vw, 1rem);
    border: 1px solid;
  }
`;
export default Speakers;
