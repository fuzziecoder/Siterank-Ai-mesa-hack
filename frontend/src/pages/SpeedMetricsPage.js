import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  Zap, Globe, Loader2, AlertTriangle, CheckCircle, Copy, Check,
  Clock, HardDrive, FileCode, Gauge, Server, Image, ArrowRight, 
  Sparkles, RefreshCw, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function SpeedMetricsPage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    issues: true,
    metrics: true,
    images: false,
    resources: false
  });

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to use the speed analyzer');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/speed/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      setAnalysis(response.data);
      toast.success('Speed analysis complete!');
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMetricStatus = (value, thresholds) => {
    if (value <= thresholds.good) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', status: 'Good' };
    if (value <= thresholds.fair) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', status: 'Needs Work' };
    return { color: 'text-red-400', bg: 'bg-red-500/10', status: 'Poor' };
  };

  return (
    <div className="min-h-screen bg-background" data-testid="speed-metrics-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">AI Performance Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Speed Analysis & Optimization
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze load times, detect bottlenecks, and get AI-powered optimization recommendations.
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
                  data-testid="speed-url-input"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading || !url || !isAuthenticated}
                className="h-12 px-8 rounded-full bg-cyan-600 hover:bg-cyan-500 gap-2"
                data-testid="speed-analyze-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Speed
                  </>
                )}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Please <a href="/login" className="text-cyan-400 hover:underline">login</a> to use the speed analyzer
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
                      <h2 className="text-xl font-bold text-foreground">Performance Score</h2>
                      <p className="text-muted-foreground text-sm mt-1">{analysis.url}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400">{analysis.load_time}s load time</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <HardDrive className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400">{analysis.page_size_kb}KB</span>
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

            {/* Key Metrics */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('metrics')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      <CardDescription>Core Web Vitals and key performance indicators</CardDescription>
                    </div>
                  </div>
                  {expandedSections.metrics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.metrics && analysis.metrics && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analysis.metrics.map((metric, index) => {
                      const status = getMetricStatus(metric.value, metric.thresholds);
                      return (
                        <div key={index} className={`p-4 rounded-lg ${status.bg} border border-border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">{metric.name}</span>
                            <span className={`text-xs font-medium ${status.color}`}>{status.status}</span>
                          </div>
                          <p className={`text-2xl font-bold ${status.color}`}>
                            {metric.value}{metric.unit}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Optimization Issues */}
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
                      <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
                      <CardDescription>Issues affecting performance with AI fixes</CardDescription>
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
                              issue.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                              issue.impact === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {issue.impact?.toUpperCase()} IMPACT
                            </span>
                            {issue.savings && (
                              <span className="text-xs text-emerald-400">
                                Save {issue.savings}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-foreground">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                          
                          {issue.fix && (
                            <div className="mt-3 p-3 rounded bg-cyan-500/10 border border-cyan-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-cyan-400" />
                                  <p className="text-xs text-cyan-400 font-medium">AI Recommendation:</p>
                                </div>
                                {issue.code && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(issue.code, `fix-${index}`)}
                                    className="h-7 px-2"
                                  >
                                    {copiedId === `fix-${index}` ? (
                                      <Check className="w-4 h-4 text-cyan-400" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                              <p className="text-sm text-cyan-300">{issue.fix}</p>
                              {issue.code && (
                                <pre className="mt-2 p-2 rounded bg-background text-xs text-muted-foreground overflow-x-auto">
                                  <code>{issue.code}</code>
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
                      <p>Great! No major performance issues detected.</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Image Optimization */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('images')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Image className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Image Optimization</CardTitle>
                      <CardDescription>Compress and optimize images for faster loading</CardDescription>
                    </div>
                  </div>
                  {expandedSections.images ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.images && analysis.image_analysis && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.image_analysis.total_images}</p>
                      <p className="text-xs text-muted-foreground">Total Images</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.image_analysis.total_size_kb}KB</p>
                      <p className="text-xs text-muted-foreground">Total Image Size</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-emerald-400">{analysis.image_analysis.potential_savings_kb}KB</p>
                      <p className="text-xs text-muted-foreground">Potential Savings</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-400 font-medium">Image Optimization Tips:</p>
                    </div>
                    <ul className="space-y-2">
                      {analysis.image_analysis.recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Resource Analysis */}
            <Card className="bg-card border-border">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('resources')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <FileCode className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Resource Analysis</CardTitle>
                      <CardDescription>CSS, JavaScript, and third-party resources</CardDescription>
                    </div>
                  </div>
                  {expandedSections.resources ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              {expandedSections.resources && analysis.resource_analysis && (
                <CardContent className="pt-0">
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.resource_analysis.css_files}</p>
                      <p className="text-xs text-muted-foreground">CSS Files</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.resource_analysis.js_files}</p>
                      <p className="text-xs text-muted-foreground">JS Files</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.resource_analysis.total_requests}</p>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                      <p className={`text-2xl font-bold ${analysis.resource_analysis.has_compression ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.resource_analysis.has_compression ? 'Yes' : 'No'}
                      </p>
                      <p className="text-xs text-muted-foreground">Compression</p>
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
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Measure Speed</h3>
                <p className="text-sm text-muted-foreground">Analyze load time, TTFB, and Core Web Vitals metrics.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Image className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Optimize Assets</h3>
                <p className="text-sm text-muted-foreground">Get image compression and resource optimization tips.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Improve Scores</h3>
                <p className="text-sm text-muted-foreground">AI recommendations to boost your performance score.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
