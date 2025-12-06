import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingSimple() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (bio.length > 300) e.bio = 'Bio must be under 300 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSuccess(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      name : name.trim(),
      bio : bio.trim(),
      onboardedAt : new Date().toISOString(),
    };

    try {
      setLoading(true);
      await fetch('http://localhost:3000/auth/onBoarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' ,
          'token' : token
        },
        body: JSON.stringify(payload),
      });
      setSuccess('Profile saved — welcome aboard!');
      setErrors({});
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to save. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-12">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-8 ring-1 ring-black/20">
        <h1 className="text-2xl font-semibold text-white mb-1">Welcome — set up your profile</h1>
        <p className="text-sm text-gray-300 mb-6">Tell us a bit about yourself so we can personalize your experience.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={`w-full rounded-xl bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Short description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A one-line description or what you code — optional"
              rows={4}
              className={`w-full rounded-xl bg-gray-800 border ${errors.bio ? 'border-red-500' : 'border-gray-700'} px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{bio.length}/300</span>
              {errors.bio && <span className="text-red-400">{errors.bio}</span>}
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
