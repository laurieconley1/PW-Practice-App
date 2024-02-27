import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();  

export default defineConfig<TestOptions>({
     
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/', 
    baseURL: 'http://localhost:4200/', //'http://127.0.0.1:3000',
  },

  projects: [
    {
      name: 'chromium',
    }
  ]
});
