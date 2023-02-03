import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import assets from "../../assets";
import { useAuthContext } from "../../context/auth.context";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { AUTH_TOKEN } from "../../util/constants";
import AuthModal from "../AuthModal/AuthModal";
import AppBtn from "../common/Btn";
import WalletDD from "../WalletDD";
import { useRouter } from "next/router";
import Image from "next/image";

const Header = ({ backToHome = false, handleBack, pageTitle, customStyle }) => {
  const router = useRouter();

  const pathname = router.pathname;
  const [showBrandHeader, setShowBrandHeader] = useState(false);
  const { currentPageTitle, customBackHeaderLink, setCustomBackHeaderLink } =
    useGlobalState();
  const [hideBackNav, setHideBackNav] = useState(false);
  const { currentUser } = useAuthContext();
  console.log(pathname);
  useEffect(() => {
    if (pathname === "/user-cred") {
      setShowBrandHeader(false);
      setHideBackNav(true);
    } else if (pathname === "/" || pathname === "/landing") {
      setShowBrandHeader(true);
    } else {
      setShowBrandHeader(false);
      setHideBackNav(false);
    }
  }, [pathname]);

  function handleClickBack() {
    if (handleBack) {
      return handleBack();
    }
    if (customBackHeaderLink) {
      let tempLink = customBackHeaderLink;
      setCustomBackHeaderLink(null);
      return router.push(tempLink);
    }
    if (backToHome) {
      router.push("/");
    } else {
      router.back();
    }
  }
  const { setShowAuthModal, showAuthModal } = useGlobalState();
  const openAuthModel = () => {
    setShowAuthModal(true);
  };
  let hasToken;
  useEffect(() => {
    hasToken = localStorage.getItem(AUTH_TOKEN);
  }, []);
  return (
    <HeaderCtr style={customStyle}>
      {showBrandHeader ? (
        <div className="_brandHeader">
          <Image
            className="_brandName"
            src={assets.logos.brand_logo}
            alt="brand-logo"
          />
          {!hasToken && !currentUser && (
            <AppBtn
              btnBG="#62AA70"
              square={true}
              width={"74px"}
              onClick={openAuthModel}
            >
              Login
            </AppBtn>
          )}
          <WalletDD />
        </div>
      ) : (
        <div className="_navHeader">
          {!hideBackNav ? (
            <div>
              {" "}
              <button className="_goBackBtn" onClick={handleClickBack}>
                <Image src={assets.icons.arrowLeft} alt="go-back" />
              </button>
            </div>
          ) : null}
          <p className="_pageTitle">{pageTitle || (currentPageTitle ?? "")}</p>
        </div>
      )}{" "}
    </HeaderCtr>
  );
};

const HeaderCtr = styled.div`
  width: 100%;
  min-height: var(--min-header-height);
  max-width: var(--max-app-width);
  margin: 1rem auto;
  ${"" /* z-index: 5; */}
  z-index: 1;
  position: relative;

  ._brandHeader {
    padding: 0.5rem 1rem;
    ${mixins.flexRowCenter};
    justify-content: space-between;
    ._brandName {
      width: 100px;
    }
  }
  ._navHeader {
    ${mixins.flexRowCenter}
    padding: 0.5rem 0;
    height: 100%;
    justify-content: initial;
    ._goBackBtn {
      background: none;
      border: none;
      outline: none;
    }
    ._pageTitle {
      margin: 0 auto;
      font-size: var(--fs-l);
      max-width: 80%;
      word-break: break-word;
      font-family: var(--ff-title);
    }

    @media screen and (max-width: 768px) {
      padding: 0.5rem 1rem;
    }
  }
  @media screen and (min-width: 500px) {
    max-width: 100%;
  }
`;

export default Header;
