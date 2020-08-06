class DropCoins extends particle.GravityParticleSystem{
	public constructor() {
		super(RES.getRes("getCoinsParticle_png"), RES.getRes("getCoinsParticle_json"));
		this.start( 1000 );

		TweenerTool.tweenTo( this, { rotation: 0 }, 500, 1500, MDS.removeSelf.bind( this, this ) );
	}
}