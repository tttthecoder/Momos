export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BE_HOST + `/api/v1/auth/login`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData, 333);
      throw new Error(errorData.error || "Login failed. Please try again.");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during login.");
  }
};
