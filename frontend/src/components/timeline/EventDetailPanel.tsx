import React from 'react';
import { X, Clock, FileCode2, Info, Bot, Beaker } from 'lucide-react';
import { formatTimestamp, getEventIcon } from './utils';
import { Button } from '@/components/ui/button';

interface EventDetailPanelProps {
  event: any | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  const metadata = typeof event.metadata_json === 'string' 
    ? JSON.parse(event.metadata_json) 
    : event.metadata_json || {};

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#252526] border-l border-[#333] shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center space-x-2">
          {getEventIcon(event.event_type)}
          <h3 className="text-lg font-medium text-white">{event.event_type}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock size={14} />
          <span>{formatTimestamp(event.timestamp)}</span>
          <span>•</span>
          <span>Seq: {event.sequence_number}</span>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Event Details</h4>
          
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#333]">
            {Object.keys(metadata).length > 0 ? (
              <div className="space-y-3 text-sm">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-gray-200 font-mono mt-1 break-all">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm flex items-center">
                <Info size={14} className="mr-2" />
                No additional metadata recorded for this event.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Context</h4>
          <div className="bg-[#1e1e1e] rounded-md p-3 border border-[#333] text-sm text-gray-400">
            <div><span className="text-gray-500">Actor:</span> {event.actor}</div>
            <div className="mt-1"><span className="text-gray-500">Source:</span> {event.source}</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#333]">
        <Button onClick={onClose} variant="secondary" className="w-full bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white">
          Close Details
        </Button>
      </div>
    </div>
  );
}
