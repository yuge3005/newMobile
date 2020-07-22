
class PachinkoCard extends GameCard {
    constructor(i: number) {
        super(i);
    }

    public set bet( value: number ){
		if (!this.betText) return;
		this.betText.text = Utils.formatCoinsNumber( value );
    }
    
    protected onAdd(event: egret.Event) {
        super.onAdd(event);

        if (this.cardText) this.cardText.text = GameUIItem.languageText["bet"][GlobelSettings.language];
        if (this.betText) this.betText.textColor = 0xFFFF00;
    }
}