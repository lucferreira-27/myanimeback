import axios from 'axios';
import { retrieveArchive, getAvailableTimestamps, selectTimestamp } from '../archiveService';
import { CustomError } from '../../utils/customError';

jest.mock('axios');

describe('archiveService', () => {
  const mockUrl = 'https://example.com/anime';
  const mockDate = '2023-05-01';
  const mockTimemapResponse = {
    data: [
      ['original', 'timestamp', 'url'],
      ['https://example.com/anime', '20230501000000', 'https://example.com/anime'],
      ['https://example.com/anime', '20230130000000', 'https://example.com/anime'],
      ['https://example.com/anime', '20230430000000', 'https://example.com/anime'],
      ['https://example.com/anime', '20230630000000', 'https://example.com/anime'],

    ],
    status: 200,
  };
  const mockArchiveResponse = {
    data: '<html><body>Archived content</body></html>',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully retrieve archive', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce(mockTimemapResponse);
    (axios.get as jest.Mock).mockResolvedValueOnce(mockArchiveResponse);

    const result = await retrieveArchive(mockUrl, mockDate);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenNthCalledWith(1, expect.stringContaining('https://web.archive.org/web/timemap/json'));
    expect(axios.get).toHaveBeenNthCalledWith(2, 'https://web.archive.org/web/20230430000000/https://example.com/anime');
    expect(result).toEqual({
      timestamp: '20230430000000',
      archiveUrl: 'https://web.archive.org/web/20230430000000/https://example.com/anime',
      html: '<html><body>Archived content</body></html>',
    });
  });

  it('should throw CustomError when no suitable archive is found', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
       
      ],
      status: 200,
    });

    await expect(retrieveArchive(mockUrl, '2023-05-02')).rejects.toThrow(
      new CustomError('No suitable archive found for the given date', 404)
    );
  });

  it('should throw CustomError when fetching timestamps fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(retrieveArchive(mockUrl, mockDate)).rejects.toThrow(
      new CustomError('Network error', 500)
    );
  });

  describe('getAvailableTimestamps', () => {
    it('should handle empty response', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: [['original', 'timestamp', 'url']],
        status: 200,
      });

      await expect(getAvailableTimestamps('https://example.com')).resolves.toEqual([]);
    });
  });

  describe('selectTimestamp', () => {
    it('should handle future date', () => {
      const entries = [
        { timestamp: '20230501000000', archiveUrl: 'https://example.com/1' },
        { timestamp: '20230601000000', archiveUrl: 'https://example.com/2' },
      ];

      const result = selectTimestamp(entries, '2024-01-01');
      expect(result).toEqual({
        timestamp: '20230601000000',
        archiveUrl: 'https://web.archive.org/web/20230601000000/https://example.com/2',
      });
    });
  });

  describe('retrieveArchive', () => {
    it('should handle rate limiting error', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce({
        response: { status: 429, data: 'Too Many Requests' },
      });

      await expect(retrieveArchive('https://example.com', '2023-05-01')).rejects.toThrow(
        new CustomError('Too many requests: Please try again later', 429)
      );
    });
  });
});