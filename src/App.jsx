import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';

const App = () => {

  // useMap hook to re-render the map when IP changes
  function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  }

  const apiKey = import.meta.env.VITE_MY_API_KEY;
  const geoEncodingApiKey = import.meta.env.VITE_MY_API_KEY_GEOENCODING;

  const [userIp, setUserIp] = useState("");
  const [userData, setUserData] = useState({});
  const [inputIp, setInputIp] = useState("");
  const [coordinates, setCoordinates] = useState([0, 0]);

  const fetchUserIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      console.log(data.ip);
      setUserIp(data.ip);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchUserIp();
  }, []);

  const fetchDataByIp = async () => {
    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${userIp}`
      );
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.log("Error is: ", error);
    }
  };
  console.log(userData);

  useEffect(() => {
    fetchDataByIp();
  }, [userIp]);

  const fetchCoordinates = async () => {
    const location = `${userData.location?.region}, ${userData.location?.country}`;
    console.log(location);

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          location
        )}&key=${geoEncodingApiKey}`
      );
      const coordinatesData = await response.json();
      console.log(coordinatesData);

      if (coordinatesData.results.length > 0) {
        const { lat, lng } = coordinatesData.results[0].geometry;
        setCoordinates([lat, lng]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (userData) {
    fetchCoordinates();
    }
  }, [userData]);

  console.log(coordinates);

  const customIcon = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [41, 50], 
  });

  const handleClick = () => {
    setUserIp(inputIp);
    setInputIp("")
  };



  return (
    <>
      <div className='bg-[url("/images/pattern-bg-mobile.png")] md:bg-[url("/images/pattern-bg-desktop.png")] w-full h-[16.5rem] bg-no-repeat'>
        <h1 className="text-center pt-5 text-white text-[1.5rem] font-medium">
          IP Address Tracker
        </h1>

        <div className="w-[320px] md:w-[550px] mx-auto flex items-center mt-5">
          <input
            className="w-[100%] text-[12px] md:text-[20px] p-[19px] rounded-l-xl pl-4"
            type="text"
            placeholder="Search for any IP address or domain"
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            autoFocus="off"
          />
          <button
            onClick={handleClick}
            className="bg-black p-[23px] md:p-[30px] rounded-r-xl"
          >
            <img src="./images/icon-arrow.svg" alt="icon-arrow" className="" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:gap-[2rem] md:px-7 md:text-left gap-4 text-center bg-white w-[320px] md:w-[60rem] md:h-[8.5rem] mx-auto rounded-xl mt-5 md:mt-10 shadow-xl py-5">
          <div className="md:w-[15rem] border-r-0 md:border-r-[1px] border-[hsl(0,0%,59%)]">
            <p className="text-[hsl(0,0%,59%)] text-[10px] tracking-widest font-bold uppercase mb-1">
              IP Address
            </p>
            <span className="text-[hsl(0,0%,17%)] font-medium text-[20px]">
              {userData.ip}
            </span>
          </div>

          <div className="md:w-[12rem] border-r-0 md:border-r-[1px] border-[hsl(0,0%,59%)]">
            <p className="text-[hsl(0,0%,59%)] text-[10px] tracking-widest font-bold uppercase mb-1">
              Location
            </p>
            <span className="text-[hsl(0,0%,17%)] font-medium text-[20px]">
              {userData.location?.country}, {userData.location?.region}
            </span>
          </div>

          <div className="md:w-[15rem] border-r-0 md:border-r-[1px] border-[hsl(0,0%,59%)]">
            <p className="text-[hsl(0,0%,59%)] text-[10px] tracking-widest font-bold uppercase mb-1">
              Timezone
            </p>
            <span className="text-[hsl(0,0%,17%)] font-medium text-[20px]">
              UTC {userData.location?.timezone}
            </span>
          </div>

          <div className="md:w-[10rem]">
            <p className="text-[hsl(0,0%,59%)] text-[10px] tracking-widest font-bold uppercase mb-1">
              ISP
            </p>
            <span className="text-[hsl(0,0%,17%)] font-medium text-[20px]">
              {userData.isp ? userData.isp : "-"}
            </span>
          </div>
        </div>

        {coordinates[0] !== 0 && coordinates[1] !== 0 && (
          <MapContainer
            center={coordinates}
            zoom={13}
            style={{ height: "525px", width: "100%" }}
            className="relative -z-10 bottom-[11.5rem] md:bottom-[4.5rem]"
          >
            <ChangeMapView coords={coordinates} />

            {/* TileLayer for the map tiles (OpenStreetMap in this case) */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker with Popup */}
            <Marker position={coordinates} icon={customIcon}>
              {/* <Popup>
                <img src="./images/icon-location.svg" alt="icon-location" />
                A marker popup. <br /> Easily customizable.
              </Popup> */}
            </Marker>
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default App;
