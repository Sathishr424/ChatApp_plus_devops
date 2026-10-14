export interface RecipientRaw {
  id: number,
  unread_count: number | null,
  last_message_id: number | null,
  last_message: string | null,
  last_message_deleted: boolean | null,
  last_message_edited: boolean | null,
  last_message_gif: string | null,
  last_message_attachments: number | null,
  last_updated: Date | null
  updatedAt: Date,
  createdAt: Date,
}
