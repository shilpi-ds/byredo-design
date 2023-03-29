import { Link } from "@yext/pages/components";
import { useSearchActions, useSearchState } from "@yext/search-headless-react";
import $ from "jquery";
import * as React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import useFetchResults from "../../hooks/useFetchResults";
import { svgIcons } from "../../svg icons/svgIcon";
import {
  googleMapsConfig,
  limit
} from "..//../config/globalConfig";
import VerticalResults from "../VerticalResults";
import { GoogleMaps } from "./GoogleMaps";
import LocationCard from "./LocationCard";
import ResultsCount from "./ResultsCount";
import ViewMore from "./ViewMore";
let params1: any = {
  latitude: googleMapsConfig.centerLatitude,
  longitude: googleMapsConfig.centerLongitude,
};

const SearchLayout = (props: any): JSX.Element => {
  const [isLoading, setIsloading] = React.useState(true);
  const [zoomlevel, setZoomlevel] = React.useState(5);
  const [centerLatitude, setCenterLatitude] = React.useState(
    googleMapsConfig.centerLatitude
  );
  const [centerLongitude, setCenterLongitude] = React.useState(
    googleMapsConfig.centerLongitude
  );
  const [active, setActive] = React.useState("");
  const locationResults = useFetchResults() || [];

  const alternateResult =
    useSearchState(
      (s) => s.vertical.noResults?.allResultsForVertical.results
    ) || [];
  const [optiontext, setOptiontext] = React.useState("");
  const [check, setCheck] = React.useState(false);
  const [showNotFound, setShowNotFound] = React.useState(false);
  const [inputvalue, setInputValue] = React.useState("");
  const [allowlocation, setallowLocation] = React.useState("");
  const [userShareLocation, setUserShareLocation] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const searchActions = useSearchActions();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [optionclick, setOptionClick] = React.useState(true)
  let firstTimeRunners = true;

  const FirstLoad = () => {
    setCheck(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const params: any = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          params1 = params;
          searchActions.setUserLocation(params1);
          searchActions.setVerticalLimit(limit);
          searchActions.setOffset(0);
          searchActions.executeVerticalQuery();
        },
        function () {
          /* if (error.code == error.PERMISSION_DENIED) {
          } */
        }
      );
    }
    searchActions.setUserLocation({
      latitude: googleMapsConfig.centerLatitude,
      longitude: googleMapsConfig.centerLongitude,
    });
    searchActions.setVerticalLimit(limit);
    searchActions.setOffset(0);
    searchActions.executeVerticalQuery();

    setTimeout(() => {
      setIsloading(false);
      $("body").removeClass("overflow-hidden");
    }, 3100);
  };

  React.useEffect(() => {
    if (firstTimeRunners) {
      firstTimeRunners = false;
      FirstLoad();
    }

    if (isLoading) {
      $("body").addClass("overflow-hidden");
    }
  }, []);

  const addClass = () => {
    document.body.setAttribute("class", "mapView");
    setActive("");
  };

  const _site = props._site;

  return (
    <>
      {/* {loader} */}
      <div className="locator-full-width place-content-center">
        <div className="locator-container">
          {/* Map view and List View CTA in mobile responsive  */}
          <div className="mobile-btns">
            <Link
              className="button before-icon listBtn"
              href="javascript:void(0);"
              onClick={() => {
                document.body.classList.remove("mapView");
              }}
            >
              {svgIcons.listView} Store List
            </Link>
            <Link
              className="button before-icon mapBtn"
              href="javascript:void(0);"
              onClick={addClass}
            >
              {svgIcons.mapView} Map View
            </Link>
          </div>

          {/* Map Section  */}
          <div className="map-section">
            <GoogleMaps
              apiKey={googleMapsConfig.googleMapsApiKey}
              centerLatitude={centerLatitude}
              centerLongitude={centerLongitude}
              defaultZoom={6}
              zoomLevel={zoomlevel}
              setZoomLevel={setZoomlevel}
              showEmptyMap={true}
              check={check}
              locationResults={locationResults}
              alternateResult={alternateResult}
              activeIndex={activeIndex}
              setActiveIndex={(i: React.SetStateAction<number | null>) =>
                setActiveIndex(i)
              }
            />
            <ViewMore
              className={"button view-more before-icon"}
              idName={"listing-view-more-button"}
              buttonLabel={"Load More"}
              resetMap={() => {
                setZoomlevel(4);
                setActiveIndex(null);
                $(".location-cart-element")
                  .removeClass("fixed-hover")
                  .removeClass("active");
              }}
            />
          </div>
          <div className="result-listing">
            <ResultsCount />
            {alternateResult && alternateResult.length > 0 && (
              <p className="pt-2 pb-3 text-lg text-center no-lc-err-msg">
                {_site.c_noLocationFound}
              </p>
            )}

            {/* Result listing Section  */}
            <div className="result-listing">
              <PerfectScrollbar className="result-list">
                {locationResults && locationResults.length > 0 && (
                  <div className="scrollbar-custom">
                    <VerticalResults
                      displayAllOnNoResults={false}
                      CardComponent={LocationCard}
                      locationResults={locationResults}
                      activeIndex={activeIndex}
                      _site={_site}
                    />
                  </div>
                )}
              </PerfectScrollbar>
              {locationResults && locationResults.length > 0 && (
                <ViewMore
                  className={"button view-more before-icon"}
                  idName={"listing-view-more-button"}
                  buttonLabel={"Load More"}
                  resetMap={() => {
                    setZoomlevel(4);
                    setActiveIndex(null);
                    $(".location-cart-element")
                      .removeClass("fixed-hover")
                      .removeClass("active");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchLayout;
