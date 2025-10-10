import humanizeDuration from 'humanize-duration';

/**
 * Humanize time values for better readability
 */

const shortHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
  units: ['y', 'mo', 'w', 'd', 'h'],
  round: true,
  largest: 2,
  spacer: ' ',
  conjunction: ' ',
  serialComma: false,
});

/**
 * Convert years to a human-readable duration
 * @param years - Number of years (can be fractional)
 * @returns Human-readable string like "3 months" or "1 y 2 mo"
 */
export function humanizeYears(years: number | string): string {
  if (years === '∞' || years === Infinity || years === 'Infinity') {
    return 'Never';
  }

  const numYears = typeof years === 'string' ? parseFloat(years) : years;

  if (isNaN(numYears) || !isFinite(numYears)) {
    return 'Never';
  }

  // Convert years to milliseconds
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const milliseconds = numYears * msPerYear;

  // Use humanize-duration for nice formatting
  const humanized = shortHumanizer(milliseconds);

  // If it's less than a day, show more precision
  if (numYears < 1 / 365) {
    return humanizeDuration(milliseconds, {
      units: ['d', 'h', 'm'],
      round: true,
      largest: 2,
    });
  }

  return humanized;
}

/**
 * Format large numbers with commas and optional suffix
 */
export function formatNumber(num: number | string, decimals: number = 0): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(n)) {
    return '0';
  }

  // For very large numbers, use K/M/B notation
  if (Math.abs(n) >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(1) + 'B';
  }
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(n) >= 10_000) {
    return (n / 1_000).toFixed(1) + 'K';
  }

  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format money values with generic currency symbol
 */
export function formatMoney(amount: number | string, decimals: number = 2): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(n)) {
    return '💰 0.00';
  }

  const absN = Math.abs(n);
  const sign = n < 0 ? '-' : '';

  // For large amounts, use K/M/B notation
  if (absN >= 1_000_000_000) {
    return sign + '💰 ' + (absN / 1_000_000_000).toFixed(1) + 'B';
  }
  if (absN >= 1_000_000) {
    return sign + '💰 ' + (absN / 1_000_000).toFixed(1) + 'M';
  }
  if (absN >= 10_000) {
    return sign + '💰 ' + (absN / 1_000).toFixed(1) + 'K';
  }

  return sign + '💰 ' + absN.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format hours to human-readable duration
 */
export function humanizeHours(hours: number | string): string {
  const h = typeof hours === 'string' ? parseFloat(hours) : hours;

  if (isNaN(h) || !isFinite(h)) {
    return '0 hours';
  }

  const milliseconds = h * 60 * 60 * 1000;

  if (h < 1) {
    // Less than an hour, show minutes
    return humanizeDuration(milliseconds, {
      units: ['h', 'm', 's'],
      round: true,
      largest: 2,
    });
  }

  if (h < 24) {
    // Less than a day, show hours and minutes
    return humanizeDuration(milliseconds, {
      units: ['h', 'm'],
      round: true,
      largest: 2,
    });
  }

  if (h < 24 * 30) {
    // Less than a month, show days and hours
    return humanizeDuration(milliseconds, {
      units: ['d', 'h'],
      round: true,
      largest: 2,
    });
  }

  // Longer durations
  return shortHumanizer(milliseconds);
}
