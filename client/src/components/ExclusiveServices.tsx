import React, {useState} from 'react' ;
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";


const ExclusiveServices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Services');
    const [viewMode, setViewMode] = useState('grid');
    const filters = ['All Services', 'Restauration', 'Accommodation', 'Transportation', 'Guides'];
     // Données des services (comme dans vos captures)
  const services = [
    {
      id: 1,
      name: 'TACOS AZAZOA',
      category: 'Restauration',
      location: 'VILLE AZAZOA, TIZI OUZOU',
      price: 35,
      priceUSD: 35,
      currency: 'DZD',
      rating: 4.7,
      availability: 'Available',
      imageIcon: '🌮',
      advantage: 'Avantage min'
    },
    {
      id: 2,
      name: 'HOTEL LE MARIN',
      category: 'Accommodation',
      location: 'AZZEFOUR TIZI OUZOU',
      price: 1000,
      priceUSD: 1000,
      currency: 'DZD',
      rating: 4.7,
      availability: 'Available',
      imageIcon: '🏨',
      advantage: 'Avantage min'
    },
    {
      id: 3,
      name: 'BUS MOULOUDI',
      category: 'Transportation',
      location: 'ALGER - TIZI OUZOU',
      price: 290,
      priceUSD: 290,
      currency: 'DZD',
      rating: 4.7,
      availability: 'Available',
      imageIcon: '🚌',
      advantage: 'Start price'
    },
    {
      id: 4,
      name: 'AGENCE LVAZ',
      category: 'Guides',
      location: 'VILLE TIZI OUZOU, TIZI OUZOU',
      price: 50,
      priceUSD: 50,
      currency: 'DZD',
      rating: 4.7,
      availability: 'Available',
      imageIcon: '🗺️',
      advantage: 'Avantage min'
    }
  ];
  
  const destinations = [
    'Italy', 'Rome', 'Salerno', 'Naples', 'Avellino', 'Sicily',
    'Aeolian Islands', 'Malta', 'Djurdjura National Park', 'Agoulimme Lake', 'Tala Ghilef'
  ];
