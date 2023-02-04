import Image from "next/image";
import React from "react";
import styled from "styled-components";
import assets from "../../assets";

const Loader = () => {
  return (
    <LoaderCtr>
      <Image src={assets.loader} alt="" />
    </LoaderCtr>
  );
};
const LoaderCtr = styled.div`
  width: 200px;
  height: 200px;
  overflow: hidden;
  margin: 2rem auto;
  border-radius: 100%;
`;

export default Loader;
