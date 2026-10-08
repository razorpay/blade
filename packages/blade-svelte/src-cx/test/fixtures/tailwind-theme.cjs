// A tailwind.config.js theme in the shapes an app writes: an `<alpha-value>`
// palette, a function key, font-size tuples, `extend` (merged deeply), a
// preset. tailwind-v3.json is what Tailwind v3.4.1 made of `classes` with it
// (captured once; Blade does not depend on Tailwind).
const palette = (name) => ({
  DEFAULT: `hsl(var(--${name}) / <alpha-value>)`,
  500: `hsl(var(--${name}-500) / <alpha-value>)`,
  700: `hsl(var(--${name}-700) / <alpha-value>)`,
});

const theme = {
  colors: {
    primary: palette('primary'),
    on: { surface: palette('on-surface') },
    transparent: 'transparent',
    white: '#fff',
    current: 'currentColor',
  },
  // A function of the rest of the theme, as checkout's typography colour.
  textColor: ({ theme }) => ({
    ...theme('colors'),
    reading: 'hsl(var(--typography-color, var(--on-surface)) / <alpha-value>)',
  }),
  fontSize: {
    sm: ['var(--font-size, 0.75rem)', { lineHeight: '1rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
  },
  fontFamily: {
    sans: ['var(--body-font, Inter)'],
    serif: ['"Awesome Serif"', 'serif'],
  },
  borderRadius: {
    none: '0px',
    DEFAULT: 'var(--corner-radius, 0.25rem)',
    lg: 'var(--corner-radius, 0.5rem)',
    full: '9999px',
  },
  extend: {
    fontWeight: { medium: 'var(--font-weight, 500)' },
    spacing: { 19: '4.75rem' },
    backgroundImage: { sheen: 'radial-gradient(circle, white 20%, transparent 25%)' },
    keyframes: {
      // Merged into Tailwind's own `bounce`: its steps keep their easing.
      bounce: { '0%, 100%': { transform: 'translateY(-50%)' } },
      'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
    },
    animation: { 'fade-in': 'fade-in 0.25s ease-in forwards', bounce: 'bounce 1s infinite' },
  },
};

const presets = [
  { theme: { extend: { backgroundColor: { subtle: 'hsla(0, 0%, 97%, 1)' }, boxShadow: { card: '0 6px 32px 4px hsla(205, 8%, 71%, 0.06)' } } } },
];

const classes = [
  // colour, opacity modifiers and opacity classes
  'bg-primary', 'bg-primary-500', 'bg-primary-500/20', 'bg-primary/[0.18]', 'bg-on-surface/5',
  'bg-white', 'bg-transparent', 'bg-current', 'bg-subtle', 'bg-opacity-50', 'bg-opacity-[0.08]',
  'bg-[#fff]', 'bg-[#00000052]', 'bg-[#1291D0]/[0.18]', 'bg-[rgba(0,0,0,0.4)]', 'bg-[rgb(0_0_0/0.6)]',
  'bg-[hsl(var(--x))]', 'bg-[white]', 'bg-[var(--fill)]',
  'text-primary-700', 'text-reading', 'text-reading/50', 'text-opacity-60', 'text-white/[0.64]',
  'text-[#fff]', 'text-[green]', 'text-[color:var(--x)]',
  'border-primary-500', 'border-t-primary', 'border-x-white', 'border-opacity-20', 'border-[#666666]/50',
  'divide-primary-500', 'divide-opacity-10', 'placeholder-primary-500', 'placeholder-opacity-60',
  'fill-primary-500', 'fill-none', 'fill-[#ecf1ff]', 'stroke-primary-500', 'stroke-2', 'stroke-[#000]',
  'accent-primary-500', 'caret-primary-500', 'decoration-primary-500', 'outline-primary-500',
  'ring-primary-500', 'ring-white/40', 'ring-opacity-20', 'ring-offset-white',
  'shadow-primary-500',
  // gradients and images
  'bg-gradient-to-r', 'from-primary-500', 'via-white', 'to-[#fff]', 'from-[8%]', 'to-[57%]',
  'bg-sheen', 'bg-none', 'bg-[url(/a.png)]', 'bg-[linear-gradient(90deg,#fff_0%,#000_100%)]',
  'bg-[length:200%_100%]', 'bg-cover', 'bg-center', 'bg-no-repeat', 'bg-clip-text',
  // type
  'text-sm', 'text-lg', 'text-sm/6', 'text-[14px]', 'text-[0.75em]', 'text-[clamp(0.75rem,2vw,1rem)]',
  'text-[length:var(--size)]', 'leading-tight', 'leading-[1.3]', 'tracking-wide', 'tracking-[-0.3px]',
  '-tracking-[0.36px]', 'font-sans', 'font-serif', 'font-[Inter]', 'font-medium', 'font-bold',
  'uppercase', 'italic', 'antialiased', 'underline-offset-2', 'decoration-dashed', 'whitespace-pre-line',
  'break-words', 'text-wrap', 'text-justify', 'align-[-0.125em]', 'list-disc', 'truncate',
  // borders and radius
  'rounded', 'rounded-lg', 'rounded-t-lg', 'rounded-bl', 'rounded-[50%]', 'rounded-full',
  'border', 'border-2', 'border-x', 'border-t-0', 'border-[1.5px]', 'border-dashed',
  'divide-y', 'divide-x-2', 'divide-dashed', 'space-y-2', '-space-x-2', 'space-y-[2px]',
  'border-spacing-3', 'border-separate',
  // effects
  'shadow', 'shadow-lg', 'shadow-none', 'shadow-card', 'shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
  'ring', 'ring-2', 'ring-[3px]', 'ring-inset', 'ring-offset-2',
  'outline', 'outline-2', 'outline-dashed', '-outline-offset-1', 'outline-[rgb(0_0_0/0.1)]',
  'blur', 'blur-sm', 'blur-[7px]', 'brightness-0', 'invert', 'saturate-0', 'drop-shadow', 'drop-shadow-sm',
  'filter', 'backdrop-blur-sm', 'backdrop-blur-[0.46875rem]', 'mix-blend-multiply', 'bg-blend-overlay',
  'animate-fade-in', 'animate-bounce', 'animate-[shine_1s_ease-out_0.75s_1_both]',
  // layout and sizing from the theme
  'size-4', 'size-[18px]', 'h-19', 'max-w-md', 'h-screen', 'min-h-screen', 'w-3/5', 'z-[5]', '-z-10',
  'basis-[250px]', 'grid-cols-[1fr_auto]', 'aspect-video', 'col-span-2', 'inset-x-px', 'flex-[0_0_auto]',
  'object-scale-down', 'snap-x', 'snap-mandatory', 'appearance-none', 'cursor-row-resize',
  'content-none', "content-['x']",
];

module.exports = { theme, presets, classes };
