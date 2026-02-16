import type { Metadata } from 'next';
import CurrentIssueClient from './CurrentIssueClient';

interface Props {
  searchParams: Promise<{ issueId?: string; volumeId?: string }>;
}

async function getMetadataInfo(issueId?: string, _volumeId?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
  // Use the simple issue metadata endpoint for the SEO preview
  let url = `${apiUrl}/publication/current-issue`;
  
  if (issueId) {
    url = `${apiUrl}/publication/issues/${issueId}`;
  }

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const result = await response.json();
    if (!result.success) return null;

    // The current-issue endpoint returns { issue, articles }
    // The issues/:id endpoint returns just the issue object in data
    const issue = result.data.issue || result.data;
    const volume = issue?.volume;

    return {
      volumeNumber: typeof volume === 'object' ? volume.volumeNumber : '?',
      issueNumber: issue?.issueNumber || '?',
      year: issue?.publishDate ? new Date(issue.publishDate).getFullYear() : '',
      coverImage: typeof volume === 'object' ? volume.coverImage : '/issue-cover.png',
      description: issue?.description
    };
  } catch (_e) {
    return null;
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const info = await getMetadataInfo(resolvedParams.issueId, resolvedParams.volumeId);

  if (!info) {
    return { title: 'Current Issue | UNIBEN Journal of Humanities' };
  }

  const title = `Volume ${info.volumeNumber}, Issue ${info.issueNumber} (${info.year})`;
  const description = info.description || `Read the latest research in Volume ${info.volumeNumber} of UBJH.`;

  return {
    title: `${title} | UNIBEN Journal of Humanities`,
    description,
    openGraph: {
      title: `UNIBEN Journal of Humanities - ${title}`,
      description,
      images: [{ url: info.coverImage || '/issue-cover.png' }],
    }
  };
}

export default async function CurrentIssuePage({ searchParams }: Props) {
  const resolvedParams = await (searchParams || Promise.resolve({}));
  
  return (
    <CurrentIssueClient 
      issueId={resolvedParams.issueId} 
      volumeId={resolvedParams.volumeId} 
    />
  );
}
