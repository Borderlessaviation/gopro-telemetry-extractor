# 📹 GoPro & Insta360 Telemetry Extractor

**Extract GPS, accelerometer, gyroscope, and sensor data from action camera videos**

Supports: GoPro Hero 5-13, Insta360 X5/X4/X3/X2, and more!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Borderlessaviation/gopro-telemetry-extractor?style=social)](https://github.com/Borderlessaviation/gopro-telemetry-extractor)

## 🎯 What This Does

Your GoPro and Insta360 cameras record more than just video - they capture:
- **GPS location** (latitude, longitude, altitude)
- **Speed** (ground speed from GPS)
- **Accelerometer** data (G-forces)
- **Gyroscope** data (rotation)
- **Camera settings** (ISO, shutter, etc.)

This tool extracts all that hidden data and exports it to useful formats!

## 🚀 Quick Start

### Command Line (Node.js)

```bash
# Clone and install
git clone https://github.com/Borderlessaviation/gopro-telemetry-extractor.git
cd gopro-telemetry-extractor
npm install

# Extract from a video
node src/telemetry_extractor.js your_video.mp4

# Results saved to telemetry_output/
```

## 📦 Installation

### Prerequisites
- **Node.js** 14+ OR **Python** 3.8+
- **FFmpeg** (for Python version)

### Node.js Setup

```bash
git clone https://github.com/Borderlessaviation/gopro-telemetry-extractor.git
cd gopro-telemetry-extractor
npm install
```

## 📹 Camera Setup (IMPORTANT!)

### GoPro Hero 9

✅ **Before recording:**
1. Enable GPS: Settings → Regional → GPS = ON
2. Turn on with **Power button** (NOT record button)
3. Wait for GPS lock (GPS icon appears)
4. Keep camera right-side up

⚠️ **GoPro Hero 12 has NO GPS!** Use Hero 11 or Hero 13.

### Insta360 X5

✅ **GPS requires external device:**
- **Best:** GPS Action Remote (recommended)
- **Alternative:** Insta360 mobile app (keep screen ON entire recording)
- **Alternative:** Smartwatch app

## 📊 Output Formats

| Format | Use Case | Apps |
|--------|----------|------|
| **GPX** | GPS tracks | Google Earth, Strava, mapping |
| **KML** | Google Earth | Google Earth, Google Maps |
| **CSV** | Data analysis | Excel, Google Sheets, Python |
| **JSON** | Programming | Custom analysis, web apps |
| **GeoJSON** | Web mapping | Leaflet, Mapbox |

## 🎓 Use Cases

- **Sports Analysis** - Track performance metrics
- **Adventure Logging** - Map routes
- **Accident Reconstruction** - Analyze crash data
- **Scientific Research** - Field survey data
- **Motorsports** - Analyze lap times
- **Insurance** - Document incidents

## 🔧 Advanced Usage

### Merge Split Videos

```bash
node src/telemetry_extractor.js GH010123.MP4 GH020123.MP4 GH030123.MP4
```

### Filter GPS by Quality

Edit `telemetry_extractor.js` to add:
```javascript
GPSPrecision: 500,  // Only good GPS locks
GPSFix: 3,          // Only 3D fixes
WrongSpeed: 100     // Remove impossible speeds
```

## 🐛 Troubleshooting

### "No telemetry data found"

**GoPro:**
- GPS not enabled in settings
- QuickCapture mode used
- Camera was upside down
- No GPS lock (indoors)

**Insta360:**
- No GPS remote/phone connected
- Phone screen turned off
- Basic mode without GPS remote

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create Pull Request

## 📄 License

MIT License - see LICENSE file

Built with:
- [gopro-telemetry](https://github.com/JuanIrache/gopro-telemetry) (MIT)
- [gpmf-extract](https://github.com/JuanIrache/gpmf-extract) (MIT)

## 🙏 Credits

Built on the amazing work by:
- [Juan Irache](https://github.com/JuanIrache) - gopro-telemetry library
- [GoPro](https://github.com/gopro) - GPMF format documentation

---

**Made with ❤️ for the action sports community**