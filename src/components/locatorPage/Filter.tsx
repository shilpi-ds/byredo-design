import * as React from "react";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  FilterSearch,
  VerticalResults,
  ResultsCount,
  Pagination,
  LocationBias,
  NumericalFacets,
  NumericalFacetsProps,
  StandardFacets,
  StandardFacetsProps,
} from "@yext/search-ui-react";
import { svgIcons } from "../../svg icons/svgIcon";
import Facets from "./Facets";
import { useSearchState } from "@yext/search-headless-react";
import { Link } from "@yext/pages/components";

const FilterAwesome = (props: any) => {
  const facets = useSearchState((state) => state.filters?.facets) || [];
  let subtitle: any;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [filterbutton, setfilterbutton] = useState(false);
  useEffect(() => {
    facets.map((i: any) => {
      if (i.options.length > 0) {
        setfilterbutton(true);
      } else {
        setfilterbutton(false);
      }
    });
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  function openModal() {
    facets.map((i: any) => {
      if (i.options.length > 0) {
        document.body.classList.add("locator-pop");
        setIsOpen(true);
      }
    });
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    document.body.classList.remove("locator-pop");
    setIsOpen(false);
  }

  return (
    <div className="filterButton">
      {filterbutton && (
        <button className="current-location hide-mob" onClick={openModal}>
          <div className="flex flex-row font-semibold">{svgIcons.filtericon} <span className="pl-2 text-black">Filter</span>  </div>
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <a
          onClick={closeModal}
          type="button"
          id="closeButton"
          data-modal-toggle="allergens-pdf"
          className="closeButton bg-closeIcon bg-no-repeat bg-center w-7 h-7 bg-[length:24px]"
        >
          <svg
            xmlns="http:www.w3.org/2000/svg"
            width="20.953"
            height="20.953"
            viewBox="0 0 20.953 20.953"
          >
            <path
              id="Icon_ionic-md-close"
              data-name="Icon ionic-md-close"
              d="M28.477,9.619l-2.1-2.1L18,15.9,9.619,7.523l-2.1,2.1L15.9,18,7.523,26.381l2.1,2.1L18,20.1l8.381,8.381,2.1-2.1L20.1,18Z"
              transform="translate(-7.523 -7.523)"
              fill="#B1B1B1"
            />
          </svg>
        </a>

        <Facets
          searchOnChange={false}
          searchable={false}
          collapsible={true}
          defaultExpanded={true}
          handleCloseModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default FilterAwesome;
