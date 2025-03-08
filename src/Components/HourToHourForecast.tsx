import React, { useEffect } from "react";
import "../Styles/HourToHourForecast.css";
import WeatherIcon from "./WeatherIcon";

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

interface HourToHourForecastProps {
  hourlyData: Hourly;
  hourlyUnits: Units;
  sunrise: string;
  sunset: string;
  isTableMobileView: boolean;
}

const HourToHourForecast: React.FC<HourToHourForecastProps> = ({
  hourlyData,
  hourlyUnits,
  sunrise,
  sunset,
  isTableMobileView
}) => {
    useEffect(() => {
      document.title = "Weather info | Hour to hour forecast";
    }, []);
  return (
    <div className="container">
      {hourlyData.time.length > 0 ? (
        <>
          <h2 className="HTH-h2">Hour to hour forecast</h2>
          {isTableMobileView ? (<div className="HourToHourForecast-list-container">
            {hourlyData.time.map((date, index) => (
              <ul key={index} className="forecast-ul">
                <li className="time hth-li">{date.replace("T", " ")}</li>
                <li className="hth-li">Temperature: {hourlyData.temperature_2m[index]} {hourlyUnits.temperature_2m}</li>
                <li className="hth-li">Humidity: {hourlyData.relative_humidity_2m[index]} {hourlyUnits.relative_humidity_2m}</li>
                <li className="hth-li">Dew Point: {hourlyData.dew_point_2m[index]} {hourlyUnits.dew_point_2m}</li>
                <li className="hth-li">Precipitation: {hourlyData.precipitation[index]} {hourlyUnits.precipitation}</li>
                <li className="hth-li">Precip. Prob: {hourlyData.precipitation_probability[index]} {hourlyUnits.precipitation_probability}</li>
                <li className="hth-li">Cloud Cover: {hourlyData.cloud_cover[index]} {hourlyUnits.cloud_cover}</li>
                <li className="hth-li">Visibility: {hourlyData.visibility[index]} {hourlyUnits.visibility}</li>
                <li className="hth-li">Wind Speed: {hourlyData.wind_speed_10m[index]} {hourlyUnits.wind_speed_10m}</li>
                <li className="hth-li">Wind Direction: {hourlyData.wind_direction_10m[index]}°</li>
                <li className="hth-li">Wind Gusts: {hourlyData.wind_gusts_10m[index]} {hourlyUnits.wind_gusts_10m}</li>
                <li className="hth-li">Soil Temp: {hourlyData.soil_temperature_0cm[index]} {hourlyUnits.soil_temperature_0cm}</li>
                <li className="hth-li">Soil Moisture: {hourlyData.soil_moisture_0_to_1cm[index]} {hourlyUnits.soil_moisture_0_to_1cm}</li>
              </ul>
            ))}
          </div>) :
          (<table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature</th>
                <th>Relative humidity</th>
                <th>Dew Point</th>
                <th>Precipitation Probability</th>
                <th>Precipitation</th>
                <th>Cloud Cover</th>
                <th>Visibility</th>
                <th>Wind Speed</th>
                <th>Wind Direction</th>
                <th>Wind Gusts</th>
                <th>Soil Temperature</th>
                <th>Soil Moisture</th>
              </tr>
            </thead>
            <tbody>
              {hourlyData.time.map((date, index) => {
                return (
                  <tr key={index + "a"}>
                    <td>{date.replace("T", " ")}</td>
                    <td>{hourlyData.temperature_2m[index]} °C</td>
                    <td>{hourlyData.relative_humidity_2m[index]} %</td>
                    <td>{hourlyData.dew_point_2m[index]} °C</td>
                    <td>{hourlyData.precipitation_probability[index]} %</td>
                    <td>{hourlyData.precipitation[index]} mm</td>
                    <td>
                      {hourlyData.cloud_cover[index]} %
                      <WeatherIcon
                        precipitation={hourlyData.precipitation[index]}
                        cloudCover={hourlyData.cloud_cover[index]}
                        time={hourlyData.time[index]}
                        sunrise={sunrise}
                        sunset={sunset}
                      />
                    </td>
                    <td>{hourlyData.visibility[index]} m</td>
                    <td>{hourlyData.wind_speed_10m[index]} km/h</td>
                    <td>
                      {hourlyData.wind_direction_10m[index]} °{" "}
                      <img
                      className="table-arrow"
                        src={process.env.PUBLIC_URL + "/arrow.png"}
                        alt="arrow"
                        style={{
                          transform: `rotate(${hourlyData.wind_direction_10m[index]}deg)`,
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    </td>
                    <td>{hourlyData.wind_gusts_10m[index]} km/h</td>
                    <td>{hourlyData.soil_temperature_0cm[index]} °C</td>
                    <td>{hourlyData.soil_moisture_0_to_1cm[index]} m³/m³</td>
                  </tr>
                );
              })}
            </tbody>
          </table> )}
        </>
      ) : (
        <p className="response-p">No data available!</p>
      )}
    </div>
  );
};

export default HourToHourForecast;