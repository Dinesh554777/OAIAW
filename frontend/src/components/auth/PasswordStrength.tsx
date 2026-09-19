'use client';
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

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
    <div className="mt-2 space-y-2">
      {rules.map((rule, i) => (
        <div key={i} className="flex items-center text-sm">
          {rule.met ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground mr-2" />
          )}
          <span className={rule.met ? "text-foreground" : "text-muted-foreground"}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}
