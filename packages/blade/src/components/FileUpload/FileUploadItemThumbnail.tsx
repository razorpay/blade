import { useState } from 'react';
import type { InternalFileUploadItemSize } from './types';
import { fileUploadThumbnailSizeTokens } from './fileUploadTokens';
import { makeSize } from '~utils';

type FileUploadItemThumbnailProps = {
  thumbnail: string | React.ReactNode;
  size: InternalFileUploadItemSize;
  fallback: React.ReactNode;
};

const thumbnailBorderRadius: Record<string, string> = {
  small: '2px',
  medium: '4px',
  large: '4px',
  variable: '4px',
};

const FileUploadItemThumbnail = ({
  thumbnail,
  size,
  fallback,
}: FileUploadItemThumbnailProps): React.ReactElement => {
  const [hasError, setHasError] = useState(false);
  const dimension = makeSize(fileUploadThumbnailSizeTokens[size === 'variable' ? 'large' : size]);
  const borderRadius = thumbnailBorderRadius[size];

  if (hasError) {
    return <>{fallback}</>;
  }

  if (typeof thumbnail === 'string') {
    return (
      <img
        src={thumbnail}
        alt=""
        onError={() => setHasError(true)}
        style={{
          width: dimension,
          height: dimension,
          objectFit: 'cover',
          borderRadius,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {thumbnail}
    </div>
  );
};

export { FileUploadItemThumbnail };
export type { FileUploadItemThumbnailProps };
