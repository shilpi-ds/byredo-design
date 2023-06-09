import * as React from "react";
import { slugify, BaseUrl } from "../../config/globalConfig";
import { Link } from "@yext/pages/components";
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
type data = {
  name: any;
  parents: any;
  address: any;
  locale:any;
};
const BreadCrumbs = (props: data) => {
  //console.log(props.locale,"bread");
  const [list, setList] = React.useState(null);
  let breadcrumbs;
  const data: any = [];
  React.useEffect(() => {
    setURL(props.parents);
  }, [setList]);

  const setURL = (parents: any) => {
   
    if (parents) {
     //console.log(parents.length)
     //console.log(parents,"length") 
      for (let i = 0; i < parents.length; i++) {
        console.log(parents[i].meta.entityType.id,"hj");
        if (parents[i].meta.entityType.id == "ce_continents") {
          data.push({
            name: parents[i].name,
            slug: parents[i].slug,
            childrenCount: parents[i].dm_directoryChildrenCount,
          });
        }
        if (parents[i].meta.entityType.id == "ce_root") {
          
          parents[i].name = parents[i].name;
          parents[i].slug = parents[i].slug;
        }
        else if (parents[i].meta.entityType.id == "ce_country") {
          try {
            parents[i].name = regionNames.of(parents[i].name);
          } catch (error) {
            parents[i].name = parents[i].name;
          }
          parents[i].slug =
            parents[i - 1].slug + "/" + parents[i].slug;

          data.push({
            name: parents[i].name,
            slug: parents[i].slug,
          });
        } 
        else if (parents[i].meta.entityType.id == "ce_city") {
          parents[i].name = parents[i].name;
          parents[i].slug =
            parents[i - 1].slug + "/" + parents[i].slug;
          data.push({
            name: parents[i].name,
            slug: parents[i].slug,
          });
        }
        // else if (parents[i]?.meta?.entityType.id == "ce_city") {
        //   const citySlugPrifix = [];
        //   for (let c = 0; c < parents.length; c++) {
        //     if (
        //       parents[c]?.meta?.entityType.id != "ce_city" &&
        //       parents[c].meta.entityType.id != "ce_root"
        //     ) {
        //       if (typeof parents[c].slug == "undefined") {
        //         citySlugPrifix.push(
        //           slugify(parents[c].id + " " + parents[c].name)
        //         );
        //       } else {
        //         citySlugPrifix.push(parents[c].slug);
        //       }
        //     }
        //   }

        //   let citySlug = "";
        //   if (typeof parents[i].slug == "undefined") {
        //     citySlug = slugify(parents[i].id + " " + parents[i].name);
        //   } else {
        //     citySlug = parents[i].slug;
        //   }

        //   data.push({
        //     name: parents[i].name,
        //     slug: citySlugPrifix.join("/") + "/" + citySlug,
        //     childrenCount: parents[i].dm_directoryChildrenCount,
        //   });
        // }
    
      }
      

      breadcrumbs = data?.map((crumb: any, index: any) => (
        <li key={crumb.slug}>
          <Link
            href={`/${props.locale}/${crumb.slug}.html`}
            rel="noopener noreferrer"
            eventName={"BreadCrumbs" + (index + 1)}
          >
            {crumb.name}
          </Link>
        </li>
      ));
      setList(breadcrumbs);
    } else {
      setList(null);
    }
  };

  return (
    <div className="breadcrumb">
      <div className="container">
        <ul>
          <li className="home">
            <Link href={`/${props.locale}/index.html`}>Home</Link>
          </li>
          {list && (
            list)
            }
          <li>{props && props.name}</li>
        </ul>
      </div>
    </div>
  );
};
export default BreadCrumbs;
