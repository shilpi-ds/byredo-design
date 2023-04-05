import * as React from "react";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
function LocalesDropdown(props: any) {
  const [language, setLanguage] = useState("");
  const [section, setSection] = useState(0);
  const [locale, setLocale] = useState("");

  /**
   * For language dropdown
   * @param e 
   */
  const onLanguageChange = (e: any) => {
    setLanguage(e.target.value);
    props.updatelocale(e.target.value);
  };

  /**
   * For country dropdown
   * @param e
   */

  const handleClick = (e: any) => {
    setSection(e.target.value);
    //setLanguage(props.country[e.target.value].language[0].languageCode);
    props.updatelocale(props.country[e.target.value].language[0].languageCode);
    //setLocale(e.target[e.target.value].text);
  };
  useEffect(() => {
    console.log(props.country,"props.country")
    const Result = props.country?.filter((res: any, index: number) => {
      return (
        res.language &&
        res.language.map((inr: any) => {
          if (inr.languageCode === props.site.meta.locale) {
            setLanguage(inr.languageCode);
            return (res.index = index);
          }
        })
      );
    });
    const finalresult =
      Result &&
      Result.filter((res: any) => {
        if (res.hasOwnProperty("index")) {
          return res;
        }
      });
    setSection(finalresult[0].index);
  }, []);

/**
 * Return results for country & language dropdown
 */


  return (
    <div>
      <form>
        <select onChange={(e) => handleClick(e)} value={section} defaultValue={section}>
          {props.country?.map((e: any, ind: any) => {
            return (
              <option value={ind} >
                {e.country}
              </option>
            );
          })}
        </select>
        <select
          onChange={(e) => onLanguageChange(e)}
          value={language}
          className="language"
          defaultValue={language}
        >
          {props.country[section].language?.map((el: any, indd: number) => {
            const selected = props.site.meta.locale === el.languageCode ? true : false;
            return (
              <option
                value={el.languageCode}
                key={indd}
               
              >
                {el.language}
              </option>
            );
          })}
        </select>
      </form>
    </div>
  );
}

export default withTranslation()(LocalesDropdown);
