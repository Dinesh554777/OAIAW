'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { RoleSelector, Role } from '@/components/auth/RoleSelector';
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel';
import { RegistrationStepper } from '@/components/auth/RegistrationStepper';
import { AuthError } from '@/components/auth/AuthError';
import { CandidateRegistration } from '@/components/auth/CandidateRegistration';
import { AssessorRegistration } from '@/components/auth/AssessorRegistration';
import { AdminRegistration } from '@/components/auth/AdminRegistration';

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (finalData: any) => {
    setLoading(true);
    setError('');
    try {
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...finalData, role }),
      });
      setStep(3); // Success step
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const stepsMap: Record<Role, string[]> = {
    CANDIDATE: ['Role', 'Profile', 'Complete'],
    ASSESSOR: ['Role', 'Professional', 'Complete'],
    ADMIN: ['Role', 'Authorization', 'Complete']
  };

  const getForm = () => {
    switch (role) {
      case 'CANDIDATE': return <CandidateRegistration formData={formData} setFormData={setFormData} onSubmit={handleRegister} loading={loading} />;
      case 'ASSESSOR': return <AssessorRegistration formData={formData} setFormData={setFormData} onSubmit={handleRegister} loading={loading} />;
      case 'ADMIN': return <AdminRegistration formData={formData} setFormData={setFormData} onSubmit={handleRegister} loading={loading} />;
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background text-foreground">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-md animate-enter space-y-6">
          {step < 3 && (
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft size={16} /> Back to home
            </Link>
          )}

          <Card className="border-border shadow-2xl bg-surface/80 backdrop-blur-md">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
              {step < 3 && (
                <RegistrationStepper currentStep={step} steps={stepsMap[role]} />
              )}
            </CardHeader>
            <CardContent>
              <AuthError message={error} />
              
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-sm text-muted-foreground">Choose how you will use OAIAW</div>
                  <RoleSelector selectedRole={role} onSelectRole={setRole} layout="vertical" />
                  <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{role} Registration</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change Role</Button>
                  </div>
                  {getForm()}
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-6 py-8">
                  <div className="flex justify-center">
                    <CheckCircle2 size={64} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Account created successfully</h2>
                  <p className="text-muted-foreground">
                    Your {role.toLowerCase()} workspace is ready.
                  </p>
                  <Button className="w-full mt-4" onClick={() => router.push('/login')}>
                    Go to Sign In
                  </Button>
                </div>
              )}

              {step < 3 && (
                <div className="mt-6 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
