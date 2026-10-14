import type { Recipient } from "@/types/Recipient";
import { getStorageURL } from "@/utils/helper";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { theme } from "@/config/theme";

export default function UserPreviewModal({ user, setIsModalOpen }: { user: Recipient, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    if (user?.avatar) setAvatar(getStorageURL(user.avatar));
  }, [user])

  return (
    <Modal transparency="MEDIUM" setIsModalOpen={setIsModalOpen}>
      <div className={`w-full max-w-lg rounded-lg ${theme.colors.background} shadow-lg`}>
        {/* Header */}
        <div className={`border-b ${theme.colors.border} px-5 py-4`}>
          <h2 className={`text-lg font-semibold ${theme.colors.text}`}>
            Profile
          </h2>
          <p className={`mt-1 text-sm ${theme.colors.muted}`}>
            profile information.
          </p>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {/* Profile picture */}
          <div className="flex justify-center">
            <div
              className={`group relative ${theme.profile.background} h-28 w-28 flex justify-center items-center overflow-hidden rounded-full border-2 ${theme.colors.border}`}
            >
              {
                avatar !== null ? <img
                  src={avatar}
                  alt="Profile"
                  className={`h-full w-full object-cover`}
                /> : <p className={`font-bold text-xl text-white`}>{user?.name.slice(0, 2).toUpperCase()}</p>
              }
            </div>
          </div>

          {/* Profile information */}
          <div className="mt-6 space-y-4">
            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Fullname
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {user?.fullname ?? "-"}
              </p>
            </div>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Username
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {user?.name ?? "-"}
              </p>
            </div>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Email
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {user?.email ?? "-"}
              </p>
            </div>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Joined
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 border-t ${theme.colors.border} px-5 py-3`}>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className={`${theme.buttons.secondary_alt}`}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
