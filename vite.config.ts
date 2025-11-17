import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.PAYFAST_MERCHANT_ID': JSON.stringify(env.PAYFAST_MERCHANT_ID),
        'process.env.PAYFAST_MERCHANT_KEY': JSON.stringify(env.PAYFAST_MERCHANT_KEY),
        'process.env.PAYFAST_PASSPHRASE': JSON.stringify(env.PAYFAST_PASSPHRASE),
        'process.env.PAYFAST_TEST_MODE': JSON.stringify(env.PAYFAST_TEST_MODE)
      },
      // Firebase env variables are handled automatically by Vite with VITE_ prefix
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
