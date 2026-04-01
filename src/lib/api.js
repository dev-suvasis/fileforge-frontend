const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const convertDoc = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch(`${BASE_URL}/docs/convert/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Conversion failed");
  }

  return await res.blob();
};

export const convertImage = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch(`${BASE_URL}/images/convert/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image conversion failed");
  }

  return await res.blob();
};

export const imageToPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/images/to-pdf/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image to PDF conversion failed");
  }

  return await res.blob();
};

export const pdfToImage = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch(`${BASE_URL}/images/pdf-to-image/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("PDF to Image conversion failed");
  }

  return await res.blob();
};

export const compressImage = async (file, level) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("level", level);

  const res = await fetch(`${BASE_URL}/images/compress/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image compression failed");
  }

  return await res.blob();
};