/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Webpack para deshabilitar la serialización
  webpack: (config) => {
    config.cache = {
      ...config.cache,
      type: 'filesystem',
      maxMemoryGenerations: 0,
      cacheDirectory: undefined,
    };
    return config;
  },
};

export default nextConfig;
