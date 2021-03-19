class LanguageBar extends egret.Sprite{

	private rects: Array<egret.Rectangle>;
	private languageArr: Array<string>;

	private static changeIndex: number;

	public static instance: LanguageBar;

	public constructor() {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, 308, 268 ), 0x968503, false, 1, 50, 2, 0xfffd75 );
		this.touchEnabled = true;
		this.touchChildren = false;

		this.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this );
		this.addEventListener( egret.TouchEvent.TOUCH_CANCEL, this.onTouch, this );
		this.addEventListener( egret.TouchEvent.TOUCH_END, this.onTouch, this );
		this.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onTouch, this );
		this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );

		this.rects = [];
		this.languageArr = ["pt","en","es"];
		for( let i: number = 0; i < 3; i++ ){
			this.rects[i] = new egret.Rectangle( 10, 8 + i * 90, 285, 70 );
			GraphicTool.drawRect( this, this.rects[i], 0x968503, false, 1, 20, 2, 0xfffd75 );
			Com.addBitmapAtMiddle( this, "gameSettings_json.flag_" + this.languageArr[i], this.rects[i].width * 0.5 + this.rects[i].x, this.rects[i].height * 0.5 + this.rects[i].y );
		}

		LanguageBar.instance = this;
	}

	private onTouch( event: egret.TouchEvent ){
		event.stopImmediatePropagation();
	}

	private onTap( event: egret.TouchEvent ){
		let testPt: egret.Point = new egret.Point( event.localX, event.localY );
		for( let i: number = 0; i < 3; i++ ){
			if( this.rects[i].containsPoint( testPt ) ){
				this.visible = false;
				if( MuLang.language != this.languageArr[i] ){
					LanguageBar.changeIndex = i;
					this.showConfirm();
				}
				break;
			}
		}
	}

	private showConfirm(){
		this.dispatchEvent( new egret.Event( "showConfirm" ) );
	}

	public static confirmChange(){
		MuLang.language = this.instance.languageArr[this.changeIndex];
		window.location.reload();
	}
}