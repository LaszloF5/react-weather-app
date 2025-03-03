import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import LocationForm from "./Components/LocationForm";
import WeeklyForecast from "./Components/WeeklyForecast";
import HourToHourForecast from "./Components/HourToHourForecast";
import "./Styles/App.css";

interface CurrentData {
  time: string;
  cloud_cover: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  precipitation: number;
}

interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
}

interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  soil_temperature_0cm: number[];
  soil_moisture_0_to_1cm: number[];
}

interface Units {
  time: string[];
  temperature_2m: string[];
  relative_humidity_2m: string[];
  dew_point_2m: string[];
  precipitation_probability: string[];
  precipitation: string[];
  cloud_cover: string[];
  visibility: string[];
  wind_speed_10m: string[];
  wind_direction_10m: string[];
  wind_gusts_10m: string[];
  soil_temperature_0cm: string[];
  soil_moisture_0_to_1cm: string[];
}

export default function App() {
  const [cityInfo, setCityInfo] = useState<object | null>(null);

  const temperature24h: string[] = [];
  const precipitation24h: string[] = [];


  const [toggleLocationForm, setToggleLocationForm] = useState<boolean>(false);

  const [sunset, setSunset] = useState<string>("");
  const [sunrise, setSunrise] = useState<string>("");

  const [currentData, setCurrentData] = useState<CurrentData | null>(null);

  const [hourlyUnits, setHourlyUnits] = useState<Units>({
    time: [],
    temperature_2m: [],
    relative_humidity_2m: [],
    dew_point_2m: [],
    precipitation_probability: [],
    precipitation: [],
    cloud_cover: [],
    visibility: [],
    wind_speed_10m: [],
    wind_direction_10m: [],
    wind_gusts_10m: [],
    soil_temperature_0cm: [],
    soil_moisture_0_to_1cm: [],
  });

  const [weeklyData, setWeeklyData] = useState<DailyData>({
    time: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    sunrise: [],
    sunset: [],
    uv_index_max: [],
    precipitation_sum: [],
  });

  const [hourlyData, setHourlyData] = useState<Hourly>({
    time: [],
    temperature_2m: [],
    relative_humidity_2m: [],
    dew_point_2m: [],
    precipitation_probability: [],
    precipitation: [],
    cloud_cover: [],
    visibility: [],
    wind_speed_10m: [],
    wind_direction_10m: [],
    wind_gusts_10m: [],
    soil_temperature_0cm: [],
    soil_moisture_0_to_1cm: [],
  });

  const currentCity = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,soil_temperature_0cm,soil_moisture_0_to_1cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=Europe%2FBerlin`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data from currentCity: ", data);
    setCityInfo({
      weather: data,
    });
    for (let i = 0; i < 24; ++i) {
      temperature24h.push(data.hourly.temperature_2m[i]);
      precipitation24h.push(data.hourly.precipitation[i]);
    }
    setCurrentData(data.current);
    setWeeklyData(data.daily);
    setHourlyData(data.hourly);
    setHourlyUnits(data.hourly_units);
    setSunrise(data.daily.sunrise[0].slice(11).replace(":", ""));
    setSunset(data.daily.sunset[0].slice(11).replace(":", ""));
    console.log('Hőmérséklet: ', temperature24h);
    console.log('csapadék: ', precipitation24h);
  };

  const updateCity = async (city: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      currentCity(latitude, longitude);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <Header setToggleLocationForm={setToggleLocationForm}/>
        <Routes>
          <Route
            path="/"
            element={
              <div className="homePage">
                {/* <h1>Weather app</h1> */}
                {toggleLocationForm ? '' : <LocationForm updateCity={updateCity} setToggleLocationForm={setToggleLocationForm}/>}
                {currentData != null && toggleLocationForm === true ? (
                  <ul className="currentData-ul">
                    <li className="currentData-ul_li">
                      Last refresh time: {currentData.time.slice(11)}
                    </li>
                    <li className="currentData-ul_li">
                      Cloud Cover: {currentData.cloud_cover} %
                    </li>
                    <li className="currentData-ul_li">
                      Temperature: {currentData.temperature_2m} °C
                    </li>
                    <li className="currentData-ul_li">
                      Humidity: {currentData.relative_humidity_2m} %
                    </li>
                    <li className="currentData-ul_li">
                      Wind Speed: {currentData.wind_speed_10m} km/h
                    </li>
                    <li className="currentData-ul_li">
                      Precipitation: {currentData.precipitation} mm
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </div>
            }
          />
          <Route
            path="/weekly-forecast"
            element={<WeeklyForecast weeklyData={weeklyData} />}
          />
          <Route
            path="/hour-to-hour-forecast"
            element={
              <HourToHourForecast
                hourlyData={hourlyData}
                hourlyUnits={hourlyUnits}
                sunrise={sunrise}
                sunset={sunset}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

/*
  TODO:
  A főoldalra a weekly adatokból csinálni egy chartot victory charttal, vagy óránként lebontásba az adott napról a főoldalon, és a weekly-nél lenne a weeklyről 1 chart.
*/