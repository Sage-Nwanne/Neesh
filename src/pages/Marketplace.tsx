import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SortDropdown } from '@/components/search/SortDropdown';
import { SearchResults } from '@/components/search/SearchResults';
import { NeeshSelectsSection } from '@/components/marketplace/NeeshSelectsSection';
import { PersonalizedRecommendations } from '@/components/marketplace/PersonalizedRecommendations';
import { useProductSearch } from '@/hooks/useProductSearch';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const { user, profile } = useAuth();
  const {
    searchQuery,
    filters,
    sortBy,
    currentPage,
    products,
    totalCount,
    loading,
    error,
    suggestions,
    setSearchQuery,
    updateFilters,
    updateSort,
    clearFilters,
    goToPage,
    totalPages,
  } = useProductSearch();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to the Marketplace</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to browse and purchase products from our publishers.
            </p>
            <Link to="/auth">
              <Button className="btn-primary">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Marketplace</h1>
              <p className="text-muted-foreground">
                Discover products from independent publishers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.business_name || user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              className="sticky top-24"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Sort Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      suggestions={suggestions}
                      placeholder="Search products, genres, or titles..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <SortDropdown
                      value={sortBy}
                      onChange={updateSort}
                      className="w-48"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Show curated sections when no search query */}
            {!searchQuery.trim() && Object.keys(filters).length === 0 && (
              <>
                {/* Neesh Selects */}
                <NeeshSelectsSection />
                
                {/* Personalized Recommendations */}
                <PersonalizedRecommendations />
              </>
            )}

            {/* Results */}
            <SearchResults
              products={products}
              loading={loading}
              error={error}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}