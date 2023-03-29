import * as React from "react";
import favicon from "../images/favicon.png";
import Header from "../components/layouts/header";
import Footer from "../components/layouts/footer";
import { withTranslation } from "react-i18next";
import { useTranslation } from "react-i18next";
import useUpdateTranslation from "../hooks/useUpdateTranslation";
import "../types/i18n.ts";
import RtfConverter from "@yext/rtf-converter";
import {
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
  GetPath,
  Template,
  TemplateConfig,
} from "@yext/pages";

import "../index.css";
import { JsonLd } from "react-schemaorg";
import { Link } from "@yext/pages/components";
export const config: TemplateConfig = {
  stream: {
    $id: "404",
    filter: {
      entityIds: ["global-data"],
    },
    fields: ["id", "uid", "meta", "name"],
    localization: {
      locales: ["en_GB"],
      primary: false,
    },
  },
};

// The path must be exactly 404.html
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  let url;
  url = `/404.html`;

  //console.log(url,"url")
  return url;
};

//console.log(document.meta.locale);

// Add a title to the page
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: "404 Not Found",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/png",
          href: favicon,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "robots",
          content: "noindex, nofollow",
        },
      },
    ],
  };
};

// Template that will show as the page
const FourOhFour: Template<TemplateRenderProps> = ({ document, path }) => {
  const { _site } = document;
  if (_site.c_fourDes) {
    var Desc = RtfConverter.toHTML(_site.c_fourDes);
  }
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(document.meta.locale);
  useUpdateTranslation(_site, document.meta.locale);
  // console.log(_site,"site");
  var currentUrl = "";
  const myArray = path.split("/");
  currentUrl = myArray && myArray[1];
  //console.log(currentUrl,"CURRENT")
  const updatelocale = (locale: any) => {
    //console.log(locale,"test");
    return (window.location.pathname = `${locale}/${currentUrl}`);
  };
  return (
    <>
      {/* <JsonLd<FourOhFour>
        item={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Well Pharmacy",
          url: "https://www.well.co.uk/",
          logo: "https://images.prismic.io/wellpharmacy-test/ad06d0dc-d97a-4148-a2ab-2570adc639c3_Well.svg?auto=compress,format",
        }}
      /> */}
      <Header
        ByredoLogo={_site.c_byradoLogo}
        ByredoLinks={_site.c_headerMenus}
      />

      <div className="content-list ">
        <div className="container mx-96">
          <h1 className="text-2xl">{_site.c_fourTitle}.</h1>
          <br />
          <div
            className="leading-7 text-base text-gray-700 about-content"
            dangerouslySetInnerHTML={{ __html: Desc ? Desc : "" }}
          ></div>
          <br />
          <form className="max-w-sm px-0">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t("Search")}
                className="w-full py-5 pl-3 pr-4 text-gray-100 text-2xl border rounded-none outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-10 h-10 my-auto text-gray-100 left-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
          <div className="">
            <div className="text-2xl pb-3 font-semibold">{t("Go to")}</div>
            <ul className="text-lg leading-9 font-semibold">
              {_site.c_fourLinks?.map((element: any) => (
                <li>
                  {element?.link && element?.label && (
                    <a href={element.link}>{element.label}</a>
                  )}
                </li>
              ))}
              {/* <li> <Link href="https://www.byredo.com/eu_en/perfume/best-sellers/">Best Sellers</Link></li>
              <li> <Link href="https://www.byredo.com/eu_en/perfume/">Perfume</Link></li>
              <li> <Link href="https://www.byredo.com/eu_en/home-fragrance/">Home Fragrance</Link></li> */}
            </ul>
          </div>
        </div>
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
    </>
  );
};

export default FourOhFour;
