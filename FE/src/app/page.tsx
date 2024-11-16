"use client";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { dataViewConfigSelector } from "@/redux/slices/dataViewConfigSlice";
import fetchPaginatedData from "./api/getMedias";
import React, { ReactNode } from "react";
import MediaCard from "./components/MediaCard";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import PaginationComponent from "./components/Pagination";

export default function Home() {
  const { limit, page, filter } = useSelector(dataViewConfigSelector);
  const theme = useTheme();
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await fetchPaginatedData({ limit, page, filter }),
    queryKey: ["medias", limit, page, filter], //Array according to Documentation
    staleTime: Infinity,
  });

  var content: ReactNode;

  if (isLoading) {
    content = (
      <CircularProgress
        color="primary"
        size={60}
        thickness={2}
        sx={{
          marginTop: 16,
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
        }}
      />
    );
  } else if (isError || !data?.payload) {
    content = (
      <Typography
        variant="h6"
        color="error"
        sx={{
          marginTop: 16,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
      >
        Oops! Something went wrong.
      </Typography>
    );
  } else if (data.payload.content.length) {
    content = (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            width: "100%",
          }}
        >
          {data.payload.content.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </Box>
      </Box>
    );
  } else {
    content = (
      <Typography variant="h6" align="center" sx={{ color: "gray", mt: 4 }}>
        No media available at the moment. Please try again later!
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[100],
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4, pt: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: theme.palette.grey[800],
          }}
          gutterBottom
        >
          Media Scraper
        </Typography>
        <Typography variant="h5" sx={{ color: "gray" }}>
          See What Is On The Web
        </Typography>
      </Box>
      <PaginationComponent></PaginationComponent>
      {content}
    </Box>
  );
}
