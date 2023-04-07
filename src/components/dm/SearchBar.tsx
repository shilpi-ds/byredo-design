import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import * as React from "react";
import { useRef } from "react";
//import { svgIcons } from "../svgIcon ";
import { useTranslation } from "react-i18next";

const SearchBar = (props: any) => {
  const [inputvalue, setInputValue] = React.useState("");
  const inputRef = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    google.maps.event.addDomListener(
      place,
      "keydown",
      (e: {
        cancelBubble: boolean;
        keyCode: number;
        hasRanOnce: any;
        target: object;
      }) => {
        e.cancelBubble = true;
        if (e.keyCode === 13 || e.keyCode === 9) {
        }
      }
    );
    if (place) {
      setInputValue(place.formatted_address)
      window.location.replace(`/${props.locale}/index.html?query=${place.formatted_address}`);
    }
  }
  const { t } = useTranslation();

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyDZNQlSlEIkFAct5VzUtsP4dSbvOr2bE18" libraries={["places"]}>
        <StandaloneSearchBox
          onLoad={ref => inputRef.current = ref}
          onPlacesChanged={handlePlaceChanged}
        >
          <div>
            <div>
              <input type="text"
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
                value={inputvalue}
                placeholder={t("Search by Address, City, Po Code...")}
              />
              <button
                className="cus_btn search-submit"
                aria-label="Search bar icon"
                id="search-location-button"
              >
                Close
                {/* {svgIcons.searchClose} */}
              </button>
            </div>
          </div>
        </StandaloneSearchBox>
      </LoadScript>
    </>);
}
export default SearchBar;