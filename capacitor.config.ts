import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.supermentor.app',
  appName: 'SuperMentor',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
