class CopaGanhoCounter extends GanhoCounter{
    private ganhoObjects: Array<Object>;

	public constructor( winCallback: Function = null ) {
		super( winCallback );
	}

    public clearGanhoData(){
		this.ganhoObjects = [];
	}

    protected countGanho( ganhoArray: Array<number>, i: number, ob: string, result: PaytableCheckResult ): void{
		if( this.ganhoObjects[i] == null )this.ganhoObjects[i] = {};
        if( this.ganhoObjects[i][ob] ) return;
        else{
            this.ganhoObjects[i][ob] = true;
            if( this.winCallback )this.winCallback( i, ob );
        }
	}
}