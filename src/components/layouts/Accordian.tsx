import { Link } from "@yext/pages/components";
import React, { useState } from "react";

type PropType = {
  title: string;
  links?: null | {
        link?: URL;
        label: string;
      }[];
  labels?: string[] | null;
};

function Accordian({ title, links = null, labels = null }: PropType) {

  const [show, setShow] = useState<string>("");
  return (
    <div className="footer-link-column">
      <h3
        className="text-xl pb-4"
        onClick={() =>
          setShow((prevShow) => (prevShow === "open" ? "" : "open"))
        }
      >
        {title}
      </h3>
      {links && (
        <ul className={`hide-in-mobile ${show}`}>
          {links.map((e: any, index: any) => {
            return (
              <li key={index}>
                {e?.link && e?.label && <Link href={e.link}>{e.label}</Link>}
              </li>
            );
          })}
        </ul>
      )}

      {labels && (
        <ul className={`hide-in-mobile ${show}`}>
          {labels.map((e: any, index: any) => {
            return (
              <li key={index}>
                <span className="pr-3">-</span>
                {e}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Accordian;
