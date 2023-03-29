import * as React from "react";


type props = {
  prop: any;
  promo: any;
  
};

const Promotion = (props: any) => {
  //const { image,map} = props;  
//console.log(props,"promo");
  
  return (
    <>
   <div className="relative mt-[60px]">
        <img className="h-[600px] w-full" src={props.promo.image.url} alt=""/>
        <div className="absolute top-0 max-w-[500px] text-white lg:ml-[291px] lg:mt-[50px] sm:ml-5 sm:mt-10">
            <h3 className="sm:text-xl lg:text-[34px] font-medium lg:pb-10 sm:pb-5">{props.promo.title}</h3>
            <p className="lg:pb-10 sm:pb-5 sm:text-sm lg:text-base">
              {props.promo.description}</p>
              {props.promo.moreProducts.link  && (
            <button className="lg:px-5 lg:py-2 sm:px-3 sm:py-1 bg-black text-white border border-white">
              <a href={props.promo.moreProducts.link}>{props.promo.moreProducts.label}</a></button>
              )}
        </div>
    </div>
    </>
  );
};

export default Promotion;

  