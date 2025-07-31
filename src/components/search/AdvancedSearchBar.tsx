import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const AdvancedSearchBar = ({ onSearch }) => {
  const [searchTags, setSearchTags] = useState([]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setSearchTags(prev => [...prev, e.target.value.trim()]);
      e.target.value = '';
      onSearch(searchTags);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Type and press Enter to add search terms..."
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-wrap gap-2">
        {searchTags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => setSearchTags(prev => prev.filter((_, i) => i !== index))}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};