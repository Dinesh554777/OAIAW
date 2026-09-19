'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export default function CandidateDashboard() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetchApi('/assessments').then(setAssessments).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">Candidate Dashboard</h1>
        <p className="text-gray-700 mb-8">Welcome to the OAIAW candidate workspace. Here are your available assessments.</p>
        
        <h2 className="text-2xl font-semibold mb-4">Available Assessments</h2>
        {assessments.length === 0 ? (
          <p className="text-gray-500">No assessments are currently available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((a: any) => (
              <div key={a.id} className="border rounded p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{a.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{a.duration_minutes} mins</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{a.difficulty}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
