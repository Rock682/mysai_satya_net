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

      // Updated static job for RRB Group-D 2026 Notification
      const rrbGroupDJob: Job = {
        id: 'static-rrb-group-d-2026',
        jobTitle: 'RRB CEN 09/2025 Level-1 (Group D) Notification',
        description: 'Mega Recruitment: 22,195 Vacancies announced for Level-1 (Group D) posts in Indian Railways. 10th Pass or ITI candidates eligible. Apply online from Jan 31, 2026.',
        category: 'RRB',
        lastDate: '2026-03-02',
        startDate: '2026-01-31',
        salary: 'Level-1 of 7th CPC Pay Matrix',
        responsibilities: 'Track maintenance, helper, assistant, and other department specific duties.',
        syllabusLink: '',
        employmentType: 'Central Govt',
        requiredDocuments: '10th Class Marks Memo, ITI/NAC Certificate (if applicable), Community Certificate (OBC-NCL/SC/ST), ID Proof.',
        sourceSheetLink: '',
        blogContent: `
# RRB CEN 09/2025 Level-1 (Group D) Notification – Full Details

The Railway Recruitment Boards (RRBs) have released the detailed CEN 09/2025 Level-1 notification for recruitment to various Level-1 (Group D) posts in Indian Railways.

## Overview of RRB CEN 09/2025 Level-1
* **Notification Number:** CEN 09/2025 – Level-1
* **Posts:** Various Level-1 (erstwhile Group D) posts (Track Maintainer, Helper, Assistant, etc.)
* **Total Vacancies:** 22,195 (Across all Railway zones)
* **Conducting Body:** Railway Recruitment Boards (RRBs)
* **Job Category:** Central Government – Indian Railways Level-1 posts

## Important Dates
* **Start of Online Application:** 31 January 2026
* **Last Date for Online Application:** 02 March 2026
* **Application Correction Window:** 05 March 2026 to 14 March 2026
* **Exam Dates (CBT/PET):** To be notified later

## Eligibility Criteria
* **Nationality:** Must be a citizen of India (or subjects of Nepal/Bhutan as per rules).
* **Age Limit (as on 01.01.2026):** 18 to 33 years (General/UR).
* **Age Relaxation:** OBC (NCL): +3 years, SC/ST: +5 years, plus relaxations for PwBD/Ex-SM.
* **Educational Qualification:** 10th Pass (Matriculation) OR ITI OR National Apprenticeship Certificate (NAC).

## Selection Process
1. **Computer Based Test (CBT):** Objective type MCQs. Negative marking: 1/3rd.
2. **Physical Efficiency Test (PET):** Qualifying nature (Running, weight lifting).
3. **Document Verification (DV):** Verification of original certificates.
4. **Medical Examination:** Must pass the prescribed medical standard.

## Exam Pattern – CBT
* **Sections:** Mathematics, General Intelligence & Reasoning, General Science, General Awareness & Current Affairs.
* **Normalization:** Done for multiple shift exams.

## Application Fee
* **General / OBC (NCL):** ₹500 (₹400 refunded after appearing in CBT).
* **SC / ST / Female / Minorities / EBC / PwBD / Ex-SM:** ₹250 (Full ₹250 refunded after appearing in CBT).

## How to Apply Online
1. Visit the official RRB website.
2. Click on "New Registration" for CEN 09/2025.
3. Fill personal details and educational qualifications.
4. Upload Photograph, Signature, and Category certificates.
5. Pay application fee and submit.

**Note:** A candidate can apply to only one RRB under this notification.
        `
      };

      // Add static job for RRB NTPC (UG) Login
      const rrbNtpcUgJob: Job = {
        id: 'static-rrb-ntpc-ug',
        jobTitle: 'RRB NTPC (Under graduate) Results',
        description: 'Direct link to RRB NTPC (Under Graduate) login.',
        category: 'RRB',
        lastDate: '2025-12-04',
        startDate: '2025-11-22',
        salary: '',
        responsibilities: '',
        syllabusLink: '',
        employmentType: 'Click Here',
        requiredDocuments: '',
        sourceSheetLink: 'https://rrb.digialm.com/EForms/configuredHtml/2667/95125/login.html',
        blogContent: ''
      };

      const allJobs = [rrbGroupDJob, rrbNtpcUgJob, ...parsedJobs];

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