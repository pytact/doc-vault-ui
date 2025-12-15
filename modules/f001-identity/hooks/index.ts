/**
 * F-001 Identity Hooks
 * Central export for all identity-related hooks
 */

// API Hooks
export { useLogin, useLogout } from "./useAuth";
export {
  useUserListAll,
  useUserList,
  useUser,
  useInviteUser,
  useSoftDeleteUser,
  useUpdateUserRoles,
} from "./useUsers";
export {
  useFamilyList,
  useFamily,
  useCreateFamily,
  useUpdateFamily,
  useDeleteFamily,
} from "./useFamilies";
export { useProfile, useUpdateProfile, useChangePassword } from "./useProfile";
export {
  useCreateInvitation,
  useValidateInvitation,
  useActivateAccount,
} from "./useInvitations";

// Business Logic Hooks
export { useUserPermissions } from "./useUserPermissions";
export { useFamilyPermissions } from "./useFamilyPermissions";
export { useRoleManagement } from "./useRoleManagement";
export { useActivationStatus } from "./useActivationStatus";

// Data Transformation Hooks
export { useUserListTransform } from "./useUserListTransform";
export { useUserDetailTransform } from "./useUserDetailTransform";
export { useFamilyListTransform } from "./useFamilyListTransform";

// Validation Hooks
export { useEmailValidation } from "./useEmailValidation";
export { usePasswordValidation } from "./usePasswordValidation";

// Form Hooks
export { useLoginForm, type LoginFormSchema } from "./useLoginForm";
export { useProfileForm, type ProfileFormSchema } from "./useProfileForm";
export { useFamilyForm, type FamilyFormSchema } from "./useFamilyForm";
export {
  useInviteUserForm,
  type InviteUserFormSchema,
} from "./useInviteUserForm";
export {
  useAccountSetupForm,
  type AccountSetupFormSchema,
} from "./useAccountSetupForm";
export {
  useChangePasswordForm,
  type ChangePasswordFormSchema,
} from "./useChangePasswordForm";

