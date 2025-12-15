/**
 * Profile Settings Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React from "react";
import { ProfileDisplay } from "../components/ProfileDisplay";
import { ProfileFormContainer } from "../forms/profile.form.container";
import { useModalState } from "@/hooks/useModalState";
import { ChangePasswordFormContainer } from "../forms/changePassword.form.container";
import { Modal } from "@/components/ui/modal";
import { useProfile } from "../hooks/useProfile";

/**
 * Profile settings container component
 * Handles business logic and API calls via hooks
 */
export function ProfileSettingsContainer() {
  const { data: profileData, isLoading } = useProfile();
  const editModal = useModalState();
  const changePasswordModal = useModalState();

  const handleEdit = () => {
    editModal.open();
  };

  const handleEditSuccess = () => {
    editModal.close();
  };

  const handleChangePassword = () => {
    changePasswordModal.open();
  };

  const handleChangePasswordSuccess = () => {
    changePasswordModal.close();
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData?.data?.data) {
    return <div>Profile not found</div>;
  }

  return (
    <>
      <ProfileDisplay
        name={profileData.data.data.name}
        email={profileData.data.data.email}
        onEdit={handleEdit}
        onChangePassword={handleChangePassword}
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Profile"
      >
        <div className="p-1">
          <ProfileFormContainer
            onSuccess={handleEditSuccess}
            onCancel={editModal.close}
          />
        </div>
      </Modal>

      <Modal
        isOpen={changePasswordModal.isOpen}
        onClose={changePasswordModal.close}
        title="Change Password"
      >
        <div className="p-1">
          <ChangePasswordFormContainer
            onSuccess={handleChangePasswordSuccess}
            onCancel={changePasswordModal.close}
          />
        </div>
      </Modal>
    </>
  );
}

