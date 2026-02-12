import os
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


async def generate_ai_suggestions(
    user_url: str,
    user_scores: Dict[str, Any],
    competitors: List[Dict[str, Any]],
    comparison: Dict[str, Any]
) -> tuple[str, List[str]]:
    """
    Generate AI-powered improvement suggestions using OpenAI GPT-5.2
    """
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        logger.error("EMERGENT_LLM_KEY not found")
        return generate_fallback_suggestions(user_scores, comparison)
    
    # Build context for the AI
    competitor_summary = ""
    for i, comp in enumerate(competitors, 1):
        competitor_summary += f"""
Competitor {i} ({comp.get('url', 'Unknown')}):
- SEO: {comp.get('scores', {}).get('seo_score', 0)}/100
- Speed: {comp.get('scores', {}).get('speed_score', 0)}/100
- Content: {comp.get('scores', {}).get('content_score', 0)}/100
- UX: {comp.get('scores', {}).get('ux_score', 0)}/100
- Overall: {comp.get('scores', {}).get('overall_score', 0)}/100
"""

    strengths_text = ", ".join(comparison.get('strengths', [])) if comparison.get('strengths') else "None identified"
    weaknesses_text = ", ".join([w['area'] for w in comparison.get('weaknesses', [])]) if comparison.get('weaknesses') else "None identified"
    
    prompt = f"""You are an expert digital marketing and SEO consultant. Analyze the following website comparison data and provide actionable improvement suggestions.

USER'S WEBSITE: {user_url}
- SEO Score: {user_scores.get('seo_score', 0)}/100
- Speed Score: {user_scores.get('speed_score', 0)}/100
- Content Score: {user_scores.get('content_score', 0)}/100
- UX Score: {user_scores.get('ux_score', 0)}/100
- Overall Score: {user_scores.get('overall_score', 0)}/100

COMPETITOR ANALYSIS:
{competitor_summary}

COMPARISON INSIGHTS:
- User's Rank: #{comparison.get('user_rank', 1)} out of {comparison.get('total_sites', 1)}
- Strengths: {strengths_text}
- Weaknesses: {weaknesses_text}

SEO DETAILS:
- Title: {user_scores.get('seo_details', {}).get('title', 'Not found')[:60]}
- Meta Description Length: {user_scores.get('seo_details', {}).get('meta_description_length', 0)} chars
- H1 Count: {user_scores.get('seo_details', {}).get('h1_count', 0)}
- Image Alt Ratio: {user_scores.get('seo_details', {}).get('image_alt_ratio', 0)}%

SPEED DETAILS:
- Load Time: {user_scores.get('speed_details', {}).get('load_time', 0)}s
- Page Size: {user_scores.get('speed_details', {}).get('page_size_kb', 0)} KB

CONTENT DETAILS:
- Word Count: {user_scores.get('content_details', {}).get('word_count', 0)}
- Has Blog: {user_scores.get('content_details', {}).get('has_blog', False)}

UX DETAILS:
- Mobile Viewport: {user_scores.get('ux_details', {}).get('has_viewport_meta', False)}
- Has Search: {user_scores.get('ux_details', {}).get('has_search', False)}

Please provide:
1. A comprehensive analysis summary (2-3 paragraphs)
2. Top priority improvements to outrank competitors
3. Quick wins that can be implemented immediately
4. Long-term strategic recommendations

Format your response in a clear, professional manner with specific, actionable advice."""

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"analysis_{user_url[:20]}",
            system_message="You are an expert SEO and digital marketing consultant specializing in competitive analysis. Provide specific, actionable recommendations."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Generate action plan
        action_prompt = f"""Based on the analysis, create a prioritized action plan with 5-7 specific action items.
Each item should be:
- Specific and actionable
- Include expected impact (High/Medium/Low)
- Be achievable within 1-4 weeks

Current scores: SEO {user_scores.get('seo_score', 0)}, Speed {user_scores.get('speed_score', 0)}, Content {user_scores.get('content_score', 0)}, UX {user_scores.get('ux_score', 0)}
Main weaknesses: {weaknesses_text}

Format: Return ONLY a JSON array of action items like: ["Action 1 (High Impact)", "Action 2 (Medium Impact)", ...]"""
        
        action_message = UserMessage(text=action_prompt)
        action_response = await chat.send_message(action_message)
        
        # Parse action items
        action_plan = parse_action_items(action_response)
        
        return response, action_plan
        
    except Exception as e:
        logger.error(f"Error generating AI suggestions: {str(e)}")
        return generate_fallback_suggestions(user_scores, comparison)


