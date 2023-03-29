import { Wrapper } from "@googlemaps/react-wrapper";
import { useSearchState, Result } from "@yext/search-headless-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  twMerge,
  useComposedCssClasses,
} from "..//../hooks/useComposedCssClasses";
import { useTranslation } from "react-i18next";
import useFetchResults from "../../hooks/useFetchResults";
import Address from "../commons/Address";
import { Link } from "@yext/pages/components";
import Phone from "../commons/phone";
import Mapicon from "../../images/Byredo.svg";
import Mapicon1 from "../../images/Departmental.svg";
import UserMarker from "../../images/user.svg";
import MapiconHover from "..//../images/map-pin-hover.svg";
import { renderToString } from "react-dom/server";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import OpenCloseStatus from "..//../components/commons/OpenCloseStatus";
import clustericon from "../../images/cluster1.png";
import getDirectionUrl from "../commons/GetDirection";
import { slugify, defaultTimeZone, silverMapStyle } from "../../config/globalConfig";
import $ from "jquery";
let marker: any;
/**
 * CSS class interface for the {@link GoogleMaps} component
 *
 * @public
 */
export interface GoogleMapsCssClasses {
  googleMapsContainer?: string;
}

/**
 * Props for the {@link GoogleMaps} component
 *
 * @public
 */
export interface GoogleMapsProps {
  apiKey: string;
  centerLatitude: number;
  centerLongitude: number;
  defaultZoom: number;
  showEmptyMap: boolean;
  zoomLevel: number;
  setZoomLevel: any;
  check: boolean;
  providerOptions?: google.maps.MapOptions;
  customCssClasses?: GoogleMapsCssClasses;
  locationResults: any;
  alternateResult: any;
  activeIndex: number | null;
  setActiveIndex: any;
}

type UnwrappedGoogleMapsProps = Omit<GoogleMapsProps, "apiKey" | "locale">;
let mapMarkerClusterer: { clearMarkers: () => void } | null = null;

const builtInCssClasses: Readonly<GoogleMapsCssClasses> = {
  googleMapsContainer: "w-full  h-[80vh] md:h-[calc(100vh_-_0px)] top-0 z-[99]",
};

/**
 * A component that renders a map with markers to show result locations.
 *
 * @param props - {@link GoogleMapsProps}
 * @returns A React element conatining a Google Map
 *
 * @public
 */
let location: any;
export function GoogleMaps(props: GoogleMapsProps) {
  return (
    <div>
      <Wrapper apiKey={props.apiKey}>
        <UnwrappedGoogleMaps {...props} />
      </Wrapper>
    </div>
  );
}

