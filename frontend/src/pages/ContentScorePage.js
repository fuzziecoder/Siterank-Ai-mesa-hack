import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText, Globe, Loader2, AlertTriangle, CheckCircle, Copy, Check,
  Wand2, Download, ChevronDown, ChevronUp, BookOpen, MessageSquare, Target, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ContentScorePage() {
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
      toast.error('Please login to use the content analyzer');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setFixes(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/content/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      setAnalysis(response.data);
      toast.success('Content analysis complete!');
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
      const response = await axios.post(`${API_URL}/api/fix/content`, {
        url: url,
        issues: issueNames,
        current_content: analysis.content_preview || '',
        target_keyword: targetKeyword || '',
        page_title: analysis.title || ''
      });
      
      setFixes(response.data.fixes);
      const expanded = {};
      response.data.fixes.forEach((_, i) => expanded[i] = true);
      setExpandedFixes(expanded);
      toast.success(`Generated ${response.data.fixes.length} content improvements!`);
    } catch (error) {
      toast.error('Failed to generate fixes');
    } finally {
      setFixingAll(false);
    }
  };

  const handleFixSingle = async (issue, index) => {
    setFixingIssue(index);
    try {
      const response = await axios.post(`${API_URL}/api/fix/content`, {
        url: url,
        issues: [issue.issue || issue.name || issue.type],
        current_content: analysis.content_preview || '',
        target_keyword: targetKeyword || '',
        page_title: analysis.title || ''
      });
      
      const newFix = response.data.fixes[0];
      setFixes(prev => {
        const updated = prev ? [...prev] : [];
        updated[index] = newFix;
        return updated;
      });
      setExpandedFixes(prev => ({ ...prev, [index]: true }));
      toast.success('Content fix generated!');
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
    
    let content = `<!-- SITERANK AI - Content Fixes for ${url} -->\n`;
    content += `<!-- Target Keyword: ${targetKeyword || 'Not specified'} -->\n`;
    content += `<!-- Generated: ${new Date().toISOString()} -->\n\n`;
    
    fixes.forEach((fix, i) => {
      content += `<!-- Fix ${i + 1}: ${fix.issue} -->\n`;
      content += `<!-- ${fix.instructions} -->\n`;
      if (fix.word_count_delta) content += `<!-- Word Change: ${fix.word_count_delta} -->\n`;
      content += `\n${fix.fixed_code}\n\n`;
      content += `<!-- ==================== -->\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/html' });
    const url_blob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_blob;
    a.download = 'content-fixes.html';
    a.click();
    URL.revokeObjectURL(url_blob);
    toast.success('Content fixes downloaded!');
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
            <span className="text-sm font-medium text-purple-400">AI Content Writer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Content Score & Auto-Fix
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze content quality → Get AI-written improvements → Publish better content
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
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Target keyword (e.g., 'SEO tools', 'web development')"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
                Please <a href="/login" className="text-purple-400 hover:underline">login</a> to use the content analyzer
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {analysis.metrics?.word_count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Words</div>
                  <div className={`text-xs ${(analysis.metrics?.word_count || 0) < 300 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {(analysis.metrics?.word_count || 0) < 300 ? 'Too thin' : 'Good length'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {analysis.metrics?.readability || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Readability</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {analysis.metrics?.headings || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Headings</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Content Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Fix All Button */}
            {analysis.issues?.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {analysis.issues.length} Content Issues Found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        AI will rewrite and enhance your content
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleFixAll}
                        disabled={fixingAll}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 gap-2"
                        data-testid="fix-all-content-btn"
                      >
                        {fixingAll ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Writing Content...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            Fix All Content
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issues List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Content Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.issues?.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400">Great content! No major issues detected.</span>
                  </div>
                ) : (
                  analysis.issues?.map((issue, index) => (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      {/* Issue Header */}
                      <div className="p-4 bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-orange-400" />
                          <div>
                            <h4 className="font-medium text-foreground">
                              {issue.issue || issue.name || issue.type}
                            </h4>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
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
                                <>Hide Content <ChevronUp className="w-4 h-4" /></>
                              ) : (
                                <>Show Content <ChevronDown className="w-4 h-4" /></>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleFixSingle(issue, index)}
                              disabled={fixingIssue === index || fixingAll}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-500 gap-1"
                            >
                              {fixingIssue === index ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Writing...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-4 h-4" />
                                  Generate Content
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
                              <span className="text-sm font-medium text-emerald-400">Content Generated</span>
                              {fixes[index].word_count_delta && (
                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                  {fixes[index].word_count_delta}
                                </span>
                              )}
                            </div>
                            {fixes[index].section && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                Section: {fixes[index].section}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Instructions:</strong> {fixes[index].instructions}
                          </p>
                          
                          {/* Content Block */}
                          <div className="relative">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                                {fixes[index].fixed_code}
                              </pre>
                            </div>
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
                                  Copy
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

            {/* Blog Ideas */}
            {analysis.blog_ideas?.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI-Generated Blog Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {analysis.blog_ideas.map((idea, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-foreground">{idea}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(idea, `idea-${index}`)}
                        >
                          {copiedId === `idea-${index}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fixes Summary */}
            {fixes?.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Content Improvements Ready</h3>
                      <p className="text-sm text-muted-foreground">{fixes.length} sections improved</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{fixes.length}</div>
                      <div className="text-sm text-muted-foreground">Sections Fixed</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        +{fixes.reduce((acc, f) => {
                          const match = f.word_count_delta?.match(/\+(\d+)/);
                          return acc + (match ? parseInt(match[1]) : 0);
                        }, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Words Added</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">+25%</div>
                      <div className="text-sm text-muted-foreground">Est. Engagement</div>
                    </div>
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
