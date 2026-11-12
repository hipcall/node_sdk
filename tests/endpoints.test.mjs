import test from "node:test";
import assert from "node:assert/strict";
import {
  Client,
  HipcallClient,
  DEFAULT_HIPCALL_BASE_ADDRESS,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
  HipcallAPIException,
} from "../dist/index.js";

function createFakeFetch(status = 200, payload = { data: { id: 1 }, meta: { count: 1, limit: 10, offset: 0 } }) {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({ url, init });
    return {
      status,
      text: async () => (status === 204 ? "" : JSON.stringify(payload)),
    };
  };
  return { fakeFetch, calls };
}

test("Client initialization and headers", () => {
  assert.throws(() => new Client(""), /API key must be provided/);
  const client = new Client("test_key");
  assert.equal(client.apiKey, "test_key");
  assert.equal(client.baseUrl, DEFAULT_HIPCALL_BASE_ADDRESS);
  assert.deepEqual(client.getDefaultHeaders(), {
    Authorization: "Bearer test_key",
    "Content-Type": "application/json",
  });

  const customClient = new HipcallClient({
    apiKey: "key2",
    baseUrl: "https://use.hipcall.com/",
  });
  assert.equal(customClient.baseUrl, "https://use.hipcall.com");
});

test("Exception mapping for 400, 401, 404, 422, 500", async () => {
  {
    const { fakeFetch } = createFakeFetch(400, { errors: { detail: "Invalid param" } });
    const client = new Client("k", null, fakeFetch);
    await assert.rejects(() => client.getProfile(), BadRequestException);
  }
  {
    const { fakeFetch } = createFakeFetch(401, { errors: { detail: "Unauthorized" } });
    const client = new Client("k", null, fakeFetch);
    await assert.rejects(() => client.getProfile(), UnauthorizedException);
  }
  {
    const { fakeFetch } = createFakeFetch(404, { errors: { detail: "Not found" } });
    const client = new Client("k", null, fakeFetch);
    await assert.rejects(() => client.getProfile(), NotFoundException);
  }
  {
    const { fakeFetch } = createFakeFetch(422, { errors: { name: ["can't be blank"] } });
    const client = new Client("k", null, fakeFetch);
    await assert.rejects(() => client.getProfile(), UnprocessableEntityException);
  }
  {
    const { fakeFetch } = createFakeFetch(500, { error: "Server error" });
    const client = new Client("k", null, fakeFetch);
    await assert.rejects(() => client.getProfile(), HipcallAPIException);
  }
});

test("Core endpoints (calls, tasks, contacts, companies, extensions, numbers, users)", async () => {
  const { fakeFetch, calls } = createFakeFetch(200, {
    data: [{ id: 1 }],
    meta: { count: 1, limit: 10, offset: 0 },
  });
  const client = new Client("dummy_token", "https://use.hipcall.com.tr", fakeFetch);

  await client.getCalls(10, 0, "90555");
  assert.equal(calls.at(-1).init.method, "GET");
  assert.match(calls.at(-1).url, /\/api\/v3\/calls\?.*q=90555/);

  await client.callAndBridge(4200, "+905550000000", true, true, "Support");
  assert.equal(calls.at(-1).init.method, "POST");
  assert.equal(calls.at(-1).url, "https://use.hipcall.com.tr/api/v3/users/4200/call");
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), {
    callee_number: "+905550000000",
    ring_user_first: true,
    call_masking: true,
    call_masking_name: "Support",
  });

  await client.createTask({ name: "Follow up" });
  assert.equal(calls.at(-1).init.method, "POST");
  assert.equal(calls.at(-1).url, "https://use.hipcall.com.tr/api/v3/tasks");
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), {
    data: { name: "Follow up" },
  });

  await client.createCallCard("uuid-123", {
    card: [{ type: "title", text: "Acme CRM" }],
  });
  assert.equal(calls.at(-1).init.method, "POST");
  assert.equal(calls.at(-1).url, "https://use.hipcall.com.tr/api/v3/calls/uuid-123/cards");

  await client.getExtensions();
  assert.match(calls.at(-1).url, /\/api\/v3\/extensions/);

  await client.getNumbers();
  assert.match(calls.at(-1).url, /\/api\/v3\/numbers/);

  await client.getUsers();
  assert.match(calls.at(-1).url, /\/api\/v3\/users/);

  await client.getContacts();
  assert.match(calls.at(-1).url, /\/api\/v3\/contacts/);

  await client.getCompanies();
  assert.match(calls.at(-1).url, /\/api\/v3\/companies/);
});

