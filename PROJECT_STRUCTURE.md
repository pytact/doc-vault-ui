# DocValut - Complete Project Folder Structure

## 📋 TODO Summary

✅ **All tasks completed:**
1. ✅ Extracted all pages, screens, and features from project overview (F-001 through F-007)
2. ✅ Created root project structure following R1
3. ✅ Created feature-based module structure for all 7 features
4. ✅ Created Next.js App Router routing structure following R11
5. ✅ Created UI components structure following R16
6. ✅ Created theme structure following R12 and R13
7. ✅ Created services layer for API integration
8. ✅ Created validation schemas structure
9. ✅ Created global contexts structure
10. ✅ Created configuration files structure

---

## 🏗️ Complete Folder Structure

```
doc-vault/
├── app/                                    # Next.js App Router (R11)
│   ├── (auth)/                             # Auth route group
│   │   ├── login/                          # SCR_LOGIN
│   │   │   └── page.tsx
│   │   ├── logout/                         # SCR_LOGOUT_REDIRECT
│   │   │   └── page.tsx
│   │   └── invite/
│   │       └── [token]/                    # Dynamic route
│   │           ├── page.tsx                # SCR_INVITE_ACTIVATION_VALIDATE
│   │           ├── setup/
│   │           │   └── page.tsx            # SCR_ACCOUNT_SETUP
│   │           └── expired/
│   │               └── page.tsx            # SCR_INVITE_EXPIRED
│   │
│   ├── (dashboard)/                        # Protected dashboard route group
│   │   ├── dashboard/                      # Main dashboard
│   │   │   └── page.tsx
│   │   ├── documents/                      # F-003: Document Management
│   │   │   ├── page.tsx                    # Document list
│   │   │   ├── create/
│   │   │   │   └── page.tsx                # Create document
│   │   │   └── [id]/                       # Dynamic document route
│   │   │       ├── page.tsx                # Document detail
│   │   │       ├── edit/
│   │   │       │   └── page.tsx            # Edit document
│   │   │       └── share/
│   │   │           └── page.tsx            # F-004: Document sharing
│   │   └── settings/
│   │       ├── profile/
│   │       │   └── page.tsx                # SCR_PROFILE_SETTINGS
│   │       └── notifications/
│   │           └── page.tsx                # F-005: Notification settings
│   │
│   ├── (superadmin)/                       # SuperAdmin route group
│   │   ├── families/                       # SCR_FAMILY_LIST
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx                # MODAL_CREATE_FAMILY
│   │   │   └── [id]/                       # Dynamic family route
│   │   │       ├── page.tsx                # SCR_FAMILY_DETAIL
│   │   │       ├── edit/
│   │   │       │   └── page.tsx            # MODAL_EDIT_FAMILY_NAME
│   │   │       └── not-accessible/
│   │   │           └── page.tsx            # SCR_FAMILY_NOT_ACCESSIBLE
│   │   └── users/                           # SCR_USER_LIST (SuperAdmin view)
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx                # SCR_USER_DETAIL
│   │
│   ├── api/                                # API routes (Next.js API routes)
│   │   ├── auth/
│   │   ├── families/
│   │   ├── users/
│   │   ├── documents/
│   │   ├── categories/                     # F-002: Categories
│   │   ├── notifications/                  # F-005: Notifications
│   │   └── invitations/
│   │
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home/landing page
│   └── globals.css                         # Global styles
│
├── components/                             # Reusable components (R16)
│   ├── ui/                                 # UI Primitives (Layer 1)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Tabs.tsx
│   │   ├── Pagination.tsx
│   │   └── Form/                           # Form components
│   │
│   ├── common/                             # Shared common components (Layer 2)
│   │   ├── DocumentCard.tsx
│   │   ├── UserCard.tsx
│   │   ├── NotificationBadge.tsx
│   │   └── SearchBar.tsx
│   │
│   └── layout/                             # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── ProtectedRoute.tsx              # Route guard (R11)
│
├── modules/                                # Feature-based modules (R1)
│   ├── f001-identity/                     # F-001: Core Identity, Access & Organization
│   │   ├── components/                     # Feature-specific components
│   │   │   ├── UserList.tsx
│   │   │   ├── UserDetail.tsx
│   │   │   ├── FamilyList.tsx
│   │   │   ├── FamilyDetail.tsx
│   │   │   ├── InviteUserModal.tsx        # MODAL_INVITE_USER
│   │   │   ├── ManageUserRolesModal.tsx   # MODAL_MANAGE_USER_ROLES
│   │   │   ├── SoftDeleteUserModal.tsx    # MODAL_SOFT_DELETE_USER
│   │   │   ├── CreateFamilyModal.tsx       # MODAL_CREATE_FAMILY
│   │   │   ├── EditFamilyNameModal.tsx    # MODAL_EDIT_FAMILY_NAME
│   │   │   ├── DeleteFamilyModal.tsx      # MODAL_DELETE_FAMILY
│   │   │   ├── SoftDeleteFamilyModal.tsx # MODAL_SOFT_DELETE_FAMILY
│   │   │   ├── ChangePasswordModal.tsx    # MODAL_CHANGE_PASSWORD
│   │   │   ├── LoginForm.tsx
│   │   │   ├── AccountSetupForm.tsx
│   │   │   └── ProfileSettingsForm.tsx
│   │   ├── containers/                     # Container components (business logic)
│   │   │   ├── UserListContainer.tsx
│   │   │   ├── UserDetailContainer.tsx
│   │   │   ├── FamilyListContainer.tsx
│   │   │   ├── FamilyDetailContainer.tsx
│   │   │   ├── LoginContainer.tsx
│   │   │   ├── AccountSetupContainer.tsx
│   │   │   └── ProfileSettingsContainer.tsx
│   │   ├── hooks/                          # Feature-specific hooks
│   │   │   ├── useUsers.ts
│   │   │   ├── useFamilies.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useInvitations.ts
│   │   │   └── useRoles.ts
│   │   └── types/                          # Feature-specific types
│   │       ├── user.types.ts
│   │       ├── family.types.ts
│   │       └── auth.types.ts
│   │
│   ├── f002-categories/                    # F-002: Categories & Subcategories
│   │   ├── components/
│   │   │   ├── CategorySelect.tsx
│   │   │   └── SubcategorySelect.tsx
│   │   ├── containers/
│   │   ├── hooks/
│   │   │   └── useCategories.ts
│   │   └── types/
│   │       └── category.types.ts
│   │
│   ├── f003-documents/                     # F-003: Document Management
│   │   ├── components/
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentDetail.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── DocumentSearch.tsx
│   │   │   └── DocumentFilters.tsx
│   │   ├── containers/
│   │   │   ├── DocumentListContainer.tsx
│   │   │   ├── DocumentDetailContainer.tsx
│   │   │   └── DocumentUploadContainer.tsx
│   │   ├── hooks/
│   │   │   ├── useDocuments.ts
│   │   │   └── useDocumentUpload.ts
│   │   └── types/
│   │       └── document.types.ts
│   │
│   ├── f004-sharing/                       # F-004: Document Sharing
│   │   ├── components/
│   │   │   ├── ShareDocumentModal.tsx
│   │   │   └── AccessTypeSelector.tsx
│   │   ├── containers/
│   │   │   └── ShareDocumentContainer.tsx
│   │   ├── hooks/
│   │   │   └── useDocumentSharing.ts
│   │   └── types/
│   │       └── sharing.types.ts
│   │
│   ├── f005-notifications/                 # F-005: Expiry Notification System
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationBadge.tsx
│   │   │   └── ExpiryAlert.tsx
│   │   ├── containers/
│   │   │   └── NotificationContainer.tsx
│   │   ├── hooks/
│   │   │   └── useNotifications.ts
│   │   └── types/
│   │       └── notification.types.ts
│   │
│   ├── f006-dashboard/                     # F-006: Web UI (Dashboard)
│   │   ├── components/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RecentDocuments.tsx
│   │   │   └── UpcomingExpiries.tsx
│   │   ├── containers/
│   │   │   └── DashboardContainer.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   └── types/
│   │
│   └── f007-superadmin/                    # F-007: SuperAdmin Console
│       ├── components/
│       │   ├── SuperAdminDashboard.tsx
│       │   └── SoftDeletedEntities.tsx
│       ├── containers/
│       ├── hooks/
│       └── types/
│
├── services/                               # API service layer (R4, R8)
│   ├── api/                                # Base API client
│   │   ├── client.ts                       # HTTP client (Axios/Fetch)
│   │   ├── interceptors.ts
│   │   └── types.ts
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── session.service.ts
│   ├── families/
│   │   └── family.service.ts
│   ├── users/
│   │   └── user.service.ts
│   ├── documents/
│   │   └── document.service.ts
│   ├── categories/
│   │   └── category.service.ts
│   ├── notifications/
│   │   └── notification.service.ts
│   └── invitations/
│       └── invitation.service.ts
│
├── validations/                            # Zod validation schemas (R10)
│   ├── f001-identity/
│   │   ├── user.validation.ts
│   │   ├── family.validation.ts
│   │   ├── auth.validation.ts
│   │   └── invitation.validation.ts
│   ├── f003-documents/
│   │   └── document.validation.ts
│   ├── f004-sharing/
│   │   └── sharing.validation.ts
│   └── f005-notifications/
│       └── notification.validation.ts
│
├── contexts/                               # Global React contexts (R6, R7)
│   ├── auth.context.tsx                    # Authentication context
│   ├── family.context.tsx                 # Family context
│   ├── notification.context.tsx            # Notification context
│   └── theme.context.tsx                   # Theme context (dark/light)
│
├── hooks/                                  # Global custom hooks (R5)
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useQuery.ts                         # React Query wrapper
│   └── useMutation.ts                      # React Query mutation wrapper
│
├── types/                                  # Global TypeScript types
│   ├── requests/                           # API request types
│   │   ├── user.requests.ts
│   │   ├── family.requests.ts
│   │   ├── document.requests.ts
│   │   └── auth.requests.ts
│   ├── responses/                          # API response types
│   │   ├── user.responses.ts
│   │   ├── family.responses.ts
│   │   ├── document.responses.ts
│   │   └── auth.responses.ts
│   ├── entities/                           # Domain entity types
│   │   ├── user.entity.ts
│   │   ├── family.entity.ts
│   │   ├── document.entity.ts
│   │   └── role.entity.ts
│   └── component/                          # Component prop types
│       └── ui.types.ts
│
├── utils/                                  # Utility functions
│   ├── formatting/
│   │   ├── date.formatter.ts
│   │   ├── currency.formatter.ts
│   │   └── text.formatter.ts
│   ├── validation/
│   │   └── validators.ts
│   ├── date/
│   │   └── date.utils.ts
│   └── routing/
│       └── routes.ts                       # Route helper constants (R11)
│
├── constants/                              # Application constants
│   ├── routes/
│   │   └── routes.ts                       # Route paths (R11)
│   ├── permissions/
│   │   └── permissions.ts                  # RBAC permissions
│   └── roles/
│       └── roles.ts                         # Role definitions
│
├── theme/                                  # Design system (R12, R13)
│   ├── tokens/                             # Design tokens
│   │   ├── colors.ts                       # Color tokens
│   │   ├── typography.ts                   # Typography tokens
│   │   ├── spacing.ts                      # Spacing tokens (4px grid)
│   │   ├── radius.ts                       # Border radius tokens
│   │   └── shadows.ts                      # Shadow tokens
│   └── styles/
│       ├── globals.css                     # Global base styles
│       └── utilities.css                   # Utility classes
│
├── public/                                 # Static assets
│   ├── images/
│   └── icons/
│
├── .env.example                            # Environment variables template
├── .env.local                              # Local environment (gitignored)
├── next.config.ts                           # Next.js configuration
├── tailwind.config.ts                      # Tailwind CSS configuration (R13)
├── tsconfig.json                           # TypeScript configuration
├── package.json                            # Dependencies
├── .eslintrc.json                          # ESLint configuration
├── .prettierrc                             # Prettier configuration
└── README.md                                # Project documentation
```

