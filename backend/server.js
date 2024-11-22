const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock Database
const factories = [];

// API Endpoint for Factory Signup
app.post("/api/factory", async (req, res) => {
  const {name, description} = req.body;

  if (!name || !description) {
    return res.status(400).json({error: "Name and description are required."});
  }

  try {
    // Call OpenAI API for Category Recommendation
    const prompt = `Suggest a category for a factory with the following description: "${description}". Only provide the category name.`;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        max_tokens: 20,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // { "model": "gpt-4o", "messages": [{"role": "user", "content": "Say this is a test!"}], "temperature": 0.7 }

    console.log("response", response.data.choices);
    const category =
      response.data.choices[0]?.message?.content || "Uncategorized";

    // Save Factory Details in Mock Database
    const newFactory = {
      id: factories.length + 1,
      name,
      description,
      category,
    };
    factories.push(newFactory);

    res.status(201).json({
      message: "Factory created successfully",
      factory: newFactory,
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({error: "Failed to generate category."});
  }
});

app.post("/api/factory/sample", async (req, res) => {
  const {name, description} = req.body;

  if (!name || !description) {
    return res.status(400).json({error: "Name and description are required."});
  }

  try {
    // // Call OpenAI API for Category Recommendation
    // const prompt = `Suggest a category for a factory with the following description: "${description}". Only provide the category name.`;
    // const response = await axios.post(
    //   "https://api.openai.com/v1/chat/completions",
    //   {
    //     model: "gpt-3.5-turbo",
    //     messages: [{role: "user", content: prompt}],
    //     max_tokens: 20,
    //     temperature: 0.7,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer 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`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // // { "model": "gpt-4o", "messages": [{"role": "user", "content": "Say this is a test!"}], "temperature": 0.7 }

    // console.log("response", response.data.choices);
    // const category =
    //   response.data.choices[0]?.message?.content || "Uncategorized";

    // Save Factory Details in Mock Database
    const newFactory = {
      id: 1,
      name: "Factory",
      description: "Desc",
      category: "Category",
    };
    factories.push(newFactory);

    res.status(201).json({
      message: "Factory created successfully",
      factory: newFactory,
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({error: "Failed to generate category."});
  }
});

// Endpoint to View All Factories (Optional)
app.get("/api/factories", (req, res) => {
  res.json(factories);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// OpenAI setup
// const configuration = new Configuration({
//   apiKey:
//     "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",
// });
// const openai = new OpenAIApi(configuration);
