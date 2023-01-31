import React from "react";
import styled from "styled-components";
import { mixins } from "../../styles/global.theme";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("id");
dayjs.extend(relativeTime);

//to generate ellipses in middle of address text
function trimAddress(str) {
  if (str.length > 12) {
    return str.substr(0, 5) + "..." + str.substr(str.length - 4, str.length);
  }
  return str;
}

const ChirpCard = ({ chirp, bgColor = "var(--color-yellow)" }) => {
  return (
    <ChirpCardCtr bgColor={"transparent"}>
      <div className="_chirpHeader">
        <div className="_userAvatar">
          <img
            src={`https://avatars.dicebear.com/api/identicon/${chirp?.wallet}.svg`}
            alt=""
          />
        </div>
        <p className="_userWallet">
          {chirp?.name ? chirp?.name : trimAddress(chirp?.wallet)}
        </p>
      </div>
      <div className="_chirpContent">
        <p className="_content">{chirp?.text}</p>
        {chirp?.image !== "false" ? (
          <div className="_chirpImg">
            <img src={chirp?.image} alt="" />
          </div>
        ) : null}
        <p className="_chirpDate">{dayjs(chirp?.createdAt).fromNow()}</p>
      </div>
    </ChirpCardCtr>
  );
};
const ChirpCardCtr = styled.div`
  ${mixins.flexColCenter}
  position: relative;
  font-size: var(--fs-s);

  ._chirpHeader {
    width: 100%;
    padding: 1rem;
    ${mixins.flexRowCenter};
    justify-content: initial;
    gap: 0.5rem;
    background: ${(props) => props?.bgColor ?? "var(--color-primary)"};
  }

  ._chirpContent {
    width: 100%;
    padding: 1rem;
    padding-top: 0;
    background: var(--bg-primary);
    background: ${(props) => props?.bgColor ?? "var(--color-primary)"};
    border-top: 0;
    ${mixins.flexCol}
    gap:.5rem;
  }
  ._chirpDate {
    font-size: 0.6rem;
  }
  ._chirpImg {
    width: 200px;
    height: 200px;
    border-radius: 0.5rem;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  ._userAvatar {
    width: 25px;
    height: 25px;
    padding: 0.15rem;
    border-radius: 100%;
    overflow: hidden;
    background: var(--bg-primary);
  }
`;
export default ChirpCard;
