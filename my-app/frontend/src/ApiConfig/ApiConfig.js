export const baseurl = "https://node-realtime.mobiloitte.io"; //stagging
// export const baseurl = "http://172.16.1.224:1991"; //local
// export const baseurl = "http://172.16.6.56:1991"; //local new

const url = `${baseurl}/api/v1`;

const ApiConfig = {
  signUp: `${url}/user/signUp`,
  userLogin: `${url}/user/userLogin`,
  listNotification: `${url}/user/listNotification`,
  listNotification: `${url}/user/listNotification`,
  clearAllNotification: `${url}/user/clearAllNotification`,
  addFeedback: `${url}/user/addFeedback`,
  verifyOTP: `${url}/user/verifyOTP`,
  listdocument: `${url}/user/listdocument`,
  resendOTP: `${url}/user/resendOTP`,
  editProfile: `${url}/user/editProfile`,
  viewUser: `${url}/user/viewUser`,
  totalStorage: `${url}/user/totalStorage`,
  siteAssociates: `${url}/user/siteAssociates`,
  syncDataintoClintDb: `${url}/user/syncDataintoClintDb`,

  //static Content
  staticContentList: `${url}/static/staticContentList`,
  faqList: `${url}/static/faqList`,

  //Folder
  listFolder: `${url}/folder/listFolder`,
  RecentActivity: `${url}/folder/RecentActivity`,
  createFolder: `${url}/folder/createFolder`,
  deleteFolderOrFile: `${url}/folder/deleteFolderOrFile`,
  moveFile: `${url}/folder/moveFile`,
  renameFolder: `${url}/folder/renameFolder`,
  shareLink: `${url}/folder/shareLink`,

  //kyc
  applyKyc: `${url}/kyc/applyKyc`,
};
export default ApiConfig;
