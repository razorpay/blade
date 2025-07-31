const path = require('path');
const fs = require('fs');

const FILE_ID = 'jubmQL9Z8V7881ayUD95ps';
// const NODE_ID = '103317-3667';
// New Node ID for filledIcons
const NODE_ID = '109861-1167';

async function updateIconsJson(componentNames, svgData) {
  const iconsFilePath = path.join(__dirname, 'icons.json');
  let iconsJson = [];
  if (fs.existsSync(iconsFilePath)) {
    const data = fs.readFileSync(iconsFilePath, 'utf8');
    iconsJson = JSON.parse(data);
  }
  componentNames.forEach((name, index) => {
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    iconsJson.push({ [sanitizedName]: svgData[index] });
  });
  fs.writeFileSync(iconsFilePath, JSON.stringify(iconsJson, null, 2));
  console.log('Updated icons.json');
}

async function fetchComponentSVGs(componentIds, componentNames) {
  try {
    const idsParam = componentIds.join(',');
    const url = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(
      idsParam,
    )}&format=svg`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN,
        Accept: 'application/json',
      },
    });
    const data = await response.json();

    const imageUrls = data.images;
    console.log('SVG URLs:', imageUrls);

    const svgData = await Promise.all(
      componentIds.map(async (id) => {
        const imageUrl = imageUrls[id];
        const response01 = await fetch(imageUrl);
        if (!response01.ok) {
          throw new Error(`Failed to fetch ${imageUrl}: ${response01.statusText}`);
        }
        const text = await response01.text();
        return text;
      }),
    );

    await updateIconsJson(componentNames, svgData);
  } catch (error) {
    console.error('Error fetching SVGs:', error);
  }
}

async function fetchNode() {
  try {
    const query = new URLSearchParams({
      ids: NODE_ID,
    }).toString();
    const url = `https://api.figma.com/v1/files/${FILE_ID}/nodes?${query}`;

    const ResponseWithNodes = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN,
        Accept: 'application/json',
      },
    });
    const finalResponse = await ResponseWithNodes.json();
    const { nodes } = finalResponse;
    const key = Object.keys(nodes)[0];
    const componentsToBeAdded = nodes[key].document.children;
    const componentIds = componentsToBeAdded.map((component) => component.id);
    const componentNames = componentsToBeAdded.map((component) => component.name);
    fetchComponentSVGs(componentIds, componentNames);
  } catch (error) {
    console.error('Error fetching node:', error);
  }
}
fetchNode();
