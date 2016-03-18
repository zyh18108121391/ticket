var nodemailer = require('../node_modules/nodemailer/lib/nodemailer');
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport("SMTP", {
	host: "smtp.qq.com", // 主机
	secureConnection: true, // 使用 SSL
	port: 465, // SMTP 端口
	domains: ["qq.com"],
	requiresAuth: true,
	auth: {
		user: "390579684@qq.com", // 账号
		pass: "kyjvppnehagqbjgf" // 密码
	}
	
});
// 设置邮件内容
var mailOptions = {
		from: "<390579684@qq.com>", // 发件地址
		to: "392926462@qq.com", // 收件列表
		subject: "郑银华邮件测试modemailer", // 标题
		html: "<b>你们看我屌吗？</b> 看吗？！" // html 内容
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