import { Search, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
              {/* Qidiruv paneli */}
      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 mb-6 shadow-sm">
        <div className="flex items-center flex-1 gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Найти"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
</div>
  );
}