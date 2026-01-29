import { useEffect } from "react";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export const useCanvasDrawing = (result, canvasRef, image) => {
  useEffect(() => {
    if (result && canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        if (result.animals && result.animals.length > 0) {
          result.animals.forEach((animal, index) => {
            const color = COLORS[index % COLORS.length];

            // Check if bounding box exists and is valid
            if (animal.box_2d && animal.box_2d.length === 4) {
              const [ymin, xmin, ymax, xmax] = animal.box_2d;

              // Convert normalized (0-1000) coords to pixels
              const x = (xmin / 1000) * img.width;
              const y = (ymin / 1000) * img.height;
              const w = ((xmax - xmin) / 1000) * img.width;
              const h = ((ymax - ymin) / 1000) * img.height;

              // Draw Bounding Box
              ctx.strokeStyle = color;
              ctx.lineWidth = Math.max(3, Math.floor(img.width / 200));
              ctx.strokeRect(x, y, w, h);

              // Draw Label Background
              const text = animal.name.toUpperCase();
              const fontSize = Math.max(16, Math.floor(img.width / 40));
              ctx.font = `bold ${fontSize}px sans-serif`;
              const textMetrics = ctx.measureText(text);
              const padding = fontSize / 3;
              const textWidth = textMetrics.width + padding * 2;
              const textHeight = fontSize + padding * 2;

              // Ensure label stays within image bounds (roughly)
              let labelY = y - textHeight;
              if (labelY < 0) labelY = y; // If too high, put it inside/below top edge

              ctx.fillStyle = color;
              ctx.fillRect(x, labelY, textWidth, textHeight);

              // Draw Text
              ctx.fillStyle = "#FFFFFF";
              ctx.textBaseline = "top";
              ctx.fillText(text, x + padding, labelY + padding);
            } else {
              // Fallback if no box: List names at bottom left
              const text = animal.name.toUpperCase();
              const fontSize = Math.max(20, Math.floor(img.width / 30));
              ctx.font = `bold ${fontSize}px sans-serif`;
              ctx.fillStyle = "#FFFFFF";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 3;
              ctx.strokeText(
                text,
                20,
                img.height - 20 - index * fontSize * 1.2,
              );
              ctx.fillText(text, 20, img.height - 20 - index * fontSize * 1.2);
            }
          });
        }
      };

      img.src = image;
    }
  }, [result, image]);
};
