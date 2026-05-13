import { useState, useRef } from 'react';
import { sendRequest } from '../../utils/api';

const CROPS = ['Soybean', 'Cotton', 'Maize', 'Wheat', 'Rice', 'Chickpea', 'Mustard', 'Groundnut', 'Sugarcane', 'Vegetables'];

export default function PestDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [cropName, setCropName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectPest = async () => {
    if (!symptoms.trim() && !image) return;
    setLoading(true);
    try {
      const res = await sendRequest('/ai/pest-detect', 'POST', {
        image,
        symptoms,
        cropName,
      });
      setResult(res);
    } catch (err) {
      alert('Error detecting pest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-earth-800 mb-4">AI Pest Detection</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Affected Crop</label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Select crop...</option>
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Describe Symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., yellowing leaves, holes, white powder, wilting..."
            rows={3}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
          />
        </div>

        <div className="border-2 border-dashed border-earth-300 rounded-lg p-6 text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div className="py-8 text-earth-500">
              <p className="text-4xl mb-2">🪲</p>
              <p>Upload photo of affected plant (optional)</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current.click()}
            className="mt-4 px-6 py-2 bg-earth-600 text-white rounded-lg hover:bg-earth-700"
          >
            {preview ? 'Change Image' : 'Select Image'}
          </button>
        </div>

        {(symptoms.trim() || image) && (
          <button
            onClick={detectPest}
            disabled={loading}
            className="w-full mt-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Detect Pest'}
          </button>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {result.pests?.map((pest, i) => (
            <div key={i} className={`rounded-lg shadow-md p-6 ${pest.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">{pest.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
                    pest.severity === 'high' ? 'bg-red-100 text-red-700' :
                    pest.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {pest.severity} severity
                  </span>
                </div>
                <span className="text-earth-500">{Math.round(pest.confidence * 100)}% match</span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Treatment:</h4>
                <p className="text-earth-600 mt-1 whitespace-pre-wrap">{pest.treatment}</p>
              </div>
            </div>
          ))}

          {!result.detected && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">No Specific Pest Identified</h3>
              <p className="text-earth-600">Provide more details about symptoms and the affected crop for a better diagnosis.</p>
            </div>
          )}

          {result.suggestions && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">General Pest Management</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
