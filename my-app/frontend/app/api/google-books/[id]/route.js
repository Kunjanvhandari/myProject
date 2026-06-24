import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    const googleApiUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;

    const response = await fetch(googleApiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: "Book not found" },
          { status: 404 }
        );
      }
      throw new Error("Google Books API request failed");
    }

    const item = await response.json();
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

    const book = {
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
      dimensions: volumeInfo.dimensions || {},
      printType: volumeInfo.printType || "",
      mainCategory: volumeInfo.mainCategory || "",
    };

    return NextResponse.json({ success: true, book });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch book from Google", error: error.message },
      { status: 500 }
    );
  }
}
