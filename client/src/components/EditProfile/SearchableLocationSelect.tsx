import { useState, useRef, useEffect } from "react";
import { ALGERIAN_WILAYAS } from "@/imports/constants";
import { ChevronDown } from "lucide-react";

interface SearchableLocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchableLocationSelect({ value, onChange }: SearchableLocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(ALGERIAN_WILAYAS);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to remove accents
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filter options based on search input
  useEffect(() => {
    if (searchInput.length >= 2) {
      const searchLower = removeAccents(searchInput.toLowerCase());
      const filtered = ALGERIAN_WILAYAS.filter(wilaya => {
        // Extract wilaya name (after the "XX-" prefix)
        const namePart = wilaya.label.split('-')[1] || wilaya.label;
        const nameWithoutAccents = removeAccents(namePart.toLowerCase());
        return nameWithoutAccents.startsWith(searchLower);
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(ALGERIAN_WILAYAS);
    }
  }, [searchInput]);

  // Handle keyboard input for search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Only allow letters
    const lettersOnly = input.replace(/[^a-zA-Z]/g, '');
    
    if (lettersOnly.length > 2) {
      // Reset: take only the last character as the new first character
      const lastCharacter = lettersOnly[lettersOnly.length - 1];
      setSearchInput(lastCharacter);
    } else {
      setSearchInput(lettersOnly);
    }
  };

  // Handle option selection
  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchInput('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedLabel = ALGERIAN_WILAYAS.find(w => w.value === value)?.label || 'Select location';

  return (
    <div ref={containerRef} className="relative">
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent bg-white text-left flex items-center justify-between hover:border-[#00b70d] transition-colors"
      >
        <span className="text-gray-700">{selectedLabel}</span>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e2e8f0] rounded-lg shadow-lg z-10">
          {/* Search input */}
          <div className="p-2 border-b border-[#e2e8f0]">
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Type 2+ letters to search..."
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b70d] text-sm"
            />
            {searchInput.length > 0 && searchInput.length < 2 && (
              <p className="text-xs text-gray-500 mt-1">Type one more letter...</p>
            )}
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((wilaya) => (
                <button
                  key={wilaya.value}
                  type="button"
                  onClick={() => handleSelectOption(wilaya.value)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f0fdf4] transition-colors ${
                    value === wilaya.value ? 'bg-[#e8fbe8] text-[#00b70d] font-medium' : 'text-gray-700'
                  }`}
                >
                  {wilaya.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
