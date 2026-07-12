import { shopify } from './shopify-client.js'

// Create a product from your Cortex dashboard
await shopify.createProduct({ 
  title: "Cortex Industrial Module", 
  price: "299.00",
  inventory: 100 
})
