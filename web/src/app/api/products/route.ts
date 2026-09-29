import { NextResponse } from "next/server";
import { PRODUCTS, getProductsByCategory, searchProducts, PRODUCT_CATEGORIES } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    let products = PRODUCTS;

    if (search) {
      products = searchProducts(search);
    } else if (category && category !== "All Products") {
      products = getProductsByCategory(category);
    }

    return NextResponse.json({
      success: true,
      total: products.length,
      categories: Array.from(PRODUCT_CATEGORIES),
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