---

## 📊 Feature Breakdown

### F-001: Core Identity, Access & Organization
**Screens (19 total):**
- ✅ SCR_USER_LIST
- ✅ SCR_USER_DETAIL
- ✅ SCR_INVITE_ACTIVATION_VALIDATE
- ✅ SCR_INVITE_EXPIRED
- ✅ SCR_ACCOUNT_SETUP
- ✅ SCR_LOGIN
- ✅ SCR_LOGOUT_REDIRECT
- ✅ SCR_FAMILY_LIST
- ✅ SCR_FAMILY_DETAIL
- ✅ SCR_FAMILY_NOT_ACCESSIBLE
- ✅ SCR_PROFILE_SETTINGS
- ✅ MODAL_INVITE_USER
- ✅ MODAL_MANAGE_USER_ROLES
- ✅ MODAL_SOFT_DELETE_USER
- ✅ MODAL_CREATE_FAMILY
- ✅ MODAL_EDIT_FAMILY_NAME
- ✅ MODAL_DELETE_FAMILY
- ✅ MODAL_SOFT_DELETE_FAMILY
- ✅ MODAL_CHANGE_PASSWORD

### F-002: Categories & Subcategories
- Category/Subcategory selection components
- Fixed taxonomy (15 categories, 78 subcategories)

