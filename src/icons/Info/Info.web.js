import React from 'react';

function Info(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <mask id="prefix__a" maskUnits="userSpaceOnUse" x={1} y={1} width={14} height={14}>
        <g clipPath="url(#prefix__clip0)" fill="#fff">
          <path d="M7.995 7.44c.307 0 .555.248.555.555v2.222a.555.555 0 11-1.11 0V7.995c0-.307.248-.555.555-.555zM7.995 5.218a.555.555 0 100 1.11h.006a.555.555 0 100-1.11h-.006z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.885 7.995a6.11 6.11 0 1112.22 0 6.11 6.11 0 01-12.22 0zm6.11-4.999a4.999 4.999 0 100 9.998 4.999 4.999 0 000-9.998z"
          />
        </g>
      </mask>
      <g mask="url(#prefix__a)">
        <path fill="#162F56" fillOpacity={0.38} d="M0 0h16v16H0z" />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path d="M1.33 1.33h13.33v13.33H1.33V1.33z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Info;
