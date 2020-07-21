package paytable {
	
	public class Paytable{
		
		public var name: String;
		
		public var checkGate: String;
		
		public var checkGates: Array;
		
		public var ui: PaytableUI;
		
		public function Paytable(){
		}
		
		public function check( testString: String ): PaytableCheckResult{
			var result: PaytableCheckResult = new PaytableCheckResult;
			if( checkGate ){
				result.getCheckResult( testCheckString( testString, checkGate ) );
			}
			else if( checkGates ){
				for( var i:int = 0; i< checkGates.length; i++ ){
					result.getCheckResult( testCheckString( testString, checkGates[i] ) );
				}
			}
			else throw Error( "ff" );
			if( ui )ui.showResult( result );
			return result;
		}
		
		private function testCheckString(testString:String, checkGate:String): Number{
			if( testString.length != checkGate.length )return NaN;
			var differentIndex: int = -1;
			for( var i:int = 0; i<testString.length; i++ ){
				var char: String = checkGate.charAt(i);
				if( char == "0" )continue;
				if( testString.charAt(i) != checkGate.charAt(i) ){
					if( differentIndex >= 0 )return NaN;
					else differentIndex = i;
				}
			}
			return differentIndex;
		}
	}
}