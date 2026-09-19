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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      Cookies.set('token', data.access_token);
      const decoded: any = jwtDecode(data.access_token);
      
      if (decoded.role === 'CANDIDATE') router.push('/candidate');
      else if (decoded.role === 'ASSESSOR' || decoded.role === 'ADMIN') router.push('/assessor');
      else router.push('/');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ai/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 p-6 animate-enter">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <Card className="border-border shadow-2xl bg-surface/80 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold tracking-tight">Welcome back</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to sign in
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow" 
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-foreground">Password</label>
                  <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow" 
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
