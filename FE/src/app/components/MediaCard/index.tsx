import { MediaItem } from "@/types";
import { Typography, Box, Link, Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";

const MediaCard = ({ item }: { item: MediaItem }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      border: "1px solid #e0e0e0",

      borderRadius: 2,
      boxShadow: 1,
    }}
  >
    {item.type === "IMAGE" ? (
      <Box
        sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: "white" }}
      >
        <Image
          draggable={false}
          src={item.url}
          alt={item.title || ""}
          layout="fill"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/error.png"; // Fallback to error image
            (e.target as HTMLImageElement).style.objectFit = "contain";
          }}
          objectFit="cover"
        />
      </Box>
    ) : (
      <Box sx={{ position: "relative", aspectRatio: "16 / 9" }}>
        <video
          src={item.url}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
    )}
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      {item?.title && (
        <Tooltip title={item.title} arrow placement="bottom-start">
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.title}
          </Typography>
        </Tooltip>
      )}
      {item?.description && (
        <Tooltip title={item.title} arrow placement="bottom-start">
          <Typography
            variant="subtitle2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description}
          </Typography>
        </Tooltip>
      )}
      {item?.siteUrl && (
        <Link
          variant="subtitle2"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: "auto",
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
          href={item.siteUrl}
        >
          {item.siteUrl}
        </Link>
      )}
      <Typography variant="body2" color="textSecondary">
        Date fetched: {new Date(item.createdAt).toLocaleDateString()}
      </Typography>
    </Box>
  </Box>
);

export default MediaCard;
