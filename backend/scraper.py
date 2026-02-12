import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re
import time
import logging
from typing import Dict, Any, Optional, Tuple

logger = logging.getLogger(__name__)


class WebsiteScraper:
    """Scrapes website data for analysis"""
    
    def __init__(self, url: str, timeout: int = 15):
        self.url = self._normalize_url(url)
        self.timeout = timeout
        self.soup = None
        self.response = None
        self.load_time = 0
        
    def _normalize_url(self, url: str) -> str:
        """Ensure URL has proper scheme"""
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        return url.rstrip('/')
    
    def fetch(self) -> bool:
        """Fetch the webpage and measure load time"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            start_time = time.time()
            self.response = requests.get(self.url, headers=headers, timeout=self.timeout, allow_redirects=True)
            self.load_time = time.time() - start_time
            
            if self.response.status_code == 200:
                self.soup = BeautifulSoup(self.response.text, 'html.parser')
                return True
            else:
                logger.warning(f"Failed to fetch {self.url}: Status {self.response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error fetching {self.url}: {str(e)}")
            return False
    
    def get_seo_data(self) -> Dict[str, Any]:
        """Extract SEO-related data"""
        if not self.soup:
            return {}
        
        data = {
            'title': '',
            'title_length': 0,
            'meta_description': '',
            'meta_description_length': 0,
            'h1_count': 0,
            'h1_texts': [],
            'h2_count': 0,
            'meta_keywords': '',
            'canonical_url': '',
            'has_robots_meta': False,
            'og_tags': {},
            'internal_links': 0,
            'external_links': 0,
            'image_alt_ratio': 0,
            'structured_data': False
        }
        
        # Title
        title_tag = self.soup.find('title')
        if title_tag:
            data['title'] = title_tag.get_text(strip=True)
            data['title_length'] = len(data['title'])
        
        # Meta description
        meta_desc = self.soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            data['meta_description'] = meta_desc.get('content', '')
            data['meta_description_length'] = len(data['meta_description'])
        
        # Meta keywords
        meta_keywords = self.soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            data['meta_keywords'] = meta_keywords.get('content', '')
        
        # Headings
        h1_tags = self.soup.find_all('h1')
        data['h1_count'] = len(h1_tags)
        data['h1_texts'] = [h1.get_text(strip=True)[:100] for h1 in h1_tags[:3]]
        data['h2_count'] = len(self.soup.find_all('h2'))
        
        # Canonical URL
        canonical = self.soup.find('link', rel='canonical')
        if canonical:
            data['canonical_url'] = canonical.get('href', '')
        
        # Robots meta
        robots_meta = self.soup.find('meta', attrs={'name': 'robots'})
        data['has_robots_meta'] = robots_meta is not None
        
        # Open Graph tags
        og_tags = self.soup.find_all('meta', property=re.compile(r'^og:'))
        data['og_tags'] = {tag.get('property'): tag.get('content', '') for tag in og_tags}
        
        # Links analysis
        base_domain = urlparse(self.url).netloc
        all_links = self.soup.find_all('a', href=True)
        for link in all_links:
            href = link.get('href', '')
            if href.startswith(('http://', 'https://')):
                link_domain = urlparse(href).netloc
                if base_domain in link_domain:
                    data['internal_links'] += 1
                else:
                    data['external_links'] += 1
            elif href.startswith('/'):
                data['internal_links'] += 1
        
        # Image alt text ratio
        images = self.soup.find_all('img')
        if images:
            images_with_alt = sum(1 for img in images if img.get('alt', '').strip())
            data['image_alt_ratio'] = round(images_with_alt / len(images) * 100)
        
        # Structured data
        structured_data = self.soup.find_all('script', type='application/ld+json')
        data['structured_data'] = len(structured_data) > 0
        
        return data
    
    def get_speed_data(self) -> Dict[str, Any]:
        """Extract speed-related data"""
        data = {
            'load_time': round(self.load_time, 2),
            'page_size_kb': 0,
            'total_requests': 1,
            'css_files': 0,
            'js_files': 0,
            'image_count': 0,
            'has_compression': False,
            'has_caching': False
        }
        
        if self.response:
            # Page size
            data['page_size_kb'] = round(len(self.response.content) / 1024, 2)
            
            # Check compression
            data['has_compression'] = 'gzip' in self.response.headers.get('Content-Encoding', '').lower()
            
            # Check caching headers
            cache_control = self.response.headers.get('Cache-Control', '')
            data['has_caching'] = bool(cache_control and 'no-cache' not in cache_control.lower())
        
        if self.soup:
            # Count CSS files
            data['css_files'] = len(self.soup.find_all('link', rel='stylesheet'))
            
            # Count JS files
            data['js_files'] = len(self.soup.find_all('script', src=True))
            
            # Count images
            data['image_count'] = len(self.soup.find_all('img'))
        
        return data
    
    def get_content_data(self) -> Dict[str, Any]:
        """Extract content-related data"""
        if not self.soup:
            return {}
        
        data = {
            'word_count': 0,
            'paragraph_count': 0,
            'unique_words': 0,
            'avg_paragraph_length': 0,
            'has_blog': False,
            'has_faq': False,
            'content_to_code_ratio': 0,
            'reading_level': 'medium'
        }
        
        # Remove script and style elements
        for script in self.soup(['script', 'style', 'nav', 'header', 'footer']):
            script.decompose()
        
        # Get text content
        text = self.soup.get_text(separator=' ', strip=True)
        words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())
        
        data['word_count'] = len(words)
        data['unique_words'] = len(set(words))
        
        # Paragraphs
        paragraphs = self.soup.find_all('p')
        data['paragraph_count'] = len(paragraphs)
        if paragraphs:
            total_length = sum(len(p.get_text(strip=True).split()) for p in paragraphs)
            data['avg_paragraph_length'] = round(total_length / len(paragraphs))
        
        # Check for blog/articles
        blog_indicators = ['blog', 'article', 'post', 'news']
        page_text = self.response.text.lower() if self.response else ''
        data['has_blog'] = any(ind in page_text for ind in blog_indicators)
        
        # Check for FAQ
        faq_indicators = ['faq', 'frequently asked', 'questions']
        data['has_faq'] = any(ind in page_text for ind in faq_indicators)
        
        # Content to code ratio
        if self.response:
            html_length = len(self.response.text)
            text_length = len(text)
            if html_length > 0:
                data['content_to_code_ratio'] = round(text_length / html_length * 100)
        
        return data
    
    def get_ux_data(self) -> Dict[str, Any]:
        """Extract UX-related data"""
        if not self.soup:
            return {}
        
        data = {
            'has_viewport_meta': False,
            'has_favicon': False,
            'form_count': 0,
            'button_count': 0,
            'navigation_elements': 0,
            'has_search': False,
            'has_social_links': False,
            'has_contact_info': False,
            'mobile_friendly_indicators': 0,
            'accessibility_score': 0
        }
        
        # Viewport meta (mobile-friendliness)
        viewport = self.soup.find('meta', attrs={'name': 'viewport'})
        data['has_viewport_meta'] = viewport is not None
        
        # Favicon
        favicon = self.soup.find('link', rel=re.compile(r'icon', re.I))
        data['has_favicon'] = favicon is not None
        
        # Forms and buttons
        data['form_count'] = len(self.soup.find_all('form'))
        data['button_count'] = len(self.soup.find_all(['button', 'input[type="button"]', 'input[type="submit"]']))
        
        # Navigation
        data['navigation_elements'] = len(self.soup.find_all('nav'))
        
        # Search functionality
        search_inputs = self.soup.find_all('input', type='search')
        search_forms = self.soup.find_all(attrs={'class': re.compile(r'search', re.I)})
        data['has_search'] = len(search_inputs) > 0 or len(search_forms) > 0
        
        # Social links
        social_domains = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok']
        all_links = self.soup.find_all('a', href=True)
        for link in all_links:
            if any(social in link.get('href', '').lower() for social in social_domains):
                data['has_social_links'] = True
                break
        
        # Contact info
        page_text = self.soup.get_text().lower()
        contact_indicators = ['contact', 'email', 'phone', 'tel:', 'mailto:']
        data['has_contact_info'] = any(ind in page_text or ind in str(self.soup) for ind in contact_indicators)
        
        # Mobile-friendly indicators
        mobile_score = 0
        if data['has_viewport_meta']:
            mobile_score += 30
        responsive_classes = ['container', 'row', 'col-', 'flex', 'grid', 'responsive', 'mobile']
        if any(cls in str(self.soup) for cls in responsive_classes):
            mobile_score += 40
        data['mobile_friendly_indicators'] = mobile_score
        
        # Accessibility basics
        accessibility_score = 0
        # Check for alt texts
        images = self.soup.find_all('img')
        if images:
            with_alt = sum(1 for img in images if img.get('alt'))
            accessibility_score += int((with_alt / len(images)) * 30)
        
        # Check for proper heading hierarchy
        if self.soup.find('h1'):
            accessibility_score += 20
        
        # Check for labels on form inputs
        labels = self.soup.find_all('label')
        inputs = self.soup.find_all('input')
        if inputs and labels:
            accessibility_score += min(30, int((len(labels) / len(inputs)) * 30))
        
        # Check for aria attributes
        aria_elements = self.soup.find_all(attrs={'aria-label': True})
        if aria_elements:
            accessibility_score += 20
        
        data['accessibility_score'] = min(100, accessibility_score)
        
        return data
    
    def scrape_all(self) -> Tuple[bool, Dict[str, Any]]:
        """Scrape all data from the website"""
        if not self.fetch():
            return False, {
                'url': self.url,
                'error': 'Failed to fetch website',
                'seo': {},
                'speed': {},
                'content': {},
                'ux': {}
            }
        
        return True, {
            'url': self.url,
            'title': self.soup.title.get_text(strip=True) if self.soup.title else '',
            'seo': self.get_seo_data(),
            'speed': self.get_speed_data(),
            'content': self.get_content_data(),
            'ux': self.get_ux_data()
        }


def scrape_website(url: str) -> Tuple[bool, Dict[str, Any]]:
    """Convenience function to scrape a website"""
    scraper = WebsiteScraper(url)
    return scraper.scrape_all()
