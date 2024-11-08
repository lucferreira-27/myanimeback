import { scrapeAnimeData } from '../animeService';
import { retrieveArchive } from '../archiveService';
import { scrapeAnimePage } from '../scrapingService';
import { CustomError } from '../../utils/customError';

jest.mock('../archiveService');
jest.mock('../scrapingService');

describe('animeService', () => {
  const mockUrl = 'https://example.com/anime';
  const mockDate = '2023-05-01';
  const mockArchiveData = {
    timestamp: '20230501000000',
    archiveUrl: 'https://web.archive.org/web/20230501000000/https://example.com/anime',
    html: '<html><body>Mocked HTML</body></html>',
  };
  const mockAnimeData = {
    title: 'Test Anime',
    synopsis: 'Test synopsis',
    score: '8.5',
    scoredBy: '1000',
    ranked: '100',
    popularity: '200',
    members: '10000',
    favorites: '500',
    type: 'TV',
    season: 'Spring 2023',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully scrape anime data', async () => {
    (retrieveArchive as jest.Mock).mockResolvedValue(mockArchiveData);
    (scrapeAnimePage as jest.Mock).mockReturnValue(mockAnimeData);

    const result = await scrapeAnimeData(mockUrl, mockDate);

    expect(retrieveArchive).toHaveBeenCalledWith(mockUrl, mockDate);
    expect(scrapeAnimePage).toHaveBeenCalledWith(mockUrl, mockArchiveData.html, mockDate);
    expect(result).toEqual({
      archive: {
        archiveData: {
          timestamp: mockArchiveData.timestamp,
          archiveUrl: mockArchiveData.archiveUrl,
        },
        animeData: mockAnimeData,
      },
    });
  });

  it('should throw CustomError when archive retrieval fails', async () => {
    const errorMessage = 'Failed to retrieve archive';
    (retrieveArchive as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(scrapeAnimeData(mockUrl, mockDate)).rejects.toThrow(
      new CustomError(`Failed to scrape anime data: ${errorMessage}`, 500)
    );
  });

  it('should throw CustomError when scraping fails', async () => {
    (retrieveArchive as jest.Mock).mockResolvedValue(mockArchiveData);
    const errorMessage = 'Failed to scrape anime page';
    (scrapeAnimePage as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(scrapeAnimeData(mockUrl, mockDate)).rejects.toThrow(
      new CustomError(`Failed to scrape anime data: ${errorMessage}`, 500)
    );
  });

  it('should handle partial anime data', async () => {
    const mockArchiveData = {
      timestamp: '20230501000000',
      archiveUrl: 'https://web.archive.org/web/20230501000000/https://example.com/anime',
      html: '<html><body>Partial HTML</body></html>',
    };
    const mockPartialAnimeData = {
      title: 'Test Anime',
      synopsis: 'Test synopsis',
      score: '8.5',
      scoredBy: '1000',
      // Missing some fields
    };

    (retrieveArchive as jest.Mock).mockResolvedValue(mockArchiveData);
    (scrapeAnimePage as jest.Mock).mockReturnValue(mockPartialAnimeData);

    const result = await scrapeAnimeData('https://example.com/anime', '2023-05-01');

    expect(result.archive.animeData).toEqual(mockPartialAnimeData);
  });

  it('should handle rate limiting error', async () => {
    (retrieveArchive as jest.Mock).mockRejectedValue(new CustomError('Rate limit exceeded', 429));

    await expect(scrapeAnimeData('https://example.com/anime', '2023-05-01')).rejects.toThrow(
      new CustomError('Failed to scrape anime data: Rate limit exceeded', 500)
    );
  });

  it('should handle different date inputs', async () => {
    const mockArchiveData = {
      timestamp: '20230501000000',
      archiveUrl: 'https://web.archive.org/web/20230501000000/https://example.com/anime',
      html: '<html><body>Mocked HTML</body></html>',
    };
    const mockAnimeData = {
      title: 'Test Anime',
      synopsis: 'Test synopsis',
      score: '8.5',
      scoredBy: '1000',
      ranked: '100',
      popularity: '200',
      members: '10000',
      favorites: '500',
      type: 'TV',
      season: 'Spring 2023',
    };

    (retrieveArchive as jest.Mock).mockResolvedValue(mockArchiveData);
    (scrapeAnimePage as jest.Mock).mockReturnValue(mockAnimeData);

    const dates = ['latest', '2023-05-01', '2020-01-01'];

    for (const date of dates) {
      const result = await scrapeAnimeData('https://example.com/anime', date);
      expect(result.archive.animeData).toEqual(mockAnimeData);
      expect(retrieveArchive).toHaveBeenCalledWith('https://example.com/anime', date);
    }
  });

  it('should handle malformed HTML', async () => {
    const mockArchiveData = {
      timestamp: '20230501000000',
      archiveUrl: 'https://web.archive.org/web/20230501000000/https://example.com/anime',
      html: '<html><body>Malformed HTML</body></html>',
    };

    (retrieveArchive as jest.Mock).mockResolvedValue(mockArchiveData);
    (scrapeAnimePage as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to parse HTML');
    });

    await expect(scrapeAnimeData('https://example.com/anime', '2023-05-01')).rejects.toThrow(
      new CustomError('Failed to scrape anime data: Failed to parse HTML', 500)
    );
  });
});