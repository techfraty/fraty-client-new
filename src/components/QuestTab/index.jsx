import React from "react";
import styled from "styled-components";
import assets from "../../assets";
import { mixins } from "../../styles/global.theme";

const QuestTabCtr = styled.div`
  margin-top: 2rem;
  width: 100%;
  border: 2px solid var(--color-primary);
  border-radius: 2rem;
  position: relative;
  padding: 4rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
  ._treasureImg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: 0 auto;
    transform: translateY(-45%);
    ${mixins.gridCenter};
  }
  ._brands {
    ${mixins.flexRowCenter}
    gap:.75rem;
    font-size: var(--fs-s);
    ._brand {
      ${mixins.flexRowCenter}
      gap: 0.25rem;
      ._brandLogo {
        height: 35px;
        ${mixins.flexColCenter};
        img {
          max-height: 100%;
        }
      }
    }
  }
`;
const redirectToQuest = () => {
  window.open("https://quest.dehidden.com/", "_blank");
};

const QuestTab = () => {
  return (
    <QuestTabCtr onClick={redirectToQuest}>
      <div className="_treasureImg">
        <img src={assets.icons.treasure} alt="" />
        <p className="subTitle">Play Quest !</p>
      </div>

      <div className="_brands">
        <span>By </span>
        <div className="_brand">
          <div className="_brandLogo">
            <img src={assets.logos.dehidden_logo} alt="" />
          </div>

          <span>Dehidden</span>
        </div>
        <div className="_brand">
          <div className="_brandLogo">
            <img src={assets.logos.tph_logo} alt="" />
          </div>
        </div>
      </div>
    </QuestTabCtr>
  );
};

export default QuestTab;
