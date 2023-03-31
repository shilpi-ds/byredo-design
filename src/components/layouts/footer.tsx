import * as React from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";
import LocalesDropdown from "../../components/commons/LanguageDropdown";
import { Link } from "@yext/pages/components";
import { svgIcons } from "../../svg icons/svgIcon";
type props = {
  footerHelpSection: any;
  servicesFooter: any;
  footerStoreLocator: any;
  customerCare: any;
  emailAddress: any;
  path:any;
};

/**
 * @param props 
 * @returns HTML elements of Footer Component
 */

const Footer = (props: any) => {
  const {
    emailAddress,
    footerHelpSection,
    servicesFooter,
    footerStoreLocator,
    customerCare,
    phone,
    path,_site
  } = props;
//console.log(_site);
  return (
    <>
      <div className="subfooter-sec">
        <div className="container-lg">
          <div className="subfooter-inner">
            <div className="subfooter-links">  
              <ul>
              <li><LocalesDropdown updatelocale={path} country={_site.c_countryFooter} site={_site}/></li>
                <li className="text-xl pb-4">{customerCare}</li>
                <li className="location-phone ">
                  <Link
                    className="phone-number"
                    data-ya-track="phone"
                    href={`tel:${phone}`}
                    rel="noopener noreferrer"
                  >
                    {phone}
                  </Link>
                </li>
                {emailAddress?.link && emailAddress?.label && (
                  <li className="location-phone ">               
                    <Link
                      className="link-line-text relative"
                      href={`mailto:${emailAddress.link}`}
                    >
                      {emailAddress.label}
                    </Link>
                  </li>
                )}
              </ul>
              <ul>
                <li className="text-xl pb-4">{footerHelpSection?.helpTitle}</li>
                {footerHelpSection?.helpLinks.map((e: any) => {
                  return (
                    <li>
                      {e?.link && e?.label && (
                        <Link href={e.link}>{e.label}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <ul>
                <li className="text-xl pb-4">
                  {servicesFooter?.servicesTitle}
                </li>
                {servicesFooter?.servicesList?.map((e: any, index: any) => {
                  return (
                    <li key={index}>
                      <span className="pr-3">-</span>
                      {e}
                    </li>
                  );
                })}
              </ul>

              <ul>
                <li className="text-xl pb-4">
                  {footerStoreLocator?.helpTitle}
                </li>
                {footerStoreLocator.helpLinks.map((e: any, index: any) => {
                  return (
                    <li key={index}>
                      {e?.link && e?.label && (
                        <Link href={e.link}>{e.label}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="float-left pt-2">© Byredo</div>
          <Link href="https://www.instagram.com/officialbyredo/" target="_blank" rel="noopener noreferrer">
            <div className="float-right">{svgIcons.instagram}</div>
            </Link>
            <Link href="https://www.facebook.com/byredo/" target="_blank" rel="noopener noreferrer">
            <div className="float-right pr-4">{svgIcons.facebook}</div>
          </Link>
        </div>
      </div>


{/* Cookie Consent Section is for "To keep a user logged in as they browse from page to page." */}
      <CookieConsent
        buttonText={_site.c_cookieButton?.label?_site.c_cookieButton?.label:"Accept all Cookies"}
        buttonStyle={{
          marginLeft: "100px",
        }}>        
        <p>
        {_site.c_cookieText?_site.c_cookieText:"Our site and our partners collect data and use cookies in accordance with our"}

        {_site.c_cookiePolicy?.label && _site.c_cookiePolicy?.link ?
        (
          <Link className="text-cookies-link p-2 font-bold" href={_site.c_cookiePolicy?.link}>
          {_site.c_cookiePolicy?.label}
          </Link>
        ):
        <Link className="text-cookies-link p-2 font-bold" href="https://www.byredo.com/eu_en/cookie-policy">
          cookie policy
          </Link>
}

          {_site.c_cookieTextAfter?_site.c_cookieTextAfter:"to enhance your experience, analyze traffic and for ad personalization and measurement. For more information on this and how to manage your cookies, please click cookie settings below."}
        </p>
      </CookieConsent>
    </>
  );
};
export default Footer;
