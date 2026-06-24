import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const maxResults = parseInt(searchParams.get("maxResults")) || 20;

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Search query is required" },
        { status: 400 }
      );
    }

    const startIndex = (page - 1) * maxResults;

    const googleApiUrl = new URL("https://www.googleapis.com/books/v1/volumes");
    googleApiUrl.searchParams.set("q", query);
    googleApiUrl.searchParams.set("startIndex", startIndex.toString());
    googleApiUrl.searchParams.set("maxResults", maxResults.toString());
    googleApiUrl.searchParams.set("langRestrict", "en");

    const response = await fetch(googleApiUrl.toString());

    if (!response.ok) {
      throw new Error("Google Books API request failed");
    }

    const data = await response.json();

    const books = (data.items || []).map((item) => {
      const volumeInfo = item.volumeInfo || {};
      const industryIdentifiers = volumeInfo.industryIdentifiers || [];
      const isbn =
        industryIdentifiers.find((id) => id.type === "ISBN_13")?.identifier ||
        industryIdentifiers.find((id) => id.type === "ISBN_10")?.identifier ||
        "";

      const authors = volumeInfo.authors || [];
      const author = authors.length > 0 ? authors.join(", ") : "Unknown";

      const thumbnail = volumeInfo.imageLinks?.thumbnail || "";
      const coverImage = volumeInfo.imageLinks?.smallThumbnail || thumbnail;

      const publishedDate = volumeInfo.publishedDate || "";
      const publishYear = publishedDate ? parseInt(publishedDate.split("-")[0]) || null : null;

      const categories = volumeInfo.categories || [];
      const category = categories.length > 0 ? categories[0] : "Other";

      return {
        id: item.id,
        googleId: item.id,
        title: volumeInfo.title || "Unknown Title",
        subtitle: volumeInfo.subtitle || "",
        author,
        authors,
        description: volumeInfo.description || "No description available.",
        isbn,
        isbn10: industryIdentifiers.find((id) => id.type === "ISBN_10")?.identifier || "",
        isbn13: industryIdentifiers.find((id) => id.type === "ISBN_13")?.identifier || "",
        category,
        categories,
        publisher: volumeInfo.publisher || "",
        publishYear,
        publishedDate,
        pages: volumeInfo.pageCount || 0,
        language: volumeInfo.language || "en",
        coverImage: coverImage.startsWith("//") ? `https:${coverImage}` : coverImage,
        thumbnail,
        previewLink: volumeInfo.previewLink || "",
        infoLink: volumeInfo.infoLink || "",
        rating: volumeInfo.averageRating || 0,
        ratingCount: volumeInfo.ratingsCount || 0,
        maturityRating: volumeInfo.maturityRating || "",
        saleability: item.saleInfo?.saleability || "NOT_FOR_SALE",
        listPrice: item.saleInfo?.listPrice?.amount || 0,
      };
    });

    return NextResponse.json({
      success: true,
      books,
      totalItems: data.totalItems || 0,
      pagination: {
        page,
        limit: maxResults,
        total: data.totalItems || 0,
        pages: Math.ceil((data.totalItems || 0) / maxResults),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch books from Google", error: error.message },
      { status: 500 }
    );
  }
}
