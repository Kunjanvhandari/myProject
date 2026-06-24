"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Slider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ChevronLeft,
  ChevronRight,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { playPageTurnSound } from "../lib/pageTurnSound";

const BookContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  userSelect: "none",

  "& .reader-header": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 10,
  },

  "& .book-stage": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    perspective: "2500px",
    overflow: "hidden",
    position: "relative",
    padding: "20px 0",
  },

  "& .book-container-3d": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transformStyle: "preserve-3d",
    transform: "rotateY(0deg) rotateX(2deg)",
    transition: "transform 0.3s ease",
  },

  "& .book-spine": {
    position: "absolute",
    left: "-18px",
    top: "0",
    bottom: "0",
    width: "18px",
    background: "linear-gradient(90deg, #2c1810, #4a2818, #2c1810)",
    borderRadius: "3px 0 0 3px",
    transformOrigin: "right center",
    zIndex: 5,
    boxShadow: "-4px 0 15px rgba(0,0,0,0.4)",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "10%",
      bottom: "10%",
      left: "4px",
      right: "4px",
      borderLeft: "1px solid rgba(255,255,255,0.05)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
    },
  },

  "& .book-page-edges": {
    position: "absolute",
    right: "-6px",
    top: "2px",
    bottom: "2px",
    width: "6px",
    background: "linear-gradient(90deg, #f5f0e8, #e8e0d0)",
    borderRadius: "0 2px 2px 0",
    zIndex: 3,
    transform: "rotateY(0deg)",
    boxShadow: "3px 0 8px rgba(0,0,0,0.15)",
  },

  "& .page-area": {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 4,
    background: "#faf6f0",
    borderRadius: "2px",
    boxShadow: "0 4px 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.03)",
  },

  "& .page-wrapper": {
    position: "relative",
    overflow: "hidden",
    background: "#faf6f0",
    transformStyle: "preserve-3d",
    transformOrigin: "left center",
    willChange: "transform",
  },

  "& .page-wrapper.flip-forward": {
    animation: "flipForward 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    transformOrigin: "left center",
  },

  "& .page-wrapper.flip-back": {
    animation: "flipBack 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    transformOrigin: "right center",
  },

  "@keyframes flipForward": {
    "0%": {
      transform: "rotateY(0deg) scaleX(1)",
    },
    "100%": {
      transform: "rotateY(-180deg) scaleX(1)",
    },
  },

  "@keyframes flipBack": {
    "0%": {
      transform: "rotateY(0deg) scaleX(1)",
    },
    "100%": {
      transform: "rotateY(180deg) scaleX(1)",
    },
  },

  "& .nav-button": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    bgcolor: "rgba(0,0,0,0.4)",
    color: "#fff",
    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
    width: 52,
    height: 52,
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  "& .book-shadow-left": {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "-40px",
    width: "80px",
    pointerEvents: "none",
    zIndex: 2,
    background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
  },

  "& .book-shadow-right": {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: "-40px",
    width: "80px",
    pointerEvents: "none",
    zIndex: 2,
    background: "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",
  },

  "& .book-bottom-shadow": {
    position: "absolute",
    bottom: "-15px",
    left: "-10%",
    right: "-10%",
    height: "30px",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 1,
  },
}));

const PdfPage = React.memo(({ pdfUrl, pageNumber, scale, pageWidth, onLoadSuccess, onLoadError }) => (
  <Document
    file={pdfUrl}
    onLoadSuccess={onLoadSuccess}
    onLoadError={onLoadError}
    loading={null}
    error={null}
    key={pageNumber}
  >
    <Page
      pageNumber={pageNumber}
      scale={scale}
      devicePixelRatio={2}
      renderTextLayer={false}
      renderAnnotationLayer={false}
      width={pageWidth}
    />
  </Document>
));

