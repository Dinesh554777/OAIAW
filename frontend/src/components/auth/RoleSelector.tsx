import React from 'react';
import { Code2, ClipboardCheck, ShieldCheck, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type Role = 'CANDIDATE' | 'ASSESSOR' | 'ADMIN';

interface RoleSelectorProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
  layout?: 'horizontal' | 'vertical';
}

export function RoleSelector({ selectedRole, onSelectRole, layout = 'horizontal' }: RoleSelectorProps) {
  const roles = [
    {
      id: 'CANDIDATE' as Role,
      label: 'Candidate',
      description: 'Take technical assessments & build with AI',
      icon: Code2,
    },
    {
      id: 'ASSESSOR' as Role,
      label: 'Assessor',
      description: 'Create assessments & review candidates',
      icon: ClipboardCheck,
    },
    {
      id: 'ADMIN' as Role,
      label: 'Admin',
      description: 'Manage platform & users',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className={`grid gap-3 w-full ${layout === 'horizontal' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
      {roles.map((r) => {
        const isSelected = selectedRole === r.id;
        return (
          <Card 
            key={r.id}
            onClick={() => onSelectRole(r.id)}
            className={`relative p-4 cursor-pointer transition-all duration-200 border-2 overflow-hidden flex flex-col hover:border-primary/50 group ${
              isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div className={`mb-3 p-2 rounded-lg w-fit transition-colors ${
              isSelected ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-muted-foreground group-hover:text-foreground'
            }`}>
              <r.icon size={20} />
            </div>
            <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-foreground' : 'text-slate-300'}`}>
              {r.label}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {r.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
