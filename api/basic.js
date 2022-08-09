
const querybaseinfoset = '/querybaseinfoset';
// 获取省市区列表
const provinceList = '/queryallprovinces';

const cityList = '/querycitybyprovinceid';

const regionList = '/querydistrictbycityid';

const allRegion = '/queryRegionMenu';

// 收藏商品
const collectCreate = '/addattention';
// 删除收藏商品
const collectDel = '/cancelattention';

// APP支付宝支付
const aliPay = '/aliPay';
// 支付宝h5支付
const toaliwappay = '/toaliwappay';
// 支付宝pc支付
const toalipagepay = '/toalipagepay';
// 获取微信公众号支付
const wechatofficialaccountpayparm = '/wechatofficialaccountpayparm';
// 获取微信H5支付参数
const wechath5payparm = '/wechath5payparm';
// 获取微信小程序支付
const wechatappletpay = '/wechatappletpayparams';
// APP微信支付
const wxpay = '/wxpay';

// 版本检测
const versionsIndex = '/app-versions/versions/index';

// 站点帮助-列表
const helperIndex = '/help/cate';
// 站点帮助-详情
const helperView = '/help/desc';

// 站点帮助-列表
const articleIndex = '/article/column';
// 站点帮助-详情
const articleView = '/article';


export {
	articleIndex,articleView,
	querybaseinfoset,
	provinceList,
	cityList,
	regionList,
	collectCreate,
	collectDel,
	advList,
	advView,
	allRegion,
	configList,
	wechatConfig,
	notifyAnnounceIndex,
	notifyAnnounceView,
	versionsIndex,
	pickupPointIndex,
	helperIndex,
	helperView,
	bindingEquipment,
	authIsBinding,
	authCreate,
 aliPay,
// 支付宝h5支付
 toaliwappay,
// 支付宝pc支付
 toalipagepay ,
// 获取微信公众号支付
 wechatofficialaccountpayparm,
// 获取微信H5支付参数
 wechath5payparm,
// 获取微信小程序支付
	wechatappletpay,
// APP微信支付
 wxpay
};
