// src/app/page.tsx
export default function WeddingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-4 tracking-tight">
          Yarah & Alex
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-6"></div>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
          Together with our families, we invite you to celebrate our love
        </p>
        <div className="space-y-2 text-lg text-gray-700 mb-12">
          <p>September 15th, 2024</p>
          <p>4:00 PM</p>
          <p>Vineyard Estate, Napa Valley</p>
        </div>
        <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
          RSVP Now
        </button>
      </div>
    </div>
  );
}