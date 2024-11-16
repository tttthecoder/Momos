export const logoutApi = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BE_HOST + `/api/v1/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Error: HTTP ${response.status}, ${response.statusText}, Message: ${errorBody}`
    );
  }
  return true;
};
