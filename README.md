# Complaint Management System

A comprehensive web application for managing complaints, reports, and user feedback with a modern dashboard interface. Built with Next.js, React, and TypeScript.

## 🚀 Features & Functionalities

### User Management
- Secure authentication system with JWT
- User roles and permissions
- Profile management
- Password hashing and security

### Complaint Management
- Complaint submission and tracking
- Status updates and notifications
- Supervisor assignment system
- Complaint categorization and prioritization

### Report Generation
- PDF report creation and export
- Customizable report templates
- Data visualization and analytics
- Report history and archiving

### Supervisor Management
- Task delegation system
- Performance tracking
- Workload management
- Team coordination

### Feedback System
- User feedback collection
- Feedback analysis dashboard
- Status messaging system
- Response tracking

### Media Handling
- Image upload and storage (Cloudinary)
- Document management
- File processing and validation
- Media preview and download

### UI/UX Features
- Responsive design
- Dark/light theme support
- Animated transitions
- Toast notifications
- Interactive calendar
- Data visualization charts
- Loading states and spinners

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.2
- **UI Library**: React 19.0.0
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - Framer Motion (animations)
  - Headless UI (accessible components)
- **Charts**: Recharts
- **PDF Handling**: @react-pdf/renderer, pdf-lib
- **Icons**: React Icons, Heroicons
- **Notifications**: React Hot Toast
- **Calendar**: React Calendar

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcryptjs
- **Email**: Nodemailer
- **File Storage**: Cloudinary
- **HTTP Client**: Axios

### Development Tools
- TypeScript
- ESLint
- PostCSS
- Tailwind CSS

## 📸 Screenshots



## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn
- Cloudinary account
- Email service provider

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jagadish-Nayak/rrts.git
cd my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email_from_address

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── (dashboard)/ # Dashboard pages
│   │   ├── login/       # Login page
│   │   └── signup/      # Signup page
│   ├── components/      # Reusable components
│   ├── config/          # Configuration files
│   ├── data/            # Static data
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Report.js
│   │   ├── Supervisor.js
│   │   ├── Feedback.js
│   │   └── StatusMessage.js
│   └── utils/           # Utility functions
├── public/              # Static assets
└── ...config files
```

## 🚀 Deployment

### Production Build
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm start
# or
yarn start
```

### Deployment Options
1. **Vercel** (Recommended)
   - Automatic deployments
   - Serverless functions
   - Easy environment variable management

2. **Docker**
   - Containerized deployment
   - Consistent environments
   - Easy scaling

3. **Traditional Server**
   - Node.js server
   - PM2 for process management
   - Nginx for reverse proxy

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Built with ❤️ using Next.js and React
