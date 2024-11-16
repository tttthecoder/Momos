import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setAuthState } from "@/redux/slices/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "@/app/api/logout";
import { useRouter } from "next/navigation";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { toast } from "sonner";
import { scrape } from "@/app/api/scrape";
import { isValidUrl } from "@/app/utils/helpers";

export default function TopBar() {
  const { token, username } = useSelector(authSelector);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => logoutApi(token),
    onSuccess: () => {
      // Handle successful logout, should toast here!
      console.log("Logged out successfully!");
      dispatch(setAuthState({ token: "", username: null }));
    },
    onError: (error: any) => {
      // Handle error during logout, should toast here !
      console.error("Logout failed:", error);
    },
  });

  const handleLoginClick = () => {
    router.push("/signup-login");
  };
  const handleRegisterClick = () => {
    router.push("/signup-login");
  };

  const [urlScrape, setUrlScrape] = useState("");
  const scrapMutation = useMutation({
    mutationFn: () => scrape(urlScrape, token),
    onSuccess: () => {
      setTimeout(
        () => queryClient.invalidateQueries({ queryKey: ["medias"] }),
        // Server should done the work after this time has passed
        // Ideally we should set up a subscription for this to know if the scraper has finished
        10000
      );
    },
  });
  const handleSubmit = async () => {
    if (!isValidUrl(urlScrape)) {
      toast.error("Invalid URL");
      setUrlScrape("");
      return;
    }

    try {
      await scrapMutation.mutateAsync();
      toast.success("Server is on the work!");
    } catch (error) {
      toast.error("Some thing went wrong!");
    } finally {
      setUrlScrape("");
    }
  };
  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Typography
          variant="h6"
          component="div"
          onClick={() => {
            router.push("/");
          }}
          sx={{ fontWeight: "bold", cursor: "pointer" }}
        >
          Scraper Demo
        </Typography>
        {token && (
          <Box
            sx={{
              flexGrow: 1,
              marginLeft: { xs: "unset", md: "auto" },
              marginRight: { xs: "unset", md: "auto" },
              maxWidth: { xs: "unset", md: 360 },
              alignSelf: { xs: "stretch", md: "center" },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Enter a web page url to scrape"
              value={urlScrape}
              onChange={(e) => setUrlScrape(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "white", // Ensures a clean white background
                borderRadius: 1, // Slightly rounded corners
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#00796b", // Set the border color to match the theme
                  },
                  "&:hover fieldset": {
                    borderColor: "#004d40", // Darker shade on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#004d40", // Focused state with dark border
                  },
                },
              }}
              // Smaller size to fit in compact areas
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        sx={{
                          color: "skyblue", // Adjust this color for the icon
                        }}
                        disabled={scrapMutation.isPending}
                        onClick={handleSubmit}
                      >
                        {scrapMutation.isPending ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "skyblue" }}
                          />
                        ) : (
                          <Send />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        )}
        {token ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {` Welcome, ${username}`}
            </Typography>
            <IconButton
              color="inherit"
              onClick={(e) => mutation.mutate()}
              disabled={mutation.isPending}
              //  todos: need to style here to relect pending state
              aria-label="logout"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginLeft: { md: "auto", xs: "unset" },
            }}
          >
            <Button
              color="inherit"
              onClick={handleLoginClick}
              startIcon={<AccountCircle />}
              //  todos: need to style here to relect pending state
            >
              Login
            </Button>
            <Button
              //  todos: need to style here to relect pending state
              color="inherit"
              onClick={handleRegisterClick}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
