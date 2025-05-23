import React from 'react';

const babyGrowthData = [
  {
    week: 8,
    size: 'Size of a groundnut',
    image: 'https://i.pinimg.com/736x/65/db/a8/65dba8a088f4dbf6d95275507476b4c2.jpg',
    development: 'Baby’s fingers and toes are forming, and their heart is beating rapidly.',
    tip: 'Stay hydrated and start taking prenatal vitamins with folic acid if you haven’t already.',
    proverbOrJoke: "🌍 'Even the best cooking pot will not produce food.' – Akan proverb (Be patient, Mama, growth takes time!)",
  },
  {
    week: 12,
    size: 'Size of a nduma (arrowroot)',
    image: 'https://i.pinimg.com/736x/c2/fb/4b/c2fb4b1851107637124a37c896d44db9.jpg',
    development: 'Baby’s organs are fully formed and they can open and close their fingers.',
    tip: 'This is a good time to schedule your first major prenatal scan.',
    proverbOrJoke: "😂 Baby’s learning hand tricks early – maybe they’ll be the next dancing champion!",
  },
  {
    week: 16,
    size: 'Size of a mango',
    image: 'https://i.pinimg.com/736x/67/cc/28/67cc289dee408686f6792fc8fb60c260.jpg',
    development: 'Baby can make facial expressions and may be sucking their thumb.',
    tip: 'Start sleeping on your side and consider joining a prenatal class or community.',
    proverbOrJoke: "🌍 'When the roots are deep, there is no reason to fear the wind.' – African Proverb",
  },
  {
    week: 20,
    size: 'Size of a maize cob',
    image: 'https://i.pinimg.com/736x/fa/2f/d6/fa2fd620daa8ae8600350390959c4a02.jpg',
    development: 'Baby can hear sounds and may react to your voice or music.',
    tip: 'This is the time for the anomaly scan – a detailed ultrasound to check baby’s growth.',
    proverbOrJoke: "😂 Baby hears everything now… even when you talk to the fridge at midnight!",
  },
  {
    week: 24,
    size: 'Size of a sweet potato',
    image: 'https://i.pinimg.com/736x/e8/f7/b3/e8f7b381a9ac1aea274dacf9ba28114f.jpg',
    development: 'Baby is developing lungs and may start practicing breathing movements.',
    tip: 'Your bump is growing – stay comfortable with loose clothing and supportive footwear.',
    proverbOrJoke: "🌍 'A child who is not embraced by the village will burn it down to feel its warmth.' – African Proverb",
  },
  {
    week: 28,
    size: 'Size of a coconut',
    image: 'https://i.pinimg.com/736x/29/2c/11/292c11d8fce55366be9edf5608ff285e.jpg',
    development: 'Baby can blink and their brain is growing rapidly.',
    tip: 'Consider creating a birth plan and discussing it with your midwife.',
    proverbOrJoke: "😂 Mama brain is real – just like baby brain is in turbo mode!",
  },
  {
    week: 32,
    size: 'Size of a papaya',
    image: 'https://i.pinimg.com/736x/e7/1f/bf/e71fbfc7add78aefc7d81dad746b1f0d.jpg',
    development: 'Baby is gaining weight and their bones are hardening.',
    tip: 'Rest often, eat small meals and do light stretches to reduce swelling and backaches.',
    proverbOrJoke: "🌍 'Wisdom is like a baobab tree; no one individual can embrace it.' – Akan Proverb",
  },
  {
    week: 36,
    size: 'Size of a watermelon',
    image: 'https://i.pinimg.com/736x/25/e9/47/25e9471c8dac786c505ff3d4a5dc1114.jpg',
    development: 'Baby’s position is shifting down into your pelvis to prepare for birth.',
    tip: 'Pack your hospital bag and finalize transport plans for delivery.',
    proverbOrJoke: "😂 Walking feels like carrying a watermelon between your knees – because it basically is!",
  },
  {
    week: 40,
    size: 'Ready to meet you!',
    image: 'https://i.pinimg.com/736x/81/4d/dc/814ddc2fa592d642ef8f462dc0296be4.jpg',
    development: 'Baby is full-term and ready for delivery any time now!',
    tip: 'Watch for signs of labor like contractions, water breaking, or intense lower back pain.',
    proverbOrJoke: "🌍 'Patience can cook a stone.' – African Proverb (Hold on, Mama, you’re almost there!)",
  },
];

const BabyCornerPage = () => {
  return (
    <div className="bg-gradient-to-b from-cyan-300 via-white to-cyan-100 py-10 px-4 sm:px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-900 mb-4 text-center">
          👶🏾 Baby Corner
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          Follow your baby's journey with relatable African food sizes, weekly development milestones, and encouragement just for Mama.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {babyGrowthData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-cyan-100"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={`Week ${item.week} - ${item.size}`}
                  className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-cyan-800 mb-2">Week {item.week}</h2>
                <p className="text-sm font-semibold text-cyan-700 mb-1">👶 Size: {item.size}</p>
                <p className="text-gray-800 text-sm mb-2">
                  <strong className="text-cyan-700">🧠 Development:</strong> {item.development}
                </p>
                <p className="text-gray-600 text-sm italic mb-2">
                  <strong>💡 Tip for Mama:</strong> {item.tip}
                </p>
                <p className="text-cyan-700 text-sm italic">{item.proverbOrJoke}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BabyCornerPage;
