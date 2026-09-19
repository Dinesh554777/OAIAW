import React, { useState, useMemo } from 'react';
import { TimelineFilters, EventFilterType } from './TimelineFilters';
import { EventDetailPanel } from './EventDetailPanel';
import { TimelineSummary } from './TimelineSummary';
import { formatTimestamp, getEventIcon } from './utils';
import { Clock } from 'lucide-react';

interface EngineeringTimelineProps {
  timelineData: any;
}

export function EngineeringTimeline({ timelineData }: EngineeringTimelineProps) {
  const [filter, setFilter] = useState<EventFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const events = timelineData?.events || [];
  const summary = timelineData?.summary;

  const filteredEvents = useMemo(() => {
    return events.filter((event: any) => {
      // Type Filter
      if (filter === 'Code' && !event.event_type.includes('FILE_') && !event.event_type.includes('CODE_')) return false;
      if (filter === 'AI' && !event.event_type.includes('AI_')) return false;
      if (filter === 'Tests' && !event.event_type.includes('TEST_')) return false;
      if (filter === 'Debugging' && !event.event_type.includes('DEBUG') && !event.event_type.includes('ERROR')) return false;
      if (filter === 'Git' && !event.event_type.includes('GIT_')) return false;
      if (filter === 'Assessment' && !event.event_type.includes('SESSION_') && !event.event_type.includes('TASK_') && !event.event_type.includes('SUBMISSION_')) return false;

      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const typeMatch = event.event_type.toLowerCase().includes(query);
        const metaStr = event.metadata_json ? JSON.stringify(event.metadata_json).toLowerCase() : '';
        const metaMatch = metaStr.includes(query);
        if (!typeMatch && !metaMatch) return false;
      }
      return true;
    });
  }, [events, filter, searchQuery]);

  if (!timelineData) {
    return <div className="text-gray-400 p-8 text-center flex flex-col items-center justify-center">
        <Clock size={32} className="mb-4 text-gray-500 opacity-50 animate-pulse" />
        <p>Loading timeline...</p>
    </div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 relative">
      
      {summary && <TimelineSummary summary={summary} />}
      
      <TimelineFilters 
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
        <div className="relative border-l-2 border-[#333] ml-4 md:ml-6 space-y-8 pb-8">
          
          {filteredEvents.length === 0 ? (
            <div className="text-gray-500 italic pl-8">No events match the current filters.</div>
          ) : (
            filteredEvents.map((event: any) => {
              const meta = typeof event.metadata_json === 'string' ? JSON.parse(event.metadata_json) : event.metadata_json;
              let description = '';
              
              if (meta?.file_path) description = meta.file_path;
              if (meta?.length) description = `Message length: ${meta.length} chars`;
              if (meta?.passed !== undefined) description = `${meta.passed} passed, ${meta.failed} failed`;
              if (meta?.error) description = meta.error;

              return (
                <div key={event.id} className="relative pl-8 md:pl-10 group">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#252526] border-2 border-[#333] flex items-center justify-center shadow-lg group-hover:border-blue-500 transition-colors z-10 cursor-pointer"
                       onClick={() => setSelectedEvent(event)}>
                    {getEventIcon(event.event_type)}
                  </div>
                  
                  <div 
                    className="bg-[#252526] border border-[#333] rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer shadow-sm group-hover:shadow-md"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-200">{event.event_type}</span>
                        {event.actor === 'AI' && <span className="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">AI Gen</span>}
                      </div>
                      <span className="text-xs text-gray-500 font-mono bg-[#1e1e1e] px-2 py-1 rounded">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    
                    {description && (
                      <div className="text-sm text-gray-400 font-mono mt-2 bg-[#1e1e1e] p-2 rounded border border-[#333] inline-block">
                        {description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          
        </div>
      </div>

      {selectedEvent && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEvent(null)} />
          <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </>
      )}
    </div>
  );
}
