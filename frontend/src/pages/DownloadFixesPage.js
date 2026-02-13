import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Package, Globe, Loader2, CheckCircle, Download, Wand2, 
  Search, Zap, FileText, ArrowRight, Sparkles, FolderArchive
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function DownloadFixesPage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [serverType, setServerType] = useState('nginx');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [results, setResults] = useState(null);

  const runFullAnalysisAndFix = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to use this feature');
      return;
    }

    setLoading(true);
    setResults(null);
    
    const allFixes = {
      seo: [],
      speed: [],
      content: []
    };

    try {
      // Step 1: SEO Analysis & Fix
      setProgress({ step: 'Analyzing SEO...', percent: 10 });
      const seoAnalysis = await axios.post(
        `${API_URL}/api/seo/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      
      if (seoAnalysis.data.issues?.length > 0) {
        setProgress({ step: 'Generating SEO fixes...', percent: 25 });
        const seoFixes = await axios.post(`${API_URL}/api/fix/seo`, {
          url,
          issues: seoAnalysis.data.issues.map(i => i.issue || i.name || i.type),
          page_title: seoAnalysis.data.meta?.title || '',
          page_description: seoAnalysis.data.meta?.description || '',
          target_keyword: targetKeyword
        });
        allFixes.seo = seoFixes.data.fixes || [];
      }

      // Step 2: Speed Analysis & Fix
      setProgress({ step: 'Analyzing Speed...', percent: 40 });
      const speedAnalysis = await axios.post(
        `${API_URL}/api/speed/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      
      if (speedAnalysis.data.issues?.length > 0) {
        setProgress({ step: 'Generating Speed fixes...', percent: 55 });
        const speedFixes = await axios.post(`${API_URL}/api/fix/speed`, {
          url,
          issues: speedAnalysis.data.issues.map(i => i.issue || i.name || i.type),
          server_type: serverType
        });
        allFixes.speed = speedFixes.data.fixes || [];
      }

      // Step 3: Content Analysis & Fix
      setProgress({ step: 'Analyzing Content...', percent: 70 });
      const contentAnalysis = await axios.post(
        `${API_URL}/api/content/analyze`,
        { url },
        { headers: getAuthHeader() }
      );
      
      if (contentAnalysis.data.issues?.length > 0) {
        setProgress({ step: 'Generating Content fixes...', percent: 85 });
        const contentFixes = await axios.post(`${API_URL}/api/fix/content`, {
          url,
          issues: contentAnalysis.data.issues.map(i => i.issue || i.name || i.type),
          current_content: contentAnalysis.data.content_preview || '',
          target_keyword: targetKeyword,
          page_title: contentAnalysis.data.title || ''
        });
        allFixes.content = contentFixes.data.fixes || [];
      }

      setProgress({ step: 'Complete!', percent: 100 });
      
      setResults({
        seoScore: seoAnalysis.data.score,
        speedScore: speedAnalysis.data.score,
        contentScore: contentAnalysis.data.score,
        fixes: allFixes,
        totalFixes: allFixes.seo.length + allFixes.speed.length + allFixes.content.length
      });
      
      toast.success('All fixes generated successfully!');
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to complete analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsZip = async () => {
    if (!results) return;
    
    try {
      const response = await axios.post(
        `${API_URL}/api/fix/download-zip`,
        {
          url,
          seo_fixes: results.fixes.seo,
          speed_fixes: results.fixes.speed,
          content_fixes: results.fixes.content,
          server_type: serverType
        },
        {
          responseType: 'blob',
          headers: getAuthHeader()
        }
      );
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/zip' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `siterank-fixes-${url.replace(/https?:\/\//, '').replace(/\//g, '_').slice(0, 20)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('ZIP file downloaded!');
    } catch (error) {
      toast.error('Failed to download ZIP file');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="download-fixes-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/20 mb-4">
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Complete Fix Package
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Download All Fixes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Run full analysis (SEO + Speed + Content) → Generate all fixes → Download as ZIP
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="pl-10 bg-muted border-border h-12"
                data-testid="full-url-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Target keyword (optional)"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  disabled={loading}
                  className="pl-10 bg-muted border-border"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Server:</span>
                {['nginx', 'apache', 'node'].map(type => (
                  <button
                    key={type}
                    onClick={() => setServerType(type)}
                    disabled={loading}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      serverType === type 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <Button
              onClick={runFullAnalysisAndFix}
              disabled={loading || !url || !isAuthenticated}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-purple-500 gap-2"
              data-testid="run-full-analysis-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress.step}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Analyze & Generate All Fixes
                </>
              )}
            </Button>
            
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
                Please <a href="/login" className="text-emerald-400 hover:underline">login</a> to use this feature
              </p>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {loading && (
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{progress.step}</span>
                  <span className="text-foreground font-medium">{progress.percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>SEO</span>
                  <span>Speed</span>
                  <span>Content</span>
                  <span>Done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Scores Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Search className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${getScoreColor(results.seoScore)}`}>
                    {results.seoScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">SEO Score</div>
                  <div className="text-xs text-emerald-400 mt-1">
                    {results.fixes.seo.length} fixes
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${getScoreColor(results.speedScore)}`}>
                    {results.speedScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Speed Score</div>
                  <div className="text-xs text-cyan-400 mt-1">
                    {results.fixes.speed.length} fixes
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${getScoreColor(results.contentScore)}`}>
                    {results.contentScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Content Score</div>
                  <div className="text-xs text-purple-400 mt-1">
                    {results.fixes.content.length} fixes
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Download Section */}
            <Card className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border-emerald-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {results.totalFixes} Fixes Ready
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Your complete fix package is ready. Download the ZIP file containing all SEO, Speed, and Content fixes.
                </p>
                
                <Button
                  onClick={downloadAsZip}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-purple-500 gap-2 px-8"
                  data-testid="download-zip-btn"
                >
                  <Download className="w-5 h-5" />
                  Download All Fixes as ZIP
                </Button>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground">seo-fixes.html</div>
                    Meta tags, Schema markup
                  </div>
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground">speed-fixes.conf</div>
                    {serverType} configuration
                  </div>
                  <div className="text-muted-foreground">
                    <div className="font-medium text-foreground">content-fixes.html</div>
                    Improved content
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-muted-foreground" />
                  What's in the ZIP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-medium text-foreground">README.md</div>
                      <div className="text-sm text-muted-foreground">Instructions and overview</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-medium text-foreground">seo-fixes.html</div>
                      <div className="text-sm text-muted-foreground">
                        {results.fixes.seo.length} SEO improvements (meta tags, schema, titles)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-medium text-foreground">speed-fixes.{serverType === 'node' ? 'js' : 'conf'}</div>
                      <div className="text-sm text-muted-foreground">
                        {results.fixes.speed.length} performance configs for {serverType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-foreground">content-fixes.html</div>
                      <div className="text-sm text-muted-foreground">
                        {results.fixes.content.length} content improvements (FAQs, CTAs, expanded content)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-foreground">summary.json</div>
                      <div className="text-sm text-muted-foreground">Analysis summary and metadata</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
