import * as React from "react";
import { useEffect, useState } from "react";

type Faq = {
  prop: any;
  faq_title: any;
  faq_description: any;
};

const Faq = (faqData: Faq) => {
  const [faq_Data, setFaq_Data] = useState([]);
  const [faqClass, setFaqClass] = useState("");
  const [selected, setselected] = useState(null);
  const [readmore, setReadmore] = useState(false);
  const isShowContent = (e: any, index: any) => {
    setselected(index);
    let parent = e.target.parentNode;
    let parent2 = e.target.parentNode.parentNode;
    if (
      parent.classList.contains("opened") ||
      parent2.classList.contains("opened")
    ) {
      setFaqClass("");
    } else {
      var acc = document.getElementsByClassName("faq-block");
      for (let s = 0; s < -1; s++) {
        acc[s].classList.remove("opened");
      }
      setFaqClass("opened");
    }
  };
  useEffect(() => {
    setFaq_Data(faqData.prop);
  });
  var length: number = 4;
  if (readmore) {
    length = faq_Data.length;
  } else {
    length = 4;
  }
  return (
    <>
      <div className="faq-sec ">
        <div className="container">
          <div className="faq-blocks">
            <div className="w-full mb-8 md:text-center">
              <h2 className="sec-title text-center">{faqData?.faq_title}</h2>
              {/* <p className="text-base md:text-xl">{faqData.faq_description}</p> */}
            </div>
            {faq_Data?.map((i: any, index: any) => {
              if (index < length) {
                return (
                  <div
                    id={index}
                    className={
                      selected == index ? `faq-block ${faqClass}` : "faq-block"
                    }
                    key={index}
                  >
                    <h4
                      className="faq-title"
                      onClick={(e) => isShowContent(e, index)}
                    >
                      {i.question.replace(/[^A-Za-z.]/g, " ")}
                      <span className="faq-icon"></span>
                    </h4>
                    <>
                      <div className="faq-content">
                        <p className="text-sm md:text-base text-black">
                          {i.answer.replace(/[^A-Za-z.]/g, " ")}
                        </p>
                      </div>
                    </>
                  </div>
                );
              }
            })}
            {length != faq_Data?.length && (
              <div className="space-x-5">
                <a
                  onClick={() => {
                    setReadmore(true);
                  }}
                  className="button mt-5 lg:mt-10 ml-96 !text-base"
                >
                  Read more
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Faq;
