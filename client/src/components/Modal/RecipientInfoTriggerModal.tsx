import { useState, type ReactNode } from "react";
import ModalWrapper from "./ModalWrapper";
import UserPreviewModal from "./UserPreviewModal";
import type { Recipient } from "@/types/Recipient";
import GroupPreviewModal from "./GroupPreviewModal";

export default function RecipientInfoTriggerModal({
  children,
  user,
}: {
  user: Recipient;
  children: ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>
        {children}
      </div>

      <ModalWrapper isModalOpen={isModalOpen}>
        {
          user.is_group ? <GroupPreviewModal setIsModalOpen={setIsModalOpen} group={user} />
          : <UserPreviewModal setIsModalOpen={setIsModalOpen} user={user} />
        }
      </ModalWrapper>
    </>
  );
}
