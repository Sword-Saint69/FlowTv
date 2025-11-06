# FlowTV - Premium IPTV Streaming Platform

FlowTV is a modern IPTV streaming platform built with Next.js 16, offering thousands of live TV channels and on-demand content with crystal clear quality and zero buffering. This project provides a complete streaming solution with user authentication, favorites management, and a beautiful UI.

![FlowTV Demo](/public/flowtv-demo.png)

## Features

### 📺 Streaming Features
- **Thousands of Live Channels**: Access to a vast library of live TV channels from around the world
- **High Quality Streaming**: Enjoy crystal clear HD and 4K streaming with minimal buffering using HLS.js
- **Multi-Device Support**: Watch on your TV, phone, tablet, or computer - anywhere, anytime
- **Favorites Management**: Save your favorite channels for quick access
- **Channel Categories**: Browse channels by categories, languages, and countries
- **Search Functionality**: Easily find channels by name or keywords
- **Picture-in-Picture Mode**: Multitask while watching your favorite content

### 👤 User Features
- **User Authentication**: Secure login and signup with Firebase Authentication
- **Profile Management**: Customize your profile with avatar and display name
- **Persistent Preferences**: Favorites and last watched channel saved across sessions
- **Responsive Design**: Works seamlessly on all device sizes

### 🛠 Developer Features
- **Developer Statistics Dashboard**: Real-time system and user analytics for developers
- **Developer Settings Panel**: Configuration options and system actions
- **API Monitoring**: Track API performance and response times
- **Protected Developer Routes**: Secure access with email domain check or password authentication

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Authentication**: [Firebase](https://firebase.google.com/)
- **Streaming**: [HLS.js](https://github.com/video-dev/hls.js/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: React with modern hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/flowtv.git
cd flowtv
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a Firebase project and configure authentication:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Email/Password authentication
   - Copy your Firebase config

4. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Add your M3U playlist:
   - Place your `myplaylist.m3u` file in the `public` directory

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

```
flowtv/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dev/          # Developer tools and stats
│   │   ├── landing/      # Landing page
│   │   └── ...           # Other pages
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility libraries
│   └── utils/            # Helper functions
├── public/               # Static assets
└── ...
```

## Developer Tools

FlowTV includes specialized tools for developers:

### Developer Statistics Dashboard
Accessible at `/dev/stats` for users with `@flowtv.com` email or after developer login.

Features:
- Real-time system statistics (CPU, memory, uptime)
- User analytics (total users, active users, new users)
- Channel favorites tracking
- Auto-refreshing data

### Developer Settings
Accessible at `/dev/settings` for developers to configure system parameters.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [HLS.js Documentation](https://github.com/video-dev/hls.js/blob/master/docs/API.md)

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@flowtv.com or open an issue in the repository.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Firebase](https://firebase.google.com/) for authentication and backend services
- [HLS.js](https://github.com/video-dev/hls.js/) for HTTP Live Streaming support