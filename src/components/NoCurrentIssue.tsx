import React from 'react';
import { BookOpen } from 'lucide-react';

const NoCurrentIssue: React.FC = () => {
  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-journal-mauve">
      <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
      <h3 className="text-3xl font-bold text-gray-700 mb-3 font-serif">
        No Current Issue Available
      </h3>
      <p className="text-gray-600 text-lg">
        Please check back later for the latest publication.
      </p>
    </div>
  );
};

export default NoCurrentIssue;
