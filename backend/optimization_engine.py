import os
import logging
from typing import Dict, List, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)


async def generate_optimization_blueprint(
    user_url: str,
    user_scores: Dict[str, Any],
    competitors: List[Dict[str, Any]],
    scraped_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Generate a comprehensive AI-powered optimization blueprint
    """
    # Calculate competitor averages
    comp_avg = calculate_competitor_averages(competitors)
    
    # Identify gaps
    gaps = identify_gaps(user_scores, comp_avg)
    
    # Generate base blueprint from data
    blueprint = generate_data_driven_blueprint(user_url, user_scores, comp_avg, gaps, scraped_data)
    
    # Try to enhance with AI
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if api_key:
        try:
            enhanced = await enhance_blueprint_with_ai(user_url, user_scores, competitors, gaps, blueprint, api_key)
            if enhanced:
                return enhanced
        except Exception as e:
            logger.warning(f"AI enhancement failed, using data-driven blueprint: {str(e)}")
    
    return blueprint


def generate_data_driven_blueprint(
    user_url: str,
    user_scores: Dict[str, Any],
    comp_avg: Dict[str, float],
    gaps: Dict[str, float],
    scraped_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """Generate blueprint based purely on data analysis"""
    overall = user_scores.get('overall_score', 50)
    seo = user_scores.get('seo_score', 50)
    speed = user_scores.get('speed_score', 50)
    content = user_scores.get('content_score', 50)
    ux = user_scores.get('ux_score', 50)
    
    # Determine status
    if overall < 40:
        status = "critical"
    elif overall < 60:
        status = "needs_work"
    elif overall < 80:
        status = "good"
    else:
        status = "excellent"
    
    # Build critical fixes based on lowest scores
    critical_fixes = []
    score_categories = [
        ('seo', seo, 'SEO'),
        ('speed', speed, 'Speed'),
        ('content', content, 'Content'),
        ('ux', ux, 'UX')
    ]
    
    # Sort by score (lowest first)
    score_categories.sort(key=lambda x: x[1])
    
    fix_templates = {
        'seo': [
            {
                "title": "Optimize Meta Tags",
                "description": "Meta title and description need optimization for better search visibility",
                "fix": "Add unique, keyword-rich title (50-60 chars) and meta description (150-160 chars) with call-to-action",
                "expected_improvement": "+5-10 SEO points"
            },
            {
                "title": "Add Structured Data",
                "description": "Missing or incomplete Schema.org markup",
                "fix": "Implement JSON-LD schema for Organization, WebPage, and relevant content types",
                "expected_improvement": "+3-5 SEO points"
            },
            {
                "title": "Improve Internal Linking",
                "description": "Internal link structure needs optimization",
                "fix": "Add contextual internal links between related pages, use descriptive anchor text",
                "expected_improvement": "+3-5 SEO points"
            }
        ],
        'speed': [
            {
                "title": "Compress Images",
                "description": "Large images are slowing down page load",
                "fix": "Convert images to WebP format, resize to display dimensions, enable lazy loading",
                "expected_improvement": "+10-15 Speed points"
            },
            {
                "title": "Enable Browser Caching",
                "description": "Resources not being cached effectively",
                "fix": "Set Cache-Control headers for static assets (1 year for versioned, 1 week for others)",
                "expected_improvement": "+5-8 Speed points"
            },
            {
                "title": "Minify CSS/JS",
                "description": "Unminified resources increasing page size",
                "fix": "Minify and bundle CSS/JavaScript files, defer non-critical scripts",
                "expected_improvement": "+3-5 Speed points"
            }
        ],
        'content': [
            {
                "title": "Expand Content Depth",
                "description": "Content lacks depth compared to competitors",
                "fix": "Add 500-1000 more words covering related subtopics, FAQs, and examples",
                "expected_improvement": "+8-12 Content points"
            },
            {
                "title": "Improve Heading Structure",
                "description": "Heading hierarchy needs optimization",
                "fix": "Use one H1, organize content with H2-H3 subheadings, include keywords naturally",
                "expected_improvement": "+3-5 Content points"
            },
            {
                "title": "Add Visual Content",
                "description": "Page lacks engaging visual elements",
                "fix": "Add infographics, charts, or images to break up text and improve engagement",
                "expected_improvement": "+3-5 Content points"
            }
        ],
        'ux': [
            {
                "title": "Improve Mobile Experience",
                "description": "Mobile usability issues detected",
                "fix": "Ensure tap targets are 44px+, text is readable without zoom, no horizontal scroll",
                "expected_improvement": "+5-8 UX points"
            },
            {
                "title": "Optimize Navigation",
                "description": "Navigation structure could be clearer",
                "fix": "Simplify menu structure, add breadcrumbs, ensure important pages are 3 clicks away",
                "expected_improvement": "+3-5 UX points"
            },
            {
                "title": "Enhance CTAs",
                "description": "Calls-to-action need improvement",
                "fix": "Make CTAs prominent, use action-oriented text, ensure good contrast",
                "expected_improvement": "+3-5 UX points"
            }
        ]
    }
    
    fix_id = 1
    for category, score, name in score_categories:
        if score < 70:
            impact = "critical" if score < 40 else "high"
            effort = "low" if category in ['seo', 'content'] else "medium"
            for template in fix_templates.get(category, [])[:2]:
                critical_fixes.append({
                    "id": fix_id,
                    "title": template["title"],
                    "category": category,
                    "impact": impact,
                    "effort": effort,
                    "description": template["description"],
                    "fix": template["fix"],
                    "expected_improvement": template["expected_improvement"]
                })
                fix_id += 1
                if len(critical_fixes) >= 5:
                    break
        if len(critical_fixes) >= 5:
            break
    
    # Generate quick wins
    quick_wins = [
        {
            "id": 1,
            "title": "Add Missing Alt Tags",
            "category": "seo",
            "time_to_implement": "1-2 hours",
            "description": "Add descriptive alt text to all images for accessibility and SEO",
            "action_steps": ["Audit images without alt tags", "Write descriptive, keyword-relevant alt text", "Update HTML"],
            "expected_result": "Better image SEO and accessibility compliance"
        },
        {
            "id": 2,
            "title": "Optimize Page Title",
            "category": "seo",
            "time_to_implement": "30 minutes",
            "description": "Create a compelling, keyword-rich title under 60 characters",
            "action_steps": ["Research target keyword", "Write title with keyword near start", "Add brand name at end"],
            "expected_result": "Higher click-through rates in search results"
        },
        {
            "id": 3,
            "title": "Compress Hero Image",
            "category": "speed",
            "time_to_implement": "1 hour",
            "description": "Reduce hero/banner image size without quality loss",
            "action_steps": ["Export as WebP format", "Resize to exact display dimensions", "Add lazy loading to below-fold images"],
            "expected_result": "Faster initial page render, improved LCP"
        },
        {
            "id": 4,
            "title": "Write Meta Description",
            "category": "seo",
            "time_to_implement": "30 minutes",
            "description": "Add compelling meta description with call-to-action",
            "action_steps": ["Include target keyword naturally", "Keep under 160 characters", "Add compelling CTA"],
            "expected_result": "Better SERP appearance and CTR"
        },
        {
            "id": 5,
            "title": "Fix Broken Links",
            "category": "ux",
            "time_to_implement": "1-2 hours",
            "description": "Identify and fix any broken internal or external links",
            "action_steps": ["Run link checker tool", "Update or remove broken links", "Add 301 redirects if needed"],
            "expected_result": "Better user experience and crawlability"
        }
    ]
    
    # Calculate predicted improvements based on gaps
    seo_improvement = min(25, max(5, int(abs(gaps.get('seo_score', 0)) * 0.5)))
    speed_improvement = min(25, max(5, int(abs(gaps.get('speed_score', 0)) * 0.5)))
    content_improvement = min(20, max(5, int(abs(gaps.get('content_score', 0)) * 0.5)))
    overall_improvement = (seo_improvement + speed_improvement + content_improvement) // 3
    
    return {
        "overall_health": {
            "score": overall,
            "status": status,
            "summary": f"Your website scored {overall}/100. " + (
                "Critical issues need immediate attention." if status == "critical" else
                "Several optimization opportunities exist." if status == "needs_work" else
                "Good performance with room for improvement." if status == "good" else
                "Excellent performance! Focus on maintaining competitive edge."
            )
        },
        "critical_fixes": critical_fixes,
        "quick_wins": quick_wins,
        "seven_day_plan": [
            {"day": 1, "focus": "Technical Audit", "tasks": ["Fix meta tags", "Add alt text", "Check mobile responsiveness"], "goal": "Complete technical SEO basics"},
            {"day": 2, "focus": "Speed Optimization", "tasks": ["Compress images", "Enable caching", "Minify code"], "goal": "Reduce page load time by 30%"},
            {"day": 3, "focus": "Content Audit", "tasks": ["Analyze content gaps", "Plan improvements", "Research keywords"], "goal": "Content strategy defined"},
            {"day": 4, "focus": "On-Page SEO", "tasks": ["Optimize headings", "Add schema markup", "Improve internal links"], "goal": "On-page optimization complete"},
            {"day": 5, "focus": "UX Review", "tasks": ["Test mobile experience", "Improve navigation", "Optimize CTAs"], "goal": "Enhanced user experience"},
            {"day": 6, "focus": "Content Creation", "tasks": ["Write new content", "Update existing pages", "Add visuals"], "goal": "Content quality improved"},
            {"day": 7, "focus": "Review & Monitor", "tasks": ["Measure improvements", "Set up monitoring", "Plan next phase"], "goal": "Week 1 optimization complete"}
        ],
        "thirty_day_strategy": {
            "week1": {
                "theme": "Foundation & Quick Wins",
                "objectives": ["Fix all critical technical issues", "Implement quick wins", "Establish baseline metrics"],
                "expected_outcome": f"+{overall_improvement} overall score improvement"
            },
            "week2": {
                "theme": "Content Enhancement",
                "objectives": ["Expand thin content", "Optimize for target keywords", "Improve readability"],
                "expected_outcome": "Higher content score and engagement"
            },
            "week3": {
                "theme": "Competitive Positioning",
                "objectives": ["Analyze competitor strengths", "Differentiate content", "Build authority"],
                "expected_outcome": "Improved competitive position"
            },
            "week4": {
                "theme": "Scale & Sustain",
                "objectives": ["Document processes", "Set up ongoing monitoring", "Plan continuous improvement"],
                "expected_outcome": "Sustainable optimization framework"
            }
        },
        "competitor_insights": {
            "your_advantages": [
                "Unique brand identity and positioning",
                "Opportunity to leapfrog with optimization"
            ],
            "areas_to_improve": [
                f"SEO optimization (gap: {abs(gaps.get('seo_score', 0)):.0f} points)" if gaps.get('seo_score', 0) < 0 else "Maintain SEO advantage",
                f"Page speed (gap: {abs(gaps.get('speed_score', 0)):.0f} points)" if gaps.get('speed_score', 0) < 0 else "Maintain speed advantage",
                f"Content depth (gap: {abs(gaps.get('content_score', 0)):.0f} points)" if gaps.get('content_score', 0) < 0 else "Maintain content advantage"
            ],
            "outrank_strategy": "Focus on closing the biggest gaps while amplifying your unique strengths. Consistent optimization over 30 days can significantly improve your competitive position."
        },
        "predicted_improvements": {
            "seo_score": f"+{seo_improvement}",
            "speed_score": f"+{speed_improvement}",
            "content_score": f"+{content_improvement}",
            "overall_score": f"+{overall_improvement}",
            "estimated_traffic_increase": f"{overall_improvement * 2}-{overall_improvement * 3}%"
        }
    }
      "description": "<what's wrong>",
      "fix": "<exact fix with code/text if applicable>",
      "expected_improvement": "<specific metric improvement>"
    }}
  ],
  "quick_wins": [
    {{
      "id": 1,
      "title": "<action title>",
      "category": "<seo/speed/content/ux>",
      "time_to_implement": "<hours>",
      "description": "<brief description>",
      "action_steps": ["<step 1>", "<step 2>"],
      "expected_result": "<what will improve>"
    }}
  ],
  "seven_day_plan": [
    {{
      "day": 1,
      "focus": "<area>",
      "tasks": ["<task 1>", "<task 2>"],
      "goal": "<daily goal>"
    }}
  ],
  "thirty_day_strategy": {{
    "week1": {{
      "theme": "<focus theme>",
      "objectives": ["<obj 1>", "<obj 2>"],
      "expected_outcome": "<outcome>"
    }},
    "week2": {{
      "theme": "<focus theme>",
      "objectives": ["<obj 1>", "<obj 2>"],
      "expected_outcome": "<outcome>"
    }},
    "week3": {{
      "theme": "<focus theme>",
      "objectives": ["<obj 1>", "<obj 2>"],
      "expected_outcome": "<outcome>"
    }},
    "week4": {{
      "theme": "<focus theme>",
      "objectives": ["<obj 1>", "<obj 2>"],
      "expected_outcome": "<outcome>"
    }}
  }},
  "competitor_insights": {{
    "your_advantages": ["<advantage 1>", "<advantage 2>"],
    "areas_to_improve": ["<area 1>", "<area 2>"],
    "outrank_strategy": "<strategy to outrank competitors>"
  }},
  "predicted_improvements": {{
    "seo_score": "+<points>",
    "speed_score": "+<points>",
    "content_score": "+<points>",
    "overall_score": "+<points>",
    "estimated_traffic_increase": "<percentage>%"
  }}
}}

IMPORTANT:
- Provide 5 critical fixes ordered by impact
- Provide 5 quick wins that can be done in 24 hours
- Make the 7-day plan actionable and specific
- Base all recommendations on the actual data provided
- Include specific code snippets or text where applicable
- Return ONLY valid JSON, no markdown or explanations"""

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"optimize_{user_url}",
            system_message="You are an expert website optimization consultant. Always respond with valid JSON only."
        ).with_model("openai", "gpt-5.2")
        
        response = await chat.send_message(UserMessage(text=prompt))
        
        # Parse JSON response
        import json
        import re
        
        # Try to extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            blueprint = json.loads(json_match.group())
            return blueprint
        
        return get_fallback_blueprint(user_scores)
        
    except Exception as e:
        logger.error(f"Error generating optimization blueprint: {str(e)}")
        return get_fallback_blueprint(user_scores)


