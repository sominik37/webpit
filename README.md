# WebPit ⚡️

**WebPit** is a fast, free, and privacy-focused image optimization tool. It allows you to convert and compress your images (JPG, PNG, GIF) into the modern **WebP** format directly in your browser.

## 🌟 Key Features

- **100% Client-Side Processing**: Your images never leave your computer. All compression happens locally in your browser for maximum privacy.
- **Smart Compression**: Automatically compares the optimized file size with the original. If the original is smaller, it keeps it to ensure you always get the best result.
- **Batch Processing**: Upload multiple images at once and adjust the quality globally.
- **Instant ZIP Download**: Optimize dozens of images and download them all as a single, organized `.zip` file.
- **Responsive Design**: Works perfectly across desktops, tablets, and mobile devices.
- **SEO Optimized**: Includes built-in structured data, canonical tags, and high-performance metrics (FCP).

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion v12)
- **Icons**: Lucide React
- **Utilities**: JSZip (for batch downloading), clsx, tailwind-merge
- **Monitoring**: Vercel Speed Insights

## 🛠️ Local Development

### Prerequisites
- Node.js (Latest LTS recommended)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd webpit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔒 Privacy

WebPit is built on the principle that your data is yours. We do not use any backend servers for image processing. Your photos are handled by the HTML5 Canvas API within your browser environment.

## 📄 License

This project is open-source and available under the MIT License.

---
Built with ❤️ by [Usman hyder](https://github.com)
