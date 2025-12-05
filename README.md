# Next Global Express

A modern, professional cargo tracking and shipment management system built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Shipment Management**: Create, track, and manage shipments with a comprehensive admin panel
- **Real-time Tracking**: Professional tracking interface for customers to monitor their shipments
- **Status Updates**: Update shipment status individually or in bulk
- **Multi-modal Shipping**: Support for Air Freight, Ocean Freight, and Land Transport
- **Global Hubs**: Information about shipping hubs in Dubai, UAE and Manila, Philippines
- **Responsive Design**: Mobile-friendly interface built with modern UI components
- **Auto-generated Tracking IDs**: Unique tracking IDs automatically generated for each shipment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Validation**: Zod
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NGEBASE
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration values (database URLs, API keys, etc.)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
NGEBASE/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard and management
│   │   ├── track/        # Public tracking pages
│   │   ├── services/     # Service information pages
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── lib/              # Utilities and helpers
│   │   ├── actions.ts    # Server actions
│   │   ├── data.ts       # Data management
│   │   └── types.ts      # TypeScript types
│   └── hooks/            # Custom React hooks
├── docs/                 # Documentation
└── public/               # Static assets
```

## 🚢 Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Add your environment variables in the Vercel dashboard
5. Deploy!

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production:
```bash
vercel --prod
```

### Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- Database connection strings (if using a database)
- API keys for email/SMS services
- Any other service-specific credentials

## 📱 Key Pages

- **Home** (`/`): Landing page with tracking search and service information
- **Track Shipment** (`/track/[id]`): Public tracking page for customers
- **Admin Dashboard** (`/admin`): Admin panel for managing shipments
- **Create Shipment** (`/admin/shipments/new`): Form to create new shipments
- **Batch Status Update** (`/admin/batch-status`): Bulk update shipments by batch

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom color variables defined in `src/app/globals.css`. You can customize the theme by modifying the CSS variables.

### Components

UI components are built with shadcn/ui and can be customized in the `src/components/ui/` directory.

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier (recommended) for code formatting

## 🔒 Security

- Server actions are used for form submissions
- Input validation with Zod schemas
- Environment variables for sensitive data
- Secure authentication (implement as needed)

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support, email customercare@nge.ae or visit our website.

## 🌐 Global Hubs

- **Dubai, UAE**: Warehouse 42, Al Quoz Industrial Area 3
- **Manila, Philippines**: Unit 14, Cargo Complex, Pasay City

---

Built with ❤️ by Next Global Express


