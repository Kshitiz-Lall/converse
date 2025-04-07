import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, ChevronDown, ChevronUp, Filter, InfoIcon, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

type Evaluation = {
  name: string;
  value: number;
  normalized_score: number;
};

type Model = {
  name: string;
  sha: string;
  precision: string;
  type: string;
  weight_type: string;
  architecture: string;
  average_score: number;
  has_chat_template: boolean;
};

type Features = {
  is_not_available_on_hub: boolean;
  is_merged: boolean;
  is_moe: boolean;
  is_flagged: boolean;
  is_official_provider: boolean;
};

type Metadata = {
  upload_date: string;
  submission_date: string;
  generation: number;
  base_model: string;
  hub_license: string;
  hub_hearts: number;
  params_billions: number;
  co2_cost: number;
};

type LeaderboardEntry = {
  id: string;
  model: Model;
  evaluations: Record<string, Evaluation>;
  features: Features;
  metadata: Metadata;
};

type LeaderboardPaginatedResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: LeaderboardEntry[];
};

type SortConfig = {
  key: string;
  direction: 'ascending' | 'descending';
};

export function LLMLeaderboard() {
  const [data, setData] = useState<LeaderboardPaginatedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [officialFilter, setOfficialFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [activeTab, setActiveTab] = useState('all');

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'average_score',
    direction: 'descending',
  });

  const fetchData = async () => {
    try {
      // setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (sizeFilter) queryParams.append('size', sizeFilter);
      if (officialFilter) queryParams.append('official', officialFilter);

      const response = await fetch(
        `http://localhost:3000/api/llm-calculation?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sizeFilter, officialFilter]);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 inline" />
    );
  };

  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const getSortedData = () => {
    if (!data?.data) return [];

    return [...data.data].sort((a, b) => {
      if (sortConfig.key === 'average_score') {
        return sortConfig.direction === 'ascending'
          ? a.model.average_score - b.model.average_score
          : b.model.average_score - a.model.average_score;
      }

      if (sortConfig.key in a.evaluations) {
        return sortConfig.direction === 'ascending'
          ? a.evaluations[sortConfig.key].normalized_score -
              b.evaluations[sortConfig.key].normalized_score
          : b.evaluations[sortConfig.key].normalized_score -
              a.evaluations[sortConfig.key].normalized_score;
      }

      return 0;
    });
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Alert variant="default" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No data available</AlertDescription>
      </Alert>
    );
  }

  const sortedData = getSortedData();

  // Calculate page numbers to show (current, prev, next)
  const getPageNumbers = () => {
    if (!data) return [];

    const pages = [];
    const totalPages = data.totalPages;
    const currentPage = page;

    // Always add page 1
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push('...');
    }

    // Add previous page if not at beginning
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    // Add current page if not 1
    if (currentPage !== 1) {
      pages.push(currentPage);
    }

    // Add next page if not at end
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Add last page if not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Helper function to get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-600 font-medium';
    if (score >= 60) return 'text-blue-600 font-medium';
    if (score >= 40) return 'text-amber-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto p-4 py-8 max-w-6xl">
        <Card className="mb-8 bg-gradient-to-r from-slate-50 to-white shadow-md dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <Badge variant="outline" className="mb-2 text-xs bg-primary/10 text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Benchmarks
                </Badge>
                <CardTitle className="text-3xl font-bold">Open LLM Leaderboard</CardTitle>
              </div>
              <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
                <Filter className="h-4 w-4" />
                <span>
                  Showing {data.data.length} of {data.total} models
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Compare performance metrics across various large language models and benchmarks.
            </p>
          </CardHeader>
        </Card>

        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Size Filter Buttons */}
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-sm font-medium text-muted-foreground">Size:</span>
                  {['edge', 'smol', 'mid', 'gpu'].map(size => (
                    <Button
                      key={size}
                      variant={sizeFilter === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setPage(1);
                        setSizeFilter(sizeFilter === size ? null : size);
                      }}
                      className="h-8"
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Official Provider Checkbox */}
                <div className="flex items-center gap-2 bg-muted/40 px-3 py-2 rounded-md">
                  <Checkbox
                    id="official"
                    checked={officialFilter === 'true'}
                    onCheckedChange={checked => {
                      setPage(1);
                      setOfficialFilter(checked ? 'true' : null);
                    }}
                  />
                  <label htmlFor="official" className="text-sm cursor-pointer select-none">
                    Official Provider Only
                  </label>
                </div>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px] py-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('average_score')}
                    className="p-0 hover:bg-transparent font-medium"
                  >
                    Model {getSortIcon('average_score')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('average_score')}
                    className="p-0 hover:bg-transparent font-medium"
                  >
                    Average Score {getSortIcon('average_score')}
                  </Button>
                </TableHead>
                {Object.values(sortedData[0]?.evaluations || {}).map(evalItem => (
                  <TableHead key={evalItem.name} className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleSort(evalItem.name.toLowerCase().replace(/\s+/g, '_'))
                            }
                            className="p-0 hover:bg-transparent font-medium"
                          >
                            {evalItem.name}{' '}
                            {getSortIcon(evalItem.name.toLowerCase().replace(/\s+/g, '_'))}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{evalItem.name} benchmark score</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                ))}
                <TableHead className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-medium inline-flex items-center gap-1">
                          Params (B) <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Model size in billions of parameters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((entry, index) => (
                <TableRow key={entry.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-xs">{entry.model.name}</span>
                        {entry.features.is_official_provider && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          >
                            Official
                          </Badge>
                        )}
                        {entry.features.is_moe && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          >
                            MoE
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{entry.model.architecture}</span>
                        <span>•</span>
                        <span>{entry.model.precision}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right ${getScoreColorClass(entry.model.average_score)}`}
                  >
                    {entry.model.average_score.toFixed(2)}
                  </TableCell>
                  {Object.values(entry.evaluations).map(evalItem => (
                    <TableCell
                      key={evalItem.name}
                      className={`text-right ${getScoreColorClass(evalItem.normalized_score)}`}
                    >
                      {evalItem.normalized_score.toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-mono text-sm">
                    {entry.metadata.params_billions.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls with shadcn */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            Showing page {page} of {data.totalPages} • {data.total} models total
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, idx) =>
                pageNum === '...' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${pageNum}`}>
                    <PaginationLink
                      onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                      className={
                        page === pageNum
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'cursor-pointer'
                      }
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    data && page >= data.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default LLMLeaderboard;
