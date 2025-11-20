import { useState, useCallback, useEffect } from 'react';
import { Job } from '../types';
import { csvToJson } from '../utils/csv';

interface Cache<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let jobsCache: Cache<Job[]> | null = null;

export const useJobs = (enabled: boolean) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchJobs = useCallback(async (forceRefetch = false) => {
    if (!forceRefetch && jobsCache && Date.now() - jobsCache.timestamp < CACHE_DURATION) {
      setJobs(jobsCache.data);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    if (!forceRefetch && jobsCache) {
      // Keep stale data while refetching in the background
      setJobs(jobsCache.data);
    } else {
      setJobs([]);
    }

    const sheetUrl = "https://docs.google.com/spreadsheets/d/1rovDxCJ58N9bGdbHlrXP-l1uxdRR4F1GxO19QsWm-vs/export?format=csv";

    try {
      const response = await fetch(sheetUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data. Status: ${response.statusText}. Ensure the URL is correct and the sheet is public.`);
      }
      let csvText = await response.text();
      if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.substring(1);
      }
      const json = csvToJson(csvText);

      if (json.length === 0) {
        setJobs([]);
        jobsCache = { data: [], timestamp: Date.now() };
        setIsLoading(false);
        return;
      }

      const actualHeaders = Object.keys(json[0]).map(h => h.toLowerCase().trim());
      const requiredHeaders = ['job title', 'description', 'last date', 'start date', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Data Format Error: The spreadsheet is missing the following required columns: ${missingHeaders.join(', ')}. Please correct the sheet format.`);
      }

      const parsedJobs: Job[] = json.map((row: any, index: number) => ({
        id: row['id'] || `job-${index}`,
        jobTitle: row['job title'] || 'No Title',
        description: row['description'] || 'No Description',
        category: row['category'] || 'Other',
        lastDate: row['last date'],
        startDate: row['start date'],
        salary: row['salary'],
        responsibilities: row['responsibilities'],
        syllabusLink: row['syllabuslink'],
        employmentType: row['employment type'] || row['job type'],
        requiredDocuments: row['required documents'],
        sourceSheetLink: row['link'],
        blogContent: row['blog content'],
      }));

      // Add static job for RRB Group-D Login
      const rrbGroupDJob: Job = {
        id: 'static-rrb-group-d',
        jobTitle: 'RRB Group - D City Intimation',
        description: 'Direct link to RRB Group-D candidate login for city intimation, score card, and shortlist.',
        category: 'RRB',
        lastDate: null,
        startDate: new Date(), // Use current date to keep it fresh/top
        salary: '',
        responsibilities: '',
        syllabusLink: '',
        employmentType: 'Click Here',
        requiredDocuments: '',
        sourceSheetLink: 'https://rrb.digialm.com//EForms/configuredHtml/33015/96410/login.html',
        blogContent: ''
      };

      const allJobs = [rrbGroupDJob, ...parsedJobs];

      setJobs(allJobs);
      jobsCache = { data: allJobs, timestamp: Date.now() };
    } catch (err) {
      console.error("Error fetching or parsing jobs:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching jobs.";
      if (errorMessage.toLowerCase().includes('failed to fetch')) {
        setError('Network Error: Could not connect to the data source. Please check your internet connection and try again. If the problem persists, the data sheet may be private or unavailable.');
      } else {
        setError(errorMessage);
      }
      jobsCache = null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchJobs();
    }
  }, [enabled, fetchJobs]);

  const refetch = useCallback(() => {
    if (enabled) {
      return fetchJobs(true);
    }
    return Promise.resolve();
  }, [enabled, fetchJobs]);

  return { jobs, error, isLoading, refetch, setError };
};