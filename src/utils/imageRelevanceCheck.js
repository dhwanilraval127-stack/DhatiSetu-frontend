export const checkImageRelevance = async (imageData) => {
  const img = new Image();
  img.src = imageData;

  return new Promise((resolve) => {
    img.onload = () => {
      const isLargeEnough = img.width > 100 && img.height > 100;
      resolve(isLargeEnough); // Replace with real classifier later
    };
    img.onerror = () => resolve(false);
  });
};