import { useRef } from "react";
import styled from "styled-components";
import { useState } from "react";
import { mixins } from "../../styles/global.theme";
import Button from "../Button/Button";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "../../util/firebase.config";
import { auth } from "../../util/firebase.config";
import { useAuthContext } from "../../context/auth.context";
import { authServices, fetchServices, postServices } from "../../util/services";
import { AUTH_TOKEN, COUNTRY_CODES } from "../../util/constants";

interface AuthModalProps {
  handleClose: () => void;
  event?: any;
  onSuccessfullLogin?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  handleClose,
  event,
  onSuccessfullLogin,
}) => {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [name, setName] = useState("");
  const [otp, setOTP] = useState("");
  const [isSignInAllowed, setIsSignInAllowed] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [submitBtnText, setSubmitBtnText] = useState("Send OTP");
  const [userExists, setUserExists] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  function generateRecaptcha() {
    if (typeof window === "undefined") return;
    // @ts-ignore
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          setIsSignInAllowed(true);
        },
      },
      auth
    );
  }

  const { setCurrentUser, setUserDetails, setToken }: any = useAuthContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isOTPSent) return handleCheckOTP();

    if (!phone) return alert("Please enter phone number");

    if (phone.length !== 10) return alert("Please enter a valid phone number");

    setSubmitBtnText("Sending OTP...");
    if (typeof window === "undefined") return;
    generateRecaptcha();
    // if (!isSignInAllowed) return console.log("Not Allowed");
    // @ts-ignore
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber =
      countryCode?.replace(/\s/g, "") + phone.replace(/\s/g, "");
    const { findUser } = fetchServices;
    const data = await findUser({ wallet: phoneNumber });
    setUserExists(data.present);
    if (data?.present) {
      setName(data?.name);
    }
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        // @ts-ignore
        window.confirmationResult = confirmationResult;
        setIsOTPSent(true);
        setSubmitBtnText("Verify OTP");
      })
      .catch((error) => {
        console.log(error);
        // Error; SMS not sent
        alert("Error: SMS Not sent");
        setSubmitBtnText("Send OTP");
      });

    // handleClose();
  }

  async function loginHandler(user: any) {
    try {
      const { loginUser } = postServices;
      const res = await loginUser(String(user.phoneNumber), String(name));

      if (res?.data?.token) {
        localStorage.setItem(AUTH_TOKEN, res.data.token);
        setToken(res.data.token);
        if (onSuccessfullLogin) onSuccessfullLogin();
        else window.location.reload();
      }
    } catch (error) {
      console.log("ERROR_LOGIN", error);
    }
  }

  function handleCheckOTP() {
    if (!otp) return alert("Please enter OTP");
    if (otp.length !== 6) return alert("OTP muust be 6 digits long");
    // @ts-ignore
    if (!window.confirmationResult) return alert("Some error occured");
    setSubmitBtnText("Verifying OTP...");
    // @ts-ignore
    window.confirmationResult
      .confirm(otp)
      .then((result: any) => {
        // User signed in successfully.
        const user = result.user;
        console.log({ user });
        setCurrentUser(user);

        loginHandler(user);

        //LGIN CODE HERE
        setIsOTPSent(false);
        handleClose();
      })
      .catch((error: any) => {
        setSubmitBtnText("Verify OTP");
        alert("Some error occured");
      });
  }

  function handleClickOutSide(e: any) {
    handleClose();
  }

  let countryCodes = COUNTRY_CODES.map((i) => (
    <option key={i.name}>
      {i.name.substr(0, 3)} {i.code}
    </option>
  ));

  return (
    <ModalContainer onClick={handleClickOutSide}>
      <div className="voxWrapper" onClick={(e) => e.stopPropagation()}>
        <div className="headModal">
          <h3>Sign in to proceed</h3>
          {/* <p>Some subheading here...</p> */}
        </div>
        <div id="sign-in-button" style={{ visibility: "hidden" }}></div>
        <form onSubmit={handleSubmit} ref={formRef}>
          {!isOTPSent && (
            <div className="phoneInput">
              {/* <input
                placeholder="+91"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                type="text"
                required
              /> */}
              <select
                defaultValue={"Ind +91"}
                // value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value?.slice(4));
                  console.log(e.target.value?.slice(4));
                }}
                required
              >
                {countryCodes}
              </select>
              {/* <label htmlFor="phone" className="_userInput">
                <span>Your Phone Number</span> */}
              <input
                id="phone"
                type="number"
                name="phone"
                value={phone}
                placeholder="98xxxxxxxx"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {/* </label> */}
            </div>
          )}
          {isOTPSent && (
            <>
              {!userExists && (
                <label className="_userInput">
                  <span>Your Name</span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              )}
              <label className="_userInput">
                <span>Enter OTP</span>
                <input
                  type="number"
                  name="otp"
                  value={otp}
                  placeholder="xxxxxx"
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </label>
            </>
          )}
          <Button
            textColor="white"
            bgColor="
rgba(232, 162, 55, 1)"
            onClick={() => {
              // submit form using formRef
              if (formRef) {
                formRef?.current?.dispatchEvent(
                  new Event("submit", { bubbles: true })
                );
              }
            }}
            fullWidth
          >
            {submitBtnText}
          </Button>
        </form>
      </div>
    </ModalContainer>
  );
};

export default AuthModal;

const ModalContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000081;

  .voxWrapper {
    background: #f5ebe9;
    border: 1px solid #000000;
    border-radius: 18px;
    padding: 32px 24px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: fadeIn 0.3s ease-in-out;
  }

  .headModal {
    gap: 5px;
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 24px;
      font-weight: 700;
    }
    p {
      font-size: 14px;
      font-weight: 350;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
        top: 0;
      }
      100% {
        opacity: 1;
        top: 50%;
      }
    }
  }
  ._userInput {
    ${mixins.flexCol};
    gap: 0.5rem;
    margin: 1rem 0;
    width: 100%;
    input {
      padding: 0.5rem;
      font-size: var(--fs-s);
      border: 1px solid var(--color-primary);
      ${"" /* border-radius: 0.5rem; */}
      width: 100%;
      cursor: text;
    }
    span {
      font-size: 1rem;
    }
  }
  .phoneInput {
    display: flex;
    aligin-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
    select {
      width: 50%;
      font-size: var(--fs-s);
      position: relative;
      options {
        position: absolute;
        bottom: 100%;
      }
    }
    input {
      padding: 0.5rem;
      font-size: var(--fs-s);
      border: 1px solid var(--color-primary);
      ${"" /* border-radius: 0.5rem; */}
      width: 100%;
      cursor: text;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    > div {
      cursor: pointer;
    }
  }
`;
