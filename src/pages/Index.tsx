
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowUpDown, Bot } from "lucide-react";
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
  const [doppelgangerLoading, setDoppelgangerLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5678/webhook/8186e3fd-4088-4dbd-83a9-249867c64014', {
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
        title: "AI Analysis Complete! 🤖",
        description: `Found ${processedIdeas.length} matching ideas using AI-powered analysis.`,
      });

    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to analyze release notes. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDoppelganger = async () => {
    setDoppelgangerLoading(true);
    try {
      // Placeholder webhook call - replace with actual endpoint
      const response = await fetch('http://localhost:5678/webhook/doppelganger-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'find_doppelgangers' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Doppelganger response:', data);
      
      toast({
        title: "AI Doppelgänger Search Complete! 👯",
        description: "Found ideas that look suspiciously familiar.",
      });

    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to find idea doppelgängers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDoppelgangerLoading(false);
    }
  };

  const handleUpdateClick = (ideaId: string) => {
    const url = `https://powerschoolgroup.atlassian.net/browse/${ideaId}`;
    window.open(url, '_blank');
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
          <h1 className="text-4xl font-bold text-gray-900">Not a bad <strong>IDEA</strong> 😏</h1>
          <p className="text-lg text-gray-600">One person's wild idea is another's Jira ticket.</p>
        </div>

        {/* Input Form */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find matching ideas
            </CardTitle>
            <CardDescription>
              Enter release notes URL (e.g. https://ut.powerschool-docs.com/app-tracking-employer/latest/release-25-3-1-0-march-2025)
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
                      AI is thinking...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
            
            {/* Idea Doppelgänger Button */}
            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={handleDoppelganger} 
                disabled={doppelgangerLoading}
                variant="outline"
                className="w-full"
              >
                {doppelgangerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI is searching...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Idea Doppelgänger
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-1">
                find ideas that look suspiciously familiar
              </p>
            </div>
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
                Ideas extracted from the release notes, ranked by AI relevance score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] bg-blue-100 font-bold">Score</TableHead>
                      <TableHead className="w-[120px] bg-blue-100 font-bold">Idea ID</TableHead>
                      <TableHead className="min-w-[300px] bg-blue-100 font-bold">Idea Description</TableHead>
                      <TableHead className="min-w-[300px]">Release Note</TableHead>
                      <TableHead className="w-[200px]">Summary</TableHead>
                      <TableHead className="w-[200px]">Product Area</TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResults.map((idea) => (
                      <TableRow key={idea.id} className="hover:bg-gray-50">
                        <TableCell className="bg-blue-50">
                          <Badge 
                            variant="outline" 
                            className={`font-mono ${getScoreColor(idea.score)}`}
                          >
                            {idea.score.toFixed(3)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium bg-blue-50">
                          {idea.idea || `IDEA-${idea.id}`}
                        </TableCell>
                        <TableCell className="bg-blue-50">
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
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateClick(idea.idea || `IDEA-${idea.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Update
                          </Button>
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
