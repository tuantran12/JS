"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown } from "lucide-react";
import { formatCompactCurrency, formatPercentage, getChangeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  variant?: "default" | "positive" | "negative";
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  tooltip,
  icon,
  variant = "default",
  children,
}: MetricCardProps) {
  const showChange = change !== undefined;
  const isPositive = change && change >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {title}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {showChange && (
            <div className="flex items-center gap-1 text-xs">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-positive" />
              ) : (
                <TrendingDown className="h-3 w-3 text-negative" />
              )}
              <span className={cn(getChangeColor(change))}>
                {formatPercentage(change)}
              </span>
              {changeLabel && (
                <span className="text-muted-foreground">({changeLabel})</span>
              )}
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