def calculate_competitor_averages(competitors: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate average scores across competitors"""
    if not competitors:
        return {}
    
    totals = {
        'seo_score': 0,
        'speed_score': 0,
        'content_score': 0,
        'ux_score': 0,
        'overall_score': 0
    }
    
    count = 0
    for comp in competitors:
        scores = comp.get('scores', {})
        if scores:
            count += 1
            for key in totals:
                totals[key] += scores.get(key, 0)
    
    if count > 0:
        return {k: round(v / count, 1) for k, v in totals.items()}
    return totals


def identify_gaps(user_scores: Dict[str, Any], comp_avg: Dict[str, float]) -> Dict[str, float]:
    """Identify score gaps between user and competitors"""
    gaps = {}
    for key in ['seo_score', 'speed_score', 'content_score', 'ux_score', 'overall_score']:
        user_val = user_scores.get(key, 0)
        comp_val = comp_avg.get(key, 0)
        gaps[key] = round(comp_val - user_val, 1)
    return gaps


def build_analysis_context(
    user_url: str,
    user_scores: Dict[str, Any],
    competitors: List[Dict[str, Any]],
    gaps: Dict[str, float],
    scraped_data: Dict[str, Any] = None
) -> str:
    """Build context string for AI analysis"""
    context = f"""
WEBSITE BEING ANALYZED: {user_url}

YOUR CURRENT SCORES:
- Overall Score: {user_scores.get('overall_score', 0)}/100
- SEO Score: {user_scores.get('seo_score', 0)}/100
- Speed Score: {user_scores.get('speed_score', 0)}/100
- Content Score: {user_scores.get('content_score', 0)}/100
- UX Score: {user_scores.get('ux_score', 0)}/100

COMPETITOR ANALYSIS:
"""
    
    for i, comp in enumerate(competitors[:5], 1):
        scores = comp.get('scores', {})
        context += f"""
Competitor {i}: {comp.get('url', 'Unknown')}
- Overall: {scores.get('overall_score', 0)}/100
- SEO: {scores.get('seo_score', 0)}/100
- Speed: {scores.get('speed_score', 0)}/100
- Content: {scores.get('content_score', 0)}/100
- UX: {scores.get('ux_score', 0)}/100
"""

    context += f"""
SCORE GAPS (negative means you're behind):
- SEO Gap: {gaps.get('seo_score', 0)} points
- Speed Gap: {gaps.get('speed_score', 0)} points
- Content Gap: {gaps.get('content_score', 0)} points
- UX Gap: {gaps.get('ux_score', 0)} points
- Overall Gap: {gaps.get('overall_score', 0)} points
"""

    if scraped_data:
        seo_data = scraped_data.get('seo', {})
        context += f"""
DETECTED ISSUES:
- Title: {seo_data.get('title', 'Missing')[:60]}
- Meta Description: {'Present' if seo_data.get('meta_description') else 'Missing'}
- H1 Count: {seo_data.get('h1_count', 0)}
- Total Headings: {seo_data.get('heading_count', 0)}
- Images without Alt: {seo_data.get('images_without_alt', 0)}
- Internal Links: {seo_data.get('internal_links', 0)}
- External Links: {seo_data.get('external_links', 0)}
- Page Size: {scraped_data.get('speed', {}).get('page_size_kb', 0)}KB
- Load Time: {scraped_data.get('speed', {}).get('load_time', 0)}s
- Word Count: {scraped_data.get('content', {}).get('word_count', 0)}
"""

    return context


def get_fallback_blueprint(user_scores: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a basic blueprint when AI fails"""
    overall = user_scores.get('overall_score', 50)
    
    status = "critical" if overall < 40 else "needs_work" if overall < 60 else "good" if overall < 80 else "excellent"
    
    return {
        "overall_health": {
            "score": overall,
            "status": status,
            "summary": f"Your website scored {overall}/100. There are optimization opportunities to improve your competitive position."
        },
        "critical_fixes": [
            {
                "id": 1,
                "title": "Optimize Meta Tags",
                "category": "seo",
                "impact": "high",
                "effort": "low",
                "description": "Meta tags need optimization for better search visibility",
                "fix": "Add unique, keyword-rich title (50-60 chars) and meta description (150-160 chars)",
                "expected_improvement": "+5-10 SEO points"
            },
            {
                "id": 2,
                "title": "Improve Page Speed",
                "category": "speed",
                "impact": "high",
                "effort": "medium",
                "description": "Page load time affects user experience and rankings",
                "fix": "Compress images, enable caching, minify CSS/JS",
                "expected_improvement": "+10-15 Speed points"
            },
            {
                "id": 3,
                "title": "Enhance Content Quality",
                "category": "content",
                "impact": "high",
                "effort": "high",
                "description": "Content needs to be more comprehensive",
                "fix": "Add more detailed content with relevant keywords",
                "expected_improvement": "+5-10 Content points"
            },
            {
                "id": 4,
                "title": "Add Structured Data",
                "category": "seo",
                "impact": "medium",
                "effort": "low",
                "description": "Structured data helps search engines understand your content",
                "fix": "Implement JSON-LD schema markup",
                "expected_improvement": "+3-5 SEO points"
            },
            {
                "id": 5,
                "title": "Improve Mobile Experience",
                "category": "ux",
                "impact": "high",
                "effort": "medium",
                "description": "Mobile optimization is crucial for rankings",
                "fix": "Ensure responsive design and touch-friendly elements",
                "expected_improvement": "+5-8 UX points"
            }
        ],
        "quick_wins": [
            {
                "id": 1,
                "title": "Add Missing Alt Tags",
                "category": "seo",
                "time_to_implement": "1-2 hours",
                "description": "Add descriptive alt text to all images",
                "action_steps": ["Identify images without alt tags", "Write descriptive alt text", "Update HTML"],
                "expected_result": "Better image SEO and accessibility"
            },
            {
                "id": 2,
                "title": "Optimize Title Tags",
                "category": "seo",
                "time_to_implement": "30 minutes",
                "description": "Create compelling, keyword-rich titles",
                "action_steps": ["Research target keywords", "Write unique titles under 60 chars", "Include brand name"],
                "expected_result": "Higher click-through rates"
            },
            {
                "id": 3,
                "title": "Compress Images",
                "category": "speed",
                "time_to_implement": "1-2 hours",
                "description": "Reduce image file sizes without quality loss",
                "action_steps": ["Use WebP format", "Resize to display dimensions", "Use compression tools"],
                "expected_result": "Faster page loads"
            },
            {
                "id": 4,
                "title": "Add Meta Descriptions",
                "category": "seo",
                "time_to_implement": "1 hour",
                "description": "Write compelling meta descriptions for all pages",
                "action_steps": ["List pages without descriptions", "Write 150-160 char descriptions", "Include call-to-action"],
                "expected_result": "Better SERP appearance"
            },
            {
                "id": 5,
                "title": "Fix Broken Links",
                "category": "ux",
                "time_to_implement": "1-2 hours",
                "description": "Find and fix any broken internal or external links",
                "action_steps": ["Run link checker", "Update or remove broken links", "Add redirects if needed"],
                "expected_result": "Better user experience and crawlability"
            }
        ],
        "seven_day_plan": [
            {"day": 1, "focus": "SEO Audit", "tasks": ["Fix meta tags", "Add alt text", "Check headings"], "goal": "Complete on-page SEO basics"},
            {"day": 2, "focus": "Speed Optimization", "tasks": ["Compress images", "Enable caching", "Minify code"], "goal": "Reduce load time by 30%"},
            {"day": 3, "focus": "Content Review", "tasks": ["Audit content quality", "Identify gaps", "Plan improvements"], "goal": "Content strategy defined"},
            {"day": 4, "focus": "Technical SEO", "tasks": ["Add schema markup", "Fix crawl errors", "Update sitemap"], "goal": "Technical foundation solid"},
            {"day": 5, "focus": "UX Improvements", "tasks": ["Mobile testing", "Navigation review", "CTA optimization"], "goal": "Better user experience"},
            {"day": 6, "focus": "Content Creation", "tasks": ["Write new content", "Optimize existing pages", "Add internal links"], "goal": "Content enhanced"},
            {"day": 7, "focus": "Review & Plan", "tasks": ["Measure improvements", "Document changes", "Plan next steps"], "goal": "Week 1 complete"}
        ],
        "thirty_day_strategy": {
            "week1": {
                "theme": "Foundation & Quick Wins",
                "objectives": ["Complete technical SEO audit", "Fix all critical issues", "Optimize page speed"],
                "expected_outcome": "+10-15 overall score improvement"
            },
            "week2": {
                "theme": "Content Enhancement",
                "objectives": ["Improve existing content", "Add new valuable content", "Optimize for target keywords"],
                "expected_outcome": "Better content score and engagement"
            },
            "week3": {
                "theme": "Competitor Analysis",
                "objectives": ["Deep dive into competitor strategies", "Identify differentiation opportunities", "Implement competitive advantages"],
                "expected_outcome": "Competitive positioning improved"
            },
            "week4": {
                "theme": "Scale & Monitor",
                "objectives": ["Scale successful optimizations", "Set up monitoring", "Plan ongoing strategy"],
                "expected_outcome": "Sustainable growth framework"
            }
        },
        "competitor_insights": {
            "your_advantages": ["Unique value proposition", "Brand recognition"],
            "areas_to_improve": ["Content depth", "Page speed", "SEO optimization"],
            "outrank_strategy": "Focus on creating more comprehensive content and improving technical performance to close the gap with competitors."
        },
        "predicted_improvements": {
            "seo_score": "+15",
            "speed_score": "+20",
            "content_score": "+10",
            "overall_score": "+15",
            "estimated_traffic_increase": "25-40%"
        }
    }
