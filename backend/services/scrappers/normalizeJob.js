export const normalizeJob = (job, source) => {
  let normalized = {
    title: job.title || job.job_title || job.position || "",
    company: job.company || job.employer_name || job.company_name || "",
    location: job.location || job.job_city || job.job_country || "",
    workMode: job.remote ? "remote" : "onsite",
    employmentType: (job.type || job.job_employment_type || "full-time").toLowerCase(),
    description: job.description || job.job_description || "",
    requirements: job.requirements || job.job_highlights?.Qualifications || [],
    skills: job.skills || [],
    source: source,
    url: job.url || job.job_apply_link || job.url,
    datePosted: job.datePosted ? new Date(job.datePosted) : new Date()
  };
  return normalized;
};
