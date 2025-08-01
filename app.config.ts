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
       eas: {
        projectId: '85f4b876-d696-44a5-bd87-8d3fc23ae205', // ✅ add this line
      },
    },
  },
};
