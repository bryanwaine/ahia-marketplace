module.exports = {
  images: { domains: ['res.cloudinary.com'] },
  rewrites: async () => [
    {
      source: '/public/t_and_c.html',
      destination: '/pages/api/t_and_c.js',
    },
    {
      source: '/public/privacy_policy.html',
      destination: '/pages/api/privacy_policy.js',
    },
  ],
};

