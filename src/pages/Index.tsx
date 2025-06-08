import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, ArrowUpDown, Bot, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdeaResult {
  id: string | number;
  productArea?: string;
  summary?: string;
  releaseNote?: string;
  idea?: string;
  content?: string;
  score: number;
  classification?: string;
  // Legacy properties for backward compatibility
  title?: string;
  description?: string;
  category?: string;
  url?: string;
}

type SortField = 'score' | 'classification' | 'idea' | 'content' | 'releaseNote' | 'summary' | 'productArea';
type SortOrder = 'asc' | 'desc';

const Index = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<IdeaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [doppelgangerLoading, setDoppelgangerLoading] = useState(false);
  const [thinkLonger, setThinkLonger] = useState(false);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [doppelgangerDialogOpen, setDoppelgangerDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    try {
      //test - http://localhost:5678/webhook-test/8186e3fd-4088-4dbd-83a9-249867c64014
      //prod - http://localhost:5678/webhook/8186e3fd-4088-4dbd-83a9-249867c64014
      const response = await fetch('http://localhost:5678/webhook/8186e3fd-4088-4dbd-83a9-249867c64014', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: url,
          mode: thinkLonger ? 1 : 0
        })
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
        classification: item.classification || (thinkLonger ? 'Match found' : undefined),
        // Keep legacy properties for compatibility
        title: item.title || item.summary,
        description: item.description || item.content,
        category: item.category || item.productArea,
        url: item.url
      }));
      
      setResults(processedIdeas);
      toast({
        title: "AI Analysis Complete! 🤖",
        description: `Found ${processedIdeas.length} matching ideas using AI-powered analysis.`
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to analyze release notes. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const parseCsvToJson = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const handleDoppelganger = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file first.",
        variant: "destructive"
      });
      return;
    }

    setDoppelgangerLoading(true);
    try {
      const csvText = await csvFile.text();
      const jsonData = parseCsvToJson(csvText);
      
      console.log('Parsed CSV data:', jsonData);
      
      const response = await fetch('http://localhost:5678/webhook/doppelganger-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'find_doppelgangers',
          data: jsonData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Doppelganger response:', data);
      
      setDoppelgangerDialogOpen(false);
      setCsvFile(null);
      
      toast({
        title: "AI Doppelgänger Search Complete! 👯",
        description: "Found ideas that look suspiciously familiar."
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to find idea doppelgängers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDoppelgangerLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateClick = (ideaId: string) => {
    const url = `https://powerschoolgroup.atlassian.net/browse/${ideaId}`;
    window.open(url, '_blank');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (thinkLonger && sortField === 'classification') {
      aValue = a.classification || '';
      bValue = b.classification || '';
    } else if (sortField === 'score') {
      aValue = a.score;
      bValue = b.score;
    } else {
      aValue = a[sortField] || '';
      bValue = b[sortField] || '';
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortOrder === 'desc') {
      return bStr.localeCompare(aStr);
    }
    return aStr.localeCompare(bStr);
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Match found':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Related':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Peripheral insight':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortOrder === 'desc' ? 
      <ChevronDown className="h-4 w-4 ml-1" /> : 
      <ChevronUp className="h-4 w-4 ml-1" />;
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
            <CardDescription className="font-thin text-xs">
              Enter release notes URL (e.g. https://ut.powerschool-docs.com/app-tracking-employer/latest/release-25-3-1-0-march-2025)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter URL"
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
              
              {/* Think for longer toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="think-longer"
                  checked={thinkLonger}
                  onCheckedChange={setThinkLonger}
                />
                <label
                  htmlFor="think-longer"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Think for longer
                </label>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Idea Doppelgänger Button */}
        <div className="flex justify-center">
          <div className="text-center">
            <Dialog open={doppelgangerDialogOpen} onOpenChange={setDoppelgangerDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-2"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Idea Doppelgänger
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload CSV for Doppelgänger Analysis</DialogTitle>
                  <DialogDescription>
                    Select a CSV file containing idea data to find suspiciously similar ideas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                  {csvFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {csvFile.name}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDoppelgangerDialogOpen(false);
                        setCsvFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDoppelganger}
                      disabled={!csvFile || doppelgangerLoading}
                    >
                      {doppelgangerLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          AI is searching...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <p className="text-sm text-gray-500">
              find ideas that look suspiciously similar
            </p>
          </div>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Ideas Found ({results.length})
              </CardTitle>
              <CardDescription>
                Ideas extracted from the release notes, ranked by AI relevance {thinkLonger ? 'classification' : 'score'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="w-[100px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200"
                        onClick={() => handleSort(thinkLonger ? 'classification' : 'score')}
                      >
                        <div className="flex items-center">
                          {thinkLonger ? 'Classification' : 'Score'}
                          {renderSortIcon(thinkLonger ? 'classification' : 'score')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="w-[120px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200"
                        onClick={() => handleSort('idea')}
                      >
                        <div className="flex items-center">
                          Idea ID
                          {renderSortIcon('idea')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="min-w-[300px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200"
                        onClick={() => handleSort('content')}
                      >
                        <div className="flex items-center">
                          Idea Description
                          {renderSortIcon('content')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="min-w-[300px] cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('releaseNote')}
                      >
                        <div className="flex items-center">
                          Release Note
                          {renderSortIcon('releaseNote')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="w-[200px] cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('summary')}
                      >
                        <div className="flex items-center">
                          Summary
                          {renderSortIcon('summary')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="w-[200px] cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('productArea')}
                      >
                        <div className="flex items-center">
                          Product Area
                          {renderSortIcon('productArea')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResults.map((idea) => (
                      <TableRow key={idea.id} className="hover:bg-gray-50">
                        <TableCell className="bg-blue-50">
                          <Badge 
                            variant="outline" 
                            className={`font-mono ${
                              thinkLonger && idea.classification 
                                ? getClassificationColor(idea.classification)
                                : getScoreColor(idea.score)
                            }`}
                          >
                            {thinkLonger && idea.classification 
                              ? idea.classification 
                              : idea.score.toFixed(3)
                            }
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
                            Go to JIRA
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
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
