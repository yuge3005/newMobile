class GenericPo extends GenericModal{

	protected bgAssetName: string;
	protected bg: egret.Bitmap;
	protected closeButtonAssetName: string;
	protected closeButton: TouchDownButton;
	protected closeButtonOffset: egret.Point;

	public constructor(configUrl: string = null ) {
		super( configUrl );
	}

	protected init(){
		if (this.bgAssetName!=="") {
			this.bg = Com.addBitmapAt(this, this.bgAssetName, 0, 0);
			this.anchorOffsetX = this.bg.width >> 1;
			this.anchorOffsetY = this.bg.height >> 1;
		} else {
			this.width = document.documentElement.clientWidth;
			this.height = document.documentElement.clientHeight;
			this.anchorOffsetX = this.width >> 1;
			this.anchorOffsetY = this.height >> 1;
		}
		if( !this.closeButtonOffset ) this.closeButtonOffset = new egret.Point( 0, 0 );

		if (this.closeButtonAssetName) this.closeButton = Com.addDownButtonAt( this, this.closeButtonAssetName, this.closeButtonAssetName, this.bg.width + this.closeButtonOffset.x, this.closeButtonOffset.y, this.onClose, true );

		super.init();
	}

	protected onClose( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( GenericModal.CLOSE_MODAL ) );
	}
	
	/**
	 * update deal overplus text
	 */
	protected updateDealOverplusText(time: number): void { }
	
	/**
	 * po overplus over
	 */
	protected poOverplusOver(): void { }

	/**
	 * on key up
	 */
	protected onKeyUp(keyCode: number): void { }
	
	/**
	 * on mouse wheel
	 */
	protected onMouseWheel(dir: number): void { }
}