export const register = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BE_HOST + `/api/v1/auth/register`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Check if the response status is OK (status code 200)
    if (!response.ok) {
      // If response is not OK, throw an error with the status text or custom message
      const errorData = await response.json();
      // we will need to handle error more properly based on BE error design!
      throw new Error("Register failed. Please try again.");
    }

    // If the response is OK, return the data
    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    // Handle errors, return a custom error message or rethrow it
    throw new Error(error.message || "An error occurred during register.");
  }
};
