"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL, fetchApi } from '@/lib/api';
import { EngineeringTimeline } from '@/components/timeline/EngineeringTimeline';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AssessorTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [timelineData, setTimelineData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const data = await fetchApi(`/sessions/${sessionId}/timeline`);
        setTimelineData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load timeline");
      }
    };
    
    if (sessionId) {
      loadTimeline();
      // Optional polling
      const interval = setInterval(loadTimeline, 30000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col min-h-screen bg-[#181818] font-sans">
      <div className="bg-[#252526] border-b border-[#333] px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/assessor/sessions/${sessionId}`)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Session
          </Button>
          <div className="h-4 w-px bg-gray-600"></div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center">
            <Clock size={20} className="text-blue-400 mr-2" />
            Engineering Timeline
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        {error ? (
          <div className="text-red-400 bg-red-400/10 p-4 rounded border border-red-400/20 max-w-2xl mx-auto">
            {error}
          </div>
        ) : (
          <EngineeringTimeline timelineData={timelineData} />
        )}
      </div>
    </div>
  );
}
