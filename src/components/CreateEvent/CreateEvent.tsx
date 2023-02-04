import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import assets from "../../assets";
import {
  fetchServices,
  patchServices,
  postServices,
} from "../../util/services";
import Gif from "../Gif/Gif";
import { DRAFT_EVENTS, DRAFT_EVENTS_CURRENT } from "../../util/constants";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth.context";
import Header from "../Header";
import Loader from "../Loader";
import Button from "../Button/Button";
import locationIcon from "../../assets/images/icons/location.svg";
import linkIcon from "../../assets/images/icons/link-2.svg";
import rupeeIcon from "../../assets/images/icons/dollar-circle.svg";
import calendarIcon from "../../assets/images/icons/note-text.svg";
import { useRouter } from "next/router";
import { useGlobalState } from "@/context/global.context";
import { NextPage } from "next";

const CreateEvent: NextPage<{ type: string; id: string }> = ({ type, id }) => {
  console.log({ id });
  const [editView, setEditView] = useState(false);
  const {
    setgifPreview,
    gifPreview,
    formData,
    setFormData,
    setSelectedEvent,
    selectedEvent,
    gifView,
    setGifview,
    setCurrentPageTitle,
    setDraftEvents,
  } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [openGIF, setOpenGIF] = useState(false);
  const [paymentInfoPopup, setPaymentInfoPopup] = useState(false);

  const { userDetails, currentUser }: any = useAuthContext();

  useEffect(() => {
    setFormData({});
  }, [setFormData]);

  useEffect(() => {
    if (type === "edit" && Number(id) !== 1) {
      setEditView(true);
      setgifPreview({ images: { downsized: { url: selectedEvent?.image } } });
    } else {
      setEditView(false);
      setFormData({ organizer: userDetails?.name });
      // console.log(selectedEvent,loadingEvent,setSelectedEvent)
    }
    return () => setGifview(false);
  }, [type, id, selectedEvent, userDetails]);

  async function fetchEventDetails() {
    if (!id) return;
    setFormData({});
    setSelectedEvent({});
    if (type !== "edit") return;
    setLoading(true);
    console.log("id", { id });
    const data = await fetchServices.fetchEventDetailsFull({
      eventID: id,
    });
    setSelectedEvent(data?.event);
    setFormData(data?.event);

    let tempData: any = [];
    if (!data?.event) return;
    Object?.entries(data?.event).forEach(([name, value]) =>
      tempData.push({ [name]: value })
    );
    setUseFormValue(tempData);
    setLoading(false);
    return data?.event;
  }
  const {
    register,
    handleSubmit,
    reset: setUseFormValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: async () => await fetchEventDetails() });
  const router = useRouter();
  let formDataStor: any = [];
  useEffect(() => {
    let rawData = window.localStorage.getItem(DRAFT_EVENTS) || "[]";
    formDataStor = JSON.parse(rawData);
  }, []);

  const saveDraftOnServer = async (newDraftEvent: any) => {
    newDraftEvent.createdAt = new Date().toISOString();
    newDraftEvent.publishStatus = "draft";
    newDraftEvent.creator = userDetails?._id;
    if (!newDraftEvent.image) {
      newDraftEvent.image = "l4KibWpBGWchSqCRy";
    }
    return await postServices.formSubmition(newDraftEvent);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (editView) {
      const { updateEvent } = patchServices;
      const EventData = {
        ...formData,
        image: gifPreview?.images?.downsized.url,
      };
      let res = await updateEvent(EventData);
      toast.success("Event updated");
      if (EventData?.publishStatus === "draft") {
        router.replace(`/event/add/publish/${res?.data?.data?._id}`);
        return;
      }
      router.replace(`/event/${res?.data?.data?._id}`);
      return;
    }
    try {
      const EventData = {
        ...getValues(),
        imageurl: gifPreview?.images?.downsized.url,
      };

      setFormData(EventData);
      // Making location opposite because of copy of the button
      let res = await saveDraftOnServer({
        ...EventData,
        showLocation: !EventData.showLocation,
      });
      // console.log(EventData);
      router.replace(`/event/add/publish/${res?.data?.eventId}`);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Request failed");
    }
    setLoading(false);
  };

  // const { isLoading: loadingEvent } = useQuery({
  //   queryKey: ["fetchEventDetailsFull"],
  //   queryFn: async () =>
  //     fetchServices.fetchEventDetailsFull({
  //       eventID: id,
  //     }),
  //   onSuccess: (data) => setSelectedEvent(data.event),
  //   cacheTime: 0,
  // });

  const handleChange = (e: any) => {
    const { id, value, checked } = e.target;
    // console.log(id, value);
    if (id === "waitList" || id === "showLocation") {
      setFormData((prev: any) => ({
        ...prev,
        [id]: checked,
      }));
      setUseFormValue({ [id]: checked });
      return;
    }
    if (id === "costPerPerson") {
      setFormData((prev: any) => ({
        ...prev,
        [id]: parseInt(value),
      }));
      setUseFormValue({ [id]: checked });
      return;
    }
    if (e.target.id === "imageurl") {
      setFormData((prev: any) => ({
        ...prev,
        imageurl: gifPreview?.images?.downsized.url,
      }));
      setUseFormValue({ imageurl: gifPreview?.images?.downsized.url });
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
      setUseFormValue({ [id]: value });
    }
  };

  useEffect(() => {
    if (type === "edit") {
      setCurrentPageTitle("Edit Event");
    } else {
      setCurrentPageTitle("Create Event");
    }
  }, []);

  function handleChangePaymentInfo(e: any) {
    // const { id, value } = e.target;
    // setFormData((prev) => ({
    //   ...prev,
    //   [id]: value,
    // }));
    // setUseFormValue({ [id]: value });
  }

  if (loading) return <Loader></Loader>;

  return (
    <FormContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit, (err, e) => {
            console.log(err, e);
          })(e).catch((err) => console.log(err));
        }}
      >
        <FormInput>
          {editView ? (
            <input
              type="text"
              placeholder="Untitled"
              className="crnterText text-bigger __eventTitle"
              id="name"
              required={true}
              // value={formData?.name}
              {...register("name", {
                onChange: handleChange,
                maxLength: 80,
              })}
            />
          ) : (
            <input
              type="text"
              placeholder="Untitled"
              className="crnterText text-bigger __eventTitle"
              id="name"
              {...register("name", {
                required: true,
                onChange: handleChange,
                maxLength: 80,
              })}
            />
          )}
        </FormInput>
        <GifBox>
          <div className="imgBox">
            <img
              className="imgFixHight"
              src={gifPreview?.images?.downsized.url}
              alt=""
            />
          </div>
          <div className="editBtn" onClick={() => setOpenGIF(true)}>
            <p>Edit Cover</p>
            <img src={assets.icons.edit} alt="" />
          </div>
          <input
            type="text"
            placeholder="gifId"
            className=" text-small"
            hidden
            id="image"
            {...register("image", {
              onChange: handleChange,

              value: gifPreview?.id,
            })}
          />
          <input
            type="text"
            placeholder="gifId"
            className=" text-small"
            hidden
            id="imageurl"
            {...register("imageurl", {
              onChange: handleChange,
              value: gifPreview?.images?.downsized.url,
            })}
          />
          <input
            type="text"
            placeholder="gifId"
            className=" text-small"
            hidden
            id="creator"
            value={currentUser?.id?._id}
            {...register("creator", { onChange: handleChange })}
          />
        </GifBox>
        <div className="twoform __dateTime">
          <FormInput
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Date *</label>
            {editView ? (
              <input
                type="date"
                placeholder="Date & Time TBD"
                id="eventStartDate"
                className=" text-small"
                value={formData?.eventStartDate}
                {...register("eventStartDate", {
                  onChange: handleChange,
                  required: true,
                  maxLength: 100,
                })}
              />
            ) : (
              <input
                type="date"
                placeholder="Date & Time TBD"
                id="eventStartDate"
                className=" text-small"
                {...register("eventStartDate", {
                  onChange: handleChange,
                  required: true,
                  maxLength: 100,
                })}
              />
            )}
          </FormInput>
          <FormInput
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Time *</label>
            {editView ? (
              <input
                type="time"
                placeholder="Date & Time TBD"
                id="eventStartTime"
                className=" text-small"
                value={formData?.eventStartTime}
                {...register("eventStartTime", {
                  onChange: handleChange,
                  required: true,
                  maxLength: 100,
                })}
              />
            ) : (
              <input
                type="time"
                placeholder="Date & Time TBD"
                id="eventStartTime"
                className=" text-small"
                {...register("eventStartTime", {
                  onChange: handleChange,
                  required: true,
                  maxLength: 100,
                })}
              />
            )}
          </FormInput>
        </div>
        <div className="twoform">
          {/* <FormInput>
                            <label>Event End Time</label>
                            <input type="date" placeholder='Date & Time TBD' value={editView ? selectedEvent?.eventEndDate : ""} id='eventEndDate' className=' text-small'{...register("eventEndDate", { onChange: handleChange, required: true, maxLength: 100 })} />
                        </FormInput> */}

          {/* <FormInput>
                            <label>Event End Time</label>
                            <input type="time" placeholder='Date & Time TBD' id='eventEndTime' className=' text-small'{...register("eventEndTime", { onChange: handleChange, required: true, maxLength: 100 })} />
                        </FormInput> */}
        </div>
        <FormInput>
          <div className="_hostedInput">
            <span>Hosted By: </span>
            <input
              placeholder="*"
              type="text"
              className="text-small"
              id="organizer"
              value={formData?.organizer}
              {...register("organizer", {
                onChange: handleChange,
                required: true,
                maxLength: 80,
              })}
            />
          </div>
        </FormInput>
        <FormInput>
          <input
            type="text"
            placeholder="Location name *"
            id="location"
            className=" text-small"
            value={formData?.location}
            {...register("location", {
              onChange: handleChange,
              required: true,
            })}
          />
        </FormInput>
        <FormInput>
          <input
            type="text"
            placeholder="Location link"
            id="locationURL"
            className=" text-small"
            value={formData?.locationURL}
            {...register("locationURL", {
              onChange: handleChange,
              required: false,
            })}
          />
        </FormInput>
        <FormInput>
          <Switchs>
            <label className="switch">
              {/* checked={editView ? selectedEvent?.locationHide : false} */}
              <input
                type="checkbox"
                id="showLocation"
                checked={formData?.showLocation}
                {...register("showLocation", { onChange: handleChange })}
              />
              <span className="slider round"></span>
            </label>
            <p style={{ fontSize: "14px" }}>Hide location until RSVP?</p>
          </Switchs>
        </FormInput>
        <FormInput>
          <textarea
            placeholder="What’s the party for? *"
            className=" text-small"
            id="description"
            value={formData?.description}
            {...register("description", {
              onChange: handleChange,
              required: true,
            })}
          />
        </FormInput>
        {/* <FormInput>
          <input
            type="number"
            placeholder="Max Capacity"
            className=" text-small"
            id="maxCapacity"
            value={formData?.maxCapacity}
            {...register("maxCapacity", {
              onChange: handleChange,
              required: true,
              maxLength: 12,
            })}
          />
        </FormInput> */}
        <FormInput>
          <Switchs>
            <label className="switch">
              {/* checked={editView ? selectedEvent?.waitList : false} */}
              <input
                type="checkbox"
                id="waitList"
                checked={formData?.waitList}
                {...register("waitList", { onChange: handleChange })}
              />
              <span className="slider round"></span>
            </label>
            <p style={{ fontSize: "14px" }}>Waiting room </p>
          </Switchs>
        </FormInput>
        <FormInput>
          <input
            type="number"
            placeholder="Cost per person"
            className="text-small"
            id="costPerPerson"
            value={formData?.costPerPerson}
            {...register("costPerPerson", {
              onChange: handleChange,
              maxLength: 12,
            })}
          />
        </FormInput>
        <FormInput>
          <input
            style={{
              marginBottom: "50px",
            }}
            type="text"
            placeholder="UPI address"
            className="  text-small"
            id="upi"
            onClick={() => setPaymentInfoPopup(true)}
            value={formData?.upi}
            {...register("upi", {
              onChange: handleChange,
              maxLength: 90,
            })}
          />
        </FormInput>
        {/* <FormInput>
          <input
            type="text"
            placeholder="Add External link"
            className=" text-small"
            id="url"
            value={formData?.url}
            {...register("url", {
              onChange: handleChange,
            })}
          />
        </FormInput> */}
        <Button type="submit" fullWidth bgColor="#EA664D" textColor="white">
          Save Details
        </Button>
        {/* <input className="save" type="submit" value="Save Details" /> */}
      </form>
      {openGIF && (
        <GifBottomSheet>
          <Header
            handleBack={() => setOpenGIF(false)}
            pageTitle="Choose Cover"
            customStyle={{
              zIndex: 100,
            }}
          />
          <Gif handleClose={() => setOpenGIF(false)} />
        </GifBottomSheet>
      )}
      {/* {paymentInfoPopup && (
        <PaymentInfoPopup>
          <div className="_payment_header">
            <img src={assets.icons.close} alt="close" />
            <h3>Payment</h3>
          </div>
          <FormInput>
            <label>Cost Per Person</label>
            <input
              type="number"
              placeholder="xxx"
              className="text-small"
              id="costPerPerson"
              value={formData?.costPerPerson}
              {...register("costPerPerson", {
                onChange: handleChange,
                maxLength: 12,
              })}
            />
          </FormInput>
          <div className="_payment_methods">
            <h4>Payment Methods</h4>
            <div className="_methods">
              <PaymentMethod
                icon={assets.icons.gpay}
                name="Google Pay"
                onChange={handleChangePaymentInfo}
              />
              <PaymentMethod
                icon={assets.icons.rayorpay}
                name="Razor Pay"
                onChange={handleChangePaymentInfo}
              />
            </div>
          </div>
        </PaymentInfoPopup>
      )} */}
    </FormContainer>
  );
};

