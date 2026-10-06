import { ConfigService } from '@nestjs/config';
import { buildTranslationProviders } from './build-providers.js';
import { DeepLProvider } from './deepl.provider.js';
import { LibreTranslateProvider } from './libretranslate.provider.js';
import { MyMemoryProvider, splitForMyMemory } from './mymemory.provider.js';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('translation providers', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('MyMemory sends the language pair and the contact e-mail, and decodes entities', async () => {
    fetchMock.mockResolvedValue(json({ responseData: { translatedText: 'Tom&#39;s cat' }, responseStatus: 200 }));
    await expect(new MyMemoryProvider('me@example.com').translate('con mèo của Tom', 'vi', 'en')).resolves.toBe("Tom's cat");

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get('langpair')).toBe('vi|en');
    expect(url.searchParams.get('de')).toBe('me@example.com');
  });

  it('MyMemory reports a used-up quota as a provider error', async () => {
    fetchMock.mockResolvedValue(json({ responseData: { translatedText: 'MYMEMORY WARNING' }, responseStatus: 429, quotaFinished: true }));
    await expect(new MyMemoryProvider().translate('hi', 'en', 'vi')).rejects.toThrow('mymemory: daily quota used up');
  });

  it('splits long text into pieces under 500 bytes at sentence ends', () => {
    const sentence = 'Hôm nay trời đẹp và tôi đi học tiếng Nhật với bạn. ';
    const pieces = splitForMyMemory(sentence.repeat(20));
    expect(pieces.length).toBeGreaterThan(1);
    for (const piece of pieces) expect(Buffer.byteLength(piece)).toBeLessThanOrEqual(480);
    expect(pieces.join(' ')).toBe(sentence.repeat(20).trim());
    expect(splitForMyMemory('short')).toEqual(['short']);
  });

  it('LibreTranslate posts JSON to the self-hosted server', async () => {
    fetchMock.mockResolvedValue(json({ translatedText: 'Hallo' }));
    await expect(new LibreTranslateProvider('http://localhost:5000/', 'key').translate('xin chào', 'vi', 'de')).resolves.toBe('Hallo');
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:5000/translate');
    expect(JSON.parse(init.body as string)).toEqual({ q: 'xin chào', source: 'vi', target: 'de', format: 'text', api_key: 'key' });
  });

  it('DeepL uses the free host for ":fx" keys and a regional English target', async () => {
    fetchMock.mockResolvedValue(json({ translations: [{ text: 'cat' }] }));
    await new DeepLProvider('abc:fx').translate('猫', 'ja', 'en');
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api-free.deepl.com/v2/translate');
    expect(JSON.parse(init.body as string)).toEqual({ text: ['猫'], source_lang: 'JA', target_lang: 'EN-US' });
  });

  it('turns HTTP errors into provider errors', async () => {
    fetchMock.mockResolvedValue(json({}, 456));
    await expect(new DeepLProvider('abc').translate('x', 'en', 'vi')).rejects.toThrow('deepl: HTTP 456');
  });

  it('builds only configured providers, best first, unless an order is given', () => {
    const names = (env: Record<string, string>) => buildTranslationProviders(new ConfigService(env)).map((p) => p.name);
    expect(names({})).toEqual(['mymemory']);
    expect(names({ DEEPL_API_KEY: 'k', LIBRETRANSLATE_URL: 'http://lt' })).toEqual(['deepl', 'libretranslate', 'mymemory']);
    expect(names({ LIBRETRANSLATE_URL: 'http://lt', TRANSLATION_PROVIDERS: 'mymemory, libretranslate, google' })).toEqual(['mymemory', 'libretranslate']);
  });
});
