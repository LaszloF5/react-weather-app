import React from "react";

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

interface HourToHourForecastProps {
  hourlyData: Hourly;
}

const HourToHourForecast: React.FC<HourToHourForecastProps> = ({
  hourlyData,
}) => {
  return (
    <div>
      {hourlyData.time.length > 0 ? (
        <>
          <h3>Hour to hour forecast</h3>
          <table>
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
                    <td>{hourlyData.cloud_cover[index]} %</td>
                    <td>{hourlyData.visibility[index]} m</td>
                    <td>{hourlyData.wind_speed_10m[index]} km/h</td>
                    <td>{hourlyData.wind_direction_10m[index]} °</td>
                    <td>{hourlyData.wind_gusts_10m[index]} km/h</td>
                    <td>{hourlyData.soil_temperature_0cm[index]} °C</td>
                    <td>{hourlyData.soil_moisture_0_to_1cm[index]} m³/m³</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default HourToHourForecast;
