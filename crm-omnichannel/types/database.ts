export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
  company_id: string | null
  onboarding_completed_at: string | null
  created_at: string
  updated_at: string
}

export type Channel = {
  id: string
  company_id: string
  name: string
  type: 'whatsapp' | 'instagram' | 'email' | 'website' | string
  config: Record<string, unknown>
  active: boolean
  created_at: string
  updated_at: string
}

export type Contact = {
  id: string
  company_id: string
  name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  company_id: string
  contact_id: string
  channel_id: string
  status: 'open' | 'resolved' | 'pending' | string
  last_message_at: string | null
  created_at: string
  updated_at: string
  contact?: Contact
  channel?: Channel
}

export type Message = {
  id: string
  company_id: string
  conversation_id: string
  content: string
  direction: 'inbound' | 'outbound'
  created_at: string
  updated_at: string
}

export type PipelineStage = {
  id: string
  company_id: string
  name: string
  order: number
  color: string | null
  created_at: string
}

export type Deal = {
  id: string
  company_id: string
  contact_id: string
  stage_id: string
  title: string
  value: number | null
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  company_id: string
  contact_id: string | null
  conversation_id: string | null
  content: string
  created_at: string
}

export type Tag = {
  id: string
  company_id: string
  name: string
  color: string | null
}

export type ContactTag = {
  contact_id: string
  tag_id: string
}

export type CustomFieldDefinition = {
  id: string
  company_id: string
  entity_type: string
  field_name: string
  field_type: string
  required: boolean
  created_at: string
}
