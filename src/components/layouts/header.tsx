import { Link } from "@yext/pages/components";
import * as React from "react";

type props = {
ByredoLogo: any;
ByredoLinks: any;
};

/**
 * 
 * @param props 
 * @returns HTML elements of Header Component
 */
const Header = (props: any) => {
  const {ByredoLogo, ByredoLinks } = props;
  return (
      <header className="site-header">
        <div className="container-lg">
          <div className="navbar">
            <div className="logo">
              <Link href={ByredoLogo.clickthroughUrl ? ByredoLogo.clickthroughUrl : "https://www.byredo.com/uk_en/"} className="">
                <img
                  src={ByredoLogo.image.url ? ByredoLogo.image.url : "https://a.mktgcdn.com/p-sandbox/cgYD0VBchE2WzmtcTHsS1MlzQyFCTlbcmgppR7wnNE8/600x120.png"}
                  alt={ByredoLogo.image.alternateText ? ByredoLogo.image.alternateText: "" }
                  title=""
                />
              </Link>
            </div>
            <div className="mid-nav">
              {ByredoLinks?.map((e: any) => {
                return (   
                  <>
                  {e?.link && e?.label &&( 
                    <div className="menu-item">
                      <Link href={e.link} className="">
                        {e.label}
                      </Link>
                    </div>
                  )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </header>
  );
};
export default Header;
