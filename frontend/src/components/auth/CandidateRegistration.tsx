import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';

export function CandidateRegistration({ formData, setFormData, onSubmit, loading }: any) {
  const [password, setPassword] = useState('');
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({...formData, password}); }} className="space-y-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input required value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Experience Level</Label>
        <Select onValueChange={v => setFormData({...formData, experience: v})}>
          <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Fresher">Fresher</SelectItem>
            <SelectItem value="Junior Developer">Junior Developer</SelectItem>
            <SelectItem value="Software Engineer">Software Engineer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PasswordField value={password} onChange={(e: any) => setPassword(e.target.value)} />
      {password.length > 0 && <PasswordStrength password={password} />}
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Candidate Account'}
      </Button>
    </form>
  );
}
