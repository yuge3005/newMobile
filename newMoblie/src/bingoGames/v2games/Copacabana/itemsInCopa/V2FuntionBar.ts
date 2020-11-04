class V2FuntionBar extends egret.DisplayObjectContainer{

	protected getIndexOnCard: Function;
	protected setTargetToPositionOnCard: Function;
	
	public constructor( getIndexOnCard: Function, setTargetToPositionOnCard: Function ) {
		super();

		this.getIndexOnCard = getIndexOnCard;
        this.setTargetToPositionOnCard = setTargetToPositionOnCard;
	}
}