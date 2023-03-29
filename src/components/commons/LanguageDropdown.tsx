import * as React from "react";
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
//import "../../types/i18n.tsx";
//import $ from "jquery";
function LocalesDropdown(props: any) {
  //console.log(props,"ggggggggggggg");
  const [language, setLanguage] = useState("");
  const [section, setSection] = useState(0);
  const [locale, setLocale] =useState("");
  let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  const onLanguageChange = (e: any) => 
  {
  setLanguage(e.target.value);
  props.updatelocale(e.target.value);
  };
  const { t, i18n } = useTranslation();


//console.log(props,"site meta")

  const handleClick = (e:any) => {
    setSection(e.target.value);
    setLanguage(props.country[e.target.value].language[0].languageCode);
    console.log(props.country[e.target.value].language[0].languageCode,"locale");
    props.updatelocale(props.country[e.target.value].language[0].languageCode);
  //setLanguage();
   setLocale(e.target[e.target.value].text);
 console.log(locale);

    
  };
  useEffect(()=>{
    
    // console.log(props.country)
   const Result = props.country?.filter((res:any,index:number)=>{
         return  res.language && res.language.map((inr:any)=>{
           if(inr.languageCode === props.site.meta.locale){
           return  res.index = index
           }
        })
      })
    const finalresult =Result && Result.filter((res:any)=>{
      if(res.hasOwnProperty('index')){
       return res
      }
   })
   setSection(finalresult[0].index);
  },[])
  
  //  useEffect(()=>{
    
  //   //setLanguage(props.country[section].language[0].languageCode);
  //   console.log(props);
  //   setLanguage(props.country[section].language[0].languageCode);
  
  //   console.log(props.country[section].language[0].languageCode,"langsssssss");
  
  //   //var language=props.country[section].language[0].languageCode;
  //     console.log(language,"lang");
      
   
  //   //  if(props.country[section].language[0].languageCode!== props.site.meta.locale){
  //   // //console.log(props.country[section].language[0].languageCode)
  //   //   props.updatelocale(props.country[section].language[0].languageCode);
  //   //  }
  //  },[section])

  return (
    <div>
      <form>
      
        <select onChange={(e) =>handleClick(e)}>
        {props.country?.map((e: any,ind:any) => {
         
                  return (
                    
                       <option  value={ind} selected={ind === section}>{e.country}</option>
                    
                  );
                })}

        </select>
        <select onChange={(e)=>onLanguageChange(e)} value={language} className="language" defaultValue={language}>
       
             
                    {props.country[section].language?.map((el: any,indd:number) => {
                        
                          const selected=(props.site.meta.locale === el.languageCode) ? true : false;
                       console.log(props.site.meta.locale,language,"m");
                              return (
                              
                                   <option value={el.languageCode} key={indd} selected={props.site.meta.locale === language}>{el.language}</option>
                                
                              );
                            })}
                           
                           
                  
            
          </select>
      </form>
    </div>
  );
}

export default withTranslation()(LocalesDropdown);


