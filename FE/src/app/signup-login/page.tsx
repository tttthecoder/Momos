"use client";

import React, { useState } from "react";
import { TextField, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/login";
import { register } from "../api/signup";
import { setAuthState } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  //  I would use React Hook Form and zod for validation here if i had more time
  const [formData, setFormData] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    onSuccess: (data: any) => {
      dispatch(
        setAuthState({
          token: data.payload.token.accessToken,
          username: formData.email,
        })
      );
    },
    mutationFn: () => login({ ...formData }),
  });
  const registerMutation = useMutation({
    mutationFn: () => register({ ...formData }),
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFormData({ email: "", password: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.warning("Please fill in all fields.");
      return;
    }
    try {
      activeTab === 0
        ? await loginMutation.mutateAsync()
        : await registerMutation.mutateAsync();

      toast.success(activeTab === 0 ? "Login" : "Register" + " Sucess");
      activeTab === 0 && router.push("/");
    } catch (error: any) {
      // will need to handle errors more properly
      console.log(error?.message);
      toast.error(error?.message || "Some thing went wrong!");
    } finally {
      setFormData({ password: "", email: "" });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 16,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {activeTab === 0 ? "Login" : "Register"}
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loginMutation.isPending || registerMutation.isPending}
          sx={{
            marginTop: 2,
            padding: 1,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#155a9c",
            },
          }}
        >
          {loginMutation.isPending || registerMutation.isPending
            ? "Submitting..."
            : activeTab === 0
            ? "Login"
            : "Register"}
        </Button>
      </Box>
    </Box>
  );
}
