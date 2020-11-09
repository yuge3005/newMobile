class TweenerTool {
	public constructor() {
	}

	public static tweenTo( target: egret.DisplayObject, toObject: Object, duration: number, delay: number = 0, callback: Function = null, fromObject: Object = null, ease: Function = null ){
		let tw: egret.Tween = egret.Tween.get( target );
		if( delay > 0 )tw.wait( delay );
		for( let ob in fromObject ) target[ob] = fromObject[ob];
		tw.to( toObject, duration, ease );
		if( callback )tw.call( callback );
	}
}