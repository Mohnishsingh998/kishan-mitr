import { useState, useEffect } from 'react';
import { sendRequest } from '../../utils/api';

export default function MarketForecast() {
  const [crop, setCrop] = useState('paddy');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getForecast();
  }, []);

  const getForecast = async () => {
    setLoading(true);
    try {
      const res = await sendRequest(`/ai/market-forecast/${crop}?days=30`);
      setForecast(res);
    } catch (err) {
      alert('Error getting forecast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-4">AI Market Price Forecast</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          >
            <option value="paddy">Paddy</option>
            <option value="wheat">Wheat</option>
            <option value="mustard">Mustard</option>
            <option value="gram">Gram</option>
            <option value="cotton">Cotton</option>
            <option value="soybean">Soybean</option>
            <option value="maize">Maize</option>
            <option value="potato">Potato</option>
            <option value="onion">Onion</option>
          </select>
          <button
            onClick={getForecast}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get Forecast'}
          </button>
        </div>
      </div>

      {forecast && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">Price Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">₹{forecast.historicalSummary?.average}</p>
                <p className="text-sm text-earth-500">Average (₹/quintal)</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">₹{forecast.historicalSummary?.min}</p>
                <p className="text-sm text-earth-500">Min Price</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">₹{forecast.historicalSummary?.max}</p>
                <p className="text-sm text-earth-500">Max Price</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700 capitalize">{forecast.historicalSummary?.trend}</p>
                <p className="text-sm text-earth-500">Trend</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">30-Day Price Forecast</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-earth-50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Price (₹)</th>
                    <th className="p-2 text-center">Trend</th>
                    <th className="p-2 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.forecast?.slice(0, 10).map((f, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{f.date}</td>
                      <td className="p-2 text-right font-semibold">₹{f.predictedPrice}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          f.trend === 'up' ? 'bg-green-100 text-green-700' :
                          f.trend === 'down' ? 'bg-red-100 text-red-700' :
                          'bg-earth-100 text-earth-700'
                        }`}>{f.trend}</span>
                      </td>
                      <td className="p-2 text-right">{f.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3">Market Advice</h3>
            <ul className="space-y-2">
              {forecast.advice?.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600">💡</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}