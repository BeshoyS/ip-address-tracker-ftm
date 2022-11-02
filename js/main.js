let mapSection = document.getElementById("mapSection");
let ipAddress = document.getElementById("ipAddress");
let ipLocation = document.getElementById("location");
let ipTimezone = document.getElementById("timezone");
let ipISP = document.getElementById("isp");
let form = document.getElementById("form");
let ipInp = document.getElementById("ipInp");
let errorMsg = document.getElementById("errMsg");

// Get client Ip Address
let currentIp = async function () {
  let res = await fetch("https://api.ipify.org?format=json");
  let { ip } = await res.json();
  return ip;
};

//get Ip Address's Data
async function getIpData(enteredIP) {
  //Ip address is client's own IP or IP address entered by the client
  let ip = enteredIP ? enteredIP : await currentIp();
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_ya7R4JoNWTZfIgDWY6WZLCHFwCnh7&ipAddress=${ip}`
  )
    .then((res) => res.json())
    .then(({ ip, location, isp }) => {
      ipAddress.innerHTML = `${ip}`;
      ipLocation.innerHTML = `${location?.city}, ${location?.country} ${
        location.postalCode ? "," + location.postalCode : ""
      }`;
      ipTimezone.innerHTML = `UTC ${location.timezone}`;
      ipISP.innerHTML = `${isp}`;
      maps(location.lat, location.lng);
    });
}
// data will return in the beginning of theload by the client's own IP address
getIpData();

//input function to get the IP address manually from the user
function getIP(e) {
  e.preventDefault();
  let inpRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (inpRegex.test(ipInp.value)) {
    errorMsg.style.display = "none";
    getIpData(ipInp.value);
  } else {
    errorMsg.style.display = "block";
  }
}

form.addEventListener("submit", getIP);

// Map
function maps(lat, lng) {
  // to refresh the map with every call
  mapSection.innerHTML = "";
  mapSection.innerHTML = `<div id="map"></div>`;
  let map = L.map("map", { zoomControl: false }).setView([lat, lng], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let markerStyle = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [33, 41],
    shadowAnchor: [22, 94],
  });

  L.marker([lat, lng], { icon: markerStyle }).addTo(map);
}
