import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createBladeSkillHttpCallback,
  createBladeSkillStdioCallback,
} from '../createBladeSkill.js';
import * as analyticsUtils from '../../utils/analyticsUtils.js';
import * as skillUtils from '../../utils/skillUtils.js';
import { SKILL_VERSION_STRING } from '../../utils/tokens.js';

vi.mock('../../utils/analyticsUtils.js');
vi.mock('../../utils/skillUtils.js');

const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('createBladeSkill HTTP callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return skill creation instructions', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockInstructions = 'Mock instructions for creating blade skill';

    vi.spyOn(skillUtils, 'skillCreationInstructions').mockReturnValue(mockInstructions);

    const result = createBladeSkillHttpCallback(
      { currentProjectRootDirectory: mockCurrentProjectRootDirectory },
      createMockContext(),
    );

    expect(analyticsUtils.sendAnalytics).toHaveBeenCalledWith({
      eventName: expect.any(String),
      properties: {
        toolName: 'create_blade_skill',
        skillVersion: expect.any(String),
        rootDirectoryName: expect.any(String),
      },
    });
    expect(result).toMatchObject({
      content: [{ type: 'text', text: mockInstructions }],
    });
    expect(skillUtils.skillCreationInstructions).toHaveBeenCalledWith({
      currentProjectRootDirectory: mockCurrentProjectRootDirectory,
    });
  });
});

describe('createBladeSkill stdio callback', () => {
  let tmpDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-skill-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('should create skill file and symlink in the correct locations', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    const result = createBladeSkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const symlinkPath = path.join(tmpDir, '.claude/skills/ui-code-guidelines');

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('Blade skill created') }],
    });
    expect(fs.existsSync(skillFilePath)).toBe(true);
    expect(fs.existsSync(symlinkPath)).toBe(true);
  });

  it('should write template content that passes the version check (regression: quote mismatch)', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    createBladeSkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const writtenContent = fs.readFileSync(skillFilePath, 'utf8');

    // If this fails, the template and SKILL_VERSION_STRING are out of sync
    expect(writtenContent).toContain(SKILL_VERSION_STRING);
  });

  it('should return "already up to date" if skill file is current', () => {
    vi.mocked(analyticsUtils.sendAnalytics).mockImplementation(() => undefined);

    // Create it once
    createBladeSkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());
    // Try again
    const result = createBladeSkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('up to date') }],
    });
  });
});