function UnwrappedGoogleMaps({
  centerLatitude,
  centerLongitude,
  defaultZoom: zoom,
  showEmptyMap,
  zoomLevel,
  locationResults,
  alternateResult,
  activeIndex,
  setActiveIndex,
  providerOptions,
  customCssClasses,
  check,
}: UnwrappedGoogleMapsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  let center: any = {
    lat: centerLatitude,
    lng: centerLongitude,
  };
  const [scrollTo, setScrollTo] = React.useState<boolean>(true);
  const bounds = new google.maps.LatLngBounds();
  const markerPins = useRef<google.maps.Marker[]>([]);
  const usermarker = useRef<google.maps.Marker[]>([]);
  const infoWindow = useRef(new google.maps.InfoWindow());

  locationResults.map((result: any, i: Number) => {
    if (i == 0) {
      center = {
        lat: result.rawData.yextDisplayCoordinate
          ? result.rawData.yextDisplayCoordinate.latitude
          : result.rawData.displayCoordinate.latitude,
        lng: result.rawData.yextDisplayCoordinate
          ? result.rawData.yextDisplayCoordinate.longitude
          : result.rawData.displayCoordinate.longitude,
      };
      if (map) {
        const location = new google.maps.LatLng(center.lat, center.lng);
        bounds.extend(location);
        map.setCenter(center);
      }
    }
  });

  const [hover, setHover] = useState(true);
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const noResults = !locationResults.length;
  let containerCssClass = cssClasses.googleMapsContainer;
  let marker_icon = {
    url: Mapicon,
  };
  if (noResults && !showEmptyMap) {
    containerCssClass = twMerge(cssClasses.googleMapsContainer, "hidden");
  }
  let pinStyles = {
    fill: "#4e9c34", //default google red
    stroke: "#4e9c34",
    text: "white",
    fill_selected: "#2c702e",
    stroke_selected: "#4e9c34",
    text_selected: "white",
  };

  /** Marker icon*/
  // let marker_icon = {
  //   url: Mapicon,
  //   fillColor: pinStyles.fill,
  //   scale: 0.8,
  //   fillOpacity: 1,
  //   strokeColor: pinStyles.stroke,
  //   strokeWeight: 1,
  //   labelOrigin: new google.maps.Point(21, 22),
  // };


  /** Marker Hover icon*/
  let marker_hover_icon = {
    url: MapiconHover,
    fillColor: pinStyles.fill,
    scale: 0.8,
    fillOpacity: 1,
    strokeColor: pinStyles.stroke,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(21, 22),
  };


  deleteMarkers();
  userdeleteMarkers();

  const userlat = useSearchState((s) => s.location.locationBias) || [];
  const iplat = userlat.latitude;
  const iplong = userlat.longitude;
  const position = {
    lat: parseFloat(iplat),
    lng: parseFloat(iplong),
  };

  const Usermarker1 = new google.maps.Marker({
    position,
    map,
    icon: UserMarker,
  });
  usermarker.current.push(Usermarker1);

  try {
    if (mapMarkerClusterer) {
      mapMarkerClusterer.clearMarkers();
    }
  } catch (e) { }
  if (locationResults.length > 0) {
    for (const result of locationResults) {
      marker_icon = getMarkerPin(result);
      const position = getPosition(result);
      const marker = new google.maps.Marker({
        position,
        map,
        icon: marker_icon,
      });

      location = new google.maps.LatLng(position.lat, position.lng);
      bounds.extend(location);
      markerPins.current.push(marker);
    }
  } else {
    for (const result of alternateResult) {
      const position = getPosition(result);
      marker = new google.maps.Marker({
        position,
        map,
        icon: marker_icon,
      });

      const location = new google.maps.LatLng(position.lat, position.lng);
      bounds.extend(location);
      markerPins.current.push(marker);

    }
  }
  /** Cluster color */
  if (markerPins.current.length > 0) {
    const markers = markerPins.current;
    mapMarkerClusterer = new MarkerClusterer({
      map,
      markers,
      renderer: {
        render: ({ markers, position: position }) => {
          return new google.maps.Marker({
            position: {
              lat: position.lat(),
              lng: position.lng(),
            },
            icon: clustericon,
            label: {
              text: String(markers?.length),
              color: "#fff",
              fontWeight: "500",
            },
          });
        },
      },
      onClusterClick: (event, cluster, _map) => {
        const position = cluster.position.toJSON();
        const location = new google.maps.LatLng(position.lat, position.lng);

        setTimeout(() => {
          const bound = cluster.bounds;
          bound?.extend(location);
          if (bound) {
            _map.fitBounds(bound);
          }
        }, 300);
      },
    });
  }


  useEffect(() => {
    if (ref.current && !map) {
      const options = {
        center,
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DEFAULT,
          mapTypeIds: ["roadmap"],
        },

        styles: silverMapStyle,
        ...providerOptions,
      };
      setMap(new window.google.maps.Map(ref.current, options));
    } else if (markerPins.current.length > 0 && map) {
      bounds.extend(position);
      map?.fitBounds(bounds);
    }

    if (map && !openInfoWindow) {
      map?.fitBounds(bounds);
    }

    onGridClick(markerPins, marker_hover_icon, marker_icon, locationResults);
    onGridHover(markerPins, marker_hover_icon, marker_icon);
    /** Binding Grid Listing click */
  }, [center, map, providerOptions, zoom, zoomLevel, position]);


  /** Open info window Click event*/
  for (let i = 0; i < markerPins.current.length; i++) {
    markerPins.current[i].setIcon(marker_icon);
    markerPins.current[i].addListener("click", () => {
      setActiveIndex(i);
      setHover(false);
      $(".location-cart-element")
        .removeClass("fixed-hover")
        .removeClass("active");

      locationResults.map((result: any, index: number) => {
        if (i == index) {
          const resultelement = document.getElementById(
            `result-list-inner-${index + 1}`
          );

          if (resultelement) {
            resultelement.classList.add("active", "fixed-hover");
          }

          const position = getPosition(locationResults[index]);
          InfowindowContents(i, result);
          if (scrollTo) {
            scrollToRow(index);
          } else {
            setScrollTo(true);
          }

          if ($(window).width > 700) {
            addActiveGrid(i);
          }

          const currentZoom = map?.getZoom() || 17;


          setTimeout(() => {
            bounds.extend(position);
            map?.setCenter(position);
          }, 500);

          setTimeout(() => {
            if (currentZoom && currentZoom < 19) {
              map?.setZoom(19);
            } else {
              map?.setZoom(currentZoom);
            }
          }, 800);

          // map?.setZoom(10);
          setOpenInfoWindow(true);
          infoWindow.current.open(map, markerPins.current[i]);
          markerPins.current[i].setIcon(marker_hover_icon);
        }
      });
    });

    markerPins.current[i].addListener("mouseover", () => {
      if (i !== activeIndex) {
        const resultelement = document.getElementById(
          `result-list-inner-${i + 1}`
        );
        if (resultelement) {
          resultelement.classList.add("active");
        }
      }
      markerPins.current[i].setIcon(marker_hover_icon);
      if ($(window).width > 700) {
        addActiveGrid(i);
      }
    });
    markerPins.current[i].addListener("mouseout", () => {

      if (i !== activeIndex) {
        const resultelement = document.getElementById(
          `result-list-inner-${i + 1}`
        );
        if (resultelement) {
          resultelement.classList.remove("active");
        }
        markerPins.current[i].setIcon(marker_icon);
      }
    });
  }
  /** info window Close event*/
  if (infoWindow.current != null) {
    infoWindow.current.addListener("closeclick", () => {
      setHover(true);
      setActiveIndex(null);
      setOpenInfoWindow(false);
      infoWindow.current.close();
      $(".location-cart-element")
        .removeClass("fixed-hover")
        .removeClass("active");
      onGridClick(markerPins, marker_hover_icon, marker_icon, locationResults);
      onGridHover(markerPins, marker_hover_icon, marker_icon);
      map?.fitBounds(bounds);
      // map?.setZoom(10);
    });
  }

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /** Active and Remove Grid */

  function addActiveGrid(index: number) {
    let elements = document.querySelectorAll(".result");
    for (let index = 0; index < elements.length; index++) {
      elements[index].classList.remove("active");
    }
    document.querySelectorAll(".result")[index].classList.add("active");
  }
  function removeActiveGrid(index: any) {
    let elements = document.querySelectorAll(".result");
    for (let index = 0; index < elements.length; index++) {
      elements[index].classList.remove("active");
    }
    document.querySelectorAll(".result")[index].classList.remove("active");
  }

  /** Function Grid Hover*/
  function onGridHover(
    markerPins: any,
    marker_hover_icon: any,
    marker_icon: any
  ) {
    let elements = document.querySelectorAll(".result");
    for (let index = 0; index < elements.length; index++) {
      elements[index].addEventListener("mouseover", (e) => {
        if (hover) {
          markerPins.current[index].setIcon(marker_hover_icon);
          if ($(window).width > 700) {
            addActiveGrid(index);
          }
        }
      });
      elements[index].addEventListener("mouseout", () => {
        if (hover) {
          if (elements[index].classList.contains("fixed-hover")) {
            markerPins.current[index].setIcon(marker_hover_icon);
          } else {
            markerPins.current[index].setIcon(marker_icon);
          }

          removeActiveGrid(index);
        }
      });
    }
  }

  /** Function Grid Click*/
  // function onGridClick(
  //   markerPins: any,
  //   marker_hover_icon: any,
  //   marker_icon: any
  // ) {
  //   let elements = document.querySelectorAll(".result");
  //   for (let index = 0; index < elements.length; index++) {
  //     if (!elements[index].classList.contains("markerEventBinded")) {
  //       elements[index].classList.add("markerEventBinded");
  //       elements[index].addEventListener("click", (e) => {
  //         if (!(e.target as HTMLElement).classList.contains("onhighLight")) {
  //           // alert("check")
  //           if (index > 0) {
  //             markerPins.current[index - 1].setIcon(marker_icon);
  //           }
  //           $(".result").removeClass("fixed-hover");
  //           if ($(".mobile-btns .button.listBtn:visible").length) {
  //              document.body.classList.remove("mapView");
  //             alert("hello");
  //           }
  //           locationResults.map((result:any, i:any) => {
  //             if (i == index) {
  //               setHover(false);
  //               isHover = false;
  //               if (!openInfoWindow) {
  //                 markerPins.current[index].setIcon(marker_hover_icon);

  //               }
  //               document
  //                 .querySelectorAll(".result")
  //                 [index].classList.add("fixed-hover");
  //               if ($(window).width > 700){
  //                 addActiveGrid(index);
  //               }

  //               setTimeout(() => {
  //                 map?.setZoom(13);
  //               }, 900);
  //               let position = getPosition(locationResults[index]);  
  //               var bounds = new google.maps.LatLngBounds();
  //               bounds.extend(center);
  //               map?.setCenter(center);
  //               map?.setZoom(10);
  //               map?.panTo(position);
  //               InfowindowContents(i, result);
  //               infoWindow.current.open(map, markerPins.current[index]);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
  // }
  function onGridClick(
    markerPins: any,
    marker_hover_icon: any,
    marker_icon: any,
    locationResults: any
  ) {
    // setActiveIndex(null);
    const elements = document.querySelectorAll(".result");
    for (let index = 0; index < elements.length; index++) {
      // markerPins.current[index].setIcon(marker_icon);
      if (!elements[index].classList.contains("markerEventBinded")) {
        elements[index].classList.add("markerEventBinded");
        elements[index].addEventListener("click", (e) => {
          if (!(e.target as HTMLElement).classList.contains("onhighLight")) {
            if (index > 0) {
              markerPins.current[index - 1].setIcon(marker_icon);
            }
            $(".result").removeClass("fixed-hover");
            locationResults.map((result: any, i: any) => {
              if (i == index) {
                setScrollTo(false);
                google.maps.event.trigger(markerPins.current[i], "click");
              }
            });
          }
        });
      }
    }
  }
  /**
   *
   * @param meters
   * @returns Distance in Miles
   */
  const metersToMiles = (meters: number) => {
    const miles = meters * 0.000621371;
    return miles.toFixed(2);
  };

  const { t, i18n } = useTranslation();
  /** Function InfowindowContents returns Html*/
  function InfowindowContents(i: Number, result: any): void {
    var url = "";
    if (!result.rawData.slug) {
      let slugString = result?.id + " " + result?.name;
      let slug = slugify(slugString);
      url = `${slug}.html`;
    } else {
      url = `${result.rawData.slug.toString()}.html`;
    }

    const MarkerContent = (
      <div className="markerContent">
        <div className="miles-with-title">
          <h3 className="nameData">
            <Link href={`${url}`}>{result.name} </Link>
          </h3>
          <p className="miles">{metersToMiles(result.distance ?? 0)} {t("miles")}</p>
        </div>
        <Link
          data-ya-track="getdirections"
          eventName={`getdirections`}
          className="addressmob"
          href="javascript:void(0);"
          id="some-button"
          rel="noopener noreferrer"
        >
          <Address address={result.rawData.address} />
        </Link>
        <Phone phone={result.rawData.mainPhone} />

        {result?.rawData?.hours && (
          <>
            {Object.keys(result?.rawData?.hours).length > 1 ? (
              <>
                <div className="openStatus">
                  <OpenCloseStatus
                    hours={result?.rawData?.hours}
                    timezone={
                      result.rawData.timezone
                        ? result.rawData.timezone
                        : defaultTimeZone
                    }
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        )}


        <div className="buttons">
          <div className="ctaBtn">
            <Link className="button" href={`${url}`}>
              {t("View Details")}
            </Link>
          </div>

        </div>

        {/* <div className="map-buttons md:hidden text-center">
          <Link
            data-ya-track="getdirections"
            eventName={`getdirections`}
            className="direction button"
            onClick={() => getDirectionUrl(result.rawData)}
            href="javascript:void(0);"
            id="some-button1"
            rel="noopener noreferrer"
            //conversionDetails={conversionDetails_direction}
          >
            <>{svgIcons.GetDirection} Directions </>
          </Link>
          <Link
            className="button before-icon ml-2"
            href={`tel:${result.rawData.mainPhone}`}
          >
            {svgIcons.phone} Call
          </Link>
        </div> */}
      </div>
    );
    // function mobiledirection() {
    //   getDirectionUrl(result.rawData);
    // }
    // google.maps.event.addListener(infoWindow.current, "domready", (e: any) => {
    //   const someButton = document.getElementById("some-button");
    //   someButton?.addEventListener("click", mobiledirection);
    // });

    // google.maps.event.addListener(infoWindow.current, "domready", (e: any) => {
    //   const someButton = document.getElementById("some-button1");
    //   someButton?.addEventListener("click", mobiledirection);
    // });

    let string = renderToString(MarkerContent);
    infoWindow.current.setContent(string);
  }



  // function getMarkerHoverPin(result: any) {
  //   let hover_icon = marker_hover_icon;
  //   if (typeof result.rawData.c_storeType != "undefined") {
  //     if (result.rawData.c_storeType == "Departmental Stores") {
  //       hover_icon = {
  //         url: retailersHoverPin,
  //       };
  //     } else if (
  //       result.rawData.c_storeType == "Byredo Stores"
  //     ) {
  //       hover_icon = {
  //         url: storesHoverPin,
  //       };
  //     }
  //   }
  //   return hover_icon;
  // }

  function getMarkerPin(result: any) {
    let m_icon = marker_icon;
    if (typeof result.rawData.c_storeType != "undefined") {
      if (result.rawData.c_storeType == "Departmental Stores") {
        m_icon = {
          url: Mapicon1,
        };
      } else (
        result.rawData.c_storeType == "Byredo Stores")
      {
        m_icon = {
          url: Mapicon,
        };
      }

    }
    return m_icon;
  }
  function deleteMarkers(): void {
    for (let i = 0; i < markerPins.current.length; i++) {
      markerPins.current[i].setMap(null);
    }
    markerPins.current = [];
  }

  function userdeleteMarkers(): void {
    for (let i = 0; i < usermarker.current.length; i++) {
      usermarker.current[i].setMap(null);
    }
    usermarker.current = [];
  }

  return (
    <>
      <div className={containerCssClass} ref={ref} />
    </>
  );
}


/* eslint-disable @typescript-eslint/no-explicit-any */
function getPosition(result: Result) {
  const lat = (result.rawData as any).yextDisplayCoordinate.latitude;
  const lng = (result.rawData as any).yextDisplayCoordinate.longitude;
  return { lat, lng };
}
export function scrollToRow(index: any) {
  let result: any = [].slice.call(document.querySelectorAll(`.result`) || [])[0];
  let offset: any = [].slice.call(document.querySelectorAll(`.result`) || [])[index];
  let o = offset.offsetTop - result.offsetTop;
  [].slice.call(document.querySelectorAll(".scrollbar-container") || []).forEach(function (el: any) {
    el.scrollTop = o;
  });
}
