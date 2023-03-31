import * as React from "react";
import favicon from "../images/favicon.png"
import Header from "../components/layouts/header";
import Footer from "../components/layouts/footer";
import "../index.css";
// import bannerImage from "../images/app-bg.png";
// import favicon from "../images/favicon-live.png";
import { JsonLd } from "react-schemaorg";
import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
} from "@yext/pages/components";

import {
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
  AnswerExperienceConfig
} from "../config/globalConfig";

import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";

// import Logo from "../images/logo.svg";
// import bannerImage from "../images/app-bg.png";
var currentUrl = "";
export const config: TemplateConfig = {
  stream: {
    $id: "root",
   
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "slug",
      "description",
      
   
    ],
    filter: {
      entityTypes: ["ce_root"],
     // savedFilterIds: [savedFilterId],
    },
    localization: {
      locales: ["fr-FR", "en_GB", "it-IT", "ja-JP", "de-DE"],
      primary: false,
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  //currentUrl = document.slug.toString() + ".html";
  return document.meta.locale + "/" + document.slug + "/"+ document.id +".html";
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
  const { description, dm_directoryParents, dm_directoryChildren ,_site} = document;

  const { name, slug, c_globalData } = document;
  let templateData = { document: document, __meta: __meta };

  var currentUrl = ""
const myArray = path.split("/");
currentUrl = myArray && myArray[1]
//console.log(currentUrl,"CURRENT")
const updatelocale = (locale: any) => {
  //console.log(locale,"test");
 return (window.location.pathname = `${locale}/${currentUrl}`);
};

  return (
    <>
      <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        {" "}
        <AnalyticsScopeProvider name={"city"}>
          

{/* <PageLayout gdata={_site}> */}
<Header
            ByredoLogo={_site.c_byradoLogo}
            ByredoLinks={_site.c_headerMenus}
          />
          {dm_directoryChildren ? (
            <>
              <div className="directory-root py-5 lg:py-[60px]">
                <div className="container">
                  <div className="flex flex-wrap -mx-4">
                    {dm_directoryChildren.map((child: any) => {
                      return (
                        <>
                          <div className="w-1/2 md:w-1/3 lg:w-1/4 px-4">
                            <a
                              href={slug + "/" + child.slug + ".html"}
                              key={child.slug}
                              className="hover:text-red"
                            >
                              {child.name} {child.dm_directoryChildrenCount}
                            </a>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
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
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </>
  );
};

export default Root;
