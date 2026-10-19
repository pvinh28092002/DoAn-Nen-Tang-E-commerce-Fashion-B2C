import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My Express TypeScript API",
    description:
      "Automatically generated documentation for my TypeScript Express project.",
  },
  host: "localhost:5000",
};

const outputFile = "./swagger-output.json";
const routesFiles = ["./src/server.ts"]; // 👈 Updated path

swaggerAutogen()(outputFile, routesFiles).then(() => {
  console.log("Swagger documentation generated successfully!");
});
