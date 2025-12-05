import React, { useState, KeyboardEvent } from 'react';
import { XMarkIcon } from '../constants';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onTagsChange, placeholder = "Add tags..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newTags = pastedText.split(/[\s,]+/).map(tag => tag.trim()).filter(Boolean);
    if(newTags.length > 0) {
        const uniqueNewTags = newTags.filter(tag => !tags.includes(tag));
        onTagsChange([...tags, ...uniqueNewTags]);
        setInputValue('');
    }
  };

  return (
    <div className="flex items-center flex-wrap gap-2 p-2 bg-white border border-slate-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
          <span>{tag}</span>
          <button
            type="button"
            className="ml-1.5 -mr-0.5 rounded-full hover:bg-blue-200"
            onClick={() => removeTag(index)}
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="bg-transparent focus:outline-none text-slate-800 text-sm flex-1 min-w-[80px]"
      />
    </div>
  );
}