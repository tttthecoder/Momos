import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  dataViewConfigSelector,
  setDataViewConfig,
} from "@/redux/slices/dataViewConfigSlice";
import { useQuery } from "@tanstack/react-query";
import fetchPaginatedDataMedias from "@/app/api/getMedias";
import { MediaType } from "@/types";
import useDebounce from "@/app/hooks/useDebounce";

const PaginationComponent = () => {
  const { limit, page, filter } = useSelector(dataViewConfigSelector);
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useQuery({
    queryFn: async () =>
      await fetchPaginatedDataMedias({ limit, page, filter }),
    queryKey: ["medias", limit, page, filter],
    staleTime: Infinity,
  });

  const [url, setUrl] = useState("");
  const debouncedUrl = useDebounce(url, 400);

  useEffect(() => {
    debouncedUrl
      ? dispatch(
          setDataViewConfig({
            filter: { ...filter, siteUrl: debouncedUrl },
            page: 1,
          })
        )
      : dispatch(
          setDataViewConfig({
            filter: { ...filter, siteUrl: null },
            page: 1,
          })
        );
  }, [debouncedUrl]);

  const nextPage = () => dispatch(setDataViewConfig({ page: page + 1 }));
  const prevPage = () => dispatch(setDataViewConfig({ page: page - 1 }));
  const onTypeChange = (e: SelectChangeEvent<string>) => {
    dispatch(
      setDataViewConfig({
        filter: { ...filter, type: (e.target.value as MediaType) || null },
        page: 1,
      })
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: {
          xs: "column",
          md: "row",
        },

        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <TextField
          label="Site URL"
          size="small"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          variant="outlined"
        />
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filter?.type?.toString()}
          onChange={onTypeChange}
          label="Type"
        >
          <MenuItem value={undefined}>All</MenuItem>
          <MenuItem value="IMAGE">Image</MenuItem>
          <MenuItem value="VIDEO">Video</MenuItem>
        </Select>
      </FormControl>
      {/* Page Navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginLeft: { md: "auto" },
        }}
      >
        <Button
          variant="outlined"
          onClick={prevPage}
          disabled={page === 1 || isLoading || isError || !data?.payload}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page: {data?.payload.totalPages === 0 ? 0 : page}/
          {data?.payload.totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={nextPage}
          disabled={isLoading || isError || !data?.payload.hasNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
export default PaginationComponent;
