import React from 'react';
import { Check, CircleAlert } from 'lucide-react';

export function PasswordStrength({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  const rules = [
    { label: "At least 8 characters", met: hasLength },
    { label: "Contains uppercase", met: hasUpper },
    { label: "Contains number", met: hasNumber }
  ];

  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule, i) => (
        <div key={i} className="flex items-center text-xs">
          {rule.met ? (
            <Check size={14} className="text-green-500 mr-2" />
          ) : (
            <CircleAlert size={14} className="text-muted-foreground mr-2" />
          )}
          <span className={rule.met ? "text-foreground" : "text-muted-foreground"}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}
