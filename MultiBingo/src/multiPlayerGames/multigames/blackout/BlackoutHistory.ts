class BlackoutHistory extends egret.DisplayObjectContainer{

	private scrollArea: egret.ScrollView;
	private scrollBar: egret.DisplayObjectContainer;

	private slider: BlackoutHistorySlider;
	private sliderDraging: boolean;

	public constructor() {
		super();

		this.scrollArea = new egret.ScrollView;
		this.scrollArea.width = 242;
		this.scrollArea.height = 400;
		this.addChild( this.scrollArea );
		this.scrollBar = new egret.DisplayObjectContainer;
		this.scrollArea.setContent( this.scrollBar );

		this.scrollArea.horizontalScrollPolicy = "off";

		this.slider = new BlackoutHistorySlider;
		Com.addObjectAt( this, this.slider, 243, 7 );
		this.slider.addEventListener( "startDrag", this.startDrag, this );
		this.slider.addEventListener( "stopDrag", this.stopDrag, this );
		this.slider.addEventListener( "sliderPosition", this.sliderScroll, this );
	}

	private startDrag( event: Event ){
		this.sliderDraging = true;
	}

	private stopDrag( event: Event ){
		this.sliderDraging = false;
	}

	private sliderScroll( event: Event ){
		if( this.scrollBar.height > this.scrollArea.height ){
			this.scrollArea.scrollTop = ( this.scrollBar.height - this.scrollArea.height ) * this.slider.sliderPosition;
		}
	}

	private resetScroll(){
		if( this.sliderDraging ) return;
		this.slider.setScrollSlider( this.scrollBar.height, this.scrollArea.height, this.scrollArea.scrollTop );
	}

	private get scrollHeight(): number{
		return this.scrollBar.height;
	}

	public showUserHistory( roomData: Object ){
		let userInfo: egret.DisplayObjectContainer = new BlackoutHistoryItem( roomData["award"], roomData["coinsType"], roomData["collected"], roomData["id"], roomData["createAt"] );
		Com.addObjectAt( this.scrollBar, userInfo, 0, this.scrollHeight );
		this.resetScroll();
	}

	public addLastRecord(){
		let roomData: Object = Blackout.joinedRoomData;
		if( roomData ){
			let userInfo: egret.DisplayObjectContainer = new BlackoutHistoryItem( roomData["award"], roomData["coinsType"], roomData["collected"], roomData["id"], roomData["createAt"] );
			for( let i: number = 0; i < this.scrollBar.numChildren; i++ ){
				this.scrollBar.getChildAt( i ).y += userInfo.height;
			}
			this.scrollBar.addChildAt( userInfo, 0 );
			this.resetScroll();
		}
		Blackout.joinedRoomData = null;
	}
}