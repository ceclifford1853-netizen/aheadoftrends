import axios from 'axios';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = 'http://api.scraperapi.com';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
};

export async function fetchWithScraperAPI(url: string): Promise<string> {
  // If ScraperAPI key is configured, use it
  if (SCRAPER_API_KEY) {
    try {
      const response = await axios.get(SCRAPER_API_URL, {
        params: {
          api_key: SCRAPER_API_KEY,
          url: url,
          render: 'false',
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      throw new Error(`ScraperAPI failed: ${(error as Error).message}`);
    }
  }

  // Fallback: direct fetch with browser masquerade headers
  try {
    const response = await axios.get(url, {
      headers: BROWSER_HEADERS,
      timeout: 15000,
      maxRedirects: 5,
    });
    return response.data;
  } catch (error) {
    const msg = (error as Error).message;
    throw new Error(`Failed to reach the URL. Please verify the site is live and accessible. ${msg}`);
  }
}
