package paytable.paytableConfigEditors.paytableFitEffect{
	import flash.events.MouseEvent;
	
	import paytable.paytableConfigEditors.PaytableConfigEditor;
	
	import settings.GameConfigObject;
	
	public class PaytableFitEffectEditor extends PaytableConfigEditor{
		
		private var paytablesFitEffects: Vector.<PaytableFitEffectItem>
		
		public function PaytableFitEffectEditor(){
		}
		
		protected override function getPaytables():void{
			var paytableData: Object = GameConfigObject.payTables;
			var i: int = 0;
			paytables = new Vector.<String>;
			paytablesFitEffects = new Vector.<PaytableFitEffectItem>;
			for( var ob: String in paytableData ){
				paytablesFitEffects[i] = new PaytableFitEffectItem( ob );
				paytablesFitEffects[i].y = 20 + 40 * i;
				this.addChild( paytablesFitEffects[i] );
				paytables[i] = ob;
				i++;
			}
		}
		
		protected override function onSave( event: MouseEvent ): void{
			var fitEffectObject: Object = {};
			for( var i: int = 0; i < paytables.length; i++ ){
				fitEffectObject[paytables[i]] = paytablesFitEffects[i].getFitEffects();
			}
			GameConfigObject.payTablesFitEffect = fitEffectObject;
		}
		
		protected override function onLoad( event: MouseEvent ): void{
			if( GameConfigObject.payTablesFitEffect ){
				var fitEffectObject: Object = GameConfigObject.payTablesFitEffect;
				for( var ob: String in fitEffectObject ){
					var index: int = paytables.indexOf( ob );
					paytablesFitEffects[index].setFitEffect( fitEffectObject[ob] );
				}
			}
		}
		
		protected override function onDeleteFilter( event: MouseEvent ): void{
			GameConfigObject.payTablesFitEffect = null;
		}
	}
}