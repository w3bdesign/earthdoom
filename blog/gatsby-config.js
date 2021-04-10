module.exports = {
  siteMetadata: {
    title: "Earthdoom Blog",
    siteUrl: "https://www.earthdoom.com"
  },
  plugins: [
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId: "zh1ax25r",
        dataset: "production",
      },
    },
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
