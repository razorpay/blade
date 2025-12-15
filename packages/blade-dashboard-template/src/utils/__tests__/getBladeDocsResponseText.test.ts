import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBladeDocsResponseText } from '../getBladeDocsResponseText.js';

// Mock fs and path modules
vi.mock('fs');
vi.mock('path');
vi.mock('../tokens.js', () => ({
  KNOWLEDGEBASE_DIRECTORY: '/mock/knowledgebase',
}));

describe('getBladeDocsResponseText', () => {
  const mockKnowledgeBaseDir = '/mock/knowledgebase';

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock for resolve
    vi.spyOn(path, 'resolve').mockImplementation((...args) => {
      return args.join('/');
    });
  });

  it('should return formatted documentation for a single component', () => {
    const mockContent = 'This is Button component documentation.';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = getBladeDocsResponseText({
      docsList: 'Button',
      documentationType: 'components',
    });

    expect(result).toContain('Blade components documentation for: Button');
    expect(result).toContain('# Button');
    expect(result).toContain(mockContent);
    expect(path.resolve).toHaveBeenCalledWith(mockKnowledgeBaseDir, 'components', 'Button.md');
    expect(fs.readFileSync).toHaveBeenCalledWith(
      `${mockKnowledgeBaseDir}/components/Button.md`,
      'utf8',
    );
  });

  it('should return formatted documentation for multiple components', () => {
    const mockButtonContent = 'Button component docs.';
    const mockAccordionContent = 'Accordion component docs.';
    vi.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(mockButtonContent)
      .mockReturnValueOnce(mockAccordionContent);

    const result = getBladeDocsResponseText({
      docsList: 'Button, Accordion',
      documentationType: 'components',
    });

    expect(result).toContain('Blade components documentation for: Button, Accordion');
    expect(result).toContain('# Button');
    expect(result).toContain(mockButtonContent);
    expect(result).toContain('# Accordion');
    expect(result).toContain(mockAccordionContent);
    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
  });

  it('should handle whitespace in docsList', () => {
    const mockContent = 'Component docs.';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = getBladeDocsResponseText({
      docsList: ' Button ,  Accordion ',
      documentationType: 'components',
    });

    expect(result).toContain('# Button');
    expect(result).toContain('# Accordion');
    expect(path.resolve).toHaveBeenCalledWith(mockKnowledgeBaseDir, 'components', 'Button.md');
    expect(path.resolve).toHaveBeenCalledWith(mockKnowledgeBaseDir, 'components', 'Accordion.md');
  });

  it('should return error message when file does not exist', () => {
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = getBladeDocsResponseText({
      docsList: 'NonExistent',
      documentationType: 'components',
    });

    expect(result).toContain('Blade components documentation for: NonExistent');
    expect(result).toContain('# NonExistent');
    expect(result).toContain(
      '⚠️ Error: Could not read documentation for NonExistent in components. The documentation may not exist or there may be an issue with the file.',
    );
  });

  it('should handle mixed success and errors for multiple docs', () => {
    const mockButtonContent = 'Button component docs.';
    vi.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(mockButtonContent)
      .mockImplementationOnce(() => {
        throw new Error('File not found');
      });

    const result = getBladeDocsResponseText({
      docsList: 'Button, NonExistent',
      documentationType: 'components',
    });

    expect(result).toContain('# Button');
    expect(result).toContain(mockButtonContent);
    expect(result).toContain('# NonExistent');
    expect(result).toContain(
      '⚠️ Error: Could not read documentation for NonExistent in components. The documentation may not exist or there may be an issue with the file.',
    );
  });

  it('should work with patterns documentation type', () => {
    const mockContent = 'ListView pattern documentation.';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = getBladeDocsResponseText({
      docsList: 'ListView',
      documentationType: 'patterns',
    });

    expect(result).toContain('Blade patterns documentation for: ListView');
    expect(result).toContain('# ListView');
    expect(result).toContain(mockContent);
    expect(path.resolve).toHaveBeenCalledWith(mockKnowledgeBaseDir, 'patterns', 'ListView.md');
  });

  it('should work with general documentation type', () => {
    const mockContent = 'Usage general documentation.';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = getBladeDocsResponseText({
      docsList: 'Usage',
      documentationType: 'general',
    });

    expect(result).toContain('Blade general documentation for: Usage');
    expect(result).toContain('# Usage');
    expect(result).toContain(mockContent);
    expect(path.resolve).toHaveBeenCalledWith(mockKnowledgeBaseDir, 'general', 'Usage.md');
  });

  it('should handle multiple patterns', () => {
    const mockListViewContent = 'ListView pattern.';
    const mockDetailedViewContent = 'DetailedView pattern.';
    vi.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(mockListViewContent)
      .mockReturnValueOnce(mockDetailedViewContent);

    const result = getBladeDocsResponseText({
      docsList: 'ListView, DetailedView',
      documentationType: 'patterns',
    });

    expect(result).toContain('Blade patterns documentation for: ListView, DetailedView');
    expect(result).toContain('# ListView');
    expect(result).toContain(mockListViewContent);
    expect(result).toContain('# DetailedView');
    expect(result).toContain(mockDetailedViewContent);
  });

  it('should preserve original docsList format in header', () => {
    const mockContent = 'Component docs.';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = getBladeDocsResponseText({
      docsList: 'Button, Accordion, Input',
      documentationType: 'components',
    });

    expect(result).toContain('Blade components documentation for: Button, Accordion, Input');
  });
});
