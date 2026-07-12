// When building for GitHub Pages (project site), set GITHUB_PAGES=true and
// NEXT_PUBLIC_BASE_PATH=/ollamomui so assets use the repo
// subpath. The local EXE build leaves these unset and serves at the domain root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  basePath: basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};

module.exports = nextConfig;
