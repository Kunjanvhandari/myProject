"use client";
import { useRef } from "react";
import { Box, Card, CardContent, Chip, Typography, Rating, Button, IconButton } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

const MotionCard = motion(Card);

export default function BookCard({
  book,
  onReserve,
  onViewDetails,
  isAuthenticated,
  href,
  showBadge = true,
  showRating = true,
  showCategory = true,
  showPrice = false,
  showReserve = true,
  badgeColor = "#0EA5E9",
}) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const coverImage = book.coverImage || book.image || "/images/footer/book22.png";
  const title = book.title || "";
  const author = book.author || "";
  const category = book.category || "";
  const rating = book.rating || 0;
  const badge = book.badge || "";
  const price = book.price || "";
  const pages = book.pages || "";
  const availableCopies = book.availableCopies ?? 1;

  const handleClick = () => {
    if (href) return;
    if (onViewDetails) onViewDetails(book._id || book.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <MotionCard
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        sx={{
          borderRadius: "20px",
          background: "var(--card-bg, rgba(255,255,255,0.85))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid var(--card-border, rgba(255,255,255,0.7))",
          transition: "box-shadow 0.3s ease",
          cursor: href || onViewDetails ? "pointer" : "default",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          "&:hover": {
            boxShadow: "0 20px 60px rgba(14,165,233,0.15), 0 8px 24px rgba(0,0,0,0.1)",
          },
        }}
        onClick={handleClick}
      >
        {/* Image Container */}
        <Box sx={{ position: "relative", overflow: "hidden", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
          <Box
            component={motion.img}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            src={coverImage}
            alt={title}
            sx={{
              width: "100%",
              height: 220,
              objectFit: "contain",
              p: 2,
              bgcolor: "var(--img-bg, #FAFAFA)",
              transition: "background-color 0.3s ease",
            }}
          />
          {/* Gradient Overlay */}
          <Box sx={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.03) 100%)",
            pointerEvents: "none",
          }} />

          {/* Badge */}
          {showBadge && badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                position: "absolute", top: 12, right: 12,
                bgcolor: badgeColor,
                color: "#fff",
                fontWeight: 700,
                borderRadius: "8px",
                fontSize: "10px",
                px: 0.5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Category Chip */}
          {showCategory && category && (
            <Chip
              label={category}
              size="small"
              sx={{
                mb: 1,
                bgcolor: "var(--chip-bg, rgba(27,58,92,0.08))",
                color: "var(--chip-color, #1B3A5C)",
                fontWeight: 600,
                borderRadius: "6px",
                fontSize: "10px",
                alignSelf: "flex-start",
              }}
            />
          )}

          {/* Title */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary, #0F172A)",
              mb: 0.3,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>

          {/* Author */}
          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary, #888)", display: "block", mb: 1 }}
          >
            by {author}
          </Typography>

          {/* Rating */}
          {showRating && (
            <Rating
              value={rating}
              readOnly
              size="small"
              sx={{ color: "#0EA5E9", mb: 1.5 }}
            />
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Bottom Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            {/* Price / Pages */}
            <Box>
              {showPrice && price ? (
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary, #0F172A)" }}>
                  {price}
                </Typography>
              ) : pages ? (
                <Typography variant="body2" sx={{ color: "var(--text-secondary, #888)", fontSize: "13px" }}>
                  {pages} pages
                </Typography>
              ) : null}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {href ? (
                <Button
                  component={Link}
                  href={href}
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "12px",
                    px: 2,
                    background: "linear-gradient(135deg, #1E293B, #334155)",
                    "&:hover": { background: "linear-gradient(135deg, #334155, #475569)" },
                  }}
                >
                  View
                </Button>
              ) : onViewDetails ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onViewDetails(book._id || book.id); }}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "12px",
                    px: 2,
                    background: "linear-gradient(135deg, #1E293B, #334155)",
                    "&:hover": { background: "linear-gradient(135deg, #334155, #475569)" },
                  }}
                >
                  View
                </Button>
              ) : null}

              {showReserve && isAuthenticated && availableCopies > 0 && onReserve && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onReserve(book._id || book.id); }}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "12px",
                    minWidth: 70,
                    borderColor: "var(--border-color, #E0E0E0)",
                    color: "var(--text-secondary, #666)",
                  }}
                >
                  Reserve
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
