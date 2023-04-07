import { useSearchActions } from "@yext/search-headless-react";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Geocode from "react-geocode";
import { useTranslation } from "react-i18next";
import { svgIcons } from "../../svg icons/svgIcon";
import {
  AnswerExperienceConfig,
  googleMapsConfig,
  limit,
} from "..//../config/globalConfig";
import FilterAwesome from "../locatorPage/Filter";
import errorbox from "../../images/error-status-icon.png";
import $ from "jquery";
import { Link } from "@yext/pages/components";

const SearchFile = (props: any) => {
  let useLocationBound = false;
  const [centerLatitude, setCenterLatitude] = useState(
    googleMapsConfig.centerLatitude
  );
  const [centerLongitude, setCenterLongitude] = useState(
    googleMapsConfig.centerLongitude
  );
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorstatus, setErrorStatus] = useState(false);
  const [check, setCheck] = useState(false);
  const [inputvalue, setInputValue] = React.useState("");
  const [allowlocation, setallowLocation] = React.useState("");
  // const[error,setError]=useState(false);
  const [userShareLocation, setUserShareLocation] = useState(false);
  const searchActions = useSearchActions();
  const [isUserLocation, setIsUserLocation] = React.useState(false);
  let setNotFound = props.setShowNotFound;
  let googleLib = typeof google !== "undefined" ? google : null;

  const onClick = () => {
    useLocationBound = true;
    setInputValue("");
    // setZoomlevel(4);
    setIsUserLocation(true);
    if (navigator.geolocation) {
      const error = (error: any) => {
        if (error.code == 1) {
          setallowLocation("Plaese allow your Location");
        }
      };
      navigator.geolocation.getCurrentPosition(
        function (position) {
          Geocode.setApiKey(googleMapsConfig.googleMapsApiKey);
          Geocode.fromLatLng(
            position.coords.latitude,
            position.coords.longitude
          ).then(
            (response: any) => {
              if (response.results[0]) {
                if (inputRef.current) {
                  inputRef.current.value =
                    response.results[0].formatted_address;
                }

                let pacInput: any = document?.getElementById("pac-input");
                if (pacInput) {
                  pacInput.value = response.results[0].formatted_address;
                  pacInput.focus();
                }
                // const country = response.results[0].address_components.find(
                //   (e: { types: string | string[] }) =>
                //     e.types.includes("country")
                // );

                // if (country && country.short_name.toLowerCase() !== "gb") {
                //   setNotFound(true);
                // } else {
                //   setNotFound(false);
                // }

                setallowLocation("");
                searchActions?.setUserLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              }
            },
            (error: any) => {
              console.error(error);
              setCheck(false);
            }
          );

          searchActions?.setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          searchActions?.setVertical(AnswerExperienceConfig.verticalKey);
          searchActions?.setOffset(0);
          searchActions?.setVerticalLimit(limit);
          searchActions?.executeVerticalQuery();
        },
        error,
        {
          timeout: 10000,
        }
      );
    }
  };
  const Findinput = () => {
    const searchKey: any = document.getElementsByClassName("FilterSearchInput");
    const Search = inputRef.current?.value || "";
    setIsUserLocation(false);
    setNotFound(false);
    if (searchKey[0].value != "") {
      setInputValue("");
      setErrorStatus(false);
      getCoordinates(Search);
    }
    if (searchKey[0].value == "") {
      setErrorStatus(true);
    }
    searchActions?.setOffset(0);
  };

  const Findinput2 = () => {
    const searchKey: any = document.getElementsByClassName("FilterSearchInput");
    const Search = inputRef.current?.value || "";
    setIsUserLocation(false);
    if (Search.length == 0) {
      setNotFound(false);
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({
        lat: googleMapsConfig.centerLatitude,
        lng: googleMapsConfig.centerLongitude,
      });
      // searchActions.setVertical("locations");
      // searchActions.setQuery("");
      // searchActions.setOffset(0);
      // searchActions.setVerticalLimit(limit);
      // searchActions.executeVerticalQuery();
      getCoordinates(Search);
    }
    setErrorStatus(false);
  };

  function getCoordinates(address: string) {
    setActiveIndex(null);
    document.querySelectorAll(".scrollbar-container")[0].scrollTop = 0;
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=AIzaSyDZNQlSlEIkFAct5VzUtsP4dSbvOr2bE18"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "OK") {
          data.results.map((res: any) => {
            const userlatitude = res.geometry.location.lat;
            const userlongitude = res.geometry.location.lng;
            const params = { latitude: userlatitude, longitude: userlongitude };
            searchActions?.setQuery(address);
            searchActions?.setUserLocation({
              latitude: userlatitude,
              longitude: userlongitude,
            });
            searchActions?.executeVerticalQuery();
            // const country = res.address_components.find(
            //   (e: { types: string | string[] }) => e.types.includes("country")
            // );

            // if (country && country.short_name.toLowerCase() !== "gb") {
            //   setShowNot(true);
            // } else {
            //   setShowNot(false);
            // }
          });
        } else {
          searchActions?.setUserLocation({
            latitude: centerLatitude,
            longitude: centerLongitude,
          });

          searchActions?.setQuery(address);
          searchActions?.executeVerticalQuery();
          if (inputRef.current?.value) {
            setNotFound(true);
            setErrorStatus(false);
          }
        }
      });
  }

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  useEffect(() => {
    if (googleLib && typeof google.maps === "object") {
      let pacInput: any = document?.getElementById("pac-input");

      let options: any = {
        options: {
          language: ["en_GB", "fr-FR", "it-IT", "ja-JP", "de-DE"],
          //types: ["(regions)"],
          fields: ["address_component", "geometry"],
        },
      };
      const autoComplete = new google.maps.places.Autocomplete(
        pacInput,
        options
      );
      if (autoComplete) {
        function pacSelectFirst(input: HTMLInputElement) {
          const _addEventListener = input.addEventListener;
          function addEventListenerWrapper(type: string, listener: any) {
            if (type == "keydown") {
              const orig_listener = listener;

              listener = function (event: { which: number }) {
                const suggestion_selected = $(".pac-item-selected").length > 0;
                if (
                  (event.which == 13 || event.which == 9) &&
                  !suggestion_selected
                ) {
                  const simulated_downarrow = $.Event("keydown", {
                    keyCode: 40,
                    which: 40,
                  });
                  orig_listener.apply(input, [simulated_downarrow]);
                }

                orig_listener.apply(input, [event]);
              };
            }

            _addEventListener.apply(input, [type, listener]);
          }

          if (input.addEventListener) {
            input.addEventListener = addEventListenerWrapper;
          }
        }

        setAutocomplete(autoComplete);
        pacSelectFirst(pacInput);
        $("#search-location-button")
          .off("click")
          .on("click", function () {
            const keydown = document.createEvent("HTMLEvents");
            keydown.initEvent("keydown", true, false);
            Object.defineProperty(keydown, "keyCode", {
              get: function () {
                return 13;
              },
            });
            Object.defineProperty(keydown, "which", {
              get: function () {
                return 13;
              },
            });
            pacInput.dispatchEvent(keydown);
          });

        google.maps.event.addListener(
          autoComplete,
          "place_changed",
          function () {
            const searchKey: any = pacInput.value;
            const place = autoComplete.getPlace();
            //console.log("searchKey", searchKey, place);
            if (!place.address_components) {
              setNotFound(true);
            } else {
              setNotFound(false);
            }
            if (searchKey) {
              getCoordinates(searchKey);
            }
          }
        );
      }
    }
    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
      }
    };
  }, [googleLib]);

  const { t } = useTranslation();
  return (
    <>
      <div className="search-block">
        {allowlocation.length > 0 && (
          <div className="for-allow">{t("Please allow your Location")}</div>
        )}

        <div className="location-with-filter">
          <h3 className="title">{t("Enter a Town or Postcode")}</h3>

          {/* Use My Location button */}
          <button
            className="ghost-button before-icon"
            title="Search using your current location!"
            id="useLocation"
            onClick={onClick}
          >
            {svgIcons.useMyLocation}
            {t("Use my location")}
          </button>
        </div>

        {/* Search Input by name,address  */}
        <div className="search-form">
          <input
            id="pac-input"
            type="text"
            ref={inputRef}
            placeholder={t("Enter address, city, postalcode")}
            className="FilterSearchInput"
            onChange={() => Findinput2()}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                Findinput();
              }
              if (
                evt.key === "Backspace" ||
                evt.key === "x" ||
                evt.key === "Delete"
              ) {
                Findinput2();
              }
            }}
          />
          {errorstatus && (
            <span className="Error-msg">
              <img src={errorbox} />
              Please fill out this field
            </span>
          )}
          {/* Search icon Button  */}
          <button
            className="button"
            aria-label="Search bar icon"
            id="search-location-button"
            onClick={() => {
              Findinput();
            }}
          >
            {svgIcons.Searchbaricon}
          </button>
          {/* <div className="flex justify-between">Filter</div> */}
        </div>
        <div className="flex items-start justify-between">
          <FilterAwesome
            customCssClasses={{ container: "filter-items" }}
            defaultExpanded={true}
          ></FilterAwesome>
          <div className="ctaBtn">
            <Link className="onhighLight button" href="#">
              {props.c_allAddressCTA
                ? props.c_allAddressCTA
                : t("All Addresses")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchFile;
