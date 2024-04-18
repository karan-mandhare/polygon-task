const fs = require("fs");
const axios = require("axios");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

// Serve the frontend files
app.use(express.static(path.join(__dirname, "Frontend")));

// Function to fetch stock data from Polygon API
async function fetchStockData(date) {
  const apiKey = "f18h6NNHHfKAiIdLgfSjLBr9Fpq5yYv0";
  const url = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.results.slice(0, 20);
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return [];
  }
}

// Function to update stock prices by fetching updated data from Polygon API every 5 seconds
async function updateStockPrices(stockData) {
  setInterval(async () => {
    try {
      const updatedStockData = await fetchStockData("2023-01-09"); // Fetch updated stock data
      if (updatedStockData.length > 0) {
        updatedStockData.forEach((updatedStock) => {
          const existingStock = stockData.find(
            (stock) => stock.T === updatedStock.T
          );
          if (existingStock) {
            existingStock.price = updatedStock.h; // Update the stock price with the latest value
            console.log(
              `Updated price for ${existingStock.T}: ${existingStock.price}`
            );
          }
        });
        saveStockDataToFile(stockData); // Save updated stock data to file
      } else {
        console.log("No updated stock data available.");
      }
    } catch (error) {
      console.error("Error updating stock prices:", error.message);
    }
  }, 5000); // Fetch updated data every 5 seconds
}

// Function to save stock data to a file
function saveStockDataToFile(stockData) {
  const filename = "stock_data.json";
  fs.writeFile(filename, JSON.stringify(stockData, null, 2), (err) => {
    if (err) {
      console.error("Error saving stock data to file:", err.message);
    } else {
      console.log("Stock data saved to file:", filename);
    }
  });
}

// Fetch stock data and start updating prices
async function start() {
  const date = "2023-01-09";
  const stockData = await fetchStockData(date);
  if (stockData.length > 0) {
    saveStockDataToFile(stockData);
    updateStockPrices(stockData);
  } else {
    console.log("No stock data available.");
  }
}

// Start the application
start();

// Endpoint to serve stock data JSON file
app.get("/api/stock_data", (req, res) => {
  res.sendFile(path.join(__dirname, "stock_data.json"));
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
