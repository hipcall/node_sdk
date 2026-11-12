import { resolveBaseAddress, type HipcallRegion } from "./constants.js";
import {
  BadRequestException,
  EXCEPTION_MAP,
  HipcallAPIException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "./exceptions.js";
import type {
  AttributionCreate,
  AttributionResponse,
  CallAndBridgeResponse,
  CallDetailResponse,
  CallListResponse,
  CardCreate,
  CardListResponse,
  CardResponse,
  CommentCreate,
  CommentListResponse,
  CommentResponse,
  CompanyCreate,
  CompanyListResponse,
  CompanyResponse,
  CompanyUpdate,
  ConsentCreate,
  ConsentListResponse,
  ConsentResponse,
  ContactCenterAttributesResponse,
  ContactCreate,
  ContactListResponse,
  ContactResponse,
  ContactUpdate,
  ConversationListResponse,
  ConversationResponse,
  ConversationUpdate,
  CustomFieldDefinitionListResponse,
  DealListResponse,
  DealResponse,
  DispositionListResponse,
  DispositionOnCallResponse,
  DispositionUpdate,
  EmailListResponse,
  EmailRequest,
  EmployeeSizeListResponse,
  ExtensionCall,
  ExtensionCallCreate,
  ExtensionListResponse,
  ExtensionResponse,
  GreetingListResponse,
  GreetingResponse,
  InboxListResponse,
  InboxResponse,
  InboxUpdate,
  LifeCycleListResponse,
  LookupByEmailResponse,
  LookupByPhoneResponse,
  MessageListResponse,
  MessageResponse,
  MobileDevice,
  MobileDeviceCreate,
  MobileDeviceDeleteResponse,
  MobileDeviceUpdate,
  MobileDeviceUpdateResponse,
  NumberListResponse,
  NumberResponse,
  PhoneListResponse,
  PhoneRequest,
  ProcedureListResponse,
  ProcedureResponse,
  ProfileResponse,
  PushTokenCreate,
  PushTokenResponse,
  SectorListResponse,
  SipTokenCreate,
  SipTokenResponse,
  SourceListResponse,
  TagCreate,
  TagListResponse,
  TagResponse,
  TaskCreate,
  TaskDetailResponse,
  TaskListResponse,
  TaskResponse,
  TaskUpdate,
  TeamListResponse,
  TeamResponse,
  TemplateMessageCreate,
  TemplateMessageResponse,
  TextMessageCreate,
  TodayStatsResponse,
  UserListResponse,
  UserResponse,
  UserUpdate,
  VoicemailListResponse,
  VoicemailResponse,
} from "./models.js";

export interface HipcallClientOptions {
  apiKey: string;
  /** "global" (default) = https://use.hipcall.com, "tr" = https://use.hipcall.com.tr */
  region?: HipcallRegion;
  /** Overrides the region address when set. */
  baseUrl?: string;
  fetch?: typeof fetch;
}

export class HipcallBaseClient {
  public readonly apiKey: string;
  public readonly api_key: string;
  public readonly baseUrl: string;
  public readonly base_url: string;
  protected readonly fetchFn: typeof fetch;

  constructor(
    apiKeyOrOptions: string | HipcallClientOptions,
    baseUrl?: string | null,
    customFetch?: typeof fetch
  ) {
    if (typeof apiKeyOrOptions === "object" && apiKeyOrOptions !== null) {
      if (!apiKeyOrOptions.apiKey) {
        throw new Error("API key must be provided.");
      }
      this.apiKey = apiKeyOrOptions.apiKey;
      this.baseUrl = resolveBaseAddress(apiKeyOrOptions.baseUrl, apiKeyOrOptions.region);
      this.fetchFn = apiKeyOrOptions.fetch ?? globalThis.fetch.bind(globalThis);
    } else {
      if (!apiKeyOrOptions) {
        throw new Error("API key must be provided.");
      }
      this.apiKey = apiKeyOrOptions;
      this.baseUrl = resolveBaseAddress(baseUrl);
      this.fetchFn = customFetch ?? globalThis.fetch.bind(globalThis);
    }
    this.api_key = this.apiKey;
    this.base_url = this.baseUrl;
  }

  public getDefaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  public get_default_headers(): Record<string, string> {
    return this.getDefaultHeaders();
  }

  public static handleResponse(statusCode: number, content: any = null): any {
    if (statusCode === 200 || statusCode === 201) {
      return content;
    }
    if (statusCode === 204) {
      return content || {};
    }
    const ExcClass = EXCEPTION_MAP[statusCode] || HipcallAPIException;
    throw new ExcClass(statusCode, content);
  }

  public static handle_response(statusCode: number, content: any = null): any {
    return HipcallBaseClient.handleResponse(statusCode, content);
  }

  public static loadJson(text: string): any {
    if (!text) {
      return null;
    }
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  public static load_json(text: string): any {
    return HipcallBaseClient.loadJson(text);
  }

  public static buildParams(params: Record<string, any>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        out[k] = typeof v === "boolean" ? String(v).toLowerCase() : String(v);
      }
    }
    return out;
  }

  public static build_params(params: Record<string, any>): Record<string, string> {
    return HipcallBaseClient.buildParams(params);
  }

  public static cleanBody(obj: any): Record<string, any> {
    if (!obj || typeof obj !== "object") {
      return {};
    }
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        out[k] = v;
      }
    }
    return out;
  }

  public getCallDetailUrl(callId: string): string {
    return `${this.baseUrl}/api/v3/calls/${callId}`;
  }
  public get_call_detail_url(call_id: string): string {
    return this.getCallDetailUrl(call_id);
  }

  public getCallListUrl(): string {
    return `${this.baseUrl}/api/v3/calls`;
  }
  public get_call_list_url(): string {
    return this.getCallListUrl();
  }

  public getCallAndBridgeUrl(userId: number | string): string {
    return `${this.baseUrl}/api/v3/users/${userId}/call`;
  }
  public get_call_and_bridge_url(user_id: number | string): string {
    return this.getCallAndBridgeUrl(user_id);
  }

  public getTaskListUrl(): string {
    return `${this.baseUrl}/api/v3/tasks`;
  }
  public get_task_list_url(): string {
    return this.getTaskListUrl();
  }

  public getTaskDetailUrl(taskId: number | string): string {
    return `${this.baseUrl}/api/v3/tasks/${taskId}`;
  }
  public get_task_detail_url(task_id: number | string): string {
    return this.getTaskDetailUrl(task_id);
  }

  protected async request<T>(
    method: string,
    url: string,
    options?: { params?: Record<string, string>; json?: any }
  ): Promise<T> {
    let fullUrl = url;
    if (options?.params && Object.keys(options.params).length > 0) {
      const qs = new URLSearchParams(options.params).toString();
      fullUrl = `${url}?${qs}`;
    }
    const init: RequestInit = {
      method,
      headers: this.getDefaultHeaders(),
    };
    if (options?.json !== undefined && method !== "GET" && method !== "DELETE") {
      init.body = JSON.stringify(options.json);
    }
    const response = await this.fetchFn(fullUrl, init);
    const text = await response.text();
    const data = HipcallBaseClient.handleResponse(
      response.status,
      HipcallBaseClient.loadJson(text)
    );
    return (method === "DELETE" && response.status === 204 ? undefined : data) as T;
  }
}

