export interface AccessTokenSuccessResult {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface AppIdInfo {
  appId: number;
  packageName: string;
}

export interface ResponseBaseResult {
  code: number;
  msg: string;
}

export interface AppIdSuccessResult extends ResponseBaseResult {
  data?: AppIdInfo[];
}

interface PubBasicInfo {
  appCategoryId: number;
  createTime: string;
  packageName: string;
  appId: number;
  secretKey: string;
  appClassification: string;
  devName: string;
  supplyName: string;
  defaultLanguage: string;
  releaseCountry: string;
  paymentInfo: number;
  ratingId: number;
  privacyPolicyUrl: string;
  appRegistrationEntityStatus: string;
  unifiedSocialCreditId: string;
  appRegistrationNumber?: string;
  appRegistrationEntityName?: string;
  publicationNumber?: string;
  devNameEn?: string;
  supplyNameEn?: string;
  webUrl?: string;
  customerServiceEmail?: string;
  customerServiceTel?: string;
  inAppPayment?: string;
}

interface PubLanguageInfo {
  languageId: string;
  appName: string;
  intro: string;
  briefIntro?: string;
  newFeature?: string;
}

interface PubFileInfo {
  fileName: string;
  fileType: number;
  fileUrl: string;

  languageId?: string;
  order?: number;
  fileSha256?: string;
}

interface PubReleaseInfo {
  versionCode: number;
  versionName?: string;
}

interface PubPublishInfo {
  forceUpdate: number;
  releaseType: number;
  testAccount?: string;
  testPassword?: string;
  testComment?: string;
  releaseTime?: string;
}

interface PubAppInfo {
  basicInfo: PubBasicInfo;
  languageInfo: PubLanguageInfo[];
  publishInfo: PubPublishInfo;
  fileInfo: PubFileInfo[];
  releaseInfo: PubReleaseInfo;
}

export interface AppInfoSuccessResult extends ResponseBaseResult {
  data?: PubAppInfo;
}

// https://developer.honor.com/cn/doc/guides/101359#h2-1712482613369
export enum FileType {
  APP_ICON = 1,
  APP_DESCRIPTION_SNAPSHOT_H = 2,
  APP_DESCRIPTION_SNAPSHOT_V = 3,
  APP_DESCRIPTION_VIDEO_H = 10,
  APP_DESCRIPTION_VIDEO_V = 11,
  APP_RECOMMEND_VIDEO = 12,
  APP_DESCRIPTION_VIDEO_POST_H = 26,
  APP_DESCRIPTION_VIDEO_POST_V = 27,
  APP_HEAD_IMAGE = 33,
  COMPUTER_SOFTWARE_COPYRIGHT_REGISTRATION_CERTIFICATE = 13,
  COPYRIGHT_AUTHORIZATION = 14,
  APP_ICP = 15,
  COMPLIANCE_REPORT_UPLOADED_ON_OTHER_CHANNELS = 16,
  COMPANY_EQUITY_STRUCTURE = 17,
  GAME_COMPLIANCE_OPERATION_COMMITMENT_LETTER = 18,
  VALUE_ADDED_TELECOMMUNICATIONS_BUSINESS_LICENSE = 19,
  GAME_LICENSE_APPROVAL_DOCUMENT = 21,
  GAME_LICENSE = 22,
  OTHER_SPECIAL_QUALIFICATIONS = 35,
  OTHER_QUALIFICATIONS_ZIP = 36,
  BUSINESS_LICENSE_OF_THE_RECORD_FILING_ENTITY = 37,
  REGISTRATION_STATEMENT_AGREEMENT = 38,
  SINGLE_PLAYER_APPLICATION_DISCLAIMER_AGREEMENT = 39,
  APP_APK = 100,
}

interface FileUploadPath {
  fileName: string;
  uploadUrl: string;
  objectId: number;
  expireTime: number;
}

export interface UploadUrlInfoSuccessResult extends ResponseBaseResult {
  data: FileUploadPath[];
}

interface PubAuditResult {
  releaseId: string;
  versionName?: string;
  versionCode?: number;
  auditResult: number;
  auditMessage?: string;
  auditAttachment?: string[];
}

export interface AppCurrentReleaseResult extends ResponseBaseResult {
  data?: PubAuditResult;
}
