import { useState, useEffect } from 'react';
import { sendRequest } from '../../utils/api';

export default function WeatherAlerts() {
  const [location, setLocation] = useState('Pune');
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAlerts();
  }, []);

  const getAlerts = async () => {
    setLoading(true);
    try {
      const res = await sendRequest(`/ai/weather-alerts?location=${encodeURIComponent(location)}`);
      setAlerts(res);
    } catch (err) {
      alert('Error getting weather alerts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-4">AI Weather Alerts & Advisory</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={getAlerts}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get Alerts'}
          </button>
        </div>
      </div>

      {alerts && (
        <div className="space-y-4">
          {alerts.alerts?.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-red-700 mb-2">⚠️ Weather Alerts</h3>
              <div className="space-y-2">
                {alerts.alerts.map((alert, i) => (
                  <div key={i} className="bg-white p-3 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{alert.type.toUpperCase()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{alert.severity}</span>
                    </div>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-sm text-earth-600 mt-2">💡 {alert.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alerts.alerts?.length === 0 && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <p className="text-green-700">✅ No weather alerts for your area. Conditions are favorable for farming.</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">Current Weather</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{Math.round(alerts.current?.temperature)}°C</p>
                <p className="text-sm text-earth-500">Temperature</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <p className="text-2xl font-bold text-cyan-700">{alerts.current?.humidity}%</p>
                <p className="text-sm text-earth-500">Humidity</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{Math.round(alerts.current?.windSpeed)} km/h</p>
                <p className="text-sm text-earth-500">Wind</p>
              </div>
              <div className="text-center p-4 bg-earth-50 rounded-lg">
                <p className="text-2xl font-bold text-earth-700">{alerts.current?.description}</p>
                <p className="text-sm text-earth-500">Condition</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">7-Day Forecast</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-earth-50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Temp</th>
                    <th className="p-2 text-right">Humidity</th>
                    <th className="p-2 text-right">Rain %</th>
                    <th className="p-2 text-left">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.forecast?.slice(0, 7).map((f, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{f.date}</td>
                      <td className="p-2 text-right">{Math.round(f.temperature)}°C</td>
                      <td className="p-2 text-right">{Math.round(f.humidity)}%</td>
                      <td className="p-2 text-right">{Math.round(f.precipitation)}%</td>
                      <td className="p-2 text-left capitalize">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {alerts.advisories?.map((adv, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">{adv.title}</h3>
              {adv.tasks ? (
                <ul className="space-y-2">
                  {adv.tasks?.map((t, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-earth-600">{adv.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}