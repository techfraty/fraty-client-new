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
import { Button, Space, Upload } from "antd";
import "antd/dist/reset.css";
import { abort } from "process";
const ImgUpload = ({ src, onChange, fileList }) => {
  return (
    <ImgUploadCtr>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
        size="large"
      >
        <Upload
          customRequest={(e) => {
            console.log(e);
            e.onSuccess("ok");
            return true;
          }}
          listType="picture"
          maxCount={3}
          multiple
          className="upload"
          fileList={fileList}
          onChange={(e) => {
            console.log(e.fileList);
            // let temp = [];
            // e.fileList.forEach((file) => {
            //   temp.push(file.originFileObj);
            // });
            // onChange(temp);
            onChange(e.fileList);
          }}
        >
          <Button icon={<img src={assets.overlays.imgPlaceholder} alt="" />}>
            Upload Image(s)
          </Button>
        </Upload>
      </Space>
    </ImgUploadCtr>
  );
};
const ImgUploadCtr = styled.div`
  margin-bottom: 15px;
  .upload {
    button {
      color: black;
      border: none;
      outline: none;
      background: transparent;
      height: 100px;
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        color: black;
      }
      img {
        height: 100%;
      }
    }
  }
`;

const GalleryPage = () => {
  const { setCurrentPageTitle, setCustomBackHeaderLink } = useGlobalState();
  const { eventID } = useParams();
  const { userDetails } = useAuthContext();
  const [photos, setPhotos] = useState([]);
  const [compressedPhotos, setCompressedPhotos] = useState([]);
  const [uploading, setuploading] = useState(false);
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

  // const { isLoading: uploadingPhoto, mutate: uploadUserPhoto } = useMutation(
  //   postServices.uploadPhoto,
  //   {
  //     onSuccess: (res) => {
  //       setPhoto(null);
  //       setPreviewURL(null);
  //       toast.success("Photo Uploaded Successfully!");
  //     },
  //     onError: (err) => {
  //       toast.error("Photo Uploaded Failure !");
  //     },
  //   }
  // );

  const photoUpload = (files) => {
    // const file = e.target.files[0];
    // if (file !== undefined) {
    //   new Compressor(file, {
    //     quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
    //     success: (compressedResult) => {
    //       // compressedResult has the compressed file.
    //       // Use the compressed file to upload the images to your server.
    //       setCompressedPhoto(compressedResult);
    //     },
    //   });
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setPhoto(file);
    //     setPreviewURL(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
    setPhotos(files);
    console.log(files, compressedPhotos);
    setCompressedPhotos([]);
    const onlyImage = [];
    files.forEach((file) => {
      onlyImage.push(file.originFileObj);
    });
    onlyImage.forEach((file) => {
      console.log("in file");
      if (file !== undefined) {
        new Compressor(file, {
          quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            console.log(compressedResult);
            // compressedResult has the compressed file.
            // Use the compressed file to upload the images to your server.
            console.log(compressedPhotos);
            if (
              compressedPhotos.findIndex(
                (e) => e.name === compressedResult.name
              ) === -1
            )
              setCompressedPhotos((prev) => [...prev, compressedResult]);
          },
        });
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //   // setPhoto(file);
        //   setPreviewURL(reader.result);
        // };
        // reader.readAsDataURL(file);
      }
    });
  };

  React.useEffect(() => {
    setCurrentPageTitle("Gallery");
  }, [setCurrentPageTitle]);

  const uploadPhoto = () => {
    const uniquePhotos = [];
    compressedPhotos.forEach((photo) => {
      if (uniquePhotos.findIndex((e) => e.name === photo.name) === -1)
        uniquePhotos.push(photo);
    });
    if (photos.length === 0 || uniquePhotos.length !== photos.length) return;
    let photoPromises = [];
    setuploading(true);

    new Set(uniquePhotos).forEach((photo) => {
      let formData = new FormData();
      formData.append("image", photo);
      formData.append("event", eventID);
      formData.append("wallet", userDetails?.wallet);
      photoPromises.push(
        postServices.uploadPhoto({ formData: formData, eventID: eventID })
      );
    });
    Promise.all(photoPromises)
      .then((res) => {
        console.log(res);
        setCompressedPhotos([]);
        setPhotos([]);
        setPreviewURL(null);
        toast.success("Photo Uploaded Successfully!");
      })
      .catch((err) => {
        toast.error("Photo Uploaded Failure !");
        console.log(err);
      });
    setuploading(false);
    setCompressedPhotos([]);
    setPhotos([]);
  };
  const uniquePhotos = [];
  compressedPhotos.forEach((photo) => {
    if (uniquePhotos.findIndex((e) => e.name === photo.name) === -1)
      uniquePhotos.push(photo);
  });
  console.log(uniquePhotos, photos);
  return (
    <GalleryPageCtr>
      {loadingImages ? (
        <Loader />
      ) : (
        <div style={{ postion: "relative", width: "100%" }}>
          <ImgUpload
            fileList={photos}
            onChange={photoUpload}
            src={previewURL}
          />
          <div className="button__upload">
            <AppBtn
              square={true}
              btnBG={"#EA664D"}
              disabled={
                photos.length !== uniquePhotos.length || photos.length === 0
              }
              className="_uploadBtn"
              loading={uploading}
              onClick={uploadPhoto}
              fontSize={".7rem"}
              loadingText={"wait..."}
            >
              Upload
            </AppBtn>
          </div>
          <div className="_images">
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
  width: 100%;
  .button__upload {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
  }
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
