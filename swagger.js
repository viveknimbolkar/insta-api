const swaggerJsDocs = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Insta API",
      version: "1.0.0",
    },
  },
  apis: ['index.js',"./routes/*.js"],
};

const swaggerDocs = swaggerJsDocs(swaggerOptions);

exports.swaggerDocs = swaggerDocs;
