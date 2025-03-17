import React from 'react';

/**
 * Supported language types for syntax highlighting
 */
export type SupportedLanguages = 'json' | 'protobuf';

/**
 * Interface for language formatters
 * Each formatter needs to implement this interface
 */
export interface LanguageFormatter {
    /**
     * Format the provided code string with syntax highlighting
     * @param code The code string to format
     * @returns React nodes with syntax highlighting
     */
    format: (code: string) => React.ReactNode;
} 