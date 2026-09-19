'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchApi } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RoleSelector, Role } from '@/components/auth/RoleSelector';
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel';
import { AuthError } from '@/components/auth/AuthError';
import { PasswordField } from '@/components/auth/PasswordField';

export default function Login() {
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }), // pass role if backend needs it, else it's just UX
      });
      Cookies.set('token', data.access_token);
      const decoded: any = jwtDecode(data.access_token);
      
      if (decoded.role === 'CANDIDATE') router.push('/candidate');
      else if (decoded.role === 'ASSESSOR') router.push('/assessor');
      else if (decoded.role === 'ADMIN') router.push('/admin');
      else router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background text-foreground">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-md animate-enter space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={16} /> Back to home
          </Link>

          <Card className="border-border shadow-2xl bg-surface/80 backdrop-blur-md">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sign in to your OAIAW workspace
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <AuthError message={error} />
                
                <div className="space-y-4">
                  <RoleSelector selectedRole={role} onSelectRole={setRole} />
                </div>

                <div className="space-y-2 mt-4 text-sm text-muted-foreground text-center bg-surface-elevated p-3 rounded-md border border-border/50">
                  {role === 'CANDIDATE' && 'Sign in as Candidate. Access your assessments and engineering workspace.'}
                  {role === 'ASSESSOR' && 'Sign in as Assessor. Manage assessments and evaluate engineering evidence.'}
                  {role === 'ADMIN' && 'Sign in as Admin. Manage users, platform configuration and system activity.'}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                      placeholder="name@example.com"
                    />
                  </div>
                  
                  <PasswordField value={password} onChange={(e: any) => setPassword(e.target.value)} />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
