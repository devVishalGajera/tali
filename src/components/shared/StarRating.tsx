/**
 * Reusable star rating components.
 *
 * StarIcon  – a single star SVG (filled or empty)
 * StarRating – renders up to 5 stars from a decimal score (e.g. 4.7)
 */

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const SIZE_MAP = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const;

type StarSize = keyof typeof SIZE_MAP;

/* ── Single star icon ────────────────────────────────────────────────── */
export const StarIcon = ({
  filled = true,
  size = "sm",
  className = "",
}: {
  filled?: boolean;
  size?: StarSize;
  className?: string;
}) => (
  <svg
    className={`${SIZE_MAP[size]} ${className}`}
    viewBox="0 0 24 24"
    fill={filled ? "#FBBC05" : "#D9D9D9"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={STAR_PATH} />
  </svg>
);

/* ── Row of up to 5 stars based on a decimal score ───────────────────── */
const StarRating = ({
  score,
  size = "sm",
  className = "",
}: {
  score: number;
  size?: StarSize;
  className?: string;
}) => {
  const full  = Math.floor(score);
  const empty = 5 - Math.ceil(score);
  const half  = 5 - full - empty;

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: full  }).map((_, i) => <StarIcon key={`f${i}`} filled size={size} />)}
      {Array.from({ length: half  }).map((_, i) => <StarIcon key={`h${i}`} filled size={size} />)}
      {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} filled={false} size={size} />)}
    </div>
  );
};

export default StarRating;
