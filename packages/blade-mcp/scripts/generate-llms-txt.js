#!/usr/bin/env node

/**
 * Script to combine all Blade MCP knowledgebase docs into a single llms.txt file
 *
 * Usage: node scripts/generate-llms-txt.js
 * Output: llms.txt in the blade-mcp package root
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGEBASE_DIR = path.join(__dirname, '../knowledgebase');
const OUTPUT_FILE = path.join(__dirname, '../llms.txt');

// Categories in order of appearance in the output
const CATEGORIES = [
  {
    name: 'General',
    dir: 'general',
    description: 'General documentation about Blade Design System setup, usage, and configuration.',
  },
  {
    name: 'Patterns',
    dir: 'patterns',
    description: 'Design patterns and best practices for building UIs with Blade.',
  },
  {
    name: 'Components',
    dir: 'components',
    description: 'Individual component documentation with props, examples, and usage guidelines.',
  },
];

/**
 * Get all markdown files from a directory, sorted alphabetically
 */
function getMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Read file content
 */
function readFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Generate the combined llms.txt content
 */
function generateLlmsTxt() {
  const lines = [];

  // Header
  lines.push('# Blade Design System - Complete Documentation');
  lines.push('');
  lines.push('> This file contains the complete documentation for the Blade Design System.');
  lines.push('> It is auto-generated from the knowledgebase directory.');
  lines.push('> Generated on: ' + new Date().toISOString());
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');

  for (const category of CATEGORIES) {
    const categoryDir = path.join(KNOWLEDGEBASE_DIR, category.dir);
    const files = getMarkdownFiles(categoryDir);

    lines.push(`### ${category.name}`);
    lines.push('');

    for (const file of files) {
      const name = file.replace('.md', '');
      lines.push(`- ${name}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Content for each category
  for (const category of CATEGORIES) {
    const categoryDir = path.join(KNOWLEDGEBASE_DIR, category.dir);
    const files = getMarkdownFiles(categoryDir);

    lines.push(`# ${category.name.toUpperCase()}`);
    lines.push('');
    lines.push(`> ${category.description}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const content = readFileContent(filePath);
      const name = file.replace('.md', '');

      lines.push(`## ${name}`);
      lines.push('');
      lines.push(content.trim());
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating llms.txt from knowledgebase...');
  console.log(`📂 Source: ${KNOWLEDGEBASE_DIR}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log('');

  // Count files
  let totalFiles = 0;
  for (const category of CATEGORIES) {
    const categoryDir = path.join(KNOWLEDGEBASE_DIR, category.dir);
    const files = getMarkdownFiles(categoryDir);
    console.log(`  ${category.name}: ${files.length} files`);
    totalFiles += files.length;
  }
  console.log(`  Total: ${totalFiles} files`);
  console.log('');

  // Generate content
  const content = generateLlmsTxt();

  // Write output
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

  // Stats
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeKB = (stats.size / 1024).toFixed(2);
  const lineCount = content.split('\n').length;

  console.log('✅ Successfully generated llms.txt!');
  console.log(`   Size: ${sizeKB} KB`);
  console.log(`   Lines: ${lineCount}`);
}

main();
