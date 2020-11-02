class DropCoins extends particle.GravityParticleSystem{
	public constructor( coinsLevel: number ) {
		super(RES.getRes("getCoinsParticle_png"), RES.getRes("getCoinsParticle_json"));
		this.start( (coinsLevel + 1) * 400 );

		TweenerTool.tweenTo( this, { rotation: 0 }, 500, 1500, MDS.removeSelf.bind( this, this ) );
	}
}