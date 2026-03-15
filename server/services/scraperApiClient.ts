import axios from 'axios';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = 'http://api.scraperapi.com';

export async function fetchWithScraperAPI(url: string) {
  try {
    const response = await axios.get(SCRAPER_API_URL, {
      params: {
        api_key: SCRAPER_API_KEY,
        url: url,
        render: 'false', // Initial pass without JS rendering to save cost
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    throw new Error(`ScraperAPI failed: ${(error as Error).message}`);
  }
}
