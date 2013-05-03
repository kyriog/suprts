var Client = IgeClass.extend(
{
	classId: 'Client',
	init: function () {
		// Remember to delete this when going to production mode, it's a debug thing!
		ige.showStats(1);
		ige.globalSmoothing(true);

		var self = this;
		this.obj = [];
		
		self.gameTexture = {};
		self.gameTexture.dirtSheet = new IgeCellSheet('./assets/textures/tiles/dirtSheet.png', 4, 1);
		self.gameTexture.grassSheet = new IgeCellSheet('./assets/textures/tiles/grassSheet.png', 4, 1);
		self.gameTexture.arrosoir = new IgeTexture('./assets/arrosoir.png');

		// Enable networking
		ige.addComponent(IgeNetIoComponent);
		
		// Implement our game methods
		this.implement(ClientNetworkEvents);
		
		ige.on('texturesLoaded', function () 
		{
			// Create the HTML canvas
			ige.createFrontBuffer(true);

			// Start the engine
			ige.start(function (success) 
			{
				// Check if the engine started successfully
				if (success) 
				{
					ige.network.start('http://localhost:2000', function () 
					{
						self.playerId = 0;
						self.counter = 0;
						self.chunksCache = new Object();
						
						// Setup the network command listeners
						ige.network.define('playerRegisterError', self._onPlayerRegisterError);
						ige.network.define('playerLogin', self._onPlayerLogin);
						ige.network.define('playerLoginError', self._onPlayerLoginError);
						ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js
						ige.network.define('characterMove', self._onCharacterMove);
						ige.network.define('mapSection', self._onMapSection);
						
						ige.network.define('playerNeuterConquest', self._onPlayerNeuterConquest);
						
						ige.network.define('adminlink', self._onAdminLink);
						
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent).stream.renderLatency(80).stream.on('entityCreated', function (entity) {} );
						
						// Create the scene
						self.mainScene = new IgeScene2d();
						self.mainScene.id('mainScene');
						self.mainScene.drawBounds(false);
						self.mainScene.drawBoundsData(false);

						self.objectScene = new IgeScene2d();
						self.objectScene.id('objectScene');
						self.objectScene.depth(0);
						self.objectScene.drawBounds(false);
						self.objectScene.drawBoundsData(false);
						self.objectScene.mount(self.mainScene);

						// Create the main viewport
						self.vp1 = new IgeViewport();
						self.vp1.id('vp1');
						self.vp1.autoSize(true);
						self.vp1.scene(self.mainScene);
						self.vp1.drawMouse(false);
						self.vp1.drawBounds(false);
						self.vp1.drawBoundsData(false);
						self.vp1.mount(ige);

						// Contient les entités and co mais ne s'occupe pas du rendu des tuiles
						self.TitleMap = new IgeTileMap2d();
						self.TitleMap.id('TitleMap');
						self.TitleMap.addComponent(ClickComponent);
						self.TitleMap.isometricMounts(true);
						self.TitleMap.tileWidth(40);
						self.TitleMap.tileHeight(40);
						//self.TitleMap.drawGrid(25);	 // Pour le debug only	
						self.TitleMap.drawMouse(true);
						self.TitleMap.drawBounds(true);
						self.TitleMap.drawBoundsData(true);
						self.TitleMap.mount(self.objectScene);

						self.uiScene = new IgeScene2d().id('uiScene').depth(1).ignoreCamera(true).mount(self.mainScene);

						// Dessine les tuiles a l écran
						self.TextureMap = new IgeTextureMap();
						self.TextureMap.depth(0);
						self.TextureMap.tileWidth(40);
						self.TextureMap.tileHeight(40);
						self.TextureMap.translateTo(0, 0, 0);
						self.TextureMap.autoSection(10);
						
						//self.TitleMap.drawGrid(25);
						self.TextureMap.drawBounds(false);
						self.TextureMap.drawSectionBounds(false);
						self.TextureMap.isometricMounts(true);
						self.TextureMap.mount(self.mainScene);
						
						
						var DirtTexIndex = self.TextureMap.addTexture(self.gameTexture.dirtSheet);
						var GrassTexIndex = self.TextureMap.addTexture(self.gameTexture.grassSheet);

						self.setupGui();
						ige.network.send('mapSection');
					});
				}
			});
		});
	},
	
	setupGui: function()
	{
		
		
		ige.client.obj[1] = new IgeUiEntity()
						.id('topBar')
						.depth(10)
						.backgroundColor('#474747')
						.left(0)
						.bottom(22) // IN DEBUG, SET TO 0 at RELEASE
						.width('100%')
						.height(60)
						.borderBottomColor('#666666')
						.borderBottomWidth(1)
						.backgroundPosition(0, 0)
						.mount(ige.client.uiScene);
						
						ige.client.obj[2] = new IgeUiEntity()
						.id('entityButton')
						.depth(10)
						.top(6)
						.left(15)
						.width(40)
						.height(40)
						.cell(1)
						.backgroundImage(ige.client.gameTexture.arrosoir, 'no-repeat')
						.mouseOver(function () {this.backgroundColor('#49ceff'); ige.input.stopPropagation(); })
						.mouseOut(function () {this.backgroundColor('#474747'); ige.input.stopPropagation(); })
						.mouseUp(function () { console.log('Clicked ' + this.id()); ige.input.stopPropagation(); })
						.mount(ige.client.obj[1]);
						
		
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
