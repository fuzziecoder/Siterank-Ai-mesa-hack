import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  BarChart3, Search, Zap, Target, TrendingUp, 
  CheckCircle2, ArrowRight, Globe, Shield, Clock
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Deep Website Analysis',
    description: 'Comprehensive scraping of SEO, speed, content, and UX metrics from any website.'
  },
  {
    icon: Target,
    title: 'Competitor Comparison',
    description: 'Side-by-side comparison with up to 5 competitors to identify gaps and opportunities.'
  },
  {
    icon: Zap,
    title: 'AI-Powered Insights',
    description: 'GPT-5.2 powered analysis generates actionable recommendations tailored to your needs.'
  },
  {
    icon: TrendingUp,
    title: 'Action Plans',
    description: 'Prioritized action items to help you outrank competitors systematically.'
  }
];

const metrics = [
  { label: 'SEO Score', description: 'Meta tags, headings, structured data' },
  { label: 'Speed Score', description: 'Load time, page size, optimization' },
  { label: 'Content Score', description: 'Word count, readability, depth' },
  { label: 'UX Score', description: 'Mobile-friendliness, accessibility' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1768330187404-59e46cf222c9?crop=entropy&cs=srgb&fm=jpg&q=85")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  <Zap className="w-4 h-4" />
                  AI-Powered Analysis
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                  Outrank Your
                  <span className="text-primary block">Competitors</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Analyze your website against competitors with AI-powered insights. 
                  Get actionable recommendations to improve SEO, speed, content, and user experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="rounded-full gap-2 text-base px-8" data-testid="hero-cta">
                    Start Free Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="rounded-full text-base px-8" data-testid="hero-login">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Results in Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Any Website</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5 hidden lg:block">
              <Card className="bg-card/80 backdrop-blur border shadow-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Website Score</span>
                    <span className="text-3xl font-bold text-primary">78</span>
                  </div>
                  <div className="space-y-3">
                    {metrics.map((metric, i) => (
                      <div key={metric.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{metric.label}</span>
                          <span className="text-muted-foreground">{70 + i * 5}/100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${70 + i * 5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis tools powered by AI to help you understand 
              and outperform your competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="bg-card hover:shadow-lg transition-shadow duration-300 border"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to get actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter URLs', desc: 'Add your website and competitor URLs' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI scrapes and analyzes all metrics' },
              { step: '03', title: 'Get Results', desc: 'Receive detailed comparison and action plan' }
            ].map((item, index) => (
              <div key={item.step} className="text-center space-y-4" data-testid={`step-${index + 1}`}>
                <div className="text-5xl font-extrabold text-primary/20">{item.step}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Outrank Your Competition?
          </h2>
          <p className="text-lg text-muted-foreground">
            Start analyzing your website today and get AI-powered recommendations 
            to improve your online presence.
          </p>
          <Link to="/register">
            <Button size="lg" className="rounded-full gap-2 text-base px-8" data-testid="cta-bottom">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">SiteScan Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SiteScan Pro. AI-powered website competitor analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
