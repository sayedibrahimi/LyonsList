export function getImageFormData(uri: string): FormData {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  
  // @ts-ignore - This is necessary for React Native FormData with images
  formData.append('images', {
    uri,
    name: filename,
    type,
  });
  
  return formData;
}

export function getFileExtension(uri: string): string {
  const uriParts = uri.split('.');
  return uriParts[uriParts.length - 1] || 'jpg';
}