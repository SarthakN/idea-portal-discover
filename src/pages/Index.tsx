
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdeaResult {
  id: string | number;
  productArea?: string;
  summary?: string;
  releaseNote?: string;
  idea?: string;
  content?: string;
  score: number;
  // Legacy properties for backward compatibility
  title?: string;
  description?: string;
  category?: string;
  url?: string;
}

const Index = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<IdeaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5678/webhook-test/8186e3fd-4088-4dbd-83a9-249867c64014', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);
      
      // Handle different response formats
      let ideas: IdeaResult[] = [];
      
      if (Array.isArray(data)) {
        ideas = data;
      } else if (data.ideas && Array.isArray(data.ideas)) {
        ideas = data.ideas;
      } else if (data.results && Array.isArray(data.results)) {
        ideas = data.results;
      } else {
        // If response is a single object, wrap it in an array
        ideas = [data];
      }

      // Ensure each item has required properties
      const processedIdeas = ideas.map((item, index) => ({
        id: item.id || `idea-${index}`,
        productArea: item.productArea || item.category || 'General',
        summary: item.summary || item.title || 'No summary',
        releaseNote: item.releaseNote || item.description || 'No release note',
        idea: item.idea || `IDEA-${item.id || index}`,
        content: item.content || item.description || 'No content',
        score: typeof item.score === 'number' ? item.score : Math.random() * 100,
        // Keep legacy properties for compatibility
        title: item.title || item.summary,
        description: item.description || item.content,
        category: item.category || item.productArea,
        url: item.url
      }));

      setResults(processedIdeas);
      
      toast({
        title: "Success!",
        description: `Found ${processedIdeas.length} ideas from the release notes.`,
      });

    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to fetch ideas. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.score - a.score;
    }
    return a.score - b.score;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 0.4) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Ideas Portal Finder</h1>
          <p className="text-lg text-gray-600">Analyze release notes and discover relevant ideas</p>
        </div>

        {/* Input Form */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Enter Release Notes URL
            </CardTitle>
            <CardDescription>
              Provide a URL to release notes for analysis and idea extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/release-notes"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Table */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ideas Found ({results.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSort}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by Score ({sortOrder === 'desc' ? 'High to Low' : 'Low to High'})
                </Button>
              </CardTitle>
              <CardDescription>
                Ideas extracted from the release notes, ranked by relevance score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] bg-blue-50 font-bold">Score</TableHead>
                      <TableHead className="w-[120px] bg-blue-50 font-bold">Idea ID</TableHead>
                      <TableHead className="min-w-[300px] bg-blue-50 font-bold">Content</TableHead>
                      <TableHead className="min-w-[300px]">Release Note</TableHead>
                      <TableHead className="w-[200px]">Summary</TableHead>
                      <TableHead className="w-[200px]">Product Area</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResults.map((idea) => (
                      <TableRow key={idea.id} className="hover:bg-gray-50">
                        <TableCell className="bg-blue-25">
                          <Badge 
                            variant="outline" 
                            className={`font-mono ${getScoreColor(idea.score)}`}
                          >
                            {idea.score.toFixed(3)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium bg-blue-25">
                          {idea.idea || `IDEA-${idea.id}`}
                        </TableCell>
                        <TableCell className="bg-blue-25">
                          <p className="text-sm text-gray-600 max-w-md whitespace-normal">
                            {idea.content}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 max-w-md whitespace-normal">
                            {idea.releaseNote}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium">
                          {idea.summary}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{idea.productArea}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-2">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">No ideas found yet</h3>
                <p className="text-gray-500">Enter a release notes URL above to start discovering ideas</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
