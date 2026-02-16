# Backend Search Endpoint Analysis

## Endpoint Location
- **File:** `UBJH_server/src/Publication/routes/publication.routes.ts` (line ~320)
- **Controller:** `UBJH_server/src/Publication/controllers/publication.controller.ts` (lines ~449-510)

## Endpoint Details

### Route Definition
```typescript
router.get(
  '/articles/search',
  publicRateLimiter,
  publicationController.searchArticles
);
```

### Handler Method
**Location:** [publication.controller.ts](file:///c:/Users/PC/Documents/UBJH_server/src/Publication/controllers/publication.controller.ts#L449-L510)

```typescript
searchArticles = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { query, limit = 10 } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
        data: [],
      });
      return;
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    const articles = await Article.find({
      isPublished: true,
      $or: [
        { title: searchRegex },
        { abstract: searchRegex },
        { keywords: searchRegex },
        { doi: searchRegex },
      ],
    })
      .populate('author', 'name email affiliation')
      .populate('coAuthors', 'name email affiliation')
      .populate('volume', 'volumeNumber year')
      .populate('issue', 'issueNumber')
      .limit(parseInt(limit as string, 10))
      .select(
        '_id title abstract doi volume issue author coAuthors articleType publishDate'
      )
      .sort({ publishDate: -1 })
      .lean();

    logger.info(
      `Article search performed: "${query}" - ${articles.length} results`
    );

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  }
);
```

## Request Parameters

| Parameter | Type | Required | Default | Rules |
|-----------|------|----------|---------|-------|
| `query` | string | Yes | - | Minimum 2 characters |
| `limit` | number | No | 10 | Parsed as integer |

## Response Fields for Each Article

The API returns an array of article objects with the following structure:

```typescript
{
  _id: ObjectId,                    // MongoDB ID
  title: string,                    // Article title
  abstract: string,                 // Article abstract
  doi: string | null,               // Digital Object Identifier
  volume: {
    volumeNumber: number,           // Volume number
    year: number                    // Publication year
  },
  issue: {
    issueNumber: number             // Issue number
  },
  author: {
    name: string,                   // Author name
    email: string,                  // Author email
    affiliation: string             // Author affiliation
  },
  coAuthors: [
    {
      name: string,                 // Co-author name
      email: string,                // Co-author email
      affiliation: string           // Co-author affiliation
    }
  ],
  articleType: string,              // One of the ArticleType enum values
  publishDate: Date                 // Publication date
}
```

## Search Behavior

- **Case-insensitive** search using regex
- **Searches across:** title, abstract, keywords, and DOI
- **Only returns:** published articles (`isPublished: true`)
- **Sorting:** Results sorted by `publishDate` in descending order (newest first)
- **Population:** Includes author and co-author details, volume and issue information

## Frontend vs Backend Mismatch

### Current Frontend Data Structure (Mock)
```typescript
interface Article {
  id: string;
  title: string;
  authors: string[];              // ❌ Should be author + coAuthors
  articleType: string;            // ✓ Correct
  issue: string;                  // ❌ Should be object with issueNumber
}
```

### Actual Backend Response Structure
```typescript
{
  _id: ObjectId;                  // ❌ Frontend uses 'id'
  title: string;                  // ✓ Correct
  author: { name, email, affiliation };  // ❌ Frontend uses 'authors' string array
  coAuthors: [{ name, email, affiliation }];
  articleType: string;            // ✓ Correct
  issue: { issueNumber };         // ❌ Frontend expects formatted string
  abstract: string;               // ✓ Additional field available
  doi: string;                    // ✓ Additional field available
  volume: { volumeNumber, year }; // ✓ Additional field available
  publishDate: Date;              // ✓ Additional field available
}
```

## Required Frontend Updates

The frontend search page [src/app/(public)/search/page.tsx](file:///c:/Users/PC/Documents/UBJH_client/src/app/(public)/search/page.tsx) needs the following changes:

1. **ID Field**: Change `id` to `_id` when mapping API response
2. **Authors Field**: Replace `authors: string[]` with proper author objects:
   - Extract author name from `author.name`
   - Also include `coAuthors` array
3. **Issue Field**: Change from string format to object with `issueNumber`, and format display as needed
4. **Filtering Logic**: Update author filter to search in author.name instead of author array
5. **Issue Filter**: Update to use `issue.issueNumber` instead of string matching
