import "../Styles/WeatherIcon.css";

const getWeatherIcon = (precipitation: number, cloudCover: number, time: string, sunrise: string, sunset: string): string => {
  const hour = parseInt(time.slice(11).replace(':', ''), 10);
  const isDaytime = hour > parseInt(sunrise, 10) && hour < parseInt(sunset, 10);
  const timeOfDay = isDaytime ? "day" : "night";

  if (precipitation >= 5) return `/heavy-rain-${timeOfDay}.png`;
  if (precipitation >= 1) return `/low-rain-${timeOfDay}.png`;

  if (cloudCover <= 20) return `/0-20cloud-${timeOfDay}.png`;
  if (cloudCover >= 21 && cloudCover <= 40) return `/21-40cloud-${timeOfDay}.png`;
  if (cloudCover >= 41 && cloudCover <= 60) return `/41-60cloud-${timeOfDay}.png`;
  if (cloudCover >= 61 && cloudCover <= 80) return `/61-80cloud-${timeOfDay}.png`;
  return `/81-100cloud-${timeOfDay}.png`;
};

const WeatherIcon = ({ precipitation, cloudCover, time, sunrise, sunset }: {
  precipitation: number;
  cloudCover: number;
  time: string;
  sunrise: string;
  sunset: string;
}) => {
  const iconSrc = getWeatherIcon(precipitation, cloudCover, time, sunrise, sunset);
  
  return (
    <img
      className="imgCss"
      src={process.env.PUBLIC_URL + iconSrc}
      alt="weather icon"
      width="24"
      height="24"
    />
  );
};

export default WeatherIcon;
