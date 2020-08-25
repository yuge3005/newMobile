class Showball3 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball3";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball3.conf", assetsPath, 20 );
        this.megaName = "showball3_mega";
    }
}