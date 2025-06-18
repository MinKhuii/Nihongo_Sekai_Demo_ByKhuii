import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CourseSearchParams } from "@/types";
import { X } from "lucide-react";

interface CourseFiltersProps {
  onFilterChange: (filters: Partial<CourseSearchParams>) => void;
  initialFilters?: CourseSearchParams;
}

export function CourseFilters({
  onFilterChange,
  initialFilters = {},
}: CourseFiltersProps) {
  const [filters, setFilters] = useState<Partial<CourseSearchParams>>({
    level: initialFilters.level || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 200,
    category: initialFilters.category || "",
  });

  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 200,
  ]);

  const levels = ["Beginner", "Elementary", "Intermediate", "Advanced"];
  const categories = [
    "JLPT Preparation",
    "Business Japanese",
    "Conversation",
    "Grammar",
    "Culture",
    "Anime & Manga",
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    handleFilterChange("minPrice", values[0]);
    handleFilterChange("maxPrice", values[1]);
  };

  const clearFilters = () => {
    const clearedFilters = {
      level: "",
      minPrice: 0,
      maxPrice: 200,
      category: "",
    };
    setFilters(clearedFilters);
    setPriceRange([0, 200]);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.level ||
    filters.category ||
    (filters.minPrice && filters.minPrice > 0) ||
    (filters.maxPrice && filters.maxPrice < 200);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-nihongo-ink-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-nihongo-crimson-600 hover:text-nihongo-crimson-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-nihongo-ink-700">
            Level
          </Label>
          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-nihongo-ink-700">
            Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-nihongo-ink-700">
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-nihongo-ink-500 mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Duration Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-nihongo-ink-700">
            Duration
          </Label>
          <Select
            onValueChange={(value) => handleFilterChange("duration", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any duration</SelectItem>
              <SelectItem value="short">Short (0-20 hours)</SelectItem>
              <SelectItem value="medium">Medium (20-40 hours)</SelectItem>
              <SelectItem value="long">Long (40+ hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-6 pt-6 border-t">
        <Label className="text-sm font-medium text-nihongo-ink-700 mb-3 block">
          Features
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Native Speaker Instructor",
            "Live Sessions",
            "Certificate",
            "Mobile Access",
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    `feature_${feature.toLowerCase().replace(" ", "_")}`,
                    checked,
                  )
                }
              />
              <Label htmlFor={feature} className="text-sm text-nihongo-ink-600">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
