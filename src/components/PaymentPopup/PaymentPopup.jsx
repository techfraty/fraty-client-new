import assets from "../../assets";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useGlobalState } from "../../context/global.context";
import AppBtn from "../common/Btn";
import Button from "../Button/Button";
import Image from "next/image";

const PaymentPopup = ({ confirmUserRequest, upi, handleClose, cost }) => {
  const { paymentConfompopup, setPatmetConform, setshowPopup } =
    useGlobalState();

  const [countDown, setCountDown] = useState(20);

  const timer = useRef(null);

  useEffect(() => {
    if (countDown === 0) {
      clearInterval(timer.current);
    }
  }, [countDown]);

  const payment = () => {
    setPatmetConform(true);
    timer.current = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
  };

  return (
    <Popup>
      {!paymentConfompopup ? (
        <div className="fistBox">
          <div className="heade">
            <img
              src={assets.icons.close}
              className="closebtn"
              alt=""
              onClick={() => handleClose()}
            />
            <h2>Payment</h2>
          </div>
          <div className="pricebox">
            <p>Cost Per Person</p>
            <h3>₹ {cost || "NA"}</h3>
          </div>
          {upi && (
            <div className="pricebox">
              <p>UPI Id </p>
              <h3>{upi}</h3>
            </div>
          )}
          <div className="paymentmethod">
            {/* <p>Available Payment Options</p> */}
            <div className="paymentCard">
              <div className="icon">
                {/* <div className="iconcircle">
                  <img src={assets.icons.gpay} alt="" />
                </div> */}
              </div>
              <Button
                onClick={payment}
                fullWidth
                icon={
                  <Image
                    src={assets.icons.arrow}
                    alt=""
                    style={{ filter: "invert(1)" }}
                  />
                }
                bgColor="#EA664D"
                textColor="white"
              >
                Pay Now
              </Button>
            </div>
            {/* <div className="paymentCard" onClick={payment}>
              <div className="icon">
                <div className="iconcircle">
                  <img src={assets.icons.rayorpay} alt="" />
                </div>
                <p>Razor pay</p>
              </div>
              <img src={assets.icons.arrow} alt="" />
            </div> */}
          </div>
        </div>
      ) : (
        <div className="fistBox">
          <div className="popupHead">
            {countDown > 0 ? (
              <p>
                Waiting for you to make payment on <span>{upi}</span>
                <span>{countDown}</span>
              </p>
            ) : (
              <p>
                We hope you completed the payment. Please affirm, the host will
                let you in after confirmation
              </p>
            )}
          </div>
          <div className="btnbox2">
            <AppBtn
              btnBG="
#EA664D"
              square={true}
              onClick={() => {
                handleClose();
                confirmUserRequest();
                setPatmetConform(false);
                setshowPopup(false);
              }}
            >
              Yes, I&apos;ve paid
            </AppBtn>
            <AppBtn
              btnBG="
#BAA1F2"
              square={true}
              onClick={() => {
                handleClose();
                setPatmetConform(false);
                setshowPopup(false);
              }}
            >
              No, I want to cancel
            </AppBtn>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default PaymentPopup;

const Popup = styled.div`
  background-color: #00000060;
  z-index: 10;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .popupHead {
    padding: 40px 40px;
    text-align: center;
    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
    > p {
      > span:nth-child(1) {
        font-weight: 700;
      }
      > span:nth-child(2) {
        display: block;
        text-align: center;
        font-size: 20px;
      }
    }
  }
  .btnbox2 {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .fistBox {
    width: inherit;
    padding: 32px 15px;

    margin: 0 auto;

    background: #f5ebe9;
    border: 1px solid #000000;

    max-width: 700px;
    animation: slideIn 0.3s ease-in-out;
  }
  .heade {
    text-align: center;
    font-size: 24px;
    margin-bottom: 50px;
    position: relative;
    font-family: var(--ff-title);
    .closebtn {
      position: absolute;
      top: 8px;

      left: 0;
      cursor: pointer;
    }
  }
  .pricebox {
    margin-bottom: 40px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 16px;
    }
    h3 {
      font-weight: 700;
      font-size: 20px;
    }
  }
  .paymentmethod {
    p {
      font-weight: 350;
      font-size: 16px;
    }
  }
  .paymentCard {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px 0;
    :hover {
      background-color: #dad7d7;
    }
    .iconcircle {
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 50%;
      overflow: hidden;
      width: 35px;
      height: 35px;

      img {
        width: 33px;
        height: 33px;
      }
    }
    .icon {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  @keyframes slideIn {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
`;
