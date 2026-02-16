import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  let articleId = '';
  try {
    const resolvedParams = await params;
    articleId = resolvedParams.id;

    // Fetch article data server-side
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/publication/articles/${articleId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Article not found');
    }

    const result = await response.json();
    const article = result.data;

    if (!article) throw new Error('Article data is empty');

    const title = article.title;
    const description = (article.abstract || '').substring(0, 160);
    const articleUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://journals.uniben.edu'}/articles/${article._id}`;
    const coverImage = article.volume?.coverImage || '/issue-cover.png';

    const authorName = article.author && typeof article.author === 'object'
      ? article.author.name
      : 'Unknown Author';

    return {
      title: `${title} | UNIBEN Journal of Humanities`,
      description: description,
      keywords: article.keywords || [],
      authors: [{ name: authorName }],
      openGraph: {
        title: title,
        description: description,
        url: articleUrl,
        type: 'article',
        authors: [authorName],
        publishedTime: article.publishDate,
        tags: article.keywords || [],
        images: [
          {
            url: coverImage,
            width: 800,
            height: 1200,
            alt: title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [coverImage],
      },
      alternates: {
        canonical: articleUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article Details | UNIBEN Journal of Humanities',
      description: 'Read the latest scholarly research in the humanities from the University of Benin.',
    };
  }
}

export default function Layout({ children }: Props) {
  return children;
}
