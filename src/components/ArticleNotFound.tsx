import React from 'react';
import { FileText } from 'lucide-react';

const ArticleNotFound: React.FC = () => {
  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-journal-mauve">
      <FileText className="h-20 w-20 text-gray-300 mx-auto mb-6" />
      <h3 className="text-3xl font-bold text-gray-700 mb-3 font-serif">
        Article Not Found
      </h3>
      <p className="text-gray-600 text-lg">
        The article you are looking for does not exist or has been removed.
      </p>
    </div>
  );
};

export default ArticleNotFound;