def parse_action_items(response: str) -> List[str]:
    """Parse action items from AI response"""
    import json
    import re
    
    try:
        # Try to find JSON array in response
        json_match = re.search(r'\[.*?\]', response, re.DOTALL)
        if json_match:
            items = json.loads(json_match.group())
            if isinstance(items, list):
                return items[:7]
    except:
        pass
    
    # Fallback: try to extract numbered items
    lines = response.strip().split('\n')
    items = []
    for line in lines:
        line = line.strip()
        if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
            # Clean up the line
            cleaned = re.sub(r'^[\d\.\-\•\*]+\s*', '', line)
            if cleaned and len(cleaned) > 10:
                items.append(cleaned)
    
    return items[:7] if items else [
        "Optimize meta titles and descriptions (High Impact)",
        "Improve page load speed (High Impact)",
        "Add more quality content (Medium Impact)",
        "Enhance mobile responsiveness (Medium Impact)",
        "Build quality backlinks (High Impact)"
    ]


def generate_fallback_suggestions(user_scores: Dict[str, Any], comparison: Dict[str, Any]) -> tuple[str, List[str]]:
    """Generate fallback suggestions when AI is unavailable"""
    seo = user_scores.get('seo_score', 50)
    speed = user_scores.get('speed_score', 50)
    content = user_scores.get('content_score', 50)
    ux = user_scores.get('ux_score', 50)
    
    suggestions = f"""## Website Analysis Summary

Based on our analysis, your website scores **{user_scores.get('overall_score', 50)}/100** overall.

### Performance Breakdown:
- **SEO**: {seo}/100 - {'Strong' if seo >= 70 else 'Needs improvement' if seo >= 50 else 'Critical attention needed'}
- **Speed**: {speed}/100 - {'Excellent' if speed >= 70 else 'Moderate' if speed >= 50 else 'Slow loading times'}
- **Content**: {content}/100 - {'Rich content' if content >= 70 else 'Average' if content >= 50 else 'Content gaps identified'}
- **UX**: {ux}/100 - {'Great experience' if ux >= 70 else 'Acceptable' if ux >= 50 else 'User experience issues'}

### Key Recommendations:
"""
    
    action_plan = []
    
    if seo < 70:
        suggestions += "\n1. **Improve SEO**: Focus on meta tags, heading structure, and image alt texts."
        action_plan.append("Optimize all page titles to be 50-60 characters (High Impact)")
        action_plan.append("Add meta descriptions to all pages (High Impact)")
    
    if speed < 70:
        suggestions += "\n2. **Boost Speed**: Compress images, enable caching, and minimize code."
        action_plan.append("Compress and optimize all images (High Impact)")
        action_plan.append("Enable browser caching (Medium Impact)")
    
    if content < 70:
        suggestions += "\n3. **Enhance Content**: Add more valuable content, consider a blog section."
        action_plan.append("Create a blog with industry-relevant articles (High Impact)")
        action_plan.append("Add FAQ section to address common questions (Medium Impact)")
    
    if ux < 70:
        suggestions += "\n4. **Improve UX**: Ensure mobile-friendliness and easy navigation."
        action_plan.append("Ensure full mobile responsiveness (High Impact)")
        action_plan.append("Simplify navigation structure (Medium Impact)")
    
    if not action_plan:
        action_plan = [
            "Maintain current SEO practices (Low Priority)",
            "Monitor competitor changes monthly (Medium Impact)",
            "A/B test landing page elements (Medium Impact)",
            "Build quality backlinks (High Impact)",
            "Update content regularly (Medium Impact)"
        ]
    
    return suggestions, action_plan
