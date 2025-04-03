
# Web Watch Phish

An AI-powered phishing detection tool that helps users identify potentially malicious URLs in real-time.

## Features

- Modern, responsive UI with dark mode support
- Real-time URL safety analysis
- Detailed breakdown of URL characteristics
- History tracking with local storage
- Chrome extension compatibility

## Running the Project

### Web Application

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Visit `http://localhost:5173` in your browser

### Chrome Extension

To use Web Watch Phish as a Chrome extension:

1. Build the project with `npm run build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `dist` folder from this project
5. The extension will appear in your Chrome toolbar

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- ShadCN UI components
- Local Storage for data persistence

## Extending the Project

### Adding More Phishing Detection Features

To enhance the phishing detection capabilities, you can modify the `mockApi.ts` file to include additional features such as:

- Domain age checking
- SSL certificate validation
- WHOIS data analysis
- Reputation database lookup

### Improving the Extension

The Chrome extension functionality can be enhanced by:

1. Adding context menu integration
2. Implementing real-time URL checking for all tabs
3. Creating a blocking mechanism for dangerous sites
4. Adding browser notifications for security alerts

## Performance Optimization

For the best performance:

1. Lazy load components when possible
2. Implement request caching
3. Minimize re-renders with React.memo and useMemo
4. Use appropriate image formats and compression

## Deployment

### Web Application

Deploy to Vercel or Netlify:

1. Connect your GitHub repository to Vercel/Netlify
2. Configure build settings (`npm run build`)
3. Deploy the application

### Chrome Extension

Publish to Chrome Web Store:

1. Create a developer account on the Chrome Web Store
2. Compress the `dist` folder into a ZIP file
3. Upload the ZIP file to the Chrome Web Store Developer Dashboard
4. Fill in the required details and submit for review

## License

MIT
