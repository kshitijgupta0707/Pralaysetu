import React from 'react';
import { Badge } from '@/components/ui/badge';

const UrgencyBadge = ({ urgency }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Badge className={getUrgencyColor(urgency)}>
      {urgency?.charAt(0).toUpperCase() + urgency?.slice(1) || "Unknown"}
    </Badge>
  );
};

export default UrgencyBadge;