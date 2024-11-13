import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSuggestedActivities,
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
        backgroundImage: `url('/france.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-green-600">
          Discover France with AI
        </h1>

        {/* Form for Location Input */}
        <form onSubmit={handleSubmit} className="mb-8 w-full max-w-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="Where in France do you want to travel?"
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Explore'}
            </button>
          </div>
        </form>

        {/* Surprise Me Button */}
        <button
          onClick={handleSurprise}
          disabled={surpriseLoading}
          className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-8"
        >
          {surpriseLoading ? 'Loading...' : 'Surprise Me 💫'}
        </button>

        {/* Suggested Locations Grid */}
        {suggestedLocations.length > 1 && (
          <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
            Any specific place you want to explore?
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
          {suggestedLocations.map((location, index) => (
            <div
              key={index}
              onClick={() => handleLocationSelect(location.name)}
              className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-green-700">
                {location.name}
              </h2>
              <p className="text-sm mt-2">{location.description}</p>
              <img
                src={location.image_url}
                alt={location.name}
                className="w-full h-[150px] object-cover mt-4 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Keep It Vague Button */}
        <button
          onClick={() => handleLocationSelect(locationDescription)}
          className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mt-10"
        >
          Keep it vague
        </button>
      </div>
    </div>
  );
};

export default LocationPage;
