package paytable.paytableConfigEditors.paytableFitEffect
{
	import paytable.paytableConfigEditors.paytableFilter.PaytableFilterUI;
	
	import settings.GameConfigObject;

	public class PaytableFitEffectItem extends PaytableFilterUI
	{
		private var rules: Vector.<RuleItem>;
		
		public function PaytableFitEffectItem( ptName: String ){
			super( ptName );
			
			this.x = 20;
			
			this.buildRuleButons( Vector.<String>(GameConfigObject.payTables[ptName]["rule"]) );
			this.mouseChildren = true;
		}
		
		private function buildRuleButons( rule: Vector.<String> ):void{
			if( !rule ) return;
			rules = new Vector.<RuleItem>;
			for( var i: int = 0; i < rule.length; i++ ){
				rules[i] = new RuleItem( rule[i] );
				rules[i].x = 260 * i + 120;
				this.addChild( rules[i] );
			}
		}
		
		public function getFitEffects(): Array{
			var fitEffect: Array = [];
			for( var i: int = 0; i < rules.length; i++ ){
				fitEffect[i] = rules[i].fitEffect;
			}
			return fitEffect;
		}
		
		public function setFitEffect( value: Array ):void{
			for( var i: int = 0; i < rules.length; i++ ){
				rules[i].fitEffect = value[i];
			}
		}
	}
}