import React, { useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, postServices } from "../../../util/services";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { useGlobalState } from "../../../context/global.context";
import Button from "../../../components/Button/Button";
import { useAuthContext } from "../../../context/auth.context";
import { useRouter } from "next/router";

const Waiting = () => {
  const router = useRouter();
  const eventIDParam = router.query.eventId;
  const { currentUser } = useAuthContext();
  const [waitinglist, setWaitinglist] = React.useState([]);
  const { setCurrentPageTitle, setCustomBackHeaderLink } = useGlobalState();

  const { isLoading: fwaithinglist } = useQuery({
    queryKey: ["fetchWaithing"],
    queryFn: async () => fetchServices.fetchWaithinglist(eventIDParam),
    onSuccess: (data) => {
      console.log(data, currentUser);
      setWaitinglist(
        data.data.filter((prev: any) => prev?._id !== currentUser?.id?._id)
      );
    },
    refetchInterval: 10000,
    cacheTime: 0,
  });

  useEffect(() => {
    setCurrentPageTitle("Wait list");
    setCustomBackHeaderLink(null);
  }, [setCurrentPageTitle, setCustomBackHeaderLink]);

  if (!fwaithinglist && waitinglist?.length === 0)
    return <p>No one is in the waiting list.</p>;

  return (
    <WaitingList>
      {fwaithinglist ? (
        <Loader />
      ) : (
        waitinglist.map((data, idx: number) => (
          <WaitingCard
            bg={
              parseInt(idx) % 5 === 0
                ? "var(--color-orange)"
                : parseInt(idx) % 5 >= 4
                ? "var(--color-purple)"
                : parseInt(idx) % 5 >= 3
                ? "var(--color-blue)"
                : parseInt(idx) % 5 >= 2
                ? "var(--color-yellow)"
                : "var(--color-green)"
            }
            data={data}
            setWaitinglist={setWaitinglist}
          />
        ))
      )}
    </WaitingList>
  );
};

const WaitingCard = ({ bg, data, setWaitinglist }: any) => {
  const router = useRouter();
  const eventIDParam = router.query.eventId;
  const letItIn = async () => {
    await postServices
      .letIn(eventIDParam, data.wallet)
      .then((response) => {
        toast.success("success");
        // navigate("/")
        setWaitinglist((prev: any) =>
          prev.filter(
            (data: any) => data._id !== response?.data?.data?.member[0]?._id
          )
        );
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        toast.error("Request failed");
        console.log(response);
      });
  };
  return (
    <div className="card" style={{ background: bg }}>
      <div className="cardLeft">
        <div className="waithigCardHead">
          <h4>{data.name}</h4>
          <div className="waitingBedge">
            <p>Paid</p>
          </div>
        </div>
        {/* <div className="waithigCardHeadSub">
          <p>Design</p>
          <div className="dot"></div>
          <p>Dark Fantasy</p>
        </div> */}
      </div>
      <div className="cardRight">
        <Button bgColor="f5ebe9" onClick={letItIn}>
          Let In
        </Button>
      </div>
    </div>
  );
};

export default Waiting;

const WaitingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card {
    display: flex;
    justify-content: space-between;
    /* background: #EA664D; */
    padding: 16px;
  }
  .cardLeft {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .waithigCardHead {
    font-size: 16px;
    display: flex;
    gap: 4px;
    h4 {
      font-family: var(--ff-buttonFont);
    }
  }
  .waitingBedge {
    font-size: 8px;
    background: #f5ebe9;
    border: 0.5px solid #000000;
    border-radius: 17px;
    padding: 2px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: min-content;
    margin: auto 0;
  }
  .waithigCardHeadSub {
    font-size: 12px;
    display: flex;
    align-self: center;
    justify-content: center;
    gap: 4px;
  }
  .dot {
    width: 5px;
    height: 5px;
    background-color: #000000;
    border-radius: 50%;
    margin: auto 0;
  }
  .cardRight {
    button {
      font-family: var(--ff-light);
    }
  }
`;

const Buttons = styled.div`
  width: max-content;
  position: relative;

  .bottom {
    width: 100%;
    height: 100%;
    border: 1px solid #000000;
    background-color: #000000;
    position: absolute;
    top: 2px;
    left: 2px;

    border-radius: 24px;
  }
  .top {
    padding: 10px 23px;
    font-size: 16px;
    background-color: #f5ebe9;
    border: 1px solid #000000;
    border-radius: 24px;

    position: relative;
    z-index: 5;
  }
  .top:hover {
    background-color: #62aa70;
  }
`;
