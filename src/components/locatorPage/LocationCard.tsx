import * as React from "react";
import { CardComponent } from "@yext/search-ui-react";
import { Location } from "..//../types/search/locations";
import Hours from "../commons/hours";
import Address from "..//../components/commons/Address";
import { Link } from "@yext/pages/components";
import {
  formatPhoneNumber,
} from "react-phone-number-input";
import OpenCloseStatus from "..//../components/commons/OpenCloseStatus";
import Phone from "../commons/phone";
import { svgIcons } from "../../svg icons/svgIcon";
import { useTranslation } from "react-i18next";
import { slugify, defaultTimeZone } from "../../config/globalConfig";
import { useState } from "react";

/**
 *
 * @param meters
 * @returns Distance in miles
 */
const metersToMiles = (meters: number) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
};

const LocationCard: CardComponent<Location> = (props: any) => {
  console.log("props", props);
  const {
    address,
    hours,
    mainPhone,
  } = props?.result?.rawData;
  const [time, setTime] = React.useState({});
  const [timezone, setTimeZone] = React.useState("");

  const [withoutHourClass, setWithoutHourClass] = React.useState("");
  const formattedPhone = formatPhoneNumber(mainPhone);
  React.useEffect(() => {
    setTime(props.result.rawData);
    setTimeZone(props.result.rawData.timezone);
    if (!props.result.rawData) {
      setWithoutHourClass("withoutHours");
    }
  });
console.log('set', props.result.rawData.timezone)
  /**
   * Function to convert Date format in dd-mm-yy
   */
  let a;
  let s;
  let dateNewFormat;
  function join(t: any, a: any, s: any) {
    function format(m: any) {
      const f = new Intl.DateTimeFormat("en", m);
      return f.format(t);
    }
    return a.map(format).join(s);
  }
  if (hours?.reopenDate) {
    a = [{ day: "numeric" }, { month: "long" }, { year: "numeric" }];
    s = join(new Date(hours?.reopenDate), a, " ");
    dateNewFormat = s;
  }

  const [timeStatus, setTimeStatus] = useState("");
  const onOpenHide = () => {
    if (timeStatus == "") {
      setTimeStatus("active");
    } else {
      setTimeStatus("");
    }
  };

  /**
   Note-  Url returns Slug
   * If slug is available then url returns Slug otherwise it returns id-name
   */
  let url = "";
  if (!props.result.rawData.slug) {
    const slugString =
      props.result.rawData?.id + " " + props.result.rawData?.name;
    const slug = slugify(slugString);
    url = `${slug}.html`;
  } else {
    url = `${props.result.rawData.slug.toString()}.html`;
  }

  const { t } = useTranslation();
  /**
   * LocationCard component which returns the HTML of Locator Page Listing.
   */
  return (
    <div
      className={`location result-list-inner-${props.index} result onhighLight location-cart-element`}
      id={`result-list-inner-${props.index}`}
      data-id={props.index}
    >
      <div className="miles-with-title">
        <h3 className="onhighLight">
          <Link href={`${url}`}>{props.result.rawData.name} </Link>
        </h3>
        <p className="miles flex">
          {metersToMiles(props.result.distance ?? 0)} {t("miles")}
          <span className="pl-2 pt-2">{svgIcons.miles}</span>
        </p>
      </div>

      <Address address={address} />
      {mainPhone && <Phone phone={mainPhone} />}
      {hours && (
        <>
          {Object.keys(props.result.rawData.hours).length > 0 && (
            <>
              <div className="OpenCloseStatus">
                {hours && hours?.reopenDate ? (
                  <div>
                    <OpenCloseStatus
                      timezone={timezone ? timezone : defaultTimeZone}
                      hours={hours}
                      site={props._site}
                    />
                    {props?.site?.c_tempClosedMessage
                      ? props?.site?.c_tempClosedMessage
                      : t("The Store will reopen at")}
                    {dateNewFormat}
                  </div>
                ) : (
                  <Link
                    className={timeStatus + "onhighLight "}
                    href="javascript:void(0);"
                    onClick={onOpenHide}
                  >
                    <OpenCloseStatus
                      timezone={timezone ? timezone : defaultTimeZone}
                      hours={hours}
                      site={props._site}
                    />
                  </Link>
                )}

                <div className={timeStatus + " daylist"}>
                  <Hours
                    hours={hours ? hours : {}}
                    timezone={timezone ? timezone : defaultTimeZone}
                    site={props._site}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className="buttons gap-y-[2px] sm:gap-y-2.5">
        <div className="ctaBtn">
          <Link className="onhighLight button before-icon" href={`${url}`}>
            {props._site.c_viewStationDetails
              ? props._site.c_viewStationDetails
              : t("View Details")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
