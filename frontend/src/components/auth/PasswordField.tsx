import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PasswordField({ value, onChange, label = "Password", required = true }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <div className="relative">
        <Input 
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          className="pr-10"
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
