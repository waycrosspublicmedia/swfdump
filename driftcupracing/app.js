var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (typeof _showBar === "undefined") { _showBar = true; }
            this.oAssetData = {
            };
            this.assetsLoaded = 0;
            this.textData = {
            };
            this.spinnerRot = 0;
            this.totalAssets = _aFileData.length;
            this.showBar = _showBar;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
            if(_showBar) {
                this.oLoaderImgData = preAssetLib.getData("loader");
            }
        }
        AssetLoader.prototype.render = function () {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var tempScale = Math.min(Math.min(canvas.width / 900, 1), canvas.height / 800);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.preloaderLogo].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.preloaderLogo].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.preloaderLogo].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.preloaderLogo].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 - 70 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.underBar].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, Math.max((bWidth / this.totalAssets) * this.assetsLoaded, 1), bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 + 110 - (bHeight / 2) * tempScale, Math.max((bWidth / this.totalAssets) * this.assetsLoaded, 1) * tempScale, bHeight * tempScale);
            var bX = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].x;
            var bY = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].y;
            var bWidth = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].width;
            var bHeight = this.oLoaderImgData.oData.oAtlasData[oImageIds.overBar].height;
            ctx.drawImage(this.oLoaderImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height / 2 + 110 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
        };
        AssetLoader.prototype.displayNumbers = function () {
            ctx.textAlign = "left";
            ctx.font = "bold 40px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.round((this.assetsLoaded / this.totalAssets) * 100) + "%", canvas.width / 2 + 0, canvas.height / 2 - 6);
        };
        AssetLoader.prototype.loadExtraAssets = function (_callback, _aFileData) {
            this.showBar = false;
            this.totalAssets = _aFileData.length;
            this.assetsLoaded = 0;
            this.loadedCallback = _callback;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
        };
        AssetLoader.prototype.loadJSON = function (_oData) {
            var _this = this;
            var xobj = new XMLHttpRequest();
            xobj.open('GET', _oData.file, true);
            xobj.onreadystatechange = function () {
                if(xobj.readyState == 4 && xobj.status == 200) {
                    _this.textData[_oData.id] = JSON.parse(xobj.responseText);
                    ++_this.assetsLoaded;
                    _this.checkLoadComplete();
                }
            };
            xobj.send(null);
        };
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {
                };
                _this.oAssetData[_oData.id].img = img;
                _this.oAssetData[_oData.id].oData = {
                };
                var aSpriteSize = _this.getSpriteSize(_oData.file);
                if(aSpriteSize[0] != 0) {
                    _this.oAssetData[_oData.id].oData.spriteWidth = aSpriteSize[0];
                    _this.oAssetData[_oData.id].oData.spriteHeight = aSpriteSize[1];
                } else {
                    _this.oAssetData[_oData.id].oData.spriteWidth = _this.oAssetData[_oData.id].img.width;
                    _this.oAssetData[_oData.id].oData.spriteHeight = _this.oAssetData[_oData.id].img.height;
                }
                if(_oData.oAnims) {
                    _this.oAssetData[_oData.id].oData.oAnims = _oData.oAnims;
                }
                if(_oData.oAtlasData) {
                    _this.oAssetData[_oData.id].oData.oAtlasData = _oData.oAtlasData;
                } else {
                    _this.oAssetData[_oData.id].oData.oAtlasData = {
                        none: {
                            x: 0,
                            y: 0,
                            width: _this.oAssetData[_oData.id].oData.spriteWidth,
                            height: _this.oAssetData[_oData.id].oData.spriteHeight
                        }
                    };
                }
                ++_this.assetsLoaded;
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.getSpriteSize = function (_file) {
            var aNew = new Array();
            var sizeY = "";
            var sizeX = "";
            var stage = 0;
            var inc = _file.lastIndexOf(".");
            var canCont = true;
            while(canCont) {
                inc--;
                if(stage == 0 && this.isNumber(_file.charAt(inc))) {
                    sizeY = _file.charAt(inc) + sizeY;
                } else if(stage == 0 && sizeY.length > 0 && _file.charAt(inc) == "x") {
                    inc--;
                    stage = 1;
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && this.isNumber(_file.charAt(inc))) {
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && sizeX.length > 0 && _file.charAt(inc) == "_") {
                    canCont = false;
                    aNew = [
                        parseInt(sizeX), 
                        parseInt(sizeY)
                    ];
                } else {
                    canCont = false;
                    aNew = [
                        0, 
                        0
                    ];
                }
            }
            return aNew;
        };
        AssetLoader.prototype.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        AssetLoader.prototype.checkLoadComplete = function () {
            if(this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    })();
    Utils.AssetLoader = AssetLoader;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
        }
        AnimSprite.prototype.updateAnimation = function (_delta) {
            this.frameInc += this.fps * _delta;
        };
        AnimSprite.prototype.changeImgData = function (_newImgData, _animId) {
            this.oImgData = _newImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
            this.resetAnim();
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (typeof _reset === "undefined") { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if(_reset) {
                this.resetAnim();
            }
            switch(_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            _ctx.globalAlpha = this.alpha;
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        AnimSprite.prototype.renderSimple = function (_ctx) {
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - (this.centreX - this.offsetX) * this.scaleX, this.y - (this.centreY - this.offsetY) * this.scaleY, this.oImgData.oData.spriteWidth * this.scaleX, this.oImgData.oData.spriteHeight * this.scaleY);
        };
        return AnimSprite;
    })();
    Utils.AnimSprite = AnimSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius, _frame) {
            if (typeof _frame === "undefined") { _frame = 0; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
            this.setFrame(_frame);
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        return BasicSprite;
    })();
    Utils.BasicSprite = BasicSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.isBugBrowser = _isBugBrowser;
            this.keyDownEvtFunc = function (e) {
                _this.keyDown(e);
            };
            this.keyUpEvtFunc = function (e) {
                _this.keyUp(e);
            };
            _canvas.addEventListener("touchstart", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchcancel", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitCancel(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            _canvas.addEventListener("mouseout", function (e) {
                _this.isDown = false;
                _this.hitUp(e, Math.abs(e.pageX), Math.abs(e.pageY), 1);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            if(!hasFocus) {
                visibleResume();
            }
            if(this.pauseIsOn) {
                return;
            }
            var curHitTime = new Date().getTime();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        this.aHitAreas[i].oData.hasLeft = false;
                        if(!this.aHitAreas[i].oData.isDown) {
                            this.aHitAreas[i].oData.isDown = true;
                            this.aHitAreas[i].oData.x = _posX;
                            this.aHitAreas[i].oData.y = _posY;
                            if((curHitTime - this.prevHitTime < 500 && (gameState != "game" || this.aHitAreas[i].id == "pause")) && isBugBrowser) {
                                return;
                            }
                            this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                        break;
                    }
                } else {
                }
            }
            this.prevHitTime = curHitTime;
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifer) {
            if(!ios9FirstTouch) {
                playSound("silence");
                ios9FirstTouch = true;
            }
            if(this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                            if(this.aHitAreas[i].oData.multiTouch) {
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                        break;
                    }
                } else {
                }
            }
        };
        UserInput.prototype.hitCancel = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].oData.isDown) {
                    this.aHitAreas[i].oData.isDown = false;
                    this.aHitAreas[i].aTouchIdentifiers = new Array();
                    if(this.aHitAreas[i].oData.multiTouch) {
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                }
            }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if(this.pauseIsOn) {
                return;
            }
            if(_isDown) {
                _posX *= canvasScale;
                _posY *= canvasScale;
                for(var i = 0; i < this.aHitAreas.length; i++) {
                    if(this.aHitAreas[i].rect) {
                        var aX = canvas.width * this.aHitAreas[i].align[0];
                        var aY = canvas.height * this.aHitAreas[i].align[1];
                        if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                            this.aHitAreas[i].oData.hasLeft = false;
                            if(this.aHitAreas[i].oData.isDraggable && !this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if(this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                if(this.aHitAreas[i]) {
                                    this.aHitAreas[i].oData.isBeingDragged = false;
                                }
                            }
                        } else if(this.aHitAreas[i].oData.isDown && !this.aHitAreas[i].oData.hasLeft) {
                            for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.hasLeft = true;
                                if(!this.aHitAreas[i].oData.isBeingDragged) {
                                    this.aHitAreas[i].oData.isDown = false;
                                }
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.checkKeyFocus = function () {
            window.focus();
            if(this.aKeys.length > 0) {
                window.removeEventListener('keydown', this.keyDownEvtFunc, false);
                window.removeEventListener('keyup', this.keyUpEvtFunc, false);
                window.addEventListener('keydown', this.keyDownEvtFunc, false);
                window.addEventListener('keyup', this.keyUpEvtFunc, false);
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({
                id: _id,
                callback: _callback,
                oData: _oCallbackData,
                keyCode: _keyCode
            });
            this.checkKeyFocus();
        };
        UserInput.prototype.removeKey = function (_id) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _type, _oAreaData, _isUnique) {
            if (typeof _isUnique === "undefined") { _isUnique = false; }
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if(_isUnique) {
                this.removeHitArea(_id);
            }
            if(!_oAreaData.scale) {
                _oAreaData.scale = 1;
            }
            if(!_oAreaData.align) {
                _oAreaData.align = [
                    0, 
                    0
                ];
            }
            var aTouchIdentifiers = new Array();
            switch(_type) {
                case "image":
                    var aRect;
                    aRect = new Array(_oAreaData.aPos[0] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale, _oAreaData.aPos[0] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale);
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: aRect,
                        align: _oAreaData.align
                    });
                    break;
                case "rect":
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: _oAreaData.aRect,
                        align: _oAreaData.align
                    });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.resetAll = function () {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                this.aHitAreas[i].oData.isDown = false;
                this.aHitAreas[i].oData.isBeingDragged = false;
                this.aHitAreas[i].aTouchIdentifiers = new Array();
            }
            this.isDown = false;
        };
        return UserInput;
    })();
    Utils.UserInput = UserInput;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if(++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    })();
    Utils.FpsMeter = FpsMeter;    
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background() {
            this.x = 0;
            this.y = 0;
            this.targY = 0;
            this.incY = 0;
            this.renderState = null;
            this.oImgData = assetLib.getData("background");
        }
        Background.prototype.render = function () {
            if(canvas.width > canvas.height) {
                ctx.drawImage(this.oImgData.img, 0, ((1 - canvas.height / canvas.width) / 2) * this.oImgData.img.height, this.oImgData.img.width, (canvas.height / canvas.width) * this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.drawImage(this.oImgData.img, ((1 - canvas.width / canvas.height) / 2) * this.oImgData.img.width, 0, (canvas.width / canvas.height) * this.oImgData.img.width, this.oImgData.img.width, 0, 0, canvas.width, canvas.height);
            }
        };
        return Background;
    })();
    Elements.Background = Background;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_panelType, _aButs) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.numberSpace = 38;
            this.incY = 0;
            this.carX = 0;
            this.aLevelStars = new Array([
                1, 
                0, 
                0, 
                0, 
                0
            ], [
                1, 
                0, 
                0, 
                0, 
                0
            ], [
                1, 
                1, 
                0, 
                0, 
                0
            ], [
                1, 
                1, 
                0, 
                0, 
                0
            ], [
                1, 
                1, 
                0, 
                0, 
                0
            ], [
                1, 
                1, 
                1, 
                0, 
                0
            ], [
                1, 
                1, 
                1, 
                0, 
                0
            ], [
                1, 
                1, 
                1, 
                0, 
                0
            ], [
                1, 
                1, 
                1, 
                1, 
                0
            ], [
                1, 
                1, 
                1, 
                1, 
                0
            ], [
                1, 
                1, 
                1, 
                1, 
                0
            ], [
                1, 
                1, 
                1, 
                1, 
                0
            ], [
                1, 
                1, 
                1, 
                1, 
                1
            ], [
                1, 
                1, 
                1, 
                1, 
                1
            ]);
            this.aLevelStarYOffset = new Array(0, 7, 14, 7, 0);
            this.aBarLimits = new Array([
                1.1, 
                2.1
            ], [
                1, 
                3.5
            ], [
                1, 
                2.4
            ], [
                1, 
                10
            ]);
            this.lockOn = false;
            this.oShadowImgData = assetLib.getData("shadow");
            this.oCreditsImgData = assetLib.getData("credits");
            this.oSplashLogoImgData = assetLib.getData("splashLogo");
            this.oCoinNumbersImgData = assetLib.getData("coinNumbers");
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oTitleImgData = assetLib.getData("title");
            this.panelType = _panelType;
            this.aButs = _aButs;
        }
        Panel.prototype.update = function () {
            this.incY += 10 * delta;
        };
        Panel.prototype.startTween1 = function () {
            this.posY = 500;
            TweenLite.to(this, .5, {
                posY: 0,
                ease: "Back.easeOut"
            });
        };
        Panel.prototype.addCash = function () {
            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].x;
            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].y;
            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].width;
            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].height;
            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 7 - this.posY, 4, bWidth, bHeight);
            var tempScale = .7;
            for(var i = 0; i < curCash.toString().length; i++) {
                var id = parseFloat(curCash.toString().charAt(i));
                var imgX = (id * this.oCoinNumbersImgData.oData.spriteWidth) % this.oCoinNumbersImgData.img.width;
                var imgY = Math.floor(id / (this.oCoinNumbersImgData.img.width / this.oCoinNumbersImgData.oData.spriteWidth)) * this.oCoinNumbersImgData.oData.spriteHeight;
                ctx.drawImage(this.oCoinNumbersImgData.img, imgX, imgY, this.oCoinNumbersImgData.oData.spriteWidth, this.oCoinNumbersImgData.oData.spriteHeight, 47 + i * (this.numberSpace * tempScale) - this.posY, 8, this.oCoinNumbersImgData.oData.spriteWidth * tempScale, this.oCoinNumbersImgData.oData.spriteHeight * tempScale);
            }
        };
        Panel.prototype.addUpgradeInfo = function (_id, _offsetX, _offsetY) {
            var temp;
            var offset;
            for(var i = 0; i < 5; i++) {
                if(aUserCarData[curCar][_id] >= i + 1) {
                    temp = 1;
                    offset = 2;
                } else {
                    temp = 0;
                    offset = 0;
                }
                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradeDot" + temp]].x;
                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradeDot" + temp]].y;
                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradeDot" + temp]].width;
                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["upgradeDot" + temp]].height;
                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + _offsetX + this.posY / 2 + 24.5 * i + offset, canvas.height / 2 + _offsetY + offset, bWidth, bHeight);
            }
            if(aUserCarData[curCar][_id] < 5) {
                var tempScale = .7;
                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].x;
                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].y;
                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].width;
                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].height;
                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + _offsetX + this.posY / 1.5 + 15, canvas.height / 2 + _offsetY + 33, bWidth * tempScale, bHeight * tempScale);
                var tempScale = .5;
                for(var i = 0; i < aUpgradeCosts[curCar][aUserCarData[curCar][_id]].toString().length; i++) {
                    var id = parseFloat(aUpgradeCosts[curCar][aUserCarData[curCar][_id]].toString().charAt(i));
                    var imgX = (id * this.oCoinNumbersImgData.oData.spriteWidth) % this.oCoinNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oCoinNumbersImgData.img.width / this.oCoinNumbersImgData.oData.spriteWidth)) * this.oCoinNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oCoinNumbersImgData.img, imgX, imgY, this.oCoinNumbersImgData.oData.spriteWidth, this.oCoinNumbersImgData.oData.spriteHeight, canvas.width / 2 + _offsetX + i * (this.numberSpace * tempScale) + this.posY / 1.5 + 45, canvas.height / 2 + _offsetY + 36, this.oCoinNumbersImgData.oData.spriteWidth * tempScale, this.oCoinNumbersImgData.oData.spriteHeight * tempScale);
                }
            }
        };
        Panel.prototype.tweenCarSwap = function (_dir) {
            if(this.carSwapTween) {
                this.carSwapTween.kill();
            }
            if(_dir == 0) {
                this.carX = 50;
            } else {
                this.carX = -50;
            }
            this.carSwapTween = TweenLite.to(this, 1, {
                carX: 0,
                ease: "Back.easeOut"
            });
        };
        Panel.prototype.switchBut = function (_id0, _id1) {
            for(var i = 0; i < this.aButs.length; i++) {
                if(this.aButs[i].id == _id0) {
                    this.aButs[i].id = _id1;
                    break;
                }
            }
        };
        Panel.prototype.render = function (_butsOnTop) {
            if (typeof _butsOnTop === "undefined") { _butsOnTop = true; }
            if(!_butsOnTop) {
                this.addButs(ctx);
            }
            switch(this.panelType) {
                case "splash":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height / 2 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    break;
                case "start":
                    ctx.drawImage(this.oTitleImgData.img, 0, 0, this.oTitleImgData.img.width, this.oTitleImgData.img.height, canvas.width / 2 - this.oTitleImgData.img.width / 2 + this.posY / 2 + 3, canvas.height * .5 - this.oTitleImgData.img.height / 2 - 10, this.oTitleImgData.img.width, this.oTitleImgData.img.height);
                    break;
                case "credits":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oCreditsImgData.img, canvas.width / 2 - this.oCreditsImgData.img.width / 2, canvas.height / 2 - this.oCreditsImgData.img.height / 2 - this.posY);
                    break;
                case "carSelect":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectPanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectPanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectPanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectPanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 3, canvas.height * .5 - bHeight / 2 - 10, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 - this.carX, canvas.height / 2 - bHeight / 2 - 125, bWidth, bHeight);
                    if(this.lockOn) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 160, canvas.height / 2 - bHeight / 2 - 180, bWidth, bHeight);
                    }
                    for(var i = 0; i < 4; i++) {
                        var totalStat = (1 / (this.aBarLimits[i][1] - this.aBarLimits[i][0])) * (aCarData[curCar][aStatData[i]] - this.aBarLimits[i][0]);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar0].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar0].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar0].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar0].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 75 + this.posY / 2, canvas.height / 2 - 16 + i * 37.8, bWidth * totalStat, bHeight);
                        var upgradeAmount = ((aCarUpgradeData[curCar][aStatData[i]] - aStoredCarData[curCar][aStatData[i]]) / 5) * aUserCarData[curCar][i];
                        var defaultStat = (1 / (this.aBarLimits[i][1] - this.aBarLimits[i][0])) * (aStoredCarData[curCar][aStatData[i]] - this.aBarLimits[i][0]);
                        var upgradeStat = (1 / (this.aBarLimits[i][1] - this.aBarLimits[i][0])) * (upgradeAmount);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar1].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar1].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar1].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.carSelectBar1].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - 75 + this.posY / 2 + defaultStat * bWidth, canvas.height / 2 - 16 + i * 37.8, bWidth * upgradeStat, bHeight);
                    }
                    this.addCash();
                    break;
                case "upgrade":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.upgradePanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.upgradePanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.upgradePanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.upgradePanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 3, canvas.height * .5 - bHeight / 2 - 10, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["heroCar" + curCar]].height;
                    var tempScale = .24;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale + this.posY / 2 - 127, canvas.height / 2 - (bHeight / 2) * tempScale - 194, bWidth * tempScale, bHeight * tempScale);
                    this.addUpgradeInfo(0, -143, -154);
                    this.addUpgradeInfo(1, 15, -154);
                    this.addUpgradeInfo(2, -143, -6);
                    this.addUpgradeInfo(3, 15, -6);
                    this.addCash();
                    break;
                case "levelSelect":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 3, canvas.height * .5 - bHeight / 2 - 10, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height * .5 - bHeight / 2 - 42, bWidth, bHeight);
                    if(this.lockOn) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.lock].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 160, canvas.height / 2 - bHeight / 2 - 180, bWidth, bHeight);
                    }
                    for(var i = 0; i < 6; i++) {
                        if(aLevelResultData[curLevelAll][i] > 0) {
                            var tempX = canvas.width / 2 - 128 + i * 52;
                            var tempY = canvas.height / 2 - 162;
                            var curFrame = 25;
                            var imgX = (curFrame * this.oShadowImgData.oData.spriteWidth) % this.oShadowImgData.img.width;
                            var imgY = Math.floor(curFrame / (this.oShadowImgData.img.width / this.oShadowImgData.oData.spriteWidth)) * this.oShadowImgData.oData.spriteHeight;
                            ctx.drawImage(this.oShadowImgData.img, imgX, imgY, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight, tempX - this.oShadowImgData.oData.spriteWidth / 2 + this.posY / 2, tempY - this.oShadowImgData.oData.spriteHeight / 2, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight);
                            var oImgData = assetLib.getData("car" + i + "0");
                            var imgX = (curFrame * oImgData.oData.spriteWidth) % oImgData.img.width;
                            var imgY = Math.floor(curFrame / (oImgData.img.width / oImgData.oData.spriteWidth)) * oImgData.oData.spriteHeight;
                            ctx.drawImage(oImgData.img, imgX, imgY, oImgData.oData.spriteWidth, oImgData.oData.spriteHeight, tempX - oImgData.oData.spriteWidth / 2 + this.posY / 2, tempY - oImgData.oData.spriteHeight / 2 + aCarYOffset[i], oImgData.oData.spriteWidth, oImgData.oData.spriteHeight);
                            var tempScale = .5;
                            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + (aLevelResultData[curLevelAll][i] - 1)]].x;
                            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + (aLevelResultData[curLevelAll][i] - 1)]].y;
                            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + (aLevelResultData[curLevelAll][i] - 1)]].width;
                            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + (aLevelResultData[curLevelAll][i] - 1)]].height;
                            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, tempX - (bWidth / 2) * tempScale + this.posY / 2, tempY - (bHeight / 2) * tempScale - 32, bWidth * tempScale, bHeight * tempScale);
                        }
                    }
                    var cupId = "Blank";
                    var tempCup = 4;
                    var tempNum = 0;
                    for(var i = 0; i < aLevelResultData[curLevelAll].length; i++) {
                        if(aLevelResultData[curLevelAll][i] == 3 && tempCup > 3) {
                            tempCup = 3;
                            cupId = "Third";
                        }
                        if(aLevelResultData[curLevelAll][i] == 2 && tempCup > 2) {
                            tempCup = 2;
                            cupId = "Second";
                        }
                        if(aLevelResultData[curLevelAll][i] == 1 && tempCup >= 1) {
                            tempCup = 1;
                            cupId = "First";
                            tempNum++;
                        }
                    }
                    if(tempNum == aLevelResultData[curLevelAll].length) {
                        cupId = "AllFirst";
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height * .5 - bHeight / 2 - 5, bWidth, bHeight);
                    for(var i = 0; i < 5; i++) {
                        var tempX = canvas.width / 2 - 70 + i * 35;
                        var tempY = canvas.height / 2 + 72;
                        var starId = this.aLevelStars[curLevelAll][i];
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["star" + starId]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["star" + starId]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["star" + starId]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["star" + starId]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, tempX - bWidth / 2 + this.posY / 2, tempY - bHeight / 2 + this.aLevelStarYOffset[i], bWidth, bHeight);
                    }
                    this.addCash();
                    break;
                case "game":
                    break;
                case "raceComplete":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.levelSelectPanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2 + 3, canvas.height * .5 - bHeight / 2 - 10, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["levelPreview" + curLevelAll % 7]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height * .5 - bHeight / 2 - 42, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endFlare].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endFlare].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endFlare].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.endFlare].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height * .5 - bHeight / 2 - 140, bWidth, bHeight);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height / 2 - 170, bWidth, bHeight);
                    var cupId = "Lost";
                    if(raceEndPosition == 0) {
                        cupId = "First";
                    } else if(raceEndPosition == 1) {
                        cupId = "Second";
                    }
                    if(raceEndPosition == 2) {
                        cupId = "Third";
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + cupId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.posY / 2, canvas.height * .5 - bHeight / 2 - 25, bWidth, bHeight);
                    var tempScale = .7;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.coin].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.posY / 2 - 25 - curWinnings.toString().length * (this.numberSpace * tempScale) / 2, canvas.height / 2 + 50, bWidth, bHeight);
                    for(var i = 0; i < curWinnings.toString().length; i++) {
                        var id = parseFloat(curWinnings.toString().charAt(i));
                        var imgX = (id * this.oCoinNumbersImgData.oData.spriteWidth) % this.oCoinNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oCoinNumbersImgData.img.width / this.oCoinNumbersImgData.oData.spriteWidth)) * this.oCoinNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oCoinNumbersImgData.img, imgX, imgY, this.oCoinNumbersImgData.oData.spriteWidth, this.oCoinNumbersImgData.oData.spriteHeight, canvas.width / 2 + 15 + i * (this.numberSpace * tempScale) + this.posY / 2 - curWinnings.toString().length * (this.numberSpace * tempScale) / 2, canvas.height / 2 + 54, this.oCoinNumbersImgData.oData.spriteWidth * tempScale, this.oCoinNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    this.addCash();
                    break;
                case "pause":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;
            }
            if(_butsOnTop) {
                this.addButs(ctx);
            }
        };
        Panel.prototype.addButs = function (ctx) {
            for(var i = 0; i < this.aButs.length; i++) {
                if(this.panelType == "carSelect") {
                    if(this.aButs[i].id == oImageIds.leftBut && curCar < 1) {
                        continue;
                    } else if(this.aButs[i].id == oImageIds.rightBut && curCar > aUserCarData.length - 2) {
                        continue;
                    }
                    if(getLevelsFinishedFirst() < curCar * 2 && this.aButs[i].id == oImageIds.upgradeBut) {
                        continue;
                    }
                    if(this.aButs[i].id == oImageIds.playBut) {
                        if(curCar != 0) {
                            if(getLevelsFinishedFirst() >= curCar * 2) {
                                this.aButs[i].id = oImageIds.playBut;
                                this.aButs[i].noMove = false;
                                this.lockOn = false;
                            } else {
                                this.lockOn = true;
                                continue;
                            }
                        } else {
                            this.lockOn = false;
                        }
                    }
                }
                if(this.panelType == "levelSelect") {
                    if(this.aButs[i].id == oImageIds.leftBut && curLevelAll < 1) {
                        continue;
                    } else if(this.aButs[i].id == oImageIds.rightBut && curLevelAll > aLevelResultData.length - 2) {
                        continue;
                    }
                    if(this.aButs[i].id == oImageIds.playBut) {
                        if(curLevelAll != 0) {
                            var tempCan = false;
                            for(var j = 0; j < aLevelResultData[curLevelAll - 1].length; j++) {
                                if(aLevelResultData[curLevelAll - 1][j] < 4 && aLevelResultData[curLevelAll - 1][j] > 0) {
                                    this.aButs[i].id = oImageIds.playBut;
                                    this.aButs[i].noMove = false;
                                    tempCan = true;
                                    this.lockOn = false;
                                    break;
                                }
                            }
                            if(!tempCan) {
                                this.lockOn = true;
                                continue;
                            }
                        } else {
                            this.lockOn = false;
                        }
                    }
                }
                if(this.panelType == "upgrade") {
                    for(var j = 0; j < 4; j++) {
                        if(this.aButs[i].id == oImageIds["upgradeBut" + j] && (curCash < aUpgradeCosts[curCar][aUserCarData[curCar][j]] || aUserCarData[curCar][j] >= 5)) {
                            this.aButs[i].id = oImageIds["upgradeButDim" + j];
                        }
                    }
                }
                var offsetPosY = this.posY;
                var floatY = 0;
                if(this.incY != 0 && !this.aButs[i].noMove) {
                    floatY = Math.sin(this.incY + i * 45) * 3;
                }
                if(i % 2 == 0) {
                }
                if(!this.aButs[i].scale) {
                    this.aButs[i].scale = 1;
                }
                var bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                var bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                var bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                var bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                var aX = canvas.width * this.aButs[i].align[0];
                var aY = canvas.height * this.aButs[i].align[1];
                ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale) + offsetPosY - floatY / 2, aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + floatY / 2, bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
            }
        };
        return Panel;
    })();
    Elements.Panel = Panel;    
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var TextDisplay = (function () {
        function TextDisplay() {
            this.oTextData = {
            };
            this.inc = 0;
            this.createTextObjects();
        }
        TextDisplay.prototype.createTextObjects = function () {
            var cnt = 0;
            for(var i in assetLib.textData.langText.text[curLang]) {
                this.oTextData[i] = {
                };
                this.oTextData[i].aLineData = this.getCharData(assetLib.textData.langText.text[curLang][i]["@text"], assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].aLineWidths = this.getLineWidths(this.oTextData[i].aLineData);
                this.oTextData[i].blockWidth = this.getBlockWidth(this.oTextData[i].aLineData);
                this.oTextData[i].blockHeight = this.getBlockHeight(this.oTextData[i].aLineData, assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].lineHeight = parseInt(assetLib.textData["fontData" + assetLib.textData.langText.text[curLang][i]["@fontId"]].text.common["@lineHeight"]);
                this.oTextData[i].oFontImgData = assetLib.getData("font" + assetLib.textData.langText.text[curLang][i]["@fontId"]);
            }
        };
        TextDisplay.prototype.getLineWidths = function (_aCharData) {
            var lineLength;
            var aLineWidths = new Array();
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                aLineWidths.push(lineLength);
            }
            return aLineWidths;
        };
        TextDisplay.prototype.getBlockWidth = function (_aCharData) {
            var lineLength;
            var longestLineLength = 0;
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                if(lineLength > longestLineLength) {
                    longestLineLength = lineLength;
                }
            }
            return longestLineLength;
        };
        TextDisplay.prototype.getBlockHeight = function (_aCharData, _fontId) {
            return _aCharData.length * parseInt(assetLib.textData["fontData" + _fontId].text.common["@lineHeight"]);
        };
        TextDisplay.prototype.getCharData = function (_aLines, _fontId) {
            var aCharData = new Array();
            for(var k = 0; k < _aLines.length; k++) {
                aCharData[k] = new Array();
                for(var i = 0; i < _aLines[k].length; i++) {
                    for(var j = 0; j < assetLib.textData["fontData" + _fontId].text.chars.char.length; j++) {
                        if(_aLines[k][i].charCodeAt() == assetLib.textData["fontData" + _fontId].text.chars.char[j]["@id"]) {
                            aCharData[k].push(assetLib.textData["fontData" + _fontId].text.chars.char[j]);
                        }
                    }
                }
            }
            return aCharData;
        };
        TextDisplay.prototype.renderText = function (_oTextDisplayData) {
            var aLinesToRender = this.oTextData[_oTextDisplayData.text].aLineData;
            var oFontImgData = this.oTextData[_oTextDisplayData.text].oFontImgData;
            var shiftX;
            var offsetX = 0;
            var offsetY = 0;
            var lineOffsetY = 0;
            var manualScale = 1;
            var animY = 0;
            if(_oTextDisplayData.lineOffsetY) {
                lineOffsetY = _oTextDisplayData.lineOffsetY;
            }
            if(_oTextDisplayData.scale) {
                manualScale = _oTextDisplayData.scale;
            }
            var textScale = 1 * manualScale;
            if(_oTextDisplayData.maxWidth && this.oTextData[_oTextDisplayData.text].blockWidth * manualScale > _oTextDisplayData.maxWidth) {
                textScale = _oTextDisplayData.maxWidth / this.oTextData[_oTextDisplayData.text].blockWidth;
            }
            if(_oTextDisplayData.anim) {
                this.inc += delta * 7;
            }
            for(var i = 0; i < aLinesToRender.length; i++) {
                shiftX = 0;
                if(_oTextDisplayData.alignX == "centre") {
                    offsetX = this.oTextData[_oTextDisplayData.text].aLineWidths[i] / 2;
                }
                if(_oTextDisplayData.alignY == "centre") {
                    offsetY = this.oTextData[_oTextDisplayData.text].blockHeight / 2 + (lineOffsetY * (aLinesToRender.length - 1)) / 2;
                }
                for(var j = 0; j < aLinesToRender[i].length; j++) {
                    var bX = aLinesToRender[i][j]["@x"];
                    var bY = aLinesToRender[i][j]["@y"];
                    var bWidth = aLinesToRender[i][j]["@width"];
                    var bHeight = aLinesToRender[i][j]["@height"];
                    if(_oTextDisplayData.anim) {
                        animY = Math.sin(this.inc + j / 2) * ((bHeight / 15) * textScale);
                    }
                    ctx.drawImage(oFontImgData.img, bX, bY, bWidth, bHeight, _oTextDisplayData.x + (shiftX + parseInt(aLinesToRender[i][j]["@xoffset"]) - offsetX) * textScale, _oTextDisplayData.y + (parseInt(aLinesToRender[i][j]["@yoffset"]) + (i * this.oTextData[_oTextDisplayData.text].lineHeight) + (i * lineOffsetY) - offsetY) * textScale + animY, bWidth * textScale, bHeight * textScale);
                    shiftX += parseInt(aLinesToRender[i][j]["@xadvance"]);
                }
            }
        };
        return TextDisplay;
    })();
    Utils.TextDisplay = TextDisplay;    
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Track = (function () {
        function Track() {
            this.rotation = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.segNum = 50;
            this.trackScaleX = 3;
            this.trackScaleY = 1.5;
            this.centreOffset = 0;
            this.aBgColours = new Array("rgba(198, 188, 117, 1)", "rgba(255, 255, 255, 1)", "rgba(167, 168, 167, 1)", "rgba(76, 136, 152, 1)", "rgba(27, 29, 27, 1)", "rgba(220, 187, 144, 1)", "rgba(73, 137, 151, 1)");
            this.oTrackImgData = assetLib.getData("track" + curLevelAll % 7);
            this.oBarrierImgData = assetLib.getData("barrier" + curLevelAll % 7);
            this.offsetX = userCar.trackX;
            this.offsetY = userCar.trackY;
            this.rotation = userCar.rotation;
            this.viewOffsetX = Math.cos((userCar.rotation - this.rotation) - 45 * radian);
            this.viewOffsetY = Math.sin((userCar.rotation - this.rotation) - 45 * radian);
        }
        Track.prototype.tweenStartSpin = function () {
            var tempRot = (userCar.trackX + userCar.trackY) / 1900 - 25 * radian;
            this.rotation = tempRot + 90 * radian;
            TweenLite.to(this, 2.5, {
                rotation: tempRot,
                ease: "Quad.easeOut"
            });
        };
        Track.prototype.render = function () {
            this.offsetX = userCar.trackX;
            this.offsetY = userCar.trackY;
            if(raceStartState == 2) {
                this.rotation = (userCar.trackX + userCar.trackY) / 1900 - 25 * radian;
            } else if(raceStartState == 0) {
                this.rotation = (userCar.trackX + userCar.trackY) / 1900 - 25 * radian + 90 * radian;
            } else if(raceStartState == 3) {
                this.rotation += delta;
            }
            this.viewOffsetX += (((this.centreOffset * Math.cos((userCar.rotation - this.rotation) - 45 * radian)) - this.viewOffsetX) * 1.5) * delta;
            this.viewOffsetY += (((this.centreOffset * Math.sin((userCar.rotation - this.rotation) - 45 * radian)) - this.viewOffsetY) * 1.5) * delta;
            ctx.fillStyle = this.aBgColours[curLevelAll % 7];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2 - this.viewOffsetX, canvas.height / 2 - this.viewOffsetY);
            ctx.scale(this.trackScaleX, this.trackScaleY);
            ctx.rotate(-this.rotation - 45 * radian);
            ctx.drawImage(this.oTrackImgData.img, 0, 0, this.oTrackImgData.img.width, this.oTrackImgData.img.height, -this.offsetX, -this.offsetY, this.oTrackImgData.img.width, this.oTrackImgData.img.height);
            ctx.restore();
        };
        return Track;
    })();
    Elements.Track = Track;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var UserCar = (function () {
        function UserCar(_oData) {
            this.yOffsetPerc = .65;
            this.x = 0;
            this.y = 0;
            this.speed = 0;
            this.id = 99;
            this.targSpeed = 0;
            this.carType = "user";
            this.canHit = true;
            this.angle = 0;
            this.rotation = 0;
            this.radius = 10;
            this.carHitRadius = 20;
            this.vx = 0;
            this.vy = 0;
            this.m = 1;
            this.f = .5;
            this.b = 1;
            this.steer = 0;
            this.targVx = 0;
            this.targVy = 0;
            this.endTimer = 0;
            this.driftInc = 5;
            this.shieldState = 0;
            this.shieldInc = 0;
            this.shieldFlickerInc = 0;
            this.shieldFlickerState = false;
            this.hitScale = 1;
            this.hitState = 0;
            this.flickerInc = 0;
            this.flickerState = false;
            this.firstDrift = true;
            this.prevDirMarkerHyp = 0;
            this.dirMarkerTime = 0;
            this.startInc = 0;
            this.groundFrictionMultiplier = 1;
            this.maxSpeedMultiplier = 1;
            this.oImgData = assetLib.getData("car" + curCar + "0");
            this.oShadowImgData = assetLib.getData("shadow");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oData = _oData;
            this.id = this.oData.id;
            this.trackX = this.oData.trackX;
            this.trackY = this.oData.trackY;
            this.p0 = {
                x: this.trackX,
                y: this.trackY
            };
            this.p1 = {
                x: this.trackX,
                y: this.trackY
            };
            this.angle = this.rotation = this.oData.rot;
            this.vx = this.speed * Math.cos(this.angle);
            this.vy = this.speed * Math.sin(this.angle);
            this.canCrossFinishLine = false;
            this.lapNum = 0;
            this.positionNum = this.id;
            this.startRace = true;
            this.oPrevData = {
                maxSpeed: aCarData[curCar].maxSpeed,
                groundFriction: aCarData[curCar].groundFriction
            };
            this.bounceY = 0;
            this.bounceYInc = 0;
            this.isBouncing = false;
        }
        UserCar.prototype.hitWall = function () {
            playSound("hitWall");
            playSound("thud" + Math.floor(Math.random() * 4));
            var newAngle = Math.atan2(this.vy, this.vx);
            if(newAngle - this.angle > 180 * radian) {
                newAngle -= 360 * radian;
            } else if(newAngle - this.angle < -180 * radian) {
                newAngle += 360 * radian;
            }
            if(newAngle > this.angle) {
                this.angle += 20 * radian;
            } else {
                this.angle -= 20 * radian;
            }
            if(!this.isBouncing) {
                this.bounceYInc = Math.random() * 100 + 100;
                this.isBouncing = true;
            }
        };
        UserCar.prototype.hitCar = function (_angle, _bouncePower) {
            this.angle += (Math.random() * 40 - 20) * radian;
            this.vx += _bouncePower * Math.cos(_angle);
            this.vy += _bouncePower * Math.sin(_angle);
        };
        UserCar.prototype.hitBoost = function () {
            if(this.maxSpeedMultiplier == 1) {
                if(this.boostTween) {
                    this.boostTween.kill();
                }
                playSound("boost");
                this.maxSpeedMultiplier = 2;
                this.groundFrictionMultiplier = 2;
                this.boostTween = TweenLite.to(this, 1, {
                    maxSpeedMultiplier: 1,
                    groundFrictionMultiplier: 1,
                    ease: "Linear.easeNone"
                });
            }
        };
        UserCar.prototype.hitOil = function () {
            if(this.groundFrictionMultiplier == 1) {
                if(this.oilTween) {
                    this.oilTween.kill();
                }
                playSound("splash");
                this.groundFrictionMultiplier = .25;
                this.oilTween = TweenLite.to(this, 3, {
                    groundFrictionMultiplier: 1,
                    ease: "Quad.easeIn"
                });
            }
        };
        UserCar.prototype.update = function () {
            if(raceStartState < 2) {
                return;
            }
            var a = this.trackX - aDirMarkers[this.curPosId % aDirMarkers.length].pos.x;
            var b = this.trackY - aDirMarkers[this.curPosId % aDirMarkers.length].pos.y;
            var hyp = ((a * a) + (b * b));
            if(this.prevDirMarkerHyp > hyp && hyp < 85 * 85) {
                ++this.curPosId;
                if(this.curPosId % aDirMarkers.length >= aDirMarkers.length) {
                    this.curPosId = this.lapNum * aDirMarkers.length;
                }
                this.dirMarkerTime = gameTime;
                checkPositions();
            }
            this.prevDirMarkerHyp = hyp;
            a = this.trackX - oFinishLine.x;
            b = this.trackY - oFinishLine.y;
            hyp = ((a * a) + (b * b));
            if(this.curPosId % aDirMarkers.length == Math.round(aDirMarkers.length / 2)) {
                this.canCrossFinishLine = true;
            }
            if(this.canCrossFinishLine && (this.curPosId % aDirMarkers.length == 0 || this.curPosId % aDirMarkers.length == 1) && hyp < 250 * 250) {
                this.lapNum++;
                playSound("beep1");
                this.canCrossFinishLine = false;
                if(this.lapNum >= aLapData[curLevelAll] + 1) {
                    crossedFinishLine();
                    TweenLite.to(this, 3, {
                        angle: this.angle + ((Math.random() * 180) - 90) * radian,
                        ease: "Back.easeOut",
                        onComplete: function () {
                            raceComplete();
                        }
                    });
                }
            }
            if(this.startRace && (this.curPosId % aDirMarkers.length == 0 || this.curPosId % aDirMarkers.length == 1) && hyp < 250 * 250) {
                this.lapNum++;
                hud.tweenPositionNum();
                this.startRace = false;
            }
            for(var i = 0; i < aTrackTriggers.length; i++) {
                a = this.trackX - aTrackTriggers[i].x;
                b = this.trackY - aTrackTriggers[i].y;
                hyp = ((a * a) + (b * b));
                if(aTrackTriggers[i].id == "boost" && hyp < 20 * 20) {
                    this.hitBoost();
                }
                if(aTrackTriggers[i].id == "oil" && hyp < 27 * 27) {
                    this.hitOil();
                }
            }
            if(raceStartState != 3) {
                this.steer = (rightSteer + leftSteer) / aCarData[curCar].steerRate;
                this.angle = (this.angle - this.steer * delta);
                if(this.angle < -180 * radian) {
                    this.angle += 360 * radian;
                    this.rotation += 360 * radian;
                    track.rotation += 360 * radian;
                } else if(this.angle > 180 * radian) {
                    this.angle -= 360 * radian;
                    this.rotation -= 360 * radian;
                    track.rotation -= 360 * radian;
                }
            }
            if((Math.abs(this.steer) == 1 / aCarData[curCar].steerRate) || this.groundFrictionMultiplier < 1 || this.maxSpeedMultiplier > 1) {
                this.driftInc += delta;
                if(this.driftInc > .05 && raceStartState < 3) {
                    if(this.firstDrift) {
                        playSound("skid" + Math.floor(Math.random() * 3));
                        this.firstDrift = false;
                    }
                    if(this.groundFrictionMultiplier < 1) {
                        if(curLevelAll % 7 == 0 || curLevelAll % 7 == 4 || curLevelAll % 7 == 5) {
                            addSmoke(this.trackX, this.trackY, "oilPuff");
                        } else {
                            addSmoke(this.trackX, this.trackY, "icePuff");
                        }
                    } else if(this.maxSpeedMultiplier > 1) {
                        addSmoke(this.trackX, this.trackY, "fire", 1);
                    } else {
                        addSmoke(this.trackX, this.trackY);
                    }
                    this.driftInc = 0;
                }
            } else {
                this.driftInc = -.2;
                this.firstDrift = true;
            }
            this.rotation += ((this.angle - this.rotation) * aCarData[curCar].steerReaction) * delta;
            this.targSpeed = aCarData[curCar].maxSpeed * this.maxSpeedMultiplier * (1 - ((aCarData[curCar].steerRate / aCarData[curCar].steerDamper) * Math.abs(this.steer)));
            if(raceStartState < 3) {
                this.speed += ((this.targSpeed - this.speed) * aCarData[curCar].accRate) * delta;
                this.targVx = this.speed * Math.cos(this.angle);
                this.targVy = this.speed * Math.sin(this.angle);
            } else {
                this.targVx += (0 - this.targVx) * (delta * 4);
                this.targVy += (0 - this.targVy) * (delta * 4);
            }
            this.vx += ((this.targVx - this.vx) * aCarData[curCar].groundFriction * this.groundFrictionMultiplier) * delta;
            this.vy += ((this.targVy - this.vy) * aCarData[curCar].groundFriction * this.groundFrictionMultiplier) * delta;
            if(this.isBouncing) {
                this.bounceYInc -= 1000 * delta;
                this.bounceY += this.bounceYInc * delta;
                if(this.bounceY <= 0) {
                    this.bounceY = 0;
                    this.bounceYInc *= -.75;
                    if(this.bounceYInc <= 10) {
                        this.isBouncing = false;
                    }
                }
            }
            if(this.trackX > 800 || this.trackY > 800 || this.trackX < 0 || this.trackY < 0) {
                userInput.removeHitArea("quitGameFromPause");
                userInput.removeHitArea("resumeGameFromPause");
                userInput.removeHitArea("restartGameFromPause");
                initGame();
            }
        };
        UserCar.prototype.render = function () {
            var tempRot = ((this.rotation - track.rotation) / radian + 45) % 360;
            if(tempRot < 0) {
                tempRot += 360;
            } else if(tempRot > 360) {
                tempRot -= 360;
            }
            this.x = (canvas.width / 2 - track.viewOffsetX);
            this.y = (canvas.height / 2 - track.viewOffsetY);
            if(raceStartState < 2) {
                var temp = Math.round((this.startInc += delta * 6)) % 2;
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["userMarker" + temp]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["userMarker" + temp]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["userMarker" + temp]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["userMarker" + temp]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2, this.y - bHeight / 2 + 5, bWidth, bHeight);
            }
            var curFrame = 63 - Math.floor(((tempRot) / 360) * 64);
            var imgX = (curFrame * this.oShadowImgData.oData.spriteWidth) % this.oShadowImgData.img.width;
            var imgY = Math.floor(curFrame / (this.oShadowImgData.img.width / this.oShadowImgData.oData.spriteWidth)) * this.oShadowImgData.oData.spriteHeight;
            ctx.drawImage(this.oShadowImgData.img, imgX, imgY, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight, this.x - this.oShadowImgData.oData.spriteWidth / 2, this.y - this.oShadowImgData.oData.spriteHeight / 2, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight);
            var imgX = (curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - this.oImgData.oData.spriteWidth / 2, this.y - this.oImgData.oData.spriteHeight / 2 - this.bounceY + aCarYOffset[curCar], this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
        };
        return UserCar;
    })();
    Elements.UserCar = UserCar;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var EnemyCar = (function () {
        function EnemyCar(_oData) {
            this.x = 0;
            this.y = 0;
            this.speed = 0;
            this.targSpeed = 0;
            this.steer = 0;
            this.maxSpeed = 1.5;
            this.accRate = 1.5;
            this.groundFriction = 2.3;
            this.steerRate = .3;
            this.steerReaction = 10;
            this.carType = "enemy";
            this.canHit = true;
            this.angle = 0;
            this.rotation = 0;
            this.radius = 10;
            this.carHitRadius = 20;
            this.vx = 0;
            this.vy = 0;
            this.m = 1;
            this.f = .5;
            this.b = 1;
            this.prevDirMarkerHyp = 0;
            this.prevHitHyp = 0;
            this.targVx = 0;
            this.targVy = 0;
            this.inc = 0;
            this.hitInc = 0;
            this.frozenState = 0;
            this.flickerState = false;
            this.flickerInc = 0;
            this.hitState = 0;
            this.frameInc = Math.random() * 1;
            this.flashLights = true;
            this.driftInc = 0;
            this.firstDrift = true;
            this.prevSteer = 0;
            this.aElasticStrength = new Array(.9, 1, 1.1);
            this.elasticMultiplier = 1;
            this.groundFrictionMultiplier = 1;
            this.maxSpeedMultiplier = 1;
            this.dirMarkerTimer = 0;
            this.raceComplete = false;
            this.oImgData = assetLib.getData("car" + _oData.carTypeId + _oData.carVariation);
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oShadowImgData = assetLib.getData("shadow");
            this.oData = _oData;
            this.trackX = this.oData.trackX;
            this.trackY = this.oData.trackY;
            this.p0 = {
                x: this.trackX,
                y: this.trackY
            };
            this.p1 = {
                x: this.trackX,
                y: this.trackY
            };
            this.angle = this.rotation = this.targAngle = this.oData.rot;
            this.id = _oData.id;
            this.vx = this.speed * Math.cos(this.angle);
            this.vy = this.speed * Math.sin(this.angle);
            this.oCarHyps = {
            };
            this.canCrossFinishLine = false;
            this.lapNum = 0;
            this.positionNum = this.oData.id;
            this.dirMarkerTime = 0;
            this.resetDirTargOffset();
            this.startRace = true;
            this.bounceY = 0;
            this.bounceYInc = 0;
            this.isBouncing = false;
            this.maxSpeed = aStoredCarData[_oData.carTypeId].maxSpeed + ((aCarUpgradeData[_oData.carTypeId].maxSpeed + .1) - aStoredCarData[_oData.carTypeId].maxSpeed) / (aLapData.length - curLevelAll);
            this.accRate = aStoredCarData[_oData.carTypeId].accRate + (aCarUpgradeData[_oData.carTypeId].accRate - aStoredCarData[_oData.carTypeId].accRate) / (aLapData.length - curLevelAll);
            this.groundFriction = aStoredCarData[_oData.carTypeId].groundFriction + (aCarUpgradeData[_oData.carTypeId].groundFriction - aStoredCarData[_oData.carTypeId].groundFriction) / (aLapData.length - curLevelAll);
            this.steerRate = aStoredCarData[_oData.carTypeId].steerRate + (aCarUpgradeData[_oData.carTypeId].steerRate - aStoredCarData[_oData.carTypeId].steerRate) / (aLapData.length - curLevelAll);
            this.steerReaction = aStoredCarData[_oData.carTypeId].steerReaction;
            this.aElasticStrength[0] = 1.1 - .3 / (curLevelAll + 1) - this.id / 20;
            this.aElasticStrength[1] -= this.id / 20 + curLevelAll * 0.007;
            this.aElasticStrength[2] = this.aElasticStrength[2] - this.id / 20 + curLevelAll * 0.014;
            this.oPrevData = {
                maxSpeed: this.maxSpeed,
                groundFriction: this.groundFriction
            };
        }
        EnemyCar.prototype.hitWall = function () {
            var newAngle = Math.atan2(this.vy, this.vx);
            if(newAngle - this.angle > 180 * radian) {
                newAngle -= 360 * radian;
            } else if(newAngle - this.angle < -180 * radian) {
                newAngle += 360 * radian;
            }
            if(newAngle > this.angle) {
                this.angle += 20 * radian;
            } else {
                this.angle -= 20 * radian;
            }
            if(!this.isBouncing) {
                this.bounceYInc = Math.random() * 100 + 100;
                this.isBouncing = true;
            }
        };
        EnemyCar.prototype.hitCar = function (_angle, _state, _bouncePower) {
            if (typeof _state === "undefined") { _state = 0; }
            if (typeof _bouncePower === "undefined") { _bouncePower = 0; }
            this.hitState = _state;
            this.vx += _bouncePower * Math.cos(_angle);
            this.vy += _bouncePower * Math.sin(_angle);
            this.angle += (Math.random() * 40 - 20) * radian;
            this.canHit = false;
            if(!this.isBouncing) {
                this.bounceYInc = Math.random() * 50 + 100;
                this.isBouncing = true;
            }
        };
        EnemyCar.prototype.hitBoost = function () {
            if(this.maxSpeedMultiplier == 1) {
                if(this.boostTween) {
                    this.boostTween.kill();
                }
                this.maxSpeedMultiplier = 2;
                this.groundFrictionMultiplier = 2;
                this.boostTween = TweenLite.to(this, 1, {
                    maxSpeedMultiplier: 1,
                    groundFrictionMultiplier: 1,
                    ease: "Linear.easeNone"
                });
            }
        };
        EnemyCar.prototype.hitOil = function () {
            if(this.groundFrictionMultiplier == 1) {
                if(this.oilTween) {
                    this.oilTween.kill();
                }
                this.groundFrictionMultiplier = .25;
                this.oilTween = TweenLite.to(this, 3, {
                    groundFrictionMultiplier: 1,
                    ease: "Quad.easeIn"
                });
            }
        };
        EnemyCar.prototype.resetDirTargOffset = function () {
            this.dirTargOffsetX = Math.random() * 50 - 25;
            this.dirTargOffsetY = Math.random() * 50 - 25;
        };
        EnemyCar.prototype.update = function () {
            if(raceStartState < 2) {
                return;
            }
            if(!this.canHit) {
                this.hitInc += delta;
                if(this.hitInc > .2) {
                    this.canHit = true;
                    this.hitInc = 0;
                }
            }
            this.inc -= delta;
            var a = this.trackX - aDirMarkers[this.curDirId].pos.x + this.dirTargOffsetX;
            var b = this.trackY - aDirMarkers[this.curDirId].pos.y + this.dirTargOffsetY;
            var hypTarg = ((a * a) + (b * b));
            var a0 = this.trackX - aDirMarkers[this.curDirId].pos.x;
            var b0 = this.trackY - aDirMarkers[this.curDirId].pos.y;
            var hypCentre = ((a0 * a0) + (b0 * b0));
            if(this.curPosId % aDirMarkers.length == Math.round(aDirMarkers.length / 2)) {
                this.canCrossFinishLine = true;
            }
            if(!this.raceComplete && raceStartState == 2) {
                this.dirMarkerTimer += delta;
                if(this.dirMarkerTimer > 3) {
                    --this.curDirId;
                    this.dirMarkerTimer = 0;
                }
            }
            if(this.prevDirMarkerHyp > hypTarg && hypCentre < 50 * 50) {
                if(++this.curDirId >= aDirMarkers.length) {
                    this.curDirId = 0;
                }
                this.dirMarkerTimer = 0;
                this.resetDirTargOffset();
            }
            a0 = this.trackX - aDirMarkers[this.curPosId % aDirMarkers.length].pos.x;
            b0 = this.trackY - aDirMarkers[this.curPosId % aDirMarkers.length].pos.y;
            var hypCentre = ((a0 * a0) + (b0 * b0));
            if(hypCentre < 75 * 75) {
                ++this.curPosId;
                if(this.curPosId % aDirMarkers.length >= aDirMarkers.length) {
                    this.curPosId = this.lapNum * aDirMarkers.length;
                }
                this.dirMarkerTime = gameTime;
                checkPositions();
            }
            this.prevDirMarkerHyp = hypTarg;
            if(this.curPosId > userCar.curPosId + 1) {
                this.elasticMultiplier = this.aElasticStrength[0];
            } else if(this.curPosId < userCar.curPosId - 1) {
                this.elasticMultiplier = this.aElasticStrength[2];
            } else {
                this.elasticMultiplier = this.aElasticStrength[1];
            }
            a0 = this.trackX - oFinishLine.x;
            b0 = this.trackY - oFinishLine.y;
            var hyp = ((a0 * a0) + (b0 * b0));
            if(this.canCrossFinishLine && (this.curPosId % aDirMarkers.length == 0 || this.curPosId % aDirMarkers.length == 1) && hyp < 250 * 250) {
                this.lapNum++;
                this.canCrossFinishLine = false;
                if(this.lapNum >= aLapData[curLevelAll] + 1) {
                    this.raceComplete = true;
                    TweenLite.to(this, 3, {
                        angle: this.angle + ((Math.random() * 180) - 90) * radian,
                        ease: "Back.easeOut"
                    });
                }
            }
            if(this.startRace && (this.curPosId % aDirMarkers.length == 0 || this.curPosId % aDirMarkers.length == 1) && hyp < 250 * 250) {
                this.lapNum++;
                this.startRace = false;
            }
            for(var i = 0; i < aTrackTriggers.length; i++) {
                a0 = this.trackX - aTrackTriggers[i].x;
                b0 = this.trackY - aTrackTriggers[i].y;
                var hypTrigger = ((a0 * a0) + (b0 * b0));
                if(aTrackTriggers[i].id == "boost" && hypTrigger < 15 * 15) {
                    this.hitBoost();
                }
                if(aTrackTriggers[i].id == "oil" && hypTrigger < 27 * 27) {
                    this.hitOil();
                }
            }
            if(!this.raceComplete) {
                this.targAngle = (Math.atan2(b, a) + 0 * radian);
                if(this.targAngle - this.angle > 180 * radian) {
                    this.targAngle -= 360 * radian;
                } else if(this.targAngle - this.angle < -180 * radian) {
                    this.targAngle += 360 * radian;
                }
                if(this.targAngle > this.angle) {
                    this.steer = -(1 / this.steerRate);
                    this.angle += this.steer * delta;
                } else {
                    this.steer = (1 / this.steerRate);
                    this.angle += this.steer * delta;
                }
                if(this.angle < -180 * radian) {
                    this.angle += 360 * radian;
                    this.rotation += 360 * radian;
                } else if(this.angle > 180 * radian) {
                    this.angle -= 360 * radian;
                    this.rotation -= 360 * radian;
                }
            }
            if(Math.abs(this.steer) == 1 / this.steerRate && this.steer == this.prevSteer || this.groundFrictionMultiplier < 1 || this.maxSpeedMultiplier > 1) {
                this.driftInc += delta;
                if(this.driftInc > .05 && raceStartState < 3) {
                    if(this.firstDrift) {
                        this.firstDrift = false;
                    }
                    if(this.groundFrictionMultiplier < 1) {
                        if(curLevelAll % 7 == 0 || curLevelAll % 7 == 4 || curLevelAll % 7 == 5) {
                            addSmoke(this.trackX, this.trackY, "oilPuff");
                        } else {
                            addSmoke(this.trackX, this.trackY, "icePuff");
                        }
                    } else if(this.maxSpeedMultiplier > 1) {
                        addSmoke(this.trackX, this.trackY, "fire", 1);
                    } else {
                        addSmoke(this.trackX, this.trackY);
                    }
                    this.driftInc = 0;
                }
            } else {
                this.driftInc = -.2;
                this.firstDrift = true;
            }
            this.prevSteer = this.steer;
            this.rotation += ((this.angle - this.rotation) * this.steerReaction) * delta;
            this.targSpeed = this.maxSpeed * this.maxSpeedMultiplier * this.elasticMultiplier;
            if(!this.raceComplete) {
                this.speed += ((this.targSpeed - this.speed) * this.accRate * this.elasticMultiplier) * delta;
                this.targVx = this.speed * Math.cos(this.angle);
                this.targVy = this.speed * Math.sin(this.angle);
            } else {
                this.targVx += (0 - this.targVx) * (delta * 4);
                this.targVy += (0 - this.targVy) * (delta * 4);
            }
            this.vx += ((this.targVx - this.vx) * this.groundFriction * this.groundFrictionMultiplier * this.elasticMultiplier) * delta;
            this.vy += ((this.targVy - this.vy) * this.groundFriction * this.groundFrictionMultiplier * this.elasticMultiplier) * delta;
            if(this.isBouncing) {
                this.bounceYInc -= 1000 * delta;
                this.bounceY += this.bounceYInc * delta;
                if(this.bounceY <= 0) {
                    this.bounceY = 0;
                    this.bounceYInc *= -.75;
                    if(this.bounceYInc <= 10) {
                        this.isBouncing = false;
                    }
                }
            }
        };
        EnemyCar.prototype.render = function () {
            var a = userCar.trackX - this.trackX;
            var b = userCar.trackY - this.trackY;
            var hyp = Math.sqrt((a * a) + (b * b));
            this.angleToUserCar = -(track.rotation + 225 * radian) + (Math.atan2(b, a) + 0 * radian);
            this.viewOffsetX = (hyp * Math.cos(this.angleToUserCar)) * track.trackScaleX;
            this.viewOffsetY = (hyp * Math.sin(this.angleToUserCar)) * track.trackScaleY;
            var tempRot = ((this.rotation - track.rotation) / radian + 45) % 360;
            if(tempRot < 0) {
                tempRot += 360;
            } else if(tempRot > 360) {
                tempRot -= 360;
            }
            this.x = canvas.width / 2 - track.viewOffsetX + this.viewOffsetX;
            this.y = canvas.height / 2 - track.viewOffsetY + this.viewOffsetY;
            var curFrame = 63 - Math.floor((tempRot / 360) * 64);
            var imgX = (curFrame * this.oShadowImgData.oData.spriteWidth) % this.oShadowImgData.img.width;
            var imgY = Math.floor(curFrame / (this.oShadowImgData.img.width / this.oShadowImgData.oData.spriteWidth)) * this.oShadowImgData.oData.spriteHeight;
            ctx.drawImage(this.oShadowImgData.img, imgX, imgY, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight, this.x - this.oShadowImgData.oData.spriteWidth / 2, this.y - this.oShadowImgData.oData.spriteHeight / 2, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight);
            var imgX = (curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            var imgX = (curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - this.oImgData.oData.spriteWidth / 2, this.y - this.oImgData.oData.spriteHeight / 2 - this.bounceY + aCarYOffset[this.oData.carTypeId], this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
        };
        return EnemyCar;
    })();
    Elements.EnemyCar = EnemyCar;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Hud = (function () {
        function Hud() {
            this.totalLaps = 3;
            this.hudY = 200;
            this.pauseStartTimer = false;
            this.startLightState = 0;
            this.startTimerInc = 0;
            this.tutInc = 0;
            this.oUserCarImgData = assetLib.getData("car" + curCar + "0");
            this.oShadowImgData = assetLib.getData("shadow");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oLapNumbersImgData = assetLib.getData("lapNumbers");
        }
        Hud.prototype.tweenPositionNum = function () {
            TweenLite.to(this, .5, {
                hudY: 0,
                ease: "Back.easeOut"
            });
        };
        Hud.prototype.tweenLights = function (_in) {
            if(_in) {
                playSound("beep0");
                this.startTimerY = -300;
                TweenLite.to(this, .3, {
                    startTimerY: 0,
                    ease: "Back.easeOut"
                });
            } else {
                TweenLite.to(this, .3, {
                    startTimerY: -400,
                    ease: "Cubic.easeIn",
                    delay: 1
                });
            }
        };
        Hud.prototype.tweenTut = function (_in) {
            var _this = this;
            if(_in) {
                this.tutX = 500;
                TweenLite.to(this, .5, {
                    tutX: 0,
                    ease: "Back.easeOut"
                });
            } else {
                TweenLite.to(this, .3, {
                    tutX: -1000,
                    ease: "Cubic.easeIn",
                    onComplete: function () {
                        raceStartState = 1;
                        _this.tweenLights(true);
                        track.tweenStartSpin();
                    }
                });
            }
        };
        Hud.prototype.render = function () {
            if(raceStartState < 3) {
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + userCar.positionNum]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + userCar.positionNum]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + userCar.positionNum]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + userCar.positionNum]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 10, 10 - this.hudY, bWidth, bHeight);
            } else {
                raceEndPosition;
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["position" + raceEndPosition]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 10, 10 - this.hudY, bWidth, bHeight);
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lapIndicator].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lapIndicator].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lapIndicator].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.lapIndicator].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, 10 - this.hudY, bWidth, bHeight);
            var id = userCar.lapNum;
            if(raceStartState == 3) {
                id = aLapData[curLevelAll];
            }
            var imgX = (id * this.oLapNumbersImgData.oData.spriteWidth) % this.oLapNumbersImgData.img.width;
            var imgY = Math.floor(id / (this.oLapNumbersImgData.img.width / this.oLapNumbersImgData.oData.spriteWidth)) * this.oLapNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oLapNumbersImgData.img, imgX, imgY, this.oLapNumbersImgData.oData.spriteWidth, this.oLapNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oLapNumbersImgData.oData.spriteWidth / 2 - 30, 10 - this.hudY, this.oLapNumbersImgData.oData.spriteWidth, this.oLapNumbersImgData.oData.spriteHeight);
            var id = aLapData[curLevelAll];
            var imgX = (id * this.oLapNumbersImgData.oData.spriteWidth) % this.oLapNumbersImgData.img.width;
            var imgY = Math.floor(id / (this.oLapNumbersImgData.img.width / this.oLapNumbersImgData.oData.spriteWidth)) * this.oLapNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oLapNumbersImgData.img, imgX, imgY, this.oLapNumbersImgData.oData.spriteWidth, this.oLapNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oLapNumbersImgData.oData.spriteWidth / 2 + 30, 10 - this.hudY, this.oLapNumbersImgData.oData.spriteWidth, this.oLapNumbersImgData.oData.spriteHeight);
            if(this.startTimerY > -350 && raceStartState != 0) {
                if(!this.pauseStartTimer) {
                    this.startTimerInc += delta;
                }
                if(this.startLightState == 0 && this.startTimerInc > 1) {
                    playSound("beep0");
                    this.startLightState = 1;
                } else if(this.startLightState == 1 && this.startTimerInc > 2) {
                    playSound("beep0");
                    this.startLightState = 2;
                } else if(this.startLightState == 2 && this.startTimerInc > 3) {
                    playSound("beep1");
                    this.startLightState = 3;
                    raceStarted();
                }
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["startLights" + this.startLightState]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["startLights" + this.startLightState]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["startLights" + this.startLightState]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["startLights" + this.startLightState]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, 100 - bHeight / 2 + this.startTimerY, bWidth, bHeight);
            }
            if(raceStartState == 0) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tutBg].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tutBg].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tutBg].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tutBg].height;
                if(tempFlip == 1) {
                    tempOffsetX *= -1;
                }
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.tutX / 2, canvas.height / 2 - bHeight / 2, bWidth, bHeight);
                var tutType = "tutDesktop";
                var tempOffsetX = -6;
                var tempOffsetY = 18;
                if(isMobile) {
                    if(canvas.width > canvas.height) {
                        tutType = "tutHoriz";
                        tempOffsetX = -7;
                        tempOffsetY = 14;
                    } else {
                        tutType = "tutVert";
                        tempOffsetX = -14.5;
                        tempOffsetY = 0;
                    }
                }
                var tempFlip = Math.round((this.tutInc += delta / 1.5)) % 2;
                tutType += tempFlip;
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds[tutType]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds[tutType]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds[tutType]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds[tutType]].height;
                if(tempFlip == 1) {
                    tempOffsetX *= -1;
                }
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.tutX / 2 + tempOffsetX, canvas.height / 2 - bHeight / 2 + 45 + tempOffsetY, bWidth, bHeight);
                var tempRot = Math.sin(this.tutInc * Math.PI) * -75;
                if(tempRot < 0) {
                    tempRot += 360;
                } else if(tempRot > 360) {
                    tempRot -= 360;
                }
                var curFrame = 63 - Math.floor(((tempRot) / 360) * 64);
                var imgX = (curFrame * this.oShadowImgData.oData.spriteWidth) % this.oShadowImgData.img.width;
                var imgY = Math.floor(curFrame / (this.oShadowImgData.img.width / this.oShadowImgData.oData.spriteWidth)) * this.oShadowImgData.oData.spriteHeight;
                var tempX = canvas.width / 2;
                var tempY = canvas.height / 2 - 135;
                ctx.drawImage(this.oShadowImgData.img, imgX, imgY, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight, tempX - this.oShadowImgData.oData.spriteWidth / 2 + this.tutX / 2, tempY - this.oShadowImgData.oData.spriteHeight / 2, this.oShadowImgData.oData.spriteWidth, this.oShadowImgData.oData.spriteHeight);
                var imgX = (curFrame * this.oUserCarImgData.oData.spriteWidth) % this.oUserCarImgData.img.width;
                var imgY = Math.floor(curFrame / (this.oUserCarImgData.img.width / this.oUserCarImgData.oData.spriteWidth)) * this.oUserCarImgData.oData.spriteHeight;
                ctx.drawImage(this.oUserCarImgData.img, imgX, imgY, this.oUserCarImgData.oData.spriteWidth, this.oUserCarImgData.oData.spriteHeight, tempX - this.oUserCarImgData.oData.spriteWidth / 2 + this.tutX / 2, tempY - this.oUserCarImgData.oData.spriteHeight / 2 + aCarYOffset[curCar], this.oUserCarImgData.oData.spriteWidth, this.oUserCarImgData.oData.spriteHeight);
            }
        };
        return Hud;
    })();
    Elements.Hud = Hud;    
})(Elements || (Elements = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Elements;
(function (Elements) {
    var Smoke = (function (_super) {
        __extends(Smoke, _super);
        function Smoke(_oImgData, _animId) {
                _super.call(this, _oImgData, 20, 10, _animId);
            this.setAnimType("once", _animId);
            this.animEndedFunc = function () {
                this.removeMe = true;
            };
        }
        Smoke.prototype.update = function () {
            _super.prototype.updateAnimation.call(this, delta);
        };
        Smoke.prototype.render = function () {
            var a = userCar.trackX - this.trackX;
            var b = userCar.trackY - this.trackY;
            var hyp = Math.sqrt((a * a) + (b * b));
            this.angleToUserCar = -(track.rotation + 225 * radian) + (Math.atan2(b, a) + 0 * radian);
            this.viewOffsetX = (hyp * Math.cos(this.angleToUserCar)) * track.trackScaleX;
            this.viewOffsetY = (hyp * Math.sin(this.angleToUserCar)) * track.trackScaleY;
            this.x = canvas.width / 2 - track.viewOffsetX + this.viewOffsetX;
            this.y = canvas.height / 2 - track.viewOffsetY + this.viewOffsetY;
            _super.prototype.renderSimple.call(this, ctx);
        };
        return Smoke;
    })(Utils.AnimSprite);
    Elements.Smoke = Smoke;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var TrackSideObject = (function () {
        function TrackSideObject() {
            this.x = 0;
            this.y = 0;
            this.aLevelObjects = new Array([
                1, 
                5, 
                6, 
                12, 
                15
            ], [
                5, 
                6, 
                7, 
                8, 
                9, 
                10
            ], [
                2, 
                13, 
                16
            ], [
                0, 
                11, 
                14, 
                7
            ], [
                17
            ], [
                10, 
                5, 
                6
            ], [
                19, 
                0, 
                1, 
                2, 
                11, 
                12, 
                13, 
                14, 
                15, 
                16
            ]);
            this.aOffset = new Array(26, 26, 26, 26, 26, 18, 18, 11, 22, 22, 26, 26, 26, 26, 26, 26, 26, 12, 21, 12, 82, 5);
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.id = this.aLevelObjects[curLevelAll % 7][Math.floor(Math.random() * this.aLevelObjects[curLevelAll % 7].length)];
            this.offsetY = this.aOffset[this.id];
        }
        TrackSideObject.prototype.setAsBuilding = function () {
            if(curLevelAll % 7 == 6) {
                this.id = 18;
            } else if(curLevelAll % 7 == 4) {
                this.id = 20;
            }
            this.offsetY = this.aOffset[this.id];
        };
        TrackSideObject.prototype.setAsBarrier = function () {
            this.id = 21;
            this.offsetY = this.aOffset[this.id];
        };
        TrackSideObject.prototype.generatePos = function () {
            var temp = Math.floor(Math.random() * 4);
            if(temp == 0) {
                this.trackX = Math.random() * 1000 - 100;
                this.trackY = Math.random() * 150 - 100;
            } else if(temp == 1) {
                this.trackX = Math.random() * 1000 - 100;
                this.trackY = Math.random() * 150 + 750;
            } else if(temp == 2) {
                this.trackX = Math.random() * 150 - 100;
                this.trackY = Math.random() * 1000 - 100;
            } else if(temp == 3) {
                this.trackX = Math.random() * 150 + 750;
                this.trackY = Math.random() * 1000 - 100;
            }
        };
        TrackSideObject.prototype.render = function () {
            var a = userCar.trackX - this.trackX;
            var b = userCar.trackY - this.trackY;
            var hyp = Math.sqrt((a * a) + (b * b));
            this.angleToUserCar = -(track.rotation + 225 * radian) + (Math.atan2(b, a) + 0 * radian);
            this.viewOffsetX = (hyp * Math.cos(this.angleToUserCar)) * track.trackScaleX;
            this.viewOffsetY = (hyp * Math.sin(this.angleToUserCar)) * track.trackScaleY;
            this.x = canvas.width / 2 - track.viewOffsetX + this.viewOffsetX;
            this.y = canvas.height / 2 - track.viewOffsetY + this.viewOffsetY;
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["trackSideObject" + this.id]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["trackSideObject" + this.id]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["trackSideObject" + this.id]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["trackSideObject" + this.id]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - bWidth / 2, this.y - bHeight + this.offsetY, bWidth, bHeight);
        };
        return TrackSideObject;
    })();
    Elements.TrackSideObject = TrackSideObject;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Firework = (function (_super) {
        __extends(Firework, _super);
        function Firework() {
                _super.call(this, assetLib.getData("firework0"), 30, 30, "explode");
            this.vy = 0;
            this.setAnimType("once", "explode");
            this.animEndedFunc = function () {
                this.removeMe = true;
            };
            TweenLite.to(this, 1, {
                scaleX: 2,
                scaleY: 2,
                ease: "Quad.easeOut"
            });
        }
        Firework.prototype.update = function (_trackX, _trackY) {
            this.vy += 150 * delta;
            this.y += this.vy * delta;
            _super.prototype.updateAnimation.call(this, delta);
        };
        Firework.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return Firework;
    })(Utils.AnimSprite);
    Elements.Firework = Firework;    
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var Physics2D = (function () {
        function Physics2D(_aLines, _aBalls) {
            this.aLines = new Array();
            this.aBalls = new Array();
            this.aLines = _aLines;
            this.aBalls = _aBalls.slice(0);
            for(var i = 0; i < this.aLines.length; i++) {
                this.updateVector(this.aLines[i], null, true);
            }
        }
        Physics2D.prototype.drawAll = function (_delta) {
            for(var i = 0; i < this.aBalls.length; i++) {
                var v = this.aBalls[i];
                v.trackX = v.p1.x;
                v.trackY = v.p1.y;
                v.p0 = v.p1;
                this.updateVector(v, _delta);
            }
        };
        Physics2D.prototype.update = function (_delta) {
            var i;
            for(i = 0; i < this.aBalls.length; i++) {
                var ob = this.aBalls[i];
                this.updateVector(ob, _delta);
                for(var k = 0; k < this.aLines.length; k++) {
                    this.fi = this.findIntersection(ob, this.aLines[k]);
                    this.updateVector(this.fi, _delta, false);
                    var pen2 = ob.radius - this.fi.len;
                    if(pen2 >= 0) {
                        ob.hitWall();
                        playSound("wall" + Math.ceil(Math.random() * 2));
                        ob.p1.x += this.fi.dx * pen2;
                        ob.p1.y += this.fi.dy * pen2;
                        var vbounce = {
                            dx: this.fi.lx,
                            dy: this.fi.ly,
                            lx: this.fi.dx,
                            ly: this.fi.dy,
                            b: 1,
                            f: 1
                        };
                        var vb = this.bounce(ob, vbounce);
                        ob.vx = vb.vx;
                        ob.vy = vb.vy;
                    }
                }
            }
            this.drawAll(_delta);
        };
        Physics2D.prototype.updateVector = function (v, _delta, frompoints) {
            if (typeof frompoints === "undefined") { frompoints = false; }
            if(_delta == null) {
                _delta = 0.016;
            }
            if(frompoints == true) {
                v.vx = v.p1.x - v.p0.x;
                v.vy = v.p1.y - v.p0.y;
            } else {
                v.p1.x = v.p0.x + (v.vx * 60) * _delta;
                v.p1.y = v.p0.y + (v.vy * 60) * _delta;
            }
            this.makeVector(v);
        };
        Physics2D.prototype.makeVector = function (v) {
            v.len = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
            if(v.len > 0) {
                v.dx = v.vx / v.len;
                v.dy = v.vy / v.len;
            } else {
                v.dx = 0;
                v.dy = 0;
            }
            v.rx = -v.dy;
            v.ry = v.dx;
            v.lx = v.dy;
            v.ly = -v.dx;
        };
        Physics2D.prototype.dotP = function (v1, v2) {
            var dp = v1.vx * v2.vx + v1.vy * v2.vy;
            return dp;
        };
        Physics2D.prototype.projectVector = function (v1, dx, dy) {
            var dp = v1.vx * dx + v1.vy * dy;
            var proj = {
            };
            proj.vx = dp * dx;
            proj.vy = dp * dy;
            return proj;
        };
        Physics2D.prototype.bounceBalls = function (v1, v2, v) {
            var proj11 = this.projectVector(v1, v.dx, v.dy);
            var proj12 = this.projectVector(v1, v.lx, v.ly);
            var proj21 = this.projectVector(v2, v.dx, v.dy);
            var proj22 = this.projectVector(v2, v.lx, v.ly);
            var P = v1.m * proj11.vx + v2.m * proj21.vx;
            var V = proj11.vx - proj21.vx;
            var v2fx = (P + V * v1.m) / (v1.m + v2.m);
            var v1fx = v2fx - V;
            P = v1.m * proj11.vy + v2.m * proj21.vy;
            V = proj11.vy - proj21.vy;
            var v2fy = (P + V * v1.m) / (v1.m + v2.m);
            var v1fy = v2fy - V;
            var proj = {
            };
            proj.vx1 = proj12.vx + v1fx;
            proj.vy1 = proj12.vy + v1fy;
            proj.vx2 = proj22.vx + v2fx;
            proj.vy2 = proj22.vy + v2fy;
            return proj;
        };
        Physics2D.prototype.bounce = function (curOb, v2) {
            var proj1 = this.projectVector(curOb, v2.dx, v2.dy);
            var proj2 = this.projectVector(curOb, v2.lx, v2.ly);
            var proj = {
            };
            proj2.len = Math.sqrt(proj2.vx * proj2.vx + proj2.vy * proj2.vy);
            proj2.vx = v2.lx * proj2.len;
            proj2.vy = v2.ly * proj2.len;
            proj.vx = curOb.f * v2.f * proj1.vx + curOb.b * v2.b * proj2.vx;
            proj.vy = curOb.f * v2.f * proj1.vy + curOb.b * v2.b * proj2.vy;
            return proj;
        };
        Physics2D.prototype.findIntersection = function (curOb, v2) {
            var v = {
            };
            var v3 = {
            };
            v3.vx = curOb.p1.x - v2.p0.x;
            v3.vy = curOb.p1.y - v2.p0.y;
            var dp = v3.vx * v2.dx + v3.vy * v2.dy;
            if(dp < 0) {
                v = v3;
            } else {
                var v4 = {
                };
                v4.vx = curOb.p1.x - v2.p1.x;
                v4.vy = curOb.p1.y - v2.p1.y;
                dp = v4.vx * v2.dx + v4.vy * v2.dy;
                if(dp > 0) {
                    v = v4;
                } else {
                    v = this.projectVector(v3, v2.lx, v2.ly);
                }
            }
            v.p0 = {
                x: 0,
                y: 0
            };
            v.p1 = {
                x: 0,
                y: 0
            };
            return v;
        };
        return Physics2D;
    })();
    Utils.Physics2D = Physics2D;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var SaveDataHandler = (function () {
        function SaveDataHandler(_saveDataId) {
            this.dataGroupNum = 2;
            this.saveDataId = _saveDataId;
            var testKey = 'test', storage = window.sessionStorage;
            try  {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                this.canStore = true;
            } catch (error) {
                this.canStore = false;
            }
            this.clearData();
            this.setInitialData();
        }
        SaveDataHandler.prototype.clearData = function () {
            this.aLevelStore = new Array();
            this.aLevelStore.push(0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
            this.aLevelStore.push(0, 0, 0, 0, 0, 0);
        };
        SaveDataHandler.prototype.resetData = function () {
            this.clearData();
            this.saveData();
        };
        SaveDataHandler.prototype.setInitialData = function () {
            if(this.canStore && typeof (Storage) !== "undefined") {
                if(localStorage.getItem(this.saveDataId) != null && localStorage.getItem(this.saveDataId) != "") {
                    this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
                    for(var a in this.aLevelStore) {
                        this.aLevelStore[a] = parseInt(this.aLevelStore[a]);
                    }
                } else {
                    this.saveData();
                }
            }
        };
        SaveDataHandler.prototype.setData = function () {
            this.aLevelStore[0] = curCash;
            for(var i = 0; i < 14; i++) {
                for(var j = 0; j < 6; j++) {
                    this.aLevelStore[31 + (i * 6) + j] = aLevelResultData[i][j];
                }
            }
            for(var i = 0; i < 6; i++) {
                for(var j = 0; j < 5; j++) {
                    this.aLevelStore[1 + (i * 5) + j] = aUserCarData[i][j];
                }
            }
        };
        SaveDataHandler.prototype.saveData = function () {
            if(this.canStore && typeof (Storage) !== "undefined") {
                var str = "";
                for(var i = 0; i < this.aLevelStore.length; i++) {
                    str += this.aLevelStore[i];
                    if(i < this.aLevelStore.length - 1) {
                        str += ",";
                    }
                }
                localStorage.setItem(this.saveDataId, str);
            }
        };
        return SaveDataHandler;
    })();
    Utils.SaveDataHandler = SaveDataHandler;    
})(Utils || (Utils = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame || (window).oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
var previousTime;
var hiddenCanvas = document.createElement('canvas');
var hiddenCtx = hiddenCanvas.getContext('2d');
hiddenCanvas.width = 500;
hiddenCanvas.height = 500;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var minSquareSize = 500;
var maxSquareSize = 700;
var canvasX;
var canvasY;
var canvasScale;
var div = document.getElementById('canvas-wrapper');
var sound;
var music;
var audioType = 0;
var muted = false;
var splashTimer = 0;
var assetLib;
var preAssetLib;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var saveDataHandler = new Utils.SaveDataHandler("driftcupracingv3");
var curLang = "";
var isBugBrowser = false;
var isIE10 = false;
var delta;
var radian = Math.PI / 180;
var ios9FirstTouch = false;
var hasFocus = true;
if(navigator.userAgent.match(/MSIE\s([\d]+)/)) {
    isIE10 = true;
}
var deviceAgent = navigator.userAgent.toLowerCase();
if(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) {
    isMobile = true;
    if(deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
var forcePause = false;
function visibleResume() {
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(forcePause) {
            butEventHandler("resumeGameFromPause");
            forcePause = false;
        } else if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
}
function visiblePause() {
    hasFocus = false;
    if(gameState == "game" && raceStartState == 2 && isMobile) {
        butEventHandler("pause");
        forcePause = true;
    } else {
        Howler.mute(true);
        music.pause();
    }
}
(window).onpageshow = function () {
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(gameState == "game" && forcePause) {
            butEventHandler("resumeGameFromPause");
            forcePause = false;
        } else if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
};
function playMusic() {
    if(!music.playing()) {
        music.play();
    }
}
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            resizeCanvas();
        }, 500);
        setTimeout(function () {
            resizeCanvas();
        }, 2000);
    }, false);
});
function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && parseFloat(matches[1]) < 537;
}
var ua = navigator.userAgent;
var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();
if(!isIE10 && !isSharpStock && !isXperiaAStock && !isFujitsuStock && (typeof (window).AudioContext !== 'undefined' || typeof (window).webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1)) {
    audioType = 1;
    sound = new Howl({
        src: [
            'audio/sound.ogg', 
            'audio/sound.m4a'
        ],
        sprite: {
            silence: [
                2300, 
                10
            ],
            boost: [
                0, 
                2100
            ],
            buy: [
                2500, 
                1000
            ],
            click: [
                5000, 
                500
            ],
            startCar: [
                6000, 
                2000
            ],
            getaway: [
                8500, 
                4500
            ],
            rev0: [
                13500, 
                2000
            ],
            rev1: [
                16000, 
                2000
            ],
            beep0: [
                18500, 
                750
            ],
            beep1: [
                19500, 
                750
            ],
            skid0: [
                21000, 
                1500
            ],
            skid1: [
                23000, 
                2000
            ],
            skid2: [
                25500, 
                2000
            ],
            thud0: [
                28000, 
                1000
            ],
            thud1: [
                29500, 
                1000
            ],
            thud2: [
                31000, 
                1000
            ],
            thud3: [
                32500, 
                1000
            ],
            engine0: [
                34000, 
                6500
            ],
            engine1: [
                41000, 
                6500
            ],
            engine2: [
                48000, 
                6500
            ],
            splash: [
                54500, 
                1100
            ],
            newCar: [
                56000, 
                1000
            ],
            endRace: [
                57500, 
                2900
            ],
            firework: [
                60500, 
                1500
            ]
        }
    });
    music = new Howl({
        src: [
            'audio/music.ogg', 
            'audio/music.m4a'
        ],
        volume: 0,
        loop: true
    });
} else {
    audioType = 0;
}
var panel;
var background;
var levelNum = 0;
var panelFrame;
var musicTween;
var oImageIds = {
};
var track;
var userCar;
var physics2D;
var aCars;
var steerPower;
var steerPowerTarg;
var aTrees;
var leftSteer = 0;
var rightSteer = 0;
var carInPlay = true;
var aDirMarkers;
var aDeltaStore;
var deltaInc;
var trackReversed;
var hud;
var oFinishLine;
var gameTime;
var aTrackSideObjects;
var sortFlipFlop = true;
var aTrackTriggers;
var aEffects;
var curCar = 0;
var totalLevels = 14;
var curLevelAll = 0;
var aEnemyCarTypes;
var aCarYOffset = new Array(-1, -5, 0, 0, -3, -1);
var aLevelResultData;
var aUserCarData;
var curCash = 0;
var raceStartState;
var firstRun = false;
var curWinnings = 0;
var raceEndPosition;
var wonBonusCar;
var timerInc = 0;
var aUpgradeCosts = new Array([
    300, 
    450, 
    600, 
    850, 
    1000
], [
    300, 
    450, 
    600, 
    850, 
    1000
], [
    300, 
    450, 
    600, 
    850, 
    1000
], [
    300, 
    450, 
    600, 
    850, 
    1000
], [
    300, 
    450, 
    600, 
    850, 
    1000
], [
    300, 
    450, 
    600, 
    850, 
    1000
]);
var aLapData = new Array(2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5);
var aWinningsData = new Array(1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000);
var aStatData = new Array("maxSpeed", "groundFriction", "accRate", "steerDamper");
var aStoredCarData = new Array({
    maxSpeed: 1.5,
    groundFriction: 2.3,
    accRate: 1.5,
    steerRate: .3,
    steerDamper: 5,
    steerReaction: 10
}, {
    maxSpeed: 1.6,
    groundFriction: 1.9,
    accRate: 1.6,
    steerRate: .29,
    steerDamper: 3,
    steerReaction: 10
}, {
    maxSpeed: 1.45,
    groundFriction: 2.5,
    accRate: 1.8,
    steerRate: .28,
    steerDamper: 5,
    steerReaction: 10
}, {
    maxSpeed: 1.65,
    groundFriction: 1.6,
    accRate: 1.7,
    steerRate: .26,
    steerDamper: 2.7,
    steerReaction: 7
}, {
    maxSpeed: 1.7,
    groundFriction: 1.7,
    accRate: 1.9,
    steerRate: .27,
    steerDamper: 3,
    steerReaction: 8
}, {
    maxSpeed: 1.6,
    groundFriction: 2.2,
    accRate: 1.8,
    steerRate: .29,
    steerDamper: 3.5,
    steerReaction: 10
});
var aCarData = new Array();
var aCarUpgradeData = new Array({
    maxSpeed: 1.7,
    groundFriction: 2.6,
    accRate: 1.6,
    steerDamper: 7,
    steerRate: .2
}, {
    maxSpeed: 1.8,
    groundFriction: 2.2,
    accRate: 1.9,
    steerDamper: 5,
    steerRate: .19
}, {
    maxSpeed: 1.65,
    groundFriction: 3.1,
    accRate: 2.1,
    steerDamper: 7,
    steerRate: .18
}, {
    maxSpeed: 1.85,
    groundFriction: 1.9,
    accRate: 2.0,
    steerDamper: 4.7,
    steerRate: .16
}, {
    maxSpeed: 1.9,
    groundFriction: 2.0,
    accRate: 2.2,
    steerDamper: 5,
    steerRate: .17
}, {
    maxSpeed: 1.8,
    groundFriction: 2.5,
    accRate: 2.1,
    steerDamper: 5.5,
    steerRate: .19
});
var aLevelData = new Array({
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 672,
                y: 368
            },
            p1: {
                x: 1.57810510609051,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 670,
                y: 254
            },
            p1: {
                x: 1.57810510609051,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 639,
                y: 165
            },
            p1: {
                x: 1.220735785728886,
                y: 1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 566,
                y: 121
            },
            p1: {
                x: 0.5749650277554201,
                y: 2
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 452,
                y: 110
            },
            p1: {
                x: -0.01434218773451273,
                y: 4
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 366,
                y: 166
            },
            p1: {
                x: -0.9214143223832832,
                y: 5
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 671,
                y: 440
            },
            p1: {
                x: -1.563487547499283,
                y: 41
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 673,
                y: 545
            },
            p1: {
                x: -1.563487547499283,
                y: 41
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 665,
                y: 659
            },
            p1: {
                x: -1.2451415265905903,
                y: 39
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 558,
                y: 664
            },
            p1: {
                x: 0.46870063920351446,
                y: 37
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 462,
                y: 602
            },
            p1: {
                x: 0.44739242100568144,
                y: 36
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 367,
                y: 598
            },
            p1: {
                x: -0.32778985645022285,
                y: 35
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 379,
                y: 644
            },
            p1: {
                x: 379,
                y: 644
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 463,
                y: 646
            },
            p1: {
                x: 463,
                y: 646
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 442,
                y: 642
            },
            p1: {
                x: 442,
                y: 642
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 401,
                y: 641
            },
            p1: {
                x: 401,
                y: 641
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 423,
                y: 641
            },
            p1: {
                x: 423,
                y: 641
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 224,
                y: 619
            },
            p1: {
                x: 224,
                y: 619
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 206,
                y: 617
            },
            p1: {
                x: 206,
                y: 617
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 201,
                y: 599
            },
            p1: {
                x: 201,
                y: 599
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 206,
                y: 581
            },
            p1: {
                x: 206,
                y: 581
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 217,
                y: 565
            },
            p1: {
                x: 217,
                y: 565
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 240,
                y: 608
            },
            p1: {
                x: 240,
                y: 608
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 498,
                y: 339
            },
            p1: {
                x: 498,
                y: 339
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 310,
                y: 167
            },
            p1: {
                x: 310,
                y: 167
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 309,
                y: 185
            },
            p1: {
                x: 309,
                y: 185
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 310,
                y: 204
            },
            p1: {
                x: 310,
                y: 204
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 204,
                y: 258
            },
            p1: {
                x: 204,
                y: 258
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 202,
                y: 240
            },
            p1: {
                x: 202,
                y: 240
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 200,
                y: 220
            },
            p1: {
                x: 200,
                y: 220
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 760,
                y: 391
            },
            p1: {
                x: 760,
                y: 391
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 447,
                y: 178
            },
            p1: {
                x: 447,
                y: 178
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 425,
                y: 188
            },
            p1: {
                x: 425,
                y: 188
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 408,
                y: 203
            },
            p1: {
                x: 408,
                y: 203
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 605,
                y: 598
            },
            p1: {
                x: 605,
                y: 598
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 611,
                y: 618
            },
            p1: {
                x: 611,
                y: 618
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 499,
                y: 318
            },
            p1: {
                x: 499,
                y: 318
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 500,
                y: 298
            },
            p1: {
                x: 500,
                y: 298
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 496,
                y: 396
            },
            p1: {
                x: 496,
                y: 396
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 51,
                y: 262
            },
            p1: {
                x: 51,
                y: 262
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 55,
                y: 564
            },
            p1: {
                x: 55,
                y: 564
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 621,
                y: 61
            },
            p1: {
                x: 621,
                y: 61
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 309,
                y: 99
            },
            p1: {
                x: 309,
                y: 99
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 720,
                y: 123
            },
            p1: {
                x: 720,
                y: 123
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 132,
                y: 71
            },
            p1: {
                x: 132,
                y: 71
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 467,
                y: 690
            },
            p1: {
                x: 467,
                y: 690
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 751,
                y: 515
            },
            p1: {
                x: 751,
                y: 515
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 365,
                y: 679
            },
            p1: {
                x: 365,
                y: 679
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 243,
                y: 580
            },
            p1: {
                x: 243,
                y: 580
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 82,
                y: 723
            },
            p1: {
                x: 82,
                y: 723
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 353,
                y: 332
            },
            p1: {
                x: 353,
                y: 332
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 586,
                y: 198
            },
            p1: {
                x: 586,
                y: 198
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 593,
                y: 559
            },
            p1: {
                x: 593,
                y: 559
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 217,
                y: 308
            },
            p1: {
                x: 217,
                y: 308
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 716,
                y: 721
            },
            p1: {
                x: 716,
                y: 721
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 201,
                y: 435
            },
            p1: {
                x: 201,
                y: 435
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 177,
                y: 623
            },
            p1: {
                x: 177,
                y: 623
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 498,
                y: 429
            },
            p1: {
                x: 498,
                y: 429
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 268,
                y: 343
            },
            p1: {
                x: 268,
                y: 343
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 670,
                y: 545
            },
            p1: {
                x: 670,
                y: 545
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 670,
                y: 264
            },
            p1: {
                x: 670,
                y: 264
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 668,
                y: 652
            },
            p1: {
                x: 0,
                y: 652
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 668,
                y: 152
            },
            p1: {
                x: 0,
                y: 152
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 677,
                y: 342
            },
            p1: {
                x: 677,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 678,
                y: 473
            },
            p1: {
                x: 678,
                y: 40
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 674,
                y: 561
            },
            p1: {
                x: 674,
                y: 39
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 664,
                y: 636
            },
            p1: {
                x: 664,
                y: 38
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 610,
                y: 673
            },
            p1: {
                x: 610,
                y: 37
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 534,
                y: 644
            },
            p1: {
                x: 534,
                y: 36
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 474,
                y: 605
            },
            p1: {
                x: 474,
                y: 35
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 399,
                y: 597
            },
            p1: {
                x: 399,
                y: 34
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 325,
                y: 614
            },
            p1: {
                x: 325,
                y: 33
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 262,
                y: 656
            },
            p1: {
                x: 262,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 202,
                y: 670
            },
            p1: {
                x: 202,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 152,
                y: 630
            },
            p1: {
                x: 152,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 153,
                y: 559
            },
            p1: {
                x: 153,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 209,
                y: 509
            },
            p1: {
                x: 209,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 282,
                y: 493
            },
            p1: {
                x: 282,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 355,
                y: 488
            },
            p1: {
                x: 355,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 428,
                y: 485
            },
            p1: {
                x: 428,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 500,
                y: 477
            },
            p1: {
                x: 500,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 550,
                y: 425
            },
            p1: {
                x: 550,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 563,
                y: 351
            },
            p1: {
                x: 563,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 561,
                y: 279
            },
            p1: {
                x: 561,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 502,
                y: 238
            },
            p1: {
                x: 502,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 451,
                y: 266
            },
            p1: {
                x: 451,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 429,
                y: 329
            },
            p1: {
                x: 429,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 372,
                y: 377
            },
            p1: {
                x: 372,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 299,
                y: 390
            },
            p1: {
                x: 299,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 155,
                y: 343
            },
            p1: {
                x: 155,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 126,
                y: 273
            },
            p1: {
                x: 126,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 134,
                y: 198
            },
            p1: {
                x: 134,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 164,
                y: 148
            },
            p1: {
                x: 164,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 229,
                y: 151
            },
            p1: {
                x: 229,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 258,
                y: 221
            },
            p1: {
                x: 258,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 307,
                y: 267
            },
            p1: {
                x: 307,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 354,
                y: 218
            },
            p1: {
                x: 354,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 383,
                y: 142
            },
            p1: {
                x: 383,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 451,
                y: 110
            },
            p1: {
                x: 451,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 527,
                y: 110
            },
            p1: {
                x: 527,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 600,
                y: 129
            },
            p1: {
                x: 600,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 652,
                y: 182
            },
            p1: {
                x: 652,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 225,
                y: 376
            },
            p1: {
                x: 225,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 669,
                y: 255
            },
            p1: {
                x: 669,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 611,
                y: 487
            },
            p1: {
                x: 542,
                y: 550
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 665,
                y: 745
            },
            p1: {
                x: 734,
                y: 679
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 540,
                y: 734
            },
            p1: {
                x: 664,
                y: 745
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 490,
                y: 655
            },
            p1: {
                x: 542,
                y: 737
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 445,
                y: 634
            },
            p1: {
                x: 490,
                y: 655
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 382,
                y: 636
            },
            p1: {
                x: 445,
                y: 634
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 336,
                y: 659
            },
            p1: {
                x: 382,
                y: 636
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 296,
                y: 715
            },
            p1: {
                x: 336,
                y: 659
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 215,
                y: 752
            },
            p1: {
                x: 295,
                y: 715
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 89,
                y: 716
            },
            p1: {
                x: 215,
                y: 752
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 61,
                y: 564
            },
            p1: {
                x: 90,
                y: 716
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 141,
                y: 459
            },
            p1: {
                x: 60,
                y: 564
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 332,
                y: 429
            },
            p1: {
                x: 140,
                y: 460
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 220,
                y: 628
            },
            p1: {
                x: 338,
                y: 533
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 200,
                y: 620
            },
            p1: {
                x: 220,
                y: 628
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 194,
                y: 592
            },
            p1: {
                x: 200,
                y: 620
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 214,
                y: 558
            },
            p1: {
                x: 194,
                y: 591
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 280,
                y: 538
            },
            p1: {
                x: 215,
                y: 558
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 394,
                y: 528
            },
            p1: {
                x: 280,
                y: 538
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 508,
                y: 537
            },
            p1: {
                x: 394,
                y: 528
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 576,
                y: 562
            },
            p1: {
                x: 508,
                y: 537
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 613,
                y: 625
            },
            p1: {
                x: 575,
                y: 561
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 607,
                y: 215
            },
            p1: {
                x: 613,
                y: 626
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 595,
                y: 187
            },
            p1: {
                x: 607,
                y: 215
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 528,
                y: 169
            },
            p1: {
                x: 595,
                y: 187
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 442,
                y: 175
            },
            p1: {
                x: 527,
                y: 169
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 411,
                y: 197
            },
            p1: {
                x: 442,
                y: 175
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 386,
                y: 313
            },
            p1: {
                x: 411,
                y: 197
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 350,
                y: 333
            },
            p1: {
                x: 386,
                y: 313
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 243,
                y: 323
            },
            p1: {
                x: 350,
                y: 333
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 210,
                y: 306
            },
            p1: {
                x: 243,
                y: 323
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 200,
                y: 221
            },
            p1: {
                x: 210,
                y: 305
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 493,
                y: 398
            },
            p1: {
                x: 501,
                y: 292
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 438,
                y: 427
            },
            p1: {
                x: 492,
                y: 400
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 432
            },
            p1: {
                x: 437,
                y: 426
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 105,
                y: 388
            },
            p1: {
                x: 235,
                y: 431
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 73,
                y: 277
            },
            p1: {
                x: 104,
                y: 387
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 80,
                y: 152
            },
            p1: {
                x: 73,
                y: 277
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 104,
                y: 100
            },
            p1: {
                x: 80,
                y: 153
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 159,
                y: 70
            },
            p1: {
                x: 104,
                y: 100
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 271,
                y: 74
            },
            p1: {
                x: 159,
                y: 71
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 309,
                y: 115
            },
            p1: {
                x: 270,
                y: 73
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 308,
                y: 116
            },
            p1: {
                x: 310,
                y: 209
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 328,
                y: 84
            },
            p1: {
                x: 308,
                y: 116
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 392,
                y: 53
            },
            p1: {
                x: 329,
                y: 83
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 500,
                y: 48
            },
            p1: {
                x: 392,
                y: 52
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 634,
                y: 78
            },
            p1: {
                x: 500,
                y: 48
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 705,
                y: 123
            },
            p1: {
                x: 633,
                y: 78
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 730,
                y: 174
            },
            p1: {
                x: 705,
                y: 123
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 731,
                y: 688
            },
            p1: {
                x: 729,
                y: 163
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 519,
                y: 438
            },
            p1: {
                x: 1.57810510609051,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 517,
                y: 355
            },
            p1: {
                x: 1.57810510609051,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 516,
                y: 262
            },
            p1: {
                x: 1.57810510609051,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 523,
                y: 162
            },
            p1: {
                x: 1.57810510609051,
                y: 2
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 612,
                y: 131
            },
            p1: {
                x: -2.743525438081796,
                y: 4
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 646,
                y: 226
            },
            p1: {
                x: -1.5923689968889745,
                y: 5
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 513,
                y: 509
            },
            p1: {
                x: -1.3894017670468746,
                y: 35
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 440,
                y: 558
            },
            p1: {
                x: -0.006744189144516663,
                y: 34
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 368,
                y: 432
            },
            p1: {
                x: 1.5736954439575568,
                y: 32
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 373,
                y: 510
            },
            p1: {
                x: 1.44770342331478,
                y: 33
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 372,
                y: 345
            },
            p1: {
                x: 1.6259011244902712,
                y: 31
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 374,
                y: 259
            },
            p1: {
                x: 1.5735886511978447,
                y: 29
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 234,
                y: 187
            },
            p1: {
                x: 234,
                y: 187
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 214,
                y: 185
            },
            p1: {
                x: 214,
                y: 185
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 191,
                y: 182
            },
            p1: {
                x: 191,
                y: 182
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 581,
                y: 247
            },
            p1: {
                x: 581,
                y: 247
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 581,
                y: 222
            },
            p1: {
                x: 581,
                y: 222
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 581,
                y: 201
            },
            p1: {
                x: 581,
                y: 201
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 443,
                y: 445
            },
            p1: {
                x: 443,
                y: 445
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 443,
                y: 469
            },
            p1: {
                x: 443,
                y: 469
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 443,
                y: 492
            },
            p1: {
                x: 443,
                y: 492
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 190,
                y: 281
            },
            p1: {
                x: 190,
                y: 281
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 213,
                y: 280
            },
            p1: {
                x: 213,
                y: 280
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 513,
                y: 64
            },
            p1: {
                x: 513,
                y: 64
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 705,
                y: 80
            },
            p1: {
                x: 705,
                y: 80
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 731,
                y: 232
            },
            p1: {
                x: 731,
                y: 232
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 734,
                y: 409
            },
            p1: {
                x: 734,
                y: 409
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 740,
                y: 582
            },
            p1: {
                x: 740,
                y: 582
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 640,
                y: 736
            },
            p1: {
                x: 640,
                y: 736
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 396,
                y: 758
            },
            p1: {
                x: 396,
                y: 758
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 170,
                y: 704
            },
            p1: {
                x: 170,
                y: 704
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 62,
                y: 547
            },
            p1: {
                x: 62,
                y: 547
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 75,
                y: 394
            },
            p1: {
                x: 75,
                y: 394
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 71,
                y: 155
            },
            p1: {
                x: 71,
                y: 155
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 217,
                y: 64
            },
            p1: {
                x: 217,
                y: 64
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 380,
                y: 105
            },
            p1: {
                x: 380,
                y: 105
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 282,
                y: 456
            },
            p1: {
                x: 282,
                y: 456
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 245,
                y: 508
            },
            p1: {
                x: 245,
                y: 508
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 240,
                y: 422
            },
            p1: {
                x: 240,
                y: 422
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 440,
                y: 230
            },
            p1: {
                x: 440,
                y: 230
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 442,
                y: 355
            },
            p1: {
                x: 442,
                y: 355
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 314,
                y: 294
            },
            p1: {
                x: 314,
                y: 294
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 296,
                y: 218
            },
            p1: {
                x: 296,
                y: 218
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 298,
                y: 553
            },
            p1: {
                x: 298,
                y: 553
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 443,
                y: 603
            },
            p1: {
                x: 443,
                y: 603
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 568,
                y: 558
            },
            p1: {
                x: 568,
                y: 558
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 580,
                y: 457
            },
            p1: {
                x: 580,
                y: 457
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 580,
                y: 337
            },
            p1: {
                x: 580,
                y: 337
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 472,
                y: 713
            },
            p1: {
                x: 472,
                y: 713
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 555,
                y: 610
            },
            p1: {
                x: 555,
                y: 610
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 245,
                y: 572
            },
            p1: {
                x: 245,
                y: 572
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 699,
                y: 643
            },
            p1: {
                x: 699,
                y: 643
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 410,
                y: 177
            },
            p1: {
                x: 410,
                y: 177
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 306,
                y: 660
            },
            p1: {
                x: 306,
                y: 660
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 650,
                y: 314
            },
            p1: {
                x: 650,
                y: 314
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 516,
                y: 719
            },
            p1: {
                x: 0,
                y: 719
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 518,
                y: 218
            },
            p1: {
                x: 0,
                y: 218
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 523,
                y: 434
            },
            p1: {
                x: 523,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 501,
                y: 558
            },
            p1: {
                x: 501,
                y: 34
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 414,
                y: 562
            },
            p1: {
                x: 414,
                y: 33
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 366,
                y: 518
            },
            p1: {
                x: 366,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 361,
                y: 451
            },
            p1: {
                x: 361,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 375,
                y: 376
            },
            p1: {
                x: 375,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 370,
                y: 299
            },
            p1: {
                x: 370,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 360,
                y: 226
            },
            p1: {
                x: 360,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 322,
                y: 155
            },
            p1: {
                x: 322,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 255,
                y: 117
            },
            p1: {
                x: 255,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 181,
                y: 128
            },
            p1: {
                x: 181,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 138,
                y: 182
            },
            p1: {
                x: 138,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 193,
                y: 235
            },
            p1: {
                x: 193,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 255,
                y: 255
            },
            p1: {
                x: 255,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 246,
                y: 324
            },
            p1: {
                x: 246,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 185,
                y: 364
            },
            p1: {
                x: 185,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 146,
                y: 427
            },
            p1: {
                x: 146,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 147,
                y: 495
            },
            p1: {
                x: 147,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 170,
                y: 563
            },
            p1: {
                x: 170,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 217,
                y: 628
            },
            p1: {
                x: 217,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 355,
                y: 670
            },
            p1: {
                x: 355,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 433,
                y: 674
            },
            p1: {
                x: 433,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 504,
                y: 669
            },
            p1: {
                x: 504,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 581,
                y: 664
            },
            p1: {
                x: 581,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 635,
                y: 618
            },
            p1: {
                x: 635,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 650,
                y: 548
            },
            p1: {
                x: 650,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 655,
                y: 467
            },
            p1: {
                x: 655,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 652,
                y: 366
            },
            p1: {
                x: 652,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 647,
                y: 265
            },
            p1: {
                x: 647,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 643,
                y: 165
            },
            p1: {
                x: 643,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 558,
                y: 134
            },
            p1: {
                x: 558,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 520,
                y: 202
            },
            p1: {
                x: 520,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 516,
                y: 280
            },
            p1: {
                x: 516,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 289,
                y: 657
            },
            p1: {
                x: 289,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 523,
                y: 359
            },
            p1: {
                x: 523,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 219,
                y: 410
            },
            p1: {
                x: 306,
                y: 350
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 217,
                y: 484
            },
            p1: {
                x: 218,
                y: 410
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 254,
                y: 542
            },
            p1: {
                x: 217,
                y: 484
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 328,
                y: 584
            },
            p1: {
                x: 255,
                y: 543
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 577,
                y: 535
            },
            p1: {
                x: 581,
                y: 197
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 557,
                y: 577
            },
            p1: {
                x: 577,
                y: 535
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 506,
                y: 601
            },
            p1: {
                x: 557,
                y: 577
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 420,
                y: 604
            },
            p1: {
                x: 505,
                y: 601
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 329,
                y: 584
            },
            p1: {
                x: 419,
                y: 604
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 290,
                y: 510
            },
            p1: {
                x: 329,
                y: 584
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 310,
                y: 332
            },
            p1: {
                x: 290,
                y: 509
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 312,
                y: 282
            },
            p1: {
                x: 310,
                y: 332
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 307,
                y: 236
            },
            p1: {
                x: 313,
                y: 283
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 291,
                y: 205
            },
            p1: {
                x: 307,
                y: 235
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 260,
                y: 191
            },
            p1: {
                x: 291,
                y: 205
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 190,
                y: 182
            },
            p1: {
                x: 261,
                y: 191
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 521,
                y: 59
            },
            p1: {
                x: 439,
                y: 164
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 646,
                y: 58
            },
            p1: {
                x: 513,
                y: 67
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 723,
                y: 100
            },
            p1: {
                x: 646,
                y: 57
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 731,
                y: 649
            },
            p1: {
                x: 723,
                y: 101
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 682,
                y: 706
            },
            p1: {
                x: 731,
                y: 648
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 596,
                y: 741
            },
            p1: {
                x: 682,
                y: 707
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 303,
                y: 748
            },
            p1: {
                x: 596,
                y: 741
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 177,
                y: 695
            },
            p1: {
                x: 302,
                y: 748
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 83,
                y: 582
            },
            p1: {
                x: 177,
                y: 696
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 66,
                y: 467
            },
            p1: {
                x: 83,
                y: 581
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 110,
                y: 278
            },
            p1: {
                x: 65,
                y: 467
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 118,
                y: 282
            },
            p1: {
                x: 215,
                y: 280
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 64,
                y: 221
            },
            p1: {
                x: 118,
                y: 283
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 89,
                y: 122
            },
            p1: {
                x: 64,
                y: 221
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 176,
                y: 68
            },
            p1: {
                x: 89,
                y: 123
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 341,
                y: 81
            },
            p1: {
                x: 176,
                y: 67
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 439,
                y: 164
            },
            p1: {
                x: 343,
                y: 83
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 443,
                y: 495
            },
            p1: {
                x: 439,
                y: 165
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 385,
                y: 131
            },
            p1: {
                x: 0.020474382460529184,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 281,
                y: 151
            },
            p1: {
                x: -0.34109128083073265,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 214,
                y: 197
            },
            p1: {
                x: -0.6770623681496789,
                y: 1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 163,
                y: 266
            },
            p1: {
                x: -0.9593662321296754,
                y: 2
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 129,
                y: 353
            },
            p1: {
                x: -1.2741513403448235,
                y: 3
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 117,
                y: 439
            },
            p1: {
                x: -1.4406013053197568,
                y: 4
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 462,
                y: 127
            },
            p1: {
                x: -3.121118271129264,
                y: 33
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 568,
                y: 158
            },
            p1: {
                x: -2.6501933597833154,
                y: 32
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 623,
                y: 216
            },
            p1: {
                x: -2.1307994492301425,
                y: 31
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 661,
                y: 287
            },
            p1: {
                x: -1.9488219235195021,
                y: 30
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 685,
                y: 364
            },
            p1: {
                x: -1.7380276632336593,
                y: 30
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 693,
                y: 450
            },
            p1: {
                x: -1.5793714391888427,
                y: 29
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 216,
                y: 578
            },
            p1: {
                x: 216,
                y: 578
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 176,
                y: 573
            },
            p1: {
                x: 176,
                y: 573
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 209,
                y: 600
            },
            p1: {
                x: 209,
                y: 600
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 180,
                y: 598
            },
            p1: {
                x: 180,
                y: 598
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 192,
                y: 617
            },
            p1: {
                x: 192,
                y: 617
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 623,
                y: 583
            },
            p1: {
                x: 623,
                y: 583
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 592,
                y: 582
            },
            p1: {
                x: 592,
                y: 582
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 623,
                y: 603
            },
            p1: {
                x: 623,
                y: 603
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 600,
                y: 603
            },
            p1: {
                x: 600,
                y: 603
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 612,
                y: 625
            },
            p1: {
                x: 612,
                y: 625
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 421,
                y: 383
            },
            p1: {
                x: 421,
                y: 383
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 419,
                y: 358
            },
            p1: {
                x: 419,
                y: 358
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 417,
                y: 333
            },
            p1: {
                x: 417,
                y: 333
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 681,
                y: 65
            },
            p1: {
                x: 681,
                y: 65
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 749,
                y: 90
            },
            p1: {
                x: 749,
                y: 90
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 614,
                y: 62
            },
            p1: {
                x: 614,
                y: 62
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 739,
                y: 182
            },
            p1: {
                x: 739,
                y: 182
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 602,
                y: 497
            },
            p1: {
                x: 602,
                y: 497
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 581,
                y: 310
            },
            p1: {
                x: 581,
                y: 310
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 563,
                y: 249
            },
            p1: {
                x: 563,
                y: 249
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 412,
                y: 604
            },
            p1: {
                x: 412,
                y: 604
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 418,
                y: 500
            },
            p1: {
                x: 418,
                y: 500
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 397,
                y: 687
            },
            p1: {
                x: 397,
                y: 687
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 292,
                y: 58
            },
            p1: {
                x: 292,
                y: 58
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 228,
                y: 370
            },
            p1: {
                x: 228,
                y: 370
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 206,
                y: 485
            },
            p1: {
                x: 206,
                y: 485
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 267,
                y: 240
            },
            p1: {
                x: 267,
                y: 240
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 183,
                y: 78
            },
            p1: {
                x: 183,
                y: 78
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 95,
                y: 149
            },
            p1: {
                x: 95,
                y: 149
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 97,
                y: 84
            },
            p1: {
                x: 97,
                y: 84
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 62,
                y: 242
            },
            p1: {
                x: 62,
                y: 242
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 506,
                y: 531
            },
            p1: {
                x: 506,
                y: 531
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 311,
                y: 533
            },
            p1: {
                x: 311,
                y: 533
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 104,
                y: 489
            },
            p1: {
                x: 104,
                y: 489
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 415,
                y: 255
            },
            p1: {
                x: 415,
                y: 255
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 691,
                y: 506
            },
            p1: {
                x: 691,
                y: 506
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 676,
                y: 122
            },
            p1: {
                x: -1.5752517952985992,
                y: 122
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 174,
                y: 123
            },
            p1: {
                x: -1.5752517952985992,
                y: 123
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 352,
                y: 136
            },
            p1: {
                x: 352,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 501,
                y: 137
            },
            p1: {
                x: 501,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 585,
                y: 163
            },
            p1: {
                x: 585,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 643,
                y: 230
            },
            p1: {
                x: 643,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 683,
                y: 319
            },
            p1: {
                x: 683,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 700,
                y: 400
            },
            p1: {
                x: 700,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 706,
                y: 488
            },
            p1: {
                x: 706,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 702,
                y: 574
            },
            p1: {
                x: 702,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 673,
                y: 638
            },
            p1: {
                x: 673,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 617,
                y: 673
            },
            p1: {
                x: 617,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 545,
                y: 653
            },
            p1: {
                x: 545,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 513,
                y: 592
            },
            p1: {
                x: 513,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 504,
                y: 518
            },
            p1: {
                x: 504,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 516,
                y: 439
            },
            p1: {
                x: 516,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 517,
                y: 372
            },
            p1: {
                x: 517,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 502,
                y: 297
            },
            p1: {
                x: 502,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 445,
                y: 261
            },
            p1: {
                x: 445,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 373,
                y: 265
            },
            p1: {
                x: 373,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 319,
                y: 400
            },
            p1: {
                x: 319,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 324,
                y: 473
            },
            p1: {
                x: 324,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 311,
                y: 544
            },
            p1: {
                x: 311,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 290,
                y: 610
            },
            p1: {
                x: 290,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 231,
                y: 662
            },
            p1: {
                x: 231,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 160,
                y: 667
            },
            p1: {
                x: 160,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 107,
                y: 618
            },
            p1: {
                x: 107,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 93,
                y: 550
            },
            p1: {
                x: 93,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 92,
                y: 477
            },
            p1: {
                x: 92,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 102,
                y: 400
            },
            p1: {
                x: 102,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 119,
                y: 324
            },
            p1: {
                x: 119,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 155,
                y: 260
            },
            p1: {
                x: 155,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 211,
                y: 200
            },
            p1: {
                x: 211,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 325,
                y: 323
            },
            p1: {
                x: 325,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 282,
                y: 154
            },
            p1: {
                x: 282,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 545,
                y: 253
            },
            p1: {
                x: 473,
                y: 187
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 592,
                y: 586
            },
            p1: {
                x: 545,
                y: 254
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 612,
                y: 627
            },
            p1: {
                x: 593,
                y: 587
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 621,
                y: 612
            },
            p1: {
                x: 612,
                y: 626
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 626,
                y: 519
            },
            p1: {
                x: 622,
                y: 611
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 611,
                y: 316
            },
            p1: {
                x: 626,
                y: 519
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 587,
                y: 241
            },
            p1: {
                x: 611,
                y: 316
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 544,
                y: 200
            },
            p1: {
                x: 587,
                y: 242
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 456,
                y: 184
            },
            p1: {
                x: 545,
                y: 200
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 283,
                y: 254
            },
            p1: {
                x: 336,
                y: 192
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 242,
                y: 498
            },
            p1: {
                x: 282,
                y: 254
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 207,
                y: 606
            },
            p1: {
                x: 241,
                y: 499
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 191,
                y: 619
            },
            p1: {
                x: 207,
                y: 606
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 179,
                y: 602
            },
            p1: {
                x: 191,
                y: 620
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 172,
                y: 527
            },
            p1: {
                x: 180,
                y: 603
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 192,
                y: 344
            },
            p1: {
                x: 172,
                y: 526
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 230,
                y: 247
            },
            p1: {
                x: 191,
                y: 345
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 296,
                y: 201
            },
            p1: {
                x: 231,
                y: 247
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 374,
                y: 183
            },
            p1: {
                x: 296,
                y: 201
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 455,
                y: 184
            },
            p1: {
                x: 375,
                y: 183
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 635,
                y: 90
            },
            p1: {
                x: 567,
                y: 64
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 712,
                y: 174
            },
            p1: {
                x: 634,
                y: 90
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 746,
                y: 323
            },
            p1: {
                x: 713,
                y: 173
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 746,
                y: 654
            },
            p1: {
                x: 746,
                y: 323
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 708,
                y: 715
            },
            p1: {
                x: 746,
                y: 654
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 622,
                y: 749
            },
            p1: {
                x: 708,
                y: 716
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 505,
                y: 709
            },
            p1: {
                x: 622,
                y: 750
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 459,
                y: 594
            },
            p1: {
                x: 505,
                y: 709
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 432,
                y: 365
            },
            p1: {
                x: 459,
                y: 595
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 417,
                y: 330
            },
            p1: {
                x: 432,
                y: 365
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 376,
                y: 556
            },
            p1: {
                x: 416,
                y: 331
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 323,
                y: 672
            },
            p1: {
                x: 375,
                y: 556
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 237,
                y: 737
            },
            p1: {
                x: 322,
                y: 673
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 131,
                y: 746
            },
            p1: {
                x: 237,
                y: 737
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 73,
                y: 712
            },
            p1: {
                x: 129,
                y: 745
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 47,
                y: 622
            },
            p1: {
                x: 72,
                y: 712
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 60,
                y: 327
            },
            p1: {
                x: 47,
                y: 623
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 114,
                y: 172
            },
            p1: {
                x: 60,
                y: 329
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 250,
                y: 79
            },
            p1: {
                x: 114,
                y: 173
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 415,
                y: 56
            },
            p1: {
                x: 251,
                y: 79
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 579,
                y: 69
            },
            p1: {
                x: 413,
                y: 56
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 411,
                y: 713
            },
            p1: {
                x: -3.1342838742941797,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 505,
                y: 710
            },
            p1: {
                x: -3.1342838742941797,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 607,
                y: 697
            },
            p1: {
                x: 3.0743875171655346,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 683,
                y: 656
            },
            p1: {
                x: 1.977248504995008,
                y: 2
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 656,
                y: 572
            },
            p1: {
                x: 0.9971543574690278,
                y: 3
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 559,
                y: 541
            },
            p1: {
                x: 0.4275742414377478,
                y: 4
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 334,
                y: 715
            },
            p1: {
                x: 0.007308779295613461,
                y: 38
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 247,
                y: 713
            },
            p1: {
                x: 0.051468251226871355,
                y: 37
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 168,
                y: 699
            },
            p1: {
                x: 0.2470598564299969,
                y: 37
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 102,
                y: 652
            },
            p1: {
                x: 1.0839390542275489,
                y: 36
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 133,
                y: 591
            },
            p1: {
                x: 2.575294617285927,
                y: 35
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 194,
                y: 552
            },
            p1: {
                x: 2.6694972829447545,
                y: 34
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 193,
                y: 649
            },
            p1: {
                x: 193,
                y: 649
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 183,
                y: 624
            },
            p1: {
                x: 183,
                y: 624
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 168,
                y: 643
            },
            p1: {
                x: 168,
                y: 643
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 618,
                y: 173
            },
            p1: {
                x: 618,
                y: 173
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 640,
                y: 183
            },
            p1: {
                x: 640,
                y: 183
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 636,
                y: 162
            },
            p1: {
                x: 636,
                y: 162
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 562,
                y: 89
            },
            p1: {
                x: 562,
                y: 89
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 538,
                y: 84
            },
            p1: {
                x: 538,
                y: 84
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 551,
                y: 100
            },
            p1: {
                x: 551,
                y: 100
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 463,
                y: 172
            },
            p1: {
                x: 463,
                y: 172
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 457,
                y: 152
            },
            p1: {
                x: 457,
                y: 152
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 451,
                y: 129
            },
            p1: {
                x: 451,
                y: 129
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 360,
                y: 154
            },
            p1: {
                x: 360,
                y: 154
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 359,
                y: 173
            },
            p1: {
                x: 359,
                y: 173
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 359,
                y: 195
            },
            p1: {
                x: 359,
                y: 195
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 233,
                y: 159
            },
            p1: {
                x: 233,
                y: 159
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 260,
                y: 154
            },
            p1: {
                x: 260,
                y: 154
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 244,
                y: 140
            },
            p1: {
                x: 244,
                y: 140
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 266,
                y: 134
            },
            p1: {
                x: 266,
                y: 134
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 589,
                y: 603
            },
            p1: {
                x: 589,
                y: 603
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 604,
                y: 619
            },
            p1: {
                x: 604,
                y: 619
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 596,
                y: 650
            },
            p1: {
                x: 596,
                y: 650
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 614,
                y: 638
            },
            p1: {
                x: 614,
                y: 638
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 731,
                y: 307
            },
            p1: {
                x: 731,
                y: 307
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 576,
                y: 344
            },
            p1: {
                x: 576,
                y: 344
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 158,
                y: 61
            },
            p1: {
                x: 158,
                y: 61
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 103,
                y: 175
            },
            p1: {
                x: 103,
                y: 175
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 370,
                y: 70
            },
            p1: {
                x: 370,
                y: 70
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 743,
                y: 79
            },
            p1: {
                x: 743,
                y: 79
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 612,
                y: 486
            },
            p1: {
                x: 612,
                y: 486
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 660,
                y: 746
            },
            p1: {
                x: 660,
                y: 746
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 477,
                y: 771
            },
            p1: {
                x: 477,
                y: 771
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 69,
                y: 739
            },
            p1: {
                x: 69,
                y: 739
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 238,
                y: 201
            },
            p1: {
                x: 238,
                y: 201
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 612,
                y: 422
            },
            p1: {
                x: 612,
                y: 422
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 177,
                y: 461
            },
            p1: {
                x: 177,
                y: 461
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 141,
                y: 371
            },
            p1: {
                x: 141,
                y: 371
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 426,
                y: 591
            },
            p1: {
                x: 426,
                y: 591
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 390,
                y: 638
            },
            p1: {
                x: 390,
                y: 638
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 460,
                y: 416
            },
            p1: {
                x: 460,
                y: 416
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 373,
                y: 507
            },
            p1: {
                x: 373,
                y: 507
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 267,
                y: 424
            },
            p1: {
                x: 267,
                y: 424
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 361,
                y: 326
            },
            p1: {
                x: 361,
                y: 326
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 477,
                y: 220
            },
            p1: {
                x: 477,
                y: 220
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 520,
                y: 200
            },
            p1: {
                x: 520,
                y: 200
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 252,
                y: 250
            },
            p1: {
                x: 252,
                y: 250
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 328,
                y: 526
            },
            p1: {
                x: 328,
                y: 526
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 310,
                y: 268
            },
            p1: {
                x: 310,
                y: 268
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 127,
                y: 218
            },
            p1: {
                x: 127,
                y: 218
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 510,
                y: 530
            },
            p1: {
                x: 510,
                y: 530
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 239,
                y: 531
            },
            p1: {
                x: 239,
                y: 531
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 478,
                y: 314
            },
            p1: {
                x: 478,
                y: 314
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 241,
                y: 313
            },
            p1: {
                x: 241,
                y: 313
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 128,
                y: 709
            },
            p1: {
                x: 1.5707963267948966,
                y: 709
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 628,
                y: 709
            },
            p1: {
                x: 1.5707963267948966,
                y: 709
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 437,
                y: 724
            },
            p1: {
                x: 437,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 318,
                y: 729
            },
            p1: {
                x: 318,
                y: 37
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 233,
                y: 724
            },
            p1: {
                x: 233,
                y: 36
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 164,
                y: 699
            },
            p1: {
                x: 164,
                y: 35
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 118,
                y: 643
            },
            p1: {
                x: 118,
                y: 34
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 143,
                y: 575
            },
            p1: {
                x: 143,
                y: 33
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 195,
                y: 527
            },
            p1: {
                x: 195,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 266,
                y: 500
            },
            p1: {
                x: 266,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 335,
                y: 453
            },
            p1: {
                x: 335,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 402,
                y: 402
            },
            p1: {
                x: 402,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 462,
                y: 351
            },
            p1: {
                x: 462,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 532,
                y: 302
            },
            p1: {
                x: 532,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 611,
                y: 273
            },
            p1: {
                x: 611,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 676,
                y: 224
            },
            p1: {
                x: 676,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 690,
                y: 146
            },
            p1: {
                x: 690,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 629,
                y: 109
            },
            p1: {
                x: 629,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 564,
                y: 142
            },
            p1: {
                x: 564,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 494,
                y: 114
            },
            p1: {
                x: 494,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 432,
                y: 86
            },
            p1: {
                x: 432,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 409,
                y: 149
            },
            p1: {
                x: 409,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 407,
                y: 217
            },
            p1: {
                x: 407,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 346,
                y: 243
            },
            p1: {
                x: 346,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 307,
                y: 186
            },
            p1: {
                x: 307,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 248,
                y: 90
            },
            p1: {
                x: 248,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 188,
                y: 118
            },
            p1: {
                x: 188,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 162,
                y: 185
            },
            p1: {
                x: 162,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 176,
                y: 255
            },
            p1: {
                x: 176,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 213,
                y: 314
            },
            p1: {
                x: 213,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 272,
                y: 365
            },
            p1: {
                x: 272,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 343,
                y: 412
            },
            p1: {
                x: 343,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 411,
                y: 460
            },
            p1: {
                x: 411,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 492,
                y: 505
            },
            p1: {
                x: 492,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 571,
                y: 543
            },
            p1: {
                x: 571,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 650,
                y: 579
            },
            p1: {
                x: 650,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 671,
                y: 643
            },
            p1: {
                x: 671,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 609,
                y: 695
            },
            p1: {
                x: 609,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 304,
                y: 120
            },
            p1: {
                x: 304,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 527,
                y: 714
            },
            p1: {
                x: 527,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 490,
                y: 593
            },
            p1: {
                x: 371,
                y: 493
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 596,
                y: 603
            },
            p1: {
                x: 491,
                y: 593
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 616,
                y: 638
            },
            p1: {
                x: 595,
                y: 603
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 592,
                y: 652
            },
            p1: {
                x: 616,
                y: 639
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 204,
                y: 652
            },
            p1: {
                x: 592,
                y: 653
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 164,
                y: 643
            },
            p1: {
                x: 204,
                y: 653
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 193,
                y: 611
            },
            p1: {
                x: 165,
                y: 642
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 319,
                y: 556
            },
            p1: {
                x: 192,
                y: 611
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 371,
                y: 493
            },
            p1: {
                x: 319,
                y: 557
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 609,
                y: 213
            },
            p1: {
                x: 491,
                y: 231
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 638,
                y: 183
            },
            p1: {
                x: 609,
                y: 213
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 636,
                y: 160
            },
            p1: {
                x: 639,
                y: 183
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 559,
                y: 214
            },
            p1: {
                x: 635,
                y: 160
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 458,
                y: 240
            },
            p1: {
                x: 558,
                y: 214
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 450,
                y: 127
            },
            p1: {
                x: 497,
                y: 227
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 466,
                y: 230
            },
            p1: {
                x: 450,
                y: 128
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 240,
                y: 140
            },
            p1: {
                x: 265,
                y: 132
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 222,
                y: 185
            },
            p1: {
                x: 241,
                y: 140
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 233
            },
            p1: {
                x: 223,
                y: 186
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 305,
                y: 296
            },
            p1: {
                x: 409,
                y: 294
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 362,
                y: 345
            },
            p1: {
                x: 468,
                y: 231
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 233
            },
            p1: {
                x: 362,
                y: 345
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 243,
                y: 205
            },
            p1: {
                x: 262,
                y: 255
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 267,
                y: 132
            },
            p1: {
                x: 243,
                y: 205
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 344,
                y: 48
            },
            p1: {
                x: 362,
                y: 74
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 211,
                y: 36
            },
            p1: {
                x: 344,
                y: 49
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 363,
                y: 74
            },
            p1: {
                x: 359,
                y: 197
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 410,
                y: 34
            },
            p1: {
                x: 365,
                y: 73
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 516,
                y: 43
            },
            p1: {
                x: 411,
                y: 34
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 550,
                y: 102
            },
            p1: {
                x: 516,
                y: 44
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 591,
                y: 61
            },
            p1: {
                x: 550,
                y: 102
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 676,
                y: 48
            },
            p1: {
                x: 591,
                y: 61
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 748,
                y: 97
            },
            p1: {
                x: 677,
                y: 48
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 762,
                y: 182
            },
            p1: {
                x: 748,
                y: 97
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 734,
                y: 285
            },
            p1: {
                x: 762,
                y: 182
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 685,
                y: 331
            },
            p1: {
                x: 734,
                y: 286
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 618,
                y: 326
            },
            p1: {
                x: 685,
                y: 331
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 527,
                y: 351
            },
            p1: {
                x: 619,
                y: 326
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 442,
                y: 413
            },
            p1: {
                x: 527,
                y: 351
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 549,
                y: 487
            },
            p1: {
                x: 443,
                y: 414
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 632,
                y: 490
            },
            p1: {
                x: 550,
                y: 487
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 710,
                y: 518
            },
            p1: {
                x: 632,
                y: 490
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 748,
                y: 615
            },
            p1: {
                x: 711,
                y: 518
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 726,
                y: 706
            },
            p1: {
                x: 748,
                y: 615
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 672,
                y: 736
            },
            p1: {
                x: 726,
                y: 706
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 493,
                y: 761
            },
            p1: {
                x: 671,
                y: 736
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 163,
                y: 762
            },
            p1: {
                x: 492,
                y: 760
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 73,
                y: 728
            },
            p1: {
                x: 161,
                y: 762
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 37,
                y: 640
            },
            p1: {
                x: 72,
                y: 729
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 63,
                y: 549
            },
            p1: {
                x: 37,
                y: 641
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 139,
                y: 494
            },
            p1: {
                x: 63,
                y: 550
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 249,
                y: 466
            },
            p1: {
                x: 139,
                y: 494
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 282,
                y: 422
            },
            p1: {
                x: 248,
                y: 467
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 137,
                y: 302
            },
            p1: {
                x: 282,
                y: 421
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 98,
                y: 215
            },
            p1: {
                x: 137,
                y: 302
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 134,
                y: 90
            },
            p1: {
                x: 98,
                y: 215
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 212,
                y: 35
            },
            p1: {
                x: 134,
                y: 89
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 441,
                y: 693
            },
            p1: {
                x: -3.1342838742941797,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 536,
                y: 688
            },
            p1: {
                x: -3.1342838742941797,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 623,
                y: 667
            },
            p1: {
                x: 2.534431073519751,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 686,
                y: 611
            },
            p1: {
                x: 1.9551850143120284,
                y: 1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 707,
                y: 527
            },
            p1: {
                x: 1.7368257786337065,
                y: 2
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 706,
                y: 440
            },
            p1: {
                x: 1.5416754592232071,
                y: 3
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 363,
                y: 692
            },
            p1: {
                x: 0.007308779295613461,
                y: 38
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 271,
                y: 692
            },
            p1: {
                x: 0.007308779295613461,
                y: 38
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 176,
                y: 674
            },
            p1: {
                x: 0.2034154398535603,
                y: 36
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 116,
                y: 628
            },
            p1: {
                x: 1.2449636274297728,
                y: 35
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 106,
                y: 546
            },
            p1: {
                x: 1.5029682769916686,
                y: 35
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 110,
                y: 454
            },
            p1: {
                x: 1.5921247850170142,
                y: 34
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 164,
                y: 234
            },
            p1: {
                x: 164,
                y: 234
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 163,
                y: 209
            },
            p1: {
                x: 163,
                y: 209
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 163,
                y: 189
            },
            p1: {
                x: 163,
                y: 189
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 638,
                y: 226
            },
            p1: {
                x: 638,
                y: 226
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 637,
                y: 202
            },
            p1: {
                x: 637,
                y: 202
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 637,
                y: 184
            },
            p1: {
                x: 637,
                y: 184
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 514,
                y: 467
            },
            p1: {
                x: 514,
                y: 467
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 514,
                y: 490
            },
            p1: {
                x: 514,
                y: 490
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 514,
                y: 514
            },
            p1: {
                x: 514,
                y: 514
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 395,
                y: 514
            },
            p1: {
                x: 395,
                y: 514
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 394,
                y: 493
            },
            p1: {
                x: 394,
                y: 493
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 393,
                y: 470
            },
            p1: {
                x: 393,
                y: 470
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 280,
                y: 447
            },
            p1: {
                x: 280,
                y: 447
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 280,
                y: 472
            },
            p1: {
                x: 280,
                y: 472
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 280,
                y: 493
            },
            p1: {
                x: 280,
                y: 493
            }
        }, 
        {
            type: 'building',
            p0: {
                x: 348,
                y: 156
            },
            p1: {
                x: 348,
                y: 156
            }
        }, 
        {
            type: 'building',
            p0: {
                x: 450,
                y: 156
            },
            p1: {
                x: 450,
                y: 156
            }
        }, 
        {
            type: 'building',
            p0: {
                x: 348,
                y: 256
            },
            p1: {
                x: 348,
                y: 256
            }
        }, 
        {
            type: 'building',
            p0: {
                x: 450,
                y: 256
            },
            p1: {
                x: 450,
                y: 256
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 505,
                y: 759
            },
            p1: {
                x: 505,
                y: 759
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 295,
                y: 759
            },
            p1: {
                x: 295,
                y: 759
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 672,
                y: 741
            },
            p1: {
                x: 672,
                y: 741
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 641,
                y: 41
            },
            p1: {
                x: 641,
                y: 41
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 160,
                y: 40
            },
            p1: {
                x: 160,
                y: 40
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 83,
                y: 722
            },
            p1: {
                x: 83,
                y: 722
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 761,
                y: 555
            },
            p1: {
                x: 761,
                y: 555
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 280,
                y: 156
            },
            p1: {
                x: 280,
                y: 156
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 39,
                y: 182
            },
            p1: {
                x: 39,
                y: 182
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 518,
                y: 161
            },
            p1: {
                x: 518,
                y: 161
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 518,
                y: 316
            },
            p1: {
                x: 518,
                y: 316
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 34,
                y: 529
            },
            p1: {
                x: 34,
                y: 529
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 405,
                y: 303
            },
            p1: {
                x: 405,
                y: 303
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 631,
                y: 564
            },
            p1: {
                x: 631,
                y: 564
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 637,
                y: 407
            },
            p1: {
                x: 637,
                y: 407
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 762,
                y: 183
            },
            p1: {
                x: 762,
                y: 183
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 529,
                y: 629
            },
            p1: {
                x: 529,
                y: 629
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 302,
                y: 626
            },
            p1: {
                x: 302,
                y: 626
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 35,
                y: 359
            },
            p1: {
                x: 35,
                y: 359
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 174,
                y: 532
            },
            p1: {
                x: 174,
                y: 532
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 168,
                y: 370
            },
            p1: {
                x: 168,
                y: 370
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 282,
                y: 316
            },
            p1: {
                x: 282,
                y: 316
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 767,
                y: 347
            },
            p1: {
                x: 767,
                y: 347
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 734,
                y: 578
            },
            p1: {
                x: 734,
                y: 578
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 125,
                y: 693
            },
            p1: {
                x: 125,
                y: 693
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 425,
                y: 581
            },
            p1: {
                x: 425,
                y: 581
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 406,
                y: 337
            },
            p1: {
                x: 406,
                y: 337
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 707,
                y: 383
            },
            p1: {
                x: 707,
                y: 383
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 574,
                y: 383
            },
            p1: {
                x: 574,
                y: 383
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 107,
                y: 388
            },
            p1: {
                x: 107,
                y: 388
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 222,
                y: 379
            },
            p1: {
                x: 222,
                y: 379
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 155,
                y: 692
            },
            p1: {
                x: 1.5707963267948966,
                y: 692
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 655,
                y: 692
            },
            p1: {
                x: 1.5707963267948966,
                y: 692
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 467,
                y: 711
            },
            p1: {
                x: 467,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 338,
                y: 708
            },
            p1: {
                x: 338,
                y: 37
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 245,
                y: 695
            },
            p1: {
                x: 245,
                y: 36
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 163,
                y: 675
            },
            p1: {
                x: 163,
                y: 35
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 109,
                y: 595
            },
            p1: {
                x: 109,
                y: 34
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 95,
                y: 496
            },
            p1: {
                x: 95,
                y: 33
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 88,
                y: 399
            },
            p1: {
                x: 88,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 85,
                y: 308
            },
            p1: {
                x: 85,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 86,
                y: 227
            },
            p1: {
                x: 86,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 113,
                y: 158
            },
            p1: {
                x: 113,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 182,
                y: 127
            },
            p1: {
                x: 182,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 236,
                y: 190
            },
            p1: {
                x: 236,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 239,
                y: 270
            },
            p1: {
                x: 239,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 219,
                y: 352
            },
            p1: {
                x: 219,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 209,
                y: 431
            },
            p1: {
                x: 209,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 218,
                y: 511
            },
            p1: {
                x: 218,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 274,
                y: 563
            },
            p1: {
                x: 274,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 327,
                y: 522
            },
            p1: {
                x: 327,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 341,
                y: 446
            },
            p1: {
                x: 341,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 395,
                y: 393
            },
            p1: {
                x: 395,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 451,
                y: 446
            },
            p1: {
                x: 451,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 460,
                y: 519
            },
            p1: {
                x: 460,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 507,
                y: 570
            },
            p1: {
                x: 507,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 601,
                y: 489
            },
            p1: {
                x: 601,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 596,
                y: 410
            },
            p1: {
                x: 596,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 577,
                y: 329
            },
            p1: {
                x: 577,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 559,
                y: 247
            },
            p1: {
                x: 559,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 576,
                y: 174
            },
            p1: {
                x: 576,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 630,
                y: 127
            },
            p1: {
                x: 630,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 695,
                y: 167
            },
            p1: {
                x: 695,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 717,
                y: 241
            },
            p1: {
                x: 717,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 725,
                y: 312
            },
            p1: {
                x: 725,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 724,
                y: 402
            },
            p1: {
                x: 724,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 707,
                y: 491
            },
            p1: {
                x: 707,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 691,
                y: 573
            },
            p1: {
                x: 691,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 651,
                y: 651
            },
            p1: {
                x: 651,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 571,
                y: 555
            },
            p1: {
                x: 571,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 563,
                y: 695
            },
            p1: {
                x: 563,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 591,
                y: 616
            },
            p1: {
                x: 526,
                y: 632
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 626,
                y: 579
            },
            p1: {
                x: 593,
                y: 614
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 638,
                y: 524
            },
            p1: {
                x: 627,
                y: 578
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 637,
                y: 182
            },
            p1: {
                x: 638,
                y: 522
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 396,
                y: 586
            },
            p1: {
                x: 365,
                y: 623
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 396,
                y: 586
            },
            p1: {
                x: 433,
                y: 628
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 393,
                y: 468
            },
            p1: {
                x: 396,
                y: 595
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 621
            },
            p1: {
                x: 523,
                y: 632
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 192,
                y: 610
            },
            p1: {
                x: 234,
                y: 622
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 176,
                y: 582
            },
            p1: {
                x: 192,
                y: 610
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 162,
                y: 186
            },
            p1: {
                x: 176,
                y: 582
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 106,
                y: 48
            },
            p1: {
                x: 48,
                y: 121
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 217,
                y: 39
            },
            p1: {
                x: 106,
                y: 49
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 279,
                y: 84
            },
            p1: {
                x: 219,
                y: 39
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 280,
                y: 83
            },
            p1: {
                x: 280,
                y: 495
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 353,
                y: 314
            },
            p1: {
                x: 280,
                y: 367
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 465,
                y: 312
            },
            p1: {
                x: 354,
                y: 314
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 520,
                y: 356
            },
            p1: {
                x: 465,
                y: 312
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 521,
                y: 90
            },
            p1: {
                x: 513,
                y: 515
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 599,
                y: 48
            },
            p1: {
                x: 522,
                y: 91
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 701,
                y: 51
            },
            p1: {
                x: 600,
                y: 48
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 758,
                y: 122
            },
            p1: {
                x: 703,
                y: 52
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 758,
                y: 618
            },
            p1: {
                x: 758,
                y: 124
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 716,
                y: 716
            },
            p1: {
                x: 759,
                y: 614
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 635,
                y: 749
            },
            p1: {
                x: 716,
                y: 716
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 135,
                y: 752
            },
            p1: {
                x: 635,
                y: 749
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 64,
                y: 703
            },
            p1: {
                x: 135,
                y: 754
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 44,
                y: 614
            },
            p1: {
                x: 64,
                y: 702
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 50,
                y: 118
            },
            p1: {
                x: 44,
                y: 613
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 603,
                y: 366
            },
            p1: {
                x: 1.3296414974499324,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 640,
                y: 258
            },
            p1: {
                x: 1.913025310043311,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 683,
                y: 147
            },
            p1: {
                x: 1.8124691409718812,
                y: 1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 601,
                y: 91
            },
            p1: {
                x: -0.01984907223657858,
                y: 3
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 530,
                y: 159
            },
            p1: {
                x: -1.3758697129159638,
                y: 4
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 513,
                y: 264
            },
            p1: {
                x: -1.3744161595929987,
                y: 6
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 630,
                y: 428
            },
            p1: {
                x: -1.9164333572902854,
                y: 37
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 670,
                y: 552
            },
            p1: {
                x: -1.7688785202494641,
                y: 36
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 645,
                y: 657
            },
            p1: {
                x: -0.5510924517439499,
                y: 35
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 544,
                y: 713
            },
            p1: {
                x: 0.10364650120035784,
                y: 33
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 466,
                y: 649
            },
            p1: {
                x: 1.4960304760359031,
                y: 32
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 495,
                y: 532
            },
            p1: {
                x: 1.9816302039365152,
                y: 30
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 198,
                y: 230
            },
            p1: {
                x: 198,
                y: 230
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 251,
                y: 184
            },
            p1: {
                x: 251,
                y: 184
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 228,
                y: 179
            },
            p1: {
                x: 228,
                y: 179
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 203,
                y: 185
            },
            p1: {
                x: 203,
                y: 185
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 188,
                y: 209
            },
            p1: {
                x: 188,
                y: 209
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 198,
                y: 613
            },
            p1: {
                x: 198,
                y: 613
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 224,
                y: 644
            },
            p1: {
                x: 224,
                y: 644
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 201,
                y: 653
            },
            p1: {
                x: 201,
                y: 653
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 179,
                y: 628
            },
            p1: {
                x: 179,
                y: 628
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 178,
                y: 648
            },
            p1: {
                x: 178,
                y: 648
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 402,
                y: 482
            },
            p1: {
                x: 402,
                y: 482
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 449,
                y: 483
            },
            p1: {
                x: 449,
                y: 483
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 447,
                y: 460
            },
            p1: {
                x: 447,
                y: 460
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 409,
                y: 458
            },
            p1: {
                x: 409,
                y: 458
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 429,
                y: 447
            },
            p1: {
                x: 429,
                y: 447
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 533,
                y: 608
            },
            p1: {
                x: 533,
                y: 608
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 522,
                y: 629
            },
            p1: {
                x: 522,
                y: 629
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 570,
                y: 648
            },
            p1: {
                x: 570,
                y: 648
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 543,
                y: 653
            },
            p1: {
                x: 543,
                y: 653
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 521,
                y: 651
            },
            p1: {
                x: 521,
                y: 651
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 581,
                y: 178
            },
            p1: {
                x: 581,
                y: 178
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 619,
                y: 177
            },
            p1: {
                x: 619,
                y: 177
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 628,
                y: 157
            },
            p1: {
                x: 628,
                y: 157
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 609,
                y: 144
            },
            p1: {
                x: 609,
                y: 144
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 591,
                y: 154
            },
            p1: {
                x: 591,
                y: 154
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 458,
                y: 182
            },
            p1: {
                x: 458,
                y: 182
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 465,
                y: 203
            },
            p1: {
                x: 465,
                y: 203
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 470,
                y: 224
            },
            p1: {
                x: 470,
                y: 224
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 455,
                y: 57
            },
            p1: {
                x: 455,
                y: 57
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 591,
                y: 27
            },
            p1: {
                x: 591,
                y: 27
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 704,
                y: 51
            },
            p1: {
                x: 704,
                y: 51
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 766,
                y: 182
            },
            p1: {
                x: 766,
                y: 182
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 721,
                y: 703
            },
            p1: {
                x: 721,
                y: 703
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 671,
                y: 337
            },
            p1: {
                x: 671,
                y: 337
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 721,
                y: 459
            },
            p1: {
                x: 721,
                y: 459
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 386,
                y: 732
            },
            p1: {
                x: 386,
                y: 732
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 71,
                y: 738
            },
            p1: {
                x: 71,
                y: 738
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 64,
                y: 422
            },
            p1: {
                x: 64,
                y: 422
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 42,
                y: 564
            },
            p1: {
                x: 42,
                y: 564
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 163,
                y: 428
            },
            p1: {
                x: 163,
                y: 428
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 38,
                y: 224
            },
            p1: {
                x: 38,
                y: 224
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 99,
                y: 70
            },
            p1: {
                x: 99,
                y: 70
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 251,
                y: 55
            },
            p1: {
                x: 251,
                y: 55
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 379,
                y: 92
            },
            p1: {
                x: 379,
                y: 92
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 330,
                y: 293
            },
            p1: {
                x: 330,
                y: 293
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 252,
                y: 593
            },
            p1: {
                x: 252,
                y: 593
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 586,
                y: 508
            },
            p1: {
                x: 586,
                y: 508
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 306,
                y: 361
            },
            p1: {
                x: 306,
                y: 361
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 518,
                y: 342
            },
            p1: {
                x: 518,
                y: 342
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 312,
                y: 227
            },
            p1: {
                x: 312,
                y: 227
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 353,
                y: 98
            },
            p1: {
                x: 353,
                y: 98
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 97,
                y: 110
            },
            p1: {
                x: 97,
                y: 110
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 393,
                y: 151
            },
            p1: {
                x: 393,
                y: 151
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 141,
                y: 165
            },
            p1: {
                x: 141,
                y: 165
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 233,
                y: 417
            },
            p1: {
                x: 233,
                y: 417
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 705,
                y: 635
            },
            p1: {
                x: -0.3486863499435296,
                y: 635
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 534,
                y: 165
            },
            p1: {
                x: -0.3486863499435296,
                y: 165
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 617,
                y: 337
            },
            p1: {
                x: 617,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 636,
                y: 457
            },
            p1: {
                x: 636,
                y: 36
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 656,
                y: 539
            },
            p1: {
                x: 656,
                y: 35
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 671,
                y: 615
            },
            p1: {
                x: 671,
                y: 34
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 626,
                y: 683
            },
            p1: {
                x: 626,
                y: 33
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 556,
                y: 706
            },
            p1: {
                x: 556,
                y: 32
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 484,
                y: 680
            },
            p1: {
                x: 484,
                y: 31
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 476,
                y: 610
            },
            p1: {
                x: 476,
                y: 30
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 496,
                y: 532
            },
            p1: {
                x: 496,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 498,
                y: 458
            },
            p1: {
                x: 498,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 447,
                y: 404
            },
            p1: {
                x: 447,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 378,
                y: 417
            },
            p1: {
                x: 378,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 336,
                y: 476
            },
            p1: {
                x: 336,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 325,
                y: 555
            },
            p1: {
                x: 325,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 319,
                y: 644
            },
            p1: {
                x: 319,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 243,
                y: 697
            },
            p1: {
                x: 243,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 154,
                y: 699
            },
            p1: {
                x: 154,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 118,
                y: 642
            },
            p1: {
                x: 118,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 145,
                y: 570
            },
            p1: {
                x: 145,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 187,
                y: 509
            },
            p1: {
                x: 187,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 221,
                y: 440
            },
            p1: {
                x: 221,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 212,
                y: 356
            },
            p1: {
                x: 212,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 121,
                y: 224
            },
            p1: {
                x: 121,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 144,
                y: 157
            },
            p1: {
                x: 144,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 222,
                y: 139
            },
            p1: {
                x: 222,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 302,
                y: 158
            },
            p1: {
                x: 302,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 365,
                y: 193
            },
            p1: {
                x: 365,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 397,
                y: 264
            },
            p1: {
                x: 397,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 461,
                y: 291
            },
            p1: {
                x: 461,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 517,
                y: 254
            },
            p1: {
                x: 517,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 522,
                y: 186
            },
            p1: {
                x: 522,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 546,
                y: 125
            },
            p1: {
                x: 546,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 607,
                y: 100
            },
            p1: {
                x: 607,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 675,
                y: 124
            },
            p1: {
                x: 675,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 687,
                y: 190
            },
            p1: {
                x: 687,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 155,
                y: 288
            },
            p1: {
                x: 155,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 640,
                y: 257
            },
            p1: {
                x: 640,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 471,
                y: 184
            },
            p1: {
                x: 458,
                y: 128
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 457,
                y: 61
            },
            p1: {
                x: 459,
                y: 133
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 623,
                y: 28
            },
            p1: {
                x: 457,
                y: 60
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 749,
                y: 83
            },
            p1: {
                x: 622,
                y: 28
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 757,
                y: 198
            },
            p1: {
                x: 748,
                y: 81
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 675,
                y: 283
            },
            p1: {
                x: 756,
                y: 198
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 656,
                y: 334
            },
            p1: {
                x: 674,
                y: 283
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 707,
                y: 460
            },
            p1: {
                x: 656,
                y: 334
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 760,
                y: 632
            },
            p1: {
                x: 707,
                y: 460
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 648,
                y: 750
            },
            p1: {
                x: 759,
                y: 633
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 498,
                y: 765
            },
            p1: {
                x: 646,
                y: 750
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 389,
                y: 710
            },
            p1: {
                x: 496,
                y: 765
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 441,
                y: 533
            },
            p1: {
                x: 392,
                y: 649
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 452,
                y: 463
            },
            p1: {
                x: 442,
                y: 533
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 430,
                y: 445
            },
            p1: {
                x: 451,
                y: 463
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 406,
                y: 460
            },
            p1: {
                x: 429,
                y: 444
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 388,
                y: 710
            },
            p1: {
                x: 405,
                y: 460
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 302,
                y: 754
            },
            p1: {
                x: 387,
                y: 710
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 112,
                y: 751
            },
            p1: {
                x: 301,
                y: 755
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 51,
                y: 698
            },
            p1: {
                x: 112,
                y: 752
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 44,
                y: 587
            },
            p1: {
                x: 51,
                y: 698
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 155,
                y: 482
            },
            p1: {
                x: 44,
                y: 587
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 178,
                y: 428
            },
            p1: {
                x: 155,
                y: 482
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 157,
                y: 360
            },
            p1: {
                x: 177,
                y: 426
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 45,
                y: 286
            },
            p1: {
                x: 156,
                y: 359
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 49,
                y: 136
            },
            p1: {
                x: 46,
                y: 296
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 114,
                y: 76
            },
            p1: {
                x: 48,
                y: 136
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 289,
                y: 63
            },
            p1: {
                x: 114,
                y: 75
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 414,
                y: 123
            },
            p1: {
                x: 290,
                y: 63
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 470,
                y: 225
            },
            p1: {
                x: 413,
                y: 122
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 470,
                y: 225
            },
            p1: {
                x: 470,
                y: 184
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 288,
                y: 200
            },
            p1: {
                x: 383,
                y: 329
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 239,
                y: 176
            },
            p1: {
                x: 286,
                y: 200
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 202,
                y: 184
            },
            p1: {
                x: 238,
                y: 176
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 186,
                y: 206
            },
            p1: {
                x: 201,
                y: 184
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 205,
                y: 244
            },
            p1: {
                x: 185,
                y: 207
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 272,
                y: 296
            },
            p1: {
                x: 204,
                y: 244
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 297,
                y: 379
            },
            p1: {
                x: 272,
                y: 297
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 631,
                y: 160
            },
            p1: {
                x: 605,
                y: 194
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 609,
                y: 142
            },
            p1: {
                x: 631,
                y: 159
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 582,
                y: 160
            },
            p1: {
                x: 608,
                y: 142
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 575,
                y: 247
            },
            p1: {
                x: 581,
                y: 160
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 525,
                y: 336
            },
            p1: {
                x: 605,
                y: 190
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 562,
                y: 558
            },
            p1: {
                x: 575,
                y: 449
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 520,
                y: 627
            },
            p1: {
                x: 563,
                y: 558
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 519,
                y: 653
            },
            p1: {
                x: 521,
                y: 628
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 557,
                y: 654
            },
            p1: {
                x: 521,
                y: 654
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 596,
                y: 632
            },
            p1: {
                x: 558,
                y: 654
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 619,
                y: 591
            },
            p1: {
                x: 594,
                y: 634
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 617,
                y: 531
            },
            p1: {
                x: 619,
                y: 591
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 524,
                y: 337
            },
            p1: {
                x: 617,
                y: 532
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 176,
                y: 629
            },
            p1: {
                x: 275,
                y: 553
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 176,
                y: 648
            },
            p1: {
                x: 176,
                y: 629
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 202,
                y: 653
            },
            p1: {
                x: 175,
                y: 648
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 247,
                y: 634
            },
            p1: {
                x: 203,
                y: 653
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 267,
                y: 598
            },
            p1: {
                x: 247,
                y: 633
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 298,
                y: 379
            },
            p1: {
                x: 267,
                y: 598
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 388,
                y: 328
            },
            p1: {
                x: 298,
                y: 378
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 523,
                y: 337
            },
            p1: {
                x: 388,
                y: 328
            }
        }
    ]
}, {
    aData: [
        {
            type: 'enemyStart1',
            p0: {
                x: 325,
                y: 543
            },
            p1: {
                x: -2.452632346954076,
                y: -1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 431,
                y: 563
            },
            p1: {
                x: 3.068086478026407,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 512,
                y: 512
            },
            p1: {
                x: 2.456828956199823,
                y: 0
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 556,
                y: 425
            },
            p1: {
                x: 1.8294422655472833,
                y: 1
            }
        }, 
        {
            type: 'enemyStart1',
            p0: {
                x: 558,
                y: 343
            },
            p1: {
                x: 1.67261589948746,
                y: 2
            }
        }, 
        {
            type: 'userStart1',
            p0: {
                x: 623,
                y: 282
            },
            p1: {
                x: 2.5746863512929528,
                y: 3
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 315,
                y: 264
            },
            p1: {
                x: 2.2085592256866033,
                y: 28
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 272,
                y: 498
            },
            p1: {
                x: 0.688960306635717,
                y: 30
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 233,
                y: 413
            },
            p1: {
                x: 1.4113193165021176,
                y: 29
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 254,
                y: 334
            },
            p1: {
                x: 1.8693380165733242,
                y: 29
            }
        }, 
        {
            type: 'enemyStart0',
            p0: {
                x: 406,
                y: 232
            },
            p1: {
                x: 2.699983553207328,
                y: 27
            }
        }, 
        {
            type: 'userStart0',
            p0: {
                x: 491,
                y: 190
            },
            p1: {
                x: 2.387659738471631,
                y: 25
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 368,
                y: 176
            },
            p1: {
                x: 368,
                y: 176
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 391,
                y: 173
            },
            p1: {
                x: 391,
                y: 173
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 415,
                y: 172
            },
            p1: {
                x: 415,
                y: 172
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 628,
                y: 389
            },
            p1: {
                x: 628,
                y: 389
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 625,
                y: 367
            },
            p1: {
                x: 625,
                y: 367
            }
        }, 
        {
            type: 'barrier',
            p0: {
                x: 621,
                y: 345
            },
            p1: {
                x: 621,
                y: 345
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 547,
                y: 76
            },
            p1: {
                x: 547,
                y: 76
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 329,
                y: 47
            },
            p1: {
                x: 329,
                y: 47
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 104,
                y: 192
            },
            p1: {
                x: 104,
                y: 192
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 40,
                y: 435
            },
            p1: {
                x: 40,
                y: 435
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 128,
                y: 643
            },
            p1: {
                x: 128,
                y: 643
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 402,
                y: 755
            },
            p1: {
                x: 402,
                y: 755
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 673,
                y: 635
            },
            p1: {
                x: 673,
                y: 635
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 757,
                y: 441
            },
            p1: {
                x: 757,
                y: 441
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 483,
                y: 301
            },
            p1: {
                x: 483,
                y: 301
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 667,
                y: 198
            },
            p1: {
                x: 667,
                y: 198
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 470,
                y: 446
            },
            p1: {
                x: 470,
                y: 446
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 343,
                y: 464
            },
            p1: {
                x: 343,
                y: 464
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 325,
                y: 350
            },
            p1: {
                x: 325,
                y: 350
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 469,
                y: 615
            },
            p1: {
                x: 469,
                y: 615
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 298,
                y: 602
            },
            p1: {
                x: 298,
                y: 602
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 174,
                y: 430
            },
            p1: {
                x: 174,
                y: 430
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 609,
                y: 490
            },
            p1: {
                x: 609,
                y: 490
            }
        }, 
        {
            type: 'trackSideObject',
            p0: {
                x: 245,
                y: 236
            },
            p1: {
                x: 245,
                y: 236
            }
        }, 
        {
            type: 'building',
            p0: {
                x: 398,
                y: 396
            },
            p1: {
                x: 398,
                y: 396
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 665,
                y: 238
            },
            p1: {
                x: 665,
                y: 238
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 253,
                y: 707
            },
            p1: {
                x: 253,
                y: 707
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 512,
                y: 101
            },
            p1: {
                x: 512,
                y: 101
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 69,
                y: 402
            },
            p1: {
                x: 69,
                y: 402
            }
        }, 
        {
            type: 'oil',
            p0: {
                x: 197,
                y: 655
            },
            p1: {
                x: 197,
                y: 655
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 488,
                y: 665
            },
            p1: {
                x: 488,
                y: 665
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 688,
                y: 457
            },
            p1: {
                x: 688,
                y: 457
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 228,
                y: 171
            },
            p1: {
                x: 228,
                y: 171
            }
        }, 
        {
            type: 'boost',
            p0: {
                x: 142,
                y: 493
            },
            p1: {
                x: 142,
                y: 493
            }
        }, 
        {
            type: 'finishLine1',
            p0: {
                x: 103,
                y: 362
            },
            p1: {
                x: 2.2419169162365,
                y: 362
            }
        }, 
        {
            type: 'finishLine0',
            p0: {
                x: 495,
                y: 673
            },
            p1: {
                x: 2.2419169162365,
                y: 673
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 360,
                y: 543
            },
            p1: {
                x: 360,
                y: 0
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 264,
                y: 478
            },
            p1: {
                x: 264,
                y: 29
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 250,
                y: 386
            },
            p1: {
                x: 250,
                y: 28
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 289,
                y: 312
            },
            p1: {
                x: 289,
                y: 27
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 349,
                y: 261
            },
            p1: {
                x: 349,
                y: 26
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 414,
                y: 242
            },
            p1: {
                x: 414,
                y: 25
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 481,
                y: 189
            },
            p1: {
                x: 481,
                y: 24
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 454,
                y: 115
            },
            p1: {
                x: 454,
                y: 23
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 388,
                y: 90
            },
            p1: {
                x: 388,
                y: 22
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 316,
                y: 103
            },
            p1: {
                x: 316,
                y: 21
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 245,
                y: 143
            },
            p1: {
                x: 245,
                y: 20
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 184,
                y: 202
            },
            p1: {
                x: 184,
                y: 19
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 148,
                y: 275
            },
            p1: {
                x: 148,
                y: 18
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 125,
                y: 363
            },
            p1: {
                x: 125,
                y: 17
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 126,
                y: 451
            },
            p1: {
                x: 126,
                y: 16
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 212,
                y: 612
            },
            p1: {
                x: 212,
                y: 14
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 291,
                y: 663
            },
            p1: {
                x: 291,
                y: 13
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 384,
                y: 682
            },
            p1: {
                x: 384,
                y: 12
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 492,
                y: 668
            },
            p1: {
                x: 492,
                y: 11
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 576,
                y: 622
            },
            p1: {
                x: 576,
                y: 10
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 639,
                y: 564
            },
            p1: {
                x: 639,
                y: 9
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 685,
                y: 494
            },
            p1: {
                x: 685,
                y: 8
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 703,
                y: 410
            },
            p1: {
                x: 703,
                y: 7
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 687,
                y: 335
            },
            p1: {
                x: 687,
                y: 6
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 630,
                y: 282
            },
            p1: {
                x: 630,
                y: 5
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 566,
                y: 325
            },
            p1: {
                x: 566,
                y: 4
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 544,
                y: 396
            },
            p1: {
                x: 544,
                y: 3
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 523,
                y: 478
            },
            p1: {
                x: 523,
                y: 2
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 156,
                y: 537
            },
            p1: {
                x: 156,
                y: 15
            }
        }, 
        {
            type: 'dirMarker',
            p0: {
                x: 453,
                y: 532
            },
            p1: {
                x: 453,
                y: 1
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 501,
                y: 384
            },
            p1: {
                x: 492,
                y: 296
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 486,
                y: 449
            },
            p1: {
                x: 500,
                y: 386
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 437,
                y: 493
            },
            p1: {
                x: 486,
                y: 451
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 372,
                y: 495
            },
            p1: {
                x: 436,
                y: 493
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 317,
                y: 460
            },
            p1: {
                x: 371,
                y: 495
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 298,
                y: 400
            },
            p1: {
                x: 318,
                y: 461
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 318,
                y: 339
            },
            p1: {
                x: 298,
                y: 400
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 369,
                y: 300
            },
            p1: {
                x: 318,
                y: 339
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 369,
                y: 300
            },
            p1: {
                x: 501,
                y: 286
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 553,
                y: 228
            },
            p1: {
                x: 492,
                y: 294
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 630,
                y: 396
            },
            p1: {
                x: 621,
                y: 343
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 613,
                y: 484
            },
            p1: {
                x: 629,
                y: 395
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 562,
                y: 559
            },
            p1: {
                x: 613,
                y: 484
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 488,
                y: 611
            },
            p1: {
                x: 562,
                y: 559
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 399,
                y: 627
            },
            p1: {
                x: 488,
                y: 611
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 309,
                y: 609
            },
            p1: {
                x: 398,
                y: 627
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 556
            },
            p1: {
                x: 309,
                y: 610
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 322,
                y: 182
            },
            p1: {
                x: 416,
                y: 172
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 246,
                y: 230
            },
            p1: {
                x: 322,
                y: 182
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 191,
                y: 301
            },
            p1: {
                x: 246,
                y: 229
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 171,
                y: 390
            },
            p1: {
                x: 190,
                y: 302
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 182,
                y: 480
            },
            p1: {
                x: 170,
                y: 391
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 236,
                y: 555
            },
            p1: {
                x: 182,
                y: 482
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 63,
                y: 522
            },
            p1: {
                x: 37,
                y: 377
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 145,
                y: 665
            },
            p1: {
                x: 51,
                y: 502
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 314,
                y: 751
            },
            p1: {
                x: 147,
                y: 666
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 500,
                y: 751
            },
            p1: {
                x: 313,
                y: 751
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 653,
                y: 659
            },
            p1: {
                x: 502,
                y: 750
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 740,
                y: 524
            },
            p1: {
                x: 652,
                y: 659
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 759,
                y: 367
            },
            p1: {
                x: 740,
                y: 523
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 723,
                y: 242
            },
            p1: {
                x: 760,
                y: 369
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 663,
                y: 199
            },
            p1: {
                x: 723,
                y: 241
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 552,
                y: 227
            },
            p1: {
                x: 662,
                y: 199
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 575,
                y: 131
            },
            p1: {
                x: 552,
                y: 227
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 531,
                y: 62
            },
            p1: {
                x: 574,
                y: 130
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 366,
                y: 35
            },
            p1: {
                x: 531,
                y: 63
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 183,
                y: 106
            },
            p1: {
                x: 367,
                y: 34
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 68,
                y: 253
            },
            p1: {
                x: 183,
                y: 105
            }
        }, 
        {
            type: 'wall',
            p0: {
                x: 38,
                y: 416
            },
            p1: {
                x: 68,
                y: 252
            }
        }
    ]
});
function loadLang(_lang) {
    curLang = _lang;
    loadPreAssets();
}
function initSplash() {
    gameState = "splash";
    resizeCanvas();
    setCarData();
    getLevelData();
    getUserCarData();
    curCar = getDefaultUserCar();
    curLevelAll = getDefaultLevel();
    curCash = saveDataHandler.aLevelStore[0];
    if(curCash == 0 && curLevelAll == 0) {
        firstRun = true;
    }
    if(audioType == 1 && !muted) {
        music.play();
    }
    initStartScreen();
}
function setCarData() {
    aCarData = new Array();
    for(var i = 0; i < aStoredCarData.length; i++) {
        aCarData[i] = {
            maxSpeed: aStoredCarData[i].maxSpeed,
            groundFriction: aStoredCarData[i].groundFriction,
            accRate: aStoredCarData[i].accRate,
            steerRate: aStoredCarData[i].steerRate,
            steerDamper: aStoredCarData[i].steerDamper,
            steerReaction: aStoredCarData[i].steerReaction
        };
    }
}
function getDefaultUserCar() {
    return Math.floor(Math.min(getLevelsFinishedFirst() / 2, 5));
}
function getDefaultLevel() {
    var temp = 0;
    for(var i = 0; i < aLevelResultData.length; i++) {
        for(var j = 0; j < aLevelResultData[i].length; j++) {
            if(aLevelResultData[i][j] < 4 && aLevelResultData[i][j] > 0) {
                temp = Math.min(13, i + 1);
            }
        }
    }
    return temp;
}
function getLevelData() {
    aLevelResultData = new Array();
    for(var i = 0; i < 14; i++) {
        aLevelResultData[i] = new Array();
        for(var j = 0; j < 6; j++) {
            aLevelResultData[i].push(saveDataHandler.aLevelStore[31 + (i * 6) + j]);
        }
    }
}
function getUserCarData() {
    aUserCarData = new Array();
    for(var i = 0; i < 6; i++) {
        aUserCarData[i] = new Array();
        for(var j = 0; j < 5; j++) {
            aUserCarData[i].push(saveDataHandler.aLevelStore[1 + (i * 5) + j]);
        }
        for(var j = 0; j < 4; j++) {
            var upgradeAmount = ((aCarUpgradeData[i][aStatData[j]] - aStoredCarData[i][aStatData[j]]) / 5) * aUserCarData[i][j];
            aCarData[i][aStatData[j]] += upgradeAmount;
        }
    }
}
function initStartScreen() {
    gameState = "start";
    userInput.removeHitArea("moreGames");
    if(audioType == 1) {
        music.fade(music.volume(), .25, 500);
    }
    background = new Elements.Background();
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        noMove: false
    };
    var oCarSelectBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            150, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.carSelectBut,
        noMove: true
    };
    var oLevelSelectBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -150, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.levelSelectBut,
        noMove: true
    };
    var oCreditsBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -85, 
            30
        ],
        align: [
            1, 
            0
        ],
        id: oImageIds.infoBut,
        noMove: true
    };
    userInput.addHitArea("playFromStart", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("carSelectFromStart", butEventHandler, null, "image", oCarSelectBut);
    userInput.addHitArea("levelSelectFromStart", butEventHandler, null, "image", oLevelSelectBut);
    userInput.addHitArea("credits", butEventHandler, null, "image", oCreditsBut);
    var aButs = new Array(oPlayBut, oCreditsBut, oCarSelectBut, oLevelSelectBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateStartScreenEvent();
}
function addMuteBut(_aButs) {
    if(audioType == 1) {
        var mb = oImageIds.muteBut0;
        if(muted) {
            mb = oImageIds.muteBut1;
        }
        var oMuteBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -30, 
                30
            ],
            align: [
                1, 
                0
            ],
            id: mb,
            noMove: true
        };
        userInput.addHitArea("mute", butEventHandler, null, "image", oMuteBut);
        _aButs.push(oMuteBut);
    }
}
function initCreditsScreen() {
    gameState = "credits";
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30, 
            -30
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oResetBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -30, 
            -30
        ],
        align: [
            1, 
            1
        ],
        id: oImageIds.resetBut,
        noMove: true
    };
    userInput.addHitArea("backFromCredits", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("resetData", butEventHandler, null, "image", oResetBut);
    var aButs = new Array(oBackBut, oResetBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCreditsScreenEvent();
}
function initCarSelect() {
    gameState = "carSelect";
    background = new Elements.Background();
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        noMove: false
    };
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30, 
            -30
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oLeftBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -210, 
            0
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.leftBut,
        noMove: true
    };
    var oRightBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            210, 
            0
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.rightBut,
        noMove: true
    };
    var oUpgradeBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            150, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.upgradeBut,
        noMove: true
    };
    var oLevelSelectBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -150, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.levelSelectBut,
        noMove: true
    };
    userInput.addHitArea("playFromCarSelect", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("backFromCarSelect", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("carSelectLeft", butEventHandler, null, "image", oLeftBut);
    userInput.addHitArea("carSelectRight", butEventHandler, null, "image", oRightBut);
    userInput.addHitArea("upgradeFromCarSelect", butEventHandler, null, "image", oUpgradeBut);
    userInput.addHitArea("levelSelectFromCarSelect", butEventHandler, null, "image", oLevelSelectBut);
    var aButs = new Array(oPlayBut, oBackBut, oLeftBut, oRightBut, oUpgradeBut, oLevelSelectBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCarSelectScreenEvent();
}
function initUpgrade() {
    gameState = "upgrade";
    background = new Elements.Background();
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        noMove: false
    };
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30, 
            -30
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oEngineBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -80, 
            -55
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.upgradeBut0,
        noMove: true
    };
    var oDriveTrainBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            80, 
            -55
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.upgradeBut1,
        noMove: true
    };
    var oGripBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -80, 
            94
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.upgradeBut2,
        noMove: true
    };
    var oWeightBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            80, 
            94
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.upgradeBut3,
        noMove: true
    };
    userInput.addHitArea("playFromUpgrade", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("backFromUpgrade", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("upgrade", butEventHandler, {
        id: 0
    }, "image", oEngineBut);
    userInput.addHitArea("upgrade", butEventHandler, {
        id: 1
    }, "image", oDriveTrainBut);
    userInput.addHitArea("upgrade", butEventHandler, {
        id: 2
    }, "image", oGripBut);
    userInput.addHitArea("upgrade", butEventHandler, {
        id: 3
    }, "image", oWeightBut);
    var aButs = new Array(oPlayBut, oBackBut, oEngineBut, oDriveTrainBut, oGripBut, oWeightBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateUpgradeScreenEvent();
}
function initLevelSelect() {
    gameState = "levelSelect";
    background = new Elements.Background();
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        noMove: false
    };
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30, 
            -30
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oLeftBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -210, 
            0
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.leftBut,
        noMove: true
    };
    var oRightBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            210, 
            0
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.rightBut,
        noMove: true
    };
    var oCarSelectBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            150, 
            190
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.carSelectBut,
        noMove: true
    };
    userInput.addHitArea("playFromLevelSelect", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("backFromLevelSelect", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("levelSelectLeft", butEventHandler, null, "image", oLeftBut);
    userInput.addHitArea("levelSelectRight", butEventHandler, null, "image", oRightBut);
    userInput.addHitArea("carSelectFromLevelSelect", butEventHandler, null, "image", oCarSelectBut);
    var aButs = new Array(oPlayBut, oBackBut, oLeftBut, oRightBut, oCarSelectBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateLevelSelectScreenEvent();
}
function initGame() {
    gameState = "game";
    playSound("startCar");
    if(audioType == 1) {
        music.fade(music.volume(), .5, 1000);
    }
    if(curLevelAll >= totalLevels / 2) {
        trackReversed = 1;
    } else {
        trackReversed = 0;
    }
    aEnemyCarTypes = new Array(0, 1, 2, 3, 4, 5);
    leftSteer = 0;
    rightSteer = 0;
    background = new Elements.Background();
    var aButs = new Array();
    panel = new Elements.Panel(gameState, aButs);
    addMuteBut(aButs);
    panel.startTween1();
    aTrees = new Array();
    var aLines = new Array();
    aCars = new Array();
    aDirMarkers = new Array();
    aTrackSideObjects = new Array();
    aTrackTriggers = new Array();
    var trackReverseId = 0;
    if(trackReversed) {
        trackReverseId = 1;
    }
    var curLevel = curLevelAll % 7;
    for(var i = 0; i < aLevelData[curLevel].aData.length; i++) {
        if(aLevelData[curLevel].aData[i].type == "userStart" + trackReverseId) {
            userCar = new Elements.UserCar({
                id: aCars.length,
                trackX: aLevelData[curLevel].aData[i].p0.x,
                trackY: aLevelData[curLevel].aData[i].p0.y,
                rot: aLevelData[curLevel].aData[i].p1.x
            });
            userCar.curPosId = aLevelData[curLevel].aData[i].p1.y;
            aCars.push(userCar);
        } else if(aLevelData[curLevel].aData[i].type == "wall") {
            aLines.push({
                p0: aLevelData[curLevel].aData[i].p0,
                p1: aLevelData[curLevel].aData[i].p1,
                b: 1,
                f: 1
            });
        } else if(aLevelData[curLevel].aData[i].type == "enemyStart" + trackReverseId) {
            var tempType = getEnemyCarType();
            var enemyCar = new Elements.EnemyCar({
                carTypeId: tempType,
                carVariation: getEnemyCarVariation(tempType),
                id: aCars.length,
                trackX: aLevelData[curLevel].aData[i].p0.x,
                trackY: aLevelData[curLevel].aData[i].p0.y,
                rot: aLevelData[curLevel].aData[i].p1.x
            });
            enemyCar.curDirId = enemyCar.curPosId = aLevelData[curLevel].aData[i].p1.y;
            aCars.push(enemyCar);
        } else if(aLevelData[curLevel].aData[i].type == "dirMarker") {
            aDirMarkers.push({
                pos: aLevelData[curLevel].aData[i].p0,
                id: aLevelData[curLevel].aData[i].p1.y
            });
        } else if(aLevelData[curLevel].aData[i].type == "trackSideObject") {
            var tso = new Elements.TrackSideObject();
            aTrackSideObjects.push(tso);
            tso.trackX = aLevelData[curLevel].aData[i].p0.x;
            tso.trackY = aLevelData[curLevel].aData[i].p0.y;
        } else if(aLevelData[curLevel].aData[i].type == "building") {
            var tso = new Elements.TrackSideObject();
            aTrackSideObjects.push(tso);
            tso.setAsBuilding();
            tso.trackX = aLevelData[curLevel].aData[i].p0.x;
            tso.trackY = aLevelData[curLevel].aData[i].p0.y;
        } else if(aLevelData[curLevel].aData[i].type == "barrier") {
            var tso = new Elements.TrackSideObject();
            aTrackSideObjects.push(tso);
            tso.setAsBarrier();
            tso.trackX = aLevelData[curLevel].aData[i].p0.x;
            tso.trackY = aLevelData[curLevel].aData[i].p0.y;
        } else if(aLevelData[curLevel].aData[i].type == "boost" || aLevelData[curLevel].aData[i].type == "oil") {
            aTrackTriggers.push({
                id: aLevelData[curLevel].aData[i].type,
                x: aLevelData[curLevel].aData[i].p0.x,
                y: aLevelData[curLevel].aData[i].p0.y
            });
        } else if(aLevelData[curLevel].aData[i].type == "finishLine" + trackReverseId) {
            oFinishLine = aLevelData[curLevel].aData[i].p0;
        }
    }
    for(var i = 0; i < aCars.length; i++) {
        aCars[i].id = i;
        if(trackReversed) {
            aCars[i].curDirId = aDirMarkers.length - aCars[i].curDirId;
            aCars[i].curPosId = aDirMarkers.length - aCars[i].curPosId;
        }
        if(aCars[i].carType == "enemy") {
            aCars[i].curDirId = aCars[i].curPosId % aDirMarkers.length;
        }
    }
    if(trackReversed) {
        aDirMarkers.sort(function (a, b) {
            return b.id - a.id;
        });
    } else {
        aDirMarkers.sort(function (a, b) {
            return a.id - b.id;
        });
    }
    physics2D = new Utils.Physics2D(aLines, aCars);
    aDeltaStore = new Array();
    deltaInc = -1;
    gameTime = 0;
    track = new Elements.Track();
    hud = new Elements.Hud();
    if(firstRun) {
        raceStartState = 0;
        hud.tweenTut(true);
        var oTickBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.tickBut,
            noMove: false
        };
        userInput.addHitArea("tickFromTut", butEventHandler, null, "image", oTickBut);
        panel.aButs.push(oTickBut);
    } else {
        raceStartState = 1;
        track.tweenStartSpin();
        hud.tweenLights(true);
    }
    steerPowerTarg = steerPower = 0;
    aEffects = new Array();
    previousTime = new Date().getTime();
    updateGameEvent();
}
function raceStarted() {
    hud.tweenLights(false);
    playSound("getaway");
    raceStartState = 2;
    track.centreOffset = 200;
    var oPauseBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -85, 
            30
        ],
        align: [
            1, 
            0
        ],
        id: oImageIds.pauseBut,
        noMove: true
    };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    panel.aButs = new Array(oPauseBut);
    addMuteBut(panel.aButs);
    userInput.addHitArea("steerLeft", butEventHandler, {
        multiTouch: true
    }, "rect", {
        aRect: [
            0, 
            60, 
            canvas.width / 2, 
            canvas.height
        ]
    }, true);
    userInput.addHitArea("steerRight", butEventHandler, {
        multiTouch: true
    }, "rect", {
        aRect: [
            canvas.width / 2, 
            60, 
            canvas.width, 
            canvas.height
        ]
    }, true);
    userInput.addKey("steerRight", butEventHandler, null, 39);
    userInput.addKey("steerLeft", butEventHandler, null, 37);
}
function getEnemyCarType() {
    var temp0 = Math.floor(Math.random() * aEnemyCarTypes.length);
    var temp1 = aEnemyCarTypes[temp0];
    aEnemyCarTypes.splice(temp0, 1);
    return temp1;
}
function getEnemyCarVariation(_id) {
    if(_id == curCar) {
        return 1;
    } else {
        return Math.floor(Math.random() * 2);
    }
}
function initPause() {
    gameState = "pause";
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            -62
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        noMove: true
    };
    var oRestartBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -85, 
            62
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.restartBut,
        noMove: true
    };
    var oQuitBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            85, 
            62
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.quitBut,
        noMove: true
    };
    userInput.addHitArea("resumeGameFromPause", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("restartGameFromPause", butEventHandler, null, "image", oRestartBut);
    userInput.addHitArea("quitGameFromPause", butEventHandler, null, "image", oQuitBut);
    var aButs = new Array(oBackBut, oQuitBut, oRestartBut);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    background = new Elements.Background();
    updatePauseEvent();
}
function resumeGame() {
    gameState = "game";
    timerInc = 0;
    background = new Elements.Background();
    var oPauseBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -85, 
            30
        ],
        align: [
            1, 
            0
        ],
        id: oImageIds.pauseBut,
        noMove: true
    };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    var aButs = new Array(oPauseBut);
    userInput.addHitArea("steerLeft", butEventHandler, {
        multiTouch: true
    }, "rect", {
        aRect: [
            0, 
            60, 
            canvas.width / 2, 
            canvas.height
        ]
    }, true);
    userInput.addHitArea("steerRight", butEventHandler, {
        multiTouch: true
    }, "rect", {
        aRect: [
            canvas.width / 2, 
            60, 
            canvas.width, 
            canvas.height
        ]
    }, true);
    userInput.addKey("steerRight", butEventHandler, null, 39);
    userInput.addKey("steerLeft", butEventHandler, null, 37);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameEvent();
}
function butEventHandler(_id, _oData) {
    if (typeof _oData === "undefined") { _oData = null; }
    switch(_id) {
        case "langSelect":
            curLang = _oData.lang;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            userInput.removeHitArea("langSelect");
            preAssetLib = new Utils.AssetLoader(curLang, [
                {
                    id: "preloadImage",
                    file: "images/preloadImage.jpg"
                }
            ], ctx, canvas.width, canvas.height, false);
            preAssetLib.onReady(initLoadAssets);
            break;
        case "moreGames":
        case "moreGamesPause":
            break;
        case "resetData":
            playSound("click");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            saveDataHandler.resetData();
            setCarData();
            getLevelData();
            getUserCarData();
            curCar = getDefaultUserCar();
            curLevelAll = getDefaultLevel();
            firstRun = true;
            curCash = saveDataHandler.aLevelStore[0];
            initStartScreen();
            break;
        case "playFromStart":
            playSound("click");
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("carSelectFromStart");
            userInput.removeHitArea("levelSelectFromStart");
            initGame();
            break;
        case "carSelectFromStart":
            playSound("click");
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("carSelectFromStart");
            userInput.removeHitArea("levelSelectFromStart");
            initCarSelect();
            break;
        case "levelSelectFromStart":
            playSound("click");
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("carSelectFromStart");
            userInput.removeHitArea("levelSelectFromStart");
            initLevelSelect();
            break;
        case "credits":
            playSound("click");
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("carSelectFromStart");
            userInput.removeHitArea("levelSelectFromStart");
            initCreditsScreen();
            break;
        case "backFromCredits":
            playSound("click");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "backFromCarSelect":
            playSound("click");
            userInput.removeHitArea("playFromCarSelect");
            userInput.removeHitArea("backFromCarSelect");
            userInput.removeHitArea("carSelectLeft");
            userInput.removeHitArea("carSelectRight");
            userInput.removeHitArea("upgradeFromCarSelect");
            userInput.removeHitArea("levelSelectFromCarSelect");
            if(curCar > getDefaultUserCar()) {
                curCar = getDefaultUserCar();
            }
            initStartScreen();
            break;
        case "carSelectLeft":
            if(curCar > 0) {
                curCar--;
                playSound("click");
                if(curCar < 0) {
                    curCar = 5;
                }
            }
            break;
        case "carSelectRight":
            if(curCar < aUserCarData.length - 1) {
                curCar++;
                playSound("click");
                if(curCar > 5) {
                    curCar = 0;
                }
            }
            break;
        case "playFromCarSelect":
            var canSelect = false;
            if(curCar == 0 || (curCar > 0 && getLevelsFinishedFirst() >= curCar * 2)) {
                canSelect = true;
            }
            if(canSelect) {
                userInput.removeHitArea("playFromCarSelect");
                userInput.removeHitArea("backFromCarSelect");
                userInput.removeHitArea("carSelectLeft");
                userInput.removeHitArea("carSelectRight");
                userInput.removeHitArea("upgradeFromCarSelect");
                userInput.removeHitArea("levelSelectFromCarSelect");
                playSound("click");
                initGame();
            }
            break;
        case "levelSelectFromCarSelect":
            playSound("click");
            userInput.removeHitArea("playFromCarSelect");
            userInput.removeHitArea("backFromCarSelect");
            userInput.removeHitArea("carSelectLeft");
            userInput.removeHitArea("carSelectRight");
            userInput.removeHitArea("upgradeFromCarSelect");
            userInput.removeHitArea("levelSelectFromCarSelect");
            if(curCar > getDefaultUserCar()) {
                curCar = getDefaultUserCar();
            }
            initLevelSelect();
            break;
        case "upgradeFromCarSelect":
            if(getLevelsFinishedFirst() >= curCar * 2) {
                playSound("click");
                userInput.removeHitArea("playFromCarSelect");
                userInput.removeHitArea("backFromCarSelect");
                userInput.removeHitArea("carSelectLeft");
                userInput.removeHitArea("carSelectRight");
                userInput.removeHitArea("upgradeFromCarSelect");
                userInput.removeHitArea("levelSelectFromCarSelect");
                initUpgrade();
            }
            break;
        case "playFromUpgrade":
            playSound("click");
            userInput.removeHitArea("playFromUpgrade");
            userInput.removeHitArea("backFromUpgrade");
            userInput.removeHitArea("upgrade");
            initGame();
            break;
        case "backFromUpgrade":
            playSound("click");
            userInput.removeHitArea("playFromUpgrade");
            userInput.removeHitArea("backFromUpgrade");
            userInput.removeHitArea("upgrade");
            initCarSelect();
            break;
        case "upgrade":
            if(curCash >= aUpgradeCosts[curCar][aUserCarData[curCar][_oData.id]] && aUserCarData[curCar][_oData.id] < 5) {
                curCash -= aUpgradeCosts[curCar][aUserCarData[curCar][_oData.id]];
                aUserCarData[curCar][_oData.id]++;
                playSound("buy");
                saveDataHandler.setData();
                saveDataHandler.saveData();
                setCarData();
                getUserCarData();
            }
            break;
        case "levelSelectLeft":
            if(curLevelAll > 0) {
                curLevelAll--;
                playSound("click");
                if(curLevelAll < 0) {
                    curLevelAll = totalLevels - 1;
                }
            }
            break;
        case "levelSelectRight":
            if(curLevelAll < aLevelResultData.length - 1) {
                curLevelAll++;
                playSound("click");
                if(curLevelAll > totalLevels - 1) {
                    curLevelAll = 0;
                }
            }
            break;
        case "playFromLevelSelect":
            var canSelect = false;
            if(curLevelAll > 0) {
                for(var j = 0; j < aLevelResultData[curLevelAll - 1].length; j++) {
                    if(aLevelResultData[curLevelAll - 1][j] < 4 && aLevelResultData[curLevelAll - 1][j] > 0) {
                        canSelect = true;
                        break;
                    }
                }
            } else {
                canSelect = true;
            }
            if(canSelect) {
                userInput.removeHitArea("playFromLevelSelect");
                userInput.removeHitArea("backFromLevelSelect");
                userInput.removeHitArea("levelSelectLeft");
                userInput.removeHitArea("levelSelectRight");
                userInput.removeHitArea("carSelectFromLevelSelect");
                playSound("click");
                initGame();
            }
            break;
        case "backFromLevelSelect":
            playSound("click");
            userInput.removeHitArea("playFromLevelSelect");
            userInput.removeHitArea("backFromLevelSelect");
            userInput.removeHitArea("levelSelectLeft");
            userInput.removeHitArea("levelSelectRight");
            userInput.removeHitArea("carSelectFromLevelSelect");
            if(curLevelAll > getDefaultLevel()) {
                curLevelAll = getDefaultLevel();
            }
            initStartScreen();
            break;
        case "carSelectFromLevelSelect":
            playSound("click");
            userInput.removeHitArea("playFromLevelSelect");
            userInput.removeHitArea("backFromLevelSelect");
            userInput.removeHitArea("levelSelectLeft");
            userInput.removeHitArea("levelSelectRight");
            userInput.removeHitArea("carSelectFromLevelSelect");
            if(curLevelAll > getDefaultLevel()) {
                curLevelAll = getDefaultLevel();
            }
            initCarSelect();
            break;
        case "tickFromTut":
            playSound("click");
            userInput.removeHitArea("tickFromTut");
            firstRun = false;
            for(var i = 0; i < panel.aButs.length; i++) {
                if(panel.aButs[i].id == oImageIds.tickBut) {
                    panel.aButs.splice(i, 1);
                }
            }
            hud.tweenTut(false);
            break;
        case "steerLeft":
            if(_oData.isDown) {
                leftSteer = 1;
                rightSteer = 0;
            } else {
                leftSteer = 0;
            }
            break;
        case "steerRight":
            if(_oData.isDown) {
                rightSteer = -1;
                leftSteer = 0;
            } else {
                rightSteer = 0;
            }
            break;
        case "playFromRaceComplete":
            playSound("click");
            userInput.removeHitArea("playFromRaceComplete");
            userInput.removeHitArea("upgradeFromRaceComplete");
            userInput.removeHitArea("newCarFromRaceComplete");
            userInput.removeHitArea("restartFromRaceComplete");
            userInput.removeHitArea("backFromRaceComplete");
            curLevelAll++;
            if(curLevelAll > aLevelResultData.length - 1) {
                curLevelAll = 0;
                initStartScreen();
            } else {
                initGame();
            }
            break;
        case "upgradeFromRaceComplete":
            playSound("click");
            userInput.removeHitArea("playFromRaceComplete");
            userInput.removeHitArea("upgradeFromRaceComplete");
            userInput.removeHitArea("newCarFromRaceComplete");
            userInput.removeHitArea("restartFromRaceComplete");
            userInput.removeHitArea("backFromRaceComplete");
            if(raceEndPosition < 3) {
                curLevelAll++;
                if(curLevelAll > aLevelResultData.length - 1) {
                    curLevelAll = 0;
                }
            }
            initUpgrade();
            break;
        case "newCarFromRaceComplete":
            playSound("newCar");
            userInput.removeHitArea("playFromRaceComplete");
            userInput.removeHitArea("upgradeFromRaceComplete");
            userInput.removeHitArea("newCarFromRaceComplete");
            userInput.removeHitArea("restartFromRaceComplete");
            userInput.removeHitArea("backFromRaceComplete");
            curLevelAll++;
            if(curLevelAll > aLevelResultData.length - 1) {
                curLevelAll = 0;
            }
            curCar = getLevelsFinishedFirst() / 2;
            initCarSelect();
            break;
        case "restartFromRaceComplete":
            playSound("click");
            userInput.removeHitArea("playFromRaceComplete");
            userInput.removeHitArea("upgradeFromRaceComplete");
            userInput.removeHitArea("newCarFromRaceComplete");
            userInput.removeHitArea("restartFromRaceComplete");
            userInput.removeHitArea("backFromRaceComplete");
            initGame();
            break;
        case "backFromRaceComplete":
            playSound("click");
            userInput.removeHitArea("playFromRaceComplete");
            userInput.removeHitArea("upgradeFromRaceComplete");
            userInput.removeHitArea("newCarFromRaceComplete");
            userInput.removeHitArea("restartFromRaceComplete");
            userInput.removeHitArea("backFromRaceComplete");
            if(raceEndPosition < 3) {
                curLevelAll++;
                if(curLevelAll > aLevelResultData.length - 1) {
                    curLevelAll = 0;
                }
            }
            initStartScreen();
            break;
        case "mute":
            playSound("click");
            toggleMute();
            if(muted) {
                panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1);
            } else {
                panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0);
            }
            break;
        case "pause":
            playSound("click");
            if(audioType == 1) {
                Howler.mute(true);
                music.pause();
            } else if(audioType == 2) {
                music.pause();
            }
            userInput.removeHitArea("steerLeft");
            userInput.removeHitArea("steerRight");
            userInput.removeKey("steerRight");
            userInput.removeKey("steerLeft");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("pause");
            initPause();
            break;
        case "resumeGameFromPause":
            playSound("click");
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    music.play();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    music.play();
                }
            }
            userInput.removeHitArea("quitGameFromPause");
            userInput.removeHitArea("resumeGameFromPause");
            userInput.removeHitArea("restartGameFromPause");
            resumeGame();
            break;
        case "quitGameFromPause":
            playSound("click");
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    music.play();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    music.play();
                }
            }
            userInput.removeHitArea("quitGameFromPause");
            userInput.removeHitArea("resumeGameFromPause");
            userInput.removeHitArea("restartGameFromPause");
            initStartScreen();
            break;
        case "restartGameFromPause":
            playSound("click");
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    music.play();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    music.play();
                }
            }
            userInput.removeHitArea("quitGameFromPause");
            userInput.removeHitArea("resumeGameFromPause");
            userInput.removeHitArea("restartGameFromPause");
            initGame();
            break;
    }
}
function addSmoke(_x, _y, _id, _scale) {
    if (typeof _id === "undefined") { _id = "smoke"; }
    if (typeof _scale === "undefined") { _scale = 1; }
    if(aEffects.length > 20) {
        return;
    }
    var animId = "explode";
    var smoke = new Elements.Smoke(assetLib.getData(_id), animId);
    smoke.trackX = _x;
    smoke.trackY = _y;
    smoke.scaleX = smoke.scaleY = _scale;
    aEffects.push(smoke);
}
function checkPositions() {
    var temp;
    for(var i = 0; i < aCars.length; i++) {
        temp = 5;
        for(var j = 0; j < aCars.length; j++) {
            if(aCars[i].id != aCars[j].id && aCars[i].curPosId > aCars[j].curPosId || (aCars[i].curPosId == aCars[j].curPosId && aCars[i].dirMarkerTime < aCars[j].dirMarkerTime)) {
                temp--;
            }
            aCars[i].positionNum = temp;
        }
    }
}
function crossedFinishLine() {
    raceStartState = 3;
    userInput.removeHitArea("steerLeft");
    userInput.removeHitArea("steerRight");
    userInput.removeKey("steerRight");
    userInput.removeKey("steerLeft");
    userInput.removeHitArea("pause");
    playSound("endRace");
    aEffects = new Array();
    for(var i = 0; i < 3; i++) {
        addFirework(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 2);
    }
    raceEndPosition = userCar.positionNum;
    curWinnings = Math.round(aWinningsData[curLevelAll] / (raceEndPosition + 1));
    curCash += curWinnings;
    wonBonusCar = false;
    if((getLevelsFinishedFirst() + 1) % 2 == 0 && getLevelsFinishedFirst() < 10 && raceEndPosition == 0) {
        wonBonusCar = true;
        for(var i = 0; i < aLevelResultData[curLevelAll].length; i++) {
            if(aLevelResultData[curLevelAll][i] == 1) {
                wonBonusCar = false;
                break;
            }
        }
    }
    if(raceEndPosition + 1 < aLevelResultData[curLevelAll][curCar] || aLevelResultData[curLevelAll][curCar] == 0) {
        aLevelResultData[curLevelAll][curCar] = raceEndPosition + 1;
        saveDataHandler.setData();
        saveDataHandler.saveData();
    }
}
function getLevelsFinishedFirst() {
    var tempNum = 0;
    for(var i = 0; i < aLevelResultData.length; i++) {
        for(var j = 0; j < aLevelResultData[i].length; j++) {
            if(aLevelResultData[i][j] == 1) {
                tempNum += 1;
                break;
            }
        }
    }
    return tempNum;
}
function raceComplete() {
    gameState = "raceComplete";
    if(audioType == 1) {
        music.fade(music.volume(), .25, 2000);
    }
    background = new Elements.Background();
    if(wonBonusCar) {
        var oPlayBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.playBut,
            noMove: true
        };
        var oUpgradeBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                150, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.upgradeBut,
            noMove: true
        };
        var oNewCarBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -150, 
                170
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds["newCarBut" + (getLevelsFinishedFirst() / 2 - 1)],
            noMove: false
        };
        var oBackBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                30, 
                -30
            ],
            align: [
                0, 
                1
            ],
            id: oImageIds.backBut,
            noMove: true
        };
        userInput.addHitArea("playFromRaceComplete", butEventHandler, null, "image", oPlayBut);
        userInput.addHitArea("upgradeFromRaceComplete", butEventHandler, null, "image", oUpgradeBut);
        userInput.addHitArea("newCarFromRaceComplete", butEventHandler, null, "image", oNewCarBut);
        userInput.addHitArea("backFromRaceComplete", butEventHandler, null, "image", oBackBut);
        var aButs = new Array(oPlayBut, oUpgradeBut, oNewCarBut, oBackBut);
    } else if(raceEndPosition < 3) {
        var oPlayBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.playBut,
            noMove: false
        };
        var oUpgradeBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                150, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.upgradeBut,
            noMove: true
        };
        var oRestartBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -150, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.smallRestartBut,
            noMove: true
        };
        var oBackBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                30, 
                -30
            ],
            align: [
                0, 
                1
            ],
            id: oImageIds.backBut,
            noMove: true
        };
        userInput.addHitArea("playFromRaceComplete", butEventHandler, null, "image", oPlayBut);
        userInput.addHitArea("upgradeFromRaceComplete", butEventHandler, null, "image", oUpgradeBut);
        userInput.addHitArea("restartFromRaceComplete", butEventHandler, null, "image", oRestartBut);
        userInput.addHitArea("backFromRaceComplete", butEventHandler, null, "image", oBackBut);
        var aButs = new Array(oPlayBut, oUpgradeBut, oRestartBut, oBackBut);
    } else {
        var oRestartBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.restartBut,
            noMove: false
        };
        var oUpgradeBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                150, 
                190
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.upgradeBut,
            noMove: true
        };
        var oBackBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                30, 
                -30
            ],
            align: [
                0, 
                1
            ],
            id: oImageIds.backBut,
            noMove: true
        };
        userInput.addHitArea("restartFromRaceComplete", butEventHandler, null, "image", oRestartBut);
        userInput.addHitArea("upgradeFromRaceComplete", butEventHandler, null, "image", oUpgradeBut);
        userInput.addHitArea("backFromRaceComplete", butEventHandler, null, "image", oBackBut);
        var aButs = new Array(oRestartBut, oUpgradeBut, oBackBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateRaceCompleteEvent();
}
function addFirework(_x, _y, _scale) {
    if (typeof _scale === "undefined") { _scale = 1; }
    if(aEffects.length > 10) {
        return;
    }
    var firework = new Elements.Firework();
    firework.x = _x;
    firework.y = _y;
    firework.scaleX = firework.scaleY = _scale;
    aEffects.push(firework);
}
function updateGameEvent() {
    if(gameState != "game") {
        return;
    }
    if(raceStartState < 2) {
        timerInc -= delta;
        if(timerInc <= 0) {
            playSound("rev" + Math.floor(Math.random() * 2));
            timerInc = Math.random() * .5 + .2;
        }
    } else if(raceStartState == 2) {
        timerInc -= delta;
        if(timerInc <= 0) {
            playSound("engine" + Math.floor(Math.random() * 3));
            timerInc = Math.random() * 1.5 + 3;
        }
    }
    delta = getDelta();
    gameTime += delta;
    aDeltaStore[++deltaInc % 20] = delta;
    var totDelta = 0;
    for(var i = 0; i < aDeltaStore.length; i++) {
        totDelta += aDeltaStore[i];
    }
    var avDelta = totDelta / aDeltaStore.length;
    track.render();
    if(sortFlipFlop) {
        aCars.sort(function (a, b) {
            return a.y - b.y;
        });
        aTrackSideObjects.sort(function (a, b) {
            return a.y - b.y;
        });
        sortFlipFlop = !sortFlipFlop;
    } else {
        sortFlipFlop = !sortFlipFlop;
    }
    for(var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render(ctx);
        if(aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    var a;
    var b;
    var hyp;
    var newAngle;
    for(var i = 0; i < aCars.length; i++) {
        aCars[i].update();
        aCars[i].render();
        if(aCars[i].carType == "enemy") {
            for(var j = 0; j < aCars.length; j++) {
                var oTemp = checkSpriteCollision(aCars[i], aCars[j]);
                if(aCars[i] != aCars[j] && aCars[i].canHit && aCars[j].canHit) {
                    if(oTemp.hasHit) {
                        newAngle = (Math.atan2(oTemp.b, oTemp.a) + 0 * radian);
                        var bouncePower = Math.max(0.18, ((aCars[i].oCarHyps[aCars[j].id] - oTemp.hyp) / avDelta) / 120);
                        playSound("thud" + Math.floor(Math.random() * 4));
                        if(carInPlay && aCars[j] == userCar) {
                            addSmoke(aCars[j].trackX, aCars[j].trackY);
                            aCars[i].hitCar(newAngle, 1, bouncePower * 1.25);
                            aCars[j].hitCar(newAngle - (180 * radian), bouncePower * .65);
                        } else {
                            addSmoke(aCars[j].trackX, aCars[j].trackY);
                            aCars[i].hitCar(newAngle, 0, bouncePower);
                            aCars[j].hitCar(newAngle - (180 * radian), 0, bouncePower);
                        }
                    }
                }
                aCars[i].oCarHyps[aCars[j].id] = oTemp.hyp;
            }
        }
    }
    for(var i = 0; i < aTrackSideObjects.length; i++) {
        aTrackSideObjects[i].render();
    }
    hud.render();
    panel.update();
    panel.render();
    if(raceStartState == 3 && Math.random() < .1) {
        playSound("firework");
        addFirework(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 2);
    }
    physics2D.update(delta);
    requestAnimFrame(updateGameEvent);
}
function updateCreditsScreenEvent() {
    if(gameState != "credits") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.font = "15px Helvetica";
    ctx.fillText("v1.0.2", canvas.width / 2, canvas.height - 20);
    requestAnimFrame(updateCreditsScreenEvent);
}
function updateLevelComplete() {
    if(gameState != "levelComplete") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.render();
    requestAnimFrame(updateLevelComplete);
}
function updateCarSelectScreenEvent() {
    if(gameState != "carSelect") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateCarSelectScreenEvent);
}
function updateLevelSelectScreenEvent() {
    if(gameState != "levelSelect") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateLevelSelectScreenEvent);
}
function updateSplashScreenEvent() {
    if(gameState != "splash") {
        return;
    }
    delta = getDelta();
    splashTimer += delta;
    if(splashTimer > 2.5) {
        if(audioType == 1 && !muted) {
            music.play();
        }
        initStartScreen();
        return;
    }
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateSplashScreenEvent);
}
function updateStartScreenEvent() {
    if(gameState != "start") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateStartScreenEvent);
}
function updateUpgradeScreenEvent() {
    if(gameState != "upgrade") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateUpgradeScreenEvent);
}
function updateRaceCompleteEvent() {
    if(gameState != "raceComplete") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    requestAnimFrame(updateRaceCompleteEvent);
}
function updateLoaderEvent() {
    if(gameState != "loading") {
        return;
    }
    delta = getDelta();
    assetLib.render();
    requestAnimFrame(updateLoaderEvent);
}
function updatePauseEvent() {
    if(gameState != "pause") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.render();
    requestAnimFrame(updatePauseEvent);
}
function getDelta() {
    var currentTime = new Date().getTime();
    var deltaTemp = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if(deltaTemp > .5) {
        deltaTemp = 0;
    }
    return deltaTemp;
}
function checkSpriteCollision(_s1, _s2) {
    var s1XOffset = _s1.trackX;
    var s1YOffset = _s1.trackY;
    var s2XOffset = _s2.trackX;
    var s2YOffset = _s2.trackY;
    var distance_squared = (((s1XOffset - s2XOffset) * (s1XOffset - s2XOffset)) + ((s1YOffset - s2YOffset) * (s1YOffset - s2YOffset)));
    var radii_squared = (_s1.carHitRadius) * (_s2.carHitRadius);
    if(distance_squared < radii_squared) {
        return {
            hasHit: true,
            hyp: Math.sqrt(distance_squared),
            a: (s1XOffset - s2XOffset),
            b: (s1YOffset - s2YOffset)
        };
    } else {
        return {
            hasHit: false,
            hyp: Math.sqrt(distance_squared),
            a: (s1XOffset - s2XOffset),
            b: (s1YOffset - s2YOffset)
        };
    }
}
function getScaleImageToMax(_oImgData, _aLimit) {
    var newScale;
    if(_oImgData.isSpriteSheet) {
        if(_aLimit[0] / _oImgData.oData.spriteWidth < _aLimit[1] / _oImgData.oData.spriteHeight) {
            newScale = Math.min(_aLimit[0] / _oImgData.oData.spriteWidth, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.oData.spriteHeight, 1);
        }
    } else {
        if(_aLimit[0] / _oImgData.img.width < _aLimit[1] / _oImgData.img.height) {
            newScale = Math.min(_aLimit[0] / _oImgData.img.width, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.img.height, 1);
        }
    }
    return newScale;
}
function getCentreFromTopLeft(_aTopLeft, _oImgData, _imgScale) {
    var aCentre = new Array();
    aCentre.push(_aTopLeft[0] + (_oImgData.oData.spriteWidth / 2) * _imgScale);
    aCentre.push(_aTopLeft[1] + (_oImgData.oData.spriteHeight / 2) * _imgScale);
    return aCentre;
}
function loadPreAssets() {
    preAssetLib = new Utils.AssetLoader(curLang, [
        {
            id: "loader",
            file: "images/preloader.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 0,
                    width: 792,
                    height: 102
                },
                id1: {
                    x: 0,
                    y: 104,
                    width: 778,
                    height: 81
                },
                id2: {
                    x: 0,
                    y: 187,
                    width: 520,
                    height: 335
                }
            }
        }
    ], ctx, canvas.width, canvas.height, false);
    oImageIds.overBar = "id0";
    oImageIds.underBar = "id1";
    oImageIds.preloaderLogo = "id2";
    preAssetLib.onReady(initLoadAssets);
}
function initLangSelect() {
    var oImgData;
    var j;
    var k;
    var gap = 10;
    var tileWidthNum = 0;
    var tileHeightNum = 0;
    var butScale = 1;
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        if((i + 1) * (oImgData.img.width * butScale) + (i + 2) * gap < canvas.width) {
            tileWidthNum++;
        } else {
            break;
        }
    }
    tileHeightNum = Math.ceil(aLangs.length / tileWidthNum);
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        j = canvas.width / 2 - (tileWidthNum / 2) * (oImgData.img.width * butScale) - ((tileWidthNum - 1) / 2) * gap;
        j += (i % tileWidthNum) * ((oImgData.img.width * butScale) + gap);
        k = canvas.height / 2 - (tileHeightNum / 2) * (oImgData.img.height * butScale) - ((tileHeightNum - 1) / 2) * gap;
        k += (Math.floor(i / tileWidthNum) % tileHeightNum) * ((oImgData.img.height * butScale) + gap);
        ctx.drawImage(oImgData.img, 0, 0, oImgData.img.width, oImgData.img.height, j, k, (oImgData.img.width * butScale), (oImgData.img.height * butScale));
        var oBut = {
            oImgData: oImgData,
            aPos: [
                j + (oImgData.img.width * butScale) / 2, 
                k + (oImgData.img.height * butScale) / 2
            ],
            scale: butScale,
            id: "none",
            noMove: true
        };
        userInput.addHitArea("langSelect", butEventHandler, {
            lang: aLangs[i]
        }, "image", oBut);
    }
}
function initLoadAssets() {
    loadAssets();
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [
        {
            id: "background",
            file: "images/bgMain.jpg"
        }, 
        {
            id: "splashLogo",
            file: "images/splashLogo.png"
        }, 
        {
            id: "track0",
            file: "images/track0.jpg"
        }, 
        {
            id: "track1",
            file: "images/track1.jpg"
        }, 
        {
            id: "track2",
            file: "images/track2.jpg"
        }, 
        {
            id: "track3",
            file: "images/track3.jpg"
        }, 
        {
            id: "track4",
            file: "images/track4.jpg"
        }, 
        {
            id: "track5",
            file: "images/track5.jpg"
        }, 
        {
            id: "track6",
            file: "images/track6.jpg"
        }, 
        {
            id: "uiButs",
            file: "images/uiButs.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 391,
                    width: 140,
                    height: 95
                },
                id1: {
                    x: 462,
                    y: 0,
                    width: 55,
                    height: 55
                },
                id10: {
                    x: 356,
                    y: 349,
                    width: 103,
                    height: 66
                },
                id11: {
                    x: 460,
                    y: 67,
                    width: 66,
                    height: 103
                },
                id12: {
                    x: 457,
                    y: 417,
                    width: 66,
                    height: 103
                },
                id13: {
                    x: 352,
                    y: 471,
                    width: 103,
                    height: 65
                },
                id14: {
                    x: 357,
                    y: 0,
                    width: 103,
                    height: 65
                },
                id15: {
                    x: 382,
                    y: 242,
                    width: 103,
                    height: 65
                },
                id16: {
                    x: 248,
                    y: 214,
                    width: 103,
                    height: 65
                },
                id17: {
                    x: 247,
                    y: 471,
                    width: 103,
                    height: 65
                },
                id18: {
                    x: 143,
                    y: 214,
                    width: 103,
                    height: 65
                },
                id19: {
                    x: 0,
                    y: 196,
                    width: 141,
                    height: 95
                },
                id2: {
                    x: 461,
                    y: 309,
                    width: 55,
                    height: 55
                },
                id20: {
                    x: 250,
                    y: 0,
                    width: 105,
                    height: 105
                },
                id21: {
                    x: 277,
                    y: 281,
                    width: 103,
                    height: 66
                },
                id22: {
                    x: 142,
                    y: 471,
                    width: 103,
                    height: 66
                },
                id23: {
                    x: 250,
                    y: 107,
                    width: 103,
                    height: 66
                },
                id24: {
                    x: 353,
                    y: 175,
                    width: 103,
                    height: 65
                },
                id25: {
                    x: 143,
                    y: 107,
                    width: 105,
                    height: 105
                },
                id26: {
                    x: 249,
                    y: 364,
                    width: 105,
                    height: 105
                },
                id27: {
                    x: 142,
                    y: 364,
                    width: 105,
                    height: 105
                },
                id28: {
                    x: 143,
                    y: 0,
                    width: 105,
                    height: 105
                },
                id29: {
                    x: 0,
                    y: 293,
                    width: 140,
                    height: 96
                },
                id3: {
                    x: 458,
                    y: 175,
                    width: 55,
                    height: 55
                },
                id30: {
                    x: 355,
                    y: 107,
                    width: 103,
                    height: 66
                },
                id4: {
                    x: 487,
                    y: 232,
                    width: 55,
                    height: 55
                },
                id5: {
                    x: 0,
                    y: 488,
                    width: 55,
                    height: 55
                },
                id6: {
                    x: 57,
                    y: 488,
                    width: 55,
                    height: 55
                },
                id7: {
                    x: 0,
                    y: 98,
                    width: 141,
                    height: 96
                },
                id8: {
                    x: 0,
                    y: 0,
                    width: 141,
                    height: 96
                },
                id9: {
                    x: 142,
                    y: 293,
                    width: 133,
                    height: 69
                }
            }
        }, 
        {
            id: "uiElements",
            file: "images/uiElements.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 1384,
                    width: 1,
                    height: 1
                },
                id1: {
                    x: 0,
                    y: 429,
                    width: 355,
                    height: 427
                },
                id10: {
                    x: 0,
                    y: 1339,
                    width: 45,
                    height: 43
                },
                id11: {
                    x: 996,
                    y: 0,
                    width: 300,
                    height: 310
                },
                id12: {
                    x: 996,
                    y: 624,
                    width: 300,
                    height: 310
                },
                id13: {
                    x: 694,
                    y: 498,
                    width: 300,
                    height: 310
                },
                id14: {
                    x: 996,
                    y: 312,
                    width: 300,
                    height: 310
                },
                id15: {
                    x: 996,
                    y: 936,
                    width: 300,
                    height: 310
                },
                id16: {
                    x: 694,
                    y: 186,
                    width: 300,
                    height: 310
                },
                id17: {
                    x: 694,
                    y: 810,
                    width: 300,
                    height: 310
                },
                id18: {
                    x: 0,
                    y: 0,
                    width: 356,
                    height: 427
                },
                id19: {
                    x: 118,
                    y: 1339,
                    width: 22,
                    height: 21
                },
                id2: {
                    x: 0,
                    y: 1287,
                    width: 181,
                    height: 24
                },
                id20: {
                    x: 88,
                    y: 1339,
                    width: 28,
                    height: 27
                },
                id21: {
                    x: 358,
                    y: 186,
                    width: 323,
                    height: 176
                },
                id22: {
                    x: 357,
                    y: 615,
                    width: 335,
                    height: 184
                },
                id23: {
                    x: 358,
                    y: 0,
                    width: 335,
                    height: 184
                },
                id24: {
                    x: 357,
                    y: 1173,
                    width: 335,
                    height: 184
                },
                id25: {
                    x: 357,
                    y: 987,
                    width: 335,
                    height: 184
                },
                id26: {
                    x: 357,
                    y: 801,
                    width: 335,
                    height: 184
                },
                id27: {
                    x: 357,
                    y: 429,
                    width: 335,
                    height: 184
                },
                id28: {
                    x: 695,
                    y: 0,
                    width: 104,
                    height: 137
                },
                id29: {
                    x: 694,
                    y: 1248,
                    width: 112,
                    height: 137
                },
                id3: {
                    x: 0,
                    y: 1313,
                    width: 181,
                    height: 24
                },
                id30: {
                    x: 1036,
                    y: 1248,
                    width: 112,
                    height: 137
                },
                id31: {
                    x: 694,
                    y: 1122,
                    width: 88,
                    height: 110
                },
                id4: {
                    x: 183,
                    y: 1287,
                    width: 43,
                    height: 47
                },
                id5: {
                    x: 0,
                    y: 858,
                    width: 355,
                    height: 427
                },
                id6: {
                    x: 808,
                    y: 1248,
                    width: 112,
                    height: 137
                },
                id7: {
                    x: 1150,
                    y: 1248,
                    width: 112,
                    height: 137
                },
                id8: {
                    x: 922,
                    y: 1248,
                    width: 112,
                    height: 137
                },
                id9: {
                    x: 47,
                    y: 1339,
                    width: 39,
                    height: 37
                }
            }
        }, 
        {
            id: "gameElements",
            file: "images/gameElements.png",
            oAtlasData: {
                id0: {
                    x: 671,
                    y: 0,
                    width: 73,
                    height: 72
                },
                id1: {
                    x: 612,
                    y: 326,
                    width: 100,
                    height: 74
                },
                id10: {
                    x: 304,
                    y: 656,
                    width: 302,
                    height: 117
                },
                id11: {
                    x: 0,
                    y: 894,
                    width: 302,
                    height: 117
                },
                id12: {
                    x: 0,
                    y: 775,
                    width: 302,
                    height: 117
                },
                id13: {
                    x: 0,
                    y: 0,
                    width: 453,
                    height: 225
                },
                id14: {
                    x: 0,
                    y: 1013,
                    width: 189,
                    height: 52
                },
                id15: {
                    x: 738,
                    y: 492,
                    width: 128,
                    height: 164
                },
                id16: {
                    x: 717,
                    y: 326,
                    width: 128,
                    height: 164
                },
                id17: {
                    x: 608,
                    y: 609,
                    width: 128,
                    height: 164
                },
                id18: {
                    x: 612,
                    y: 152,
                    width: 136,
                    height: 172
                },
                id19: {
                    x: 579,
                    y: 434,
                    width: 136,
                    height: 173
                },
                id2: {
                    x: 550,
                    y: 1008,
                    width: 101,
                    height: 74
                },
                id20: {
                    x: 653,
                    y: 946,
                    width: 68,
                    height: 60
                },
                id21: {
                    x: 671,
                    y: 74,
                    width: 68,
                    height: 75
                },
                id22: {
                    x: 358,
                    y: 605,
                    width: 39,
                    height: 49
                },
                id23: {
                    x: 850,
                    y: 1008,
                    width: 79,
                    height: 74
                },
                id24: {
                    x: 979,
                    y: 0,
                    width: 83,
                    height: 139
                },
                id25: {
                    x: 868,
                    y: 332,
                    width: 107,
                    height: 180
                },
                id26: {
                    x: 887,
                    y: 514,
                    width: 107,
                    height: 162
                },
                id27: {
                    x: 887,
                    y: 678,
                    width: 107,
                    height: 162
                },
                id28: {
                    x: 773,
                    y: 844,
                    width: 107,
                    height: 162
                },
                id29: {
                    x: 847,
                    y: 186,
                    width: 107,
                    height: 144
                },
                id3: {
                    x: 445,
                    y: 982,
                    width: 103,
                    height: 73
                },
                id30: {
                    x: 882,
                    y: 844,
                    width: 107,
                    height: 144
                },
                id31: {
                    x: 870,
                    y: 0,
                    width: 107,
                    height: 144
                },
                id32: {
                    x: 991,
                    y: 842,
                    width: 80,
                    height: 142
                },
                id33: {
                    x: 977,
                    y: 146,
                    width: 106,
                    height: 235
                },
                id34: {
                    x: 977,
                    y: 383,
                    width: 40,
                    height: 121
                },
                id35: {
                    x: 455,
                    y: 0,
                    width: 214,
                    height: 150
                },
                id36: {
                    x: 318,
                    y: 1051,
                    width: 47,
                    height: 27
                },
                id37: {
                    x: 358,
                    y: 227,
                    width: 252,
                    height: 205
                },
                id38: {
                    x: 304,
                    y: 775,
                    width: 255,
                    height: 205
                },
                id39: {
                    x: 0,
                    y: 227,
                    width: 356,
                    height: 427
                },
                id4: {
                    x: 653,
                    y: 1008,
                    width: 97,
                    height: 72
                },
                id40: {
                    x: 561,
                    y: 775,
                    width: 210,
                    height: 169
                },
                id41: {
                    x: 358,
                    y: 434,
                    width: 219,
                    height: 169
                },
                id42: {
                    x: 773,
                    y: 658,
                    width: 112,
                    height: 184
                },
                id43: {
                    x: 750,
                    y: 0,
                    width: 118,
                    height: 184
                },
                id44: {
                    x: 191,
                    y: 1013,
                    width: 125,
                    height: 67
                },
                id45: {
                    x: 367,
                    y: 1051,
                    width: 18,
                    height: 31
                },
                id5: {
                    x: 750,
                    y: 186,
                    width: 92,
                    height: 73
                },
                id6: {
                    x: 752,
                    y: 1008,
                    width: 96,
                    height: 74
                },
                id7: {
                    x: 455,
                    y: 152,
                    width: 101,
                    height: 73
                },
                id8: {
                    x: 318,
                    y: 982,
                    width: 125,
                    height: 67
                },
                id9: {
                    x: 0,
                    y: 656,
                    width: 302,
                    height: 117
                }
            }
        }, 
        {
            id: "car00",
            file: "images/car00_89x67.png"
        }, 
        {
            id: "car10",
            file: "images/car10_89x67.png"
        }, 
        {
            id: "car20",
            file: "images/car20_89x67.png"
        }, 
        {
            id: "car30",
            file: "images/car30_89x67.png"
        }, 
        {
            id: "car40",
            file: "images/car40_89x67.png"
        }, 
        {
            id: "car50",
            file: "images/car50_89x67.png"
        }, 
        {
            id: "car01",
            file: "images/car01_89x67.png"
        }, 
        {
            id: "car11",
            file: "images/car11_89x67.png"
        }, 
        {
            id: "car21",
            file: "images/car21_89x67.png"
        }, 
        {
            id: "car31",
            file: "images/car31_89x67.png"
        }, 
        {
            id: "car41",
            file: "images/car41_89x67.png"
        }, 
        {
            id: "car51",
            file: "images/car51_89x67.png"
        }, 
        {
            id: "shadow",
            file: "images/shadow_89x67.png"
        }, 
        {
            id: "lapNumbers",
            file: "images/lapNumbers_44x51.png"
        }, 
        {
            id: "coinNumbers",
            file: "images/coinNumbers_48x56.png"
        }, 
        {
            id: "smoke",
            file: "images/smoke_50x51.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12
                ]
            }
        }, 
        {
            id: "oilPuff",
            file: "images/oilPuff_50x51.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12
                ]
            }
        }, 
        {
            id: "icePuff",
            file: "images/icePuff_50x51.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12
                ]
            }
        }, 
        {
            id: "fire",
            file: "images/fire_50x51.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12
                ]
            }
        }, 
        {
            id: "firework0",
            file: "images/firework0_175x175.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12, 
                    13, 
                    14, 
                    15, 
                    16, 
                    17, 
                    18, 
                    19, 
                    20, 
                    21, 
                    22, 
                    23, 
                    24, 
                    25, 
                    26, 
                    27, 
                    28, 
                    29
                ]
            }
        }, 
        {
            id: "credits",
            file: "images/credits.png"
        }, 
        {
            id: "title",
            file: "images/title/" + curLang + ".png"
        }
    ], ctx, canvas.width, canvas.height);
    oImageIds.playBut = "id0";
    oImageIds.resetBut = "id1";
    oImageIds.backBut = "id2";
    oImageIds.muteBut0 = "id3";
    oImageIds.muteBut1 = "id4";
    oImageIds.pauseBut = "id5";
    oImageIds.infoBut = "id6";
    oImageIds.restartBut = "id7";
    oImageIds.quitBut = "id8";
    oImageIds.moreGamesBut = "id9";
    oImageIds.upgradeBut = "id10";
    oImageIds.leftBut = "id11";
    oImageIds.rightBut = "id12";
    oImageIds.upgradeBut0 = "id13";
    oImageIds.upgradeBut2 = "id14";
    oImageIds.upgradeBut1 = "id15";
    oImageIds.upgradeBut3 = "id16";
    oImageIds.carSelectBut = "id17";
    oImageIds.levelSelectBut = "id18";
    oImageIds.lockedBut = "id19";
    oImageIds.newCarBut0 = "id20";
    oImageIds.upgradeButDim0 = "id21";
    oImageIds.upgradeButDim2 = "id22";
    oImageIds.upgradeButDim1 = "id23";
    oImageIds.upgradeButDim3 = "id24";
    oImageIds.newCarBut1 = "id25";
    oImageIds.newCarBut2 = "id26";
    oImageIds.newCarBut3 = "id27";
    oImageIds.newCarBut4 = "id28";
    oImageIds.tickBut = "id29";
    oImageIds.smallRestartBut = "id30";
    oImageIds.carSelectPanel = "id1";
    oImageIds.carSelectBar0 = "id2";
    oImageIds.carSelectBar1 = "id3";
    oImageIds.coin = "id4";
    oImageIds.levelSelectPanel = "id5";
    oImageIds.cupBlank = "id6";
    oImageIds.cupThird = "id7";
    oImageIds.cupSecond = "id8";
    oImageIds.star1 = "id9";
    oImageIds.star0 = "id10";
    oImageIds.levelPreview0 = "id11";
    oImageIds.levelPreview1 = "id12";
    oImageIds.levelPreview2 = "id13";
    oImageIds.levelPreview3 = "id14";
    oImageIds.levelPreview4 = "id15";
    oImageIds.levelPreview5 = "id16";
    oImageIds.levelPreview6 = "id17";
    oImageIds.upgradePanel = "id18";
    oImageIds.upgradeDot1 = "id19";
    oImageIds.upgradeDot0 = "id20";
    oImageIds.endFlare = "id21";
    oImageIds.heroCar0 = "id22";
    oImageIds.heroCar1 = "id23";
    oImageIds.heroCar2 = "id24";
    oImageIds.heroCar3 = "id25";
    oImageIds.heroCar4 = "id26";
    oImageIds.heroCar5 = "id27";
    oImageIds.cupLost = "id28";
    oImageIds.cupFirst = "id29";
    oImageIds.cupAllFirst = "id30";
    oImageIds.lock = "id31";
    oImageIds.position0 = "id0";
    oImageIds.position1 = "id1";
    oImageIds.position2 = "id2";
    oImageIds.position3 = "id3";
    oImageIds.position4 = "id4";
    oImageIds.position5 = "id5";
    oImageIds.position6 = "id6";
    oImageIds.position7 = "id7";
    oImageIds.userMarker0 = "id8";
    oImageIds.startLights0 = "id9";
    oImageIds.startLights1 = "id10";
    oImageIds.startLights2 = "id11";
    oImageIds.startLights3 = "id12";
    oImageIds.chequeredFlag = "id13";
    oImageIds.lapIndicator = "id14";
    oImageIds.trackSideObject0 = "id15";
    oImageIds.trackSideObject1 = "id16";
    oImageIds.trackSideObject2 = "id17";
    oImageIds.trackSideObject3 = "id18";
    oImageIds.trackSideObject4 = "id19";
    oImageIds.trackSideObject5 = "id20";
    oImageIds.trackSideObject6 = "id21";
    oImageIds.trackSideObject7 = "id22";
    oImageIds.trackSideObject8 = "id23";
    oImageIds.trackSideObject9 = "id24";
    oImageIds.trackSideObject10 = "id25";
    oImageIds.trackSideObject11 = "id26";
    oImageIds.trackSideObject12 = "id27";
    oImageIds.trackSideObject13 = "id28";
    oImageIds.trackSideObject14 = "id29";
    oImageIds.trackSideObject15 = "id30";
    oImageIds.trackSideObject16 = "id31";
    oImageIds.trackSideObject17 = "id32";
    oImageIds.trackSideObject18 = "id33";
    oImageIds.trackSideObject19 = "id34";
    oImageIds.trackSideObject20 = "id35";
    oImageIds.posNumberDash = "id36";
    oImageIds.tutDesktop0 = "id37";
    oImageIds.tutDesktop1 = "id38";
    oImageIds.tutBg = "id39";
    oImageIds.tutHoriz1 = "id40";
    oImageIds.tutHoriz0 = "id41";
    oImageIds.tutVert1 = "id42";
    oImageIds.tutVert0 = "id43";
    oImageIds.userMarker1 = "id44";
    oImageIds.trackSideObject21 = "id45";
    assetLib.onReady(initSplash);
    gameState = "loading";
    previousTime = new Date().getTime();
    updateLoaderEvent();
}
function resizeCanvas() {
    var tempInnerWidth = window.innerWidth;
    var tempInnerHeight = window.innerHeight;
    canvas.height = tempInnerHeight;
    canvas.width = tempInnerWidth;
    canvas.style.width = tempInnerWidth + "px";
    canvas.style.height = tempInnerHeight + "px";
    if(tempInnerWidth > tempInnerHeight) {
        if(canvas.height < minSquareSize) {
            canvas.height = minSquareSize;
            canvas.width = minSquareSize * (tempInnerWidth / tempInnerHeight);
            canvasScale = minSquareSize / tempInnerHeight;
        } else if(canvas.height > maxSquareSize) {
            canvas.height = maxSquareSize;
            canvas.width = maxSquareSize * (tempInnerWidth / tempInnerHeight);
            canvasScale = maxSquareSize / tempInnerHeight;
        } else {
            canvasScale = 1;
        }
    } else {
        if(canvas.width < minSquareSize) {
            canvas.width = minSquareSize;
            canvas.height = minSquareSize * (tempInnerHeight / tempInnerWidth);
            canvasScale = minSquareSize / tempInnerWidth;
        } else if(canvas.width > maxSquareSize) {
            canvas.width = maxSquareSize;
            canvas.height = maxSquareSize * (tempInnerHeight / tempInnerWidth);
            canvasScale = maxSquareSize / tempInnerWidth;
        } else {
            canvasScale = 1;
        }
    }
    if(gameState == "game") {
        userInput.addHitArea("steerLeft", butEventHandler, {
            multiTouch: true
        }, "rect", {
            aRect: [
                0, 
                60, 
                canvas.width / 2, 
                canvas.height
            ]
        }, true);
        userInput.addHitArea("steerRight", butEventHandler, {
            multiTouch: true
        }, "rect", {
            aRect: [
                canvas.width / 2, 
                60, 
                canvas.width, 
                canvas.height
            ]
        }, true);
    }
    window.scrollTo(0, 0);
}
function playSound(_id) {
    if(audioType == 1) {
        sound.play(_id);
    }
}
function toggleMute() {
    muted = !muted;
    if(audioType == 1) {
        if(muted) {
            Howler.mute(true);
            music.pause();
            if(musicTween) {
                musicTween.kill();
            }
        } else {
            Howler.mute(false);
            music.play();
            if(musicTween) {
                musicTween.kill();
            }
            if(gameState == "game") {
                music.volume = .5;
            } else {
                music.volume = .25;
            }
        }
    } else if(audioType == 2) {
        if(muted) {
            music.pause();
        } else {
            music.play();
        }
    }
}
