import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import AppBtn from "../../components/common/Btn";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { postServices } from "../../util/services";

const PoapPage = () => {
  const { setCurrentPageTitle } = useGlobalState();
  const { state: poap } = useLocation();
  const navigate = useNavigate();
  const {
    isLoading: mintingPOAP,
    mutate: mintPOAP,
    isSuccess: mintSuccess,
  } = useMutation(postServices.mintPOAP, {
    onSuccess: () => {
      toast.success("POAP Claimed Successfully!");
    },
    onError: (err) => {
      toast.error("Mint Error!");
    },
  });
  const calimPOAP = () => mintPOAP(poap?.eventID);
  React.useEffect(() => {
    if (!poap) {
      navigate("/");
    }
    setCurrentPageTitle(poap?.name);
  }, [setCurrentPageTitle]);
  return (
    <PoapCtr>
      {poap?.image ?  
      <>
            <div className="_poapImg">
        <img src={poap?.image} alt="" />
      </div>
      <p className="_poapDesc">{poap?.description}</p>
      {mintSuccess ? (
        <AppBtn btnBG={"var(--color-green)"} onClick={() => navigate(-1)}>
          <span>Claimed</span>
          <img src={assets.icons.tick} alt="" />
        </AppBtn>
      ) : (
        <AppBtn
          loadingText="Claiming . . ."
          loading={mintingPOAP}
          onClick={calimPOAP}
        >
          Claim your POAP
        </AppBtn>
      )}
      </>

      :

      <div className="ifpoap">
        <p> To be unlocked on event day</p>
      </div>


}
    </PoapCtr>
  );
};

const PoapCtr = styled.div`
  ${mixins.flexCol}

  gap: 1rem;
  ._poapImg {
    height: 50vh;
    width: 100%;
    max-height: 450px;
    border: 1px solid;
    border-radius: 2rem;
    overflow: hidden;
    background: var(--color-purple);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  ._poapDesc {
    font-size: var(--fs-r2);
    font-family: var(--ff-light);
  }
  .ifpoap{
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export default PoapPage;
