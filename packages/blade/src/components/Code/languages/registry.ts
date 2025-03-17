// Interface for language configuration
export interface LanguageConfig {
    /**
     * The language name
     */
    name: string;

    /**
     * The language alias (used for CSS classes)
     */
    alias: string;

    /**
     * Function to load the language definition
     */
    load: () => Promise<void>;

    /**
     * Whether the language is loaded
     */
    isLoaded: boolean;
}

/**
 * Registry of supported languages
 */
class LanguageRegistry {
    private languages: Map<string, LanguageConfig> = new Map();

    /**
     * Register a new language
     * @param config Language configuration
     */
    register(config: LanguageConfig): void {
        this.languages.set(config.name, config);

        // Register aliases if different from name
        if (config.alias && config.alias !== config.name) {
            this.languages.set(config.alias, config);
        }
    }

    /**
     * Get a language configuration
     * @param language Language name or alias
     * @returns Language configuration or undefined if not found
     */
    get(language: string): LanguageConfig | undefined {
        return this.languages.get(language);
    }

    /**
     * Check if a language is supported
     * @param language Language name or alias
     * @returns Whether the language is supported
     */
    isSupported(language: string): boolean {
        return this.languages.has(language);
    }

    /**
     * Load a language definition
     * @param language Language name or alias
     * @returns Promise that resolves when the language is loaded
     */
    async loadLanguage(language: string): Promise<void> {
        const config = this.get(language);

        if (!config) {
            throw new Error(`Language '${language}' is not supported`);
        }

        if (!config.isLoaded) {
            await config.load();
            config.isLoaded = true;
        }
    }

    /**
     * Get all supported languages
     * @returns Array of language names
     */
    getSupportedLanguages(): string[] {
        // Return unique language names (not aliases)
        return Array.from(new Set(
            Array.from(this.languages.values()).map(config => config.name)
        ));
    }
}

// Create and export singleton instance
export const languageRegistry = new LanguageRegistry();

// Register default languages
languageRegistry.register({
    name: 'text',
    alias: 'plaintext',
    isLoaded: true, // Plain text doesn't need loading
    load: async () => { }, // No-op for plain text
});

// Register JSON language
languageRegistry.register({
    name: 'json',
    alias: 'json',
    isLoaded: false,
    load: async () => {
        // Dynamic import to keep bundle size small
        // @ts-ignore - Ignore missing type declarations for Prism language modules
        await import('prismjs/components/prism-json');
    },
});

// Register Protobuf language
languageRegistry.register({
    name: 'protobuf',
    alias: 'proto',
    isLoaded: false,
    load: async () => {
        // Dynamic import to keep bundle size small
        // @ts-ignore - Ignore missing type declarations for Prism language modules
        await import('prismjs/components/prism-protobuf');
    },
});

export default languageRegistry; 