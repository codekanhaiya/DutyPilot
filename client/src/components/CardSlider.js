import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CardSlider = ({ items = [], label = "Items" }) => {
  const scrollRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (!ref) return;
    ref.addEventListener("scroll", checkScroll);
    return () => ref.removeEventListener("scroll", checkScroll);
  }, [items]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -150 : 150;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Left Scroll Button */}
      <IconButton
        size="small"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        sx={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.1)",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      {/* Slider Content */}
      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          display: "flex",
          gap: 1,
          px: 4,
          py: 1,
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {items.length > 0 ? (
          items.map((item, i) => (
            <Typography
              key={i}
              fontSize={14}
              color="inherit"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </Typography>
          ))
        ) : (
          <Typography fontSize={14}>No {label.toLowerCase()}</Typography>
        )}
      </Box>

      {/* Right Scroll Button */}
      <IconButton
        size="small"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.1)",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default CardSlider;
