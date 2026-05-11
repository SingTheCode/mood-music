import { Test, TestingModule } from '@nestjs/testing';
import { KeywordService } from './keyword.service';

describe('KeywordService', () => {
  let service: KeywordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordService,
        {
          provide: 'OPENAI_CLIENT',
          useValue: {
            chat: {
              completions: {
                create: jest.fn().mockResolvedValue({
                  choices: [
                    {
                      message: {
                        content: 'lo-fi chill ambient korean',
                      },
                    },
                  ],
                }),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<KeywordService>(KeywordService);
  });

  describe('expandKeywords', () => {
    it('should return expanded keywords from LLM', async () => {
      const result = await service.expandKeywords(['잔잔한', '새벽']);
      expect(result).toBeDefined();
      expect(result.query).toBeDefined();
      expect(typeof result.query).toBe('string');
      expect(result.query.length).toBeGreaterThan(0);
    });

    it('should return cached result on second call', async () => {
      const keywords = ['잔잔한', '새벽'];
      const result1 = await service.expandKeywords(keywords);
      const result2 = await service.expandKeywords(keywords);
      expect(result1.query).toBe(result2.query);
    });

    it('should return fallback on LLM error', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          KeywordService,
          {
            provide: 'OPENAI_CLIENT',
            useValue: {
              chat: {
                completions: {
                  create: jest.fn().mockRejectedValue(new Error('API Error')),
                },
              },
            },
          },
        ],
      }).compile();

      const serviceWithError = module.get<KeywordService>(KeywordService);
      const result = await serviceWithError.expandKeywords(['잔잔한']);
      expect(result).toBeDefined();
      expect(result.query).toBeDefined();
      expect(typeof result.query).toBe('string');
    });
  });
});
