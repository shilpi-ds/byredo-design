import { useSearchState, useSearchActions, DisplayableFacetOption } from "@yext/search-headless-react";
import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import Facet,{ FacetConfig, FacetCssClasses } from './Facet';
import { Divider } from './StaticFilters';
import { AnswerExperienceConfig, googleMapsConfig, limit } from "..//../config/globalConfig";
import * as React from "react";

interface FacetsProps {
  searchOnChange?: boolean,
  searchable?: boolean,
  collapsible?: boolean,
  defaultExpanded?: boolean,
  facetConfigs?: Record<string, FacetConfig>,
  customCssClasses?: FacetsCssClasses,
  cssCompositionMethod?: CompositionMethod,
  handleCloseModal:any
}

interface FacetsCssClasses extends FacetCssClasses {
  container?: string,
  divider?: string,
  buttonsContainer?: string,
  button?: string
}

const builtInCssClasses: FacetsCssClasses = {
  searchableInputElement: 'text-sm bg-white h-9 w-full outline-none p-2 mb-2 rounded-md border border-gray-300 focus:border-blue-600',
  container: 'w-full',
  buttonsContainer: 'flex justify-between mt-5',
  button: 'border border-gray-300 px-2.5 py-1 rounded-md',
  divider: 'w-full h-px bg-gray-200 my-4'
}

export default function Facets (props: FacetsProps): JSX.Element {
  const { 
    searchOnChange,
    searchable,
    collapsible,
    defaultExpanded,
    facetConfigs = {},
    customCssClasses,
    cssCompositionMethod,
    handleCloseModal
  } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  const facets = useSearchState(state => state.filters?.facets) || [];

  const searchAction = useSearchActions();
  const executeSearch = () => {
    searchAction.setOffset(0);
    searchAction.setVerticalLimit(limit);
    searchAction.executeVerticalQuery();
    handleCloseModal();
  }  
  const handleResetFacets = () => {
    searchAction.resetFacets();
    executeSearch();
    handleCloseModal();
  }

  const handleFacetOptionChange = (fieldId: string, option: DisplayableFacetOption) => {
    searchAction.setFacetOption(fieldId, option, !option.selected);
    if (searchOnChange) { 
      executeSearch();      
    }
  }

  const facetComponents = facets
    .filter(facet => facet.options?.length > 0)
    .map((facet, index, facetArray) => {
      const isLastFacet = index === facetArray.length -1;
      const overrideConfig = facetConfigs?.[facet.fieldId] ?? {};
      const config = {
        searchable,
        collapsible,
        defaultExpanded,
        ...overrideConfig
      }
      return (
        <div key={facet.fieldId}>
          <Facet
            facet={facet}
            {...config}
            customCssclasses={cssClasses}
            onToggle={handleFacetOptionChange} 
            />
          {!isLastFacet && <Divider customCssClasses={{ divider: cssClasses.divider }} cssCompositionMethod='replace'/>}
        </div>
      );
    });

  return (
    <div className={cssClasses.container+ "filter-items"}>
        {facetComponents}
      <div className={cssClasses.buttonsContainer+" filterButtons"}>
        {!searchOnChange && <button onClick={executeSearch} className={cssClasses.button}>Apply</button>}
        <button onClick={handleResetFacets} className={cssClasses.button}>Reset all</button>
      </div>
    </div>
  )
}
