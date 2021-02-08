class TouchDownButton extends egret.DisplayObjectContainer {

	private upState: egret.Bitmap;

	private downState: egret.Bitmap;

	public disabledFilter: egret.ColorMatrixFilter;

    public static get isRightClick(): boolean{
        return document["isRightClick"];
    }

	public get enabled(){
		return this.touchEnabled;
	}
	public set enabled( value : boolean ){
		this.touchEnabled = value;
		if( value ){
			this.filters = [];
		}
		else{
			if( this.contains( this.downState ) )this.removeChild(this.downState);
			this.addChildAt( this.upState, 0 );
			this.filters = this.disabledFilter ? [this.disabledFilter] : [ MatrixTool.colorMatrix( 0.5, 0.1, 1 ) ];
		}
	}

	public constructor( upState: string, downState: string ) {
		super();

		this.upState = Com.createBitmapByName( upState );
		this.downState = Com.createBitmapByName( downState );

		this.addChildAt( this.upState, 0 );

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	protected onTouchBegin(event:egret.TouchEvent){
		if( this.contains( this.upState ) )this.removeChild(this.upState);
		this.addChildAt( this.downState, 0 );
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
	}

	private onTouchEnd(event:egret.TouchEvent){
		if( this.contains( this.downState ) )this.removeChild(this.downState);
		this.addChildAt( this.upState, 0 );
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
	}

	protected onTouchTap(event:egret.TouchEvent){
		if( TouchDownButton.isRightClick ){
			event.stopImmediatePropagation();
			return;
		}
		SoundManager.play( "open_list_mp3" );
	}

	public setButtonText( txt: egret.TextField ){
		txt.width = this.upState.width;
		txt.height = this.upState.height;
		txt.textAlign = "center";
		txt.verticalAlign = "middle";
		this.addChild( txt );
	}
}