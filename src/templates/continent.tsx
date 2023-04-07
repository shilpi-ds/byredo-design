import * as React from "react";
import Header from "../components/layouts/header";
import Footer from "../components/layouts/footer";
import Continent from "../components/dm/Continent";
import BreadCrumbs from "../components/layouts/BreadCrumb";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/dm/SearchBar";
import SearchFile from "../components/locatorPage/SearchFile";
import { slugify } from "../config/globalConfig";
import "../types/i18n.ts";
import "../index.css";
import { useState, useEffect } from 'react';

import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";

export const config: TemplateConfig = {
  stream: {
    $id: "all-address",

    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",
      "c_children.name",
      "c_children.slug",
      "c_children.dm_directoryChildren.name",
      "c_children.dm_directoryChildren.slug",
      "c_children.dm_directoryChildren.dm_directoryChildren.name",
      "c_children.dm_directoryChildren.dm_directoryChildren.slug",
      "c_children.dm_directoryChildren.dm_directoryChildren.dm_baseEntityCount",
      "c_children.dm_directoryChildren.dm_baseEntityCount",
    ],
    filter: {
      entityTypes: ["ce_continents"],

    },
    localization: {
      locales: ["fr-FR", "en_GB", "it-IT", "ja-JP", "de-DE"],
      primary: false,
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  let url = `${document.meta.locale}/${document.slug?.toString()}.html`;
  if (!document.slug) {
    let slugString = document.id + "-" + document.name;
    slugString = slugify(slugString);
    url = `${document.meta.locale}/${slugString}.html`;
  }
  return url;
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Root: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
  __meta,
}) => {
  const { description, dm_directoryParents, dm_directoryChildren, _site, c_children } = document;


  const { name, slug, c_globalData } = document;
  let templateData = { document: document, __meta: __meta };
  const { i18n } = useTranslation();
  i18n.changeLanguage(document.meta.locale);
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  let currentUrl = ""
  const myArray = path.split("/");
  currentUrl = myArray && myArray[1]
  const updatelocale = (locale: any) => {
    return (window.location.pathname = `${locale}/${currentUrl}`);
  };

  //console.log(c_children, "child")
  return (
    <>
      {/* <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        {" "}
        <AnalyticsScopeProvider name={"city"}>
           */}

      {/* <PageLayout gdata={_site}> */}
      <Header
        ByredoLogo={_site.c_byradoLogo}
        ByredoLinks={_site.c_headerMenus}
      />
       <BreadCrumbs
                        name={name}
                        address={""}
                        locale={document.meta.locale}
                        parents={undefined}
                        //mainparent={document._site.c_relatedContinent}
                    />
         <div className="search-form">
                            <div className="text-center max-w-[38.125rem] mx-auto relative">
                                <SearchBar
                                    locale={document.meta.locale}
                                    _site={document._site}
                                />
                            </div>
                        </div>
          <div className="directory-country py-5 lg:py-[60px]">
            <Continent child={c_children} locale={document.meta.locale} document={document.meta}/>
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
      {/* </AnalyticsScopeProvider>
      </AnalyticsProvider> */}
    </>
  );
};

export default Root;