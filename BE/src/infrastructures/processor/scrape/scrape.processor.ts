import { ScrapeJob } from '@domains/jobs';
import { AppDataSource } from '@infrastructures/config/typeorm/database.config';
import { Job } from 'bullmq';
import puppeteer, { Browser, Page } from 'puppeteer';

var browser: Browser;

//We tried to avoid validation on the req body because we want to serve as many req as possible. here the worker has its own event loop => we can validate url here without affect the main loop.
function isValidUrl(str: string) {
  try {
    new URL(str); // Checks if the URL is structurally valid
    return true;
  } catch {
    return false;
  }
}

export default async function scraper(job: Job<ScrapeJob>): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium',
    });
  }
  const { url } = job.data;

  // validate silently
  if (!isValidUrl(url)) return;

  console.log(`Scraping URL: ${url}`);

  let page: Page;
  try {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Scrape images and videos using Puppeteer's evaluate method
    const mediaData = await page.evaluate((siteUrl) => {
      // due to unserializable function, we have to define inside here!
      function resolveUrl(mediaSrc: string, siteSrc: string): string {
        // If the URL already has a protocol (http/https), it's absolute.
        if (mediaSrc.startsWith('http://') || mediaSrc.startsWith('https://')) {
          return mediaSrc;
        }
        const baseUrl = new URL(siteSrc); // Create a URL object from the site base URL
        // If the mediaSrc starts with '/', it's a relative URL from the root of the site.
        if (mediaSrc.startsWith('/')) {
          return new URL(mediaSrc, baseUrl).href; // Combine and return the absolute URL
        }
        // Handle the case where mediaSrc does not start with http(s) or /.
        // Assume it's a relative URL based on the site's base URL path.
        return new URL(mediaSrc, `${baseUrl.origin}${baseUrl.pathname}`).href;
      }
      const images: any[] = [];
      const videos: any[] = [];

      // Scraping images
      const imgElements = Array.from(document.querySelectorAll('img'));

      imgElements.forEach((img) => {
        // to be improved
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || ''; // Use alt text as description, default to empty string
        const title = img.getAttribute('title') || alt || ''; // Use alt or title as fallback for the title
        if (src) {
          const fullUrl = resolveUrl(src, siteUrl);
          images.push({ siteUrl, url: fullUrl, type: 'IMAGE', discription: alt, title });
        }
      });

      // Scraping videos
      const videoElements = Array.from(document.querySelectorAll('video'));
      videoElements.forEach((video) => {
        // to be improved
        const title = video.getAttribute('title') || '';
        const description = title || '';
        var src: string;

        if (video.hasAttribute('src')) {
          src = video.getAttribute('src');
        } else {
          const sourceElement = Array.from(video.querySelectorAll('source')).find((source) =>
            source.hasAttribute('src'),
          );
          src = sourceElement?.getAttribute('src');
        }

        if (src) {
          const fullUrl = resolveUrl(src, siteUrl);
          videos.push({ siteUrl, url: fullUrl, type: 'VIDEO', discription: description, title });
        }
      });

      return { images, videos };
    }, url);

    // Log the results
    console.log('Scraping completed for:', url);
    console.log(`Found ${mediaData.images.length} images and ${mediaData.videos.length} videos`);
    // save to db
    const queryBuilder = AppDataSource.createQueryBuilder();
    await queryBuilder
      .insert()
      .into('media') // Table name
      .values([...mediaData.images, ...mediaData.videos])
      .execute();
    console.log('Media records inserted successfully');
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw error;
  } finally {
    if (page) {
      await page.close(); // Close the page after processing
    }
  }
}

async function cleanup() {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed successfully.');
    }
    if (browser) {
      await browser.close();
      console.log('Virtual Browser closed successfully.');
    }
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
}

process.on('SIGINT', cleanup);

