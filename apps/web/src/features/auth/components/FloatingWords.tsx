const WORDS = [
  { text: 'Hello', lang: 'en', top: '7%', left: '50%', size: 'text-3xl', tone: 'vanilla', duration: 9, delay: 0 },
  { text: '꿈', lang: 'ko', top: '4%', left: '36%', size: 'text-4xl', tone: 'orange', duration: 11, delay: -4 },
  { text: '世界', lang: 'ja', top: '10%', left: '78%', size: 'text-5xl', tone: 'orange', duration: 12, delay: -2 },
  { text: 'Hallo', lang: 'de', top: '18%', left: '34%', size: 'text-xl', tone: 'vanilla', duration: 8, delay: -6 },
  { text: 'Lernen', lang: 'de', top: '28%', left: '72%', size: 'text-lg', tone: 'vanilla', duration: 10, delay: -1 },
  { text: 'Learn', lang: 'en', top: '38%', left: '86%', size: 'text-lg', tone: 'orange', duration: 9, delay: -5 },
  { text: '夢', lang: 'ja', top: '52%', left: '88%', size: 'text-4xl', tone: 'vanilla', duration: 13, delay: -3 },
  { text: '세계', lang: 'ko', top: '66%', left: '84%', size: 'text-2xl', tone: 'orange', duration: 10, delay: -7 },
  { text: 'Dream', lang: 'en', top: '74%', left: '64%', size: 'text-xl', tone: 'vanilla', duration: 11, delay: -2 },
  { text: 'こんにちは', lang: 'ja', top: '79%', left: '26%', size: 'text-3xl', tone: 'orange', duration: 12, delay: -8 },
  { text: 'Welt', lang: 'de', top: '84%', left: '74%', size: 'text-4xl', tone: 'vanilla', duration: 9, delay: -4 },
  { text: '배우다', lang: 'ko', top: '91%', left: '48%', size: 'text-xl', tone: 'vanilla', duration: 10, delay: -6 },
  { text: '안녕하세요', lang: 'ko', top: '20%', left: '58%', size: 'text-2xl', tone: 'orange', duration: 14, delay: -9 },
  { text: '学ぶ', lang: 'ja', top: '60%', left: '74%', size: 'text-2xl', tone: 'vanilla', duration: 11, delay: -1 },
  { text: 'Träumen', lang: 'de', top: '87%', left: '8%', size: 'text-lg', tone: 'orange', duration: 12, delay: -5 },
  { text: 'World', lang: 'en', top: '46%', left: '70%', size: 'text-lg', tone: 'vanilla', duration: 10, delay: -3 },
] as const

const TONE_CLASSES = {
  vanilla: 'text-secondary-100/20',
  orange: 'text-primary-400/35',
}

function FloatingWords() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {WORDS.map((word) => (
        <span
          key={word.text}
          lang={word.lang}
          className={`absolute font-bold whitespace-nowrap motion-safe:animate-float ${word.size} ${TONE_CLASSES[word.tone]}`}
          style={{
            top: word.top,
            left: word.left,
            animationDuration: `${word.duration}s`,
            animationDelay: `${word.delay}s`,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}

export default FloatingWords
