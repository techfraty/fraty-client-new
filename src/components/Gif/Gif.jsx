import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { fetchServices } from "../../util/services";
import { postServices } from "../../util/services";
import Loader from "../Loader";
import Button from "../Button/Button";
import { useAuthContext } from "../../context/auth.context";
import { useGlobalState } from "@/context/global.context";
import AppBtn from "../common/Btn";
import { useQuery } from "@tanstack/react-query";

const Gif = ({ handleClose }) => {
  const [trending, setTrending] = useState({});
  const { setgifPreview, setGifview, setCurrentPageTitle } = useGlobalState();
  const [tab, setTab] = useState("gif");
  const [loading, setLoading] = useState();
  const { userDetails, setUserDetails } = useAuthContext();

  const { isLoading: loadingifs } = useQuery({
    queryKey: ["fetchTopgifs"],
    queryFn: async () => fetchServices.fetchTopgifs(),
    onSuccess: (data) => setTrending(data.data),
    cacheTime: 0, //disabled cache for every new response
  });

  const searchGif = async (event) => {
    await fetchServices
      .fetchgifsBySerach(event.target.value)
      .then((response) => {
        setTrending(response.data);
      });
  };

  const uploadHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);

    uploadPhoto(file);
  };

  const uploadPhoto = async (photo) => {
    const formData = new FormData();
    formData.append("image", photo);
    setLoading(true);
    const url = await postServices.uploadCoverImage(formData);
    let prevUploaded = userDetails.uploadedCoverImages || [];
    setUserDetails({
      ...userDetails,
      uploadedCoverImages: [...prevUploaded, url],
    });
    setLoading(false);
    setgifPreview({
      images: {
        downsized: {
          url,
        },
      },
    });
    // console.log(gi)
    if (handleClose) handleClose();
    // navigate("/createparty/add/1");
  };

  // useEffect(() => {
  //   setCurrentPageTitle("Choose Cover");
  // }, []);
  if (loading) return <Loader />;
  return (
    <>
      {loadingifs ? (
        <Loader />
      ) : (
        <ChooseImg>
          <div className="search" style={{ marginBottom: "15px" }}>
            <input type="text" onChange={searchGif} placeholder="Search" />
          </div>
          <div className="btns">
            <div className="left">
              <Buttons>
                <AppBtn
                  square={false}
                  onClick={() => setTab("gif")}
                  btnBG={tab === "gif" ? "#E8A237" : "transparent"}
                  fontSize={"16px"}
                  fontWeight={tab === "gif" ? "700" : "400"}
                >
                  {/* <Button name={"Upcoming"} path="/" /> */}
                  GIFs
                </AppBtn>
                <AppBtn
                  square={false}
                  onClick={() => setTab("photos")}
                  btnBG={tab === "photos" ? "#E8A237" : "transparent"}
                  fontSize={"16px"}
                  fontWeight={tab === "photos" ? "700" : "400"}
                >
                  {/* <Button name={"Upcoming"} path="/" /> */}
                  Photos
                </AppBtn>
                {/* <div className="bottom"></div> */}
              </Buttons>
            </div>
            <div className="right">
              <div>
                <AppBtn square={true} btnBG="#EA664D" fontWeight={"700"}>
                  <span className="up">Upload +</span>
                  <label>
                    <input
                      id="photo-upload"
                      type="file"
                      onChange={uploadHandler}
                      accept="image/x-png,image/gif,image/jpeg,image/webp"
                    />
                  </label>
                </AppBtn>
              </div>
            </div>
          </div>

          <>
            <div className="imageContainer">
              {tab === "gif"
                ? !loadingifs &&
                  Object.values(trending).map((gif, idx) => (
                    <div
                      className="imgCard"
                      onClick={() => {
                        setgifPreview(gif);
                        setGifview(false);
                        if (handleClose) handleClose();
                      }}
                    >
                      <img src={gif.images.preview_gif.url} alt="" />
                    </div>
                  ))
                : userDetails?.uploadedCoverImages?.map((img, idx) => (
                    <div
                      className="imgCard"
                      onClick={() => {
                        setgifPreview({
                          images: {
                            downsized: {
                              url: img,
                            },
                          },
                        });
                        setGifview(false);
                        if (handleClose) handleClose();
                      }}
                    >
                      <img src={img} alt="" />
                    </div>
                  ))}
            </div>
          </>
        </ChooseImg>
      )}
    </>
  );
};

export default Gif;

const ChooseImg = styled.div`
  max-width: var(--max-app-width);
  margin: 0 auto;
  z-index: 100;

  .search {
    margin-top: 25px;
    font-size: 16px;

    input {
      width: 100%;
      height: 36px;
      padding: 0 20px;
      border: 1px solid #000000;

      background: #f5ebe9;
    }
  }

  .btns {
    display: flex;
    justify-content: space-between;
  }
  .left {
    flex: 1;
  }
  .up {
    font-size: 16px;
    padding: 0 10px;
  }
  .right {
    input {
      min-width: 0;
    }
  }
  .imageContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 16px;
    margin-top: 35px;
    height: calc(100vh - 300px);
    overflow-y: auto;
  }
  .imgCard {
    width: 100%;
    border: 1px solid #000000;
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    height: 200px;

    &:hover {
      transform: scale(1.02);
    }
    img {
      height: 100%;
      width: 100%;
    }
  }
`;

const Buttons = styled.div`
  width: max-content;
  position: relative;
  ${"" /* cursor: pointer; */}
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  ${
    "" /* 
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
    background-color: rgba(232, 162, 55, 1);
  } */
  }/* .btn-file {
  position: relative;
  overflow: hidden;
}
.btn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  background: white;
  cursor: inherit;
  display: block;
} */
`;
