/**
 * Data models for the Hipcall REST API v3.
 */

export interface Meta {
  count: number;
  limit: number;
  offset: number;
}

export interface Call {
  uuid: string;
  started_at: string;
  ended_at: string;
  direction: string;
  call_duration?: number | null;
  first_touch_duration?: number | null;
  missing_call?: boolean | null;
  answered_at?: string | null;
  bridged_at?: string | null;
}

export interface CallDetail {
  uuid: string;
  started_at: string;
  ended_at: string;
  direction: string;
  call_duration?: number | null;
  first_touch_duration?: number | null;
  missing_call?: boolean | null;
  answered_at?: string | null;
  bridged_at?: string | null;
  caller_id?: number | null;
  contact_id?: number | null;
  credited?: boolean | null;
  related_id?: number | null;
  related_type?: string | null;
  channel_type?: string | null;
  number_id?: number | null;
  caller_number?: string | null;
  voicemail_id?: number | null;
  voicemail_type?: string | null;
  hangup_by?: string | null;
  missing_call_reason?: string | null;
  caller_type?: string | null;
  callee_id?: number | null;
  voicemail_url?: string | null;
  channel_id?: number | null;
  user_id?: number | null;
  callee_number?: string | null;
  call_flow?: Record<string, any>[] | any[] | string | null;
  record_url?: string | null;
  callback_time?: string | null;
  callback_cdr_uuid?: string | null;
  callee_type?: string | null;
  callback_user_id?: number | null;
}

export interface CallListResponse {
  data: Call[];
  meta: Meta;
}

export interface CallDetailResponse {
  data: CallDetail;
}

export interface CallAndBridge {
  id: string;
}

export interface CallAndBridgeResponse {
  data: CallAndBridge;
}

export interface Task {
  id: number;
  name: string;
  description?: string | null;
  done: boolean;
  done_at?: string | null;
}

export interface TaskListResponse {
  data: Task[];
  meta: Meta;
}

export interface TaskCreate {
  name: string;
  description?: string | null;
  assign_to_user_id?: number | null;
  auto_assign_to_user?: boolean | null;
  company_ids?: number[] | null;
  contact_ids?: number[] | null;
  deal_ids?: number[] | null;
  due_date?: string | null;
  priority?: string | null;
  task_list_id?: number | null;
}

export interface TaskResponse {
  data: Task;
}

export interface TaskDetail {
  id: number;
  name: string;
  description?: string | null;
  done: boolean;
  done_at?: string | null;
  assign_to_user_id?: number | null;
  auto_assign_to_user?: boolean | null;
  company_ids?: number[] | null;
  contact_ids?: number[] | null;
  deal_ids?: number[] | null;
  due_date?: string | null;
  priority?: string | null;
  task_list_id?: number | null;
}

export interface TaskDetailResponse {
  data: TaskDetail;
}

export interface CountMeta {
  count: number;
}

export interface UserSummary {
  id: number;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
}

export interface NamedAttribute {
  id?: number | null;
  name?: string | null;
}

export interface Phone {
  number: string;
  id?: number | null;
  country?: string | null;
  order?: number | null;
}

export interface PhoneInput {
  number: string;
  country: string;
}

export interface PhoneRequest {
  phones: PhoneInput[];
}

export interface PhoneListResponse {
  data: Phone[];
  meta?: Record<string, any> | null;
}

export interface Email {
  email: string;
  order?: number | null;
}

export interface EmailInput {
  email: string;
}

export interface EmailRequest {
  emails: string[];
}

export interface EmailListResponse {
  data: Email[];
  meta?: Record<string, any> | null;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  color_name: string;
  description?: string | null;
}

export interface TagResponse {
  data: Tag;
}

export interface TagListResponse {
  data: Tag[];
  meta?: Meta | null;
}

export interface TagCreate {
  tag_id: number;
}

export interface Comment {
  id: number;
  content: string;
  user?: UserSummary | null;
}

export interface CommentResponse {
  data: Comment;
}

export interface CommentListResponse {
  data: Comment[];
  meta?: Meta | null;
}

export interface CommentCreate {
  content: string;
}

