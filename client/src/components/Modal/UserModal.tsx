import { useAuth } from "@/contexts/AuthContext";
import type { UploadResponse, UserUpdateRequestDTO } from "@/dto/DTOs";
import FileUploadService from "@/services/FileUploadService";
import UserService from "@/services/UserService";
import { fillRecipientDetailsOnUser, getStorageURL, handleAPIRequest } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useEffect, useState, type ChangeEvent } from "react";
import Modal from "../Modal";
import { theme } from "@/config/theme";
import type { User } from "@/types/User";

export default function UserModal({ setIsModalOpen }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { user, setUser } = useAuth();
  const [fullname, setFullname] = useState<string>(user?.fullname ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    if (user?.avatar) setAvatar(getStorageURL(user.avatar));
  }, [user])

  const updateUser = async () => {
    const response: UploadResponse[] = await FileUploadService.uploadFiles(avatarFile ? [avatarFile] : []);

    const updatedUser = await UserService.updateUser({
      fullname,
      ...(response.length > 0 ? { avatarFile: response[0] } : {})
    } as UserUpdateRequestDTO)

    return updatedUser;
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user === null) return;

    const updatedUser: User = await handleAPIRequest(async () => {
      return await updateUser();
    }, setIsLoading)

    setUser(fillRecipientDetailsOnUser(updatedUser));

    SatToast.alert("Update successfull!", ToastType.SUCCESS);
  }

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
    // console.log(file, URL.createObjectURL(file));
  }

  return (
    <Modal transparency="MEDIUM" setIsModalOpen={setIsModalOpen}>
      <form onSubmit={onSubmit} className={`w-full max-w-lg rounded-lg shadow-lg ${theme.colors.background}`}>
        {/* Header */}
        <div className={`border-b ${theme.colors.border} px-5 py-4`}>
          <h2 className={`text-lg font-semibold ${theme.colors.text}`}>
            Profile
          </h2>
          <p className={`mt-1 text-sm ${theme.colors.muted}`}>
            View and update your profile information.
          </p>
        </div>

        {/* Content */}
        <div className={`px-5 py-4`}>
          {/* Profile picture */}
          <div className={`flex justify-center`}>
            <label
              htmlFor="profile-picture"
              className={`group relative ${theme.profile.background} h-28 w-28 flex justify-center items-center cursor-pointer overflow-hidden rounded-full border-2 ${theme.colors.border}`}
            >
              {
                avatar !== null ? <img
                  src={avatar}
                  alt="Profile"
                  className={`h-full w-full object-cover`}
                /> : <p className={`font-bold text-xl text-white`}>{user?.name.slice(0, 2).toUpperCase()}</p>
              }

              {/* Hover overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100`}>
                <span className={`text-sm font-medium ${theme.colors.text_alt}`}>
                  Change
                </span>
              </div>
            </label>

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className={`hidden`}
              onChange={onAvatarChange}
            />
          </div>

          {/* Profile information */}
          <div className={`mt-6 space-y-4`}>
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

            {/* Full name */}
            <div className={`border-t ${theme.colors.border} pt-5`}>
              <label
                htmlFor="fullname"
                className={`block text-sm font-medium ${theme.colors.muted}`}
              >
                Full name
              </label>

              <input
                required
                id="fullname"
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(ev) => setFullname(ev.target.value)}
                className={`${theme.predefined_inputs.normal}`}
              />
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

          <button
            disabled={isLoading}
            type="submit"
            className={`${theme.buttons.secondary}`}
          >
            {
              isLoading ? <div className={`w-4 h-4 border-4 rounded-full animate-spin ${theme.predefined.loading}`} /> :
                "Update"
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}
