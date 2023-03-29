import * as React from "react";
import { useEffect, useState } from "react";
import "@splidejs/react-splide/css";
import { svgIcons } from "../../svg icons/svgIcon";
import getDirectionUrl from "../commons/GetDirection";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "@yext/pages/components";
import Address from "../commons/Address";
import Phone from "../commons/phone";
import OpenCloseStatus from "../commons/OpenCloseStatus";
import { useTranslation } from 'react-i18next';
import "../../types/i18n";
import useUpdateTranslation from "../../hooks/useUpdateTranslation";
import {slugify, defaultTimeZone } from "../../config/globalConfig";
import {
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";

const metersToMiles = (meters: number) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};

type props = {
  prop: any;
  //parents: any;
  //baseUrl: any;
  coords: any;
  slug: any;
  timezone: any;
  site:any;
  
};

const NearByLocation = (result: props) => {
  const [timezone, setTimeZone] = React.useState("");
  let subtitle: any; 
  const [timeStatus, setTimeStatus] = useState("");
  const onOpenHide = () => {
    if (timeStatus == "") {
      setTimeStatus("active");
    } else {
      setTimeStatus("");
    }
  };
  console.log(result.timezone,"timezone");

  
//console.log(result,"site");
  const [data, setData] = useState([]);
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  
  useEffect(() => {
    let distance: any = [];
    let arr: any = [];
    distance.push(result.prop.response.distances);

    result?.prop?.response?.results?.map((i: any, index: any) => {
      arr.push({
        slug: i.data?.slug,
        address: i.data?.address,
        hours: i.data?.hours,
        mainPhone: i.data?.mainPhone,
        name: i.data?.name,
        yextDisplayCoordinate: i.data?.yextDisplayCoordinate,
        distance: i.distance,
        id: i.data.id,
      });
    });

    setData(arr);
  }, [setData]);
  const { t } = useTranslation();
  return (
    <>
      <div className="nearby-sec">
        <div className="container-lg">
          <div className="w-full text-center">
            <h2 className="sec-title text-center">
              {/* {result.nearByWellPharmaciesTitle
                ? result.nearByWellPharmaciesTitle
                : "Nearby Well Pharmacies"} */}
                 {result.site.c_nearbyLocationsHeading?result.site.c_nearbyLocationsHeading:"Near by Locations"}
            </h2>
          </div>
          <Splide
            id="splide-nearby"
            options={{
              rewind: false,
              type: "slide",
              perPage: 3,
              perMove: 1,
              arrows: false,
              drag: false,
              pagination: false,
              lazyLoad: "nearby",
              breakpoints: {
                1279: {
                  perPage: 2,
                  drag: true,
                  pagination: true,
                  arrows: false,
                  type: "splide",
                },
                766.98: {
                  perPage: 1,
                },
              },
            }}
          >
            {data &&
  //             data.map((e: any, index: any) => {
  //               if (index > 0) {
  //                 let url = "";
  //           var name: any = e.name?.toLowerCase();
  // var mainPhone: any = e.mainPhone;
  // var country: any = e.address.countryCode?.toLowerCase();
  // var region: any = e.address.region
  //   ?.toLowerCase()
  //   .replaceAll(" ", "-");
  // var initialregion: any = region.toString();
  // var finalregion: any = initialregion.replaceAll(" ", "-");
  // var city: any = e.address.city?.toLowerCase();
  // var initialrcity: any = city.toString();
  // var finalcity: any = initialrcity.replaceAll(" ", "-");
  // var string: any = name.toString();
  // let result1: any = string.replaceAll(" ", "-");
  // if (!e.slug) {
  //   var repspc=e.name.replace(/\s+/g,"-");
  //   var link =country + "/" + region + "/" + city +
  //   "/" +
  //   e.id+"-"+repspc.toLowerCase() +
  //   ".html";
  // } else {
  //   var link =country + "/" + region + "/" + city +
  //   "/" +
  //   e.slug?.toString() +
  //   ".html";
  // }
  // url=`/${link}`;

  data.map((e: any, index: any) => {
    if (index > 0) {
      var url = "";
      if (!e.slug) {
        let slugString = e?.id + " " + e?.name;
        let slug = slugify(slugString);
        url = `${slug}.html`;
      } else {
        url = `${e.slug.toString()}.html`;
      }
      //console.log(url,"url");






                  // var url = "";
                  // if (!e.slug) {
                  //   let slugString = e?.id + " " + e?.name;
                  //   let slug = slugify(slugString);
                  //   url = `${slug}.html`;
                  // } else {
                  //   url = `${e.slug.toString()}.html`;
                  // }

                  var origin: any = null;
                  if (e.address.city) {
                    origin = e.address.city;
                  } else if (e.address.region) {
                    origin = e.address.region;
                  } else {
                    origin = e.address.country;
                  }

                  let addressString = "";

                  let addressLines = e.address?.line1 + ", " + e.address?.line2;

                  if (addressLines.length > 42) {
                    addressString += e.address?.line1 + ", <br />";
                    let addressLine =
                      e.address?.line2 + ", " + e.address?.city + ", ";
                    if (addressLine.length > 42) {
                      addressString +=
                        e.address?.line2 + ", " + e.address?.city + ",<br />";
                      addressString +=
                        e.address?.postalCode +
                        ", " +
                        regionNames.of(e.address?.countryCode);
                    } else {
                      addressString +=
                        e.address?.line2 +
                        ", " +
                        e.address?.city +
                        ", " +
                        e.address?.postalCode +
                        "<br />";
                      addressString += regionNames.of(e.address?.countryCode);
                    }
                  } else {
                    let line2 = "";
                    if (e.address?.line2 != undefined) {
                      line2 = ", " + e.address?.line2 + ", ";
                    }
                    addressString += e.address?.line1 + ", " + line2 + "<br />";
                    addressString +=
                      e.address?.city + ", " + e.address?.postalCode + "<br />";
                    addressString += regionNames.of(e.address?.countryCode);
                  }
                  const formattedPhone = formatPhoneNumber(e.mainPhone);
                  return (
                    <SplideSlide key={index}>
                      <div className="location near-location">
                        <div className="miles-with-title">
                          <h3 className="">
                            <Link href={`${url}`}>{e.name}</Link>
                          </h3>
                          <p className="miles">
                            {metersToMiles(e.distance ?? 0)} {result.site.c_miles?result.site.c_miles:"Miles"}
                          </p>
                        </div>

                        <Address address={e.address} />
                        {e.mainPhone ? (
                          <>
                            <div className="icon-row location-phone ">
                              {/* <span className="icon">{svgIcons.phone}</span> */}
                              <Link
                                className="phone-number onhighLight"
                                data-ya-track="phone"
                                href={`tel:${e.mainPhone}`}
                                rel="noopener noreferrer"
                                eventName={`phone`}
                              >
                                {formattedPhone}
                              </Link>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        {e.hours ? (
                          <>
                            {Object.keys(e.hours).length > 0 ? (
                              <>
                                <div className="OpenCloseStatus">

                                  <OpenCloseStatus
                                    timezone={
                                      result.timezone ? result.timezone : defaultTimeZone
                                    }
                                    hours={e.hours}
                                    site={e.site}
                                  ></OpenCloseStatus>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}


                        <div className="buttons gap-y-[2px] sm:gap-y-2.5">
                        <div className="ctaBtn">
                            <Link
                              className="button before-icon"
                              href={`${url}`}
                            >
                              {result.site.c_viewStationDetails}
                            </Link>
                          </div>
                          <div className="ctaBtn">
                            <Link
                              data-ya-track="getdirections"
                              eventName={`getdirections`}
                              className="direction button before-icon"
                              onClick={() => getDirectionUrl(e)}
                              href="javascript:void(0);"
                              rel="noopener noreferrer"
                              //conversionDetails={conversionDetails_direction}
                            >  
                           {result.site.c_getDirections}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SplideSlide>
                  );
                }
              })}
          </Splide>
        </div>
      </div>
    </>
  );
};
export default NearByLocation;
