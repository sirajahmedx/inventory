"use client";

import { Product } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Package,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

interface ForecastingCardProps {
  products: Product[];
  className?: string;
}

interface ForecastData {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  reorderSuggestions: Array<{
    product: Product;
    suggestedQuantity: number;
    urgency: "high" | "medium" | "low";
    reason: string;
  }>;
  demandForecast: Array<{
    category: string;
    currentStock: number;
    predictedDemand: number;
    confidence: number;
  }>;
  seasonalTrends: Array<{
    month: string;
    demand: number;
    trend: "up" | "down" | "stable";
  }>;
}

export function ForecastingCard({ products, className }: ForecastingCardProps) {
  const forecastData = useMemo((): ForecastData => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        reorderSuggestions: [],
        demandForecast: [],
        seasonalTrends: [],
      };
    }

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
    const outOfStockProducts = products.filter(p => p.quantity === 0).length;

    // Generate reorder suggestions
    const reorderSuggestions = products
      .filter(product => product.quantity <= 5)
      .map(product => {
        let suggestedQuantity = 20;
        let urgency: "high" | "medium" | "low" = "medium";
        let reason = "Low stock level";

        if (product.quantity === 0) {
          suggestedQuantity = 30;
          urgency = "high";
          reason = "Out of stock";
        } else if (product.quantity <= 2) {
          suggestedQuantity = 25;
          urgency = "high";
          reason = "Critical stock level";
        } else if (product.quantity <= 5) {
          suggestedQuantity = 20;
          urgency = "medium";
          reason = "Low stock level";
        }

        return {
          product,
          suggestedQuantity,
          urgency,
          reason,
        };
      })
      .slice(0, 5); // Top 5 suggestions

    // Generate demand forecast by category
    const categoryMap = new Map<string, Product[]>();
    products.forEach(product => {
      const category = product.category || "Unknown";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(product);
    });

    const demandForecast = Array.from(categoryMap.entries()).map(([category, categoryProducts]) => {
      const currentStock = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
      const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;

      // Simple demand prediction based on price and current stock
      const predictedDemand = Math.max(
        Math.floor(currentStock * 0.8), // 80% of current stock
        Math.floor(categoryProducts.length * 5) // At least 5 units per product
      );

      const confidence = Math.min(85, Math.max(60, 100 - (avgPrice / 10))); // Higher price = lower confidence

      return {
        category,
        currentStock,
        predictedDemand,
        confidence,
      };
    });

    // Generate seasonal trends (simulated)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const seasonalTrends = months.map((month, index) => {
      const baseDemand = totalProducts * 2;
      const seasonalFactor = 1 + Math.sin((index / 6) * Math.PI * 2) * 0.3; // Seasonal variation
      const demand = Math.floor(baseDemand * seasonalFactor);

      let trend: "up" | "down" | "stable" = "stable";
      if (index > 0) {
        const prevDemand = Math.floor(baseDemand * (1 + Math.sin(((index - 1) / 6) * Math.PI * 2) * 0.3));
        if (demand > prevDemand * 1.1) trend = "up";
        else if (demand < prevDemand * 0.9) trend = "down";
      }

      return { month, demand, trend };
    });

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      reorderSuggestions,
      demandForecast,
      seasonalTrends,
    };
  }, [products]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "low": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Demand Forecasting & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{forecastData.totalProducts}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{forecastData.lowStockProducts}</div>
            <div className="text-sm text-muted-foreground">Low Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{forecastData.outOfStockProducts}</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </div>
        </div>

        {/* Reorder Suggestions */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reorder Suggestions
          </h4>
          <div className="space-y-2">
            {forecastData.reorderSuggestions.length > 0 ? (
              forecastData.reorderSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{suggestion.product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Current: {suggestion.product.quantity} | Suggested: {suggestion.suggestedQuantity}
                    </div>
                    <div className="text-xs text-muted-foreground">{suggestion.reason}</div>
                  </div>
                  <Badge className={getUrgencyColor(suggestion.urgency)}>
                    {suggestion.urgency.toUpperCase()}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No reorder suggestions at this time
              </div>
            )}
          </div>
        </div>

        {/* Demand Forecast by Category */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Category Demand Forecast
          </h4>
          <div className="space-y-3">
            {forecastData.demandForecast.map((forecast, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{forecast.category}</span>
                  <span className="text-xs text-muted-foreground">
                    {forecast.confidence.toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {forecast.currentStock}</span>
                  <span>Predicted: {forecast.predictedDemand}</span>
                </div>
                <Progress value={forecast.confidence} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Seasonal Demand Trends
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {forecastData.seasonalTrends.map((trend, index) => (
              <div key={index} className="text-center p-2 border rounded">
                <div className="text-xs font-medium">{trend.month}</div>
                <div className="text-lg font-bold">{trend.demand}</div>
                <div className="flex justify-center mt-1">
                  {getTrendIcon(trend.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            <Package className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex-1">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
