export interface $AccessTokenSuccessResult {
  ok: boolean;
  createdItem: {
    accessToken: string;
  };
}

export interface $AccessTokenItem {
  access_token: string | null;
  exp: number;
}

export interface $AppContentList {
  contentName: string;
  contentId: string;
  contentStatus: string;
  standardPrice: string;
  paid: string;
  modifyDate: string;
}

export interface $CreateSessionSuccessResult {
  url: string;
  sessionId: string;
}

export interface $HeadersMap {
  [key: string]: string;
}

export interface $FileUploadSuccessResult {
  fileKey: string;
  fileName: string;
  fileSize: string;
  errorCode: null;
  errorMsg: null;
}

export interface $ContentUpdateItem {
  contentId: string;
  appTitle: string;
  icon: string | null;
  iconKey: string | null;
  newFeature: string;
  contentStatus: string;
  defaultLanguageCode: string;
  paid: string;
  publicationType: string;
  reviewFilename: string | null;
  reviewFilekey: string | null;
  binaryList: $FileBinaryItem[];
  screenshots: $ScreenshotsItem[];
  addLanguage: $AddLanguageItem[];
}

export interface $FileBinaryItem {
  fileName: string;
  binarySeq: string | null;
  versionCode: string | null;
  versionName: string | null;
  packageName: string;
  nativePlatforms: string | null;
  apiminSdkVersion: string | null;
  apimaxSdkVersion: string | null;
  iapSdk: string;
  gms: string;
  filekey: string | null;
}

export interface $ScreenshotsItem {
  screenshotPath: string;
  screenshotKey: string | null;
  reuseYn: boolean;
}

export interface $AddLanguageItem {
  languagecode: string;
  appTitle: string;
  description: string;
  newFeature: string | null;
  screenshots: $ScreenshotsItem[];
}