### F-003: Document Management
- Document list, detail, create, edit
- Upload functionality
- Search and filters
- Soft delete

### F-004: Document Sharing
- Share document modal
- Viewer/Editor access type assignment
- Access management

### F-005: Expiry Notification System
- Notification list
- In-app alerts
- Email notification settings

### F-006: Web UI (Dashboard)
- Main dashboard
- Stats and overview
- Recent documents
- Upcoming expiries

### F-007: SuperAdmin Console
- Family management
- User management
- Soft-deleted entities monitoring

---

## 🎯 Architecture Principles Applied

### ✅ R1 - Project Structure
- Feature-based module organization
- Clear separation of concerns
- Standard naming conventions

### ✅ R11 - Routing
- Next.js App Router with route groups
- Dynamic routes using `[id]` pattern
- Protected routes with route guards
- 4-page structure (list, create, detail, edit)

### ✅ R12 - Figma Design Integration
- Design tokens in `theme/tokens/`
- Pixel-perfect implementation structure
- UI primitives in `components/ui/`

### ✅ R13 - Styling
- Tailwind CSS architecture
- Token-driven styling
- Component-level styling
- No inline styles

### ✅ R16 - Reusable Components
- UI primitives in `components/ui/`
- Feature components in `modules/*/components/`
- Container components in `modules/*/containers/`
- No duplication

---

## 🚀 Next Steps

1. **Initialize Next.js project** with TypeScript
2. **Install dependencies** (React Query, Zod, Tailwind, etc.)
3. **Set up design tokens** from Figma
4. **Create base UI primitives** (Button, Input, Modal, etc.)
5. **Implement authentication flow** (F-001)
6. **Build feature modules** sequentially (F-001 → F-007)

---

**Structure created successfully!** ✅

