import { useState, useEffect } from 'react';

/**
 * Returns a preview URL for a file selected via react-hook-form watch().
 * Automatically revokes the object URL on cleanup / new selection.
 *
 * @param {FileList|File|string|null|undefined} fileValue - value from watch('fieldName')
 * @returns {string|null} preview URL or null
 */
export function useFilePreview(fileValue) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const file =
      fileValue instanceof FileList ? fileValue[0]
      : fileValue instanceof File   ? fileValue
      : null;

    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [fileValue]);

  return preview;
}
