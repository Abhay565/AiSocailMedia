import 'dotenv/config';

export default {
  expo: {
    name: 'AiSocialMedia',
    slug: 'Al-social-media',
    android: {
      package: 'com.AiSocialMedia.com',
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
