import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import iphoneimage from "../../assets/images/iPhone 11 Pro/X - 1.png";
import assets from "../../assets";
import AppBtn from "./../../components/common/Btn";
import glasses from "../../assets/images/Group.svg";
import pouyingFace from "../../assets/images/Smiling face with heart-eyes.svg";
import smilingFace from "../../assets/images/Pouting face.svg";
import partyingText from "../../assets/images/We love partying but hate planning.svg";
import stackImage from "../../assets/images/overlays/Group 26902.svg";
import stackImageFullWidth from "../../assets/images/falling_stack_fullscreen.svg";
import eyeball from "../../assets/images/overlays/eyeballimage.svg";
import {
  motion,
  useScroll,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import outlinedTextFraty from "../../assets/images/overlays/FRATY.svg";
import AuthModal from "../../components/AuthModal/AuthModal";
import { useGlobalState } from "../../context/global.context";
import flyerImage1 from "../../assets/images/flyer/image1.png";
import flyerImage2 from "../../assets/images/flyer/image2.png";
import flyerImage3 from "../../assets/images/flyer/image3.png";
import flyerImage4 from "../../assets/images/flyer/image4.png";
import Footer from "../../components/Footer/Footer";

const LandingPage = () => {
  const [calculatedWidth, setCalculatedWidth] = React.useState(0);
  const containerRef = useRef(null);
  const [designCompText, setDesignCompText] = useState("Friends");
  const [designComp2Text, setDesignComp2Text] = useState("House Parties");
  const [flyerImage, setFlyerImage] = useState({
    image: flyerImage2,
    rotation: "-11.77deg",
  });

  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotate = useTransform(scrollYProgress, [0, 100], [0, 360], {
    clamp: false,
  });

  useLayoutEffect(() => {
    const updateSize = () => {
      setCalculatedWidth(
        (containerRef.current.offsetWidth / Math.sqrt(3)) * 2 + 100
      );
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const designTextList = ["Friends", "Memories", "Experiences", "Parties"];
      const itemIndex = designTextList.indexOf(designCompText);
      if (itemIndex === designTextList.length - 1) {
        setDesignCompText(designTextList[0]);
      } else {
        setDesignCompText(designTextList[itemIndex + 1]);
      }
    }, 500);

    const interval2 = setInterval(() => {
      const designTextList2 = [
        "House Parties",
        "Pool Parties",
        "Dinner Parties",
        "Meetups",
        "Poker Nights",
        "Club Events",
      ];
      const itemIndex = designTextList2.indexOf(designComp2Text);
      if (itemIndex === designTextList2.length - 1) {
        setDesignComp2Text(designTextList2[0]);
      } else {
        setDesignComp2Text(designTextList2[itemIndex + 1]);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, [designCompText, designComp2Text, flyerImage]);

  useEffect(() => {
    const interval3 = setInterval(() => {
      const flyerImageList = [
        { image: flyerImage1, rotation: "-15.49deg" },
        { image: flyerImage2, rotation: "10.27deg" },
        { image: flyerImage3, rotation: "-1.87deg" },
        { image: flyerImage4, rotation: "-11.77deg" },
      ];
      const itemIndex = flyerImageList.findIndex(
        (item) => item.rotation === flyerImage.rotation
      );
      if (itemIndex === flyerImageList.length - 1) {
        setFlyerImage(flyerImageList[0]);
      } else {
        setFlyerImage(flyerImageList[itemIndex + 1]);
      }
    }, 1000);

    return () => {
      clearInterval(interval3);
    };
  }, [flyerImage]);

  const { showAuthModal, setShowAuthModal } = useGlobalState();

  return (
    <div>
      <LandingPageCtr>
        <div className="container1" ref={containerRef}>
          <img
            decoding="sync"
            className="iphone"
            src={iphoneimage}
            alt="phone"
          />
          <div className="__Gradient center phoneBackGradient">
            <img
              decoding="sync"
              src={assets.gradients.sevenstarGradient}
              alt="gradient"
            />
          </div>
          <div
            className="stripe left stripeLeft"
            style={{ width: calculatedWidth }}
          >
            <div class="marquee">
              <div class="track">
                <div class="content">
                  Party planning becomes delightful now. Party planning becomes
                  delightful now. Party planning becomes delightful now. Party
                  planning becomes delightful now.
                </div>
              </div>
            </div>
          </div>
          <div
            className="stripe right stripeRight"
            style={{ width: calculatedWidth }}
          >
            <div class="marquee">
              <div class="track">
                <div class="content">
                  Welcome to the social experiences platform. Welcome to the
                  social experiences platform. Welcome to the social experiences
                  platform. Welcome to the social experiences platform.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container2">
          <div className="container2a">
            <div className="row">
              <h1 style={{ marginLeft: "2rem" }}>Multiple</h1>
              <div
                style={{
                  width: "200px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <DesignComp text={designCompText} />
              </div>
            </div>
            <h1 className="_extraLineHeight">One destination</h1>
            <AppBtn
              margin={"15px 0"}
              onClick={() => setShowAuthModal(true)}
              square={true}
              btnBG="#EA664D"
              width="174px"
            >
              Throw Your Party
            </AppBtn>
            <p>In less than a minute!</p>
          </div>
        </div>
        <div className="container3">
          <div className="group top left">
            <img decoding="sync" src={assets.overlays.Group2} />
          </div>
          <div className="group">
            <img decoding="sync" src={assets.overlays.GroupText} />
          </div>
          {/* <div style={{ zIndex: 3 }}>
          <img src={assets.overlays.Group3} />
        </div> */}
          <div style={{ marginTop: "50px" }}>
            {[...Array(10)].map((e, i) => {
              return (
                <motion.div
                  initial={{ rotate: -15 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textTransform: "uppercase",
                    fontFamily: "var(--ff-title)",
                    gap: "15px",
                    margin: "15px 0",
                    x,
                  }}
                >
                  {[...Array(10).fill("Fraty")].map((str) => (
                    <img decoding="sync" src={outlinedTextFraty} />
                  ))}
                </motion.div>
              );
            })}
          </div>
          <div className="__Gradient left">
            <img
              decoding="sync"
              src={assets.gradients.greenStarGradient}
              alt="gradient"
            />
          </div>
          <div className="group bottom" style={{ right: 0 }}>
            <img decoding="sync" src={assets.overlays.Group1} />
          </div>
        </div>
        <div className="container4">
          <div className="__Gradient right">
            <img
              decoding="sync"
              src={assets.gradients.blueStarGradient}
              alt="gradient"
            />
          </div>
          <div
            style={{
              zIndex: 3,
              position: "relative",
              transform: "rotate(-15.46deg)",
            }}
          >
            <img
              decoding="sync"
              src={assets.overlays.Group}
              alt="gradient"
              style={{
                transform: "rotate(15.46deg)",
                zIndex: 3,
                position: "relative",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "63px",
                left: "38px",
                // transform: "translate(-50%, -50%)",
                zIndex: 1,
                width: "143px",
                height: "178px",
                overflow: "hidden",
              }}
            >
              <img
                decoding="sync"
                src={flyerImage?.image}
                alt="flyer"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  // transform: `rotate(${flyerImage?.rotation})`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              zIndex: 3,
              marginTop: "45px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            <h1>Smexy People do</h1>
            <div className="row">
              <h1>their</h1>
              <div
                style={{
                  minWidth: "230px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <DesignComp colorText={true} text={designComp2Text} />
              </div>
            </div>
            <h1 className="_extraLineHeight">on Fraty</h1>
          </div>
          <p>Are you smexy? Host one now!</p>
          <AppBtn
            margin={"15px 0"}
            onClick={() => setShowAuthModal(true)}
            square={true}
            btnBG="#EA664D"
            width="132px"
          >
            Host A Party
          </AppBtn>
        </div>
        <div className="container5">
          <div style={{ zIndex: 3, marginTop: "45px", marginBottom: "15px" }}>
            <img decoding="sync" src={glasses} alt="glasses" />
          </div>
          <div className="__Gradient center" style={{ left: "30%" }}>
            <img
              decoding="sync"
              style={{ scale: "2" }}
              src={assets.gradients.sevenstarGradient}
              alt="gradient"
            />
          </div>
          <div
            style={{
              zIndex: 3,
              marginTop: "75px",
              marginBottom: "15px",
              position: "relative",
            }}
          >
            <img
              decoding="sync"
              src={smilingFace}
              alt="smiling"
              className="smilingemoji"
            />
            <img decoding="sync" src={partyingText} alt="text" />
            <img
              decoding="sync"
              src={pouyingFace}
              alt="pouting"
              className="poutingemoji"
            />
          </div>
          <p>Make your life easy with:</p>
        </div>
        <div className="container6">
          <div>
            <img
              decoding="sync"
              src={window.innerWidth <= 500 ? stackImage : stackImageFullWidth}
              className="stackImage"
              style={{
                maxWidth: window.innerWidth <= 500 ? "auto" : "600px",
                margin: "0 auto",
              }}
              alt="stack of text"
            />
          </div>
          <AppBtn
            margin={"15px 0"}
            onClick={() => setShowAuthModal(true)}
            square={true}
            btnBG="#EA664D"
            width="132px"
          >
            Host A Party
          </AppBtn>
        </div>
        <div className="container7">
          <div className="row">
            <div className="column">
              <h1 style={{ fontSize: "16px" }}>
                Don&apos;t dissapoint your friends and get that party started
              </h1>
              <AppBtn
                margin={"15px 0"}
                onClick={() => setShowAuthModal(true)}
                square={true}
                btnBG="#EA664D"
                width="132px"
              >
                Host A Party
              </AppBtn>
            </div>
            <img decoding="sync" src={eyeball} alt="eyeball" />
          </div>
        </div>
        <Footer />
      </LandingPageCtr>
      {showAuthModal && (
        <AuthModal
          handleClose={() => {
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
};

const DesignComp = ({ text, colorText }) => {
  if (colorText) {
    return <StyledH2 text={text}>{text}</StyledH2>;
  }
  return <StyledH1 text={text}>{text}</StyledH1>;
};

const designColors = {
  Friends: { color: "#E8A237" },
  Parties: { color: "#EA664D" },
  Experiences: { color: "#6597B3" },
  Memories: { color: "#62AA70" },
  "House Parties": { color: "#EA664D", rotation: "0deg" },
  "Pool Parties": { color: "#6597B3", rotation: "0deg" },
  "Dinner Parties": { color: "#62AA70", rotation: "0deg" },
  "Poker Nights": { color: "#2DB3FF", rotation: "0deg" },
  "Club Events": { color: "#5732ab", rotation: "0deg" },
  Meetups: { color: "#EA664D", rotation: "0deg" },
};

const StyledH1 = styled.h1`
  background: ${(props) => designColors[props.text].color};
  padding: 0 10px;
  transform: ${(props) => `rotate(${designColors[props.text].rotation})`};
  text-align: center;
`;
const StyledH2 = styled.h1`
  color: ${(props) => designColors[props.text].color};
  padding: 0 10px;
  transform: ${(props) => `rotate(${designColors[props.text].rotation})`};
  text-align: center;
`;

const LandingPageCtr = styled.div`
  & {
    overflow-x: hidden;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--max-app-width);
  }
  @media screen and (min-width: 500px) {
    left: 0;
    transform: translateX(0);
    max-width: 100%;
  }
  .container1,
  .container2,
  .container2a,
  .container3,
  .container4,
  .container5,
  .container7,
  .container6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    h1 {
      font-family: var(--ff-title);
      font-size: 24px;
      font-weight: 700;
    }
    p {
      z-index: 3;
      font-family: var(--ff-light);
      font-size: 16px;
      color: "black";
      font-weight: 500;
    }
  }

  ._extraLineHeight {
  }
  .container3,
  .container4,
  .container6,
  .container7 {
    margin-top: 80px;
  }
  .container7 {
    margin-top: 100px;
    margin-bottom: 100px;
    padding: 0 1rem;
  }
  .container6 {
    width: 100%;

    div,
    img {
      width: 100%;
    }
  }
  .__Gradient {
    position: absolute;
    z-index: 0;
    transform: scale(1.2);
    filter: blur(5px);
    pointer-events: none;
  }
  .container4 .__Gradient {
    right: 0;
  }
  .stripe,
  .group {
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }
  .phoneBackGradient {
    display: flex;
    justify-content: center;
    img {
      width: 100%;
    }
  }
  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
  }
  .iphone {
    height: 50vh;
    min-height: 500px;
    z-index: 3;
  }
  .row {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
  }
  .bgYellow {
    background: #e8a237;
    padding: 5px 15px;
    transform: rotate(-6deg);
  }

  .left {
    left: 0;
  }
  .container1 {
    overflow: hidden;
  }
  .stripeLeft {
    top: 215px;
    left: -75px;
    transform: rotate(30deg);
    translate-origin: center;
    background: #6597b3;
    .marquee {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .stripeRight {
    left: -90px;
    transform: rotate(-30deg);
    transform-origin: center;
    background: #ea664d;
    .marquee {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  @media screen and (min-width: 500px) {
    .stripeLeft {
      top: 247px;
      transform: rotate(19deg);
    }
    .stripeRight {
      left: -154px;
      transform: rotate(341deg);
    }
    .container2,
    .container3,
    .container4,
    .container5 {
      margin-top: 100px;
    }
    .center {
      width: 40%;
    }
    .group.left.top {
      top: 15%;
      left: 30%;
    }
    .group.bottom {
      right: 25% !important;
    }
  }
  .stripeLeft .track,
  .stripeRight .track {
    font-family: var(--ff-title);
    text-transform: uppercase;
  }
  .stripeRight .track {
  }
  .bottom {
    bottom: 0;
  }
  .top {
    top: 0;
  }
  .smilingemoji {
    position: absolute;
    top: 24px;
    left: 247px;
  }
  .poutingemoji {
    top: -22px;
    left: -36px;
    position: absolute;
  }
  .stackImage {
    margin-bottom: 100px;
  }
  .marquee {
    position: relative;
    max-width: 100%;
    height: 40px;
  }

  .track {
    position: absolute;
    white-space: nowrap;
    will-change: transform;
    animation: marquee 32s linear infinite;
  }

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
      width: 100%;
      padding-left: 0.7rem;
      display: flex;
      justify-content: left;
      align-items: left;
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
      display: flex;
      justify-content: right;
      align-items: right;
      img {
        padding: 0px 5px;
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
        width: auto;
      }
      ._footer_m {
        padding: 0.5rem 0.5rem;
        width: auto;
      }
      ._footer_r {
        img {
          padding: 0.5rem 1rem;
        }
        width: auto;
      }
    }
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
`;
export default LandingPage;
