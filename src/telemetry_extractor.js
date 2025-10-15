// GoPro & Insta360 Telemetry Extractor
// Install dependencies: npm install gpmf-extract gopro-telemetry

const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require('gopro-telemetry');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = 'telemetry_output';
const EXPORT_FORMATS = {
  json: true,    // Raw JSON data
  gpx: true,     // GPS Exchange format (for mapping apps)
  csv: true,     // Excel-compatible
  kml: true,     // Google Earth
  geojson: true  // GeoJSON for mapping
};

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

async function extractTelemetry(videoPath) {
  console.log(`Reading video file: ${videoPath}`);
  
  try {
    // Read the video file
    const file = fs.readFileSync(videoPath);
    
    console.log('Extracting GPMF data...');
    const extracted = await gpmfExtract(file);
    
    if (!extracted || !extracted.rawData) {
      throw new Error('No telemetry data found in video file');
    }
    
    console.log('Processing telemetry data...');
    const baseFilename = path.basename(videoPath, path.extname(videoPath));
    
    // Extract JSON (full data)
    if (EXPORT_FORMATS.json) {
      const telemetryData = await goproTelemetry(extracted, {
        stream: ['GPS5', 'GPS9', 'ACCL', 'GYRO'],
        repeatSticky: true,
        repeatHeaders: true
      });
      
      const jsonPath = path.join(OUTPUT_DIR, `${baseFilename}_telemetry.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(telemetryData, null, 2));
      console.log(`✓ JSON saved: ${jsonPath}`);
    }
    
    // Extract GPX (GPS track)
    if (EXPORT_FORMATS.gpx) {
      const gpxData = await goproTelemetry(extracted, {
        preset: 'gpx',
        name: baseFilename
      });
      
      const gpxPath = path.join(OUTPUT_DIR, `${baseFilename}_gps.gpx`);
      fs.writeFileSync(gpxPath, gpxData);
      console.log(`✓ GPX saved: ${gpxPath}`);
    }
    
    // Extract KML (Google Earth)
    if (EXPORT_FORMATS.kml) {
      const kmlData = await goproTelemetry(extracted, {
        preset: 'kml'
      });
      
      const kmlPath = path.join(OUTPUT_DIR, `${baseFilename}_gps.kml`);
      fs.writeFileSync(kmlPath, kmlData);
      console.log(`✓ KML saved: ${kmlPath}`);
    }
    
    // Extract GeoJSON
    if (EXPORT_FORMATS.geojson) {
      const geojsonData = await goproTelemetry(extracted, {
        preset: 'geojson'
      });
      
      const geojsonPath = path.join(OUTPUT_DIR, `${baseFilename}_gps.geojson`);
      fs.writeFileSync(geojsonPath, geojsonData);
      console.log(`✓ GeoJSON saved: ${geojsonPath}`);
    }
    
    // Extract CSV (Spreadsheet)
    if (EXPORT_FORMATS.csv) {
      const csvData = await goproTelemetry(extracted, {
        preset: 'csv'
      });
      
      for (const [streamName, csvContent] of Object.entries(csvData)) {
        const csvPath = path.join(OUTPUT_DIR, `${baseFilename}_${streamName}.csv`);
        fs.writeFileSync(csvPath, csvContent);
        console.log(`✓ CSV saved: ${csvPath}`);
      }
    }
    
    console.log('\n✅ Telemetry extraction complete!');
    console.log(`Output files saved to: ${OUTPUT_DIR}/`);
    
    displayTelemetrySummary(extracted);
    
  } catch (error) {
    console.error('❌ Error extracting telemetry:', error.message);
    
    if (error.message.includes('No telemetry data')) {
      console.log('\nPossible reasons:');
      console.log('- GoPro: GPS not enabled in camera settings');
      console.log('- GoPro: Used QuickCapture mode (doesn\'t allow GPS lock)');
      console.log('- Insta360: GPS remote or phone not connected during recording');
      console.log('- Video file is corrupted or doesn\'t contain GPMF data');
    }
  }
}

function displayTelemetrySummary(extracted) {
  console.log('\n📊 Telemetry Summary:');
  console.log(`Duration: ${(extracted.timing.videoDuration / 60).toFixed(2)} minutes`);
  console.log(`Start time: ${extracted.timing.start}`);
  console.log(`Samples: ${extracted.timing.samples.length}`);
}

async function extractMultipleFiles(videoPaths) {
  console.log('Processing multiple video files...');
  
  const extractedFiles = [];
  
  for (const videoPath of videoPaths) {
    const file = fs.readFileSync(videoPath);
    const extracted = await gpmfExtract(file);
    extractedFiles.push(extracted);
  }
  
  const mergedTelemetry = await goproTelemetry(extractedFiles, {
    preset: 'gpx',
    name: 'merged_track'
  });
  
  const outputPath = path.join(OUTPUT_DIR, 'merged_telemetry.gpx');
  fs.writeFileSync(outputPath, mergedTelemetry);
  console.log(`✓ Merged telemetry saved: ${outputPath}`);
}

if (require.main === module) {
  if (process.argv.length > 2) {
    const videoPath = process.argv[2];
    
    if (process.argv.length > 3) {
      extractMultipleFiles(process.argv.slice(2));
    } else {
      extractTelemetry(videoPath);
    }
  } else {
    console.log('Usage: node telemetry_extractor.js <video_file.mp4>');
    console.log('Or: node telemetry_extractor.js <file1.mp4> <file2.mp4> (merge)');
  }
}

module.exports = { extractTelemetry, extractMultipleFiles };