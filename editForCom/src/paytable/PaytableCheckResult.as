package paytable {
	
	public class PaytableCheckResult{
		
		public var fit: Boolean;
		
		public var unfitIndexs: Array; 
		
		public function PaytableCheckResult(){
			fit = false;
			unfitIndexs = [];
		}
		
		public function getCheckResult( num : Number ):void{
			if( num == -1 ){
				fit = true;
			}
			if( num >= 0 )unfitIndexs.push( num );
		}
		
		public function toString():String{
			return fit ? "" + fit : ( unfitIndexs.length ? unfitIndexs.toString() : "" + false );
		}
	}
}