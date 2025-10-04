import "@testing-library/jest-dom"
import 'whatwg-fetch'

// Polyfill fetch for Node.js environment
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch')
}
