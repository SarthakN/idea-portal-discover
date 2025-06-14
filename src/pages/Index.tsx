import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, ArrowUpDown, Bot, ChevronUp, ChevronDown, Upload, DollarSign, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IdeaFlowAnimation from "@/components/IdeaFlowAnimation";
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
interface DoppelgangerResult {
  id_1: string;
  summary_1: string;
  text_1: string;
  id_2: string;
  summary_2: string;
  text_2: string;
  similarity: number;
}
interface MoneyResult {
  id: string;
  total_arr: number;
  votes: string;
  document: {
    pageContent: string;
    metadata: {
      ID: string;
      blobType: string;
      "loc.lines.from": number;
      "loc.lines.to": number;
      source: string;
    };
  };
  score: number;
}
type SortField = 'score' | 'classification' | 'idea' | 'content' | 'releaseNote' | 'summary' | 'productArea';
type SortOrder = 'asc' | 'desc';
type MoneySortField = 'score' | 'total_arr' | 'votes';
type ActiveCard = 'release-matcher' | 'idea-doppelganger' | 'show-money' | null;
const funnyLoadingMessages = ["Go grab a coffee… or make one for me too?", "Still faster than airport Wi-Fi.", "You wait. I'll pretend to optimize.", "Time is relative. Especially mine.", "Trying to look busy so you don't leave.", "Loading... because instant gratification is overrated.", "Every second you wait, a byte finds meaning.", "Negotiating with the loading gods. They're moody today."];
const Index = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<IdeaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [doppelgangerLoading, setDoppelgangerLoading] = useState(false);
  const [thinkLonger, setThinkLonger] = useState(false);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [doppelgangerDialogOpen, setDoppelgangerDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);
  const [currentDoppelgangerMessageIndex, setCurrentDoppelgangerMessageIndex] = useState(0);
  const [doppelgangerResults, setDoppelgangerResults] = useState<DoppelgangerResult[]>([]);
  const [moneyKeyword, setMoneyKeyword] = useState('');
  const [moneyResults, setMoneyResults] = useState<MoneyResult[]>([]);
  const [moneyLoading, setMoneyLoading] = useState(false);
  const [moneySortField, setMoneySortField] = useState<MoneySortField>('score');
  const [moneySortOrder, setMoneySortOrder] = useState<SortOrder>('desc');
  const {
    toast
  } = useToast();

  // Cycle through loading messages every 5 seconds for main loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingMessageIndex(() => Math.floor(Math.random() * funnyLoadingMessages.length));
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  // Cycle through loading messages every 5 seconds for doppelganger loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (doppelgangerLoading) {
      interval = setInterval(() => {
        setCurrentDoppelgangerMessageIndex(() => Math.floor(Math.random() * funnyLoadingMessages.length));
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [doppelgangerLoading]);

  // Reset message index when loading starts
  useEffect(() => {
    if (loading) {
      setCurrentLoadingMessageIndex(0);
    }
  }, [loading]);
  useEffect(() => {
    if (doppelgangerLoading) {
      setCurrentDoppelgangerMessageIndex(0);
    }
  }, [doppelgangerLoading]);
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
  const parseCsvToJson = csvText => {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;
    while (i < csvText.length) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];
      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField);
          currentField = '';
        } else if (char === '\n' || char === '\r' && nextChar === '\n') {
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = '';
          if (char === '\r' && nextChar === '\n') i += 1;
        } else {
          currentField += char;
        }
      }
      i += 1;
    }

    // Add last row
    if (currentField || currentRow.length) {
      currentRow.push(currentField);
      rows.push(currentRow);
      console.log(currentRow);
    }
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim();
      });
      return obj;
    });
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
      const response = await fetch('http://localhost:5678/webhook/4698c4cd-b508-441c-a21c-1a3fd39ec2ad', {
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

      // Store the doppelganger results
      setDoppelgangerResults(data);
      setDoppelgangerDialogOpen(false);
      setCsvFile(null);
      toast({
        title: "AI Doppelgänger Search Complete! 👯",
        description: `Found ${data.length} idea pairs that look suspiciously familiar.`
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
  const handleIdeaClick = (ideaId: string) => {
    const url = `https://powerschoolgroup.atlassian.net/browse/${ideaId}`;
    window.open(url, '_blank');
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
    return sortOrder === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
  };
  const handleMoneySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moneyKeyword.trim()) return;
    setMoneyLoading(true);
    try {
      const response = await fetch('http://localhost:5678/webhook/22b83529-18a6-4bf9-99f9-bab4475f1a0a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: moneyKeyword
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Money search response:', data);
      setMoneyResults(Array.isArray(data) ? data : []);
      toast({
        title: "Search Complete! 💰",
        description: `Found ${Array.isArray(data) ? data.length : 0} results for "${moneyKeyword}"`
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMoneyLoading(false);
    }
  };
  const handleMoneySort = (field: MoneySortField) => {
    if (moneySortField === field) {
      setMoneySortOrder(moneySortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setMoneySortField(field);
      setMoneySortOrder('desc');
    }
  };
  const sortedMoneyResults = [...moneyResults].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    if (moneySortField === 'score') {
      aValue = a.score;
      bValue = b.score;
    } else if (moneySortField === 'total_arr') {
      aValue = a.total_arr;
      bValue = b.total_arr;
    } else if (moneySortField === 'votes') {
      aValue = parseInt(a.votes) || 0;
      bValue = parseInt(b.votes) || 0;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return moneySortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    }
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    if (moneySortOrder === 'desc') {
      return bStr.localeCompare(aStr);
    }
    return aStr.localeCompare(bStr);
  });
  const renderMoneySortIcon = (field: MoneySortField) => {
    if (moneySortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return moneySortOrder === 'desc' ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />;
  };
  const totalARR = moneyResults.reduce((sum, result) => sum + result.total_arr, 0);
  const handleRemoveMoneyResult = (indexToRemove: number) => {
    setMoneyResults(prevResults => prevResults.filter((_, index) => index !== indexToRemove));
  };
  const getActiveFeature = () => {
    if (loading) return 'release-matcher';
    if (doppelgangerLoading) return 'idea-doppelganger';
    if (moneyLoading) return 'show-money';
    return undefined;
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            <span className="uppercase text-indigo-600">Not a Bad</span>{' '}
            <span className="inline-block transform transition-transform duration-300 hover:scale-110 hover:-rotate-2 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              IDEA
            </span>{' '}
            😏
          </h1>
          <p className="text-sm text-gray-600 italic">Your chaos, our roadmap.</p>
        </div>

        {/* Main Action Buttons */}
        {!activeCard && <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={() => setActiveCard('release-matcher')}>
              <Search className="h-5 w-5" />
              Release Matcher
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={() => setActiveCard('idea-doppelganger')}>
              <Bot className="h-5 w-5" />
              Idea Doppelgänger
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={() => setActiveCard('show-money')}>
              <DollarSign className="h-5 w-5" />
              Show Me The Money
            </Button>
          </div>}

        {/* Animated Visualization - Show when no active card or no results */}
        {(!activeCard || activeCard && results.length === 0 && doppelgangerResults.length === 0 && moneyResults.length === 0) && <IdeaFlowAnimation activeFeature={getActiveFeature()} />}

        {/* Back Button */}
        {activeCard && <div className="flex justify-center">
            <Button variant="ghost" onClick={() => setActiveCard(null)} className="mb-4">← Go Back</Button>
          </div>}

        {/* Release Matcher Card */}
        {activeCard === 'release-matcher' && <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Release matcher
              </CardTitle>
              <CardDescription className="font-thin text-xs">
                Enter release notes URL (e.g. https://ut.powerschool-docs.com/app-tracking-employer/latest/release-25-3-1-0-march-2025)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input type="url" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} required className="flex-1" disabled={loading} />
                  <Button type="submit" disabled={loading}>
                    Submit
                  </Button>
                </div>
                
                {/* Think for longer toggle */}
                <div className="flex items-center space-x-2">
                  <Switch id="think-longer" checked={thinkLonger} onCheckedChange={setThinkLonger} disabled={loading} />
                  <label htmlFor="think-longer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Think for longer
                  </label>
                </div>
              </form>
              
              {/* Loading display for main form */}
              {loading && <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border mt-4">
                  <Bot className="mr-3 h-5 w-5 animate-bounce text-blue-600" />
                  <span className="text-blue-700 animate-pulse">
                    {funnyLoadingMessages[currentLoadingMessageIndex]}
                  </span>
                </div>}
            </CardContent>
          </Card>}

        {/* Idea Doppelgänger Card */}
        {activeCard === 'idea-doppelganger' && <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Idea Doppelgänger
              </CardTitle>
              <CardDescription>
                Upload CSV file to find ideas that look suspiciously similar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" onChange={handleFileChange} className="flex-1" disabled={doppelgangerLoading} />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
                {csvFile && <p className="text-sm text-gray-600">
                    Selected: {csvFile.name}
                  </p>}
                
                <Button onClick={handleDoppelganger} disabled={!csvFile || doppelgangerLoading} className="w-full">
                  Analyze for Duplicates
                </Button>
                
                {/* Loading display for doppelganger */}
                {doppelgangerLoading && <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg border">
                    <Bot className="mr-3 h-5 w-5 animate-bounce text-purple-600" />
                    <span className="text-purple-700 animate-pulse">
                      {funnyLoadingMessages[currentDoppelgangerMessageIndex]}
                    </span>
                  </div>}
              </div>
            </CardContent>
          </Card>}

        {/* Show Me The Money Card */}
        {activeCard === 'show-money' && <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Show Me The Money
              </CardTitle>
              <CardDescription>
                Search for ideas with financial impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMoneySearch} className="space-y-4">
                <div className="flex gap-2">
                  <Input type="text" placeholder="Enter search keyword" value={moneyKeyword} onChange={e => setMoneyKeyword(e.target.value)} required className="flex-1" disabled={moneyLoading} />
                  <Button type="submit" disabled={moneyLoading}>
                    {moneyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Search
                  </Button>
                </div>
                
                {/* Loading display */}
                {moneyLoading && <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border">
                    <DollarSign className="mr-3 h-5 w-5 animate-bounce text-green-600" />
                    <span className="text-green-700 animate-pulse">
                      Searching for money-making ideas...
                    </span>
                  </div>}
              </form>
            </CardContent>
          </Card>}

        {/* Money Results Table - Only show when there are results */}
        {moneyResults.length > 0 && <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Results ({moneyResults.length})
                  </CardTitle>
                  <CardDescription>
                    Ideas with potential financial impact
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalARR.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total ARR Impact
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] bg-green-100 font-bold">ID</TableHead>
                      <TableHead className="min-w-[400px] bg-green-100 font-bold">Page Content</TableHead>
                      <TableHead className="w-[120px] bg-green-100 font-bold cursor-pointer hover:bg-green-200" onClick={() => handleMoneySort('total_arr')}>
                        <div className="flex items-center">
                          ARR
                          {renderMoneySortIcon('total_arr')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px] bg-green-100 font-bold cursor-pointer hover:bg-green-200" onClick={() => handleMoneySort('votes')}>
                        <div className="flex items-center">
                          Votes
                          {renderMoneySortIcon('votes')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px] bg-green-100 font-bold cursor-pointer hover:bg-green-200" onClick={() => handleMoneySort('score')}>
                        <div className="flex items-center">
                          Relevance
                          {renderMoneySortIcon('score')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px] bg-green-100 font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMoneyResults.map((result, index) => <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="bg-green-50">
                          <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800" onClick={() => handleIdeaClick(result.id)}>
                            {result.id}
                          </Button>
                        </TableCell>
                        <TableCell className="bg-green-50">
                          <p className="text-sm text-gray-600 whitespace-normal">
                            {result.document.pageContent}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono bg-green-100 text-green-800 border-green-200">
                            ${result.total_arr.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {result.votes}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {result.score.toFixed(3)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveMoneyResult(index)} className="text-red-600 hover:text-red-800 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>}

        {/* Doppelgänger Results Table - Only show when there are results */}
        {doppelgangerResults.length > 0 && <Card>
            <CardHeader>
              <CardTitle>
                Idea Doppelgängers Found ({doppelgangerResults.length})
              </CardTitle>
              <CardDescription>
                Similar ideas that might be duplicates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] bg-purple-100 font-bold">ID 1</TableHead>
                      <TableHead className="min-w-[300px] bg-purple-100 font-bold">Description 1</TableHead>
                      <TableHead className="w-[120px] bg-purple-100 font-bold">ID 2</TableHead>
                      <TableHead className="min-w-[300px] bg-purple-100 font-bold">Description 2</TableHead>
                      <TableHead className="w-[100px] bg-purple-100 font-bold">Similarity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doppelgangerResults.map((result, index) => <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="bg-purple-50">
                          <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800" onClick={() => handleIdeaClick(result.id_1)}>
                            {result.id_1}
                          </Button>
                        </TableCell>
                        <TableCell className="bg-purple-50">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{result.summary_1}</p>
                            <p className="text-sm text-gray-600 whitespace-normal">{result.text_1}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800" onClick={() => handleIdeaClick(result.id_2)}>
                            {result.id_2}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{result.summary_2}</p>
                            <p className="text-sm text-gray-600 whitespace-normal">{result.text_2}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono bg-yellow-100 text-yellow-800 border-yellow-200">
                            {result.similarity.toFixed(3)}
                          </Badge>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>}

        {/* Results Table - Only show when there are results */}
        {results.length > 0 && <Card>
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
                      <TableHead className="w-[100px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200" onClick={() => handleSort(thinkLonger ? 'classification' : 'score')}>
                        <div className="flex items-center">
                          {thinkLonger ? 'Classification' : 'Score'}
                          {renderSortIcon(thinkLonger ? 'classification' : 'score')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200" onClick={() => handleSort('idea')}>
                        <div className="flex items-center">
                          Idea ID
                          {renderSortIcon('idea')}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[300px] bg-blue-100 font-bold cursor-pointer hover:bg-blue-200" onClick={() => handleSort('content')}>
                        <div className="flex items-center">
                          Idea Description
                          {renderSortIcon('content')}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[300px] cursor-pointer hover:bg-gray-50" onClick={() => handleSort('releaseNote')}>
                        <div className="flex items-center">
                          Release Note
                          {renderSortIcon('releaseNote')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[200px] cursor-pointer hover:bg-gray-50" onClick={() => handleSort('summary')}>
                        <div className="flex items-center">
                          Summary
                          {renderSortIcon('summary')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[200px] cursor-pointer hover:bg-gray-50" onClick={() => handleSort('productArea')}>
                        <div className="flex items-center">
                          Product Area
                          {renderSortIcon('productArea')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResults.map(idea => <TableRow key={idea.id} className="hover:bg-gray-50">
                        <TableCell className="bg-blue-50">
                          <Badge variant="outline" className={`font-mono ${thinkLonger && idea.classification ? getClassificationColor(idea.classification) : getScoreColor(idea.score)}`}>
                            {thinkLonger && idea.classification ? idea.classification : idea.score.toFixed(3)}
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
                          <Button variant="outline" size="sm" onClick={() => handleUpdateClick(idea.idea || `IDEA-${idea.id}`)} className="text-blue-600 hover:text-blue-800">
                            Go to JIRA
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>}

        {/* Empty State */}
        {!loading && results.length === 0 && activeCard === 'release-matcher' && <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-2">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">No ideas found yet</h3>
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default Index;