export interface AssignRequest {
  assign_to_user_id?: number | null;
}

export interface CustomFieldDefinition {
  name: string;
  slug: string;
  field_type: string;
  active: boolean;
  position: number;
  required: boolean;
  number_type?: string | null;
  options?: string[] | null;
}

export interface CustomFieldDefinitionListResponse {
  data: CustomFieldDefinition[];
  meta?: CountMeta | null;
}

export interface EmployeeSizeOption {
  value: string;
  label: string;
}

export interface EmployeeSizeListResponse {
  data: EmployeeSizeOption[];
  meta?: CountMeta | null;
}

export interface LifeCycle {
  id: number;
  name: string;
  order?: number | null;
}

export interface LifeCycleListResponse {
  data: LifeCycle[];
  meta?: Meta | null;
}

export interface SectorListResponse {
  data: NamedAttribute[];
  meta?: Meta | null;
}

export interface SourceListResponse {
  data: NamedAttribute[];
  meta?: Meta | null;
}

export interface AttributeGroup {
  data?: Record<string, any>[];
  count?: number | null;
  truncated?: boolean | null;
}

export interface ContactCenterAttributes {
  employee_sizes?: AttributeGroup | null;
  life_cycles?: AttributeGroup | null;
  sectors?: AttributeGroup | null;
  sources?: AttributeGroup | null;
}

export interface ContactCenterAttributesResponse {
  data: ContactCenterAttributes;
}

export interface ContactCompany {
  id?: number | null;
  name?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
}

export interface Contact {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  job_title?: string | null;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  emails?: Email[] | null;
  phones?: Phone[] | null;
  company?: ContactCompany | null;
  user?: UserSummary | null;
  life_cycle?: NamedAttribute | null;
  sector?: NamedAttribute | null;
  source?: NamedAttribute | null;
  custom_fields?: Record<string, any> | null;
}

export interface ContactResponse {
  data: Contact;
}

export interface ContactListResponse {
  data: Contact[];
  meta: Meta;
}

export interface ContactCreate {
  first_name: string;
  last_name?: string | null;
  job_title?: string | null;
  company_id?: number | null;
  assign_to_user_id?: number | null;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  life_cycle_id?: number | null;
  sector_id?: number | null;
  source_id?: number | null;
  custom_fields?: Record<string, any> | null;
  phones?: PhoneInput[] | null;
  emails?: EmailInput[] | null;
}

export interface ContactUpdate {
  first_name?: string | null;
  last_name?: string | null;
  job_title?: string | null;
  company_id?: number | null;
  assign_to_user_id?: number | null;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  life_cycle_id?: number | null;
  sector_id?: number | null;
  source_id?: number | null;
  custom_fields?: Record<string, any> | null;
}

export interface ConsentEvidence {
  note: string;
}

export interface Consent {
  id: number;
  action: string;
  purpose: string;
  source?: string | null;
  performed_at?: string | null;
  expires_at?: string | null;
  evidence?: Record<string, any> | null;
  text_version?: string | null;
}

export interface ConsentResponse {
  data: Consent;
}

export interface ConsentListResponse {
  data: Consent[];
}

export interface ConsentCreate {
  action: string;
  evidence: ConsentEvidence;
  expires_at?: string | null;
}

export interface CompanyContact {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  job_title?: string | null;
}

export interface Company {
  id: number;
  name: string;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  employee_size?: string | null;
  emails?: Email[] | null;
  phones?: Phone[] | null;
  contacts?: CompanyContact[] | null;
  user?: UserSummary | null;
  life_cycle?: NamedAttribute | null;
  sector?: NamedAttribute | null;
  source?: NamedAttribute | null;
  custom_fields?: Record<string, any> | null;
}

export interface CompanyResponse {
  data: Company;
}

export interface CompanyListResponse {
  data: Company[];
  meta: Meta;
}

export interface CompanyCreate {
  name: string;
  description?: string | null;
  assign_to_user_id?: number | null;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  employee_size?: string | null;
  life_cycle_id?: number | null;
  sector_id?: number | null;
  source_id?: number | null;
  custom_fields?: Record<string, any> | null;
  phones?: PhoneInput[] | null;
  emails?: EmailInput[] | null;
}

