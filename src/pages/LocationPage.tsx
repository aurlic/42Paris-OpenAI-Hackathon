import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSuggestedLocations,
  getSuggestedThemes,
} from '../services/openaiService';

interface Location {
  name: string;
  description: string;
  image_url: string;
}

const LocationPage: React.FC = () => {
  const [locationDescription, setLocationDescription] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState<Array<Location>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [surpriseLoading, setsurpriseLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const locations = await getSuggestedLocations(locationDescription);

    if (locations.length === 1) {
      navigate('/themes', { state: { location: locations[0].name } });
    }

    setSuggestedLocations(locations);
    setLoading(false);
  };

  const handleSurprise = async () => {
    setsurpriseLoading(true);
    const surprise_location = await getSuggestedLocations('', 1, false);
    const surprise_theme = await getSuggestedThemes(
      [surprise_location[0].name],
      1
    );
    setsurpriseLoading(false);
    navigate('/console', {
      state: {
        context: `${surprise_theme[0].name} in ${surprise_location[0].name}`,
      },
    });
  };

  const handleLocationSelect = (location: string) => {
    navigate('/themes', { state: { location } });
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('/france.jpg')`, // Adjusted path for background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white opacity-70"></div>

      {/* Main Content */}
      <div className="relative z-10 p-10 max-w-4xl w-full bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl text-center">
        <h1 className="text-5xl font-lora text-blue-900 mb-8">
          France Tour. Anytime. Anywhere.
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8 w-full max-w-xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="Where do you want to place your beret?"
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-montserrat placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
            >
              {loading ? 'Chargement...' : "Let's go!"}
            </button>
          </div>
        </form>

        {/* Surprise Me Button */}
        <button
          onClick={handleSurprise}
          disabled={surpriseLoading}
          className="bg-red-600 text-white px-6 py-2 rounded-full mb-8 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-montserrat"
        >
          {surpriseLoading ? 'Chargement...' : 'I feel lucky. Surprise me! 💥'}
        </button>

        {/* Suggested Locations */}
        {suggestedLocations.length > 1 && (
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 font-lora">
            Wanna be more specific? Choose your location!
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4">
          {suggestedLocations.map((location, index) => (
            <div
              key={index}
              onClick={() => handleLocationSelect(location.name)}
              className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer font-lora"
            >
              <h2 className="text-xl font-semibold text-blue-800">
                {location.name}
              </h2>
              <p className="text-sm mt-2">{location.description}</p>
              <img
                src={location.image_url}
                alt={location.name}
                className="w-full h-40 object-cover mt-4 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Keep It Vague Button */}
        {suggestedLocations.length > 1 && (
          <button
            onClick={() => handleLocationSelect(locationDescription)}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg mt-10 hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 font-montserrat"
          >
            I wanna remain vague 🤔
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
