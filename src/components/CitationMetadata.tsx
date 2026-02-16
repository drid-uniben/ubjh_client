'use client';

import { useEffect } from 'react';
import { PublishedArticle } from '@/services/api';

interface CitationMetadataProps {
  article: PublishedArticle;
}

export function CitationMetadata({ article }: CitationMetadataProps) {
  useEffect(() => {
    // Remove existing citation meta tags
    document.querySelectorAll('[name^="citation_"]').forEach(el => el.remove());
    document.querySelectorAll('[name="DC."]').forEach(el => el.remove());

    // Helper to add meta tag
    const addMeta = (name: string, content: string) => {
      if (!content) return;
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    };

    // Add Google Scholar citation meta tags
    addMeta('citation_title', article.title);
    
    // Add authors
    if (article.author && typeof article.author === 'object') {
      addMeta('citation_author', article.author.name);
    }
    
    if (article.coAuthors && Array.isArray(article.coAuthors)) {
      article.coAuthors.forEach(coAuthor => {
        const name = typeof coAuthor === 'object' ? coAuthor.name : coAuthor;
        addMeta('citation_author', name);
      });
    }

    // Add publication metadata
    addMeta('citation_publication_date', new Date(article.publishDate).toISOString().split('T')[0]);
    
    if (article.volume && typeof article.volume === 'object') {
      addMeta('citation_volume', String(article.volume.volumeNumber));
    }
    
    if (article.issue && typeof article.issue === 'object') {
      addMeta('citation_issue', String(article.issue.issueNumber));
    }

    if (article.pages) {
      if (typeof article.pages === 'object') {
        addMeta('citation_firstpage', String(article.pages.start));
        addMeta('citation_lastpage', String(article.pages.end));
      }
    }

    if (article.doi) {
      addMeta('citation_doi', article.doi);
    }

    if (article.pdfFile) {
      addMeta('citation_pdf_url', article.pdfFile);
    }

    addMeta('citation_issn', '3121-763X'); // UNIBEN Journal ISSN

    // Add keywords
    if (article.keywords && Array.isArray(article.keywords)) {
      article.keywords.forEach(keyword => {
        addMeta('citation_keywords', keyword);
      });
    }

    // Add abstract
    addMeta('citation_abstract', article.abstract);

    // Dublin Core metadata
    addMeta('DC.Title', article.title);
    if (article.author && typeof article.author === 'object') {
      addMeta('DC.Creator', article.author.name);
    }
    addMeta('DC.Date', new Date(article.publishDate).toISOString().split('T')[0]);
    addMeta('DC.Description', article.abstract);
    addMeta('DC.Type', article.articleType || 'Article');
    addMeta('DC.Format', 'application/pdf');
    addMeta('DC.Language', 'en');
    addMeta('DC.Rights', article.license || 'CC BY 4.0');

    return () => {
      // Cleanup is handled by document removal above
    };
  }, [article]);

  return null;
}
