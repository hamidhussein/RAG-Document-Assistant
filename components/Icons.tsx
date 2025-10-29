import React from 'react';

type IconProps = { className?: string };

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const PdfIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10l5 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm4 9a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" fill="#f87171" />
    </svg>
);

export const TxtIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10l5 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm4 8a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" fill="#60a5fa" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const BotIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 6l-1.06-1.06a1.5 1.5 0 010-2.12l1.06-1.06M15.75 13.5l1.06-1.06a1.5 1.5 0 000-2.12l-1.06-1.06M8.25 7.5v6M15.75 7.5v6m0 0a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25M15.75 13.5H8.25" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-.11.55.897.09 1.996-1.11 1.11-.542-.09-1.007-.56-1.11-1.11zM12 21.75v-3.75m0 0a3.75 3.75 0 00-3.75-3.75H4.5a3.75 3.75 0 00-3.75 3.75v3.75m11.25 0H19.5a3.75 3.75 0 003.75-3.75v-3.75a3.75 3.75 0 00-3.75-3.75h-3.75m-1.5-1.5-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v3.75m0 0-3.75 3.75M12 12.75l-3.75 3.75M12 12.75l3.75 3.75M12 12.75v-3.75m0 3.75c0-1.036-.426-1.99-1.125-2.665l-3.75-3.75c-.675-.675-1.63-.112-2.665-1.125m11.25 6.33c.675.675 1.63.112 2.665 1.125l3.75 3.75c.675.675 1.125 1.63 1.125 2.665" />
    </svg>
);

export const OpenAiIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 10.13C22.62 9.04 23 7.83 23 6.55A6.55 6.55 0 0016.45 0a6.55 6.55 0 00-6.55 6.55c0 1.28.38 2.49.72 3.58a6.55 6.55 0 00-6.44 5.34C1.38 16.56 0 18.53 0 20.81A3.19 3.19 0 003.19 24a3.19 3.19 0 003.19-3.19c0-1.1-.45-2.1-1.17-2.82A6.55 6.55 0 0011.55 13a6.55 6.55 0 006.44-5.34c2.81-1.05 4.91-3.15 5.29-4.53zM8.14 6.55A3.36 3.36 0 0111.5 3.19a3.36 3.36 0 013.36 3.36A3.36 3.36 0 0111.5 9.91a3.36 3.36 0 01-3.36-3.36zm10.5 9.54a3.19 3.19 0 01-3.19 3.19A3.19 3.19 0 0112.26 16.1a3.19 3.19 0 013.19-3.19c1.76 0 3.19 1.43 3.19 3.19z"/>
    </svg>
);

export const LlamaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 10H13v1.5h1.5V10zM21 15.5c0 1.18-.82 2.15-2 2.45v-1.14c.48-.25.8-.75.8-1.31s-.32-1.06-.8-1.31V12c1.18.3 2 1.27 2 2.45v1.05zM3 15.5c0-1.18.82-2.15 2-2.45v1.14c-.48.25-.8.75-.8 1.31s.32 1.06.8 1.31v1.14c-1.18-.3-2-1.27-2-2.45v-1.05zM12 11c-1.93 0-3.5 1.57-3.5 3.5S10.07 18 12 18s3.5-1.57 3.5-3.5S13.93 11 12 11zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5-3.5c-1.18-.3-2-1.27-2-2.45V9h1.5v1.5H8v.05c0 1.18.82 2.15 2 2.45zm10 0c1.18-.3 2-1.27 2-2.45V9h-1.5v1.5H16v.05c0 1.18-.82 2.15-2 2.45zM9.5 10H8v1.5h1.5V10zM12 4L9.5 9h5L12 4z"/>
    </svg>
);

export const ClaudeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,0,1-96,0Z" />
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);