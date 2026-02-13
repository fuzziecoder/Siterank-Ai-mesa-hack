import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  FileText, Globe, Loader2, AlertTriangle, CheckCircle, Copy, Check,
  BookOpen, AlignLeft, List, MessageSquare, Eye, ArrowRight, 
  Sparkles, RefreshCw, ChevronDown, ChevronUp, Lightbulb, PenLine
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ContentScorePage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    issues: true,
    metrics: true,
    ideas: false,
    keywords: false
  });

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to use the content analyzer');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/content/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      setAnalysis(response.data);
      toast.success('Content analysis complete!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to analyze content';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="content-score-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">AI Content Enhancement Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Content Analysis & Improvement
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze content quality, detect weaknesses, and get AI-powered rewrite suggestions.
          </p>
        </div>

        {/* URL Input */}
        <Card className="bg-card border-border max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="pl-10 bg-muted border-border h-12"
                  data-testid="content-url-input"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading || !url || !isAuthenticated}
                className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-500 gap-2"
                data-testid="content-analyze-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Analyze Content
                  </>
                )}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Please <a href="/login" className="text-purple-400 hover:underline">login</a> to use the content analyzer
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Score Overview */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-2xl bg-muted flex items-center justify-center`}>
                      <span className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Content Score</h2>
                      <p className="text-muted-foreground text-sm mt-1">{analysis.url}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <AlignLeft className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400">{analysis.word_count} words</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400">{analysis.reading_time} min read</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => { setAnalysis(null); setUrl(''); }}
                    className="border-border gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Metrics */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('metrics')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Content Metrics</CardTitle>
                      <CardDescription>Word count, readability, and structure analysis</CardDescription>
                    </div>
                  </div>
                  {expandedSections.metrics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.metrics && analysis.metrics && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analysis.metrics.map((metric, index) => (
                      <div key={index} className={`p-4 rounded-lg ${metric.status === 'good' ? 'bg-emerald-500/10' : metric.status === 'fair' ? 'bg-yellow-500/10' : 'bg-red-500/10'} border border-border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">{metric.name}</span>
                          <span className={`text-xs font-medium ${metric.status === 'good' ? 'text-emerald-400' : metric.status === 'fair' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {metric.status === 'good' ? 'Good' : metric.status === 'fair' ? 'Fair' : 'Needs Work'}
                          </span>
                        </div>
                        <p className={`text-2xl font-bold ${metric.status === 'good' ? 'text-emerald-400' : metric.status === 'fair' ? 'text-yellow-400' : 'text-red-400'}`}>
                          {metric.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Content Issues */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('issues')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Content Issues & AI Fixes</CardTitle>
                      <CardDescription>Weaknesses with AI-powered improvement suggestions</CardDescription>
                    </div>
                  </div>
                  {expandedSections.issues ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.issues && (
                <CardContent className="pt-0 space-y-4">
                  {analysis.issues?.map((issue, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              issue.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                              issue.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {issue.severity?.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="font-semibold text-foreground">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                          
                          {issue.suggestion && (
                            <div className="mt-3 p-3 rounded bg-purple-500/10 border border-purple-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <PenLine className="w-4 h-4 text-purple-400" />
                                  <p className="text-xs text-purple-400 font-medium">AI Suggestion:</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(issue.suggestion, `fix-${index}`)}
                                  className="h-7 px-2"
                                >
                                  {copiedId === `fix-${index}` ? (
                                    <Check className="w-4 h-4 text-purple-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              <p className="text-sm text-purple-300">{issue.suggestion}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!analysis.issues || analysis.issues.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                      <p>Great! Your content looks well-optimized.</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Blog Ideas */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('ideas')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Content Ideas</CardTitle>
                      <CardDescription>AI-generated blog and content suggestions</CardDescription>
                    </div>
                  </div>
                  {expandedSections.ideas ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.ideas && analysis.content_ideas && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {analysis.content_ideas.map((idea, index) => (
                      <div key={index} className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs text-cyan-400 font-medium">Blog Idea #{index + 1}</span>
                            </div>
                            <h4 className="font-semibold text-foreground">{idea.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                            {idea.keywords && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {idea.keywords.map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-background border border-border text-muted-foreground">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(idea.title, `idea-${index}`)}
                            className="h-7 px-2"
                          >
                            {copiedId === `idea-${index}` ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Keyword Analysis */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('keywords')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <List className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Keyword Analysis</CardTitle>
                      <CardDescription>Top keywords and semantic suggestions</CardDescription>
                    </div>
                  </div>
                  {expandedSections.keywords ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.keywords && analysis.keyword_analysis && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-semibold text-foreground mb-3">Detected Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyword_analysis.detected?.map((kw, i) => (
                          <span key={i} className="px-2 py-1 rounded text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-semibold text-foreground mb-3">Suggested Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyword_analysis.suggested?.map((kw, i) => (
                          <span key={i} className="px-2 py-1 rounded text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20 cursor-pointer hover:bg-purple-500/20"
                            onClick={() => copyToClipboard(kw, `kw-${i}`)}>
                            {kw} {copiedId === `kw-${i}` && <Check className="w-3 h-3 inline ml-1" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {/* Features when no analysis */}
        {!analysis && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Analyze Quality</h3>
                <p className="text-sm text-muted-foreground">Check word count, readability, and content structure.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <PenLine className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Get Rewrites</h3>
                <p className="text-sm text-muted-foreground">AI-powered suggestions to improve weak sections.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">New Ideas</h3>
                <p className="text-sm text-muted-foreground">Generate blog ideas to outrank competitors.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
