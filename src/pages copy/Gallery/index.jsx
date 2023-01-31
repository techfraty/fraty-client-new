import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import assets from "../../assets";
import AppBtn from "../../components/common/Btn";
import EventImageCard from "../../components/EventImageCard";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../context/auth.context";
import { useGlobalState } from "../../context/global.context";
import { fetchServices, postServices } from "../../util/services";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Compressor from "compressorjs";

const ImgUpload = ({ src, onChange }) => {
  return (
    <ImgUploadCtr>
      <label className="_custom-file-upload">
        <div className="_img-wrap _img-upload">
          {src && src !== "null" && src !== "undefined" ? (
            <img src={src} alt="" />
          ) : (
            <div className="img_placeholder">
              <img src={assets.overlays.imgPlaceholder} alt="" />
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
  overflow: hidden;
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
    height: 100px;
    background: var(--bg-color);
    overflow: hidden;
    display: grid;
    place-items: center;

    img {
      object-position: center;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
`;

const GalleryPage = () => {
  const { setCurrentPageTitle, setCustomBackHeaderLink } = useGlobalState();
  const { eventID } = useParams();
  const { userDetails } = useAuthContext();
  const [photo, setPhoto] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [lightBoxIdx, setLightBoxIdx] = useState(0);
  const [lightBoxToggler, setLightBoxToggler] = useState(false);

  const { isLoading: loadingImages } = useQuery({
    queryKey: ["fetchAllImagesforGallery"],
    queryFn: async () => fetchServices.fetchAllImages(eventID),
    onSuccess: (data) => setEventImages(data),
    enabled: eventID ? true : false,
    refetchInterval: 10000,
  });

  useEffect(() => {
    setCustomBackHeaderLink(null);
  }, [eventID, setCustomBackHeaderLink]);

  const { isLoading: uploadingPhoto, mutate: uploadUserPhoto } = useMutation(
    postServices.uploadPhoto,
    {
      onSuccess: (res) => {
        setPhoto(null);
        setPreviewURL(null);
        toast.success("Photo Uploaded Successfully!");
      },
      onError: (err) => {
        toast.error("Photo Uploaded Failure !");
      },
    }
  );

  const photoUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file !== undefined) {
      new Compressor(file, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
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

  const uploadPhoto = async () => {
    if (!compressedPhoto) return toast.error("Please select a photo to upload");

    const formData = new FormData();
    // Update the formData object
    formData.append("image", compressedPhoto);
    formData.append("event", eventID);
    formData.append("wallet", userDetails?.wallet);
    uploadUserPhoto({ formData: formData, eventID: eventID });
  };
  React.useEffect(() => {
    setCurrentPageTitle("Gallery");
  }, [setCurrentPageTitle]);

  return (
    <GalleryPageCtr>
      {loadingImages ? (
        <Loader />
      ) : (
        <div className="_images">
          <div className="_imgUpload">
            <ImgUpload onChange={photoUpload} src={previewURL} />
            {photo && (
              <AppBtn
                className="_uploadBtn"
                loading={uploadingPhoto}
                onClick={uploadPhoto}
                fontSize={".7rem"}
                loadingText={"wait..."}
              >
                Upload
              </AppBtn>
            )}
          </div>

          {eventImages.map((img, idx) => (
            <EventImageCard
              imgSrc={img.image}
              key={img._id}
              idx={idx}
              onClickImage={(idx) => {
                setLightBoxToggler(true);
                setLightBoxIdx(idx);
              }}
            />
          ))}
        </div>
      )}
      <Lightbox
        open={lightBoxToggler}
        close={() => setLightBoxToggler(false)}
        index={lightBoxIdx}
        slides={eventImages?.map((img) => ({ src: img.image }))}
      />
    </GalleryPageCtr>
  );
};

const GalleryPageCtr = styled.div`
  ._images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    justify-content: initial;
    flex-wrap: wrap;
  }
  ._imgUpload {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    border: 1px dashed grey;
    button {
      position: absolute;
      border: none;
      padding: 0.25rem;
      bottom: 0;
      width: 100%;
      font-size: 0.7rem;
    }
  }
`;
export default GalleryPage;
