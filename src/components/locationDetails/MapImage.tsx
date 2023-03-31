import * as React from "react";
import CustomMap from "./CustomMap";

type props = {
  prop: any;
  coords: any;
  address: any;
  image:any;
};

const MapImage = (props: any) => {
  //const { image,map} = props;  
  
  return (
    <>
      <div className="lg:flex lg:justify-between mt-[60px]">
        <div className="lg:w-[50%] sm:mb-5">
        <img src={props.image.image.url} alt=""/>
        </div>
        <div className="lg:w-[49%]">
        <CustomMap prop={props.coords} />
        </div>
    </div>
    </>
  );
};

export default MapImage;

