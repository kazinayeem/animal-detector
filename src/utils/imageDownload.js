export const downloadLabeledImage = (canvasRef) => {
  if (canvasRef.current) {
    const link = document.createElement("a");
    link.download = `detected-animals.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  }
};
