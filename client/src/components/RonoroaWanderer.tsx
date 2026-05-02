import { useEffect, useRef, useState } from "react";

interface RonoroaWandererProps {
  enabled: boolean;
}

const FRAME_MS = 15;
const MOVE_STEP = 12;
const EDGE_PADDING = 140;
const EDGE_GUARD = 30;
const DEFAULT_WIDTH = 200;
const RISE_START_Y = 180;
const RISE_STEP = 2;

const PHASE_RISE = 0;
const PHASE_INTRO_FLIP_1 = 1;
const PHASE_INTRO_FLIP_2 = 2;
const PHASE_INTRO_FLIP_3 = 3;
const PHASE_RUN_LEFT = 4;
const PHASE_LEFT_FLIP_1 = 5;
const PHASE_LEFT_FLIP_2 = 6;
const PHASE_LEFT_FLIP_3 = 7;
const PHASE_RUN_RIGHT = 8;
const PHASE_RIGHT_FLIP_1 = 9;
const PHASE_RIGHT_FLIP_2 = 10;
const PHASE_RIGHT_FLIP_3 = 11;

const PHASE_MOBILE_FLIP_1 = 20;
const PHASE_MOBILE_FLIP_2 = 21;
const PHASE_MOBILE_FLIP_3 = 22;
const PHASE_MOBILE_WAIT = 23;

export default function RonoroaWanderer({ enabled }: RonoroaWandererProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ronoroaCenterX, setRonoroaCenterX] = useState(window.innerWidth / 2);
  const [ronoroaRiseY, setRonoroaRiseY] = useState(RISE_START_Y);
  const [ronoroaFlip, setRonoroaFlip] = useState(1);
  const [imageWidth, setImageWidth] = useState(DEFAULT_WIDTH);
  const [bottomTrimPx, setBottomTrimPx] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const isMobile = viewportWidth < 640;

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setRonoroaCenterX(window.innerWidth / 2);
      setRonoroaRiseY(RISE_START_Y);
      setRonoroaFlip(1);
      setIsVisible(true);
    }, 120000);

    return () => clearTimeout(timer);
  }, [enabled]);

  useEffect(() => {
    if (!isVisible) return;

    const updateSize = () => {
      setViewportWidth(window.innerWidth);
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const measuredWidth = rect.width;
      if (measuredWidth > 0) {
        setImageWidth(measuredWidth);
      }

      // Compensate transparent bottom pixels so visible feet touch viewport bottom.
      const { naturalWidth, naturalHeight } = imageRef.current;
      if (!naturalWidth || !naturalHeight || rect.height <= 0) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(imageRef.current, 0, 0, naturalWidth, naturalHeight);
        const data = ctx.getImageData(0, 0, naturalWidth, naturalHeight).data;

        let transparentRowsFromBottom = 0;
        for (let y = naturalHeight - 1; y >= 0; y -= 1) {
          let rowTransparent = true;
          for (let x = 0; x < naturalWidth; x += 1) {
            const alpha = data[(y * naturalWidth + x) * 4 + 3];
            if (alpha > 5) {
              rowTransparent = false;
              break;
            }
          }

          if (!rowTransparent) break;
          transparentRowsFromBottom += 1;
        }

        const renderedTrim = (transparentRowsFromBottom / naturalHeight) * rect.height;
        setBottomTrimPx(renderedTrim);
      } catch {
        setBottomTrimPx(0);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let phase = PHASE_RISE;
    let phaseDuration = 0;
    let centerX = viewportWidth / 2;
    let riseY = RISE_START_Y;
    let flip = 1;
    let mobileBaseFacing = 1;

    const getBounds = () => {
      const halfWidth = imageWidth / 2;
      const left = EDGE_PADDING + halfWidth + EDGE_GUARD;
      const right = viewportWidth - EDGE_PADDING - halfWidth - EDGE_GUARD;

      if (left > right) {
        const centered = viewportWidth / 2;
        return { left: centered, right: centered };
      }

      return { left, right };
    };

    setRonoroaCenterX(centerX);
    setRonoroaRiseY(riseY);
    setRonoroaFlip(flip);

    const interval = setInterval(() => {
      phaseDuration += 1;
      const { left, right } = getBounds();

      if (isMobile) {
        switch (phase) {
          case PHASE_RISE:
            riseY = Math.max(0, riseY - RISE_STEP);
            if (riseY === 0) {
              phase = PHASE_MOBILE_FLIP_1;
              phaseDuration = 0;
              flip = mobileBaseFacing;
            }
            break;
          case PHASE_MOBILE_FLIP_1:
            if (phaseDuration > 24) {
              flip = -mobileBaseFacing;
              phase = PHASE_MOBILE_FLIP_2;
              phaseDuration = 0;
            }
            break;
          case PHASE_MOBILE_FLIP_2:
            if (phaseDuration > 24) {
              flip = mobileBaseFacing;
              phase = PHASE_MOBILE_FLIP_3;
              phaseDuration = 0;
            }
            break;
          case PHASE_MOBILE_FLIP_3:
            if (phaseDuration > 24) {
              flip = -mobileBaseFacing;
              phase = PHASE_MOBILE_WAIT;
              phaseDuration = 0;
            }
            break;
          case PHASE_MOBILE_WAIT:
            if (phaseDuration > 60) {
              mobileBaseFacing = -mobileBaseFacing;
              flip = mobileBaseFacing;
              phase = PHASE_MOBILE_FLIP_1;
              phaseDuration = 0;
            }
            break;
        }
      } else {
        switch (phase) {
          case PHASE_RISE:
            riseY = Math.max(0, riseY - RISE_STEP);
            if (riseY === 0) {
              phase = PHASE_INTRO_FLIP_1;
              phaseDuration = 0;
              flip = 1;
            }
            break;
          case PHASE_INTRO_FLIP_1:
            if (phaseDuration > 24) {
              flip = -1;
              phase = PHASE_INTRO_FLIP_2;
              phaseDuration = 0;
            }
            break;
          case PHASE_INTRO_FLIP_2:
            if (phaseDuration > 24) {
              flip = 1;
              phase = PHASE_INTRO_FLIP_3;
              phaseDuration = 0;
            }
            break;
          case PHASE_INTRO_FLIP_3:
            if (phaseDuration > 24) {
              flip = -1;
              phase = PHASE_RUN_LEFT;
              phaseDuration = 0;
            }
            break;
          case PHASE_RUN_LEFT:
            centerX -= MOVE_STEP;
            if (centerX <= left) {
              centerX = left;
              flip = -1;
              phase = PHASE_LEFT_FLIP_1;
              phaseDuration = 0;
            }
            break;
          case PHASE_LEFT_FLIP_1:
            if (phaseDuration > 24) {
              flip = 1;
              phase = PHASE_LEFT_FLIP_2;
              phaseDuration = 0;
            }
            break;
          case PHASE_LEFT_FLIP_2:
            if (phaseDuration > 24) {
              flip = -1;
              phase = PHASE_LEFT_FLIP_3;
              phaseDuration = 0;
            }
            break;
          case PHASE_LEFT_FLIP_3:
            if (phaseDuration > 24) {
              flip = 1;
              phase = PHASE_RUN_RIGHT;
              phaseDuration = 0;
            }
            break;
          case PHASE_RUN_RIGHT:
            centerX += MOVE_STEP;
            if (centerX >= right) {
              centerX = right;
              flip = 1;
              phase = PHASE_RIGHT_FLIP_1;
              phaseDuration = 0;
            }
            break;
          case PHASE_RIGHT_FLIP_1:
            if (phaseDuration > 24) {
              flip = -1;
              phase = PHASE_RIGHT_FLIP_2;
              phaseDuration = 0;
            }
            break;
          case PHASE_RIGHT_FLIP_2:
            if (phaseDuration > 24) {
              flip = 1;
              phase = PHASE_RIGHT_FLIP_3;
              phaseDuration = 0;
            }
            break;
          case PHASE_RIGHT_FLIP_3:
            if (phaseDuration > 24) {
              flip = -1;
              phase = PHASE_RUN_LEFT;
              phaseDuration = 0;
            }
            break;
        }
      }

      setRonoroaCenterX(centerX);
      setRonoroaRiseY(riseY);
      setRonoroaFlip(flip);
    }, FRAME_MS);

    return () => clearInterval(interval);
  }, [isVisible, imageWidth, viewportWidth, isMobile]);

  if (!enabled || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        bottom: "-16px",
        left: `${ronoroaCenterX}px`,
        transform: `translateX(-50%) translateY(${ronoroaRiseY + bottomTrimPx}px)`,
        transition: "none",
        willChange: "transform",
      }}
    >
      <div
        style={{
          transform: `scaleX(${ronoroaFlip})`,
          transformOrigin: "center bottom",
          transition: "none",
          willChange: "transform",
          display: "inline-block",
        }}
      >
        <img
          ref={imageRef}
          src="/src/assets/images/ronoroa.png"
          alt="Zoro"
          className="h-48 sm:h-72 w-auto"
          style={{
            backfaceVisibility: "hidden",
            imageRendering: "auto",
            display: "block",
            maxWidth: "none",
          }}
          onError={(e) => {
            console.warn("Could not load ronoroa.png");
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
