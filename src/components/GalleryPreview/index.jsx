import React, { useEffect } from "react";
import styled from "styled-components";
import assets from "../../assets";
import { mixins } from "../../styles/global.theme";
import EventImageCard from "../EventImageCard";
import { useRouter } from "next/router";
import Image from "next/image";

const GalleryPreview = ({ images, eventID, onClickImage }) => {
  const [top4Images, setTop4Images] = React.useState([]);

  useEffect(() => {
    if (images?.length) setTop4Images(images.filter((_, idx) => idx < 3));
  }, [images]);

  const navigate = useRouter();
  const openGallery = () => {
    navigate.push(`/gallery/${eventID}`);
  };

  return (
    <GalleryPreviewCtr>
      <div className="_header">
        <h3 className="_label">Gallery</h3>
        <span className="_link" onClick={openGallery}>
          See all photos
        </span>
      </div>
      {top4Images.length > 0 ? (
        <div className="_images">
          {images?.map((img, idx) => (
            <EventImageCard
              onClickImage={onClickImage}
              idx={idx}
              imgSrc={img.image}
              key={img._id}
            />
          ))}
        </div>
      ) : (
        <div className="_noPostsFound" onClick={openGallery}>
          <div className="_placeholder">
            <Image
              height={50}
              width={50}
              src={assets.overlays.imgPlaceholder2}
              alt=""
            />
          </div>
          <p>Be the first one to post !</p>
        </div>
      )}
    </GalleryPreviewCtr>
  );
};

const GalleryPreviewCtr = styled.div`
  width: 100%;
  ${mixins.flexCol};
  gap: 1rem;
  margin: 30px 0px;
  ._header {
    ${mixins.flexRowCenter}
    justify-content: space-between;
    ._label {
      font-family: var(--ff-buttonFont);
      font-size: var(--fs-r2);
    }
    ._link {
      font-size: var(--fs-s);
      cursor: pointer;
    }
  }
  ._images {
    display: flex;
    flex-direction: row;
    flex-basis: 100px;
    overflow: hidden;
    gap: 1rem;
    overflow-x: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge add Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none; /* Firefox */
  }
  ._noPostsFound {
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
  }
`;
export default GalleryPreview;
