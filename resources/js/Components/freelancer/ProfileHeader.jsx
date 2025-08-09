import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserCheck, MapPin, Verified, Clock } from 'lucide-react';

export default function ProfileHeader({ freelancer }) {
  return (
    <div className="flex items-center gap-6 bg-white dark:bg-muted p-6 rounded-2xl shadow">
      <img src={freelancer.avatar} alt={freelancer.name} className="w-24 h-24 rounded-full object-cover" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{freelancer.name}</h2>
          {freelancer.verificationStatus === 'verified' && <Verified className="w-5 h-5 text-green-500" />}
        </div>

        <p className="text-muted-foreground">{freelancer.title}</p>

        <div className="flex items-center text-sm gap-3 mt-1 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{freelancer.location}</span>
          <Clock className="w-4 h-4" />
          <span>{freelancer.responseTime || 'Avg. Response Time'}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {freelancer.skills.map((skill, i) => (
            <Badge key={i} variant="outline">{skill}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
