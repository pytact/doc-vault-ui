# DocValut - Secure Family Document Vault

A secure, role-based family document vault designed for families, general consumers, and enterprises. Users are organized into families, each functioning as an isolated tenant.

## 🚀 Features

- **F-001**: Core Identity, Access & Organization (Authentication, onboarding, roles, families, user management)
- **F-002**: Categories & Subcategories (Fixed taxonomy of 15 categories and 78 subcategories)
- **F-003**: Document Management (Upload, view, edit, delete, search, and list documents)
- **F-004**: Document Sharing (Assign viewer/editor access types to specific users)
- **F-005**: Expiry Notification System (Scheduled alerts via email & in-app for document expiry)
- **F-006**: Web UI (Minimal functional interface for all user operations)
- **F-007**: SuperAdmin Console (Manage families, users, and soft-deleted entities)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Authentication**: JWT

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doc-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete folder structure documentation.

### Key Directories

- `app/` - Next.js App Router pages and routes
- `components/` - Reusable UI components (primitives, common, layout)
- `modules/` - Feature-based modules (f001-identity through f007-superadmin)
- `services/` - API service layer
- `contexts/` - Global React contexts
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `validations/` - Zod validation schemas
- `theme/` - Design tokens and global styles
- `utils/` - Utility functions
- `constants/` - Application constants

## 🏗️ Architecture

### Feature-Based Modules

Each feature (F-001 through F-007) has its own module with:
- `components/` - Feature-specific UI components
- `containers/` - Container components with business logic
- `hooks/` - Feature-specific custom hooks
- `types/` - Feature-specific TypeScript types

### Routing

Following Next.js App Router conventions:
- Route groups: `(auth)`, `(dashboard)`, `(superadmin)`
- Dynamic routes: `[id]`, `[token]`
- Protected routes with route guards

### Styling

- Design tokens in `theme/tokens/`
- Tailwind CSS with custom configuration
- Component-level styling (no inline styles)
- Pixel-perfect Figma implementation

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📝 Code Style

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Naming**: Follow conventions in PROJECT_STRUCTURE.md

## 🔐 Authentication

JWT-based authentication with:
- Login/Logout
- Invitation-based onboarding
- Password reset
- Role-based access control (SuperAdmin, FamilyAdmin, Member)

## 🎨 Design System

- Design tokens extracted from Figma
- Consistent spacing (4px grid)
- Typography scale
- Color palette
- Component variants and sizes

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Complete folder structure
- [API Documentation](./docs/api.md) - API endpoints (to be added)
- [Component Library](./docs/components.md) - UI components (to be added)

## 🚧 Development Status

- ✅ Project structure created
- ✅ Configuration files set up
- ⏳ Feature implementation in progress

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

# doc-vault-ui
