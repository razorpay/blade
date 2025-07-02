const path = require('path');
const fs = require('fs');
const axios = require('axios');

const FILE_ID = 'jubmQL9Z8V7881ayUD95ps';
const NODE_ID = '103317-3667';

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
    const response = await axios.get(`https://api.figma.com/v1/images/${FILE_ID}`, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN,
      },
      params: {
        ids: componentIds.join(','),
        format: 'svg',
      },
    });

    const imageUrls = response.data.images;
    console.log('SVG URLs:', imageUrls);

    const svgData = await Promise.all(
      componentIds.map(async (id) => {
        const url = imageUrls[id];
        const svgResponse = await axios.get(url, { responseType: 'text' });
        return svgResponse.data;
      }),
    );

    await updateIconsJson(componentNames, svgData);
  } catch (error) {
    console.error('Error fetching SVGs:', error);
  }
}

async function fetchNode() {
  try {
    const response = await axios.get(`https://api.figma.com/v1/files/${FILE_ID}/nodes`, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN,
      },
      params: {
        ids: NODE_ID,
      },
    });

    const nodeData = response.data;
    const { nodes } = nodeData;
    const key = Object.keys(nodes)[0];
    const componentsToBeAdded = nodes[key].document.children;
    const componentIds = componentsToBeAdded.map((component) => component.id);
    const componentNames = componentsToBeAdded.map((component) => component.name);
    fetchComponentSVGs(componentIds, componentNames);
    //
  } catch (error) {
    console.error('Error fetching node:', error);
  }
}
fetchNode();