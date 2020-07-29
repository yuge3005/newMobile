class TextLabel extends egret.TextField{

	public maxSize: number;
	public maxWidth: number;

	public constructor() {
		super();
		this.verticalAlign = "middle";
	}

	public setText( str: string ): void{
		this.text = str;
		this.width = this.maxWidth * 5;
		if( this.size <= this.height - 2 ) this.size = this.height;
		while( this.textWidth > this.maxWidth ){
			this.size -= 2;
		}
		this.width = this.maxWidth;
	}
}