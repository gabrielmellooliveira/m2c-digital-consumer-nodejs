export class Message {
  static build({
    identifier,
    phoneNumber,
    message,
    campaignId,
  }: any) {
    return {
      identifier,
      phone_number: phoneNumber,
      message,
      campaign_id: campaignId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    };
  }
}