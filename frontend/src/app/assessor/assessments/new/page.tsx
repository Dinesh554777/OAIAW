'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function NewAssessment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await fetchApi('/assessments', {
        method: 'POST',
        body: JSON.stringify({ title, description, duration_minutes: duration, difficulty, status: 'DRAFT' })
      });
      router.push(`/assessor/assessments/${created.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Assessment</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"></textarea>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
              <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Create</button>
        </form>
      </div>
    </div>
  );
}
