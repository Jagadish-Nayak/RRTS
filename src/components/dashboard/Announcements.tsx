import React from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  bgColor: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
  title?: string;
}

const Announcements = ({ announcements, title = 'Announcements' }: AnnouncementsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-medium mb-4 text-gray-700">{title}</h3>
      
      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`p-3 rounded-lg border-l-4 ${announcement.bgColor} transition-transform hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">{announcement.title}</h4>
              <span className="text-xs text-gray-500">{announcement.date}</span>
            </div>
            <p className="text-sm mt-1 text-gray-600">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;