import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import { useAuthContext } from "../../context/auth.context";
import { mixins } from "../../styles/global.theme";
import { authServices } from "../../util/services";
import AppBtn from "../common/Btn";

const MemberCard = ({ member, event, bgColor, isEventCreator, setMembers }) => {
  const { userDetails } = useAuthContext();
  console.log({ member, userDetails });
  const removeRSVP = async () => {
    const wallet = member?.wallet;
    const { removeRsvpUser } = authServices;
    const data = await removeRsvpUser({ eventId: event, wallet });
    console.log(data);
    setMembers((prev) => prev.filter((m) => m?.wallet !== wallet));
    toast.success("Member removed successfully");
  };
  return (
    <MemberCardCtr bgColor={bgColor}>
      <div className="_userInfo">
        <p className="_name">{member?.name}</p>
        {isEventCreator && (
          <AppBtn
            width="100px"
            square={true}
            btnBG="#EA664D"
            onClick={removeRSVP}
          >
            Remove
          </AppBtn>
        )}
      </div>
      <div className="_extra">
        {member?.profession && (
          <p>
            <img src={assets.icons.user} alt="" className="_icon" />
            <span className="_profession">{member?.profession}</span>
          </p>
        )}
        {member?.song && (
          <p>
            <img src={assets.icons.music} alt="" className="_icon" />
            <span className="_song">{member?.song}</span>
          </p>
        )}
      </div>
      <div className="_userSocials">
        {member?.social?.web && (
          <a
            className="_handle web"
            rel="noreferrer"
            href={member?.social?.web}
            target="_blank"
          >
            <img src={assets.icons.web} alt="" />
          </a>
        )}
        {member?.social?.twitter && (
          <a
            className="_handle twitter"
            rel="noreferrer"
            href={`https://twitter.com/${member?.social?.twitter}`}
            target="_blank"
          >
            <img src={assets.icons.twitter} alt="" />
          </a>
        )}
        {member?.social?.instagram && (
          <a
            className="_handle insta"
            rel="noreferrer"
            href={`https://www.instagram.com/${member?.social?.instagram}`}
            target="_blank"
          >
            <img src={assets.icons.instagram} alt="" />
          </a>
        )}
      </div>
    </MemberCardCtr>
  );
};

const MemberCardCtr = styled.div`
  width: 100%;
  padding: 1rem;
  color: black;
  ${mixins.flexColCenter}
  justify-content: space-between;
  background: ${(props) => props?.bgColor ?? "#F5EBE9"};
  ._userInfo {
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  ._handle {
    display: block;
    width: 1rem;
    height: 1rem;
  }
  ._userSocials {
    ${mixins.flexRowCenter}
    gap:.75rem;
  }
  ._icon {
    width: 0.5rem;
    height: 0.5rem;
  }
  ._extra {
    width: 100%;
    font-size: 0.7rem;
    ${mixins.flexRowCenter}
    justify-content: initial;
    flex-wrap: wrap;
    gap: 0.35rem;
    p {
      ${mixins.flexRowCenter}
      gap:.25rem;
      img {
      }
    }
  }
`;
export default MemberCard;
