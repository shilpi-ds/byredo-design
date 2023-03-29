import { useSearchActions, useSearchState } from "@yext/search-headless-react";
import * as mapboxgl from "mapbox-gl";
import * as React from "react";
import { svgIcons } from "../../svg icons/svgIcon";

interface viewMoreProps {
  className: string;
  idName: string;
  buttonLabel: string;
  resetMap: Function;
}

export default function ViewMore(props: viewMoreProps): JSX.Element | null {
  const { className, idName, buttonLabel } = props;
  const searchAction = useSearchActions();
  const offset = useSearchState((state) => state.vertical.offset) || 0;
  const limit = useSearchState((state) => state.vertical.limit) || 10;
  let numResults = useSearchState((state) => state.vertical.resultsCount) || 0;
  const allResultsCountForVertical =
    useSearchState(
      (state) => state.vertical?.noResults?.allResultsForVertical.resultsCount
    ) || 0;
  const executeSearchWithNewOffset = (newOffset: number) => {
    searchAction.setOffset(newOffset);
    searchAction.executeVerticalQuery();
  };
  if (numResults == 0) {
    numResults = allResultsCountForVertical;
  }
  const maxPageCount = Math.ceil(numResults / limit);
  if (maxPageCount <= 1) {
    return null;
  }
  const pageNumber = offset / limit + 1;

  return (
    <>
      {pageNumber !== maxPageCount ? (
        <div className="find-more more-location">
          <button
            className={className}
            id={idName}
            onClick={() => {
              if (props.resetMap) {
                props.resetMap();
              }
              executeSearchWithNewOffset(offset + limit);
            }}
          >
            {svgIcons.ViewMore} {buttonLabel}
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
