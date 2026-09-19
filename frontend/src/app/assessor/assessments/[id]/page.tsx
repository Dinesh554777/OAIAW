'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function AssessmentDetail() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  
  // Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('FEATURE');
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    fetchApi(`/assessments/${params.id}`).then(setAssessment).catch(console.error);
  }, [params.id]);

  const handlePublish = async () => {
    try {
      await fetchApi(`/assessments/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'PUBLISHED' })
      });
      setAssessment({ ...assessment, status: 'PUBLISHED' });
    } catch (err: any) { alert(err.message); }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await fetchApi(`/assessments/${params.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title, description, task_type: taskType, repository_url: repoUrl })
      });
      setAssessment({ ...assessment, tasks: [...assessment.tasks, newTask] });
      setTitle(''); setDescription(''); setRepoUrl('');
    } catch (err: any) { alert(err.message); }
  };

  if (!assessment) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
        
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{assessment.title}</h1>
              {assessment.status === 'DRAFT' && (
                <button onClick={handlePublish} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold">Publish Assessment</button>
              )}
              {assessment.status === 'PUBLISHED' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">PUBLISHED</span>
              )}
            </div>
            <p className="text-gray-700 mb-4">{assessment.description}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Duration: {assessment.duration_minutes} mins</span>
              <span>Difficulty: {assessment.difficulty}</span>
            </div>
          </div>

          <div className="bg-white rounded shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Tasks ({assessment.tasks.length})</h2>
            {assessment.tasks.map((task: any) => (
              <div key={task.id} className="border p-4 rounded mb-4">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded mb-2 inline-block">{task.task_type}</span>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                {task.repository_url && <p className="text-sm text-blue-600">Repo: {task.repository_url}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow-md p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Add Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-2 py-1 border rounded text-sm text-black" />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Type</label>
              <select value={taskType} onChange={e => setTaskType(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded text-sm text-black">
                <option value="BUG_FIX">Bug Fix</option>
                <option value="FEATURE">Feature</option>
                <option value="REFACTOR">Refactor</option>
                <option value="DEBUGGING">Debugging</option>
                <option value="CODE_REVIEW">Code Review</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Repository URL</label>
              <input type="url" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded text-sm text-black" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700">Description / Instructions</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-2 py-1 border rounded text-sm text-black"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">Add Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}
