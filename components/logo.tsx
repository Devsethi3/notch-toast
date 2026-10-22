import * as React from "react";

/**
 * Logo — frosted glass pane floating above a dark slab.
 *
 * - Pure SVG, no raster assets.
 * - Colors come only from design tokens (foreground / background / muted-foreground)
 *   via Tailwind's `text-*` utilities + `currentColor`, so it adapts to light and dark
 *   mode automatically and works with hsl/oklch token formats alike.
 *   In dark mode the palette inverts: a light slab with a dark frosted pane.
 */

type LogoProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
    /** Width & height in px (the mark is square-ish). */
    size?: number | string;
    /** Accessible title. Pass `null` to mark the logo as decorative. */
    title?: string | null;
};

/* Rounded-diamond silhouette shared by the glass pane and the slab. */
const DIAMOND =
    "M255 500 L555 288 C590 265 640 265 675 288 L985 520 C1015 545 1015 600 985 625 L700 805 C665 825 600 825 565 800 L255 590 C225 565 225 525 255 500 Z";

const SLAB_OFFSET_Y = 200; // distance between glass and slab faces
const SLAB_THICKNESS = 30; // visible edge thickness of the slab

export function Logo({
    size = 40,
    title = "Logo",
    className,
    ...props
}: LogoProps) {
    const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
    const id = (name: string) => `${name}-${uid}`;
    const ref = (name: string) => `url(#${id(name)})`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="210 240 820 820"
            width={size}
            height={size}
            role={title ? "img" : "presentation"}
            aria-hidden={title ? undefined : true}
            className={className}
            {...props}
        >
            {title ? <title>{title}</title> : null}

            <defs>
                {/* ---------- Slab ---------- */}
                {/* top face: soft light falloff from the upper-left */}
                <linearGradient id={id("slabFace")} x1="300" y1="700" x2="800" y2="1000" gradientUnits="userSpaceOnUse">
                    <stop offset="0" className="text-foreground" stopColor="currentColor" stopOpacity="0.82" />
                    <stop offset="0.45" className="text-foreground" stopColor="currentColor" stopOpacity="0.96" />
                    <stop offset="1" className="text-foreground" stopColor="currentColor" stopOpacity="1" />
                </linearGradient>
                {/* lift on the slab's upper-left rim */}
                <linearGradient id={id("slabSheen")} x1="250" y1="720" x2="620" y2="900" gradientUnits="userSpaceOnUse">
                    <stop offset="0" className="text-background" stopColor="currentColor" stopOpacity="0.28" />
                    <stop offset="1" className="text-background" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
                {/* thickness edge */}
                <linearGradient id={id("slabEdge")} x1="250" y1="0" x2="1010" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" className="text-foreground" stopColor="currentColor" stopOpacity="0.78" />
                    <stop offset="0.5" className="text-foreground" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="1" className="text-foreground" stopColor="currentColor" stopOpacity="0.85" />
                </linearGradient>

                {/* ---------- Glass ---------- */}
                {/* frosted body: tinted core, bright milky edges */}
                <radialGradient id={id("glassBody")} cx="620" cy="590" r="420" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(620 590) scale(1 0.72) translate(-620 -590)">
                    <stop offset="0" className="text-muted-foreground" stopColor="currentColor" stopOpacity="0.95" />
                    <stop offset="0.45" className="text-muted-foreground" stopColor="currentColor" stopOpacity="0.55" />
                    <stop offset="1" className="text-muted-foreground" stopColor="currentColor" stopOpacity="0.06" />
                </radialGradient>
                {/* rim light running along the top edges */}
                <linearGradient id={id("glassRim")} x1="300" y1="280" x2="900" y2="820" gradientUnits="userSpaceOnUse">
                    <stop offset="0" className="text-background" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="0.55" className="text-background" stopColor="currentColor" stopOpacity="0.55" />
                    <stop offset="1" className="text-background" stopColor="currentColor" stopOpacity="0.9" />
                </linearGradient>
                {/* specular sweep (the diagonal reflection across the pane) */}
                <linearGradient id={id("glassSpec")} x1="400" y1="300" x2="900" y2="700" gradientUnits="userSpaceOnUse">
                    <stop offset="0" className="text-background" stopColor="currentColor" stopOpacity="0.38" />
                    <stop offset="1" className="text-background" stopColor="currentColor" stopOpacity="0.04" />
                </linearGradient>

                {/* ---------- Filters & clips ---------- */}
                <filter id={id("blurSoft")} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="22" />
                </filter>
                <filter id={id("blurEdge")} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="16" />
                </filter>
                <filter id={id("blurTiny")} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2.5" />
                </filter>

                <clipPath id={id("glassClip")}>
                    <path d={DIAMOND} />
                </clipPath>
                <clipPath id={id("slabClip")}>
                    <path d={DIAMOND} transform={`translate(0 ${SLAB_OFFSET_Y})`} />
                </clipPath>
            </defs>

            {/* ================= SLAB ================= */}
            <g>
                {/* thickness / side wall */}
                <path
                    d={DIAMOND}
                    transform={`translate(0 ${SLAB_OFFSET_Y + SLAB_THICKNESS})`}
                    fill={ref("slabEdge")}
                />
                <path
                    d={DIAMOND}
                    transform={`translate(0 ${SLAB_OFFSET_Y + SLAB_THICKNESS / 2})`}
                    fill={ref("slabEdge")}
                />

                {/* top face */}
                <path
                    d={DIAMOND}
                    transform={`translate(0 ${SLAB_OFFSET_Y})`}
                    fill={ref("slabFace")}
                />
                <path
                    d={DIAMOND}
                    transform={`translate(0 ${SLAB_OFFSET_Y})`}
                    fill={ref("slabSheen")}
                />

                {/* thin rim highlight on the face edge */}
                <path
                    d={DIAMOND}
                    transform={`translate(0 ${SLAB_OFFSET_Y})`}
                    fill="none"
                    strokeWidth="3"
                    className="stroke-background"
                    strokeOpacity="0.22"
                    filter={ref("blurTiny")}
                />

                {/* soft shadow cast by the glass onto the slab */}
                <g clipPath={ref("slabClip")}>
                    <path
                        d={DIAMOND}
                        transform="translate(0 70)"
                        className="fill-foreground"
                        fillOpacity="0.55"
                        filter={ref("blurSoft")}
                    />
                    <path
                        d={DIAMOND}
                        transform="translate(0 40)"
                        className="fill-background"
                        fillOpacity="0.0"
                    />
                </g>
            </g>

            {/* ================= GLASS ================= */}
            <g>
                {/* faint base so edges read as milky even over the slab */}
                <path d={DIAMOND} className="fill-background" fillOpacity="0.92" />

                <g clipPath={ref("glassClip")}>
                    {/* tinted frosted core */}
                    <path d={DIAMOND} fill={ref("glassBody")} />

                    {/* soft inner glow hugging the edges (frosted bevel) */}
                    <path
                        d={DIAMOND}
                        fill="none"
                        strokeWidth="64"
                        className="stroke-background"
                        strokeOpacity="0.9"
                        filter={ref("blurEdge")}
                    />

                    {/* diagonal specular sweep: lighter above the curve */}
                    <path
                        d="M380 720 C560 700 800 630 960 470 L1040 200 L200 200 Z"
                        fill={ref("glassSpec")}
                    />
                    {/* the curve's crisp edge */}
                    <path
                        d="M380 720 C560 700 800 630 960 470"
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="stroke-background"
                        strokeOpacity="0.45"
                    />
                </g>

                {/* crisp outer rim */}
                <path
                    d={DIAMOND}
                    fill="none"
                    strokeWidth="5"
                    stroke={ref("glassRim")}
                />
            </g>
        </svg>
    );
}

export default Logo;