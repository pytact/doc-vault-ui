/**
 * Profile Settings Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React from "react";
import { ProfileFormContainer } from "../forms/profile.form.container";
import { useModalState } from "@/hooks/useModalState";
import { ChangePasswordFormContainer } from "../forms/changePassword.form.container";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";

/**
 * Profile settings container component
 * Handles business logic and API calls via hooks
 */
export function ProfileSettingsContainer() {
  const changePasswordModal = useModalState();

  const handleChangePassword = () => {
    changePasswordModal.open();
  };

  const handleChangePasswordSuccess = () => {
    changePasswordModal.close();
  };

  return (
    <>
      <ProfileFormContainer onChangePassword={handleChangePassword} />

      <Modal open={changePasswordModal.isOpen} onOpenChange={changePasswordModal.close}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Change Password</ModalTitle>
          </ModalHeader>
          <ChangePasswordFormContainer
            onSuccess={handleChangePasswordSuccess}
            onCancel={changePasswordModal.close}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

