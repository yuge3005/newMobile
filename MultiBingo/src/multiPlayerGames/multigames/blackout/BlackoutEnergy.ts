class BlackoutEnergy extends egret.DisplayObjectContainer{

	private powerUpBtn: TouchDownButton;
	private powerProcess: egret.Bitmap;
	private markUI: egret.DisplayObjectContainer;

	public static skillNameObj: Object = { freezeTime: "freeze", doublePoints: "double", extendTime: "time", manualMark: "mark", chooseOneFromMulti: "glod_ball" };

	private skillLayer: egret.DisplayObjectContainer;
	private currentSkills: Array<Object>;

	public static FREEZE_TIME: string = "freezeTime";
	public static DOUBLE_POINTS: string = "doublePoints";
	public static EXTEND_TIME: string = "extendTime";
	public static MANUAL_MARK: string = "manualMark";
	public static CHOOSE_ONE_FROM_MULTI: string = "chooseOneFromMulti";

	private set process( value: number ){
		egret.Tween.removeTweens( this.powerProcess );
		if( value ) TweenerTool.tweenTo( this.powerProcess, { width: 38 + 90 * value }, 300, 0 );
		else this.powerProcess.width = 38;
	}

	public constructor() {
		super();

		this.powerUpBtn = Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "skill_mask" ), MultiPlayerMachine.getAssetStr( "skill_mask" ), 3, 1, this.onPowerBtnClick.bind(this), true );
		this.powerUpBtn.visible = false;

		this.powerProcess = Com.addBitmapAt( this, "Progress_in_png", 4, 150 );
		this.skillLayer = new egret.DisplayObjectContainer;
		this.addChild( this.skillLayer );

		this.currentSkills = [];
	}

	public showEnergy( data: Object ){
		if( data && !isNaN(data["energy"]) ){
			this.process = data["energy"];
		}
		if( !data["powerupId"] ) return;
		let skillArr: Array<Object> = data["luckFeatures"];
		if( !skillArr ) skillArr = [];

		if( !this.skillEqual( skillArr, this.currentSkills ) ){
			this.currentSkills = skillArr;
			this.buildNewListBySkillArray(skillArr);
		}
	}

	private buildNewListBySkillArray(skillArr: Array<Object>) {
		this.skillLayer.removeChildren();
		let count: number = 0;
		for( let i: number = skillArr.length - 1; i >= 0; i-- ){
			let bit: egret.Bitmap = Com.addBitmapAtMiddle( this.skillLayer, MultiPlayerMachine.getAssetStr( "skill-" + BlackoutEnergy.skillNameObj[skillArr[i]["name"]] ), count % 2 * 67 + 35, Math.floor( count / 2 ) * 67 + 35 );
			if( count ) bit.filters = [ MatrixTool.colorMatrix( 0.5, 0.1, 1 ) ];
			count++;
		}
		this.powerUpBtn.visible = count > 0;
		if( skillArr.length == 4 ){
			this.process = 0;
			this.powerProcess.filters = [MatrixTool.colorMatrix(0.33, 0.33, 1)];
		}
		else this.powerProcess.filters = [];
	}

	private skillEqual( ar1: Array<Object>, ar2: Array<Object> ): boolean{
		if( ar2.length != ar1.length )return false;
		for( let i: number = 0; i < ar1.length; i++ ){
			if( ar1[i]["name"] == ar2[i]["name"] && ar1[i]["id"] == ar2[i]["id"] ) continue;
			else return false;
		}
		return true;
	}

	public onPowerBtnClick( event: egret.TouchEvent ){
		let ev: egret.Event = new egret.Event( "useEnergy" );
		ev.data = this.currentSkills[this.currentSkills.length-1];
		this.dispatchEvent( ev );

		this.powerUpBtn.visible = false;

		let currentIcon: egret.Bitmap = this.skillLayer.getChildAt( 0 ) as egret.Bitmap;
		currentIcon.filters = [ MatrixTool.colorMatrixLighter( 0.3 ) ];

		let lightMc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "blackoutAnimation", -15, -13 );
		lightMc.scaleX = lightMc.scaleY = 2;
		lightMc.gotoAndPlay( 1, 1 );
		TweenerTool.tweenTo(lightMc, { alpha: 0 }, 100, 900, MDS.removeSelf.bind(this, lightMc));
		
		this.addChild(currentIcon);
		TweenerTool.tweenTo(currentIcon, { scaleX: 1.4, scaleY: 1.4 }, 300, 0, this.removeIcon.bind(this, currentIcon));

		this.currentSkills.pop();
		this.buildNewListBySkillArray( this.currentSkills );
	}

	private removeIcon( currentIcon: egret.Bitmap ){
		TweenerTool.tweenTo(currentIcon, { scaleX: 0.3, scaleY: 0.3, alpha: 0 }, 400, 0, MDS.removeSelf.bind(this, currentIcon));
	}

	public clearSkills(){
		this.process = 0;
		this.currentSkills = [];
		this.skillLayer.removeChildren();
		this.powerUpBtn.visible = false;
		this.powerProcess.filters = [];
	}

	public showMark( isShow: boolean ){
		if( !this.markUI && isShow ){
			this.markUI = new egret.DisplayObjectContainer;
			this.markUI.touchEnabled = true;
			this.markUI.touchChildren = false;
			Com.addBitmapAt( this.markUI, MultiPlayerMachine.getAssetStr( "bg_mark" ), 0, 0 );
			Com.addBitmapAt( this.markUI, MultiPlayerMachine.getAssetStr( "skill-mark" ), 33, 33 );
		}

		if( isShow ) this.addChild( this.markUI );
		else{
			if( this.contains( this.markUI ) ) this.removeChild( this.markUI );
		}
	}
}