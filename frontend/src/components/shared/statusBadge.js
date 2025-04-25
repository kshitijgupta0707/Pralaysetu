import React from 'react';
import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'verified':
    case 'approved':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-blue-300 text-blue-800 border-blue-300">Accepted</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Completed</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    case 'assigned':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default StatusBadge;