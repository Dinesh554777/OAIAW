import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export type EventType = 
  | 'SESSION_STARTED' | 'SESSION_RESUMED' | 'SESSION_PAUSED' | 'SESSION_SUBMITTED' | 'SESSION_TERMINATED' | 'SESSION_EXPIRED'
  | 'FILE_OPENED' | 'FILE_CREATED' | 'FILE_EDITED' | 'FILE_DELETED' | 'FILE_SAVED'
  | 'CODE_CHANGE' | 'PATCH_APPLIED'
  | 'AI_MESSAGE_SENT' | 'AI_RESPONSE_RECEIVED' | 'AI_TOOL_PROPOSED' | 'AI_TOOL_APPROVED' | 'AI_TOOL_REJECTED' | 'AI_TOOL_EXECUTED' | 'AI_TOOL_FAILED'
  | 'TEST_RUN_STARTED' | 'TEST_RUN_COMPLETED' | 'TEST_FAILED' | 'TEST_PASSED'
  | 'ERROR_DETECTED' | 'ERROR_INSPECTED' | 'DEBUG_ATTEMPT' | 'DEBUG_RESOLVED'
  | 'GIT_STATUS' | 'GIT_DIFF_VIEWED' | 'GIT_COMMIT'
  | 'TASK_VIEWED' | 'TASK_STARTED' | 'TASK_COMPLETED' | 'SUBMISSION_CREATED';

export interface EventData {
  event_type: EventType;
  metadata?: Record<string, any>;
  source?: string;
}

const FLUSH_INTERVAL_MS = 5000;
const BATCH_SIZE = 20;

export function useEngineeringEvents(sessionId: number | null) {
  const queue = useRef<EventData[]>([]);
  const flushTimeout = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(async () => {
    if (!sessionId || queue.current.length === 0) return;

    const eventsToSend = queue.current.splice(0, BATCH_SIZE);
    
    try {
      if (eventsToSend.length === 1) {
        await fetchApi(`/sessions/${sessionId}/events`, {
          method: 'POST',
          body: JSON.stringify(eventsToSend[0]),
        });
      } else {
        await fetchApi(`/sessions/${sessionId}/events/batch`, {
          method: 'POST',
          body: JSON.stringify(eventsToSend),
        });
      }
    } catch (error) {
      console.error('Failed to send telemetry events', error);
      // Put them back at the start of the queue if we failed
      queue.current = [...eventsToSend, ...queue.current];
    }
  }, [sessionId]);

  const trackEvent = useCallback((event_type: EventType, metadata?: Record<string, any>, source: string = 'workspace') => {
    queue.current.push({ event_type, metadata, source });
    
    if (!flushTimeout.current) {
      flushTimeout.current = setTimeout(() => {
        flush();
        flushTimeout.current = null;
      }, FLUSH_INTERVAL_MS);
    }
    
    if (queue.current.length >= BATCH_SIZE) {
      if (flushTimeout.current) {
        clearTimeout(flushTimeout.current);
        flushTimeout.current = null;
      }
      flush();
    }
  }, [flush]);

  // Ensure queue is flushed on unmount
  useEffect(() => {
    return () => {
      if (flushTimeout.current) {
        clearTimeout(flushTimeout.current);
      }
      if (queue.current.length > 0) {
        flush();
      }
    };
  }, [flush]);

  return { trackEvent };
}
