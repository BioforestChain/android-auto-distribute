export interface AccessTokenSuccessResult {
  access_token: string;
  expires_in: number;
}

export interface ResponseBaseResult {
  ret: {
    code: number;
    message: string;
  };
}

export interface AppIdSuccessResult extends ResponseBaseResult {
  appids: AppId[];
}

interface AppId {
  key: string;
  value: string;
}

interface AppInfo {
  releaseState: number;
  defaultLang: string;
  parentType: number;
  childType: number;
  grandChildType: number;
  privacyPolicy: string;
  appAdapters: string;
  isFree: number;
  price: string;
  priceDetail: string;
  publishCountry: string;
  contentRate: string;
  hispaceAutoDown: number;
  appTariffType: string;
  developerNameCn: string;
  developerNameEn: string;
  developerAddr: string;
  developerEmail: string;
  developerPhone: string;
  developerWebsite: string;
  certificateURLs: string;
  publicationURLs: string;
  cultureRecordURLs: string;
  updateTime: string;
  versionNumber: string;
  versionCode: number;
  versionId: string;
  onShelfVersionNumber: string;
  onShelfVersionCode: number;
  onShelfVersionId: string;
  familyShareTag: number;
  deviceTypes: DeviceTypes[];
  webGameFlag: number;
  privacyLabel: string;
  registeredIdType: number;
  registeredIdNumber: string;
}

interface DeviceTypes {
  deviceType: number;
  appAdapters: string;
}

export interface AppInfoSuccessResult extends ResponseBaseResult {
  appInfo: AppInfo;
  auditInfo: AuditInfo;
  languages: LanguagesInfo[];
}

interface AuditInfo {
  auditOpinion: string;
}

interface LanguagesInfo {
  lang: string;
  appName: string;
  appDesc: string;
  briefInfo: string;
  newFeatures: string;
  icon: string;
  showType: number;
  videoShowType: number;
  introPic: string;
  deviceMaterials: DeviceMaterials[];
}

interface DeviceMaterials {
  deviceType: number;
  appIcon: string;
  screenShots: string[];
  showType: number;
  vrCoverLayeredImage: [];
  vrRecomGraphic4to3: [];
  vrRecomGraphic1to1: [];
  promoGraphics: [];
  videoShowType: number;
}

export interface UploadUrlInfoSuccessResult extends ResponseBaseResult {
  urlInfo: CommonUrlInfo;
}

interface CommonUrlInfo {
  objectId: string;
  url: string;
  method: string;
  headers: Map<string, string>;
}

export interface FileInfo {
  fileName: string;
  fileDestUrl: string;
  versionName: string;
  displayName: string;
}

export interface UpdateAppInfoSuccessResult extends ResponseBaseResult {
  pkgVersion: string[];
}
