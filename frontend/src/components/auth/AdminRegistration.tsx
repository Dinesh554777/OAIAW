import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordField } from './PasswordField';

export function AdminRegistration({ formData, setFormData, onSubmit, loading }: any) {
  const [password, setPassword] = useState('');
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({...formData, password}); }} className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-md text-sm mb-4">
        Admin accounts require authorization.
      </div>
      <div className="space-y-2">
        <Label>Admin Invitation Code</Label>
        <Input required value={formData.inviteCode || ''} onChange={e => setFormData({...formData, inviteCode: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input required value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>
      <PasswordField value={password} onChange={(e: any) => setPassword(e.target.value)} />
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Verifying...' : 'Create Admin Account'}
      </Button>
    </form>
  );
}
