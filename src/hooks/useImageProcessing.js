import { useState } from "react";

const apiKey = "AIzaSyBH_v7V999KRrohRadHKhyc-kOJn896UYk";

const API_PROMPT = `
  Analyze the uploaded image carefully. Detect ALL distinct animals present.
  For each animal, identify the species and estimate its location (bounding box).

  Return a strictly valid JSON object with this structure:
  {
    "animals": [
      {
        "name": "string (Common Name)",
        "confidence": number (0-100),
        "description": "string (Very short visual note, max 10 words)",
        "box_2d": [ymin, xmin, ymax, xmax] 
      }
    ]
  }
  
  Important Rules:
  - "box_2d" values must be integers from 0 to 1000 (normalized coordinates).
  - [ymin, xmin, ymax, xmax] means: top, left, bottom, right.
  - If no animals are found, return "animals": [].
  - If multiple animals are close, try to distinguish them.
`;

export const useImageProcessing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processFile = (file, setImage, setPreviewUrl, setResult) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 string
      setPreviewUrl(reader.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (image, setResult) => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: API_PROMPT },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0].content) {
        throw new Error("No analysis data received.");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(textResponse);

      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    processFile,
    analyzeImage,
  };
};
