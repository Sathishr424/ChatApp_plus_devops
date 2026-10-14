import usePagination from "@/hooks/UsePagination";
import { type GroupFields, type Pagination } from "@/interfaces";
import UserService from "@/services/UserService";
import { type User } from "@/types/User";
import { getStorageURL, isScrollBarAtBottom } from "@/utils/helper";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent, type SubmitEvent } from "react";
import Modal from "../Modal";
import { theme } from "@/config/theme";

export default function GroupModal({ isLoading, onSubmit, isCreate, fields, setFields, setIsModalOpen }: { isLoading: boolean, isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>, fields: GroupFields, setFields: React.Dispatch<React.SetStateAction<GroupFields>>, isCreate: boolean }) {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    if (fields?.avatar) setAvatar(getStorageURL(fields.avatar));
  }, [])

  const [focused, setFocused] = useState(false);
  const membersContainerRef = useRef<HTMLDivElement | null>(null);
  const fetch = async (search: string, pagination: Pagination) => {
    return await UserService.searchUsers(search, pagination);
  }
  const { fetchMore, data, search, setSearch } = usePagination<User>(fetch);

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    if (isScrollBarAtBottom(container)) {
      fetchMore();
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    if (search.length > 0) setFocused(true);
  }, [search])

  const onDataChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Node;
    if (!membersContainerRef.current?.contains(target)) {
      setFocused(false);
    }
  }

  const toggleSelection = (user: User) => {
    setFields(prev => {
      const members = new Map(prev.members);
      if (members.has(user.id)) members.delete(user.id);
      else members.set(user.id, user);

      return {
        ...prev,
        members
      }
    });
  }

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFields(prev => ({
      ...prev,
      avatarFile: file
    }));
    setAvatar(URL.createObjectURL(file));
    // console.log(file, URL.createObjectURL(file));
  }

  return (
    <Modal
      setIsModalOpen={setIsModalOpen}
      handleModalClick={handleClick}
    >
      <div className={`w-full max-w-lg rounded-lg ${theme.colors.background} shadow-lg`}>
        {/* Header */}
        <div className={`border-b ${theme.colors.border} px-5 py-4`}>
          <h2 className={`text-lg font-semibold ${theme.colors.text}`}>
            {isCreate ? "Create Group" : "Update Group"}
          </h2>

          <p className={`mt-1 text-sm ${theme.colors.muted}`}>
            {isCreate
              ? "Create a group and add members to start chatting."
              : "Update the group name and manage its members."}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
        >
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
                /> : <p className={`font-bold text-xl text-white`}>{fields.name.slice(0, 2).toUpperCase()}</p>
              }

              {/* Hover overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100`}>
                <span className={`text-sm font-medium text-white`}>
                  Change
                </span>
              </div>
            </label>

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>
          {/* Group information */}
          <div className={`px-5 py-4`}>
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${theme.colors.text}`}
              >
                Group name
              </label>

              <input
                id="name"
                required
                placeholder="Enter group name"
                className={`${theme.predefined_inputs.normal}`}
                type="text"
                name="name"
                value={fields.name}
                onChange={onDataChange}
              />
            </div>

            {/* Members */}
            <div className={`mt-6 border-t ${theme.colors.border} pt-5`}>
              <label
                htmlFor="member_search"
                className={`block text-sm font-medium ${theme.colors.text}`}
              >
                Members
              </label>

              <div
                className="relative mt-2"
                ref={membersContainerRef}
              >
                <input
                  id="member_search"
                  placeholder="Search users..."
                  className={`${theme.predefined_inputs.normal}`}
                  type="text"
                  name="member_search"
                  value={search}
                  onChange={(ev) => setSearch(ev.target.value)}
                />

                {/* Search results */}
                {focused && data.length > 0 && (
                  <div
                    onScroll={handleScroll}
                    className={`absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-md border ${theme.colors.border} ${theme.colors.background} shadow-md`}
                  >
                    {data.map((row) => {
                      const selected = fields.members.has(row.id);

                      return (
                        <div
                          key={row.id}
                          onClick={() => toggleSelection(row)}
                          className={`cursor-pointer border-b border-gray-100 px-3 py-2 text-sm transition last:border-b-0 hover:bg-gray-100 ${selected ? `bg-blue-50 text-blue-700` : `${theme.colors.text}`}`}
                        >
                          <div className={`flex items-center justify-between`}>
                            <span>{row.username}</span>

                            {selected && (
                              <span className={`text-xs font-medium`}>
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Selected members */}
            <div className={`mt-5`}>
              <p className={`text-sm font-medium ${theme.colors.text}`}>
                Selected members
              </p>

              {fields.members.size > 0 ? (
                <div className={`mt-2 flex flex-wrap gap-2`}>
                  {Array.from(fields.members.keys()).map((id) => {
                    const member = fields.members.get(id);

                    if (!member) return null;

                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700`}
                      >
                        <span>{member.username}</span>

                        <button
                          type="button"
                          onClick={() => toggleSelection(member)}
                          className={`cursor-pointer text-blue-500 transition hover:text-red-500`}
                          aria-label={`Remove ${member.username}`}
                        >
                          <FontAwesomeIcon
                            className="text-sm"
                            icon={faXmarkCircle}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={`mt-2 text-sm text-gray-400`}>
                  No members selected.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end gap-2 border-t ${theme.colors.border} px-5 py-3`}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`${theme.buttons.secondary_alt}`}
            >
              {isCreate ? "Cancel" : "Close"}
            </button>

            <button
              disabled={isLoading}
              type="submit"
              className={`${theme.buttons.secondary}`}
            >
              {
                isLoading ? <div className={`w-4 h-4 border-4 rounded-full animate-spin ${theme.predefined.loading}`} /> :
                  isCreate ? "Create Group" : "Save Changes"
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
