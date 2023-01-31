import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import insta from "../../assets/icons/insta.svg";
import mail from "../../assets/icons/mail.svg";
import twitter from "../../assets/icons/twitter.svg";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div>
      <LandingPageCtr>
        <div className="footer">
          <span className="_footer_l">
            <p
              onClick={() => {
                navigate("/privacy");
              }}
            >
              Privacy Policy
            </p>
          </span>
          <span className="_footer_m">&#169; 2023 Fraty Ventures</span>
          <span className="_footer_r">
            {/* <a href="http://linkedin.com/" target="_blank"><img src = {linkedin}></img></a> */}
            <a
              href="https://twitter.com/fratyofficial?s=21&t=NEvbdnYKfsPa2E8jbVZ30Q"
              target="_blank"
              rel="noreferrer"
            >
              <img src={twitter} alt="twitter"></img>
            </a>
            <a
              href="https://instagram.com/fraty.in?igshid=YmMyMTA2M2Y="
              target="_blank"
              rel="noreferrer"
            >
              <img src={insta} alt="insta"></img>
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=fratyofficial@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              <img src={mail} alt="mail"></img>
            </a>
          </span>
        </div>
      </LandingPageCtr>
    </div>
  );
}

const LandingPageCtr = styled.div`
  .footer {
    background-color: black;
    color: white;
    width: 100%;
    margin: 0;
    padding: 1.2rem 0rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    ._footer_l {
      text-decoration: underline;
      width: 100%;
      padding-left: 0.7rem;
      display: flex;
      justify-content: left;
      align-items: left;
      p:hover {
        cursor: pointer;
      }
    }
    ._footer_m {
      width: 200%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ._footer_r {
      display: flex;
      width: 100%;
      padding-right: 0.7rem;
      display: flex;
      justify-content: right;
      align-items: right;
      img {
        filter: invert(1);
        padding: 0px 5px;
        width: 32px;
      }
    }
  }

  @media only screen and (max-width: 600px) {
    .footer {
      width: 100%;
      // background-color: black;
      padding: 1.2rem 0rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      ._footer_l {
        p:hover {
          cursor: pointer;
        }
        width: auto;
      }
      ._footer_m {
        padding: 0.5rem 0.5rem;
        width: auto;
      }
      ._footer_r {
        img {
          filter: invert(1);
          padding: 0.5rem 1rem;
        }
        width: auto;
      }
    }
  }
`;