export interface CompanyUpdate {
  name?: string | null;
  external_id?: string | null;
  custom_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  employee_size?: string | null;
  life_cycle_id?: number | null;
  sector_id?: number | null;
  source_id?: number | null;
  custom_fields?: Record<string, any> | null;
}

export interface LookupData {
  contacts: Contact[];
  companies: Company[];
}

export interface LookupByEmailResponse {
  data: LookupData;
}

export interface LookupByPhoneResponse {
  data: LookupData;
}

export interface Inbox {
  id: string;
  name: string;
  description?: string | null;
  type?: string | null;
  user_case?: string | null;
  whatsapp_calls_enabled?: boolean | null;
}

export interface InboxResponse {
  data: Inbox;
}

export interface InboxListResponse {
  data: Inbox[];
  meta?: Meta | null;
}

export interface InboxUpdate {
  whatsapp_calls_enabled: boolean;
}

export interface ConversationContactInfo {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
}

export interface Conversation {
  id: string;
  inbox_id: string;
  status: string;
  last_activity_at: string;
  contact_id?: number | null;
  company_id?: number | null;
  assignee_id?: number | null;
  unread_count?: number | null;
  last_message_preview?: string | null;
  contact_info?: ConversationContactInfo | null;
  answered_at?: string | null;
  bridged_at?: string | null;
  closed_at?: string | null;
}

export interface ConversationResponse {
  data: Conversation;
}

export interface ConversationListResponse {
  data: Conversation[];
  meta: Meta;
}

export interface ConversationUpdate {
  assignee_id?: number | null;
  contact_id?: number | null;
  company_id?: number | null;
  status?: string | null;
}

export interface Message {
  id?: string | null;
  conversation_id?: string | null;
  type?: string | null;
  direction?: string | null;
  author?: string | null;
  user_id?: number | null;
  state?: string | null;
  payload?: Record<string, any> | null;
  media_url?: string | null;
  error_code?: number | null;
  inserted_at?: string | null;
  updated_at?: string | null;
}

export interface MessageResponse {
  data: Message;
}

export interface MessageListResponse {
  data: Message[];
  meta: Meta;
}

export interface TextMessageCreate {
  text: string;
}

export interface TemplateHeaderMedia {
  url: string;
  filename?: string | null;
}

export interface TemplateMessageCreate {
  element_name: string;
  language_code: string;
  to: string;
  conversation_id?: string | null;
  header_media?: TemplateHeaderMedia | null;
  opens_conversation?: boolean | null;
  variables?: Record<string, string> | null;
}

export interface TemplateMessage {
  id: string;
  element_name: string;
  language_code: string;
  to: string;
  state: string;
  gsm_id?: string | null;
  category?: string | null;
  inserted_at?: string | null;
  contact_id?: number | null;
  company_id?: number | null;
  conversation_id?: string | null;
  message_id?: string | null;
}

export interface TemplateMessageResponse {
  data: TemplateMessage;
}

export interface CardRow {
  type?: string | null;
  text?: string | null;
  label?: string | null;
  link?: string | null;
  user_id?: number | null;
  android?: string | null;
  ios?: string | null;
}

export interface CardCreate {
  card: CardRow[];
}

export interface Card {
  call_id?: any | null;
  card?: CardRow[];
}

export interface CardResponse {
  data: Card;
}

export interface CardListResponse {
  data: CardRow[][];
}

export interface Disposition {
  id: number;
  name: string;
  code: string;
  outcome: string;
  direction: string;
  order: number;
  active: boolean;
  description?: string | null;
}

export interface DispositionListResponse {
  data: Disposition[];
  meta?: CountMeta | null;
}

export interface DispositionActor {
  user_id: number;
  at?: string | null;
  name?: string | null;
}

export interface DispositionOnCall {
  editable: boolean;
  edit_window_minutes: number;
  disposition_id?: number | null;
  code?: string | null;
  name?: string | null;
  direction?: string | null;
  outcome?: string | null;
  editable_until?: string | null;
  set_by?: DispositionActor | null;
  updated_by?: DispositionActor | null;
  ai_suggestion?: Record<string, any> | null;
}

