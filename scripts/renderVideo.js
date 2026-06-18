const {spawnSync} = require('child_process');
const path = require('path');

const compositionId = process.argv[2];
const outputPath = process.argv[3];

if (!compositionId || !outputPath) {
  console.error('Usage: node scripts/renderVideo.js <composition-id> <output-path>');
  process.exit(1);
}

const localRemotionBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'remotion.cmd' : 'remotion'
);

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || '/snap/bin/chromium';

const result = spawnSync(
  localRemotionBin,
  ['render', '--concurrency=1', '--browser-executable', browserExecutable, compositionId, outputPath],
  {encoding: 'utf8', stdio: 'pipe'}
);

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

const combinedOutput = `${result.stdout || ''}\n${result.stderr || ''}`;

if (result.status !== 0) {
  if (/Target closed/i.test(combinedOutput)) {
    console.error([
      '',
      'Remotion rendering failed because Chromium closed unexpectedly.',
      'On Ubuntu, this usually means the Linux dependencies for Chrome are missing.',
      'Try installing the packages below, then run the command again:',
      '',
      'sudo apt-get install -y \\',
      '  libnss3 \\',
      '  libdbus-1-3 \\',
      '  libatk1.0-0 \\',
      '  libasound2t64 \\',
      '  libxrandr2 \\',
      '  libxkbcommon-dev \\',
      '  libxfixes3 \\',
      '  libxcomposite1 \\',
      '  libxdamage1 \\',
      '  libgbm-dev \\',
      '  libcups2 \\',
      '  libcairo2 \\',
      '  libpango-1.0-0 \\',
      '  libatk-bridge2.0-0',
      '',
    ].join('\n'));
  }

  process.exit(result.status || 1);
}
