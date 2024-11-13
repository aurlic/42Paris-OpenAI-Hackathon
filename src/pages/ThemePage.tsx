import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSuggestedThemes } from '../services/openaiService';

interface Theme {
  emoji: string;
  name: string;
  description: string;
}

const ThemePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      setLoading(true);
      const suggestedThemes = await getSuggestedThemes(
        [location.state.location],
        8
      );
      setThemes(suggestedThemes || []);
      setLoading(false);
    };
    fetchThemes();
  }, [location.state.location]);

  const handleThemeSelect = (theme: Theme) => {
    navigate('/console', {
      state: {
        context: `${theme.name} in ${location.state.location}`,
      },
    });
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
        <h2 className="text-5xl font-lora text-blue-900 mb-8">
          Choose a theme for your exploration of {location.state.location}
        </h2>

        {loading ? (
          <p className="text-center text-gray-700 font-montserrat">
            Loading themes...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4">
            {themes.map((theme, index) => (
              <div
                key={index}
                onClick={() => handleThemeSelect(theme)}
                className="bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer font-lora"
              >
                <p className="text-4xl">{theme.emoji}</p>
                <h2 className="text-xl font-semibold text-blue-800 mt-2">
                  {theme.name}
                </h2>
                <p className="text-sm mt-2">{theme.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePage;