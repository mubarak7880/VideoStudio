import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const serifFont = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
const sansFont = "'Montserrat', 'Segoe UI', 'Helvetica Neue', sans-serif";

const COLORS = {
  black: "#0D0D0D",
  gold: "#D4AF37",
  goldLight: "#F3E5AB",
  goldDark: "#9A7B1C",
  offWhite: "#FAF9F6",
};

interface PhotoSlideData {
  id: number;
  src: string;
  badgeText?: string;
  badgePos: "top" | "bottom";
  motionType: "zoom-in" | "pan-left" | "pan-right" | "zoom-out" | "tilt-zoom";
  collectionTag: string;
}

const PHOTO_SLIDES: PhotoSlideData[] = [
  {
    id: 1,
    src: "photos/1.jpeg",
    badgeText: "100% Cheveux Naturels",
    badgePos: "top",
    motionType: "zoom-in",
    collectionTag: "ÉDITION PRESTIGE • N°01",
  },
  {
    id: 2,
    src: "photos/2.jpeg",
    badgeText: "Lace Front Invisible",
    badgePos: "top",
    motionType: "pan-right",
    collectionTag: "ÉDITION PRESTIGE • N°02",
  },
  {
    id: 3,
    src: "photos/3.jpeg",
    badgeText: "Douceur & Volume",
    badgePos: "top",
    motionType: "zoom-out",
    collectionTag: "ÉDITION PRESTIGE • N°03",
  },
  {
    id: 4,
    src: "photos/4.jpeg",
    badgeText: "Boucles Haute Définition",
    badgePos: "top",
    motionType: "pan-left",
    collectionTag: "ÉDITION PRESTIGE • N°04",
  },
  {
    id: 5,
    src: "photos/5.jpeg",
    badgeText: "Texture Soyeuse & Dense",
    badgePos: "bottom",
    motionType: "tilt-zoom",
    collectionTag: "ÉDITION PRESTIGE • N°05",
  },
  {
    id: 6,
    src: "photos/6.jpeg",
    badgeText: "Bouncy Curly • Luxe",
    badgePos: "bottom",
    motionType: "zoom-in",
    collectionTag: "ÉDITION PRESTIGE • N°06",
  },
  {
    id: 7,
    src: "photos/7.jpeg",
    badgeText: "Maintien & Éclat Naturel",
    badgePos: "bottom",
    motionType: "pan-right",
    collectionTag: "ÉDITION PRESTIGE • N°07",
  },
  {
    id: 8,
    src: "photos/8.jpeg",
    badgeText: "Finition Baby Hair Parfaite",
    badgePos: "top",
    motionType: "zoom-out",
    collectionTag: "ÉDITION PRESTIGE • N°08",
  },
  {
    id: 9,
    src: "photos/9.jpeg",
    badgeText: "Longueur & Volume Royal",
    badgePos: "bottom",
    motionType: "pan-left",
    collectionTag: "ÉDITION PRESTIGE • N°09",
  },
  {
    id: 10,
    src: "photos/10.jpeg",
    badgeText: "Reflets Dorés & Soyeux",
    badgePos: "bottom",
    motionType: "zoom-in",
    collectionTag: "ÉDITION PRESTIGE • N°10",
  },
];

// Subtle ambient golden particles / luxury background wrapper
const AmbientLuxuryBackdrop: React.FC<{ bgImage?: string }> = ({ bgImage }) => {
  const frame = useCurrentFrame();
  const bgScale = interpolate(frame, [0, 60], [1.15, 1.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {bgImage && (
        <Img
          src={staticFile(bgImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(42px) brightness(0.28) saturate(1.25)",
            transform: `scale(${bgScale})`,
          }}
        />
      )}
      {/* Dark radial luxury vignette & gold ambient glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.14) 0%, rgba(13, 13, 13, 0.78) 55%, rgba(13, 13, 13, 0.96) 100%)",
        }}
      />
      {/* Outer ultra-thin champagne gold editorial border */}
      <div
        style={{
          position: "absolute",
          inset: 34,
          border: "1px solid rgba(212, 175, 55, 0.28)",
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Top persistent brand watermark during photo slides
const TopBrandHeader: React.FC<{ tag: string; index: number }> = ({
  tag,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 66,
        left: 68,
        right: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [-18, 0])}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: "rgba(13, 13, 13, 0.72)",
          border: "1px solid rgba(212, 175, 55, 0.45)",
          padding: "10px 22px",
          borderRadius: 999,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: COLORS.gold,
            boxShadow: `0 0 10px ${COLORS.gold}`,
          }}
        />
        <span
          style={{
            fontFamily: sansFont,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: COLORS.goldLight,
          }}
        >
          ARLY HAIR
        </span>
      </div>

      <div
        style={{
          fontFamily: sansFont,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "0.18em",
          color: "rgba(250, 249, 246, 0.8)",
          backgroundColor: "rgba(13, 13, 13, 0.65)",
          padding: "10px 20px",
          borderRadius: 999,
          border: "1px solid rgba(250, 249, 246, 0.15)",
        }}
      >
        {String(index).padStart(2, "0")} / 10
      </div>
    </div>
  );
};

// Animated Minimalist Luxury Badge
const LuxuryFeatureBadge: React.FC<{
  text: string;
  position: "top" | "bottom";
}> = ({ text, position }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  const shimmerX = interpolate(frame, [5, 42], [-120, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(position === "top" ? { top: 150 } : { bottom: 118 }),
        display: "flex",
        justifyContent: "center",
        zIndex: 25,
        opacity: interpolate(pop, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(
          pop,
          [0, 1],
          [position === "top" ? -24 : 24, 0]
        )}px) scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 34px",
          borderRadius: 999,
          backgroundColor: "rgba(13, 13, 13, 0.86)",
          border: `1.5px solid ${COLORS.gold}`,
          boxShadow:
            "0 14px 35px rgba(0, 0, 0, 0.65), 0 0 22px rgba(212, 175, 55, 0.25)",
        }}
      >
        {/* Subtle gold shimmer sweep across the badge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: shimmerX,
            width: 80,
            background:
              "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.28), transparent)",
            transform: "skewX(-25deg)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            color: COLORS.gold,
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        <span
          style={{
            fontFamily: sansFont,
            fontSize: 25,
            fontWeight: 600,
            color: COLORS.offWhite,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
        <span
          style={{
            color: COLORS.gold,
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
      </div>
    </div>
  );
};

// Individual Photo Scene Component
const PhotoScene: React.FC<{ slide: PhotoSlideData }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Smooth entrance spring for the luxury card
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.9 },
  });

  // Ken Burns / Dynamic motion inside the frame
  let imgScale = 1;
  let imgTranslateX = 0;
  let imgTranslateY = 0;

  if (slide.motionType === "zoom-in") {
    imgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (slide.motionType === "zoom-out") {
    imgScale = interpolate(frame, [0, durationInFrames], [1.09, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (slide.motionType === "pan-left") {
    imgScale = 1.05;
    imgTranslateX = interpolate(frame, [0, durationInFrames], [18, -18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (slide.motionType === "pan-right") {
    imgScale = 1.05;
    imgTranslateX = interpolate(frame, [0, durationInFrames], [-18, 18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (slide.motionType === "tilt-zoom") {
    imgScale = interpolate(frame, [0, durationInFrames], [1.01, 1.07], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    imgTranslateY = interpolate(frame, [0, durationInFrames], [12, -12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(cardSpring, [0, 1], [35, 0]);

  // Adjust vertical position of the main showcase frame so the top/bottom badge never overlaps the photo's yellow price tag
  const cardTop = slide.badgePos === "top" ? 255 : 165;
  const cardHeight = 1450;

  return (
    <AbsoluteFill>
      <AmbientLuxuryBackdrop bgImage={slide.src} />

      <TopBrandHeader tag={slide.collectionTag} index={slide.id} />

      {slide.badgeText && (
        <LuxuryFeatureBadge text={slide.badgeText} position={slide.badgePos} />
      )}

      {/* Main Luxury Framed Photo Container */}
      <div
        style={{
          position: "absolute",
          top: cardTop,
          left: 64,
          right: 64,
          height: cardHeight,
          borderRadius: 36,
          padding: 5,
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.95) 0%, rgba(243,229,171,0.4) 50%, rgba(212,175,55,0.9) 100%)",
          boxShadow:
            "0 30px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.22)",
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 31,
            overflow: "hidden",
            backgroundColor: "#121212",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Blurred background fill inside the card for square/portrait photos so there are never black bars */}
          <Img
            src={staticFile(slide.src)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(26px) brightness(0.45) saturate(1.2)",
              transform: "scale(1.15)",
            }}
          />

          {/* Crisp foreground product photo with Ken Burns motion - objectFit contain guarantees 100% visibility of hair & price tag */}
          <Img
            src={staticFile(slide.src)}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `scale(${imgScale}) translate(${imgTranslateX}px, ${imgTranslateY}px)`,
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.55))",
            }}
          />

          {/* Subtle luxury inner golden rim */}
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: 22,
              border: "1px solid rgba(212, 175, 55, 0.32)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Bottom progress bar indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 58,
          left: 120,
          right: 120,
          height: 4,
          backgroundColor: "rgba(250, 249, 246, 0.16)",
          borderRadius: 4,
          overflow: "hidden",
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(slide.id / 10) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.goldDark}, ${COLORS.gold}, ${COLORS.goldLight})`,
            borderRadius: 4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// 1. INTRO SCENE (0 to 1.5s = 48 frames)
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const titleSpring = spring({
    frame: frame - 7,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const subSpring = spring({
    frame: frame - 13,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  const lineExpand = interpolate(frame, [6, 30], [0, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background luxury golden radial aura */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.22) 0%, rgba(13, 13, 13, 0.92) 58%, #0D0D0D 100%)",
        }}
      />

      {/* Decorative outer luxury frame */}
      <div
        style={{
          position: "absolute",
          inset: 44,
          border: `1.5px solid rgba(212, 175, 55, 0.42)`,
          borderRadius: 32,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 58,
          border: `1px solid rgba(212, 175, 55, 0.18)`,
          borderRadius: 24,
        }}
      />

      {/* Center Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 70px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            padding: 6,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.goldDark} 100%)`,
            boxShadow: "0 20px 60px rgba(212, 175, 55, 0.28)",
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.7, 1])})`,
            opacity: interpolate(logoSpring, [0, 1], [0, 1]),
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("brand/logo_Arly_Hair.jpeg")}
              style={{
                width: "96%",
                height: "96%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Top small luxury overline */}
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.35em",
            color: COLORS.gold,
            textTransform: "uppercase",
            marginBottom: 22,
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          ✦ EXCLUSIVITÉ BEAUTÉ ✦
        </div>

        {/* Main Hook Title */}
        <h1
          style={{
            fontFamily: serifFont,
            fontSize: 72,
            fontWeight: 700,
            color: COLORS.offWhite,
            lineHeight: 1.12,
            letterSpacing: "0.03em",
            margin: 0,
            textShadow: "0 8px 30px rgba(0, 0, 0, 0.8)",
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          SUBLIMEZ
          <br />
          <span style={{ color: COLORS.gold }}>VOTRE STYLE</span>
        </h1>

        {/* Expanding Golden Line */}
        <div
          style={{
            width: lineExpand,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            marginTop: 34,
            marginBottom: 34,
          }}
        />

        {/* Subtitle pill */}
        <div
          style={{
            padding: "16px 42px",
            borderRadius: 999,
            backgroundColor: "rgba(212, 175, 55, 0.14)",
            border: `1.5px solid ${COLORS.gold}`,
            opacity: interpolate(subSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subSpring, [0, 1], [25, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: sansFont,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: COLORS.goldLight,
              textTransform: "uppercase",
            }}
          >
            NOUVELLE COLLECTION
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2. OUTRO / CALL TO ACTION SCENE (Last ~2.2 seconds = 69 frames)
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoPop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const textPop = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const ctaPop = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [1, 1.04]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background luxury golden radial aura */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(212, 175, 55, 0.25) 0%, rgba(13, 13, 13, 0.92) 60%, #0D0D0D 100%)",
        }}
      />

      {/* Double Golden Frame */}
      <div
        style={{
          position: "absolute",
          inset: 44,
          border: `1.5px solid rgba(212, 175, 55, 0.48)`,
          borderRadius: 32,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 58,
          border: `1px solid rgba(212, 175, 55, 0.2)`,
          borderRadius: 24,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 72px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: "50%",
            padding: 6,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.goldDark} 100%)`,
            boxShadow: "0 20px 60px rgba(212, 175, 55, 0.32)",
            transform: `scale(${interpolate(logoPop, [0, 1], [0.75, 1])})`,
            opacity: interpolate(logoPop, [0, 1], [0, 1]),
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("brand/logo_Arly_Hair.jpeg")}
              style={{
                width: "96%",
                height: "96%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Brand features */}
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: COLORS.gold,
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: interpolate(textPop, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(textPop, [0, 1], [20, 0])}px)`,
          }}
        >
          PERRUQUES & MÈCHES D&apos;EXCEPTION
        </div>

        {/* Main CTA Headline */}
        <h2
          style={{
            fontFamily: serifFont,
            fontSize: 60,
            fontWeight: 700,
            color: COLORS.offWhite,
            lineHeight: 1.18,
            margin: "0 0 42px 0",
            opacity: interpolate(textPop, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(textPop, [0, 1], [28, 0])}px)`,
          }}
        >
          Commandez la vôtre
          <br />
          <span style={{ color: COLORS.gold }}>dès maintenant</span>
        </h2>

        {/* Animated Call-to-Action Button */}
        <div
          style={{
            padding: "24px 52px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
            boxShadow: "0 16px 40px rgba(212, 175, 55, 0.4)",
            opacity: interpolate(ctaPop, [0, 1], [0, 1]),
            transform: `scale(${interpolate(ctaPop, [0, 1], [0.85, 1]) * pulse})`,
            marginBottom: 34,
          }}
        >
          <span
            style={{
              fontFamily: sansFont,
              fontSize: 30,
              fontWeight: 700,
              color: COLORS.black,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ✦ LIVRAISON DISPONIBLE ✦
          </span>
        </div>

        {/* Social / DM instruction */}
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 24,
            fontWeight: 500,
            color: "rgba(250, 249, 246, 0.85)",
            letterSpacing: "0.08em",
            opacity: interpolate(ctaPop, [0, 1], [0, 1]),
          }}
        >
          Contactez-nous en message privé (DM)
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Total duration calculation:
// Intro: 48 frames
// 10 photos: 56 frames each = 560 frames
// Outro: 69 frames
// 11 transitions of 9 frames each = -99 frames
// Total = 48 + 560 + 69 - 99 = 578 frames (~19.26 seconds at 30fps)
export const TOTAL_DURATION_IN_FRAMES = 578;

// Cut points (frames) where transitions occur for SFX synchronization:
// Scene 0 (Intro: 48) -> Transition 1 starts at 48 - 9 = 39
// Subsequent photo scenes (56 frames each, minus 9 frame overlap = +47 frames step):
// 39, 86, 133, 180, 227, 274, 321, 368, 415, 462, 509
const WHOOSH_FRAMES = [39, 86, 133, 180, 227, 274, 321, 368, 415, 462, 509];

export const ArlyHairReels: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {/* Background Instrumental Music (Afro-Chill / Fashion Lounge with afade) */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.85} />

      {/* Luxury Shimmer SFX on Intro and Outro */}
      <Sequence from={2} durationInFrames={35}>
        <Audio src={staticFile("audio/shimmer_luxe.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={512} durationInFrames={35}>
        <Audio src={staticFile("audio/shimmer_luxe.wav")} volume={0.45} />
      </Sequence>

      {/* Soft Whoosh SFX synchronized on transitions */}
      {WHOOSH_FRAMES.map((startFrame, idx) => (
        <Sequence
          key={`whoosh-${idx}`}
          from={startFrame}
          durationInFrames={15}
        >
          <Audio src={staticFile("audio/whoosh_soft.wav")} volume={0.35} />
        </Sequence>
      ))}

      {/* Main Visual Timeline with Smooth Transitions */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={48}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {PHOTO_SLIDES.map((photoItem, index) => {
          const transitionPresentation =
            index % 3 === 0
              ? fade()
              : index % 3 === 1
                ? slide({ direction: "from-right" })
                : slide({ direction: "from-left" });

          return (
            <React.Fragment key={photoItem.id}>
              <TransitionSeries.Transition
                presentation={transitionPresentation}
                timing={linearTiming({ durationInFrames: 9 })}
              />
              <TransitionSeries.Sequence durationInFrames={56}>
                <PhotoScene slide={photoItem} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 9 })}
        />
        <TransitionSeries.Sequence durationInFrames={69}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="PresentationPerruquesReels"
      component={ArlyHairReels}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
