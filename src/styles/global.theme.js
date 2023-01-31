import * as styled from "styled-components";
import assets from "../assets";

export const bp = {
  mobile: "55em",
  smallDesk: "78em",
};

//mixins
const maxCtrSize = styled.css`
  max-width: var(--max-app-width);
  width: 100%;
  margin: 0 auto;
`;
const flexCol = styled.css`
  display: flex;
  flex-direction: column;
`;
const flexColCenter = styled.css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const flexRowCenter = styled.css`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const gridCenter = styled.css`
  display: grid;
  place-items: center;
`;

export const mixins = {
  maxCtrSize,
  flexCol,
  flexColCenter,
  flexRowCenter,
  gridCenter,
};

export const GlobalStyles = styled.createGlobalStyle`
  /*Font Imports*/
  @font-face {
    font-family: contentFont;
    font-weight: 500;
    src: url(${assets.fonts.contentFont});
  }
  @font-face {
    font-family: lightFont;
    font-weight: 400;
    src: url(${assets.fonts.lightFont});
  }
  @font-face {
    font-family: titleFont;
    font-weight: 700;
    src: url(${assets.fonts.titleFont});
  }
  @font-face {
    font-family: buttonFont;
    font-weight: 700;
    src: url(${assets.fonts.btnFont});
  }
  :root {
    //dimension
    --min-header-height: 3rem;
    --icon-size: clamp(24px, 3vw, 28px);
    --task-icon-size: clamp(55px, 8vw, 70px);
    --max-app-width: 600px;
    --max-ctr-width: 450px;

    //colors
    --bg-primary: #f5ebe9;
    --color-primary: #000;
    --color-secondary: #fff;
    --color-purple: #c6b1e9;
    --color-green: #65b378;
    --color-orange: #ea664d;
    --color-blue: #6597b3;
    --color-yellow: #e8a237;
    --color-dull: #1f1f1f;

    //fonts
    --ff-content: contentFont, sans-serif;
    --ff-title: titleFont, sans-serif;
    --ff-light: lightFont, sans-serif;
    --ff-buttonFont: buttonFont, sans-serif;
    --fs-s: clamp(0.8rem, 1vw, 0.9rem);
    --fs-r2: clamp(1rem, 2vw, 1.25rem);
    --fs-r: clamp(1.25rem, 2vw, 1.5rem);
    --fs-l: clamp(1.5rem, 2vw, 1.75rem);
    --fs-xl: clamp(2.5rem, 3vw, 2.8rem);
    --fs-xxl: clamp(3rem, 4vw, 3.5rem);

    /* toastify custom styles */
    --toastify-color-light: var(--bg-primary) !important;
    --toastify-text-color-light: var(--color-primary) !important;
    --toastify-font-family: var(--ff-content) !important;
  }
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  * {
    margin: 0;
    padding: 0;
    font: inherit;
    p {
      margin: 0;
    }
    -webkit-tap-highlight-color: transparent; /* transparent with keyword */
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul[role="list"],
  ol[role="list"] {
    list-style: none;
  }

  /* Set core root defaults */
  html:focus-within {
    scroll-behavior: smooth;
  }

  html,
  body,
  #root {
    min-height: 100vh;
    ${
      "" /* background: radial-gradient(
      circle at -317px 239px,
      #ea664d,
      #ea664d36,
      #e8a23736,
      #e8a237
    ); */
    }
    ${"" /* background:#f5ebe9; */}
  }
  /* Set core body defaults */
  body {
    ${
      "" /* background: url(${assets.overlays.bgOverlay}), var(--bg-primary);
    background-size: cover;
    background-repeat: no-repeat;
    background-opacity: 0.5;
    background-position: center; */
    }
    ${mixins.flexCol}
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    font-family: var(--ff-content);
    font-size: var(--fs-r);
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img,
  picture,
  svg {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
    cursor: pointer;
    color: var(--color-primary);
  }

  /*Hide Arrows From Input Number*/
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  /*hide choose file btn from input filed*/
  /* input[type="file"] {
    display: none;
  } */
  input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
  }
  a {
    color: var(--color-dull);
    cursor: pointer;
  }

  /* Customize scrollbar */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-purple);
  }

  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  .App {
    height: 100%;
    ${flexCol}
    gap:1rem;

    position: relative;
  }

  .appContent {
    width: 100%;
    flex: 1 0 auto;
    margin: 0 auto;
    max-width: var(--max-app-width);
    padding-bottom: 5rem;
    z-index: 1;

    @media screen and (max-width: 768px) {
      padding: 0.5rem 1rem;
    }
  }
  .title {
    font-family: var(--ff-title);
    font-size: var(--fs-xl);
  }
  .subtitle {
    font-family: var(--ff-content);
    font-size: var(--fs-l);
  }
  .btnStyle {
    width: 100%;
    color: var(--color-primary);
    ${flexRowCenter}
    padding: 0.5rem;
    gap: 0.5rem;
    font-size: var(--fs-r2);
    border: 1px solid var(--color-primary);
    cursor: pointer;
    background: var(--color-bg);
  }

  .btnStyle:active {
    box-shadow: none;
    position: relative;
    top: 0.2em;
  }

  /*Toastify Styles*/
  .Toastify__toast {
    border: 2px solid var(--color-primary);
    font-size: var(--fs-s);
  }
  .__leftGradient,
  .__rightGradient {
    position: fixed;
    top: 0;
    z-index: 0;
    transform: scale(1.2);
    filter: blur(5px);
    pointer-events: none;
  }
  .__rightGradient {
    right: 0;
  }
  .yarl__container {
    background-color: rgba(0, 0, 0, 0.4) !important;
    backdrop-filter: blur(8px);
  }
`;