const [showFilters, setShowFilters] = useState(false);








    return (

     <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* En-tête avec recherche */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Exclusive Services
        </h1>
       
        
        {/* Barre de recherche ET Grid/Map View sur la même ligne */}
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 mb-5">
  
 {/* Barre de recherche avec bouton Filters à l'intérieur */}
<div className="mt-5 relative">
  <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400">
    
    {/* Icône loupe à gauche */}
    <div className="flex items-center pl-3 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    {/* Input de recherche */}
    <input 
      type="text" 
      className="flex-1 bg-transparent text-gray-900 text-sm py-2.5 px-2 outline-none"
      placeholder="Search for premium services..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    
    {/* Séparateur vertical (optionnel) */}
    <div className="w-px h-6 bg-gray-200"></div>
    
    {/* Bouton Filters à l'intérieur de la barre */}
    <button 
      onClick={() => setShowFilters(true)}
      className="flex items-center gap-2 px-3 py-2 mx-1 rounded-xl hover:bg-gray-100 transition"
    >
      
      <span className="text-sm text-gray-600"><img src='src/images/filter.svg'></img></span>
    </button>
    
  </div>
</div>
   {/* MODAL FILTERS - VERSION COMME L'IMAGE 1 */}
{showFilters && (
  <div 
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={() => setShowFilters(false)}
  >
    <div 
      className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* En-tête */}
      <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-5 py-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
      </div>
      
      {/* Contenu */}
      <div className="p-5 space-y-6">
        
        {/* Average Price */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Average Price</h3>
          <div className="flex flex-col gap-1">
            <button className=" px-4 py-2 rounded-full text-sm text-left">35 DZD</button>
            <button className=" px-4 py-2 rounded-full text-sm text-left">100 DZD</button>
            <button className=" px-4 py-2 rounded-full text-sm text-left">200 DZD</button>
            <button className=" px-4 py-2 rounded-full text-sm text-left">50 DZD</button>
            <button className=" px-4 py-2 rounded-full text-sm text-left">250 DZD</button>
            <button className=" px-4 py-2 rounded-full text-sm text-left">350 DZD</button>
          </div>
        </div>
        
        {/* Services */}
        <div>
          <h3 className="text-sm text-left font-semibold text-gray-800 mb-3">Services</h3>
          <div className="flex flex-col gap-1">
            <button className=" px-4 py-2 rounded-full font-medium text-sm text-left">Restaurant</button>
            <button className=" px-4 py-2 rounded-full font-medium text-sm text-left">Hotel</button>
            <button className=" px-4 py-2 rounded-full font-medium text-sm text-left">Transport</button>
            <button className=" px-4 py-2 rounded-full font-medium text-sm text-left">Guide</button>
            <button className=" px-4 py-2 rounded-full font-medium text-sm text-left">Camping</button>
          </div>
        </div>
        
        {/* Minimum Rating */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Minimum Rating</h3>
          <div className="flex flex-col gap-1">
            {['4.5+', '4+', '3.5+', '3+'].map((rating) => (
              <button key={rating} className=" hover:bg-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-1">
                <span className="text-yellow-500">★</span> {rating}
              </button>
            ))}
          </div>
        </div>
        
        {/* Distance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Distance</h3>
          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white">
            <option>All Distances</option>
            <option>Moins de 5 km</option>
            <option>5 - 15 km</option>
            <option>15+ km</option>
          </select>
        </div>
      </div>
      
      {/* Boutons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200  p-5 flex gap-3">
        <button className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
          Reset
        </button>
        <button className="flex-1 px-4 py-2.5 bg-[#00B70D] text-white rounded-xl ">
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}

   














  
  {/* Grid/Map View - aligné à droite */}
  <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
    <button
     onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-[#00B70D] font-medium' : 'text-[#00B70D] hover:bg-white transition'
            }`}
          >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
                    <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-1.5 text-sm  rounded-lg flex items-center gap-1 ${
              viewMode === 'map' ? 'bg-white shadow-sm text-[#FF5900] font-medium' : 'text-[#FF5900] hover:bg-white transition'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map View
    </button>
  </div>
</div>






      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
  key={filter}
  onClick={() => setActiveFilter(filter)}
      className={`px-5 py-2 text-sm font-medium rounded-full transition flex items-center gap-2 ${
      activeFilter === filter 
        ? 'bg-green-600 text-white shadow-sm hover:bg-green-700' 
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
  >
  {filter === 'Restauration' && '🍽️'}
  {filter === 'Accommodation' && '🏨'}
  {filter === 'Transportation' && '🚗'}
  {filter === 'Guides' && '🗺️'}
  {filter === 'All Services' }
  {filter}
</button>
                  ))}
      </div>

      

      

      {/* Liste des services recommandés */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           Recommended services
        </h2>
        
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 card-hover">
             {/* Zone image avec une vraie image PNG */}
<div className="h-36 relative flex items-center justify-center overflow-hidden">
    {/* Image de fond ou icône */}
    <img 
        src="/src/images/pic.svg"  // ← METTEZ LE CHEMIN DE VOTRE IMAGE ICI
        alt={service.name}
        className="w-full h-full object-cover"
    />
    {/* Badge de catégorie (garde-le si tu veux) */}
    <span className="absolute bottom-2 left-3 text-xs font-medium bg-black/40 px-2 py-0.5 rounded-full text-white">
        {service.category}
    </span>
</div>
              
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm font-semibold ml-1">{service.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  {service.location}
  <span className="text-green-600 text-xs font-medium ml-auto"> available</span>
</p>
<div className='border border-gray-100 mt-4'></div>
                 <div className="mt-4 flex items-center justify-between">
  {/* Prix à gauche */}
  <div className="flex items-baseline gap-1">
    <span className="text-2xl font-bold text-[#FF5900]">{service.price.toLocaleString()}</span>
    <span className="text-gray-500 text-sm">{service.currency}</span>
  </div>
  
  {/* Bouton Reserve à droite */}
  <button className="bg-[#FF5900] hover:bg-[#E04E00] text-white font-semibold mt-4 py-2 px-4 rounded-xl transition flex items-center gap-2 text-sm">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
    Reserve
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
        
      


















      <img src='src/images/maps.svg' className='mt-6 flex py-12 px-9'></img>














     </div>

     















        );
};
export default ExclusiveServices;