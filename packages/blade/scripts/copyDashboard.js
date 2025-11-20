const fs = require('fs');
const path = require('path');

const dashboardSource = path.join(__dirname, '../public/dashboard.html');
const storybookSiteDir = path.join(__dirname, '../storybook-site');
const dashboardDir = path.join(storybookSiteDir, 'dashboard');
const dashboardDest = path.join(dashboardDir, 'index.html');

// Create dashboard directory if it doesn't exist
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

// Copy dashboard.html to storybook-site/dashboard/index.html
if (fs.existsSync(dashboardSource)) {
  fs.copyFileSync(dashboardSource, dashboardDest);
  console.log('✓ Dashboard HTML copied to storybook-site/dashboard/index.html');
} else {
  console.warn('⚠ Warning: dashboard.html not found at', dashboardSource);
}

