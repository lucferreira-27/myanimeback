# Anime Archive API Documentation

## Base URL

All endpoints are relative to: `https://api.animearchive.com/api/v1`

## Authentication

Currently, this API does not require authentication. However, please note that rate limiting is applied to prevent abuse.

## Rate Limiting

The API is rate-limited to prevent abuse. Current limits are:
- 100 requests per minute per IP address
- 5000 requests per day per IP address

If you exceed these limits, you will receive a 429 Too Many Requests response.

## Endpoints

### 1. Search Anime

#### GET /anime

Search for anime titles using various parameters.

##### Query Parameters

- `query` (string, required): The search query for anime titles.
- `page` (integer, optional): Page number for pagination. Default: 1
- `limit` (integer, optional): Number of results per page. Default: 10, Max: 50
- `type` (string, optional): Type of anime. Possible values: tv, movie, ova, special, ona, music
- `score` (float, optional): Minimum score of anime (0-10)
- `status` (string, optional): Airing status of anime. Possible values: airing, complete, upcoming
- `rating` (string, optional): Age rating of anime. Possible values: g, pg, pg13, r17, r, rx
- `genres` (string, optional): Comma-separated list of genre IDs
- `order_by` (string, optional): Field to order results by. Possible values: title, type, rating, start_date, end_date, episodes, score, scored_by, rank, popularity, members, favorites
- `sort` (string, optional): Sort order. Possible values: asc, desc

##### Response

The response will be an array of AnimeSearchResult objects. Each object contains the following properties:

- `mal_id` (integer): MyAnimeList ID of the anime
- `title` (string): Title of the anime
- `images` (object): Contains image URLs for the anime
  - `jpg` (object):
    - `image_url` (string): URL of the standard image
    - `small_image_url` (string): URL of the small image
    - `large_image_url` (string): URL of the large image
- `synopsis` (string): Brief description of the anime
- `score` (float): Average user score (0-10)
- `rank` (integer): Rank of the anime based on score
- `popularity` (integer): Popularity rank of the anime
- `num_list_users` (integer): Number of users who have the anime in their list
- `num_scoring_users` (integer): Number of users who have scored the anime
- `status` (string): Airing status of the anime
- `type` (string): Type of the anime (TV, Movie, OVA, etc.)

##### Example Successful Response

```json
{
  "data": [
    {
      "mal_id": 1,
      "title": "Cowboy Bebop",
      "images": {
        "jpg": {
          "image_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
          "small_image_url": "https://cdn.myanimelist.net/images/anime/4/19644t.jpg",
          "large_image_url": "https://cdn.myanimelist.net/images/anime/4/19644l.jpg"
        }
      },
      "synopsis": "In the year 2071, humanity has colonized several of the planets and moons...",
      "score": 8.75,
      "rank": 28,
      "popularity": 39,
      "num_list_users": 1645675,
      "num_scoring_users": 1017638,
      "status": "Finished Airing",
      "type": "TV"
    }
  ],
  "pagination": {
    "last_visible_page": 20,
    "has_next_page": true,
    "current_page": 1,
    "items": {
      "count": 50,
      "total": 1000,
      "per_page": 50
    }
  }
}
```

##### Example Error Response

```json
{
  "error": "Bad Request",
  "message": "Invalid parameter: score must be between 0 and 10",
  "status": 400
}
```

### 2. Get Historical Anime Data

#### GET /anime/historical

Retrieve historical data for a specific anime from the Internet Archive.

##### Query Parameters

- `url` (string, required): The MyAnimeList URL of the anime.
- `date` (string, optional): The date for which to retrieve historical data. Format: YYYY-MM-DD. Default: 'latest' (most recent available data)

##### Response

The response will contain historical data for the specified anime.

##### Example Successful Response

```json
{
  "archive": {
    "archiveData": {
      "timestamp": "20230501000000",
      "archiveUrl": "https://web.archive.org/web/20230501000000/https://myanimelist.net/anime/1/Cowboy_Bebop"
    },
    "animeData": {
      "title": "Cowboy Bebop",
      "synopsis": "In the year 2071, humanity has colonized several of the planets and moons...",
      "score": "8.75",
      "scoredBy": "1017638",
      "ranked": "28",
      "popularity": "39",
      "members": "1645675",
      "favorites": "72365",
      "type": "TV",
      "season": "Spring 1998"
    }
  }
}
```

##### Example Error Response

```json
{
  "error": "Not Found",
  "message": "No suitable archive found for the given date",
  "status": 404
}
```

## Error Codes

- 400 Bad Request: The request was invalid or cannot be served.
- 404 Not Found: The requested resource could not be found.
- 429 Too Many Requests: The user has sent too many requests in a given amount of time.
- 500 Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.

## Versioning

This API supports versioned scraping to accommodate changes in the structure of MyAnimeList pages over time. The system automatically selects the appropriate version based on the requested archive date.

### Version Selection

When requesting historical data, the API automatically selects the appropriate version of parsing rules based on the provided date. If no date is specified, the latest version is used.

### Version Files

Version-specific parsing rules are stored in JSON files in the `config/versions` directory. Each file is named with the format `v-YYYYMMDD.json`, representing the date from which that version became active. Additionally, there's a `v-latest.json` file for the most current version.

Example version file structure:

```json
{
	"title": "h1.title-name",
	"synopsis": "p[itemprop=\"description\"]",
	"score": ".score-label",
	"scoredBy": ".js-statistics-info[data-id=\"info1\"] span[itemprop=\"ratingCount\"]",
	"ranked": ".po-r.js-statistics-info[data-id=\"info2\"]",
	"popularity": "div.spaceit_pad:contains(\"Popularity:\")",
	"members": "div.spaceit_pad:contains(\"Members:\")",
	"favorites": "div.spaceit_pad:contains(\"Favorites:\")",
	"type": "span.dark_text:contains(\"Type:\") + a",
	"season": "span.dark_text:contains(\"Premiered:\") + a"
}
```

The version selector system reads these files and chooses the appropriate version based on the requested date. This ensures that the API can accurately scrape and parse anime data from different time periods, even if the structure of the MyAnimeList pages has changed over time.
