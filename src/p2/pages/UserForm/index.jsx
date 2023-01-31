import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount, useMutation } from "wagmi";
import assets from "../../assets";
import AppBtn from "../../components/common/Btn";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { authServices, postServices } from "../../util/services";

const UserForm = () => {
  const { setCurrentPageTitle, userCred } = useGlobalState();
  const [userInput, setUserInput] = React.useState(null);
  const { address } = useAccount();
  const { state: event } = useLocation();

  const navigate = useNavigate();
  const recordResponse = (e) => {
    const res = { key: e.target.name, value: e.target.value };
    setUserInput((prev) => ({ ...prev, [res.key]: res.value }));
  };

  const { isLoading: uploadingUserInfo, mutate: uploadUserCred } = useMutation(
    postServices.uploadUserCred,
    {
      onSuccess: (res) => {
        toast.success("User Info Saved!");
      },
      onError: (err) => {
        toast.error("User Info Submission Failed!");
      },
    }
  );

  const { isLoading: authLoading, mutate: loginUserPostCredit } = useMutation(
    authServices.rsvpUser,
    {
      onSuccess: (res) => {
        const userToken = res.token;
        const userLS = JSON.parse(window.localStorage.getItem(event?.id));
        if (window.localStorage.getItem("wallet")) {
          window.localStorage.setItem(
            event?.id,
            JSON.stringify({
              wallet: window.localStorage.getItem("wallet"),
              token: userToken,
            })
          );
        } else {
          window.localStorage.setItem(
            event?.id,
            JSON.stringify({ wallet: userLS?.wallet, token: userToken })
          );
        }
        navigate(-1);
        toast.success("User Onborded Successfully !");
      },
      onError: (err) => {
        toast.error("User Onborded Failure !");
        console.log("User Onboard Failure.");
      },
    }
  );
  React.useEffect(() => {
    if (!address || !event) {
      navigate("/");
    }
    setCurrentPageTitle("Hey, Supp!");
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    uploadUserCred({
      wallet: address,
      name: userInput?.name,
      social: {
        web: userInput?.web ?? null,
        twitter: userInput?.twitter ?? null,
        instagram: userInput?.instagram ?? null,
      },
      profession: userInput?.profession,
      song: userInput?.song ?? null,
    });
    loginUserPostCredit({
      wallet: window.localStorage.getItem("wallet"),
      eventID: event?.id,
      referral: window.localStorage.getItem("referral") ?? "",
    });
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
          />
        </label>
        <label className="_userInput">
          <span>What's your favourite song?</span>
          <input
            type="text"
            name="song"
            placeholder="your jam?"
            onChange={recordResponse}
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
            />
          </div>
        </label>
        <AppBtn loading={uploadingUserInfo || authLoading}>Less go!</AppBtn>
      </form>
    </UserFormCtr>
  );
};

const UserFormCtr = styled.div`
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
      padding: 0.5rem;
      font-size: var(--fs-s);
      border: 1px solid var(--color-primary);
      border-radius: 0.5rem;
    }
    ._socialInput {
      width: 100%;
      border: 1px solid var(--color-primary);
      border-radius: 0.5rem;
      overflow: hidden;
      ${mixins.flexRowCenter}
      padding:0 0.5rem;
      background: var(--color-secondary);
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
      }
    }
  }
`;
export default UserForm;