export interface DispositionOnCallResponse {
  data: DispositionOnCall;
}

export interface DispositionUpdate {
  disposition_id?: number | null;
  disposition_code?: string | null;
}

export interface Extension {
  name: string;
  number: number | string;
  target_id: number;
  target_type: string;
}

export interface ExtensionResponse {
  data: Extension;
}

export interface ExtensionListResponse {
  data: Extension[];
  meta?: Meta | null;
}

export interface ExtensionCallCreate {
  number_id: number;
  callee_number: string;
  wait_for_answer?: boolean | null;
}

export interface ExtensionCall {
  id: string;
}

export interface Greeting {
  id: number;
  name: string;
  state: string;
  direct_dial_extension?: boolean | null;
  input_timeout?: number | null;
  max_input_try_count?: number | null;
}

export interface GreetingResponse {
  data: Greeting;
}

export interface GreetingListResponse {
  data: Greeting[];
  meta?: Meta | null;
}

export interface Number {
  id: number;
  name: string;
  number?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface NumberResponse {
  data: Number;
}

export interface NumberListResponse {
  data: Number[];
  meta?: Meta | null;
}

export interface Team {
  id: number;
  name: string;
  state: string;
  strategy: string;
  user_case: string | boolean;
  callback_action: string;
  callback?: boolean | null;
  callback_dtmf?: number | null;
  locale?: string | null;
  play_announcement?: boolean | null;
  say_line_number?: boolean | null;
  say_line_number_in_second?: number | null;
  wrap_up_time?: number | null;
}

export interface TeamResponse {
  data: Team;
}

export interface TeamListResponse {
  data: Team[];
  meta?: Meta | null;
}

export interface Voicemail {
  id: number;
  name: string;
}

export interface VoicemailResponse {
  data: Voicemail;
}

export interface VoicemailListResponse {
  data: Voicemail[];
  meta?: Meta | null;
}

export interface ProcedureCategory {
  id?: number | null;
  name?: string | null;
  slug?: string | null;
}

export interface ProcedureVersion {
  number?: number | null;
  published_at?: string | null;
}

export interface ProcedureStepOption {
  id?: number | null;
  uuid?: string | null;
  label?: string | null;
  order?: number | null;
  terminates?: boolean | null;
}

export interface ProcedureStepCondition {
  decision_step_id?: number | null;
  option_id?: number | null;
}

export interface ProcedureStep {
  uuid?: string | null;
  title?: string | null;
  body?: string | null;
  step_type?: string | null;
  decision_kind?: string | null;
  order?: number | null;
  options?: ProcedureStepOption[];
  conditions?: ProcedureStepCondition[];
  related_article?: Record<string, any> | null;
}

export interface ProcedureSummary {
  uuid: string;
  name: string;
  slug?: string | null;
  status?: string | null;
  description?: string | null;
  category?: ProcedureCategory | null;
}

export interface ProcedureDetail extends ProcedureSummary {
  body?: string | null;
  version?: ProcedureVersion | null;
  steps?: ProcedureStep[];
}

export interface ProcedureListResponse {
  data: ProcedureSummary[];
}

export interface ProcedureResponse {
  data: ProcedureDetail;
}

export interface DealLineItem {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  billing_frequency: string;
  billing_cycles?: number | null;
  code?: string | null;
  commissionable?: boolean | null;
  communications_tax_rate?: number | null;
  discount_type?: string | null;
  discount_value?: number | null;
  excise_duty_type?: string | null;
  excise_duty_value?: number | null;
  position?: number | null;
  product_id?: number | null;
  starts_on?: string | null;
  unit?: string | null;
  unit_code?: string | null;
  vat_rate?: number | null;
  vat_withholding_rate?: number | null;
}

export interface Deal {
  id: number;
  name: string;
  amount?: number | null;
  arr?: number | null;
  mrr?: number | null;
  currency?: string | null;
  state?: string | null;
  won_at?: string | null;
  lost_at?: string | null;
}

export interface DealDetail extends Deal {
  amount_source?: string | null;
  line_items?: DealLineItem[] | null;
}

export interface DealResponse {
  data: DealDetail;
}

export interface DealListResponse {
  data: Deal[];
  meta: Meta;
}

export interface User {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  title?: string | null;
  avatar_url?: string | null;
  locale?: string | null;
  timezone?: string | null;
  owner?: boolean | null;
  suspended?: boolean | null;
  state?: string | null;
  state_changed_at?: string | null;
  phone_prefix?: string | null;
  phone_countries?: any | null;
  default_number?: Record<string, any> | null;
  signature?: string | null;
  voicemail?: boolean | null;
  voicemail_action?: string | null;
  redirect?: string | null;
  redirect_to?: string | null;
  redirect_number?: string | null;
}

export interface UserResponse {
  data: User;
}

export interface UserListResponse {
  data: User[];
  meta: Meta;
}

export interface UserUpdate {
  default_number?: number | null;
  state?: string | null;
}

export interface DirectionStats {
  count: number;
  total_duration: number;
  avg_duration: number;
}

export interface CallStats {
  inbound: DirectionStats;
  outbound: DirectionStats;
}

export interface StateDurations {
  time_to_available: number;
  time_to_away: number;
  time_to_break: number;
  time_to_busy: number;
  time_to_remain: number;
  time_to_unknown: number;
}

export interface TodayStats {
  user_id: number;
  date: string;
  timezone: string;
  calls: CallStats;
  states: StateDurations;
}

export interface TodayStatsResponse {
  data: TodayStats;
}

export interface ProfileData {
  user: Record<string, any>;
  account: Record<string, any>;
  capabilities: Record<string, any>;
  permissions: string[];
  roles: Record<string, any>[];
  subscription?: Record<string, any> | null;
}

export interface ProfileResponse {
  data: ProfileData;
}

export interface MobileDeviceCreate {
  device_id: string;
  fcm_token: string;
  platform: string;
  app_version: string;
  os_version: string;
  apns_token?: string | null;
}

export interface MobileDevice {
  device_id: string;
  devices_count: number;
  do_not_disturb: boolean;
  registered_at: number;
  updated_at: number;
  user_id: number;
}

export interface MobileDeviceUpdate {
  do_not_disturb: boolean;
}

export interface MobileDeviceUpdateResponse {
  device_id: string;
  do_not_disturb: boolean;
  updated_at: number;
}

export interface MobileDeviceDeleteResponse {
  deleted: boolean;
  device_id: string;
  devices_count: number;
}

export interface PushTokenCreate {
  token: string;
  token_type: string;
}

export interface PushTokenResponse {
  user_id: number;
  token_type: string;
  last_seen: number;
}

export interface SipTokenCreate {
  user_id?: number | null;
}

export interface SipTokenResponse {
  user_id: number;
  sip_token: string;
  sip_username: string;
  sip_realm: string;
  wss_url: string;
  expires_at: number;
}

export interface AttributionSource {
  url: string;
  campaign?: string | null;
  campaignId?: string | null;
  dclid?: string | null;
  fbEventId?: string | null;
  fbc?: string | null;
  fbclid?: string | null;
  fbp?: string | null;
  gbraid?: string | null;
  gclid?: string | null;
  ip?: string | null;
  medium?: string | null;
  mediumId?: string | null;
  msclkid?: string | null;
  occurredAt?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  utmContent?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
  wbraid?: string | null;
}

export interface AttributionCreate {
  source: AttributionSource;
  consent: boolean;
  companyId?: number | null;
  contactId?: number | null;
  device?: string | null;
  visitorId?: string | null;
}

export interface AttributionResponse {
  eventId: number;
  linkedEvents: number;
  companyId?: number | null;
  contactId?: number | null;
}

export interface TaskUpdate {
  name?: string | null;
  description?: string | null;
  done?: boolean | null;
  assign_to_user_id?: number | null;
  company_ids?: number[] | null;
  contact_ids?: number[] | null;
  deal_ids?: number[] | null;
  due_date?: string | null;
  priority?: string | null;
  task_list_id?: number | null;
}
