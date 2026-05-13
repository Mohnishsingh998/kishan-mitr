import { useState, useEffect } from 'react';
import { sendRequest } from '../../utils/api';
import { farmerAPI } from '../../utils/api';

export default function CropRecommendation() {
  const [landId, setLandId] = useState('');
  const [lands, setLands] = useState([]);
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('kharif');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLands, setLoadingLands] = useState(true);

  useEffect(() => {
    async function fetchLands() {
      const farmerId = localStorage.getItem('km_farmer_id');
      const token = localStorage.getItem('km_token');
      if (farmerId && token) {
        try {
          const data = await farmerAPI.getLands(farmerId, token);
          if (data && data.length > 0) setLands(data);
        } catch (e) {
          console.error('Failed to fetch lands:', e);
        }
      }
      setLoadingLands(false);
    }
    fetchLands();
  }, []);

  const getRecommendations = async () => {
    const farmerId = localStorage.getItem('km_farmer_id');
    setLoading(true);
    try {
      const res = await sendRequest('/ai/crop-recommend', 'POST', {
        landId,
        farmerId,
        soil_type: soilType || undefined,
        season,
        state: 'Madhya Pradesh',
      });
      setRecommendations(res);
    } catch (err) {
      alert('Error getting recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-4">AI Crop Recommendation</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        {lands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Select Field</label>
            <select
              value={landId}
              onChange={(e) => setLandId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Choose a field...</option>
              {lands.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.soilType} ({l.areaAcres || l.area} acres)
                </option>
              ))}
            </select>
          </div>
        )}

        {!landId && (
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Soil Type</label>
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              placeholder="e.g. black, loamy, sandy"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="kharif">Kharif (June–October)</option>
            <option value="rabi">Rabi (October–March)</option>
            <option value="zaid">Zaid (March–June)</option>
          </select>
        </div>

        <button
          onClick={getRecommendations}
          disabled={loading || (!landId && !soilType)}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </div>

      {recommendations && (
        <div className="space-y-4">
          {recommendations.soilData && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-2">Soil Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-earth-500">pH:</span> {recommendations.soilData?.ph}</div>
                <div><span className="text-earth-500">Soil Type:</span> {recommendations.soilData?.soilType}</div>
                <div><span className="text-earth-500">Season:</span> {recommendations.season}</div>
                <div><span className="text-earth-500">Irrigation:</span> {recommendations.soilData?.irrigation}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4">Recommended Crops</h3>
            <div className="space-y-3">
              {recommendations.recommendations?.map((crop, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-lg">{crop.crop}</span>
                      <span className={`ml-3 px-2 py-1 rounded text-sm ${
                        crop.suitability === 'Excellent' ? 'bg-green-100 text-green-700' :
                        crop.suitability === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-earth-100 text-earth-700'
                      }`}>{crop.suitability}</span>
                    </div>
                    <span className="text-earth-500">Match: {crop.score}%</span>
                  </div>
                  <ul className="mt-2 text-sm text-earth-600">
                    {crop.reasons?.map((r, j) => <li key={j}>• {r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