test("All 104 endpoints (snake_case and camelCase)", async () => {
  const { fakeFetch, calls } = createFakeFetch(200, { data: [] });
  const client = new Client("dummy", "https://use.hipcall.com.tr", fakeFetch);
  await client.get_call("str501", "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCall("str501", "str502");
  await client.get_calls();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCalls();
  await client.call_and_bridge(9001, "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.callAndBridge(9001, "str502");
  await client.get_tasks();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTasks();
  await client.create_task({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createTask({});
  await client.get_task(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTask(9001);
  await client.update_task(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateTask(9001, {});
  await client.get_task_comments(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTaskComments(9001);
  await client.create_task_comment(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createTaskComment(9001, {});
  await client.get_task_tags(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTaskTags(9001);
  await client.add_task_tag(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addTaskTag(9001, {});
  await client.delete_task_tag(9001, 9002);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteTaskTag(9001, 9002);
  await client.get_call_comments("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCallComments("str501");
  await client.create_call_comment("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createCallComment("str501", {});
  await client.get_call_tags("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCallTags("str501");
  await client.add_call_tag("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addCallTag("str501", {});
  await client.delete_call_tag("str501", 9002);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteCallTag("str501", 9002);
  await client.get_call_cards("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCallCards("str501");
  await client.create_call_card("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createCallCard("str501", {});
  await client.get_call_disposition("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCallDisposition("str501");
  await client.set_call_disposition("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.setCallDisposition("str501", {});
  await client.get_dispositions();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getDispositions();
  await client.get_extensions();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getExtensions();
  await client.get_extension(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getExtension(9001);
  await client.call_extension(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.callExtension(9001, {});
  await client.get_greetings();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getGreetings();
  await client.get_greeting(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getGreeting(9001);
  await client.get_numbers();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getNumbers();
  await client.get_number(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getNumber(9001);
  await client.get_teams();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTeams();
  await client.get_team(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTeam(9001);
  await client.get_voicemails();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getVoicemails();
  await client.get_voicemail(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getVoicemail(9001);
  await client.get_users();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getUsers();
  await client.get_user(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getUser(9001);
  await client.update_user(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateUser(9001, {});
  await client.get_user_today_stats(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getUserTodayStats(9001);
  await client.get_profile();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getProfile();
  await client.get_profile_today_stats();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getProfileTodayStats();
  await client.get_contacts();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContacts();
  await client.create_contact({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createContact({});
  await client.get_contact(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContact(9001);
  await client.update_contact(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateContact(9001, {});
  await client.get_contact_by_external_id("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactByExternalId("str501");
  await client.assign_contact(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.assignContact(9001);
  await client.get_contact_custom_fields();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactCustomFields();
  await client.get_contact_comments(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactComments(9001);
  await client.create_contact_comment(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createContactComment(9001, {});
  await client.get_contact_consents(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactConsents(9001);
  await client.create_contact_consent(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createContactConsent(9001, {});
  await client.add_contact_emails(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addContactEmails(9001, {});
  await client.delete_contact_email(9001, "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteContactEmail(9001, "str502");
  await client.add_contact_phones(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addContactPhones(9001, {});
  await client.delete_contact_phone(9001, "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteContactPhone(9001, "str502");
  await client.get_contact_tags(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactTags(9001);
  await client.add_contact_tag(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addContactTag(9001, {});
  await client.delete_contact_tag(9001, 9002);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteContactTag(9001, 9002);
  await client.get_companies();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompanies();
  await client.create_company({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createCompany({});
  await client.get_company(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompany(9001);
  await client.update_company(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateCompany(9001, {});
  await client.get_company_by_external_id("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompanyByExternalId("str501");
  await client.assign_company(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.assignCompany(9001);
  await client.get_company_custom_fields();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompanyCustomFields();
  await client.get_company_comments(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompanyComments(9001);
  await client.create_company_comment(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createCompanyComment(9001, {});
  await client.add_company_emails(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addCompanyEmails(9001, {});
  await client.delete_company_email(9001, "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteCompanyEmail(9001, "str502");
  await client.add_company_phones(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addCompanyPhones(9001, {});
  await client.delete_company_phone(9001, "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteCompanyPhone(9001, "str502");
  await client.get_company_tags(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getCompanyTags(9001);
  await client.add_company_tag(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.addCompanyTag(9001, {});
  await client.delete_company_tag(9001, 9002);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteCompanyTag(9001, 9002);
  await client.get_employee_sizes();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getEmployeeSizes();
  await client.get_life_cycles();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getLifeCycles();
  await client.get_sectors();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getSectors();
  await client.get_sources();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getSources();
  await client.get_contact_center_attributes();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getContactCenterAttributes();
  await client.lookup_by_email("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.lookupByEmail("str501");
  await client.lookup_by_phone("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.lookupByPhone("str501");
  await client.get_tags();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTags();
  await client.get_inboxes();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getInboxes();
  await client.get_inbox("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getInbox("str501");
  await client.update_inbox("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateInbox("str501", {});
  await client.get_conversations();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getConversations();
  await client.get_conversation("str501", "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getConversation("str501", "str502");
  await client.update_conversation("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateConversation("str501", {});
  await client.get_conversation_messages("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getConversationMessages("str501");
  await client.send_text_message("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.sendTextMessage("str501", {});
  await client.send_template_message("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.sendTemplateMessage("str501", {});
  await client.get_template_message("str501", "str502");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getTemplateMessage("str501", "str502");
  await client.get_deals();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getDeals();
  await client.get_deal(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getDeal(9001);
  await client.get_deal_comments(9001);
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getDealComments(9001);
  await client.create_deal_comment(9001, {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createDealComment(9001, {});
  await client.get_procedures();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getProcedures();
  await client.get_procedure("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.getProcedure("str501");
  await client.register_mobile_device({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.registerMobileDevice({});
  await client.update_mobile_device("str501", {});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.updateMobileDevice("str501", {});
  await client.delete_mobile_device("str501");
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deleteMobileDevice("str501");
  await client.register_push_token({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.registerPushToken({});
  await client.delete_push_token();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.deletePushToken();
  await client.create_sip_token();
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createSipToken();
  await client.create_attribution({});
  assert.match(calls.at(-1).url, /^https:\/\/use\.hipcall\.com\.tr\/api\/v3\//);
  await client.createAttribution({});
});
