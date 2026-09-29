"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, PRODUCT_CATEGORIES, Product } from "@/lib/products";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState<"name" | "category">("category");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS;

    // Filter by category
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.region?.toLowerCase().includes(query)
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // Sort by category, then by name within category
      const categoryCompare = a.category.localeCompare(b.category);
      return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Group products by category for display
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredAndSortedProducts.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [filteredAndSortedProducts]);

  const categoryKeys = Object.keys(groupedProducts).sort();

  return (
    <div className="bg-cream py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-green sm:text-5xl">
            Product Catalogue
          </h1>
          <p className="mt-4 text-lg text-soil/80">
            Browse our selection of pure, farmer-connected products sourced directly from India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-xl border border-gold/20 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label htmlFor="search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-soil/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, category, or description..."
                  className="block w-full rounded-lg border border-gold/30 bg-cream/50 py-3 pl-10 pr-3 font-sans text-sm text-soil placeholder-soil/50 focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
                />
              </div>
            </div>

            {/* Category and Sort Filters */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block font-sans text-sm font-medium text-soil"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full rounded-lg border border-gold/30 bg-cream/50 py-2.5 pl-3 pr-10 font-sans text-sm text-soil focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block font-sans text-sm font-medium text-soil"
                >
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "category")}
                  className="block w-full rounded-lg border border-gold/30 bg-cream/50 py-2.5 pl-3 pr-10 font-sans text-sm text-soil focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20"
                >
                  <option value="category">Category</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 border-t border-gold/20 pt-4">
            <p className="font-sans text-sm text-soil/70">
              Showing <span className="font-semibold text-green">{filteredAndSortedProducts.length}</span> of{" "}
              <span className="font-semibold text-green">{PRODUCTS.length}</span> products
            </p>
          </div>
        </div>

        {/* Products Grid - Grouped by Category */}
        {categoryKeys.length === 0 ? (
          <div className="rounded-xl border border-gold/20 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-soil/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 font-serif text-lg font-medium text-soil">No products found</h3>
            <p className="mt-2 font-sans text-sm text-soil/60">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {categoryKeys.map((category) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4 border-b-2 border-saffron/30 pb-2">
                  <h2 className="font-serif text-2xl font-bold text-green">{category}</h2>
                  <p className="mt-1 font-sans text-sm text-soil/60">
                    {groupedProducts[category].length} product{groupedProducts[category].length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {groupedProducts[category].map((product) => (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-xl border border-gold/20 bg-white p-5 shadow-sm transition-all hover:border-saffron/50 hover:shadow-md"
                    >
                      {/* Product Header */}
                      <div className="mb-3">
                        <h3 className="font-serif text-lg font-semibold text-green group-hover:text-saffron">
                          {product.name}
                        </h3>
                        <p className="mt-1 font-sans text-xs font-medium uppercase tracking-wide text-soil/50">
                          {product.category}
                        </p>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        {product.description && (
                          <p className="font-sans text-sm text-soil/70">{product.description}</p>
                        )}

                        <div className="flex items-baseline gap-2">
                          <span className="font-sans text-lg font-bold text-saffron">
                            {product.netWeight}
                          </span>
                          <span className="font-sans text-sm text-soil/60">{product.unit}</span>
                        </div>

                        {product.region && (
                          <div className="flex items-start gap-1.5 rounded-lg bg-cream/50 p-2">
                            <svg
                              className="mt-0.5 h-4 w-4 shrink-0 text-green/70"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <p className="font-sans text-xs text-soil/70">{product.region}</p>
                          </div>
                        )}

                        {product.orderQuantity && (
                          <div className="mt-2 rounded-lg border border-gold/20 bg-cream/30 px-2 py-1">
                            <p className="font-sans text-xs text-soil/60">
                              Order qty: <span className="font-semibold text-soil">{product.orderQuantity}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Hover overlay indicator */}
                      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="rounded-full bg-saffron/10 p-1.5">
                          <svg
                            className="h-4 w-4 text-saffron"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
