import React from 'react';
import { Search, Filter } from 'lucide-react';

export type EventFilterType = 'All' | 'Code' | 'AI' | 'Tests' | 'Debugging' | 'Git' | 'Assessment';

interface TimelineFiltersProps {
  currentFilter: EventFilterType;
  onFilterChange: (filter: EventFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TimelineFilters({ currentFilter, onFilterChange, searchQuery, onSearchChange }: TimelineFiltersProps) {
  const filters: EventFilterType[] = ['All', 'Code', 'AI', 'Tests', 'Debugging', 'Git', 'Assessment'];

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center space-x-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
        <Filter size={16} className="text-gray-400 mr-2 shrink-0" />
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              currentFilter === filter 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#3d3d3d]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      <div className="relative w-full md:w-64 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-[#2d2d2d] border border-[#444] text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 placeholder-gray-500"
        />
      </div>
    </div>
  );
}
