'use client';

import { useState } from 'react';
import { Input } from '@/modules/core/components/ui/input';
import { Button } from '@/modules/core/components/ui/button';
import { Label } from '@/modules/core/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/core/components/ui/select';
import { 
  Calendar, 
  Search, 
  Filter, 
  X,
  Download
} from 'lucide-react';
import { KYCFilterOptions } from '@/modules/core/types/kyc';
import { format, subDays } from 'date-fns';

interface ApplicationFiltersProps {
  filters: KYCFilterOptions;
  onFilterChange: (filters: Partial<KYCFilterOptions>) => void;
  totalApplications: number;
  onExport?: () => void;
}

export default function ApplicationFilters({
  filters,
  onFilterChange,
  totalApplications,
  onExport
}: ApplicationFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, status: value as any || undefined }));
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value || undefined }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setLocalFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: 10,
      sortBy: 'submittedAt' as const,
      sortOrder: 'desc' as const
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.status || filters.search || filters.dateFrom || filters.dateTo;
  };

  const getSortOptions = () => {
    return [
      { value: 'submittedAt-desc', label: 'Newest First' },
      { value: 'submittedAt-asc', label: 'Oldest First' },
      { value: 'reviewedAt-desc', label: 'Recently Reviewed' },
      { value: 'reviewedAt-asc', label: 'Least Recently Reviewed' },
      { value: 'createdAt-desc', label: 'Newest Applications' },
      { value: 'createdAt-asc', label: 'Oldest Applications' }
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'submitted', label: 'Submitted' },
      { value: 'under_review', label: 'Under Review' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ];
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by seller name or email..."
              value={localFilters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={localFilters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="w-full md:w-48">
          <Select
            value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {getSortOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply
          </Button>
          
          {hasActiveFilters() && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
          
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-gray-600 hover:text-gray-900"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>
        
        <div className="text-sm text-gray-500">
          {totalApplications} applications found
          {hasActiveFilters() && (
            <span className="ml-2 text-amber-600">(filters applied)</span>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range Filters */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Submitted After
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                  className="pl-10"
                  max={localFilters.dateTo || format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Submitted Before
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => handleDateChange('dateTo', e.target.value)}
                  className="pl-10"
                  min={localFilters.dateFrom}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Date Presets
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Last 7 days', days: 7 },
                  { label: 'Last 30 days', days: 30 },
                  { label: 'Last 90 days', days: 90 },
                  { label: 'Last 6 months', days: 180 }
                ].map((preset) => (
                  <Button
                    key={preset.days}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fromDate = format(subDays(new Date(), preset.days), 'yyyy-MM-dd');
                      setLocalFilters(prev => ({
                        ...prev,
                        dateFrom: fromDate,
                        dateTo: format(new Date(), 'yyyy-MM-dd')
                      }));
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Advanced Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Advanced Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}