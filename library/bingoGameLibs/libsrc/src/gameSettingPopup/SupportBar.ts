class SupportBar extends egret.Sprite{

	private langResource: string;
    private email: string;
    private topTextInput: eui.EditableText;
    private supportTextInput: egret.TextField;
    private bg: egret.Bitmap;
    private closeBtn: TouchDownButton;

	private supportSuccessContainer: egret.DisplayObjectContainer;

	public constructor( size: egret.Point ) {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( - size.x >> 1, -size.y >> 1, size.x + 100, size.y ), 0, false, 0.0 );
		this.touchEnabled = true;

		this.langResource = "support_json";
        this.email = PlayerConfig.player("facebook.email") || PlayerConfig.player("user_info.email") || "";

        this.buildBg();
        this.buildTitleText();
        this.buildSupportText();
        this.buildSupportBtn();
        this.buildCloseBtn();
	}

    private buildBg(){
        this.bg = Com.addBitmapAt( this, this.langResource + ".popup_bg_big", -623, -377 );
        this.bg.scale9Grid = new egret.Rectangle(40, 40, 569, 609);
        this.bg.width = 1247;
        this.bg.height = 755;
    }

    private buildTitleText(){
        // top title
        let topTitle = Com.addTextAt(this, 85-623, 28-377, 432, 88, 64, true, false);
        topTitle.fontFamily = "TCM_conden";
        topTitle.textAlign = "left";
        topTitle.verticalAlign = "middle";
        topTitle.bold = true;
        topTitle.stroke = 4;
        topTitle.textColor = 0xD0C39D;
        topTitle.strokeColor = 0xC9A947;
        topTitle.text = MuLang.getText("support");

        // top text input
        let topTextContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, topTextContainer, 185-623, 115-377);
        // top text bg
        let topTextBg = Com.addBitmapAt(topTextContainer, this.langResource + ".select_box", 0, 0);
        topTextBg.scale9Grid = new egret.Rectangle(11, 11, 27, 27);
        topTextBg.width = 980;
        topTextBg.height = 83;

        // email text
        let emailText = Com.addTextAt(topTextContainer, 800, 0, 170, 83, 48, false, false);
        emailText.fontFamily = "TCM_conden";
        emailText.textAlign = "right";
        emailText.verticalAlign = "middle";
        emailText.textColor = 0xB0881B;
        emailText.text = MuLang.getText("email", MuLang.CASE_UPPER);
        // top text input
        this.topTextInput = new eui.EditableText();
        Com.addObjectAt( topTextContainer, this.topTextInput, 20, 0 );
        this.topTextInput.width = 940;
        this.topTextInput.height = 83;
        this.topTextInput.size = 48;
        // this.topTextInput.textAlign = "left";
        this.topTextInput.verticalAlign = "middle";
        this.topTextInput.fontFamily = "TCM_conden"
        this.topTextInput.bold = true;
        this.topTextInput.textColor = 0xFFFFFF;
        this.topTextInput.text = this.email;

        // talk icon
        Com.addBitmapAt(this, this.langResource + ".icon_zendesk", 90-623, 118-377);
    }

    private buildSupportText(){
        // support text
        let supportText = Com.addTextAt(this, 84-623, 205-377, 313, 53, 42, false, false);
        supportText.fontFamily = "TCM_conden";
        supportText.textAlign = "left";
        supportText.verticalAlign = "middle";
        supportText.textColor = 0xB0881B;
        supportText.text = MuLang.getText("give_us_support");

        // support text input
        let supportTextContainer = new egret.DisplayObjectContainer();
        supportTextContainer.width = 1084;
        supportTextContainer.height = 445;
        Com.addObjectAt(this, supportTextContainer, 83-623, 258-377);
        // support text bg
        let supportTextBg = Com.addBitmapAt(supportTextContainer, this.langResource + ".select_box", 0, 0);
        supportTextBg.scale9Grid = new egret.Rectangle(11, 11, 27, 27);
        supportTextBg.width = 1084;
        supportTextBg.height = 445;
        // support text input
        this.supportTextInput = Com.addTextAt(supportTextContainer, 20, 20, 1044, 405, 36, false, false);
        this.supportTextInput.fontFamily = "TCM_conden";
        this.supportTextInput.textAlign = "left";
        this.supportTextInput.bold = true;
        this.supportTextInput.multiline = true;
        this.supportTextInput.wordWrap = true;
        this.supportTextInput.type = egret.TextFieldType.INPUT;
        this.supportTextInput.textColor = 0xFFFFFF;
    }

    private buildSupportBtn(){
        // send btn container
        let sendBtnContainer = Com.addDownButtonAt( this, this.langResource + ".button_send", this.langResource + ".button_send", 1011-623, 586-377, this.sendSupport.bind(this), true );

        // support submit button text
        let sendBtnText = Com.addTextAt(this, 31, 18, 133, 90, 48, true, false);
        sendBtnText.fontFamily = "TCM_conden";
        sendBtnText.verticalAlign = "middle";
        sendBtnText.stroke = 2;
        sendBtnText.strokeColor = 0x054B05;
        sendBtnText.text = MuLang.getText("send");

        sendBtnContainer.addChild( sendBtnText );
    }

    private buildCloseBtn(){
        this.closeBtn = Com.addDownButtonAt( this, this.langResource + ".button_close", this.langResource + ".button_close", this.bg.width >> 1, -this.bg.height >> 1, this.closeThisBar.bind(this), true );
        this.closeBtn.x -= this.closeBtn.width >> 1;
        this.closeBtn.y -= this.closeBtn.height >> 1;
    }

	private sendSupport(): void {
        this.email = this.topTextInput.text;
        let value = this.supportTextInput.text;

        if (value !== "" && this.email !== "") {
            var XHR = eval("window.XMLHttpRequest") ? new XMLHttpRequest() : eval("new ActiveXObject('Microsoft.XMLHTTP')");
            XHR.open("post", "https://gamesmartltd.zendesk.com/api/v2/tickets.json", true);
            XHR.setRequestHeader("Accept", "application/json");
            XHR.setRequestHeader("Content-Type", "application/json");
            XHR.setRequestHeader("Authorization", "Basic YW55QGRvdXRvcmJpbmdvLmNvbTpCaW5nbzQ1NiE=");
            XHR.send(JSON.stringify({
                "ticket": {
                    "subject": value.length > 40 ? value.substring(0, 40) : value,
                    "comment": {
                        "body": value
                    },
                    "requester": {
                        "name": PlayerConfig.player("facebook.name"),
                        "email": this.email
                    },
                    tags: [
                        "canvas",
                        "userid_" + PlayerConfig.player("user.id"),
                        "level_" + PlayerConfig.player("score.level"),
                        "loyalty_level_" + PlayerConfig.player("loyalty.loyalty_level")
                    ]
                }
            }));

            egret.setTimeout(function () {
                this.buildSupportSuccessContainer();
            }, this, 2000);
        }
    }

    private closeThisBar(): void {
        if( this.parent ) this.parent.removeChild( this );
    }

    private buildSupportSuccessContainer(){
        this.supportSuccessContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.supportSuccessContainer, -623, -377 );

        // support success bg
        let successBg = Com.addBitmapAt(this.supportSuccessContainer, this.langResource + ".popup_bg_big", 0, 0);
        successBg.scale9Grid = new egret.Rectangle(40, 40, 569, 609);
        successBg.width = 1247;
        successBg.height = 755;

        // support success title
        let supportSuccessTitle = Com.addTextAt(this.supportSuccessContainer, 208, 124, 830, 127, 64, false, false);
        supportSuccessTitle.fontFamily = "TCM_conden";
        supportSuccessTitle.textColor = 0xFFFFFF;
        supportSuccessTitle.verticalAlign = "middle";
        supportSuccessTitle.text = Utils.toFirstUpperCase(MuLang.getText("FACEBOOK_WAIT_CONGRATULATIONS_TITLE"));

        // support success text
        let supportSuccessText = Com.addTextAt(this.supportSuccessContainer, 84, 294, 1079, 262, 48, false, false);
        supportSuccessText.fontFamily = "TCM_conden";
        supportSuccessText.textColor = 0xFFFFFF;
        supportSuccessText.text = MuLang.getText("support_success_text");

        this.addChild( this.closeBtn );
    }
}