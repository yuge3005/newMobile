package
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import controler.BakgroundEditorControl;
	import controler.BallEditorControl;
	import controler.CardEditor;
	import controler.PaytableEditorControl;
	
	import gameUI.BackgroundLayer;
	import gameUI.BallLayer;
	import gameUI.CardLayer;
	import gameUI.PaytableUILayer;
	
	import paytable.paytableConfigEditors.paytableFitEffect.PaytableFitEffectEditor;
	import paytable.paytableConfigEditors.paytableFilter.PaytableFilterEditor;
	import paytable.paytableConfigEditors.paytableSound.PaytableSoundEditor;
	
	import settings.EditorEvent;
	import settings.EditorItem;
	import settings.GameConfigObject;
	import settings.GameRes;
	
	[SWF(frameRate=30,width=1760,height=880)]
	public class editForCom extends EditorItem
	{
		public static const editorWidth: int = 1760;
		public static const editorHeight: int = 880;
		
		/**背景区域*/
		private var backgroundArea: BackgroundLayer;
		/**球区域*/
		private var ballArea: BallLayer;
		/**paytable区域*/
		private var paytableArea: PaytableUILayer;
		/**卡片区域*/
		private var cardArea: CardLayer;
		
		/**背景编辑控制区*/
		private var backgroundControl: BakgroundEditorControl;
		/**球编辑控制区*/
		private var ballControl: BallEditorControl;
		/**中奖卡编辑控制区*/
		private var paytableControl: PaytableEditorControl;
		/**数字卡编辑控制区*/	
		private var cardEditor: CardEditor;
		
		public function editForCom(){
			initBackgroundEditor();
			initBallEditor();
			initPaytableEditor();
			initCardEditor();
		}
		
		private function initBackgroundEditor():void{
			
			backgroundArea = addItemAt( new BackgroundLayer, 0, 0 ) as BackgroundLayer;
			backgroundArea.addEventListener( EditorEvent.ITEM_MOVE, onItemMove );
			backgroundArea.addEventListener( EditorEvent.ITEM_CHANGE, onItemChange );
			
			backgroundControl = addItemAt( new BakgroundEditorControl, 980, 0 ) as BakgroundEditorControl;
			backgroundControl.addEventListener( EditorEvent.COLOR_CHANGE, onColorChange );
			backgroundControl.addEventListener( EditorEvent.TEXTURE_FILE_LOADED, onTextrueFileLoad );
			backgroundControl.addEventListener( EditorEvent.TEXTURE_PICTURE_LOADED, onTexturePngLoaded );
			backgroundControl.addEventListener( EditorEvent.ANIMATION_FILE_LOADED, onAnimationFileLoaded );
			backgroundControl.addEventListener( EditorEvent.ANIMATION_PICTURE_LOADED, onAnimationPictureLoaded );
			backgroundControl.addEventListener( EditorEvent.ADD_ITEM, onAddItem );
			backgroundControl.addEventListener( EditorEvent.MOVE_ITEM, onMoveItem );
			backgroundControl.addEventListener( EditorEvent.REMOVE_ITEM, onRemoveItem );
			backgroundControl.addEventListener( EditorEvent.ADD_ANIMATION, onAddAnimation );
			backgroundControl.addEventListener( EditorEvent.ITEM_LAYER_UP, onItemLayerUp );
			backgroundControl.addEventListener( EditorEvent.CONFIG_LOADED, onLoadSuccess );
			backgroundControl.addEventListener( EditorEvent.LOCK_BACKROUND, onLockBackground );
		}
		
		private function initBallEditor():void{
			ballArea = addItemAt( new BallLayer, 0, 0 ) as BallLayer;
			ballArea.addEventListener( EditorEvent.PATH_CHANGE, onPathChange );
			
			ballControl = addItemAt( new BallEditorControl, 980, 270 ) as BallEditorControl;
			ballControl.addEventListener( EditorEvent.ADD_PATH_POINT, onAddPath );
			ballControl.addEventListener( EditorEvent.CLEAR_PATH, onClearPath );
			ballControl.addEventListener( EditorEvent.TEST_BALL_PATH, onTestBallPath );
		}
		
		private function initPaytableEditor():void{
			paytableArea = addItemAt( new PaytableUILayer, 0, 0 ) as PaytableUILayer;
			
			paytableControl = addItemAt( new PaytableEditorControl, 20, 540 ) as PaytableEditorControl;
			paytableControl.addEventListener( EditorEvent.ADD_PAYTABLE_UI, onAddPaytableUI );
			paytableControl.addEventListener( EditorEvent.OPEN_PAYTABLE_FILTER_EDITOR, onOpenPaytableFilterEditor );
			paytableControl.addEventListener( EditorEvent.OPEN_PAYTABLE_SOUND_EDITOR, onOpenPaytableSoundEditor );
			paytableControl.addEventListener( EditorEvent.OPEN_PAYTABLE_FIT_EFFECT_EDITOR, onOpenPaytableFitEffectEditor );
		}
		
		private function initCardEditor():void{
			cardArea = addItemAt( new CardLayer, 0, 0 ) as CardLayer;
			cardArea.addEventListener( EditorEvent.CARD_POSITION_CHANGE, onCardPositionChange );
			
			cardEditor = addItemAt( new CardEditor, 800, 660 ) as CardEditor;
			cardEditor.addEventListener( EditorEvent.ADD_CARD_POSITION, onAddCard );
			cardEditor.addEventListener( EditorEvent.CLEAR_CARD_POSITIONS, onCardPositionClear );
		}
		
		protected function onCardPositionClear(event:Event):void{
			cardArea.clearPostion();
		}
		
		protected function onCardPositionChange(event:Event):void{
			cardEditor.refreshCardPositionList( cardArea.getItemList() );
		}
		
		protected function onItemMove(event:EditorEvent):void{
			refreshItemList();
		}
		
		protected function onItemChange(event:EditorEvent):void{
			refreshItemList();
		}
		
		protected function onColorChange(event:EditorEvent):void{
			backgroundArea.changeColorTo( GameConfigObject.backgroundColor = event.data );
		}
		
		protected function onTextrueFileLoad(event:EditorEvent):void{
			backgroundArea.clearBackground();
			backgroundControl.onTextureLoaded();
			ballControl.onTextureLoaded();
			paytableControl.onTextureLoaded();
			cardEditor.onTextureLoaded();
		}
		
		protected function onTexturePngLoaded(event:EditorEvent):void{
			if( GameConfigObject.tempBackgroundItems ){//是load配置文件后的加载过程
				if( GameConfigObject.animationPicturePath && GameConfigObject.animationRelativePath ){//而且有动画资源
					backgroundControl.loadAnimationFile();
					backgroundControl.loadAnimationPicture();
				}
				else buildTempItems();
			}
			if( GameConfigObject.payTables )paytableControl.showPaytableInfo();
			if( GameConfigObject.card )cardEditor.showCardInfo();
		}
		
		private function buildTempItems():void{
			backgroundControl.adTempItems();
			backgroundArea.repositeTempItems();
			GameConfigObject.tempBackgroundItems = null;
		}
		
		protected function onAddItem(event:EditorEvent):void{
			backgroundArea.addBackgroundItem( event.data );
		}
		
		protected function onAddCard(event:EditorEvent):void{
			cardArea.addCardPosition( event.data );
		}
		
		protected function onMoveItem(event: EditorEvent):void{
			backgroundArea.moveItem( event.data.i, event.data.pt );
		}
		
		protected function onRemoveItem(event:EditorEvent):void{
			backgroundArea.removeItem( event.data );
		}
		
		protected function onAddAnimation(event:EditorEvent):void{
			backgroundArea.addMovieClip( event.data, GameRes.movieClipFrameRes, GameRes.movieClipPic )
		}
		
		protected function onItemLayerUp(event:EditorEvent):void{
			backgroundArea.itemLayerUp( event.data );
		}
		
		protected function onAnimationFileLoaded(event:EditorEvent):void{
			backgroundControl.onAnimationFileLoaded();
			cardEditor.onAnimationFileLoaded();
			if( GameRes.movieClipPic ) enableAnimationList();
		}
		
		protected function onAnimationPictureLoaded(event:EditorEvent):void{
			if( GameRes.movieClipFrameRes ) enableAnimationList();
		}
		
		private function enableAnimationList():void{
			backgroundControl.enableAnimationList();
			cardEditor.enableAnimationList();
			if( GameConfigObject.tempBackgroundItems ) buildTempItems();
		}
		
		private function refreshItemList():void{
			backgroundControl.refreshItemList( backgroundArea.getItemList() );
		}
		
		protected function onLockBackground(event:EditorEvent):void{
			backgroundArea.mouseChildren = !event.data;
		}
		
		private function onClearButtonClick(event:MouseEvent):void{
			backgroundArea.clearBackground();
		}
		
		private function onLoadSuccess( event: EditorEvent ):void{
			backgroundArea.changeColorTo( GameConfigObject.backgroundColor );
			backgroundControl.loadTextureFile();
			if( GameConfigObject.balls )ballControl.showBallsInfo();
		}
		
		protected function onAddPath(event:EditorEvent):void{
			ballArea.addBall( event.data.index, event.data.point );
		}
		
		protected function onPathChange(event:EditorEvent):void{
			ballControl.refreshBallPathList( ballArea.getItemList() );
		}
		
		protected function onClearPath(event:EditorEvent):void{
			ballArea.clearBalls();
		}
		
		protected function onTestBallPath(event:EditorEvent):void{
			ballArea.runBalls();
		}
		
		protected function onAddPaytableUI(event:EditorEvent):void{
			paytableArea.addPaytable( event.data.paytableName, event.data.point, event.data.paytableObject );
		}
		
		protected function onOpenPaytableFilterEditor(event:Event):void{
			this.addChild( new PaytableFilterEditor );
		}
		
		protected function onOpenPaytableSoundEditor(event:Event):void{
			this.addChild( new PaytableSoundEditor );
		}
		
		protected function onOpenPaytableFitEffectEditor(event:Event):void{
			this.addChild( new PaytableFitEffectEditor );
		}
	}
}