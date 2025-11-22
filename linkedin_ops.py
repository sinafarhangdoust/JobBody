import asyncio
import random
import logging
from typing import List, Tuple
from urllib.parse import quote
import re

import httpx

from constants import (
    COUNTRY2GEOID,
    LOC2FPP,
    JOBS_EXTRACTION_PATTERN
)

# Constants
BASE_SEARCH_URL = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
# Use a real browser User-Agent to avoid immediate blocking
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# Configure logging to see what's happening
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

async def fetch_with_retries(
          client: httpx.AsyncClient,
          url: str,
          params: dict = None,
          headers: dict = None,
          retries: int = 3
) -> str | None:
    """
    Makes an HTTP GET request with random delays, headers, and retry logic.
    """
    for attempt in range(retries):
        try:
            # Random Delay (Human-like behavior)
            # Sleep between 2 and 5 seconds to respect rate limits
            delay = random.uniform(2, 5)
            logger.info(f"Sleeping for {delay:.2f}s before requesting...")
            await asyncio.sleep(delay)

            logger.info(f"Fetching URL: {url} (Attempt {attempt + 1}/{retries})")
            response = await client.get(url, params=params, headers=headers, timeout=15.0)

            if response.status_code == 429:
                logger.warning("Rate limit hit (429). Cooling down for 10 seconds...")
                await asyncio.sleep(10)
                continue

            response.raise_for_status()

            return response.text

        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e}")
            if e.response.status_code == 404:
                return None
        except httpx.RequestError as e:
            logger.error(f"Connection error: {e}")

    logger.error(f"Failed to fetch {url} after {retries} attempts.")
    return None


class LinkedinOps:

    def __init__(self):
        self.ahttp_client = httpx.AsyncClient()
        pass

    @staticmethod
    def map_loc2ids(location: str) -> Tuple[int, List[int]]:
        """
        returns geoid and fine locations of a given location
        :param location:
        :return:
        """
        logger.info(f"Mapping {location} to ids")
        return COUNTRY2GEOID[location], LOC2FPP[location]

    @staticmethod
    def process_jobs(response: str):

        results = []
        matches = re.finditer(JOBS_EXTRACTION_PATTERN, response)

        for match in matches:
            job_id = match.group(1)
            raw_url = match.group(2)
            raw_title = match.group(3)

            clean_url = raw_url.split('?')[0]
            clean_title = raw_title.strip()

            results.append({
                "job_id": job_id,
                "url": clean_url,
                "title": clean_title
            })

        return results


    async def get_jobs(
              self,
              keywords: str,
              location: str,
              start: int = 0,
              n_jobs: int = 10,
    ):
        """
        Specific wrapper for the Job Search API.
        """
        geo_id, ff_ps = self.map_loc2ids(location)
        params = {
            "keywords": quote(keywords),
            "location": location,
            "geoId": geo_id,
            "ff_p": quote(",".join([str(ff_p) for ff_p in ff_ps])),
            "start": start
        }
        jobs = []
        logger.info(f"Getting jobs {n_jobs} for location: {location} with keywords: {keywords}")
        while len(jobs) < n_jobs:
            response = await fetch_with_retries(
                client=self.ahttp_client,
                url=BASE_SEARCH_URL,
                params=params,
            )
            if response:
                jobs.extend(self.process_jobs(response))

            params["start"] += 10
        logger.info(f"Found {len(jobs)} jobs for location: {location} with keywords: {keywords}")
        return jobs[:n_jobs]


async def main():
        keywords = "Machine Learning Engineer"
        location = "Denmark"
        linkedin_ops = LinkedinOps()
        jobs = await linkedin_ops.get_jobs(
            keywords=keywords,
            location=location,
            n_jobs=20,
        )

if __name__ == "__main__":
    asyncio.run(main())


