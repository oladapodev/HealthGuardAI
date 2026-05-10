import axios from "axios";

export async function contextAgent(location = "Lagos") {
  try {
    if (!process.env.WEATHER_API_KEY) {
      throw new Error("Missing WEATHER_API_KEY");
    }

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const pollutionRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherRes.data.coord.lat}&lon=${weatherRes.data.coord.lon}&appid=${process.env.WEATHER_API_KEY}`
    );

    const weather = weatherRes.data;
    const pollution = pollutionRes.data.list[0];

    return {
      temperature: weather.main?.temp,
      humidity: weather.main?.humidity,
      condition: weather.weather?.[0]?.description,
      aqi: pollution.main.aqi, // 1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor
      pm2_5: pollution.components.pm2_5,
      pm10: pollution.components.pm10,
      no2: pollution.components.no2,
      o3: pollution.components.o3,
      co: pollution.components.co,
      so2: pollution.components.so2,
      location,
    };

  } catch (err) {
    console.log("Context Agent Error:", err.message);

    return {
      temperature: null,
      humidity: null,
      condition: "unknown",
      location,
      error: true
    };
  }
}