interface PaymentMethodProps {
  icon: string;
  name: string;
  onChange: (e: any) => void;
  value?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  icon,
  name,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="_method" onClick={() => setIsOpen(!isOpen)}>
      <img src={icon} alt={name} />
      <p>{name}</p>
      <img src={assets.icons.arrow} alt="down" />
      <FormInput>
        <input
          type="text"
          placeholder="UPI Address"
          className="text-small"
          id="upi"
          onChange={onChange}
          value={value}
        />
      </FormInput>
    </div>
  );
};

export default CreateEvent;

const GifBottomSheet = styled.div`
  position: fixed;
  left: 0;
  padding: 1rem;
  background: var(--bg-primary);
  z-index: 100;
  width: 100%;
  height: 100vh;
  animation: slideUp 0.2s ease-in-out forwards;

  @keyframes slideUp {
    from {
      top: 100%;
    }
    to {
      top: 0;
    }
  }
`;

const GifBox = styled.div`
  overflow: hidden;
  position: absolute;
  top: 200px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  max-width: var(--max-app-width);

  .imgBox {
    ${"" /* max-width: var(--max-app-width); */}
    height: 400px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .imgFixHight {
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .editBtn {
    background-color: #c6b1e9;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;
    font-size: 14px;
    gap: 4px;
    cursor: pointer;
    border: 1px solid #000000;
  }
`;

