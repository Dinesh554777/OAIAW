import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';

export function AssessorRegistration({ formData, setFormData, onSubmit, loading }: any) {
  const [password, setPassword] = useState('');
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({...formData, password}); }} className="space-y-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input required value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Work Email</Label>
        <Input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Organization</Label>
        <Input required value={formData.organization || ''} onChange={e => setFormData({...formData, organization: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Assessment Domain</Label>
        <Select onValueChange={v => setFormData({...formData, domain: v})}>
          <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
            <SelectItem value="AI / ML">AI / ML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PasswordField value={password} onChange={(e: any) => setPassword(e.target.value)} />
      {password.length > 0 && <PasswordStrength password={password} />}
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Assessor Account'}
      </Button>
    </form>
  );
}
