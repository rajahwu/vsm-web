// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// router.get('/styles', (req, res) => {
//   res.sendFile(path.join(__dirname, 'styles.css'));
// });

// export default router;

// What rsys.style.system should do

// receive brand name requesting a design-source-asset-folder
// Provide or create and provide: 
// design-source
// design-source/assests
//     /audio
//     /generation/
//         /prompts   
//     /images
//     /videos 
// design-surce/tokens
//     colors.json
//     typography.json
//     spacing.json
//     phases.json

// rsys.style.system 
// should provide methods (reference and create)
// rsys.style.system.getDesignSourceAssets(brandName)
// rsys.style.system.getDesignSourceTokens(brandName)
//  if not brandName found, provide default design-source.create(brandName)
// create(brandName)
//     const { status, brandkit, values } = sys.query(brandName, 'brandkit')
//     const designSource = createDesignSource(brandName, brandkit, values)
// export design-source assets
// so that other packages 
// to access these assets 
// and tokens 
// by brand name
// first time brand will be queried for brandkit and values 
// and design-source will be created
// subsequent times design-source will be referenced and provided
// even is little or none is provided for brandkit and values
// a new design-source will be with tailored tokens and assets via generation.prompts.createPromptsForBrand(info)
// and generation.prompts.generateAssetsForBrand(info, prompts)
// 

import { createDesignSource } from './system';

export const system = createDesignSource('rsys');

const designSource = system.getDesignSource();

export const colors = system.getColors();
export const phases = system.getPhases();
export const spacing = system.getSpacing();
export const typography = system.getTypography();