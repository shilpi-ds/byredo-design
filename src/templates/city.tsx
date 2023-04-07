import * as React from "react";
import getDirectionUrl from "../components/commons/GetDirection";
import SearchBar from "../components/dm/SearchBar";
//import constant from "../constant";
import favicon from "../images/favicon.png"
import Header from "../components/layouts/header";
import Footer from "../components/layouts/footer";
import BreadCrumbs from "../components/layouts/BreadCrumb";
import { slugify } from "../config/globalConfig";
import OpenCloseStatus from "../components/commons/OpenCloseStatus";
import { useTranslation } from "react-i18next";
import "../types/i18n.ts";
import {
  AnswerExperienceConfig,
  googleMapsConfig,
  defaultTimeZone,
  GoogleSearchConsole,
  BaseUrl,
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
} from "../config/globalConfig";

import "../index.css";
var currentUrl = "";
import {
  Template,
  GetPath,
  GetRedirects,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import loc3 from "../images/loc3.svg";
import loc1 from "../images/loc1.svg";
import loc2 from "../images/loc2.svg";


import { JsonLd } from "react-schemaorg";
import Address from "../components/commons/Address";


import { Link } from "@yext/pages/components";
var currentUrl = "";
export const config: TemplateConfig = {
  stream: {
    $id: "city",
    filter: {
      entityTypes: ["ce_city"],
      
    },
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",
      "address",
      // "dm_directoryParents.name",
      // "dm_directoryParents.slug",
      // "dm_directoryParents.meta.entityType",
      // "dm_directoryChildren.name",
      
      "dm_directoryParents.name",
      "dm_directoryParents.slug",
      "dm_directoryParents.meta.entityType",
      "dm_directoryParents.dm_directoryParents.name",
      "dm_directoryParents.dm_directoryParents.slug",
      "dm_directoryParents.dm_directoryParents.meta.entityType",
      /* DM children */
      "dm_directoryChildren.name",
      //"dm_directoryChildren.slug",
      "dm_directoryChildren.meta.entityType",
     // "dm_directoryChildren.dm_baseEntityCount",
      /* DM children->children */
      "dm_directoryChildren.dm_directoryChildren.dm_baseEntityCount",
      "dm_directoryChildren.dm_directoryChildren.slug",
      "dm_directoryChildren.dm_directoryChildren.name",
      "dm_directoryChildren.dm_directoryChildren.id",
      "dm_directoryChildren.dm_directoryChildren.dm_directoryChildren.dm_baseEntityCount",


      "dm_directoryChildren.mainPhone",
      "dm_directoryChildren.slug",
      "dm_directoryChildren.id",
      "dm_directoryChildren.dm_baseEntityCount",
      "dm_directoryChildren.address",
      "dm_directoryChildren.hours",
      "dm_directoryChildren.yextDisplayCoordinate"
    ],
    localization: {
      locales: ["fr-FR", "en_GB", "it-IT", "ja-JP", "de-DE"],
      primary: false,
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  //let uniqueId = generateUniqueId();
  //console.log(document.dm_directoryParents,"dmmmmmmmmmmm");
  if (document.dm_directoryParents) {
      document.dm_directoryParents.map((i: any) => {
          if (i.meta.entityType.id == "ce_root") {
              currentUrl = `${i.slug}/${document.slug.toString()}.html`;
          } else if (i.meta.entityType.id == "ce_country") {
              let url = `${document.dm_directoryParents[1]?.slug}/${i.slug
                  }/${document.slug.toString()}.html`;
              currentUrl = url;
          }
      });
      //console.log(`${document.meta.locale}/${currentUrl}`,"gfgfdgdfg");
      return `${document.meta.locale}/${currentUrl}`;
  } else {
    //console.log(`${document.meta.locale
    //}/${document.slug.toString()}.html`,"aaaaaaaaaaaaa");
      return `${document.meta.locale
          }/${document.slug.toString()}.html`;
  }
  
};



export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  let url = "";
  if (!document.slug) {
    let slugString = document.id + " " + document.name;
    let slug = slugify(slugString);
    url = `${slug}.html`;
  } else {
    url = `${document.slug.toString()}.html`;
  }
  // <meta name="google-site-verification" content="WIqhwAw2ugRAKEYRRqis1ZfUBbnWe_AXSoDltHceCbI" />
  let metaDescription = document.c_metaDescription
    ? document.c_metaDescription
    : `${document.name} | Shop Byredos Collection of Perfumes, Candles, Makeup, Leather And Body Care. Free shipping & Free returns. Complimentary samples.`;
  let metaTitle = document.c_metaTitle
    ? document.c_metaTitle
    : `${document.name} | BYREDO Official Site | Perfumes, Candles & Body Care`;
  return {
    title: metaTitle,
    charset: "UTF-8",
    viewport:
      "width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=0",
    tags: [
      {
        type: "meta",
        attributes: {
          name: GoogleSearchConsole.name,
          content: GoogleSearchConsole.content,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "description",
          content: `${metaDescription}`,
        },
      },
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/png",
          href: favicon,
        },
      },

      {
        type: "meta",
        attributes: {
          name: "author",
          content: "Byredo",
        },
      },
      {
        type: "meta",
        attributes: {
          name: "robots",
          content: `${
            document.c_robotsTag ? document.c_robotsTag : "noindex, nofollow"
          }`,
        },
      },

      {
        type: "link",
        attributes: {
          rel: "canonical",
          href: `${
            document.c_canonical ? document.c_canonical : BaseUrl + "/" + url
          }`,
        },
      },

      //og tag
      {
        type: "meta",
        attributes: {
          property: "og:title",
          content: `${metaTitle}`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:description",
          content: `${metaDescription}`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:url",
          content: BaseUrl + "/" + url,
        },
      },

      {
        type: "meta",
        attributes: {
          property: "og:image",
          content: `${
            document.c_byradoLogo
              ? document.c_byradoLogo.image.url
              : "https://a.mktgcdn.com/p-sandbox/cgYD0VBchE2WzmtcTHsS1MlzQyFCTlbcmgppR7wnNE8/600x120.png"
          }`,
        },
      },
      //twitter tag
      {
        type: "meta",
        attributes: {
          property: "twitter:title",
          content: `${metaTitle}`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:description",
          content: `${metaDescription}`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:card",
          content: "summary",
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:url",
          content: BaseUrl + "/" + url,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:image",
          content: `${
            document.c_byradoLogo
              ? document.c_byradoLogo.image.url
              : "https://a.mktgcdn.com/p-sandbox/cgYD0VBchE2WzmtcTHsS1MlzQyFCTlbcmgppR7wnNE8/600x120.png"
          }`,
        },
      },
    ],
  };
};

