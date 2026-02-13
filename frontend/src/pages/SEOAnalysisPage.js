import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Search, Globe, Loader2, AlertTriangle, CheckCircle, Copy, Check,
  Sparkles, Zap, Download, ChevronDown, ChevronUp, Wand2, Code
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function SEOAnalysisPage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fixingAll, setFixingAll] = useState(false);
  const [fixingIssue, setFixingIssue] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [fixes, setFixes] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedFixes, setExpandedFixes] = useState({});

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
    setFixes(null);

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

  const handleFixAll = async () => {
    if (!analysis?.issues?.length) return;
    
    setFixingAll(true);
    try {
      const issueNames = analysis.issues.map(i => i.issue || i.name || i.type);
      const response = await axios.post(`${API_URL}/api/fix/seo`, {
        url: url,
        issues: issueNames,
        page_title: analysis.meta?.title || '',
        page_description: analysis.meta?.description || '',
        target_keyword: targetKeyword || ''
      });
      
      setFixes(response.data.fixes);
      // Expand all fixes
      const expanded = {};
      response.data.fixes.forEach((_, i) => expanded[i] = true);
      setExpandedFixes(expanded);
      toast.success(`Generated ${response.data.fixes.length} fixes!`);
    } catch (error) {
      toast.error('Failed to generate fixes');
    } finally {
      setFixingAll(false);
    }
  };

  const handleFixSingle = async (issue, index) => {
    setFixingIssue(index);
    try {
      const response = await axios.post(`${API_URL}/api/fix/seo`, {
        url: url,
        issues: [issue.issue || issue.name || issue.type],
        page_title: analysis.meta?.title || '',
        page_description: analysis.meta?.description || '',
        target_keyword: targetKeyword || ''
      });
      
      const newFix = response.data.fixes[0];
      setFixes(prev => {
        const updated = prev ? [...prev] : [];
        updated[index] = newFix;
        return updated;
      });
      setExpandedFixes(prev => ({ ...prev, [index]: true }));
      toast.success('Fix generated!');
    } catch (error) {
      toast.error('Failed to generate fix');
    } finally {
      setFixingIssue(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAllFixes = () => {
    if (!fixes?.length) return;
    
    let content = `<!-- SITERANK AI - SEO Fixes for ${url} -->\n`;
    content += `<!-- Generated: ${new Date().toISOString()} -->\n\n`;
    
    fixes.forEach((fix, i) => {
      content += `<!-- Fix ${i + 1}: ${fix.issue} -->\n`;
      content += `<!-- ${fix.instructions} -->\n`;
      content += `${fix.fixed_code}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/html' });
    const url_blob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_blob;
    a.download = 'seo-fixes.html';
    a.click();
    URL.revokeObjectURL(url_blob);
    toast.success('Fixes downloaded!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-background" data-testid="seo-analysis-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">AI Auto-Fix Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            SEO Analysis & Auto-Fix
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detect SEO issues → Click "Fix" → Get production-ready code → Copy & paste
          </p>
        </div>

        {/* URL Input */}
        <Card className="bg-card border-border max-w-3xl mx-auto mb-8">
          <CardContent className="p-6 space-y-4">
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
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Target keyword (optional, improves AI suggestions)"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </div>
                      <div className="text-sm text-muted-foreground text-center">/ 100</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">SEO Score</h3>
                      <p className="text-muted-foreground text-sm">
                        {analysis.issues?.length || 0} issues found
                      </p>
                    </div>
                  </div>
                  
                  {analysis.issues?.length > 0 && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleFixAll}
                        disabled={fixingAll}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 gap-2"
                        data-testid="fix-all-btn"
                      >
                        {fixingAll ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating Fixes...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            Fix All Issues
                          </>
                        )}
                      </Button>
                      {fixes?.length > 0 && (
                        <Button
                          onClick={downloadAllFixes}
                          variant="outline"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download All
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Issues List with Fix Buttons */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Issues Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.issues?.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400">No SEO issues detected! Your page is well optimized.</span>
                  </div>
                ) : (
                  analysis.issues?.map((issue, index) => (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      {/* Issue Header */}
                      <div className="p-4 bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-400" />
                          <div>
                            <h4 className="font-medium text-foreground">
                              {issue.issue || issue.name || issue.type}
                            </h4>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                          {issue.priority && (
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {fixes?.[index] ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedFixes(prev => ({ ...prev, [index]: !prev[index] }))}
                              className="gap-1"
                            >
                              {expandedFixes[index] ? (
                                <>Hide Fix <ChevronUp className="w-4 h-4" /></>
                              ) : (
                                <>Show Fix <ChevronDown className="w-4 h-4" /></>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleFixSingle(issue, index)}
                              disabled={fixingIssue === index || fixingAll}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500 gap-1"
                              data-testid={`fix-btn-${index}`}
                            >
                              {fixingIssue === index ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4" />
                                  Fix This
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Fix Result */}
                      {fixes?.[index] && expandedFixes[index] && (
                        <div className="p-4 border-t border-border bg-background">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-400">Fix Generated</span>
                            </div>
                            {fixes[index].impact && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {fixes[index].impact}
                              </span>
                            )}
                          </div>
                          
                          {/* Instructions */}
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Instructions:</strong> {fixes[index].instructions}
                            {fixes[index].placement && (
                              <span className="ml-2 text-cyan-400">({fixes[index].placement})</span>
                            )}
                          </p>
                          
                          {/* Code Block */}
                          <div className="relative">
                            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
                              <code>{fixes[index].fixed_code}</code>
                            </pre>
                            <Button
                              onClick={() => copyToClipboard(fixes[index].fixed_code, `fix-${index}`)}
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 h-8 gap-1 bg-gray-800 hover:bg-gray-700"
                            >
                              {copiedId === `fix-${index}` ? (
                                <>
                                  <Check className="w-4 h-4 text-emerald-400" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy Code
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* AI Generated Fixes Summary */}
            {fixes?.length > 0 && (
              <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Fixes Ready</h3>
                      <p className="text-sm text-muted-foreground">{fixes.length} fixes generated</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400">{fixes.length}</div>
                      <div className="text-sm text-muted-foreground">Total Fixes</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {fixes.filter(f => f.effort === 'copy-paste').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Copy-Paste Ready</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">+15-30%</div>
                      <div className="text-sm text-muted-foreground">Est. CTR Improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meta Tags Info */}
            {analysis.meta && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Current Meta Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Title</div>
                    <div className="text-foreground font-mono text-sm">
                      {analysis.meta.title || <span className="text-red-400">Missing</span>}
                    </div>
                    {analysis.meta.title && (
                      <div className={`text-xs mt-1 ${analysis.meta.title.length > 60 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {analysis.meta.title.length} characters ({analysis.meta.title.length > 60 ? 'too long' : 'good'})
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-foreground font-mono text-sm">
                      {analysis.meta.description || <span className="text-red-400">Missing</span>}
                    </div>
                    {analysis.meta.description && (
                      <div className={`text-xs mt-1 ${analysis.meta.description.length > 160 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {analysis.meta.description.length} characters ({analysis.meta.description.length > 160 ? 'too long' : 'good'})
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
