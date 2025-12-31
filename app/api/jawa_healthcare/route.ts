import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jawa");
    const collection = db.collection("healthcare");

    // Ambil dokumen pertama (dokumen raksasa yang Anda upload)
    const rawData = await collection.findOne({});

    if (!rawData) {
      return NextResponse.json({ type: "FeatureCollection", features: [] });
    }

    // Karena rawData sudah berisi { type: "FeatureCollection", features: [...] }
    // Kita langsung kirimkan saja, tapi hapus _id MongoDB-nya agar bersih
    const { _id, ...geoJson } = rawData as any;

    console.log(
      "Berhasil mengirim data:",
      geoJson.features?.length || 0,
      "features"
    );

    return NextResponse.json(geoJson);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch healthcare data" },
      { status: 500 }
    );
  }
}