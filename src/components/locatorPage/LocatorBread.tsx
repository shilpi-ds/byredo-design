import { Link } from "@yext/pages/components";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { svgIcons } from "../../svg icons/svgIcon";
const LocatorBread = (props: any) => {
  const { t, i18n } = useTranslation();
    return (
        <div className="breadcrumb">
            <ul>
              <li>
                <Link href="#">
               {t("Home")}
                </Link>
              </li>
             
              <li>{t("Store Locator")}</li>
            </ul>
        </div>
      );
    };
    export default LocatorBread;