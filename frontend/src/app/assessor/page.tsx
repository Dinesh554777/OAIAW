import Link from 'next/link';

export default function AssessorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">Assessor Dashboard</h1>
        <p className="text-gray-700 mb-6">Welcome to the OAIAW assessor panel.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/assessor/assessments" className="p-6 border rounded shadow-sm bg-blue-50 hover:bg-blue-100 block">
            <h2 className="text-xl font-semibold mb-2">Manage Assessments</h2>
            <p className="text-sm text-gray-600">Create and edit assessments, define tasks and assignments.</p>
          </Link>
          <div className="p-6 border rounded shadow-sm bg-gray-100 text-gray-400">
            <h2 className="text-xl font-semibold mb-2">Evaluate Candidates</h2>
            <p className="text-sm">Coming soon in a future phase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
