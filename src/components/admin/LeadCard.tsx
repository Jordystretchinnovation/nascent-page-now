import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, User } from 'lucide-react';

interface FormSubmission {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon: string | null;
  kwaliteit: string | null;
  created_at: string;
  sales_rep: string | null;
}

interface LeadCardProps {
  submission: FormSubmission;
  onClick: () => void;
  isDragging?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({ submission, onClick, isDragging }) => {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'stalen':
        return 'default';
      case 'renderboek':
        return 'secondary';
      case 'korting':
        return 'destructive';
      case 'keukentrends':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stalen':
        return 'Stalen';
      case 'renderboek':
        return 'Collection';
      case 'korting':
        return 'Korting';
      case 'keukentrends':
        return 'Trends';
      default:
        return type;
    }
  };

  const getKwaliteitBadgeVariant = (kwaliteit: string | null) => {
    switch (kwaliteit) {
      case 'Goed':
      case 'Goed - Klant':
        return 'default';
      case 'Redelijk':
        return 'secondary';
      case 'Slecht':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getDaysSinceCreated = () => {
    const created = new Date(submission.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDragging ? 'shadow-lg ring-2 ring-primary ring-opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header with type and quality */}
          <div className="flex items-center justify-between">
            <Badge variant={getTypeBadgeVariant(submission.type)} className="text-xs">
              {getTypeLabel(submission.type)}
            </Badge>
            {submission.kwaliteit && (
              <Badge variant={getKwaliteitBadgeVariant(submission.kwaliteit)} className="text-xs">
                {submission.kwaliteit}
              </Badge>
            )}
          </div>

          {/* Name */}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-sm">
              {submission.voornaam} {submission.achternaam}
            </span>
          </div>

          {/* Company */}
          {submission.bedrijf && (
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">
                {submission.bedrijf}
              </span>
            </div>
          )}

          {/* Email */}
          <div className="text-xs text-muted-foreground truncate">
            {submission.email}
          </div>

          {/* Footer with days and sales rep */}
          <div className="flex items-center justify-between pt-1 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {getDaysSinceCreated()}d geleden
              </span>
            </div>
            {submission.sales_rep && (
              <Badge variant="outline" className="text-xs">
                {submission.sales_rep}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};