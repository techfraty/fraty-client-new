import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import assets from "../../assets";
import { useAuthContext } from "../../context/auth.context";
import { mixins } from "../../styles/global.theme";

//to generate ellipses in middle of address text
function trimAddress(str) {
  if (str.length > 12) {
    return str.substr(0, 5) + "..." + str.substr(str.length - 4, str.length);
  }
  return str;
}

const WalletDD = () => {
  // const { disconnect } = useDisconnect();
  const [copyStatus, setCopyStatus] = React.useState(false);
  const [showLogoutBtn, setShowLogoutBtn] = React.useState(false);

  const { currentUser } = useAuthContext();

  // const copyWallet = () => {
  //   window.navigator.clipboard.writeText(address);
  //   setCopyStatus(true);
  //   setTimeout(() => setCopyStatus(false), 1000);
  // };

  const navigate = useNavigate();

  function handleClickProfile() {
    navigate("/profile");
  }

  return currentUser ? (
    <WalletDDContainer>
      {/* <WalletDDCtr>
        <div
          className="_userInfo"
          onClick={() => setShowLogoutBtn((prev) => !prev)}
        >
          <div className="_userAvatar">
            <img
              src={`https://avatars.dicebear.com/api/identicon/${address}.svg`}
              alt=""
            />
          </div>
          <img src={assets.icons.connected} alt="" width={15} />
          <p className="_wallet">
            {copyStatus
              ? "wallet copied"
              : trimAddress(currentUser.phoneNumber)}
          </p>
        </div>
        {showLogoutBtn && (
          <button className="_logoutBtn" onClick={logout}>
            &#8623; Logout{" "}
          </button>
        )}
      </WalletDDCtr> */}
      <ProfileButton title="My Profile" onClick={handleClickProfile}>
        <img src={assets.icons.user} alt="profile" />
      </ProfileButton>
    </WalletDDContainer>
  ) : null;
};

const WalletDDContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileButton = styled.div`
  margin-left: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--color-primary);
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 15px;
    height: 15px;
  }
`;

const WalletDDCtr = styled.div`
  border: 1px solid;
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;

  position: relative;
  ${mixins.gridCenter}
  gap:.25rem;

  ._userInfo {
    ${mixins.flexRowCenter};
    font-size: var(--fs-s);
    gap: 0.5rem;
    ._wallet {
      min-width: 100px;
      text-align: center;
    }

    ._userAvatar {
      width: 20px;
      height: 20px;
      border-radius: 100%;
      border: 1px solid var(--color-primary);
      overflow: hidden;
      background: var(--bg-primary);
    }
  }
  ._logoutBtn {
    position: absolute;
    bottom: -35px;
    font-size: var(--fs-s);
    width: 100%;
    padding: 0.15rem;
    border-radius: 2rem;
    background: var(--color-yellow);
    border: 1px solid var(--color-primary);
  }
`;
export default WalletDD;
