class Showball1 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball1";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball1.conf", assetsPath, 22 );
        this.megaName = "showball1_mega";
    }
}