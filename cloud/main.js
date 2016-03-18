// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	
	response.success("成功");
});
var User = AV.Object.extend("User");
var Admin = AV.Object.extend("Admin");
var Type = AV.Object.extend("Type");
var Ticket = AV.Object.extend("Ticket");
var Notes = AV.Object.extend("Notes");
/*
 * NewTksendMail 新建工单发送邮件
 *云函数  获取参数内容并发送邮件 
 *@typeID: typeID   工单类型id
 *@title: title     工单问题标题
 *@tklink: 新工单的地址
 */ 
 
/*{"typeID":"56d7ed3ea341310053d9c6dc","title":"问题标题","tklink":'http://127.0.0.1:8020/Tickets/ticket.html?id=56ebd029816dfa0052dbd8c3'}*/
AV.Cloud.define("NewTksendMail", function(request, response) {
	var typeID = request.params.typeID;
	var title = request.params.title;
	var tklink = request.params.tklink;
	var to="";//收件人邮件
	var content="<h3>管理员你好！你负责的模块有新提问了，点击以下链接回复。</h1>"+
		"<div>"+"问题：&nbsp;&nbsp;<b><a href='"+tklink+"'>"+title+"</a></b>"+
		"</div>"+
		"<div style='text-align: right;'>---「秒秒慧网络维护工单系统」</div>";
	//获取收件人列表
	var query=new AV.Query(Admin);
	query.equalTo("type",typeID);
	query.include("user");
	query.find({
		success:function(users){
			var len=users.length;
			for (var i=0;i<len;i++) {
				var obj=users[i];
				var username=obj.get("user").get("email");
				to+=username;
				if(i!=len-1){
					to+=","
				}
			}
			console.log("执行"+to+content);
			seadMail("您负责的模块有新提问，请尽快回复客户。",to,content);
			response.success("cg");
		}
	});
});

/*
 * ReplyTksendMail 工单回复发送邮件
 *
 */
AV.Cloud.define("ReplyTksendMail", function(request, response) {
	

});

/*
 * 发送邮件函数
 * @title: 邮件标题  角色不同标题不同
 * @to:接收人  可以是多个
 * @content：邮件内容
 */
function seadMail(title,to,content){
	console.log("执行函数send");
	var nodemailer = require('../public/node_modules/nodemailer/lib/nodemailer');
	// 开启一个 SMTP 连接池
	var smtpTransport = nodemailer.createTransport("SMTP", {
		host: "smtp.qq.com", // 主机
		secureConnection: true, // 使用 SSL
		port: 465, // SMTP 端口
		domains: ["qq.com"],
		requiresAuth: true,
		auth: {
			user: "390579684@qq.com", // 账号
			pass: "kyjvppnehagqbjgf" // 授权密码
		}
	});
	// 设置邮件内容
	var mailOptions = {
			from: "秒秒慧工单系统<390579684@qq.com>", // 发件地址
			to: to, // 收件列表
			subject: title, // 标题
			html: content // html 内容
		}
		// 发送邮件
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
		smtpTransport.close(); // 如果没用，关闭连接池
	});
}
