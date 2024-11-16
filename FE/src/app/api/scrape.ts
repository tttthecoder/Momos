export const scrape = async (url: string, token: string) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BE_HOST + `/api/v1/scrape/scrape`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ url }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Scrape failed. Please try again.");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    throw new Error(error.message || "Scrape failed. Please try again.");
  }
};
