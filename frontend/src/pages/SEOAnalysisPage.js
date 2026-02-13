import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  Search, Globe, Loader2, AlertTriangle, CheckCircle, Copy, Check,
  Tag, FileText, Link2, Image, Code, ArrowRight, Sparkles, RefreshCw,
  ChevronDown, ChevronUp, Zap, Target
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function SEOAnalysisPage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    issues: true,
    meta: true,
    schema: false,
    links: false
  });

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to use the SEO analyzer');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/seo/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      setAnalysis(response.data);
      toast.success('SEO analysis complete!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to analyze website';
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="seo-analysis-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">AI SEO Fix Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            SEO Analysis & Auto-Fix
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detect SEO issues, get AI-generated fixes, and copy optimized code snippets instantly.
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
                  data-testid="seo-url-input"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading || !url || !isAuthenticated}
                className="h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 gap-2"
                data-testid="seo-analyze-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze SEO
                  </>
                )}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Please <a href="/login" className="text-emerald-400 hover:underline">login</a> to use the SEO analyzer
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
                      <h2 className="text-xl font-bold text-foreground">SEO Score</h2>
                      <p className="text-muted-foreground text-sm mt-1">{analysis.url}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">{analysis.issues_count} issues</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">{analysis.passed_count} passed</span>
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

            {/* Issues & Fixes */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('issues')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Issues & AI Fixes</CardTitle>
                      <CardDescription>Detected problems with one-click solutions</CardDescription>
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
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
                              {issue.priority?.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">{issue.category}</span>
                          </div>
                          <h4 className="font-semibold text-foreground">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                          
                          {issue.current_value && (
                            <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                              <p className="text-xs text-red-400 mb-1">Current:</p>
                              <code className="text-xs text-red-300 break-all">{issue.current_value}</code>
                            </div>
                          )}
                          
                          {issue.fix && (
                            <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-emerald-400" />
                                  <p className="text-xs text-emerald-400 font-medium">AI-Generated Fix:</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(issue.fix_code || issue.fix, `fix-${index}`)}
                                  className="h-7 px-2"
                                >
                                  {copiedId === `fix-${index}` ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              <p className="text-sm text-emerald-300">{issue.fix}</p>
                              {issue.fix_code && (
                                <pre className="mt-2 p-2 rounded bg-background text-xs text-muted-foreground overflow-x-auto">
                                  <code>{issue.fix_code}</code>
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!analysis.issues || analysis.issues.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                      <p>No critical SEO issues found!</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Meta Tags Analysis */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('meta')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Meta Tags</CardTitle>
                      <CardDescription>Title, description, and Open Graph analysis</CardDescription>
                    </div>
                  </div>
                  {expandedSections.meta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.meta && analysis.meta_analysis && (
                <CardContent className="pt-0 space-y-4">
                  {/* Title */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">Page Title</h4>
                      <span className={`text-sm ${analysis.meta_analysis.title?.length > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.meta_analysis.title?.length || 0} / 60 chars
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border border-border">
                      {analysis.meta_analysis.title || 'No title found'}
                    </p>
                    {analysis.meta_analysis.suggested_title && (
                      <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <p className="text-xs text-emerald-400 font-medium">AI-Optimized Title:</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysis.meta_analysis.suggested_title, 'title')}
                            className="h-7 px-2"
                          >
                            {copiedId === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-emerald-300">{analysis.meta_analysis.suggested_title}</p>
                      </div>
                    )}
                  </div>

                  {/* Meta Description */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">Meta Description</h4>
                      <span className={`text-sm ${analysis.meta_analysis.description?.length > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.meta_analysis.description?.length || 0} / 160 chars
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border border-border">
                      {analysis.meta_analysis.description || 'No meta description found'}
                    </p>
                    {analysis.meta_analysis.suggested_description && (
                      <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <p className="text-xs text-emerald-400 font-medium">AI-Optimized Description:</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysis.meta_analysis.suggested_description, 'desc')}
                            className="h-7 px-2"
                          >
                            {copiedId === 'desc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-emerald-300">{analysis.meta_analysis.suggested_description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Schema Generator */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('schema')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Code className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Schema Markup Generator</CardTitle>
                      <CardDescription>AI-generated structured data for rich snippets</CardDescription>
                    </div>
                  </div>
                  {expandedSections.schema ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.schema && analysis.schema_suggestions && (
                <CardContent className="pt-0">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <p className="text-sm text-purple-400 font-medium">Generated Schema.org JSON-LD:</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(analysis.schema_suggestions, 'schema')}
                        className="h-7 px-2"
                      >
                        {copiedId === 'schema' ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <pre className="p-3 rounded bg-background text-xs text-muted-foreground overflow-x-auto">
                      <code>{analysis.schema_suggestions}</code>
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Internal Linking */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('links')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Link Analysis</CardTitle>
                      <CardDescription>Internal and external link structure</CardDescription>
                    </div>
                  </div>
                  {expandedSections.links ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.links && analysis.link_analysis && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.link_analysis.internal_links}</p>
                      <p className="text-xs text-muted-foreground">Internal Links</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.link_analysis.external_links}</p>
                      <p className="text-xs text-muted-foreground">External Links</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.link_analysis.images_without_alt}</p>
                      <p className="text-xs text-muted-foreground">Images Missing Alt</p>
                    </div>
                  </div>
                  {analysis.link_analysis.suggestions && (
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <p className="text-sm text-orange-400 font-medium">Link Optimization Tips:</p>
                      </div>
                      <ul className="space-y-2">
                        {analysis.link_analysis.suggestions.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ArrowRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Detect Issues</h3>
                <p className="text-sm text-muted-foreground">Automatically scan for SEO problems including meta tags, headings, and structured data.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI-Generate Fixes</h3>
                <p className="text-sm text-muted-foreground">Get optimized titles, descriptions, and schema markup generated by AI.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">One-Click Copy</h3>
                <p className="text-sm text-muted-foreground">Copy optimized code snippets and immediately improve your site.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
