import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import Button from "../../components/Button/Button";
import ChirpCard from "../../components/ChirpCard";
import Loader from "../../components/Loader";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";
import { fetchServices, postServices } from "../../util/services";
import Compressor from "compressorjs";
import sendIcon from "../../assets/icons/send.svg";
import loadingIcon from "../../assets/icons/loading.svg";
import { useAuthContext } from "../../context/auth.context";
const ImgUpload = ({ src, onChange }) => {
  return (
    <ImgUploadCtr>
      <label className="_custom-file-upload">
        <div className="_img-wrap _img-upload">
          {src && src !== "null" && src !== "undefined" ? (
            <img src={src} alt="" />
          ) : (
            <div className="img_placeholder">
              <img src={assets.icons.gallery} alt="" />
            </div>
          )}
        </div>
        <input
          id="photo-upload"
          type="file"
          onChange={onChange}
          accept="image/x-png,image/gif,image/jpeg,image/webp"
        />
      </label>
    </ImgUploadCtr>
  );
};
const ImgUploadCtr = styled.div`
  gap: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  input {
    pointer-events: none !important;
  }
  ._custom-file-upload {
    border-radius: 100%;
    display: inline-block;
    position: relative;
    cursor: pointer;
  }
  .img_placeholder {
    color: grey;
    display: grid;
    place-items: center;
    gap: 0.5rem;
    text-align: center;
  }
  ._img-wrap {
    height: 30px;
    width: 30px;
    background: var(--bg-color);
    overflow: hidden;
    display: grid;
    place-items: center;
    border-radius: 100%;

    img {
      object-position: center;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
`;

const Chirps = ({ height }) => {
  const { userDetails } = useAuthContext();
  const { setCurrentPageTitle, setCustomBackHeaderLink } = useGlobalState();
  const chirpText = useRef();
  const [photo, setPhoto] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const { eventID } = useParams();
  const [chirps, setChirps] = useState([]);
  const { isLoading: loadingChirps, refetch: refetch } = useQuery({
    queryKey: ["fetchAllChurpsForChirpPage"],
    queryFn: async () => fetchServices.fetchAllChirps(eventID),
    enabled: eventID ? true : false,
    refetchInterval: false,
    refetchOnWindowFocus: true,
    onSuccess: (res) => {
      console.log(res);
      setChirps(res);
    },
  });

  const { isLoading: uploadingChirp, mutate: uploadChirp } = useMutation(
    postServices.uploadChirp,
    {
      onSuccess: (res) => {
        refetch();

        setPhoto(null);
        setPreviewURL(null);
        chirpText.current.value = "";
        // toast.success("Note Uploaded Successfully !");
      },
      onError: (err) => {
        toast.error("Note Uploaded Failure !");
      },
    }
  );
  const photoUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file !== undefined) {
      new Compressor(file, {
        quality: 0.8,
        success: (compressedResult) => {
          setCompressedPhoto(compressedResult);
        },
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(file);
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    if (photo) formData.append("image", compressedPhoto);
    formData.append("text", chirpText.current.value);
    formData.append("event", eventID);
    await uploadChirp({ formData: formData, eventID: eventID });

    setChirps((prev) => [
      ...prev,
      {
        createdAt: new Date(),
        event: eventID,
        image: "false",
        name: userDetails?.name,
        text: chirpText.current.value,
        updatedAt: new Date(),
        wallet: userDetails?.wallet,
      },
    ]);
  };

  React.useEffect(() => {
    if (window.location.pathname.startsWith("/chirps")) {
      setCurrentPageTitle("Chirps");
      setCustomBackHeaderLink(null);
    }
  }, [setCurrentPageTitle, setCustomBackHeaderLink]);

  return (
    <ChirpsCtr height={height}>
      <form className="_chirpForm" onSubmit={onSubmit}>
        <div className="_chirpInput">
          <input
            type="text"
            placeholder="Add your note"
            required
            ref={chirpText}
          />
          <ImgUpload onChange={photoUpload} src={previewURL} />
          <Button bgColor="transparent" className="_submitBtn" type="submit">
            {uploadingChirp ? (
              <img
                src={loadingIcon}
                height={25}
                width={25}
                alt="waiting"
                className="waitingIcon"
              />
            ) : (
              <img src={sendIcon} height={25} width={25} alt="submit" />
            )}
          </Button>
        </div>
      </form>
      {!loadingChirps ? (
        <div className="_allChirps">
          {chirps?.length > 0 &&
            chirps?.map((chirp, idx) => (
              <ChirpCard
                chirp={chirp}
                key={idx + chirp._id}
                bgColor={
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
              />
            ))}
          {chirps?.length === 0 && (
            <div className="_noChirpsFound">
              <div className="_placeholder">
                <img src={assets.overlays.imgPlaceholder2} alt="" />
              </div>
              <p>Be the first one to post !</p>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </ChirpsCtr>
  );
};

const ChirpsCtr = styled.div`
  &{
    padding-bottom: 1rem;
  }
  ._allChirps {
    max-height: ${(props) => props.height};
    margin-top: 1rem;
    ${mixins.flexCol};
    gap: 1rem;
    overflow:auto;
  }
  ._chirpForm {
    width: 100%;
    ${mixins.flexColCenter}
  }
  ._chirpInput {
    width: 100%;
    border: 1px solid var(--color-primary);

    padding: 0.35rem 0.5rem;
    ${mixins.flexRowCenter}
    font-size: var(--fs-s);
    gap: 0.75rem;

    input {
      width: 100%;
      border: none;
      background: none;
      outline: none;
    }
  }
  ._submitBtn {
    ${"" /* width: 100px; */}
    font-size: 0.7rem;
    width: 100px !important;
    background: var(--color-purple);
    color: var(--color-primary);  
  }
    ._noChirpsFound {
    border: 1px solid var(--color-primary);
    padding: 1rem;
    background-size: cover;
    ${mixins.flexRowCenter}
    gap:1rem;
    cursor: pointer;
    font-size: var(--fs-r2);
    ._placeholder {
      width: 50px;
    }
    .waitingIcon{
      animation: rotate 1s linear infinite;
    }
    @keyframes rotate {
      0%{
        transform: rotate(0deg);
      }
      50%{
        transform: rotate(180deg);
      }
      100%{
        transform: rotate(360deg);
      }
    }
`;
export default Chirps;
