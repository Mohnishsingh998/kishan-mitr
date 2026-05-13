import { useState } from 'react';
import { sendRequest } from '../../utils/api';

export default function YieldPrediction() {
  const [form, setForm] = useState({ crop: 'rice', area: '', region: '' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    if (!form.area || !form.region) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await sendRequest('/ai/yield-predict', 'POST', form);
      setPrediction(res);
    } catch (err) {
      alert('Error predicting yield');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-4">AI Yield Prediction</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Crop</label>
            <select
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="cotton">Cotton</option>
              <option value="soybean">Soybean</option>
              <option value="maize">Maize</option>
              <option value="mustard">Mustard</option>
              <option value="gram">Gram</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area (hectares)</label>
            <input
              type="number"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Maharashtra"
            />
          </div>
        </div>
        <button
          onClick={predict}
          disabled={loading}
          className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Predict Yield'}
        </button>
      </div>

      {prediction && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">Yield Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{prediction.predictedYield?.value}</p>
                <p className="text-sm text-earth-500">Quintals/Hectare</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{prediction.totalExpectedProduction?.value}</p>
                <p className="text-sm text-earth-500">Total Quintals</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{prediction.predictedYield?.historical}</p>
                <p className="text-sm text-earth-500">Historical Avg</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">{prediction.confidence}%</p>
                <p className="text-sm text-earth-500">Confidence</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3">Influencing Factors</h3>
            <div className="space-y-2">
              {prediction.factors?.map((f, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-earth-50 rounded">
                  <span>{f.factor}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    f.impact === 'Positive' ? 'bg-green-100 text-green-700' :
                    f.impact === 'Negative' ? 'bg-red-100 text-red-700' :
                    'bg-earth-100 text-earth-700'
                  }`}>{f.impact}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {prediction.recommendations?.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}