export default function PdfBookReader({ pdfUrl, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(null);
  const [stageWidth, setStageWidth] = useState(0);
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const stablePdfUrl = useMemo(() => pdfUrl, [pdfUrl]);

  useEffect(() => {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    } catch (e) {
      console.error("Failed to set PDF worker:", e);
    }
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF load error:", err?.message || err);
    setLoading(false);
    setError("Failed to load the PDF. The file may be unavailable, corrupted, or blocked by the browser.");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("PDF loading timed out. The file may be too large or the server may be unavailable.");
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [loading]);

  const goToPage = useCallback(
    (page) => {
      if (flipping) return;
      const target = Math.max(1, Math.min(page, numPages || 1));
      if (target === pageNumber) return;
      const dir = target > pageNumber ? "forward" : "back";
      setFlipDir(dir);
      setFlipping(true);
      setTimeout(() => {
        setPageNumber(target);
        setFlipping(false);
        setFlipDir(null);
      }, 350);
    },
    [pageNumber, numPages, flipping]
  );

  const nextPage = useCallback(() => {
    if (pageNumber >= (numPages || 1)) return;
    playPageTurnSound();
    goToPage(pageNumber + 1);
  }, [pageNumber, numPages, goToPage]);

  const prevPage = useCallback(() => {
    if (pageNumber <= 1) return;
    playPageTurnSound();
    goToPage(pageNumber - 1);
  }, [pageNumber, goToPage]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.4));

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        nextPage();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  const handlePageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.5) {
      nextPage();
    } else {
      prevPage();
    }
  };

  const flipClass =
    flipping && flipDir === "forward"
      ? "flip-forward"
      : flipping && flipDir === "back"
      ? "flip-back"
      : "";

  const baseFitWidth = stageWidth ? Math.max(300, stageWidth - 160) : 700;
  const pageWidth = Math.min(baseFitWidth, 2000);

  return (
    <BookContainer ref={containerRef}>
      <Box className="reader-header">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#fff",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "300px",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={zoomOut} sx={{ color: "#fff" }} size="small">
            <ZoomOut />
          </IconButton>
          <Typography variant="caption" sx={{ color: "#aaa", minWidth: 40, textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton onClick={zoomIn} sx={{ color: "#fff" }} size="small">
            <ZoomIn />
          </IconButton>

          <IconButton onClick={toggleFullscreen} sx={{ color: "#fff" }} size="small">
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
      </Box>

      <Box ref={stageRef} className="book-stage">
        <Box className="book-shadow-left" />
        <Box className="book-shadow-right" />
        <Box className="book-bottom-shadow" />

        <Box className="book-container-3d">
          <Box className="book-spine" />

          <IconButton
            className="nav-button"
            onClick={prevPage}
            disabled={pageNumber <= 1 || flipping}
            sx={{ left: { xs: -12, md: -20 } }}
          >
            <ChevronLeft sx={{ fontSize: 32 }} />
          </IconButton>

          <Box
            className="page-area"
            onClick={handlePageClick}
            sx={{
              width: pageWidth,
              mx: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <CircularProgress sx={{ color: "#2E7D32" }} />
                <Typography sx={{ color: "#888" }}>Loading book...</Typography>
              </Box>
            )}

            {error ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 4, textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "#ff6b6b", mb: 1 }}>
                  Unable to Load PDF
                </Typography>
                <Typography sx={{ color: "#ccc", maxWidth: 400 }}>
                  {error}
                </Typography>
              </Box>
            ) : (
              <Box className={`page-wrapper ${flipClass}`} sx={{ width: "100%" }}>
                <PdfPage
                  pdfUrl={stablePdfUrl}
                  pageNumber={pageNumber}
                  scale={scale}
                  pageWidth={pageWidth}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                />
              </Box>
            )}
          </Box>

          <Box className="book-page-edges" />

          <IconButton
            className="nav-button"
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1) || flipping}
            sx={{ right: { xs: -12, md: -20 } }}
          >
            <ChevronRight sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          px: 4,
          py: 2,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="body2" sx={{ color: "#aaa", whiteSpace: "nowrap" }}>
          Page {pageNumber} of {numPages || "?"}
        </Typography>

        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <Slider
            value={pageNumber}
            min={1}
            max={numPages || 1}
            onChange={(_, v) => {
              playPageTurnSound();
              goToPage(v);
            }}
            sx={{
              color: "#fff",
              "& .MuiSlider-thumb": { width: 14, height: 14 },
              "& .MuiSlider-rail": { bgcolor: "rgba(255,255,255,0.2)" },
              "& .MuiSlider-track": { bgcolor: "#fff" },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            onClick={prevPage}
            disabled={pageNumber <= 1 || flipping}
            sx={{ color: "#fff" }}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              minWidth: 60,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            {pageNumber} / {numPages || "?"}
          </Typography>
          <IconButton
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1) || flipping}
            sx={{ color: "#fff" }}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </BookContainer>
  );
}
