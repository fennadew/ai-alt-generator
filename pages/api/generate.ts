import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request) {
  const data = await req.formData();
  const image = data.get("image") as Blob;
  const model = data.get("model") as string;

  try {
    const response = await Hf.imageToText({
      data: image,
      model: model,
    });
    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
