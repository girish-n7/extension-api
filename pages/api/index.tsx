import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";

dotenv.config();

function POST(query: string) {
  // Initialize a text-generation stream using the Hugging Face Inference SDK

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Bearer: `${process.env.TOKEN}`,
    },
    body: JSON.stringify({ inputs: query }),
  };

  return fetch(
    "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    options
  );
}

export default function callAPI(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body as { query: string };
  POST(query)
    .then((response) => response.json())
    .then((response) => res.send(response))
    .catch((err) => console.error(err));
}
