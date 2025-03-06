import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import LocationForm from "./Components/LocationForm";
import WeeklyForecast from "./Components/WeeklyForecast";
import HourToHourForecast from "./Components/HourToHourForecast";
import "./Styles/App.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

 const [isVisibleArrow, setIsVisibleArrow] = useState<boolean>(false);

 useEffect(() => {
  const handleArrow = () => {
    setIsVisibleArrow(window.scrollY > 50);
  }

  window.addEventListener("scroll", handleArrow);

  handleArrow();

  return () => window.removeEventListener("scroll", handleArrow);

 }, []);

 const handleScrollTop = () => {
   window.scrollTo({ top: 0, behavior: "smooth" });
 }

  const [reminder, setReminder] = useState<boolean>(false);

  /* Responsive children components */

  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 700);
  const [isTableMobileView, setIsTableMobileView] = useState<boolean>(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  useEffect(() => {
    const handleTableResize = () => setIsTableMobileView(window.innerWidth < 1200);
    window.addEventListener("resize", handleTableResize);
    return () => window.removeEventListener("resize", handleTableResize);
  }, [])

  useEffect(() => {
    document.title = "Weather info";
  }, [reminder]);

  const handleReminder = (): void => {
    setReminder(!reminder);
  };

  const [cityInfo, setCityInfo] = useState<object | null>(null);

  const [renderCity, setRenderCity] = useState<string | null>(null);

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

  // Chart varriables, ect.

  const [dataChart, setDataChart] = useState<
    { time: number; temperature: number; precipitation: number }[]
  >([]);

  const [toggleChart, setToggleChart] = useState<boolean>(false);

  const handleChart = (): void => {
    setToggleChart(!toggleChart);
  };

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

    const temperature24h: string[] = [];
    const precipitation24h: string[] = [];

    for (let i = 0; i < 24; ++i) {
      temperature24h.push(data.hourly.temperature_2m[i].toString());
      precipitation24h.push(data.hourly.precipitation[i].toString());
    }

    setCurrentData(data.current);
    setWeeklyData(data.daily);
    setHourlyData(data.hourly);
    setHourlyUnits(data.hourly_units);
    setSunrise(data.daily.sunrise[0].slice(11).replace(":", ""));
    setSunset(data.daily.sunset[0].slice(11).replace(":", ""));

    const newDataChart = temperature24h.map((temp, i) => ({
      time: i,
      temperature: parseFloat(temp),
      precipitation: parseFloat(precipitation24h[i]),
    }));

    console.log("Hourly data: ", data.hourly);
    setDataChart(newDataChart);
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
      let upperCity: string = city.charAt(0).toUpperCase() + city.slice(1);
      setRenderCity(upperCity);
      currentCity(latitude, longitude);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        {isVisibleArrow && <img onClick={handleScrollTop} className="arrow-top" src={process.env.PUBLIC_URL + 'react-weather-app-arrow.png'} alt="top arrow"/>}
        <Header
          setToggleLocationForm={setToggleLocationForm}
          handleReminder={handleReminder}
        />
        <Routes>
          <Route
            path="/"
            element={
              <div className="homePage">
                {/* <h1>Weather app</h1> */}
                {toggleLocationForm ? (
                  ""
                ) : (
                  <>
                    <LocationForm
                      updateCity={updateCity}
                      setToggleLocationForm={setToggleLocationForm}
                    />
                  </>
                )}
                {currentData != null && toggleLocationForm === true ? (
                  <>
                    <div className="card-container">
                      <h2 className="city-name">
                        Current weather in <p className="city">{renderCity}</p>
                      </h2>
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
                      <button className="chart-button" onClick={handleChart}>
                        {toggleChart === false ? (
                          <span>
                            Swap to the{" "}
                            <span className="precipitation">precipitation</span>{" "}
                            chart
                          </span>
                        ) : (
                          <span>
                            Swap to the{" "}
                            <span className="temperature">temperature</span>{" "}
                            chart
                          </span>
                        )}
                      </button>
                    </div>
                    {toggleChart === false ? (
                      <ResponsiveContainer
                        width="95%"
                        height={300}
                        className="chart-style"
                      >
                        <LineChart data={dataChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
                          <XAxis
                            dataKey="time"
                            tick={{ fill: "whitesmoke"}}
                            tickFormatter={(time) => `${time} h`}
                          />
                          <YAxis
                            yAxisId="left"
                            tick={{ fill: "whitesmoke" }}
                            tickFormatter={(left) => `${left}  °C`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#222",
                              color: "#fff",
                              fontSize: "14px",
                            }}
                            labelFormatter={(label) => `${label} h`}
                            formatter={(value, name) => {
                              if (name === "temperature") return `${value} °C`;
                              return value;
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#8884d8"
                            yAxisId="left"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer
                        width="95%"
                        height={300}
                        className="chart-style"
                      >
                        <BarChart data={dataChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
                          <XAxis
                            dataKey="time"
                            tick={{ fill: "whitesmoke" }}
                            tickFormatter={(time) => `${time} h`}
                          />
                          <YAxis
                            yAxisId="right"
                            tick={{ fill: "whitesmoke" }}
                            tickFormatter={(right) => `${right} mm`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#222",
                              color: "#fff",
                              fontSize: "14px",
                            }}
                            labelFormatter={(label) => `${label} h`}
                            formatter={(value, name) => {
                              if (name === "precipitation")
                                return `${value} mm`;
                              return value;
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="precipitation"
                            fill="#82ca9d"
                            yAxisId="right"
                            label={{ fontSize: 16 }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            }
          />
          <Route
            path="/weekly-forecast"
            element={<WeeklyForecast weeklyData={weeklyData} isMobileView={isMobileView}/>}
          />
          <Route
            path="/hour-to-hour-forecast"
            element={
              <HourToHourForecast
                hourlyData={hourlyData}
                hourlyUnits={hourlyUnits}
                sunrise={sunrise}
                sunset={sunset}
                isTableMobileView={isTableMobileView}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

