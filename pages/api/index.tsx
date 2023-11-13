import { HfInferenceEndpoint } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

// Create a new Hugging Face Inference instance
const endpointUrl =
  "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5";
const Hf = new HfInferenceEndpoint(endpointUrl, process.env.TOKEN);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export default async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  const response = await Hf.textGenerationStream({
    model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    inputs: `<|prompter|>${prompt}<|endoftext|><|assistant|>`,
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