export class Client extends HipcallBaseClient {

  /**
   * Execute get_call request.
   */
  public async get_call(call_id: string, date: string): Promise<CallDetailResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}`;
    const params = HipcallBaseClient.buildParams({ "date": date });
    return this.request<CallDetailResponse>("GET", url, { params });
  }

  public async getCall(call_id: string, date: string): Promise<CallDetailResponse> {
    return this.get_call(call_id, date);
  }

  /**
   * Execute get_calls request.
   */
  public async get_calls(limit: number = 10, offset: number = 0, q?: string | null, sort: string = "started_at.desc", started_at_gte?: string | null, started_at_lte?: string | null, missing_call?: boolean | null, direction?: string | null, call_duration_gte?: number | null, call_duration_lte?: number | null, user_id?: number | null, team_id?: number | null): Promise<CallListResponse> {
    const url = `${this.baseUrl}/api/v3/calls`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "sort": sort, "q": q, "started_at[gte]": started_at_gte, "started_at[lte]": started_at_lte, "missing_call[eq]": missing_call, "direction[eq]": direction, "call_duration[gte]": call_duration_gte, "call_duration[lte]": call_duration_lte, "user_id[eq]": user_id, "team_id[eq]": team_id });
    return this.request<CallListResponse>("GET", url, { params });
  }

  public async getCalls(limit: number = 10, offset: number = 0, q?: string | null, sort: string = "started_at.desc", started_at_gte?: string | null, started_at_lte?: string | null, missing_call?: boolean | null, direction?: string | null, call_duration_gte?: number | null, call_duration_lte?: number | null, user_id?: number | null, team_id?: number | null): Promise<CallListResponse> {
    return this.get_calls(limit, offset, q, sort, started_at_gte, started_at_lte, missing_call, direction, call_duration_gte, call_duration_lte, user_id, team_id);
  }

  /**
   * Execute call_and_bridge request.
   */
  public async call_and_bridge(user_id: number, callee_number: string, ring_user_first: boolean = true, call_masking?: boolean | null, call_masking_name?: string | null): Promise<CallAndBridgeResponse> {
    const url = `${this.baseUrl}/api/v3/users/${user_id}/call`;
    const payload: Record<string, any> = { callee_number: callee_number, ring_user_first: ring_user_first };
    if (call_masking !== undefined && call_masking !== null) { payload.call_masking = call_masking; }
    if (call_masking_name !== undefined && call_masking_name !== null) { payload.call_masking_name = call_masking_name; }
    return this.request<CallAndBridgeResponse>("POST", url, { json: payload });
  }

  public async callAndBridge(user_id: number, callee_number: string, ring_user_first: boolean = true, call_masking?: boolean | null, call_masking_name?: string | null): Promise<CallAndBridgeResponse> {
    return this.call_and_bridge(user_id, callee_number, ring_user_first, call_masking, call_masking_name);
  }

  /**
   * Execute get_tasks request.
   */
  public async get_tasks(limit: number = 10, offset: number = 0, q?: string | null, sort: string = "id.asc", assign_to_user_id?: number | null, done?: boolean | null): Promise<TaskListResponse> {
    const url = `${this.baseUrl}/api/v3/tasks`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "sort": sort, "q": q, "assign_to_user_id[eq]": assign_to_user_id, "done[eq]": done });
    return this.request<TaskListResponse>("GET", url, { params });
  }

  public async getTasks(limit: number = 10, offset: number = 0, q?: string | null, sort: string = "id.asc", assign_to_user_id?: number | null, done?: boolean | null): Promise<TaskListResponse> {
    return this.get_tasks(limit, offset, q, sort, assign_to_user_id, done);
  }

  /**
   * Execute create_task request.
   */
  public async create_task(task: TaskCreate): Promise<TaskResponse> {
    const url = `${this.baseUrl}/api/v3/tasks`;
    const payload = { data: HipcallBaseClient.cleanBody(task) };
    return this.request<TaskResponse>("POST", url, { json: payload });
  }

  public async createTask(task: TaskCreate): Promise<TaskResponse> {
    return this.create_task(task);
  }

  /**
   * Execute get_task request.
   */
  public async get_task(task_id: number): Promise<TaskDetailResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}`;
    return this.request<TaskDetailResponse>("GET", url);
  }

  public async getTask(task_id: number): Promise<TaskDetailResponse> {
    return this.get_task(task_id);
  }

  /**
   * Update a task.
   */
  public async update_task(task_id: number, body: TaskUpdate): Promise<TaskResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TaskResponse>("PATCH", url, { json: payload });
  }

  public async updateTask(task_id: number, body: TaskUpdate): Promise<TaskResponse> {
    return this.update_task(task_id, body);
  }

  /**
   * List comments on a task.
   */
  public async get_task_comments(task_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}/comments`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CommentListResponse>("GET", url, { params });
  }

  public async getTaskComments(task_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    return this.get_task_comments(task_id, limit, offset, q, sort);
  }

  /**
   * Add a comment to a task.
   */
  public async create_task_comment(task_id: number, body: CommentCreate): Promise<CommentResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}/comments`;
    const payload = { data: HipcallBaseClient.cleanBody(body) };
    return this.request<CommentResponse>("POST", url, { json: payload });
  }

  public async createTaskComment(task_id: number, body: CommentCreate): Promise<CommentResponse> {
    return this.create_task_comment(task_id, body);
  }

  /**
   * List tags on a task.
   */
  public async get_task_tags(task_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}/tags`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset });
    return this.request<TagListResponse>("GET", url, { params });
  }

  public async getTaskTags(task_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    return this.get_task_tags(task_id, limit, offset);
  }

  /**
   * Add a tag to a task.
   */
  public async add_task_tag(task_id: number, body: TagCreate): Promise<TagResponse> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}/tags`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TagResponse>("POST", url, { json: payload });
  }

  public async addTaskTag(task_id: number, body: TagCreate): Promise<TagResponse> {
    return this.add_task_tag(task_id, body);
  }

  /**
   * Remove a tag from a task.
   */
  public async delete_task_tag(task_id: number, tag_id: number): Promise<null> {
    const url = `${this.baseUrl}/api/v3/tasks/${task_id}/tags/${tag_id}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteTaskTag(task_id: number, tag_id: number): Promise<null> {
    return this.delete_task_tag(task_id, tag_id);
  }

  /**
   * List comments on a call.
   */
  public async get_call_comments(call_id: string, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/comments`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CommentListResponse>("GET", url, { params });
  }

  public async getCallComments(call_id: string, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    return this.get_call_comments(call_id, limit, offset, q, sort);
  }

  /**
   * Add a comment to a call.
   */
  public async create_call_comment(call_id: string, body: CommentCreate): Promise<CommentResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/comments`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CommentResponse>("POST", url, { json: payload });
  }

  public async createCallComment(call_id: string, body: CommentCreate): Promise<CommentResponse> {
    return this.create_call_comment(call_id, body);
  }

  /**
   * List tags on a call.
   */
  public async get_call_tags(call_id: string, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/tags`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset });
    return this.request<TagListResponse>("GET", url, { params });
  }

  public async getCallTags(call_id: string, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    return this.get_call_tags(call_id, limit, offset);
  }

  /**
   * Add a tag to a call.
   */
  public async add_call_tag(call_id: string, body: TagCreate): Promise<TagResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/tags`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TagResponse>("POST", url, { json: payload });
  }

  public async addCallTag(call_id: string, body: TagCreate): Promise<TagResponse> {
    return this.add_call_tag(call_id, body);
  }

  /**
   * Remove a tag from a call.
   */
  public async delete_call_tag(call_id: string, tag_id: number): Promise<null> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/tags/${tag_id}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteCallTag(call_id: string, tag_id: number): Promise<null> {
    return this.delete_call_tag(call_id, tag_id);
  }

  /**
   * List cards sent during a call.
   */
  public async get_call_cards(call_id: string): Promise<CardListResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/cards`;
    return this.request<CardListResponse>("GET", url);
  }

  public async getCallCards(call_id: string): Promise<CardListResponse> {
    return this.get_call_cards(call_id);
  }

  /**
   * Send a card to a live call.
   */
  public async create_call_card(call_id: string, body: CardCreate): Promise<CardResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/cards`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CardResponse>("POST", url, { json: payload });
  }

  public async createCallCard(call_id: string, body: CardCreate): Promise<CardResponse> {
    return this.create_call_card(call_id, body);
  }

  /**
   * Get the disposition set on a call.
   */
  public async get_call_disposition(call_id: string): Promise<DispositionOnCallResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/disposition`;
    return this.request<DispositionOnCallResponse>("GET", url);
  }

  public async getCallDisposition(call_id: string): Promise<DispositionOnCallResponse> {
    return this.get_call_disposition(call_id);
  }

  /**
   * Set or replace a call's disposition.
   */
  public async set_call_disposition(call_id: string, body: DispositionUpdate): Promise<DispositionOnCallResponse> {
    const url = `${this.baseUrl}/api/v3/calls/${call_id}/disposition`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<DispositionOnCallResponse>("PUT", url, { json: payload });
  }

  public async setCallDisposition(call_id: string, body: DispositionUpdate): Promise<DispositionOnCallResponse> {
    return this.set_call_disposition(call_id, body);
  }

  /**
   * List call dispositions.
   */
  public async get_dispositions(direction?: string | null, outcome?: string | null, active?: boolean | null, call_uuid?: string | null): Promise<DispositionListResponse> {
    const url = `${this.baseUrl}/api/v3/dispositions`;
    const params = HipcallBaseClient.buildParams({ "direction": direction, "outcome": outcome, "active": active, "call_uuid": call_uuid });
    return this.request<DispositionListResponse>("GET", url, { params });
  }

  public async getDispositions(direction?: string | null, outcome?: string | null, active?: boolean | null, call_uuid?: string | null): Promise<DispositionListResponse> {
    return this.get_dispositions(direction, outcome, active, call_uuid);
  }

  /**
   * List extensions.
   */
  public async get_extensions(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ExtensionListResponse> {
    const url = `${this.baseUrl}/api/v3/extensions`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<ExtensionListResponse>("GET", url, { params });
  }

  public async getExtensions(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ExtensionListResponse> {
    return this.get_extensions(limit, offset, q, sort);
  }

  /**
   * Get an extension by ID.
   */
  public async get_extension(extension_id: number): Promise<ExtensionResponse> {
    const url = `${this.baseUrl}/api/v3/extensions/${extension_id}`;
    return this.request<ExtensionResponse>("GET", url);
  }

  public async getExtension(extension_id: number): Promise<ExtensionResponse> {
    return this.get_extension(extension_id);
  }

  /**
   * Place an outbound call from an extension.
   */
  public async call_extension(extension_id: number, body: ExtensionCallCreate): Promise<ExtensionCall> {
    const url = `${this.baseUrl}/api/v3/extensions/${extension_id}/call`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<ExtensionCall>("POST", url, { json: payload });
  }

  public async callExtension(extension_id: number, body: ExtensionCallCreate): Promise<ExtensionCall> {
    return this.call_extension(extension_id, body);
  }

  /**
   * List greetings.
   */
  public async get_greetings(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<GreetingListResponse> {
    const url = `${this.baseUrl}/api/v3/greetings`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<GreetingListResponse>("GET", url, { params });
  }

  public async getGreetings(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<GreetingListResponse> {
    return this.get_greetings(limit, offset, q, sort);
  }

  /**
   * Get a greeting by ID.
   */
  public async get_greeting(greeting_id: number): Promise<GreetingResponse> {
    const url = `${this.baseUrl}/api/v3/greetings/${greeting_id}`;
    return this.request<GreetingResponse>("GET", url);
  }

  public async getGreeting(greeting_id: number): Promise<GreetingResponse> {
    return this.get_greeting(greeting_id);
  }

  /**
   * List phone numbers.
   */
  public async get_numbers(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<NumberListResponse> {
    const url = `${this.baseUrl}/api/v3/numbers`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<NumberListResponse>("GET", url, { params });
  }

  public async getNumbers(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<NumberListResponse> {
    return this.get_numbers(limit, offset, q, sort);
  }

  /**
   * Get a phone number by ID.
   */
  public async get_number(number_id: number): Promise<NumberResponse> {
    const url = `${this.baseUrl}/api/v3/numbers/${number_id}`;
    return this.request<NumberResponse>("GET", url);
  }

  public async getNumber(number_id: number): Promise<NumberResponse> {
    return this.get_number(number_id);
  }

  /**
   * List teams.
   */
  public async get_teams(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<TeamListResponse> {
    const url = `${this.baseUrl}/api/v3/teams`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<TeamListResponse>("GET", url, { params });
  }

  public async getTeams(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<TeamListResponse> {
    return this.get_teams(limit, offset, q, sort);
  }

  /**
   * Get a team by ID.
   */
  public async get_team(team_id: number): Promise<TeamResponse> {
    const url = `${this.baseUrl}/api/v3/teams/${team_id}`;
    return this.request<TeamResponse>("GET", url);
  }

  public async getTeam(team_id: number): Promise<TeamResponse> {
    return this.get_team(team_id);
  }

  /**
   * List voicemails.
   */
  public async get_voicemails(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<VoicemailListResponse> {
    const url = `${this.baseUrl}/api/v3/voicemails`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<VoicemailListResponse>("GET", url, { params });
  }

  public async getVoicemails(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<VoicemailListResponse> {
    return this.get_voicemails(limit, offset, q, sort);
  }

  /**
   * Get a voicemail by ID.
   */
  public async get_voicemail(voicemail_id: number): Promise<VoicemailResponse> {
    const url = `${this.baseUrl}/api/v3/voicemails/${voicemail_id}`;
    return this.request<VoicemailResponse>("GET", url);
  }

  public async getVoicemail(voicemail_id: number): Promise<VoicemailResponse> {
    return this.get_voicemail(voicemail_id);
  }

  /**
   * List users.
   */
  public async get_users(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<UserListResponse> {
    const url = `${this.baseUrl}/api/v3/users`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<UserListResponse>("GET", url, { params });
  }

  public async getUsers(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<UserListResponse> {
    return this.get_users(limit, offset, q, sort);
  }

  /**
   * Get a user by ID.
   */
  public async get_user(user_id: number): Promise<UserResponse> {
    const url = `${this.baseUrl}/api/v3/users/${user_id}`;
    return this.request<UserResponse>("GET", url);
  }

  public async getUser(user_id: number): Promise<UserResponse> {
    return this.get_user(user_id);
  }

  /**
   * Update a user.
   */
  public async update_user(user_id: number, body: UserUpdate): Promise<UserResponse> {
    const url = `${this.baseUrl}/api/v3/users/${user_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<UserResponse>("PATCH", url, { json: payload });
  }

  public async updateUser(user_id: number, body: UserUpdate): Promise<UserResponse> {
    return this.update_user(user_id, body);
  }

  /**
   * Get today's statistics for a user.
   */
  public async get_user_today_stats(user_id: number): Promise<TodayStatsResponse> {
    const url = `${this.baseUrl}/api/v3/users/${user_id}/stats/today`;
    return this.request<TodayStatsResponse>("GET", url);
  }

  public async getUserTodayStats(user_id: number): Promise<TodayStatsResponse> {
    return this.get_user_today_stats(user_id);
  }

  /**
   * Get the authenticated user's profile.
   */
  public async get_profile(): Promise<ProfileResponse> {
    const url = `${this.baseUrl}/api/v3/profile`;
    return this.request<ProfileResponse>("GET", url);
  }

  public async getProfile(): Promise<ProfileResponse> {
    return this.get_profile();
  }

  /**
   * Get today's statistics for the caller.
   */
  public async get_profile_today_stats(): Promise<TodayStatsResponse> {
    const url = `${this.baseUrl}/api/v3/profile/stats/today`;
    return this.request<TodayStatsResponse>("GET", url);
  }

  public async getProfileTodayStats(): Promise<TodayStatsResponse> {
    return this.get_profile_today_stats();
  }

  /**
   * List contacts.
   */
  public async get_contacts(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ContactListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<ContactListResponse>("GET", url, { params });
  }

  public async getContacts(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ContactListResponse> {
    return this.get_contacts(limit, offset, q, sort);
  }

  /**
   * Create a contact.
   */
  public async create_contact(body: ContactCreate): Promise<ContactResponse> {
    const url = `${this.baseUrl}/api/v3/contacts`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<ContactResponse>("POST", url, { json: payload });
  }

  public async createContact(body: ContactCreate): Promise<ContactResponse> {
    return this.create_contact(body);
  }

  /**
   * Get a contact by ID.
   */
  public async get_contact(contact_id: number): Promise<ContactResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}`;
    return this.request<ContactResponse>("GET", url);
  }

  public async getContact(contact_id: number): Promise<ContactResponse> {
    return this.get_contact(contact_id);
  }

  /**
   * Update a contact.
   */
  public async update_contact(contact_id: number, body: ContactUpdate): Promise<ContactResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<ContactResponse>("PATCH", url, { json: payload });
  }

  public async updateContact(contact_id: number, body: ContactUpdate): Promise<ContactResponse> {
    return this.update_contact(contact_id, body);
  }

  /**
   * Get a contact by external ID.
   */
  public async get_contact_by_external_id(external_id: string): Promise<ContactResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/by-external-id/${external_id}`;
    return this.request<ContactResponse>("GET", url);
  }

  public async getContactByExternalId(external_id: string): Promise<ContactResponse> {
    return this.get_contact_by_external_id(external_id);
  }

  /**
   * Assign a contact to a user. Pass None to unassign.
   */
  public async assign_contact(contact_id: number, assign_to_user_id?: number | null): Promise<ContactResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/assign`;
    const payload: Record<string, any> = { assign_to_user_id: assign_to_user_id };
    return this.request<ContactResponse>("PATCH", url, { json: payload });
  }

  public async assignContact(contact_id: number, assign_to_user_id?: number | null): Promise<ContactResponse> {
    return this.assign_contact(contact_id, assign_to_user_id);
  }

  /**
   * List contact custom field definitions.
   */
  public async get_contact_custom_fields(active?: boolean | null): Promise<CustomFieldDefinitionListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/custom-fields`;
    const params = HipcallBaseClient.buildParams({ "active": active });
    return this.request<CustomFieldDefinitionListResponse>("GET", url, { params });
  }

  public async getContactCustomFields(active?: boolean | null): Promise<CustomFieldDefinitionListResponse> {
    return this.get_contact_custom_fields(active);
  }

  /**
   * List comments on a contact.
   */
  public async get_contact_comments(contact_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/comments`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CommentListResponse>("GET", url, { params });
  }

  public async getContactComments(contact_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    return this.get_contact_comments(contact_id, limit, offset, q, sort);
  }

  /**
   * Add a comment to a contact.
   */
  public async create_contact_comment(contact_id: number, body: CommentCreate): Promise<CommentResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/comments`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CommentResponse>("POST", url, { json: payload });
  }

  public async createContactComment(contact_id: number, body: CommentCreate): Promise<CommentResponse> {
    return this.create_contact_comment(contact_id, body);
  }

  /**
   * List a contact's consent history.
   */
  public async get_contact_consents(contact_id: number): Promise<ConsentListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/consent`;
    return this.request<ConsentListResponse>("GET", url);
  }

  public async getContactConsents(contact_id: number): Promise<ConsentListResponse> {
    return this.get_contact_consents(contact_id);
  }

  /**
   * Record advertising consent on a contact.
   */
  public async create_contact_consent(contact_id: number, body: ConsentCreate): Promise<ConsentResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/consent`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<ConsentResponse>("POST", url, { json: payload });
  }

  public async createContactConsent(contact_id: number, body: ConsentCreate): Promise<ConsentResponse> {
    return this.create_contact_consent(contact_id, body);
  }

  /**
   * Add email addresses to a contact.
   */
  public async add_contact_emails(contact_id: number, body: EmailRequest): Promise<EmailListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/emails`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<EmailListResponse>("POST", url, { json: payload });
  }

  public async addContactEmails(contact_id: number, body: EmailRequest): Promise<EmailListResponse> {
    return this.add_contact_emails(contact_id, body);
  }

  /**
   * Remove an email address from a contact.
   */
  public async delete_contact_email(contact_id: number, email: string): Promise<null> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/emails/${email}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteContactEmail(contact_id: number, email: string): Promise<null> {
    return this.delete_contact_email(contact_id, email);
  }

  /**
   * Add phone numbers to a contact.
   */
  public async add_contact_phones(contact_id: number, body: PhoneRequest): Promise<PhoneListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/phones`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<PhoneListResponse>("POST", url, { json: payload });
  }

  public async addContactPhones(contact_id: number, body: PhoneRequest): Promise<PhoneListResponse> {
    return this.add_contact_phones(contact_id, body);
  }

  /**
   * Remove a phone number from a contact.
   */
  public async delete_contact_phone(contact_id: number, number: string): Promise<null> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/phones/${number}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteContactPhone(contact_id: number, number: string): Promise<null> {
    return this.delete_contact_phone(contact_id, number);
  }

  /**
   * List tags on a contact.
   */
  public async get_contact_tags(contact_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/tags`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset });
    return this.request<TagListResponse>("GET", url, { params });
  }

  public async getContactTags(contact_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    return this.get_contact_tags(contact_id, limit, offset);
  }

  /**
   * Add a tag to a contact.
   */
  public async add_contact_tag(contact_id: number, body: TagCreate): Promise<TagResponse> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/tags`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TagResponse>("POST", url, { json: payload });
  }

  public async addContactTag(contact_id: number, body: TagCreate): Promise<TagResponse> {
    return this.add_contact_tag(contact_id, body);
  }

  /**
   * Remove a tag from a contact.
   */
  public async delete_contact_tag(contact_id: number, tag_id: number): Promise<null> {
    const url = `${this.baseUrl}/api/v3/contacts/${contact_id}/tags/${tag_id}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteContactTag(contact_id: number, tag_id: number): Promise<null> {
    return this.delete_contact_tag(contact_id, tag_id);
  }

  /**
   * List companies.
   */
  public async get_companies(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CompanyListResponse> {
    const url = `${this.baseUrl}/api/v3/companies`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CompanyListResponse>("GET", url, { params });
  }

  public async getCompanies(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CompanyListResponse> {
    return this.get_companies(limit, offset, q, sort);
  }

  /**
   * Create a company.
   */
  public async create_company(body: CompanyCreate): Promise<CompanyResponse> {
    const url = `${this.baseUrl}/api/v3/companies`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CompanyResponse>("POST", url, { json: payload });
  }

  public async createCompany(body: CompanyCreate): Promise<CompanyResponse> {
    return this.create_company(body);
  }

  /**
   * Get a company by ID.
   */
  public async get_company(company_id: number): Promise<CompanyResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}`;
    return this.request<CompanyResponse>("GET", url);
  }

  public async getCompany(company_id: number): Promise<CompanyResponse> {
    return this.get_company(company_id);
  }

  /**
   * Update a company.
   */
  public async update_company(company_id: number, body: CompanyUpdate): Promise<CompanyResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CompanyResponse>("PATCH", url, { json: payload });
  }

  public async updateCompany(company_id: number, body: CompanyUpdate): Promise<CompanyResponse> {
    return this.update_company(company_id, body);
  }

  /**
   * Get a company by external ID.
   */
  public async get_company_by_external_id(external_id: string): Promise<CompanyResponse> {
    const url = `${this.baseUrl}/api/v3/companies/by-external-id/${external_id}`;
    return this.request<CompanyResponse>("GET", url);
  }

  public async getCompanyByExternalId(external_id: string): Promise<CompanyResponse> {
    return this.get_company_by_external_id(external_id);
  }

  /**
   * Assign a company to a user. Pass None to unassign.
   */
  public async assign_company(company_id: number, assign_to_user_id?: number | null): Promise<CompanyResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/assign`;
    const payload: Record<string, any> = { assign_to_user_id: assign_to_user_id };
    return this.request<CompanyResponse>("PATCH", url, { json: payload });
  }

  public async assignCompany(company_id: number, assign_to_user_id?: number | null): Promise<CompanyResponse> {
    return this.assign_company(company_id, assign_to_user_id);
  }

  /**
   * List company custom field definitions.
   */
  public async get_company_custom_fields(active?: boolean | null): Promise<CustomFieldDefinitionListResponse> {
    const url = `${this.baseUrl}/api/v3/companies/custom-fields`;
    const params = HipcallBaseClient.buildParams({ "active": active });
    return this.request<CustomFieldDefinitionListResponse>("GET", url, { params });
  }

  public async getCompanyCustomFields(active?: boolean | null): Promise<CustomFieldDefinitionListResponse> {
    return this.get_company_custom_fields(active);
  }

  /**
   * List comments on a company.
   */
  public async get_company_comments(company_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/comments`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CommentListResponse>("GET", url, { params });
  }

  public async getCompanyComments(company_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    return this.get_company_comments(company_id, limit, offset, q, sort);
  }

  /**
   * Add a comment to a company.
   */
  public async create_company_comment(company_id: number, body: CommentCreate): Promise<CommentResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/comments`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CommentResponse>("POST", url, { json: payload });
  }

  public async createCompanyComment(company_id: number, body: CommentCreate): Promise<CommentResponse> {
    return this.create_company_comment(company_id, body);
  }

  /**
   * Add email addresses to a company.
   */
  public async add_company_emails(company_id: number, body: EmailRequest): Promise<EmailListResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/emails`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<EmailListResponse>("POST", url, { json: payload });
  }

  public async addCompanyEmails(company_id: number, body: EmailRequest): Promise<EmailListResponse> {
    return this.add_company_emails(company_id, body);
  }

  /**
   * Remove an email address from a company.
   */
  public async delete_company_email(company_id: number, email: string): Promise<null> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/emails/${email}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteCompanyEmail(company_id: number, email: string): Promise<null> {
    return this.delete_company_email(company_id, email);
  }

  /**
   * Add phone numbers to a company.
   */
  public async add_company_phones(company_id: number, body: PhoneRequest): Promise<PhoneListResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/phones`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<PhoneListResponse>("POST", url, { json: payload });
  }

  public async addCompanyPhones(company_id: number, body: PhoneRequest): Promise<PhoneListResponse> {
    return this.add_company_phones(company_id, body);
  }

  /**
   * Remove a phone number from a company.
   */
  public async delete_company_phone(company_id: number, number: string): Promise<null> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/phones/${number}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteCompanyPhone(company_id: number, number: string): Promise<null> {
    return this.delete_company_phone(company_id, number);
  }

  /**
   * List tags on a company.
   */
  public async get_company_tags(company_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/tags`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset });
    return this.request<TagListResponse>("GET", url, { params });
  }

  public async getCompanyTags(company_id: number, limit: number = 10, offset: number = 0): Promise<TagListResponse> {
    return this.get_company_tags(company_id, limit, offset);
  }

  /**
   * Add a tag to a company.
   */
  public async add_company_tag(company_id: number, body: TagCreate): Promise<TagResponse> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/tags`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TagResponse>("POST", url, { json: payload });
  }

  public async addCompanyTag(company_id: number, body: TagCreate): Promise<TagResponse> {
    return this.add_company_tag(company_id, body);
  }

  /**
   * Remove a tag from a company.
   */
  public async delete_company_tag(company_id: number, tag_id: number): Promise<null> {
    const url = `${this.baseUrl}/api/v3/companies/${company_id}/tags/${tag_id}`;
    return this.request<null>("DELETE", url);
  }

  public async deleteCompanyTag(company_id: number, tag_id: number): Promise<null> {
    return this.delete_company_tag(company_id, tag_id);
  }

  /**
   * List employee-size bands.
   */
  public async get_employee_sizes(): Promise<EmployeeSizeListResponse> {
    const url = `${this.baseUrl}/api/v3/employee-sizes`;
    return this.request<EmployeeSizeListResponse>("GET", url);
  }

  public async getEmployeeSizes(): Promise<EmployeeSizeListResponse> {
    return this.get_employee_sizes();
  }

  /**
   * List life cycle values.
   */
  public async get_life_cycles(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<LifeCycleListResponse> {
    const url = `${this.baseUrl}/api/v3/life-cycles`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<LifeCycleListResponse>("GET", url, { params });
  }

  public async getLifeCycles(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<LifeCycleListResponse> {
    return this.get_life_cycles(limit, offset, q, sort);
  }

  /**
   * List sector values.
   */
  public async get_sectors(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<SectorListResponse> {
    const url = `${this.baseUrl}/api/v3/sectors`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<SectorListResponse>("GET", url, { params });
  }

  public async getSectors(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<SectorListResponse> {
    return this.get_sectors(limit, offset, q, sort);
  }

  /**
   * List traction channel (source) values.
   */
  public async get_sources(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<SourceListResponse> {
    const url = `${this.baseUrl}/api/v3/sources`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<SourceListResponse>("GET", url, { params });
  }

  public async getSources(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<SourceListResponse> {
    return this.get_sources(limit, offset, q, sort);
  }

  /**
   * List all contact-centre attributes in one call.
   */
  public async get_contact_center_attributes(): Promise<ContactCenterAttributesResponse> {
    const url = `${this.baseUrl}/api/v3/contact-center/attributes`;
    return this.request<ContactCenterAttributesResponse>("GET", url);
  }

  public async getContactCenterAttributes(): Promise<ContactCenterAttributesResponse> {
    return this.get_contact_center_attributes();
  }

  /**
   * Look up contacts and companies by email address.
   */
  public async lookup_by_email(email: string): Promise<LookupByEmailResponse> {
    const url = `${this.baseUrl}/api/v3/lookup/by_email`;
    const params = HipcallBaseClient.buildParams({ "email": email });
    return this.request<LookupByEmailResponse>("GET", url, { params });
  }

  public async lookupByEmail(email: string): Promise<LookupByEmailResponse> {
    return this.lookup_by_email(email);
  }

  /**
   * Look up contacts and companies by phone number.
   */
  public async lookup_by_phone(number: string): Promise<LookupByPhoneResponse> {
    const url = `${this.baseUrl}/api/v3/lookup/by_phone`;
    const params = HipcallBaseClient.buildParams({ "number": number });
    return this.request<LookupByPhoneResponse>("GET", url, { params });
  }

  public async lookupByPhone(number: string): Promise<LookupByPhoneResponse> {
    return this.lookup_by_phone(number);
  }

  /**
   * List tags. `type` is one of contact_centre, communication, task, ticket, content, deal.
   */
  public async get_tags(type?: string | null, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<TagListResponse> {
    const url = `${this.baseUrl}/api/v3/tags`;
    const params = HipcallBaseClient.buildParams({ "type": type, "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<TagListResponse>("GET", url, { params });
  }

  public async getTags(type?: string | null, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<TagListResponse> {
    return this.get_tags(type, limit, offset, q, sort);
  }

  /**
   * List inboxes.
   */
  public async get_inboxes(limit: number = 10, offset: number = 0, q?: string | null): Promise<InboxListResponse> {
    const url = `${this.baseUrl}/api/v3/inbox`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q });
    return this.request<InboxListResponse>("GET", url, { params });
  }

  public async getInboxes(limit: number = 10, offset: number = 0, q?: string | null): Promise<InboxListResponse> {
    return this.get_inboxes(limit, offset, q);
  }

  /**
   * Get an inbox.
   */
  public async get_inbox(inbox_id: string): Promise<InboxResponse> {
    const url = `${this.baseUrl}/api/v3/inbox/${inbox_id}`;
    return this.request<InboxResponse>("GET", url);
  }

  public async getInbox(inbox_id: string): Promise<InboxResponse> {
    return this.get_inbox(inbox_id);
  }

  /**
   * Update an inbox.
   */
  public async update_inbox(inbox_id: string, body: InboxUpdate): Promise<InboxResponse> {
    const url = `${this.baseUrl}/api/v3/inbox/${inbox_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<InboxResponse>("PATCH", url, { json: payload });
  }

  public async updateInbox(inbox_id: string, body: InboxUpdate): Promise<InboxResponse> {
    return this.update_inbox(inbox_id, body);
  }

  /**
   * List conversations. `status_in` is a comma-separated list of statuses.
   */
  public async get_conversations(status_in?: string | null, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ConversationListResponse> {
    const url = `${this.baseUrl}/api/v3/conversations`;
    const params = HipcallBaseClient.buildParams({ "status[in]": status_in, "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<ConversationListResponse>("GET", url, { params });
  }

  public async getConversations(status_in?: string | null, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<ConversationListResponse> {
    return this.get_conversations(status_in, limit, offset, q, sort);
  }

  /**
   * Get a conversation by ID. `date` (UTC, %Y-%m-%d) is required by the API spec.
   */
  public async get_conversation(conversation_id: string, date: string): Promise<ConversationResponse> {
    const url = `${this.baseUrl}/api/v3/conversations/${conversation_id}`;
    const params = HipcallBaseClient.buildParams({ "date": date });
    return this.request<ConversationResponse>("GET", url, { params });
  }

  public async getConversation(conversation_id: string, date: string): Promise<ConversationResponse> {
    return this.get_conversation(conversation_id, date);
  }

  /**
   * Update a conversation.
   */
  public async update_conversation(conversation_id: string, body: ConversationUpdate): Promise<ConversationResponse> {
    const url = `${this.baseUrl}/api/v3/conversations/${conversation_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<ConversationResponse>("PATCH", url, { json: payload });
  }

  public async updateConversation(conversation_id: string, body: ConversationUpdate): Promise<ConversationResponse> {
    return this.update_conversation(conversation_id, body);
  }

  /**
   * List messages in a conversation.
   */
  public async get_conversation_messages(conversation_id: string, limit: number = 10, offset: number = 0): Promise<MessageListResponse> {
    const url = `${this.baseUrl}/api/v3/conversations/${conversation_id}/messages`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset });
    return this.request<MessageListResponse>("GET", url, { params });
  }

  public async getConversationMessages(conversation_id: string, limit: number = 10, offset: number = 0): Promise<MessageListResponse> {
    return this.get_conversation_messages(conversation_id, limit, offset);
  }

  /**
   * Send a text message to a conversation.
   */
  public async send_text_message(conversation_id: string, body: TextMessageCreate): Promise<MessageResponse> {
    const url = `${this.baseUrl}/api/v3/conversations/${conversation_id}/messages/text`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<MessageResponse>("POST", url, { json: payload });
  }

  public async sendTextMessage(conversation_id: string, body: TextMessageCreate): Promise<MessageResponse> {
    return this.send_text_message(conversation_id, body);
  }

  /**
   * Send a WhatsApp template message.
   */
  public async send_template_message(inbox_id: string, body: TemplateMessageCreate): Promise<TemplateMessageResponse> {
    const url = `${this.baseUrl}/api/v3/inbox/${inbox_id}/messages/template`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<TemplateMessageResponse>("POST", url, { json: payload });
  }

  public async sendTemplateMessage(inbox_id: string, body: TemplateMessageCreate): Promise<TemplateMessageResponse> {
    return this.send_template_message(inbox_id, body);
  }

  /**
   * Get a template send record.
   */
  public async get_template_message(inbox_id: string, template_message_id: string): Promise<TemplateMessageResponse> {
    const url = `${this.baseUrl}/api/v3/inbox/${inbox_id}/messages/template/${template_message_id}`;
    return this.request<TemplateMessageResponse>("GET", url);
  }

  public async getTemplateMessage(inbox_id: string, template_message_id: string): Promise<TemplateMessageResponse> {
    return this.get_template_message(inbox_id, template_message_id);
  }

  /**
   * List deals.
   */
  public async get_deals(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<DealListResponse> {
    const url = `${this.baseUrl}/api/v3/deals`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<DealListResponse>("GET", url, { params });
  }

  public async getDeals(limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<DealListResponse> {
    return this.get_deals(limit, offset, q, sort);
  }

  /**
   * Get a deal by ID.
   */
  public async get_deal(deal_id: number): Promise<DealResponse> {
    const url = `${this.baseUrl}/api/v3/deals/${deal_id}`;
    return this.request<DealResponse>("GET", url);
  }

  public async getDeal(deal_id: number): Promise<DealResponse> {
    return this.get_deal(deal_id);
  }

  /**
   * List comments on a deal.
   */
  public async get_deal_comments(deal_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    const url = `${this.baseUrl}/api/v3/deals/${deal_id}/comments`;
    const params = HipcallBaseClient.buildParams({ "limit": limit, "offset": offset, "q": q, "sort": sort });
    return this.request<CommentListResponse>("GET", url, { params });
  }

  public async getDealComments(deal_id: number, limit: number = 10, offset: number = 0, q?: string | null, sort?: string | null): Promise<CommentListResponse> {
    return this.get_deal_comments(deal_id, limit, offset, q, sort);
  }

  /**
   * Add a comment to a deal.
   */
  public async create_deal_comment(deal_id: number, body: CommentCreate): Promise<CommentResponse> {
    const url = `${this.baseUrl}/api/v3/deals/${deal_id}/comments`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<CommentResponse>("POST", url, { json: payload });
  }

  public async createDealComment(deal_id: number, body: CommentCreate): Promise<CommentResponse> {
    return this.create_deal_comment(deal_id, body);
  }

  /**
   * List published procedures.
   */
  public async get_procedures(): Promise<ProcedureListResponse> {
    const url = `${this.baseUrl}/api/v3/procedures`;
    return this.request<ProcedureListResponse>("GET", url);
  }

  public async getProcedures(): Promise<ProcedureListResponse> {
    return this.get_procedures();
  }

  /**
   * Get a published procedure by UUID.
   */
  public async get_procedure(procedure_uuid: string): Promise<ProcedureResponse> {
    const url = `${this.baseUrl}/api/v3/procedures/${procedure_uuid}`;
    return this.request<ProcedureResponse>("GET", url);
  }

  public async getProcedure(procedure_uuid: string): Promise<ProcedureResponse> {
    return this.get_procedure(procedure_uuid);
  }

  /**
   * Register a mobile device.
   */
  public async register_mobile_device(body: MobileDeviceCreate): Promise<MobileDevice> {
    const url = `${this.baseUrl}/api/v3/mobile/devices`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<MobileDevice>("POST", url, { json: payload });
  }

  public async registerMobileDevice(body: MobileDeviceCreate): Promise<MobileDevice> {
    return this.register_mobile_device(body);
  }

  /**
   * Update mobile device settings.
   */
  public async update_mobile_device(device_id: string, body: MobileDeviceUpdate): Promise<MobileDeviceUpdateResponse> {
    const url = `${this.baseUrl}/api/v3/mobile/devices/${device_id}`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<MobileDeviceUpdateResponse>("PATCH", url, { json: payload });
  }

  public async updateMobileDevice(device_id: string, body: MobileDeviceUpdate): Promise<MobileDeviceUpdateResponse> {
    return this.update_mobile_device(device_id, body);
  }

  /**
   * Unregister a mobile device.
   */
  public async delete_mobile_device(device_id: string): Promise<MobileDeviceDeleteResponse> {
    const url = `${this.baseUrl}/api/v3/mobile/devices/${device_id}`;
    return this.request<MobileDeviceDeleteResponse>("DELETE", url);
  }

  public async deleteMobileDevice(device_id: string): Promise<MobileDeviceDeleteResponse> {
    return this.delete_mobile_device(device_id);
  }

  /**
   * Register a push notification token.
   */
  public async register_push_token(body: PushTokenCreate): Promise<PushTokenResponse> {
    const url = `${this.baseUrl}/api/v3/push/token`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<PushTokenResponse>("POST", url, { json: payload });
  }

  public async registerPushToken(body: PushTokenCreate): Promise<PushTokenResponse> {
    return this.register_push_token(body);
  }

  /**
   * Delete a push notification token.
   */
  public async delete_push_token(): Promise<null> {
    const url = `${this.baseUrl}/api/v3/push/token`;
    return this.request<null>("DELETE", url);
  }

  public async deletePushToken(): Promise<null> {
    return this.delete_push_token();
  }

  /**
   * Generate a SIP JWT token.
   */
  public async create_sip_token(request?: SipTokenCreate | null): Promise<SipTokenResponse> {
    const url = `${this.baseUrl}/api/v3/sip/token`;
    const payload = request ? HipcallBaseClient.cleanBody(request) : {};
    return this.request<SipTokenResponse>("POST", url, { json: payload });
  }

  public async createSipToken(request?: SipTokenCreate | null): Promise<SipTokenResponse> {
    return this.create_sip_token(request);
  }

  /**
   * Record an attribution event.
   */
  public async create_attribution(body: AttributionCreate): Promise<AttributionResponse> {
    const url = `${this.baseUrl}/api/v3/attribution`;
    const payload = HipcallBaseClient.cleanBody(body);
    return this.request<AttributionResponse>("POST", url, { json: payload });
  }

  public async createAttribution(body: AttributionCreate): Promise<AttributionResponse> {
    return this.create_attribution(body);
  }

}

export { Client as HipcallClient, Client as AsyncClient };
