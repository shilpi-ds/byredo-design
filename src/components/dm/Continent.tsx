import * as React from "react";
import { useState } from 'react';
import { slugify,BaseUrl } from "../../config/globalConfig";
type props = {
  prop: any;

  
};

/**
 * For 
 * @param props 
 * @returns 
 */

const Continent = (props: any) => {
  console.log(props,"childdddddddddd")
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const [section, setSection] = useState(0);
  const [isActive, setIsActive] = useState('continent');

  const handleClick = (e:any) => {
    setSection(e.target.id);
  };


 return (
    <>
    <div className="continent's mt-[30px] flex justify-center mb-[3.75rem]">
     <div className=" w-[640px] h-[470px] relative left-12">
            <h2 className="text-[#141414] text-[40px] relative top-[0.625rem">Find Store</h2>
            <div className="absolute w-[640px] flex flex-col justify-center mt-[2rem] top-2/4 -translate-y-2/4"> 
   { props.child.map((item:any,index:any) => {
      return(
      <>


        <div id={index} className={`flex items-center justify-between pl-4 py-6 drop-shadow-[0_0px_1px_rgba(0,0,0,0.15)] bg-white ${section==index?isActive:''}`} onClick={(e) => {handleClick(e)}} style={{ cursor: "pointer" }}>
         <div  className="flex items-center gap-[16px]" >
         
            <span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="6" fill="#141414" fill-opacity="0.5" />
              </svg>

            </span>
            <p id={index}>{item.name}</p>
          </div>
          <span className="right-0 mr-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.6665 3.33337L13.3332 10L6.6665 16.6667" stroke="#141414" stroke-opacity="0.5"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>

        </div>

     

      </>
      )

       })}
       </div></div>
       <div className="bg-[#F1F6FA] w-[648px] h-[472px] rounded-2xl block mt-[2rem] ">
                {props.child[section].dm_directoryChildren.map((res: any, index: any) => {
                  
                  return (
                    <>
                      
                      
            <div className="inline-block right-0 mt-[2.5rem] ml-[9rem]">
         
              <p className="pt-10">
              <a href={"/" +props.locale +"/" +props.child[section].slug +"/" +res.slug +".html"}>
                {regionNames.of(res.name)}
                </a></p>
            </div>

            
                 <div className="all-cities flex gap-x-12">  
                   {res.dm_directoryChildren.map((ress: any, index: any) => {
                  
                    return (
                      <>
                        
                        
              <div className="city">
           
                <p className="pt-10">
                <a href={"/" +props.locale +"/" +props.child[section].slug+"/"+res.slug +"/" +ress.slug +".html"}>
                  {ress.name}
                  <sup className="ml-0.5">
              {ress.dm_baseEntityCount ? ress.dm_baseEntityCount : ""}
            </sup>
                  </a></p>
              </div>
            
              
                      </>
                    );
                  })} 
                 
                  </div>
                   </>
                  );
                })}

  </div>
          
           </div>
    </>
  );
};

export default Continent;

  