import * as React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
var style = {
  width: "310px",
  height: "310px",
};

/**
 * For category section with image, title & link
 * @param props 
 * @returns 
 */
const PhotoSlider = (props: any) => {
  //console.log(props,"photo");
  const { photos, height, width,photoGalleryTitle} = props;  
  const photo = photos?.map((element:any) => (     
   <div className="relative inline-block">
       <img className="max-h-[25.188rem] w-full" src={element?.image?.url} alt=""/>
       { element?.clickthroughUrl &&
       <a href={element?.clickthroughUrl}><span className="absolute bottom-0 left-0 right-0 text-center text-[18px] pb-4"> {element?.description}</span></a>
}
{ !element?.clickthroughUrl &&
       <span className="absolute bottom-0 left-0 right-0 text-center text-[18px] pb-4"> {element?.description}</span>
}
   </div>
    
  ));
 
  return (
    <>
    <div className="Categories mt-[60px]">
    <h2 className="text-[34px] text-center">{photoGalleryTitle}</h2>
    <div className="pt-[30px] grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5">
	  
          {photo}
   
      </div>
      </div>
    </>
  );
};

export default PhotoSlider;

