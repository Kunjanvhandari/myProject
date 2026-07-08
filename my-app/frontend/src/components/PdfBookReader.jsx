"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Box, Typography, IconButton, Slider, CircularProgress, Tooltip } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft, ChevronRight,
  Fullscreen, FullscreenExit,
  ZoomIn, ZoomOut,
  DarkMode, LightMode,
  TextIncrease, TextDecrease,
  MenuBook,
} from "@mui/icons-material";
import { playPageTurnSound } from "../lib/pageTurnSound";

const BOOK_BG_LIGHT = "#fdfaf3";
const BOOK_BG_DARK = "#2c2c2c";
const PAPER_LIGHT = "#fdfaf3";
const PAPER_DARK = "#3a3a3a";
const TEXT_LIGHT = "#1a1a1a";
const TEXT_DARK = "#e0e0e0";

export default function PdfBookReader({ pdfUrl, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showControls, setShowControls] = useState(true);
  const [isTwoPage, setIsTwoPage] = useState(true);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const documentRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const stablePdfUrl = useMemo(() => pdfUrl, [pdfUrl]);
  const numPagesRef = useRef(null);
  const pageNumberRef = useRef(1);

  useEffect(() => {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    } catch (e) {
      console.error("Failed to set PDF worker:", e);
    }
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      setIsTwoPage(window.innerWidth >= 900);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bookReader_darkMode");
    if (saved === "true") setDarkMode(true);
    const savedFont = localStorage.getItem("bookReader_fontSize");
    if (savedFont) setFontSize(parseInt(savedFont, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookReader_darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("bookReader_fontSize", fontSize.toString());
  }, [fontSize]);

  const onDocumentLoadSuccess = useCallback(({ numPages: pages }) => {
    numPagesRef.current = pages;
    setNumPages(pages);
    setLoading(false);

    const saved = localStorage.getItem(`book_pos_${stablePdfUrl}`);
    if (saved) {
      const pos = parseInt(saved, 10);
      if (pos >= 1 && pos <= pages) {
        setPageNumber(pos);
        pageNumberRef.current = pos;
      }
    }
  }, [stablePdfUrl]);

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF load error:", err);
    setLoading(false);
    setError("Failed to load the PDF. The file may be unavailable or corrupted.");
  }, []);

  const savePosition = useCallback((page) => {
    try {
      localStorage.setItem(`book_pos_${stablePdfUrl}`, page.toString());
    } catch (e) { /* ignore */ }
  }, [stablePdfUrl]);

  const goToPage = useCallback((page) => {
    if (!numPagesRef.current) return;
    const target = Math.max(1, Math.min(page, numPagesRef.current));
    if (target === pageNumberRef.current) return;
    setPageNumber(target);
    pageNumberRef.current = target;
    savePosition(target);
  }, [savePosition]);

  const nextPage = useCallback(() => {
    if (!numPagesRef.current || pageNumberRef.current >= numPagesRef.current) return;
    playPageTurnSound();
    goToPage(pageNumberRef.current + 1);
  }, [goToPage]);

  const prevPage = useCallback(() => {
    if (pageNumberRef.current <= 1) return;
    playPageTurnSound();
    goToPage(pageNumberRef.current - 1);
  }, [goToPage]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.4)), []);

  const fontSizeUp = useCallback(() => setFontSize((s) => Math.min(s + 2, 32)), []);
  const fontSizeDown = useCallback(() => setFontSize((s) => Math.max(s - 2, 10)), []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
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

  const handleStageClick = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.5) {
      nextPage();
    } else {
      prevPage();
    }
  }, [nextPage, prevPage]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
    };
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(controlsTimerRef.current);
    };
  }, []);

  const pageWidth = isTwoPage ? 400 : 500;

  const bgColor = darkMode ? BOOK_BG_DARK : BOOK_BG_LIGHT;
  const paperColor = darkMode ? PAPER_DARK : PAPER_LIGHT;
  const textColor = darkMode ? TEXT_DARK : TEXT_LIGHT;

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: bgColor,
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease",
        position: "relative",
      }}
    >
      {/* Header Controls */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          bgcolor: darkMode ? "rgba(44,44,44,0.95)" : "rgba(253,250,243,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          transform: showControls ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <MenuBook sx={{ color: darkMode ? "#aaa" : "#666", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{
              color: textColor,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: 120, sm: 200, md: 350 },
              fontSize: "0.9rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Zoom Out">
            <IconButton onClick={zoomOut} size="small" sx={{ color: textColor }}>
              <ZoomOut fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ color: textColor, minWidth: 36, textAlign: "center", fontSize: "0.75rem", opacity: 0.7 }}>
            {Math.round(scale * 100)}%
          </Typography>
          <Tooltip title="Zoom In">
            <IconButton onClick={zoomIn} size="small" sx={{ color: textColor }}>
              <ZoomIn fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 1, height: 24, bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", mx: 1 }} />

          <Tooltip title="Decrease Font Size">
            <IconButton onClick={fontSizeDown} size="small" sx={{ color: textColor }}>
              <TextDecrease fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ color: textColor, minWidth: 24, textAlign: "center", fontSize: "0.75rem", opacity: 0.7 }}>
            {fontSize}
          </Typography>
          <Tooltip title="Increase Font Size">
            <IconButton onClick={fontSizeUp} size="small" sx={{ color: textColor }}>
              <TextIncrease fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 1, height: 24, bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", mx: 1 }} />

          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleDarkMode} size="small" sx={{ color: textColor }}>
              {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton onClick={toggleFullscreen} size="small" sx={{ color: textColor }}>
              {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Book Stage */}
      <Box
        ref={stageRef}
        onClick={handleStageClick}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 8, md: 10 },
          pb: 10,
          px: 2,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress sx={{ color: darkMode ? "#aaa" : "#666" }} size={40} />
            <Typography sx={{ color: darkMode ? "#888" : "#999", fontSize: "0.9rem" }}>Loading book...</Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <Typography variant="h6" sx={{ color: "#ef4444", mb: 1, fontWeight: 600 }}>Unable to Load PDF</Typography>
            <Typography sx={{ color: darkMode ? "#aaa" : "#666" }}>{error}</Typography>
          </Box>
        )}

        {!loading && !error && (
          <Document
            file={stablePdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
          >
            {/* Two-page spread or single page */}
            <Box
              sx={{
                display: "flex",
                gap: 0,
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: darkMode
                  ? "0 8px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)"
                  : "0 8px 60px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Left page (even) */}
              {isTwoPage && pageNumber > 1 && (
                <Box sx={{ position: "relative" }}>
                  <Page
                    pageNumber={pageNumber - 1}
                    scale={scale}
                    width={pageWidth}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    loading={null}
                  />
                </Box>
              )}

              {/* Spine effect between pages */}
              {isTwoPage && pageNumber > 1 && pageNumber <= numPages && (
                <Box
                  sx={{
                    width: "12px",
                    minHeight: "100%",
                    background: darkMode
                      ? "linear-gradient(to right, #2a2a2a, #3a3a3a, #333)"
                      : "linear-gradient(to right, #e8e0d0, #f0e8d8, #e8e0d0)",
                    boxShadow: darkMode
                      ? "inset 2px 0 4px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.3)"
                      : "inset 2px 0 4px rgba(0,0,0,0.05), inset -2px 0 4px rgba(0,0,0,0.05)",
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Right page (current/odd) */}
              <Box sx={{ position: "relative" }}>
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  width={pageWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  loading={null}
                />
              </Box>
            </Box>
          </Document>
        )}
      </Box>

      {/* Side Navigation Buttons */}
      {!loading && !error && (
        <>
          <IconButton
            onClick={prevPage}
            disabled={pageNumber <= 1}
            sx={{
              position: "fixed",
              left: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
              bgcolor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              color: textColor,
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              opacity: showControls ? 1 : 0,
              transition: "opacity 0.3s ease, background-color 0.2s ease",
              "&:hover": { bgcolor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" },
              "&.Mui-disabled": { opacity: 0.2 },
            }}
          >
            <ChevronLeft fontSize={isTwoPage ? "large" : "medium"} />
          </IconButton>

          <IconButton
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            sx={{
              position: "fixed",
              right: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
              bgcolor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              color: textColor,
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              opacity: showControls ? 1 : 0,
              transition: "opacity 0.3s ease, background-color 0.2s ease",
              "&:hover": { bgcolor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" },
              "&.Mui-disabled": { opacity: 0.2 },
            }}
          >
            <ChevronRight fontSize={isTwoPage ? "large" : "medium"} />
          </IconButton>
        </>
      )}

      {/* Bottom Bar */}
      {!loading && !error && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            bgcolor: darkMode ? "rgba(44,44,44,0.95)" : "rgba(253,250,243,0.95)",
            backdropFilter: "blur(12px)",
            borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            transform: showControls ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            px: { xs: 2, md: 4 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={prevPage}
              disabled={pageNumber <= 1}
              size="small"
              sx={{ color: textColor }}
            >
              <ChevronLeft />
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                color: textColor,
                fontFamily: "'Georgia', serif",
                minWidth: 80,
                textAlign: "center",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {pageNumber} / {numPages || "?"}
            </Typography>

            <IconButton
              onClick={nextPage}
              disabled={pageNumber >= (numPages || 1)}
              size="small"
              sx={{ color: textColor }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, maxWidth: 400, mx: 2 }}>
            <Slider
              value={pageNumber}
              min={1}
              max={numPages || 1}
              onChange={(_, v) => {
                playPageTurnSound();
                goToPage(v);
              }}
              sx={{
                color: darkMode ? "#aaa" : "#555",
                "& .MuiSlider-thumb": { width: 14, height: 14 },
                "& .MuiSlider-rail": { bgcolor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" },
                "& .MuiSlider-track": { bgcolor: darkMode ? "#aaa" : "#555" },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
