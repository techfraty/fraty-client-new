import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import AppBtn from "../../components/common/Btn";
import { useAuthContext } from "../../context/auth.context";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { authServices, postServices } from "../../util/services";
import Button from "./../../components/Button/Button";

const Profile = () => {
  const { currentUser, userDetails, setUserDetails } = useAuthContext();
  // console.log(userDetails, currentUser);
  const { setCurrentPageTitle, userCred } = useGlobalState();
  const [userInput, setUserInput] = React.useState({
    name: userDetails?.name || "",
    instagram: userDetails?.social?.instagram || "",
    twitter: userDetails?.social?.twitter || "",
    web: userDetails?.social?.web || "",
    profession: userDetails?.profession || "",
    song: userDetails?.song || "",
    number: userDetails?.wallet,
  });

  const navigate = useNavigate();

  const recordResponse = (e) => {
    const res = { key: e.target.name, value: e.target.value };
    setUserInput((prev) => ({ ...prev, [res.key]: res.value }));
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
    setCurrentPageTitle("My Profile");
  }, [currentUser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(userInput?.name);
      const res = await postServices.uploadUserCred(
        userInput?.number,
        userInput?.name,
        userInput?.profession,
        {
          web: userInput?.web ?? null,
          twitter: userInput?.twitter ?? null,
          instagram: userInput?.instagram ?? null,
        },
        userInput?.song ?? null
      );
      console.log(res);
      if (res.status === 200) {
        setUserDetails((prev) => ({
          ...prev,
          wallet: userInput?.number,
          name: userInput?.name,
          profession: userInput?.profession,
          social: {
            web: userInput?.web ?? null,
            twitter: userInput?.twitter ?? null,
            instagram: userInput?.instagram ?? null,
          },
          song: userInput?.song ?? null,
        }));
      }
      toast.success("User Info Saved!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const logout = () => {
    // disconnect();
    window.localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <UserFormCtr>
      <form className="_userCredForm" onSubmit={onSubmit}>
        <label className="_userInput">
          <span>
            Name<sup style={{ fontSize: ".7rem" }}>*</sup>
          </span>
          <input
            type="text"
            name="name"
            placeholder="Pseudonymous name works too!"
            onChange={recordResponse}
            required
            value={userInput["name"]}
          />
        </label>
        <label className="_userInput">
          <span>
            Number<sup style={{ fontSize: ".7rem" }}>*</sup>
          </span>
          <input
            type="text"
            name="number"
            placeholder="Pseudonymous number works too!"
            onChange={recordResponse}
            required
            value={userInput["number"]}
          />
        </label>
        <label className="_userInput">
          <span>
            What do you do?<sup style={{ fontSize: ".7rem" }}>*</sup>
          </span>
          <input
            type="text"
            name="profession"
            placeholder="Your job title/ your oraganization title"
            onChange={recordResponse}
            required
            value={userInput["profession"]}
          />
        </label>
        <label className="_userInput">
          <span>What's your favourite song?</span>
          <input
            type="text"
            name="song"
            placeholder="your jam?"
            onChange={recordResponse}
            value={userInput["song"]}
          />
        </label>
        <label className="_userInput">
          <span>
            Connect Socials
            <span style={{ fontSize: ".6rem" }}>
              {" ("}This will help people connect to you{")"}
            </span>
          </span>
          <div className="_socialInput">
            <div className="_socialIcon">
              <img src={assets.icons.web} alt="" />
            </div>
            <input
              type="text"
              name="web"
              placeholder="your portfolio link?"
              onChange={recordResponse}
              value={userInput["web"]}
            />
          </div>
          <div className="_socialInput">
            <div className="_socialIcon">
              <img src={assets.icons.twitter} alt="" />
            </div>
            <input
              type="text"
              name="twitter"
              placeholder="your twitter username?"
              onChange={recordResponse}
              value={userInput["twitter"]}
            />
          </div>
          <div className="_socialInput">
            <div className="_socialIcon">
              <img src={assets.icons.instagram} alt="" />
            </div>
            <input
              type="text"
              name="instagram"
              placeholder="your instagram username?"
              onChange={recordResponse}
              value={userInput["instagram"]}
            />
          </div>
        </label>
        <AppBtn square={true} btnBG="var(--color-green)">
          Update details
        </AppBtn>
        <Button textColor="white" fullWidth onClick={logout} bgColor="#EA664D">
          Logout
        </Button>
      </form>
    </UserFormCtr>
  );
};

const UserFormCtr = styled.div`
  label {
    span {
      font-weight: 700;
    }
  }
  ._userCredForm {
    width: 100%;
    ${mixins.flexCol}
    gap:1.5rem;
    font-size: var(--fs-r2);
  }
  ._userInput {
    ${mixins.flexCol};
    gap: 0.5rem;
    input {
      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: rgba(0, 0, 0, 0.3);
        opacity: 1; /* Firefox */
      }
      background-color: transparent;
      backdrop-filter: blur(12px);
      padding: 0.5rem;
      font-size: var(--fs-s);
      border: 1px solid var(--color-primary);
    }
    ._socialInput {
      width: 100%;
      border: 1px solid var(--color-primary);
      background-color: transparent;
      backdrop-filter: blur(12px);
      overflow: hidden;
      ${mixins.flexRowCenter}
      padding:0 0.5rem;
      ._socialIcon {
        width: 1rem;
        height: 1rem;
      }
      input {
        width: 100%;
        border: none;
        outline: none;
        background: none;
        border-radius: 0;
        &::placeholder {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: rgba(0, 0, 0, 0.3);
          opacity: 1; /* Firefox */
        }
      }
    }
  }
`;
export default Profile;
