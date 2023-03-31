/**
 * This is an GetDirection Component which returns the Store address in Google map.
 * @param entitiy 
 */
export default function getDirectionUrl(entitiy: any) {
  let address_string = "";
  address_string =
    `${entitiy.address?.line1},` +
    `${entitiy.address?.line2},` +
    `${entitiy.address?.city},` +
    `${entitiy.address?.region},` +
    `${entitiy.address?.postalCode},` +
    `${entitiy.address?.countryCode}`;
  address_string = address_string.replace("undefined,", "");
  let origin: any = null;
  if (entitiy.address?.city) {
    origin = entitiy.address?.city;
  } else if (entitiy.address?.region) {
    origin = entitiy.address?.region;
  } else {
    origin = entitiy.address?.country;
  }
  if (navigator.geolocation) {
    const error = () => {
      const message_string =
        "Unable to determine your location. please share your location";
      if (confirm(message_string) != true) {
        const getDirectionUrl =
          "https://www.google.com/maps/dir/?api=1&destination=" +
          address_string +
          "&origin=" +
          origin;

        window.open(getDirectionUrl, "_blank");
      } else {
        return false;
      }
    };
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        const getDirectionUrl =
          "https://www.google.com/maps/dir/?api=1&destination=" +
          address_string +
          "&origin=" +
          currentLatitude +
          "," +
          currentLongitude;
        window.open(getDirectionUrl, "_blank");
      },
      error,
      {
        timeout: 10000,
      }
    );
  }
}
