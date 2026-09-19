'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetchApi('/assessments').then(setAssessments).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Assessments</h1>
          <Link href="/assessor/assessments/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create New
          </Link>
        </div>
        
        {assessments.length === 0 ? (
          <p className="text-gray-500 text-center p-8">No assessments found. Create one to get started.</p>
        ) : (
          <ul className="space-y-4">
            {assessments.map((a: any) => (
              <li key={a.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <Link href={`/assessor/assessments/${a.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                    {a.title}
                  </Link>
                  <p className="text-sm text-gray-600">{a.status} • {a.difficulty} • {a.duration_minutes} mins</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
