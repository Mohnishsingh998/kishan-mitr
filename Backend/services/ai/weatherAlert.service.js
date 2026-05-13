'use strict';

class WeatherAlertService {
  constructor() {
    this.huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
    this.openWeatherKey = process.env.OPENWEATHER_API_KEY;
  }

  async getWeatherAlerts(location) {
    const currentWeather = await this.getCurrentWeather(location);
    const forecast = await this.getForecast(location);
    const alerts = this.analyzeWeather(currentWeather, forecast);
    const advisories = this.generateAdvisories(alerts, forecast);

    return {
      location,
      current: currentWeather,
      alerts,
      advisories,
      forecast: forecast.slice(0, 7),
      generatedAt: new Date(),
    };
  }

  async getCurrentWeather(location) {
    if (!this.openWeatherKey) {
      return this.getMockCurrentWeather(location);
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${this.openWeatherKey}&units=metric`
      );
      const data = await response.json();

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        visibility: data.visibility,
        clouds: data.clouds.all,
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      return this.getMockCurrentWeather(location);
    }
  }

  getMockCurrentWeather(location) {
    return {
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 20,
      windSpeed: 10 + Math.random() * 10,
      description: 'Partly cloudy',
      icon: '02d',
      pressure: 1013,
      visibility: 8000,
      clouds: 40,
    };
  }

  async getForecast(location) {
    if (!this.openWeatherKey) {
      return this.getMockForecast();
    }

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.openWeatherKey}`
      );
      const geoData = await geoResponse.json();

      if (!geoData[0]) {
        return this.getMockForecast();
      }

      const { lat, lon } = geoData[0];

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.openWeatherKey}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      return forecastData.list.map(item => ({
        date: item.dt_txt.split(' ')[0],
        time: item.dt_txt.split(' ')[1],
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: item.pop * 100,
      }));
    } catch (error) {
      console.error('Forecast API error:', error.message);
      return this.getMockForecast();
    }
  }

  getMockForecast() {
    const forecast = [];
    const today = new Date();
    const conditions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Light rain', 'Partly cloudy'];

    for (let i = 0; i < 40; i++) {
      const date = new Date(today);
      date.setHours(date.getHours() + i * 3);

      forecast.push({
        date: date.toISOString().split('T')[0],
        time: date.toHours() + ':00',
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 40,
        windSpeed: 5 + Math.random() * 15,
        description: conditions[Math.floor(Math.random() * conditions.length)],
        icon: '01d',
        precipitation: Math.random() * 50,
      });
    }

    return forecast;
  }

  analyzeWeather(current, forecast) {
    const alerts = [];

    if (current.temperature > 40) {
      alerts.push({
        type: 'heatwave',
        severity: 'high',
        message: 'Extreme heat warning - Temperature above 40°C',
        recommendation: 'Avoid field work during peak hours (12-4 PM)',
      });
    } else if (current.temperature > 35) {
      alerts.push({
        type: 'heat',
        severity: 'medium',
        message: 'High temperature alert',
        recommendation: 'Drink water, take breaks, work in early morning',
      });
    }

    if (current.humidity > 85) {
      alerts.push({
        type: 'humidity',
        severity: 'medium',
        message: 'High humidity - disease risk elevated',
        recommendation: 'Monitor for fungal diseases, avoid evening spraying',
      });
    }

    const upcomingRain = forecast.filter(f => f.precipitation > 60);
    if (upcomingRain.length > 0) {
      alerts.push({
        type: 'rain',
        severity: 'medium',
        message: `Rain expected in next 3 days - ${upcomingRain.length} days with >60% probability`,
        recommendation: 'Postpone pesticide application, ensure drainage',
      });
    }

    if (current.windSpeed > 50) {
      alerts.push({
        type: 'storm',
        severity: 'high',
        message: 'Strong wind warning',
        recommendation: 'Secure polytunnels, avoid spraying, harvest if crop ready',
      });
    }

    const coldDays = forecast.filter(f => f.temperature < 10);
    if (coldDays.length > 0) {
      alerts.push({
        type: 'cold',
        severity: 'low',
        message: `Cold wave expected - ${coldDays.length} days below 10°C`,
        recommendation: 'Protect sensitive crops with mulch, irrigate during day',
      });
    }

    return alerts;
  }

  generateAdvisories(alerts, forecast) {
    const advisories = [];

    advisories.push({
      category: 'general',
      title: 'Daily Farm Advisory',
      tasks: [
        'Check weather before any field activity',
        'Inspect crops for pest/disease signs',
        'Ensure irrigation schedule matches weather',
        'Record all farm activities',
      ],
    });

    const hasRain = alerts.some(a => a.type === 'rain');
    if (hasRain) {
      advisories.push({
        category: 'rain',
        title: 'Rain Advisory',
        tasks: [
          'Avoid pesticide/insecticide spraying',
          'Check field drainage, clear blocked channels',
          'Postpone harvesting of grains',
          'Move livestock to shelter',
          'Store harvested produce in dry place',
        ],
      });
    }

    const hasHeat = alerts.some(a => a.type === 'heat' || a.type === 'heatwave');
    if (hasHeat) {
      advisories.push({
        category: 'heat',
        title: 'Heat Advisory',
        tasks: [
          'Water crops early morning or late evening',
          'Apply mulch to conserve moisture',
          'Provide shade to livestock',
          'Avoid chemical spraying in heat',
          'Monitor crops for heat stress',
        ],
      });
    }

    advisories.push({
      category: 'crop_stage',
      title: 'Crop-Specific Advisory',
      details: this.getCropAdvisoryByWeather(forecast),
    });

    return advisories;
  }

  getCropAdvisoryByWeather(forecast) {
    const avgTemp = forecast.slice(0, 7).reduce((a, b) => a + b.temperature, 0) / 7;
    const avgRain = forecast.slice(0, 7).reduce((a, b) => a + b.precipitation, 0) / 7;

    if (avgRain > 50) {
      return 'Heavy rainfall expected - ensure drainage, avoid sowing, postpone transplanting';
    } else if (avgTemp > 35) {
      return 'High temperature - increase irrigation frequency, use mulching, provide shade';
    } else if (avgTemp < 10) {
      return 'Cold weather - protect sensitive crops, use polythene covers, irrigate during day';
    }
    return 'Normal weather conditions - good for most farm activities';
  }

  async getHistoricalWeather(location, days = 30) {
    const historical = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      historical.push({
        date: date.toISOString().split('T')[0],
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 40,
        rainfall: Math.random() > 0.7 ? Math.random() * 20 : 0,
      });
    }

    return historical;
  }
}

module.exports = new WeatherAlertService();