const Switchs = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  p {
    font-size: 12px;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .switch input:checked + .slider {
    background-color: #c6b1e9;
  }

  .slider {
    background-color: transparent;
    backdrop-filter: (200px);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background-color: #ccc; */
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border: 1px solid #000000;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: #000000;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  input:checked + .slider {
    /* background-color: #2196F3; */
  }
  input:focus + .slider {
    /* box-shadow: 0 0 1px #2196F3; */
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  .slider.round:before {
    border-radius: 50%;
  }
`;

const FormContainer = styled.div`
  #name::placeholder {
    color: grey;
  }
  .twoform {
    display: flex;
    justify-content: space-between;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .__dateTime {
    margin-top: 480px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .save {
    color: white;
    background: #ea664d;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
    border: none;
    margin-top: 60px;
  }
  @media screen and (max-width: 674px) {
    .save {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 10;
    }
  }
`;
const FormInput = styled.div`
  position: relative;

  &:has(input#upi)::before,
  &:has(input#locationURL)::before {
    height: 25px;
    width: 25px;
    z-index: 2;
    position: absolute;
    top: 7px;
    left: 4px;
    content: "";
    background: url(${linkIcon}) no-repeat;
    background-size: contain;
  }
  &:has(input#location)::before {
    height: 25px;
    width: 25px;
    z-index: 2;
    position: absolute;
    top: 7px;
    left: 4px;
    content: "";
    background: url(${locationIcon}) no-repeat;
    background-size: contain;
  }
  &:has(input#costPerPerson)::before {
    height: 25px;
    width: 25px;
    z-index: 2;
    position: absolute;
    top: 7px;
    left: 4px;
    content: "";
    background: url(${rupeeIcon}) no-repeat;
    background-size: contain;
  }

  &:has(textarea#description)::before {
    height: 25px;
    width: 25px;
    z-index: 2;
    position: absolute;
    top: 10px;
    left: 4px;
    content: "";
    background: url(${calendarIcon}) no-repeat;
    background-size: contain;
  }
  textarea#description,
  input[type="text"],
  input[type="number"] {
    padding-left: 30px;
  }
  label {
    font-size: 16px;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #000000;
    opacity: 1; /* Firefox */
  }
  input {
    border: none;
    outline: none;
    width: 100%;
    border: 1px solid #000000;
    height: 36px;
    background: rgba(245, 235, 233, 0.2);
    backdrop-filter: blur(12px);
    padding: 10px 22px;
    cursor: text;
    font-family: var(--ff-lightfont);
    ::placeholder {
      color: #000000;
      opacity: 1;
      padding: 10px;
    }
  }
  input:focus {
    border: 2px solid var(--color-primary);
    background: #e6d7ff;
  }
  textarea {
    width: 100%;
    border: 1px solid #000000;
    height: 92px;
    background-color: transparent;
    backdrop-filter: blur(12px);
    padding: 10px 22px;
    resize: none;
    cursor: text;
    font-family: var(--ff-lightfont);
    ::placeholder {
      color: #000000;
      opacity: 1;
    }
  }
  .__eventTitle {
    font-family: var(--ff-title);
    padding: 2rem 0.7rem;
  }
  .crnterText {
    text-align: center;
  }
  .text-bigger {
    font-size: 24px;
  }
  .text-small {
    font-size: 16px;
  }
  ._hostedInput {
    height: 36px;
    background: rgba(245, 235, 233, 0.2);
    backdrop-filter: blur(12px);
    padding: 10px 22px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #000000;

    span {
      font-size: 16px;
    }
    > input {
      border: none;
      outline: none;
      flex: 1;
      background: transparent;
      backdrop-filter: none;
      padding: 0;
      margin-left: 10px;
      font-family: var(--ff-buttonFont);
    }
  }
`;

const PaymentInfoPopup = styled.div`
  max-width: var(--max-app-width);
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem;
  z-index: 100;
  animation: slideUp 0.3s ease-in-out;
  background: #fff;

  ._payment_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @keyframes slideUp {
    from {
      bottom: -100%;
    }
    to {
      bottom: 0;
    }
  }
`;
