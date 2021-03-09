class SupportBar extends egret.Sprite{

	private langResource: string;
    private email: string;
    private topTextInput: eui.EditableText;
    private supportTextInput: egret.TextField;

	private supportSuccessContainer: egret.DisplayObjectContainer;

	public constructor( size: egret.Point ) {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( - size.x >> 1, -size.y >> 1, size.x + 100, size.y ), 0, false, 0.0 );
		this.touchEnabled = true;

		this.langResource = "support_json";
		Com.addBitmapAtMiddle( this, this.langResource + ".popup_bg_big", 0, 0 );
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
                this.supportSuccessContainer.visible = true;
            }, this, 2000);
        }
    }

    private closeThisBar(): void {
        if( this.parent ) this.parent.removeChild( this );
    }
}