const apiKey = "";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const imgApiPerson = "https://image.tmdb.org/t/p/w235_and_h235_face";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export { apiKey, imgApi, imgApiPerson, fetchData };