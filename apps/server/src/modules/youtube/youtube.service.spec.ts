import { Test, TestingModule } from '@nestjs/testing';
import { YouTubeService } from './youtube.service';

describe('YouTubeService', () => {
  let service: YouTubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YouTubeService,
        {
          provide: 'YOUTUBE_CLIENT',
          useValue: {
            search: {
              list: jest.fn().mockResolvedValue({
                data: {
                  items: [
                    {
                      id: { videoId: 'dQw4w9WgXcQ' },
                      snippet: {
                        title: 'Lo-fi Chill Beats',
                        channelTitle: 'Chill Music Channel',
                        thumbnails: { high: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' } },
                      },
                    },
                  ],
                },
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<YouTubeService>(YouTubeService);
  });

  describe('search', () => {
    it('should return search results', async () => {
      const result = await service.search('lo-fi chill');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return cached result on second call', async () => {
      const query = 'lo-fi chill';
      const result1 = await service.search(query);
      const result2 = await service.search(query);
      expect(result1).toEqual(result2);
    });

    it('should return empty array on no results', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          YouTubeService,
          {
            provide: 'YOUTUBE_CLIENT',
            useValue: {
              search: {
                list: jest.fn().mockResolvedValue({ data: { items: [] } }),
              },
            },
          },
        ],
      }).compile();

      const serviceEmpty = module.get<YouTubeService>(YouTubeService);
      const result = await serviceEmpty.search('nonexistent query');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
