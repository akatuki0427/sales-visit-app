/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScriptの型エラーがあってもビルドを続行させる設定
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLintのエラー（コードの書き方の細かい注意）があってもビルドを続行させる設定
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;