const City: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const {
    name,
    slug,
    address,
    dm_directoryParents,
    dm_directoryChildren,
    c_globalData,
    c_canonical,
    c_metaDescription,
    c_metaTitle,
    _site,

  } = document;
 
  const { i18n } = useTranslation();
  i18n.changeLanguage(document.meta.locale);
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  let currentUrl = ""
  const myArray = path.split("/");
  currentUrl = myArray && myArray[1]+"/"+myArray[2]+"/"+myArray[3];
  const updatelocale = (locale: any) => {
    return (window.location.pathname = `${locale}/${currentUrl}`);
  };


  var sortedChildren = dm_directoryChildren?.sort(function (a: any, b: any) {
    var a = a.name;
    var b = b.name;
    return a < b ? -1 : a > b ? 1 : 0;
  });

  let slugString = "";
  document?.dm_directoryParents?.forEach((e: any) => {
    slugString += e.slug + "/";
  });

  const childrenDivs = dm_directoryChildren?.map((entity: any) => {
   // console.log(entity)
    var origin: any = null;
    if (entity?.address?.city) {
      origin = entity?.address?.city;
    } else if (entity?.address?.region) {
      origin = entity?.address?.region;
    } else {
      origin = entity?.address?.country;
    }
    // let key: any = Object.keys(entity.hours)[0];
    var url = "";
    var address=entity?.address;
    var country: any = entity?.address?.countryCode?.toLowerCase();
    var name: any = entity?.name?.toLowerCase();
    var region: any = entity?.address?.region?.toLowerCase();
    var initialregion: any = region?.toString();
    var finalregion: any = initialregion?.replaceAll(" ", "-");
    var city: any = entity?.address?.city?.toLowerCase();
    var initialrcity: any = city?.toString();
    var finalcity: any = initialrcity?.replaceAll(" ", "-");
    
    var string: any = name?.toString();;
    //let result: any = string.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
    let result:any=string?.replace(/\s+/g,"-");
    if (!entity.slug) {
      url = "/" +country + "/" + finalregion + "/" + finalcity +
      "/" +
      entity.id+"-"+result +
      ".html";
    } else {
      url = document.meta.locale +
      "/" +
      entity.slug?.toString() +
      ".html";
    }

   


    return (

      <div className="bg-white shadow-lg box_shadow drop-shadow-md">
                {/* <p className="text-center">Near by stores</p> */}

        <div className="flex justify-between items-center pt-3 ml-4">
            <h5 className="underline underline-offset-8 font-bold"><Link className="inline-block notHighlight" href={BaseUrl+"/"+url}
                data-ya-track={`${entity.name}`}
                eventName={`${entity.name}`}
                rel="noopener noreferrer">{entity.name}</Link></h5>
                {/* {typeof location.distance != "undefined" ? <p className="pr-4 text-xs">{metersToMiles(location.distance)} miles</p>: ''} */}
        </div>

        <div className="flex mt-4 ml-4">
            {/* <img className="h-[25px]" src={loc1} alt=""/> */}
            <div className="add-city"><Address address={entity.address} /></div>
          
        </div>

        <div className="flex mt-4 ml-4">
            {/* <img className="h-[25px]" src={loc2} alt=""/> */}
            <p className="text-sm pl-4"><a  href={`tel:${entity.mainPhone}`}>{entity.mainPhone}</a></p>

        </div>
        {entity.hours?
        <div className="flex mt-4 ml-4">
            {/* <img className="h-[25px]" src={loc3} alt=""/> */}
            <p className="text-sm pl-4"><OpenCloseStatus timezone={entity.timezone} hours={entity.hours} deliveryHours={entity.hours}/></p>
        </div>
        :<div className="closeddot notHighlight red-dot">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
    <circle id="Ellipse_5" data-name="Ellipse 5" cx="4" cy="4" r="4" fill="#ad1e1f"/>
    </svg>
           <div className="hours-info text-lg font-second-main-font closeddot"> 
           Closed
           </div>
           </div>
    }
       <div className="buttons gap-y-[2px] sm:gap-y-2.5 py-5 pr-[2.25rem]">
                        <div className="ctaBtn">
                            <Link
                              className="button before-icon"
                              href={BaseUrl+"/"+url}
                            >
                              VIEW DETAILS
                            </Link>
                          </div>
                          <div className="ctaBtn">
                          <Link
                    data-ya-track="getdirections"
                    eventName={`getdirections`}
                    className="direction button before-icon"
                    onClick={() => getDirectionUrl(entity)}
                    href="javascript:void(0);"
                    rel="noopener noreferrer"
                  //conversionDetails={conversionDetails_direction}
                  >
                    {/* {data.getDirection ? (
                      <>
                        {svgIcons.GetDirection}
                        {data.getDirection}
                      </>
                    ) : (
                      <>{svgIcons.GetDirection}Map & Direction</>
                    )} */}
                  DIRECTIONS
                  </Link>
                          </div>
                        </div>
    </div>

    
  );
  });
 

  var url: any = ""

  document.dm_directoryParents?.map((i: any) => {
    if (i.meta.entityType.id == 'ce_country') {
      url = `${i.slug}`
    }
    else if (i.meta.entityType.id == 'ce_region') {
      url = `${url}/${i.slug}/${document.slug?.toString()}.html`
    }
  })
  let breadcrumbScheme: any = [];
  let currentIndex: any = 0;
  dm_directoryParents &&
    dm_directoryParents?.map((i: any, index: any) => {
      currentIndex = index;
      if (index != 0) {
        breadcrumbScheme.push({
          "@type": "ListItem",
          position: index,
          item: {
            "@id": `${BaseUrl}${i.slug}`,
            name: i.name,
          },
        });
      }
    });

  breadcrumbScheme.push({
    "@type": "ListItem",
    position: currentIndex + 1,
    item: {
      "@id": `${BaseUrl}/${document.slug?.toString()}.html`,
      name: document.name,
    },
  });

  return (
    <>
      <Header
            ByredoLogo={_site.c_byradoLogo}
            ByredoLinks={_site.c_headerMenus}
          />
        {dm_directoryParents ? (
                        <>
                            <BreadCrumbs
                                name={document.name}
                               
                                parents={dm_directoryParents}
                                address={""}
                                locale={document.meta.locale}
                            ></BreadCrumbs>
                        </>
                    ) : (
                        <></>
                    )}
     <div className="search-form">
                            <div className="text-center max-w-[38.125rem] mx-auto relative">
                                <SearchBar
                                    locale={document.meta.locale}
                                    _site={document._site}
                                />
                            </div>
                        </div>

         {/* <BreadCrumbs
          name={name}
          parents={dm_directoryParents}
          address={address}
        ></BreadCrumbs> */}
        <div className="content-list city-page">
          <div className="container mx-auto">
            <div className="sec-title text-center">
              <h2>
              Byredo Stores in {name}
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-start -mx-2.5 lg:-mx-[.9375rem] gap-12">
              {childrenDivs}
            </div>
          </div>
        </div>

        
        <Footer
        footerHelpSection={_site.c_footerHelpSection}
        servicesFooter={_site.c_servicesFooter}
        footerStoreLocator={_site.c_footerStoreLocator}
        customerCare={_site.c_customerCare}
        phone={_site.mainPhone}
        emailAddress={_site.c_emailAddress}
        path={updatelocale}
        _site={_site}
      />
    </>
  );
};
export default City;