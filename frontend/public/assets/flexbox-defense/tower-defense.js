"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('tower-defense/app', ['exports', 'ember', 'ember-resolver', 'ember/load-initializers', 'tower-defense/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _towerDefenseConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _towerDefenseConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _towerDefenseConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _towerDefenseConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('tower-defense/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'tower-defense/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _towerDefenseConfigEnvironment) {

  var name = _towerDefenseConfigEnvironment['default'].APP.name;
  var version = _towerDefenseConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('tower-defense/components/td-game/board/component', ['exports', 'ember'], function (exports, _ember) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var BoardComponent = _ember['default'].Component.extend({
    classNames: ['td-game__board'],

    waveCancelled: false,

    _applyBackgroundImage: _ember['default'].on('didInsertElement', _ember['default'].observer('attrs.backgroundImage', function () {
      this.$().css('background-image', 'url(' + this.attrs.backgroundImage + ')');
    }))
  });

  ///////////////////////
  //                   //
  //   Sound Effects   //
  //                   //
  ///////////////////////

  BoardComponent.reopen({
    volumeSettings: ['volume-up', 'volume-down', 'volume-off'],

    volumeKey: 0,

    volume: _ember['default'].computed('volumeKey', function () {
      var volumeKey = this.get('volumeKey');
      return this.get('volumeSettings').objectAt('' + volumeKey);
    }),

    actions: {
      toggleVolume: function toggleVolume() {
        if (this.get('volumeKey') < 2) {
          this.incrementProperty('volumeKey');
        } else {
          this.set('volumeKey', 0);
        }
      }
    }
  });

  ////////////////////
  //                //
  //   Mob Basics   //
  //                //
  ////////////////////

  BoardComponent.reopen({
    mobIndex: 0,

    mobs: []
  });

  ////////////////////////
  //                    //
  //   Mob Generation   //
  //                    //
  ////////////////////////

  BoardComponent.reopen({
    _generateMobs: function _generateMobs() {
      var _this = this;

      if (this.get('waveCancelled')) {
        this.set('waveCancelled', false);
        return;
      }

      var mobIndex = this.get('mobIndex');
      var currentMob = this.attrs.waveMobs.objectAt(mobIndex);
      this.get('mobs').addObject(currentMob);

      var anotherMobExists = !!this.attrs.waveMobs.objectAt(mobIndex + 1);
      if (anotherMobExists) {
        this.incrementProperty('mobIndex');

        var mobFrequency = currentMob.get('frequency');
        _ember['default'].run.later(this, function () {
          if (_this.get('waveCancelled')) {
            _this.set('waveCancelled', false);
            return;
          }

          _this._generateMobs();
        }, mobFrequency);
      }
    },

    numMobsToTerminate: _ember['default'].computed('attrs.waveStarted', function () {
      var firstMob = this.attrs.waveMobs.objectAt(0);
      var firstMobExists = !!firstMob;
      if (firstMobExists) {
        return firstMob.get('quantity');
      } else {
        return 5;
      }
    }),

    numMobsTerminated: 0,

    mobFrequency: _ember['default'].computed('mobIndex', function () {
      var mobIndex = this.get('mobIndex');
      var waveMob = this.attrs.waveMobs[mobIndex];
      return waveMob.get('frequency');
    }),

    kickOffMobGeneration: _ember['default'].observer('attrs.waveStarted', function () {
      if (!this.attrs.waveStarted) {
        this.set('mobIndex', 0);
        this.set('mobs', []);

        if (this.get('waveCancelled')) {
          this.set('waveCancelled', false);
        }

        return;
      }

      this.set('numMobsTerminated', 0);
      this._generateMobs();
    })
  });

  //////////////////////////
  //                      //
  //   Mob Modification   //
  //                      //
  //////////////////////////

  BoardComponent.reopen({
    _reduceMobHealth: function _reduceMobHealth(mobId, healthToReduce) {
      if (!healthToReduce) {
        healthToReduce = 20;
      }

      this.get('mobs').forEach(function (mob) {
        if (mobId === mob.get('id')) {
          var currentHealth = mob.get('health');
          mob.set('health', currentHealth - healthToReduce);
        }
      });
    },

    _resetMobs: _ember['default'].observer('attrs.cancellingWave', function () {
      if (this.attrs.cancellingWave) {
        this.set('waveCancelled', true);
        return;
      }
    }),

    actions: {
      damageMob: function damageMob(mobId, attackPower) {
        this._reduceMobHealth(mobId, attackPower);
      },

      destroyMob: function destroyMob(mob) {
        var mobIndex = this.get('mobs').indexOf(mob);
        this.get('mobs').removeAt(mobIndex);
        this.incrementProperty('numMobsTerminated');

        mob.set('active', false);
      },

      updateMobClass: function updateMobClass(mobId, newClass) {
        this.get('mobs').forEach(function (mob) {
          if (mobId === mob.get('id')) {
            mob.set('posClass', newClass);
          }
        });
      },

      reportMobPosition: function reportMobPosition(mobId, axis, pos) {
        this.get('mobs').forEach(function (mob) {
          if (mobId === mob.get('id')) {
            mob.set('pos' + axis, pos);
          }
        });
      }
    }
  });

  //////////////////////
  //                  //
  //   Wave Scoring   //
  //                  //
  //////////////////////

  BoardComponent.reopen({
    wavePoints: 0,

    _getFinalScore: _ember['default'].observer('numMobsTerminated', function () {
      if (this.get('numMobsTerminated') >= this.get('numMobsToTerminate')) {
        this.attrs['score-wave'](this.get('wavePoints'));
      }
    }),

    actions: {
      addPoints: function addPoints(points) {
        var currentWavePoints = this.get('wavePoints');

        if (currentWavePoints + points >= 100) {
          this.set('wavePoints', 100);
        } else {
          this.set('wavePoints', currentWavePoints + points);
        }
      }
    }
  });

  // TODO: is this reset code necessary?

  ///////////////
  //           //
  //   Reset   //
  //           //
  ///////////////

  BoardComponent.reopen({
    _resetBoard: _ember['default'].observer('attrs.waveStarted', function () {
      if (!this.attrs.waveStarted) {
        this.set('wavePoints', 0);
      }
    })
  });

  exports['default'] = BoardComponent;
});
define('tower-defense/components/td-game/board/mob/component', ['exports', 'ember', 'tower-defense/objects/mob'], function (exports, _ember, _towerDefenseObjectsMob) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var MobComponent = _ember['default'].Component.extend({
    classNames: ['mob'],

    _getNumFromPx: function _getNumFromPx(pixels) {
      var valWithoutPx = pixels.split('px')[0];
      return parseInt(valWithoutPx, 10);
    },

    _getPercentageLeft: function _getPercentageLeft(leftPxStr) {
      var leftPx = this._getNumFromPx(leftPxStr);
      var boardWidthPx = this.$().parent().width();
      return leftPx / boardWidthPx * 100;
    },

    _getPercentageTop: function _getPercentageTop(topPxStr) {
      var topPx = this._getNumFromPx(topPxStr);
      var boardHeightPx = this.$().parent().height();
      return topPx / boardHeightPx * 100;
    },

    _setMobDimensions: _ember['default'].on('didInsertElement', function () {
      this.$().css('width', _towerDefenseObjectsMob.mobDimensions + '%');
      this.$().css('height', _towerDefenseObjectsMob.mobDimensions + '%');
    }),

    _updateIdSelector: _ember['default'].on('didInsertElement', function () {
      this.$().attr('id', this.attrs.mob.get('id'));
    })
  });

  //////////////////
  //              //
  //   Movement   //
  //              //
  //////////////////

  MobComponent.reopen({
    nextPathCoordsIndex: 1,

    pathCoordsIndex: 0,

    // Mob coordinates (which represent the top left of the mob) should always be
    // a little bit above and to the left of path coordinates, so that the CENTER
    // of the mob matches the path coordinates.
    _getMobCoordsFromPathCoords: function _getMobCoordsFromPathCoords(pathCoords) {
      var mobRadiusPct = _towerDefenseObjectsMob.mobDimensions / 2;
      var mobLeftCoordPct = pathCoords.get('x') - mobRadiusPct;
      var mobTopCoordPct = pathCoords.get('y') - mobRadiusPct;
      return { mobXPct: mobLeftCoordPct, mobYPct: mobTopCoordPct };
    },

    _getTransitionSecs: function _getTransitionSecs(nextMobLeftPct, nextMobTopPct) {
      var mobLeftPxStr = this.$().css('left');
      var mobTopPxStr = this.$().css('top');
      if (mobLeftPxStr === 'auto' || mobTopPxStr === 'auto') {
        return 0;
      }

      var currentMobLeftPct = this._getPercentageLeft(mobLeftPxStr);
      var currentMobTopPct = this._getPercentageTop(mobTopPxStr);

      var pctDiff = Math.abs(currentMobLeftPct - nextMobLeftPct) + Math.abs(currentMobTopPct - nextMobTopPct);

      return this.attrs.speed * (pctDiff / 100);
    },

    _moveMobAlongPath: function _moveMobAlongPath() {
      var _this = this;

      var nextPathCoordsIndex = this.get('nextPathCoordsIndex');
      this.set('pathCoordsIndex', nextPathCoordsIndex);
      this.incrementProperty('nextPathCoordsIndex');

      var path = this.attrs.path;
      var nextPathCoords = path.objectAt(nextPathCoordsIndex);

      var _getMobCoordsFromPathCoords2 = this._getMobCoordsFromPathCoords(nextPathCoords);

      var mobXPct = _getMobCoordsFromPathCoords2.mobXPct;
      var mobYPct = _getMobCoordsFromPathCoords2.mobYPct;

      var transitionSecs = this._getTransitionSecs(mobXPct, mobYPct);
      this._moveMobToCoordinates(mobXPct, mobYPct, transitionSecs);

      _ember['default'].run.later(this, function () {
        if (_this.get('isDestroying')) {
          return;
        }

        var pathLastIndex = path.get('length') - 1;
        var morePathCoordsExist = pathLastIndex >= nextPathCoordsIndex + 1;
        if (morePathCoordsExist) {
          _this._moveMobAlongPath();
        } else {
          _this.set('endPointReached', true);
        }
      }, transitionSecs * 1000);
    },

    _moveMobToCoordinates: function _moveMobToCoordinates(mobXPct, mobYPct) {
      var secs = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      this.$().css('transition', 'all ' + secs + 's linear');
      this.$().css('left', mobXPct + '%');
      this.$().css('top', mobYPct + '%');
    },

    _placeMobAtStart: function _placeMobAtStart() {
      var startingPathCoords = this.attrs.path.objectAt(0);

      var _getMobCoordsFromPathCoords3 = this._getMobCoordsFromPathCoords(startingPathCoords);

      var mobXPct = _getMobCoordsFromPathCoords3.mobXPct;
      var mobYPct = _getMobCoordsFromPathCoords3.mobYPct;

      this._moveMobToCoordinates(mobXPct, mobYPct);
    },

    _kickOffMovement: _ember['default'].on('didInsertElement', function () {
      var _this2 = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        _this2._placeMobAtStart();
        _this2._moveMobAlongPath();
        _this2._reportPosition();
      });
    })
  });

  ////////////////////////////
  //                        //
  //   Position Reporting   //
  //                        //
  ////////////////////////////

  MobComponent.reopen({
    _reportPosition: function _reportPosition() {
      var _this3 = this;

      var mobRadiusPct = _towerDefenseObjectsMob.mobDimensions / 2;

      var mobLeftPx = this.$().css('left');
      var mobLeftPct = this._getPercentageLeft(mobLeftPx);
      var pathLeftPct = mobLeftPct + mobRadiusPct;

      var mobTopPx = this.$().css('top');
      var mobTopPct = this._getPercentageTop(mobTopPx);
      var pathTopPct = mobTopPct + mobRadiusPct;

      // TODO: Will one of these ever be truthy without the other? Or either?
      //       Not sure how this could occur.
      if (mobLeftPct && mobTopPct) {
        var mobId = this.attrs.mob.get('id');
        // TODO: just send up the action ONCE with both X and Y data in it
        this.attrs['report-position'](mobId, 'X', pathLeftPct);
        this.attrs['report-position'](mobId, 'Y', pathTopPct);
      }

      _ember['default'].run.later(this, function () {
        if (!_this3.get('isDestroying') && !_this3.get('endPointReached')) {
          _this3._reportPosition();
        }
      }, 20);
    }
  });

  /////////////////////
  //                 //
  //   Termination   //
  //                 //
  /////////////////////

  MobComponent.reopen({
    endPointReached: false,

    healthBarClass: 'mob__health-bar--100',

    _destroyMob: function _destroyMob() {
      this.attrs['destroy-mob'](this.attrs.mob);
    },

    _checkMobStatus: _ember['default'].observer('attrs.health', 'endPointReached', function () {
      if (this.attrs.health < 1) {
        this.attrs['add-points'](this.attrs.mob.get('points'));

        this._destroyMob();
      } else if (this.get('endPointReached')) {
        this._destroyMob();
      }
    }),

    _updateHealth: _ember['default'].observer('attrs.health', function () {
      var maxHealth = this.attrs.mob.get('maxHealth');
      if (this.attrs.health > Math.floor(maxHealth * 0.90)) {
        this.set('healthBarClass', 'mob__health-bar--100');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.80)) {
        this.set('healthBarClass', 'mob__health-bar--90');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.70)) {
        this.set('healthBarClass', 'mob__health-bar--80');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.60)) {
        this.set('healthBarClass', 'mob__health-bar--70');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.50)) {
        this.set('healthBarClass', 'mob__health-bar--60');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.40)) {
        this.set('healthBarClass', 'mob__health-bar--50');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.30)) {
        this.set('healthBarClass', 'mob__health-bar--40');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.20)) {
        this.set('healthBarClass', 'mob__health-bar--30');
      } else if (this.attrs.health > Math.floor(maxHealth * 0.10)) {
        this.set('healthBarClass', 'mob__health-bar--20');
      } else {
        this.set('healthBarClass', 'mob__health-bar--10');
      }
    })
  });

  exports['default'] = MobComponent;
});
define("tower-defense/components/td-game/board/mob/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/board/mob/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "mob__health-bar-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["mob__health-bar ", ["get", "healthBarClass", ["loc", [null, [2, 32], [2, 46]]]]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("tower-defense/components/td-game/board/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 4
              },
              "end": {
                "line": 7,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/board/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "board__points");
            var el2 = dom.createTextNode("\n        Points: ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["content", "wavePoints", ["loc", [null, [5, 16], [5, 30]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/board/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "board__info");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "board__volume");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [3]);
          var element3 = dom.childAt(element2, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element1, 1, 1);
          morphs[1] = dom.createElementMorph(element2);
          morphs[2] = dom.createAttrMorph(element3, 'class');
          return morphs;
        },
        statements: [["block", "if", [["get", "attrs.waveStarted", ["loc", [null, [3, 10], [3, 27]]]]], [], 0, null, ["loc", [null, [3, 4], [7, 11]]]], ["element", "action", ["toggleVolume"], [], ["loc", [null, [9, 34], [9, 59]]]], ["attribute", "class", ["concat", ["fa fa-lg fa-", ["get", "volume", ["loc", [null, [10, 30], [10, 36]]]]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 16,
                "column": 2
              },
              "end": {
                "line": 32,
                "column": 2
              }
            },
            "moduleName": "tower-defense/components/td-game/board/template.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "td-game/board/mob", [], ["add-points", ["subexpr", "action", ["addPoints"], [], ["loc", [null, [17, 35], [17, 55]]]], "class", ["subexpr", "readonly", [["get", "mob.posClass", ["loc", [null, [18, 40], [18, 52]]]]], [], ["loc", [null, [18, 30], [18, 53]]]], "destroy-mob", ["subexpr", "action", ["destroyMob"], [], ["loc", [null, [19, 36], [19, 57]]]], "mob", ["subexpr", "readonly", [["get", "mob", ["loc", [null, [20, 38], [20, 41]]]]], [], ["loc", [null, [20, 28], [20, 42]]]], "number", ["subexpr", "readonly", [["get", "mob.number", ["loc", [null, [21, 41], [21, 51]]]]], [], ["loc", [null, [21, 31], [21, 52]]]], "path", ["subexpr", "readonly", [["get", "attrs.path", ["loc", [null, [22, 39], [22, 49]]]]], [], ["loc", [null, [22, 29], [22, 50]]]], "points", ["subexpr", "readonly", [["get", "mob.points", ["loc", [null, [23, 41], [23, 51]]]]], [], ["loc", [null, [23, 31], [23, 52]]]], "posX", ["subexpr", "readonly", [["get", "mob.posX", ["loc", [null, [24, 39], [24, 47]]]]], [], ["loc", [null, [24, 29], [24, 48]]]], "posY", ["subexpr", "readonly", [["get", "mob.posY", ["loc", [null, [25, 39], [25, 47]]]]], [], ["loc", [null, [25, 29], [25, 48]]]], "health", ["subexpr", "readonly", [["get", "mob.health", ["loc", [null, [26, 41], [26, 51]]]]], [], ["loc", [null, [26, 31], [26, 52]]]], "speed", ["subexpr", "readonly", [["get", "mob.speed", ["loc", [null, [27, 40], [27, 49]]]]], [], ["loc", [null, [27, 30], [27, 50]]]], "type", ["subexpr", "readonly", [["get", "mob.type", ["loc", [null, [28, 39], [28, 47]]]]], [], ["loc", [null, [28, 29], [28, 48]]]], "update-class", ["subexpr", "action", ["updateMobClass"], [], ["loc", [null, [29, 37], [29, 62]]]], "report-position", ["subexpr", "action", ["reportMobPosition"], [], ["loc", [null, [30, 40], [30, 68]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [31, 46], [31, 63]]]]], [], ["loc", [null, [31, 36], [31, 64]]]]], ["loc", [null, [17, 4], [31, 66]]]]],
          locals: ["mob"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 0
            },
            "end": {
              "line": 33,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/board/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "each", [["get", "mobs", ["loc", [null, [16, 10], [16, 14]]]]], [], 0, null, ["loc", [null, [16, 2], [32, 11]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 39,
                  "column": 6
                },
                "end": {
                  "line": 44,
                  "column": 6
                }
              },
              "moduleName": "tower-defense/components/td-game/board/template.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n\n        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "tower-group__pulse");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "tool-tip", [], ["selector", ["subexpr", "readonly", [["get", "towerGroup.selector", ["loc", [null, [40, 38], [40, 57]]]]], [], ["loc", [null, [40, 28], [40, 58]]]], "type", ["subexpr", "readonly", ["tower-group"], [], ["loc", [null, [41, 24], [41, 48]]]]], ["loc", [null, [40, 8], [41, 50]]]]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 36,
                "column": 2
              },
              "end": {
                "line": 46,
                "column": 2
              }
            },
            "moduleName": "tower-defense/components/td-game/board/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "board__tower-group--body");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createAttrMorph(element0, 'id');
            morphs[1] = dom.createElementMorph(element0);
            morphs[2] = dom.createMorphAt(element0, 1, 1);
            return morphs;
          },
          statements: [["attribute", "id", ["concat", ["tower-group--overlay-", ["get", "towerGroup.groupNum", ["loc", [null, [38, 36], [38, 55]]]]]]], ["element", "action", [["get", "attrs.select-tower-group", ["loc", [null, [38, 68], [38, 92]]]], ["get", "towerGroup", ["loc", [null, [38, 93], [38, 103]]]]], [], ["loc", [null, [38, 59], [38, 105]]]], ["block", "if", [["subexpr", "eq", [["get", "towerGroup", ["loc", [null, [39, 16], [39, 26]]]], ["get", "selectedTowerGroup", ["loc", [null, [39, 27], [39, 45]]]]], [], ["loc", [null, [39, 12], [39, 46]]]]], [], 0, null, ["loc", [null, [39, 6], [44, 13]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 35,
              "column": 0
            },
            "end": {
              "line": 65,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/board/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [["block", "unless", [["get", "attrs.waveStarted", ["loc", [null, [36, 12], [36, 29]]]]], [], 0, null, ["loc", [null, [36, 2], [46, 13]]]], ["inline", "td-game/board/tower-group", [], ["add-colliding-tower", ["subexpr", "action", [["get", "attrs.add-colliding-tower", ["loc", [null, [48, 58], [48, 83]]]]], [], ["loc", [null, [48, 50], [48, 84]]]], "allTowers", ["subexpr", "readonly", [["get", "towers", ["loc", [null, [49, 50], [49, 56]]]]], [], ["loc", [null, [49, 40], [49, 57]]]], "damage-mob", ["subexpr", "action", ["damageMob"], [], ["loc", [null, [50, 41], [50, 61]]]], "groupNum", ["subexpr", "readonly", [["get", "towerGroup.groupNum", ["loc", [null, [51, 49], [51, 68]]]]], [], ["loc", [null, [51, 39], [51, 69]]]], "mobs", ["subexpr", "readonly", [["get", "mobs", ["loc", [null, [52, 45], [52, 49]]]]], [], ["loc", [null, [52, 35], [52, 50]]]], "numRows", ["subexpr", "readonly", [["get", "towerGroup.numRows", ["loc", [null, [53, 48], [53, 66]]]]], [], ["loc", [null, [53, 38], [53, 67]]]], "path", ["subexpr", "readonly", [["get", "attrs.path", ["loc", [null, [54, 45], [54, 55]]]]], [], ["loc", [null, [54, 35], [54, 56]]]], "posY", ["subexpr", "readonly", [["get", "towerGroup.posY", ["loc", [null, [55, 45], [55, 60]]]]], [], ["loc", [null, [55, 35], [55, 61]]]], "remove-colliding-tower", ["subexpr", "action", [["get", "attrs.remove-colliding-tower", ["loc", [null, [56, 61], [56, 89]]]]], [], ["loc", [null, [56, 53], [56, 90]]]], "report-tower-position", ["subexpr", "action", [["get", "attrs.report-tower-position", ["loc", [null, [57, 60], [57, 87]]]]], [], ["loc", [null, [57, 52], [57, 88]]]], "select", ["subexpr", "action", [["get", "attrs.select-tower-group", ["loc", [null, [58, 45], [58, 69]]]], ["get", "towerGroup", ["loc", [null, [58, 70], [58, 80]]]]], [], ["loc", [null, [58, 37], [58, 81]]]], "selectedTower", ["subexpr", "readonly", [["get", "selectedTower", ["loc", [null, [59, 54], [59, 67]]]]], [], ["loc", [null, [59, 44], [59, 68]]]], "selectedTowerGroup", ["subexpr", "readonly", [["get", "selectedTowerGroup", ["loc", [null, [60, 59], [60, 77]]]]], [], ["loc", [null, [60, 49], [60, 78]]]], "select-tower", ["subexpr", "action", [["get", "attrs.select-tower", ["loc", [null, [61, 51], [61, 69]]]]], [], ["loc", [null, [61, 43], [61, 70]]]], "towerGroup", ["subexpr", "readonly", [["get", "towerGroup", ["loc", [null, [62, 51], [62, 61]]]]], [], ["loc", [null, [62, 41], [62, 62]]]], "volumeKey", ["subexpr", "readonly", [["get", "volumeKey", ["loc", [null, [63, 50], [63, 59]]]]], [], ["loc", [null, [63, 40], [63, 60]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [64, 52], [64, 69]]]]], [], ["loc", [null, [64, 42], [64, 70]]]]], ["loc", [null, [48, 2], [64, 72]]]]],
        locals: ["towerGroup"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 66,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/board/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "unless", [["get", "attrs.overlayShown", ["loc", [null, [1, 10], [1, 28]]]]], [], 0, null, ["loc", [null, [1, 0], [13, 11]]]], ["block", "if", [["get", "attrs.waveStarted", ["loc", [null, [15, 6], [15, 23]]]]], [], 1, null, ["loc", [null, [15, 0], [33, 7]]]], ["block", "each", [["get", "attrs.towerGroups", ["loc", [null, [35, 8], [35, 25]]]]], [], 2, null, ["loc", [null, [35, 0], [65, 9]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define('tower-defense/components/td-game/board/tower-group/component', ['exports', 'ember', 'tower-defense/objects/board', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower'], function (exports, _ember, _towerDefenseObjectsBoard, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var TowerGroupComponent = _ember['default'].Component.extend({
    classNameBindings: ['selected:board__tower-group--selected'],

    classNames: ['board__tower-group'],

    setElementId: _ember['default'].on('init', function () {
      this.set('elementId', 'board__tower-group-' + this.attrs.groupNum);
    })
  });

  //////////////////////////////
  //                          //
  //   Code Line Management   //
  //                          //
  //////////////////////////////

  TowerGroupComponent.reopen({
    _clearPreviousStyles: function _clearPreviousStyles() {
      this.$().css('align-items', 'initial');
      this.$().css('flex-direction', 'initial');
      this.$().css('justify-content', 'initial');
    },

    _getProperty: function _getProperty(codeLine) {
      var codeLineLowerCase = codeLine.toLowerCase();
      var colonLocation = codeLineLowerCase.indexOf(':');

      return codeLineLowerCase.substring(0, colonLocation);
    },

    _getValue: function _getValue(codeLine, property) {
      var startIndex = property.length + 1;
      var endIndex = codeLine.length;
      return codeLine.substring(startIndex, endIndex).trim();
    },

    _getValueWithoutSemiColon: function _getValueWithoutSemiColon(val) {
      var lastIndex = val.length - 1;
      if (val[lastIndex] === ';') {
        return val.substring(0, lastIndex);
      }
    },

    _styleFound: function _styleFound(styleNeedle) {
      if (!styleNeedle) {
        return;
      }

      var styleApplicable = false;
      styleNeedle = styleNeedle.replace(/ /g, '');
      var towerGroupStyles = this.attrs.towerGroup.get('styles');

      if (towerGroupStyles) {
        towerGroupStyles.forEach(function (styleHaystack) {
          if (styleHaystack.get('codeLine')) {
            var styleNoWhitespace = styleHaystack.get('codeLine').replace(/ /g, '');
            styleHaystack.set('codeLine', styleNoWhitespace);

            if (styleHaystack.get('codeLine') === styleNeedle) {
              styleApplicable = true;
            }
          }
        });
      }

      return styleApplicable;
    },

    _applyCodeLines: _ember['default'].observer('attrs.towerGroup.styles', 'attrs.towerGroup.styles.[]', 'attrs.towerGroup.styles.length', 'attrs.towerGroup.styles.@each.codeLine', 'attrs.towerGroup.styles.@each.submitted', function () {
      var _this = this;

      var styles = this.attrs.towerGroup.get('styles');
      var styleFound = !!styles && styles.get('length') > 0;

      var codeLineEmpty = true;
      if (styleFound) {
        var firstCodeLine = styles.get('firstObject');

        var codeLineLength = firstCodeLine.get('codeLine.length');
        codeLineEmpty = isNaN(codeLineLength) || codeLineLength < 1;
      }

      this._clearPreviousStyles();
      if (!styleFound || codeLineEmpty) {
        return;
      }

      styles.forEach(function (style) {
        var codeLine = style.get('codeLine');

        if (_this._styleFound(codeLine)) {
          var property = _this._getProperty(codeLine);
          var value = _this._getValue(codeLine, property);

          if (property && value && style.get('valid')) {
            var semicolonFound = value[value.length - 1] === ';';

            if (semicolonFound) {
              _this.$().css(property, _this._getValueWithoutSemiColon(value));
            } else {
              _this.$().css(property, value);
            }
          }
        }
      });
    })
  });

  ////////////////
  //            //
  //   Sizing   //
  //            //
  ////////////////

  TowerGroupComponent.reopen({
    stylesInitialized: false,

    _setHeight: function _setHeight() {
      var numRows = this.attrs.towerGroup.get('numRows');
      var heightPct = _towerDefenseObjectsTower.towerDimensions * numRows + _towerDefenseObjectsTowerGroup.spaceBetweenTowersPct * 2 + _towerDefenseObjectsTowerGroup.spaceBetweenTowersPct * (numRows - 1);
      this.$().css('height', heightPct + '%');
      this.$('.board__tower-group--body').css('height', heightPct + '%');

      this.get('$groupOverlay').css('height', heightPct + '%');
    },

    _setPadding: function _setPadding() {
      this.$().css('padding', _towerDefenseObjectsTowerGroup.spaceBetweenTowersPct + '%');
    },

    _setPosition: function _setPosition() {
      var offsetTopPx = this.$().offset().top;
      var boardHeightVal = _ember['default'].$('.td-game__board').css('height');
      var boardHeightPxStr = boardHeightVal.split('px')[0];
      var boardHeightPx = parseInt(boardHeightPxStr, 10);
      var offsetTopPct = offsetTopPx / boardHeightPx * 100;

      this.$().css('margin-left', _towerDefenseObjectsBoard.boardPaddingPct + '%');
      this.$().css('margin-top', this.attrs.posY - offsetTopPct + '%');

      this.get('$groupOverlay').css('top', this.attrs.posY + '%');
      this.get('$groupOverlay').css('left', _towerDefenseObjectsBoard.boardPaddingPct + '%');
    },

    _setWidth: function _setWidth() {
      var width = 100 - _towerDefenseObjectsBoard.boardPaddingPct * 2;
      this.$().css('width', width + '%');
      this.$('.board__tower-group--body').css('width', width + '%');

      this.get('$groupOverlay').css('width', width + '%');
    },

    $groupOverlay: _ember['default'].computed(function () {
      var groupNum = this.attrs.groupNum;
      return _ember['default'].$('#tower-group--overlay-' + groupNum);
    }),

    _initializeStyles: _ember['default'].on('didInsertElement', function () {
      var _this2 = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        _this2._setHeight();
        _this2._setPadding();
        _this2._setWidth();
        _this2._setPosition();

        _this2.$('.board__tower-group--body').css('top', _this2.attrs.posY + '%');
        _this2.$('.board__tower-group--body').css('left', _towerDefenseObjectsBoard.boardPaddingPct + '%');

        _this2.set('stylesInitialized', true);
      });
    })
  });

  ///////////////////
  //               //
  //   Selection   //
  //               //
  ///////////////////

  TowerGroupComponent.reopen({
    selected: _ember['default'].computed('attrs.selectedTowerGroup', 'attrs.towerGroup', 'attrs.waveStarted', function () {
      if (!this.attrs.waveStarted) {
        return this.attrs.selectedTowerGroup === this.attrs.towerGroup ? true : false;
      } else {
        return false;
      }
    }),

    _handleClick: _ember['default'].on('click', function (clickEvent) {
      var $clickedEl = _ember['default'].$(clickEvent.target);
      var $towerParents = $clickedEl.parents('.tower-group__tower');
      var isChildOfTower = $towerParents.length > 0;
      if (!isChildOfTower) {
        this.attrs.select();
      }
    })
  });

  exports['default'] = TowerGroupComponent;
});
define("tower-defense/components/td-game/board/tower-group/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "missing-wrapper",
            "problems": ["wrong-type"]
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 19,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/board/tower-group/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "td-game/board/tower-group/tower", [], ["add-colliding-tower", ["subexpr", "action", [["get", "attrs.add-colliding-tower", ["loc", [null, [2, 64], [2, 89]]]]], [], ["loc", [null, [2, 56], [2, 90]]]], "damage-mob", ["subexpr", "action", [["get", "attrs.damage-mob", ["loc", [null, [3, 55], [3, 71]]]]], [], ["loc", [null, [3, 47], [3, 72]]]], "mobs", ["subexpr", "readonly", [["get", "attrs.mobs", ["loc", [null, [4, 51], [4, 61]]]]], [], ["loc", [null, [4, 41], [4, 62]]]], "path", ["subexpr", "readonly", [["get", "attrs.path", ["loc", [null, [5, 51], [5, 61]]]]], [], ["loc", [null, [5, 41], [5, 62]]]], "remove-colliding-tower", ["subexpr", "action", [["get", "attrs.remove-colliding-tower", ["loc", [null, [6, 67], [6, 95]]]]], [], ["loc", [null, [6, 59], [6, 96]]]], "report-tower-position", ["subexpr", "action", [["get", "attrs.report-tower-position", ["loc", [null, [7, 66], [7, 93]]]]], [], ["loc", [null, [7, 58], [7, 94]]]], "select", ["subexpr", "action", [["get", "attrs.select-tower", ["loc", [null, [8, 51], [8, 69]]]], ["get", "tower", ["loc", [null, [8, 70], [8, 75]]]]], [], ["loc", [null, [8, 43], [8, 76]]]], "selectedTower", ["subexpr", "readonly", [["get", "selectedTower", ["loc", [null, [9, 60], [9, 73]]]]], [], ["loc", [null, [9, 50], [9, 74]]]], "stylesInitialized", ["subexpr", "readonly", [["get", "stylesInitialized", ["loc", [null, [10, 64], [10, 81]]]]], [], ["loc", [null, [10, 54], [10, 82]]]], "towerGroupStyles", ["subexpr", "readonly", [["get", "attrs.towerGroup.styles", ["loc", [null, [11, 63], [11, 86]]]]], [], ["loc", [null, [11, 53], [11, 87]]]], "tower", ["subexpr", "readonly", [["get", "tower", ["loc", [null, [12, 52], [12, 57]]]]], [], ["loc", [null, [12, 42], [12, 58]]]], "towerAttackRange", ["subexpr", "readonly", [["get", "tower.attackRange", ["loc", [null, [13, 63], [13, 80]]]]], [], ["loc", [null, [13, 53], [13, 81]]]], "towerAttackPower", ["subexpr", "readonly", [["get", "tower.attackPower", ["loc", [null, [14, 63], [14, 80]]]]], [], ["loc", [null, [14, 53], [14, 81]]]], "towerId", ["subexpr", "readonly", [["get", "tower.id", ["loc", [null, [15, 54], [15, 62]]]]], [], ["loc", [null, [15, 44], [15, 63]]]], "type", ["subexpr", "readonly", [["get", "tower.type", ["loc", [null, [16, 51], [16, 61]]]]], [], ["loc", [null, [16, 41], [16, 62]]]], "volumeKey", ["subexpr", "readonly", [["get", "volumeKey", ["loc", [null, [17, 56], [17, 65]]]]], [], ["loc", [null, [17, 46], [17, 66]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [18, 58], [18, 75]]]]], [], ["loc", [null, [18, 48], [18, 76]]]]], ["loc", [null, [2, 2], [18, 78]]]]],
        locals: ["tower"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/board/tower-group/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "attrs.towerGroup.towers", ["loc", [null, [1, 8], [1, 31]]]]], [], 0, null, ["loc", [null, [1, 0], [19, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define('tower-defense/components/td-game/board/tower-group/tower/component', ['exports', 'ember', 'tower-defense/objects/projectile', 'tower-defense/objects/board', 'tower-defense/objects/tower'], function (exports, _ember, _towerDefenseObjectsProjectile, _towerDefenseObjectsBoard, _towerDefenseObjectsTower) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var TowerComponent = _ember['default'].Component.extend({
    classNames: ['tower-group__tower']
  });

  ////////////////////////////
  //                        //
  //   Upgrade Management   //
  //                        //
  ////////////////////////////

  TowerComponent.reopen({
    classNameBindings: ['towerUpgraded:tower-group__tower--upgraded'],

    towerUpgraded: false,

    applyTowerType: _ember['default'].on('didInsertElement', function () {
      var _this = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        if (_this.attrs.type === 2) {
          _this.set('towerUpgraded', true);
        }
      });
    })
  });

  /////////////////////////
  //                     //
  //   Tower Selection   //
  //                     //
  /////////////////////////

  TowerComponent.reopen({
    classNameBindings: ['selected:tower-group__tower--selected'],

    selected: _ember['default'].computed('attrs.selectedTower', 'attrs.tower', 'attrs.waveStarted', function () {
      if (!this.attrs.waveStarted) {
        return this.attrs.selectedTower === this.attrs.tower ? true : false;
      } else {
        return false;
      }
    }),

    _sendSelectAction: _ember['default'].on('click', function () {
      this.attrs.select();
    })
  });

  //////////////////////////////
  //                          //
  //   Code Line Management   //
  //                          //
  //////////////////////////////

  TowerComponent.reopen({
    _clearPreviousStyles: function _clearPreviousStyles() {
      this.$().css('align-self', 'initial');
      this.$().css('order', 'initial');
    },

    _getProperty: function _getProperty(codeLine) {
      var codeLineLowerCase = codeLine.toLowerCase();
      var colonLocation = codeLineLowerCase.indexOf(':');

      return codeLineLowerCase.substring(0, colonLocation);
    },

    _getValue: function _getValue(codeLine, property) {
      var startIndex = property.length + 1;
      var endIndex = codeLine.length;
      return codeLine.substring(startIndex, endIndex).trim();
    },

    _getValueWithoutSemiColon: function _getValueWithoutSemiColon(val) {
      var lastIndex = val.length - 1;
      if (val[lastIndex] === ';') {
        return val.substring(0, lastIndex);
      }
    },

    _styleFound: function _styleFound(styleNeedle) {
      if (!styleNeedle) {
        return;
      }

      var styleApplicable = false;
      styleNeedle = styleNeedle.replace(/ /g, '');
      var towerStyles = this.attrs.tower.get('styles');

      if (towerStyles) {
        towerStyles.forEach(function (styleHaystack) {
          if (styleHaystack.get('codeLine')) {
            var styleNoWhitespace = styleHaystack.get('codeLine').replace(/ /g, '');
            styleHaystack.set('codeLine', styleNoWhitespace);

            if (styleHaystack.get('codeLine') === styleNeedle) {
              styleApplicable = true;
            }
          }
        });
      }

      return styleApplicable;
    },

    _updateCodeLines: _ember['default'].observer('attrs.tower.styles', 'attrs.tower.styles.[]', 'attrs.tower.styles.length', 'attrs.tower.styles.@each.codeLine', 'attrs.tower.styles.@each.submitted', function () {
      var _this2 = this;

      var styles = this.attrs.tower.get('styles');
      var styleFound = !!styles && styles.get('length') > 0;

      var codeLineEmpty = true;
      if (styleFound) {
        var firstCodeLine = styles.get('firstObject');

        var codeLineLength = firstCodeLine.get('codeLine.length');
        codeLineEmpty = isNaN(codeLineLength) || codeLineLength < 1;
      }

      this._clearPreviousStyles();
      if (!styleFound || codeLineEmpty) {
        return;
      }

      styles.forEach(function (style) {
        var codeLine = style.get('codeLine');

        if (_this2._styleFound(codeLine)) {
          var property = _this2._getProperty(codeLine);
          var value = _this2._getValue(codeLine, property);

          if (property && value && style.get('valid')) {
            var semicolonFound = value[value.length - 1] === ';';

            if (semicolonFound) {
              _this2.$().css(property, _this2._getValueWithoutSemiColon(value));
            } else {
              _this2.$().css(property, value);
            }
          }
        }
      });
    })
  });

  /////////////////////////////
  //                         //
  //   Position Management   //
  //                         //
  /////////////////////////////

  TowerComponent.reopen({
    // the % distance the center of the tower is from the left of the board
    centerLeftPct: _ember['default'].computed('attrs.stylesInitialized', 'attrs.towerGroupStyles.[]', 'attrs.towerGroupStyles.@each.codeLine', 'attrs.towerGroupStyles.@each.submitted', 'attrs.tower.styles.[]', 'attrs.tower.styles.@each.codeLine', 'attrs.tower.styles.@each.submitted', 'elementInserted', function () {
      if (!this.get('elementInserted')) {
        return null;
      }

      var $board = _ember['default'].$('.td-game__board');
      var boardLeftEdgePxFromPage = $board.offset().left;

      var $tower = this.$();
      var towerLeftEdgePxFromPage = $tower.offset().left;

      var towerLeftEdgePxFromBoard = towerLeftEdgePxFromPage - boardLeftEdgePxFromPage;
      var towerCenterPxFromBoard = towerLeftEdgePxFromBoard;

      var towerRadiusPct = _towerDefenseObjectsTower.towerDimensions / 2;
      var boardDimensionsPx = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerCenterPxFromBoard / boardDimensionsPx)) + towerRadiusPct;
    }),

    // the % distance the center of the tower is from the top of the board
    centerTopPct: _ember['default'].computed('attrs.stylesInitialized', 'attrs.towerGroupStyles.[]', 'attrs.towerGroupStyles.@each.codeLine', 'attrs.towerGroupStyles.@each.submitted', 'attrs.tower.styles.[]', 'attrs.tower.styles.@each.codeLine', 'attrs.tower.styles.@each.submitted', 'elementInserted', function () {
      if (!this.get('elementInserted')) {
        return null;
      }

      var $board = _ember['default'].$('.td-game__board');
      var boardTopEdgePxFromPage = $board.offset().top;

      var $tower = this.$();
      var towerTopEdgePxFromPage = $tower.offset().top;

      var towerTopEdgePxFromBoard = towerTopEdgePxFromPage - boardTopEdgePxFromPage;
      var towerCenterPxFromBoard = towerTopEdgePxFromBoard;

      var towerRadiusPct = _towerDefenseObjectsTower.towerDimensions / 2;
      var boardDimensionsPx = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerCenterPxFromBoard / boardDimensionsPx)) + towerRadiusPct;
    }),

    _reportPosition: _ember['default'].observer('centerLeftPct', 'centerTopPct', function () {
      var towerId = this.attrs.tower.get('id');
      var centerLeftPct = this.get('centerLeftPct');
      var centerTopPct = this.get('centerTopPct');
      this.attrs['report-tower-position'](towerId, 'X', centerLeftPct);
      this.attrs['report-tower-position'](towerId, 'Y', centerTopPct);
    })
  });

  //////////////////////////////////
  //                              //
  //   Path Collision Detection   //
  //                              //
  //////////////////////////////////

  TowerComponent.reopen({
    classNameBindings: ['collidesWithPath:tower--colliding'],

    collidesWithPath: _ember['default'].computed('attrs.path.[]', 'elementInserted', 'centerLeftPct', 'centerTopPct', function () {
      var _this3 = this;

      if (!this.get('elementInserted')) {
        return false;
      }

      var towerLeftPct = this.get('centerLeftPct');
      var towerTopPct = this.get('centerTopPct');
      var towerRadius = _towerDefenseObjectsTower.towerDimensions / 2;
      var pathRadius = _towerDefenseObjectsBoard.pathWidth / 2;

      // The path is an array of points, and if you draw a line from one point
      // to the next, you have created a "segment". This function loops through
      // each of the points, creates a segment, and checks to see if tower
      // intersects the segment.
      return this.attrs.path.any(function (pathCoords, index) {
        var nextCoords = _this3.attrs.path.objectAt(index + 1);
        if (!nextCoords) {
          return false;
        }

        var pathCoordsX = pathCoords.get('x');
        var nextCoordsX = nextCoords.get('x');
        var lowestPathLeftPct = Math.min(pathCoordsX, nextCoordsX) - pathRadius;
        var highestPathLeftPct = Math.max(pathCoordsX, nextCoordsX) + pathRadius;
        var xIntersects = towerLeftPct + towerRadius >= lowestPathLeftPct && towerLeftPct - towerRadius <= highestPathLeftPct;
        if (!xIntersects) {
          return false;
        }

        var pathCoordsY = pathCoords.get('y');
        var nextCoordsY = nextCoords.get('y');
        var lowestPathTopPct = Math.min(pathCoordsY, nextCoordsY) - pathRadius;
        var highestPathTopPct = Math.max(pathCoordsY, nextCoordsY) + pathRadius;
        var yIntersects = towerTopPct + towerRadius >= lowestPathTopPct && towerTopPct - towerRadius <= highestPathTopPct;
        return yIntersects;
      });
    }),

    _updateTowersColliding: _ember['default'].observer('collidesWithPath', function () {
      var collisionAction = this.get('collidesWithPath') ? 'add-colliding-tower' : 'remove-colliding-tower';
      this.attrs[collisionAction](this.attrs.tower.get('id'));
    })
  });

  ////////////////
  //            //
  //   Sizing   //
  //            //
  ////////////////

  TowerComponent.reopen({
    resizeFn: null, // will be set to a function that we call on window resize

    _setTowerDimensions: _ember['default'].on('didInsertElement', function () {
      var $board = _ember['default'].$('.td-game__board');
      var boardDimensions = $board.width(); // width === height
      var towerDimensionsPx = _towerDefenseObjectsTower.towerDimensions / 100 * boardDimensions;
      this.$().css('width', towerDimensionsPx);
      this.$().css('height', towerDimensionsPx);

      // the tower's cannon forms a rectangle using the following border styles
      _ember['default'].$('.turret__cannon').css({
        'height': towerDimensionsPx / 2 + 'px',
        'width': towerDimensionsPx / 4 + 'px '
      });
    }),

    _stopWatchingWindowResize: _ember['default'].on('willDestroyElement', function () {
      _ember['default'].$(window).off('resize', this.get('resizeFn'));
    }),

    _updateDimensionsOnWindowResize: _ember['default'].on('didInsertElement', function () {
      var _this4 = this;

      var resizeFn = _ember['default'].run.bind(this, '_setTowerDimensions');
      _ember['default'].$(window).on('resize', resizeFn);

      _ember['default'].run.schedule('afterRender', this, function () {
        _this4.set('resizeFn', resizeFn);
      });
    })
  });

  ///////////////////////////////////
  //                               //
  //   Rotation (Facing Targets)   //
  //                               //
  ///////////////////////////////////

  TowerComponent.reopen({
    // facingTarget: false,

    _getNumFromPx: function _getNumFromPx(pixels) {
      if (!pixels) {
        return undefined;
      }

      var valWithoutPx = pixels.split('px')[0];
      return parseInt(valWithoutPx, 10);
    },

    _getTargetPercentageLeft: function _getTargetPercentageLeft() {
      var leftPxStr = _ember['default'].$('#' + this.attrs.tower.get('targetId')).css('left');
      var leftPx = this._getNumFromPx(leftPxStr);
      var boardWidthPx = _ember['default'].$('.td-game__board').width();
      return leftPx / boardWidthPx * 100;
    },

    _getTargetPercentageTop: function _getTargetPercentageTop() {
      var topPxStr = _ember['default'].$('#' + this.attrs.tower.get('targetId')).css('top');
      var topPx = this._getNumFromPx(topPxStr);
      var boardHeightPx = _ember['default'].$('.td-game__board').height();
      return topPx / boardHeightPx * 100;
    },

    _faceTarget: _ember['default'].observer('targetId', function () {
      var _this5 = this;

      if (!this.attrs.waveStarted || !this.get('targetId') || this.get('towerUpgraded')) {
        return;
      }

      var target = this._getMobById(this.get('targetId'));
      if (!target) {
        this.set('targetId', null);
        return;
      }

      var targetLeftPct = target.get('posX');
      var targetTopPct = target.get('posY');

      // find the target's position relative to this tower
      // e.g. given a tower position of [1,1] and a target position of [3,3], the
      //      relative target position would be [2, -2]
      var relTargetPctLeft = targetLeftPct - this.get('centerLeftPct');
      var relTargetPctTop = this.get('centerTopPct') - targetTopPct;

      var rotationDegrees = Math.atan2(relTargetPctLeft, relTargetPctTop) / Math.PI * 180;

      this.$('.tower__body').css({ '-webkit-transform': 'rotate(' + rotationDegrees + 'deg)',
        '-moz-transform': 'rotate(' + rotationDegrees + 'deg)',
        '-ms-transform': 'rotate(' + rotationDegrees + 'deg)',
        'transform': 'rotate(' + rotationDegrees + 'deg)' });

      _ember['default'].run.later(this, function () {
        if (!_this5.get('isDestroying')) {
          _this5._faceTarget();
        }
      }, 50);
    }),

    _startSpinning: _ember['default'].observer('attrs.waveStarted', function () {
      if (this.get('towerUpgraded') && this.attrs.waveStarted) {
        this.$('.tower__body').css({ '-webkit-animation': 'rotating 2s linear infinite',
          '-moz-animation': 'rotating 2s linear infinite',
          '-ms-animation': 'rotating 2s linear infinite',
          '-o-animation': 'rotating 2s linear infinite',
          'animation': 'rotating 2s linear infinite' });
      }
    })
  });

  ///////////////////
  //               //
  //   Targeting   //
  //               //
  ///////////////////

  TowerComponent.reopen({
    targetId: null,

    _attackMobsInRange: function _attackMobsInRange() {
      var _this6 = this;

      if (this.attrs.mobs.length < 1) {
        return;
      }

      var range = this.attrs.towerAttackRange;
      var towerHasShot = false;
      this.attrs.mobs.forEach(function (mob) {
        var mobInRange = _this6._mobInRange(mob, range);
        var mobAlive = mob.get('health') > 0;

        if (mobInRange && mobAlive && !towerHasShot) {
          if (!_this6.get('towerUpgraded')) {
            towerHasShot = true;
          }

          var mobId = mob.get('id');
          _this6.set('targetId', mobId);
          _this6._buildProjectile(mobId);
        }
      });

      if (!towerHasShot) {
        this.set('targetId', null);
      }

      _ember['default'].run.later(this, function () {
        if (!_this6.get('isDestroying') && _this6.attrs.waveStarted) {
          _this6._attackMobsInRange();
        }
      }, this.get('towerUpgraded') ? 1500 : 500);
    },

    _getTargetDistance: function _getTargetDistance(target) {
      var tower = this.attrs.tower;
      var latDiff = Math.abs(tower.get('posX') - target.get('posX'));
      var lngDiff = Math.abs(tower.get('posY') - target.get('posY'));
      return latDiff + lngDiff;
    },

    _mobInRange: function _mobInRange(mob, range) {
      if (!mob) {
        return false;
      }

      return this._getTargetDistance(mob) < range ? true : false;
    },

    _beginAttackingMobsInRange: _ember['default'].observer('attrs.waveStarted', function () {
      if (this.attrs.waveStarted) {
        this._attackMobsInRange();
      }
    })
  });

  /////////////////////
  //                 //
  //   Projectiles   //
  //                 //
  /////////////////////

  TowerComponent.reopen({
    projectiles: _ember['default'].computed(function () {
      return [];
    }),

    _buildProjectile: function _buildProjectile(mobId) {
      var targetedMob = this._getMobById(mobId);
      if (targetedMob) {
        var newProjectile = _towerDefenseObjectsProjectile['default'].create({
          id: this._generateIdForProjectile(),
          mobId: mobId,

          mobX: targetedMob.get('posX'),
          mobY: targetedMob.get('posY')
        });

        this.get('projectiles').addObject(newProjectile);

        this._playCannonSound(mobId);

        return;
      }
    },

    _generateIdForProjectile: function _generateIdForProjectile() {
      function generate4DigitString() {
        var baseInt = Math.floor((1 + Math.random()) * 0x10000);
        return baseInt.toString(16).substring(1);
      }

      return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
    },

    _getMobById: function _getMobById(mobId) {
      var needle = undefined;
      this.attrs.mobs.forEach(function (mob) {
        if (mob.get('id') === mobId) {
          needle = mob;
        }
      });
      return needle;
    },

    _getProjectileById: function _getProjectileById(projectileId) {
      var needle = undefined;
      this.get('projectiles').forEach(function (projectile) {
        if (projectile.get('id') === projectileId) {
          needle = projectile;
        }
      });
      return needle;
    },

    _playCannonSound: function _playCannonSound(mobId) {
      var _this7 = this;

      var cannonType = this.get('towerUpgraded') ? 2 : 1;
      var $cannonSoundEl = _ember['default'].$('<audio class="cannon-sound cannon-sound-' + mobId + '" autoplay>\n         <source src="/sounds/cannon-' + cannonType + '.mp3" type="audio/mpeg">\n       </audio>');

      $cannonSoundEl.appendTo(this.$());

      //  volumeKey: 0: up, 1: down, 2: off
      switch (this.attrs.volumeKey) {
        case 0:
          this.$('.cannon-sound').prop('volume', 0.5);
          break;

        case 1:
          this.$('.cannon-sound').prop('volume', 0.2);
          break;

        case 2:
          this.$('.cannon-sound').prop('volume', 0);
          break;
      }

      _ember['default'].run.later(this, function () {
        if (_this7.isDestroying) {
          return;
        }

        _this7.$('.cannon-sound-' + mobId).remove();
      }, this.get('towerUpgraded') ? 3000 : 2000);
    },

    _cleanUpAudioTags: _ember['default'].on('willDestroyElement', function () {
      this.$('.cannon-sound').remove();
    }),

    actions: {
      destroyProjectile: function destroyProjectile(projectileId) {
        if (this.get('isDestroying') || !this.attrs.waveStarted) {
          return;
        }

        var projectile = this._getProjectileById(projectileId);
        var projectileFound = !!projectile;
        var projectilesFound = this.get('projectiles.length') > 0;
        if (projectileFound && projectilesFound) {
          var projectileIndex = this.get('projectiles').indexOf(projectile);
          this.get('projectiles').removeAt(projectileIndex);
        }
      }
    }
  });

  exports['default'] = TowerComponent;
});
define('tower-defense/components/td-game/board/tower-group/tower/projectile/component', ['exports', 'ember'], function (exports, _ember) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var ProjectileComponent = _ember['default'].Component.extend({
    classNameBindings: ['attrs.upgraded:projectile--upgraded:projectile--standard'],

    classNames: ['tower__projectile'],

    _applyBackgroundImage: _ember['default'].on('didInsertElement', _ember['default'].observer('attrs.backgroundImage', function () {
      this.$().css('background-image', 'url(\'/images/explosion.gif\')');
    }))
  });

  /////////////////////
  //                 //
  //   Positioning   //
  //                 //
  /////////////////////

  ProjectileComponent.reopen({
    _positionProjectileOnMob: _ember['default'].on('didInsertElement', function () {
      var _this = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        var targetPosX = _this.attrs.targetPosX;
        var targetPosY = _this.attrs.targetPosY;
        _this.$().css('left', targetPosX - 2 + '%');
        _this.$().css('top', targetPosY - 1 + '%');

        _this.attrs['damage-mob'](_this.attrs.targetId, _this.attrs.attackPower);

        _ember['default'].run.later(_this, function () {
          _this._destroy();
        }, 300);
      });
    })
  });

  /////////////////////
  //                 //
  //   Termination   //
  //                 //
  /////////////////////

  ProjectileComponent.reopen({
    _destroy: function _destroy() {
      this.attrs.destroy(this.attrs.projectileId, this.attrs.targetId);
    }
  });

  exports['default'] = ProjectileComponent;
});
define("tower-defense/components/td-game/board/tower-group/tower/projectile/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["empty-body"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/board/tower-group/tower/projectile/template.hbs"
      },
      isEmpty: true,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("tower-defense/components/td-game/board/tower-group/tower/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/board/tower-group/tower/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tower__pulse");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tower__radius");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "tool-tip", [], ["selector", ["subexpr", "readonly", [["get", "attrs.tower.selector", ["loc", [null, [3, 34], [3, 54]]]]], [], ["loc", [null, [3, 24], [3, 55]]]], "type", "tower"], ["loc", [null, [3, 4], [4, 29]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 2
            },
            "end": {
              "line": 15,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/board/tower-group/tower/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tower__turret--upgraded");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "cannon cannon--1");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "cannon cannon--2");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 2
            },
            "end": {
              "line": 19,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/board/tower-group/tower/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tower__turret");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "turret__cannon turret__cannon--1");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 22,
              "column": 0
            },
            "end": {
              "line": 31,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/board/tower-group/tower/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "td-game/board/tower-group/tower/projectile", [], ["damage-mob", ["subexpr", "action", [["get", "attrs.damage-mob", ["loc", [null, [23, 66], [23, 82]]]]], [], ["loc", [null, [23, 58], [23, 83]]]], "destroy", ["subexpr", "action", ["destroyProjectile"], [], ["loc", [null, [24, 55], [24, 83]]]], "projectileId", ["subexpr", "readonly", [["get", "projectile.id", ["loc", [null, [25, 70], [25, 83]]]]], [], ["loc", [null, [25, 60], [25, 84]]]], "attackPower", ["subexpr", "readonly", [["get", "attrs.towerAttackPower", ["loc", [null, [26, 69], [26, 91]]]]], [], ["loc", [null, [26, 59], [26, 92]]]], "targetId", ["subexpr", "readonly", [["get", "projectile.mobId", ["loc", [null, [27, 66], [27, 82]]]]], [], ["loc", [null, [27, 56], [27, 83]]]], "targetPosX", ["subexpr", "readonly", [["get", "projectile.mobX", ["loc", [null, [28, 68], [28, 83]]]]], [], ["loc", [null, [28, 58], [28, 84]]]], "targetPosY", ["subexpr", "readonly", [["get", "projectile.mobY", ["loc", [null, [29, 68], [29, 83]]]]], [], ["loc", [null, [29, 58], [29, 84]]]], "upgraded", ["subexpr", "readonly", [["get", "towerUpgraded", ["loc", [null, [30, 66], [30, 79]]]]], [], ["loc", [null, [30, 56], [30, 80]]]]], ["loc", [null, [23, 2], [30, 82]]]]],
        locals: ["projectile"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 32,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/board/tower-group/tower/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "tower__body");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "selected", ["loc", [null, [2, 8], [2, 16]]]]], [], 0, null, ["loc", [null, [2, 2], [8, 9]]]], ["block", "if", [["get", "towerUpgraded", ["loc", [null, [11, 8], [11, 21]]]]], [], 1, 2, ["loc", [null, [11, 2], [19, 9]]]], ["block", "each", [["get", "projectiles", ["loc", [null, [22, 8], [22, 19]]]]], [], 3, null, ["loc", [null, [22, 0], [31, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define('tower-defense/components/td-game/component', ['exports', 'ember', 'tower-defense/utils/create-game'], function (exports, _ember, _towerDefenseUtilsCreateGame) {
  /* global marked */

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var GameComponent = _ember['default'].Component.extend({
    classNames: ['td-game']
  });

  /////////////////////////
  //                     //
  //   Wave Management   //
  //                     //
  /////////////////////////

  GameComponent.reopen({
    currentWaveNumber: 1,

    game: (0, _towerDefenseUtilsCreateGame['default'])(),

    waveStarted: false,

    currentWave: _ember['default'].computed('currentWaveNumber', 'game.waves.[]', function () {
      return this.get('game.waves').objectAt(this.get('currentWaveNumber') - 1);
    }),

    isFirstWave: _ember['default'].computed('currentWaveNumber', function () {
      return this.get('currentWaveNumber') === 1 ? true : false;
    }),

    isLastWave: _ember['default'].computed('currentWaveNumber', function () {
      return this.get('currentWaveNumber') === this.get('game.waves.length') ? true : false;
    }),

    _resetGame: _ember['default'].observer('waveStarted', function () {
      if (!this.get('waveStarted')) {
        this.set('cancellingWave', false);
        this.set('game', (0, _towerDefenseUtilsCreateGame['default'])());
      }
    }),

    actions: {
      changeWaveNext: function changeWaveNext() {
        if (this.get('waveStarted')) {
          console.error('You cannot start a new wave until this wave ends.');
          return;
        }

        var currentWaveNum = this.get('currentWaveNumber');
        if (currentWaveNum < this.get('game.waves.length')) {
          this.incrementProperty('currentWaveNumber');
          this._refreshOverlayAndModal();
        }
      },

      changeWavePrevious: function changeWavePrevious() {
        if (this.get('waveStarted')) {
          console.error('You cannot start a new wave until this wave ends.');
          return;
        }

        var currentWaveNum = this.get('currentWaveNumber');
        if (currentWaveNum > 1) {
          this.decrementProperty('currentWaveNumber');
          this._refreshOverlayAndModal();
        }
      },

      // TODO THIS COMMIT: this is never currently called
      changeWaveSelect: function changeWaveSelect(waveNum) {
        if (this.get('waveStarted')) {
          console.error('You cannot start a new wave until this wave ends.');
          return;
        }

        this.set('currentWaveNumber', waveNum);

        this._refreshOverlayAndModal();
      },

      startWave: function startWave() {
        this.set('waveStarted', true);
      }
    }
  });

  /////////////////////////
  //                     //
  //   Tower Selection   //
  //                     //
  /////////////////////////

  GameComponent.reopen({
    selectedTower: null,

    selectedTowerGroup: null,

    actions: {
      selectTower: function selectTower(tower) {
        if (this.get('waveStarted')) {
          return;
        }

        if (this.get('selectedTowerGroup')) {
          this.forceSet('selectedTowerGroup', null);
        }

        this.forceSet('selectedTower', tower);
      },

      selectTowerGroup: function selectTowerGroup(towerGroup) {
        if (this.get('waveStarted')) {
          return;
        }

        if (this.get('selectedTower')) {
          this.forceSet('selectedTower', null);
        }

        this.forceSet('selectedTowerGroup', towerGroup);
      }
    }
  });

  //////////////////////////
  //                      //
  //   Tower Collisions   //
  //                      //
  //////////////////////////

  GameComponent.reopen({
    collidingTowers: _ember['default'].computed('currentWaveNumber', function () {
      return [];
    }),

    towersColliding: _ember['default'].computed('collidingTowers.[]', function () {
      return !!this.get('collidingTowers.length');
    }),

    actions: {
      addCollidingTower: function addCollidingTower(towerId) {
        this.get('collidingTowers').addObject(towerId);
      },

      removeCollidingTower: function removeCollidingTower(towerId) {
        this.get('collidingTowers').removeObject(towerId);
      }
    }
  });

  GameComponent.reopen({
    actions: {
      reportTowerPosition: function reportTowerPosition(id, axis, pos) {
        axis = axis.toUpperCase();

        this.get('currentWave.towerGroups').forEach(function (tg) {
          tg.get('towers').forEach(function (tower) {
            if (tower.get('id') === id) {
              tower.set('pos' + axis, pos);
            }
          });
        });
      }
    }
  });

  /////////////////
  //             //
  //   Overlay   //
  //             //
  /////////////////

  GameComponent.reopen({
    overlayShown: true,

    _hideOverlay: function _hideOverlay() {
      this.set('overlayShown', false);
    },

    _hideOverlayAndModals: function _hideOverlayAndModals() {
      this._hideOverlay();
      this._hideModalsOnly();
    },

    _hideModalsOnly: function _hideModalsOnly() {
      this._hideInstructionsModal();
      this._hideGradeModal();
      this._hideCancellationModal();
      this._hideSupportModal();
    },

    _refreshOverlayAndModal: function _refreshOverlayAndModal() {
      this._hideModalsOnly();
      this._showInstructionsModal();
      this._showOverlay();
    },

    _showOverlay: function _showOverlay() {
      this.set('overlayShown', true);
    },

    _escapeOverlay: _ember['default'].on('didInsertElement', function () {
      var _this = this;

      _ember['default'].$(window).on('keydown', function (keyEvent) {
        if (_this.get('overlayShown') && keyEvent.which === 27) {
          _this._hideOverlayAndModals();
        }
      });
    }),

    actions: {
      // hide overlay whenever user "clicks out" of modal
      handleOverlayClick: function handleOverlayClick(event) {
        // the directly-clicked element (event.target), must be the overlay
        // (event.currentTarget) for the overlay to remain
        if (event.currentTarget === event.target) {
          this._hideOverlayAndModals();
        }
      },

      hideOverlay: function hideOverlay() {
        this._hideOverlayAndModals();
      },

      showOverlay: function showOverlay() {
        this._showInstructionsModal();
        this._showOverlay();
      }
    }
  });

  ////////////////////////////
  //                        //
  //      Modal: Grade      //
  //   (Score Management)   //
  //                        //
  ////////////////////////////

  GameComponent.reopen({
    gradeModalShown: false,

    passed: false,

    _hideGradeModal: function _hideGradeModal() {
      this.set('gradeModalShown', false);
    },

    _showGradeModal: function _showGradeModal() {
      this.set('gradeModalShown', true);
    },

    score: null,

    actions: {
      scoreWave: function scoreWave(wavePoints) {
        var _this2 = this;

        this.set('score', wavePoints);

        var minimumScore = this.get('currentWave.minimumScore');
        var passed = wavePoints >= minimumScore;

        this.set('passed', passed);

        if (passed && this.get('isLastWave')) {
          this._notifyEmbeddedVictory(wavePoints);
        }

        _ember['default'].run.later(this, function () {
          _this2._showGradeModal();
          _this2._showOverlay();

          _this2.set('waveStarted', false);
        }, 1000);
      }
    }
  });

  GameComponent.reopen({
    victoryNotified: false,

    _notifyEmbeddedVictory: function _notifyEmbeddedVictory(score) {
      if (this.get('victoryNotified')) {
        return;
      }

      if (typeof window === 'undefined' || !window.parent || window.parent === window) {
        return;
      }

      try {
        var targetOrigin = window.location && window.location.origin ? window.location.origin : '*';
        window.parent.postMessage({
          type: 'FLEXBOX_DEFENSE_WIN',
          score: score,
          timestamp: Date.now()
        }, targetOrigin);
        this.set('victoryNotified', true);
      } catch (error) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Flexbox Defense victory notification failed', error);
        }
      }
    },

    _resetVictoryNotification: _ember['default'].observer('currentWaveNumber', function () {
      if (!this.get('isLastWave')) {
        this.set('victoryNotified', false);
      }
    })
  });

  /////////////////////////////
  //                         //
  //   Modal: Instructions   //
  //                         //
  /////////////////////////////

  GameComponent.reopen({
    instructionsModalShown: true,

    _hideInstructionsModal: function _hideInstructionsModal() {
      this.set('instructionsModalShown', false);
    },

    _showInstructionsModal: function _showInstructionsModal() {
      this.set('instructionsModalShown', true);
    },

    instructionsMain: _ember['default'].computed('currentWaveNumber', function () {
      return marked(this.get('currentWave.instructions.main'));
    }),

    instructionsTldr: _ember['default'].computed('currentWaveNumber', function () {
      return marked(this.get('currentWave.instructions.tldr'));
    })
  });

  /////////////////////////////
  //                         //
  //   Modal: Cancellation   //
  //   (Wave Cancellation)   //
  //                         //
  /////////////////////////////

  GameComponent.reopen({
    cancellationModalShown: false,

    cancellingWave: false,

    _beginWaveCancellation: function _beginWaveCancellation() {
      var _this3 = this;

      this.set('cancellingWave', true);

      var mobFrequency = this.get('currentWave.mobs').objectAt(0).get('frequency');
      _ember['default'].run.later(this, function () {
        _this3.set('waveStarted', false);
      }, mobFrequency);
    },

    _hideCancellationModal: function _hideCancellationModal() {
      this.set('cancellationModalShown', false);
    },

    _showCancellationModal: function _showCancellationModal() {
      this.set('cancellationModalShown', true);
    },

    // until timing functions account for tabbing out, cancel waves on blur
    _autoBeginWaveCancellation: _ember['default'].on('didInsertElement', function () {
      var _this4 = this;

      _ember['default'].$(document).on('visibilitychange', function () {
        if (_this4.get('waveStarted')) {
          _this4._beginWaveCancellation();

          _this4._showCancellationModal();
          _this4._showOverlay();
        }
      });
    }),

    actions: {
      beginWaveCancellation: function beginWaveCancellation() {
        this._beginWaveCancellation();
      }
    }
  });

  ////////////////////////
  //                    //
  //   Modal: Support   //
  //                    //
  ////////////////////////

  GameComponent.reopen({
    supportModalShown: false,

    _hideSupportModal: function _hideSupportModal() {
      this.set('supportModalShown', false);
    },

    _showSupportModal: function _showSupportModal() {
      this.set('supportModalShown', true);
    },

    actions: {
      hideSupportModal: function hideSupportModal() {
        this.set('supportModalShown', false);
      },

      showSupportModal: function showSupportModal() {
        this._hideModalsOnly();
        this._showSupportModal();
      }
    }
  });

  ///////////////////////
  //                   //
  //   Dropdown Menu   //
  //                   //
  ///////////////////////

  GameComponent.reopen({
    closeDropdownFn: null,

    dropdownActive: false,

    numDropdownClicks: 0,

    _deactivateDropdown: function _deactivateDropdown(clickEvent) {
      clickEvent.stopPropagation();

      var $clickedElement = _ember['default'].$(clickEvent.target);
      var clickedDropdownBtn = $clickedElement.hasClass('nav__button--selector') || $clickedElement.parents('.nav__button--selector').length > 0;
      var clickedButtonMenu = $clickedElement.hasClass('button__menu') || $clickedElement.parents('.button__menu').length > 0;

      if (clickedDropdownBtn) {
        this.incrementProperty('numDropdownClicks');
      }

      if (clickedDropdownBtn && this.get('numDropdownClicks') < 2 || clickedButtonMenu) {
        return;
      }

      this.set('numDropdownClicks', 0);
      this.set('dropdownActive', false);
    },

    waveLinks: _ember['default'].computed('game', function () {
      var waveLink = [];

      for (var i = 1; i <= this.get('game.waves.length'); i++) {
        waveLink.addObject(i);
      }

      return waveLink;
    }),

    _toggleDropdown: _ember['default'].observer('dropdownActive', function () {
      if (this.get('dropdownActive')) {
        var closeDropdownFn = _ember['default'].run.bind(this, '_deactivateDropdown');

        _ember['default'].$(window).on('click', closeDropdownFn);

        this.set('closeDropdownFn', closeDropdownFn);
      } else {
        _ember['default'].$(window).off('click', this.get('closeDropdownFn'));
      }
    }),

    _preventSidebarScroll: _ember['default'].observer('dropdownActive', function () {
      if (this.get('dropdownActive')) {
        this.$('.td-game__sidebar').css('overflow-y', 'visible');
      } else {
        this.$('.td-game__sidebar').css('overflow-y', 'auto');
      }
    }),

    actions: {
      openDropdown: function openDropdown() {
        this.set('dropdownActive', true);
      }
    }
  });

  //////////////////////////////
  //                          //
  //   Tower Input Checkbox   //
  //                          //
  //////////////////////////////

  GameComponent.reopen({
    towerStylesHidden: true,

    _resetTowerInputsHidden: _ember['default'].observer('currentWaveNumber', function () {
      this.set('towerStylesHidden', this.get('currentWave.towerStylesHidden'));
    }),

    actions: {
      hideTowerInputs: function hideTowerInputs() {
        this.set('towerStylesHidden', true);
      },

      showTowerInputs: function showTowerInputs() {
        this.set('towerStylesHidden', false);
      }
    }
  });

  ////////////////////////
  //                    //
  //   Deselect Units   //
  //                    //
  ////////////////////////

  GameComponent.reopen({
    _sendSelectAction: _ember['default'].on('didInsertElement', function () {
      var _this5 = this;

      this.$().click(function (clickEvent) {
        var $clickedEl = _ember['default'].$(clickEvent.target);

        var $towerGroupParents = $clickedEl.closest('.board__tower-group');
        var isChildOfTowerGroup = $towerGroupParents.length > 0;

        var $inputContainerParents = $clickedEl.closest('.block__input-container');
        var isChildOfInputContainer = $inputContainerParents.length > 0;

        var $toolTipParents = $clickedEl.closest('.tool-tip');
        var isChildOfToolTip = $toolTipParents.length > 0;

        var isOverlay = $clickedEl.hasClass('overlay');

        var isPulse = $clickedEl.hasClass('tower-group__pulse');

        if (!isChildOfTowerGroup && !isChildOfInputContainer && !isChildOfToolTip && !isOverlay && !isPulse) {
          _this5.set('selectedTower', null);
          _this5.set('selectedTowerGroup', null);
        }
      });
    })
  });

  exports['default'] = GameComponent;
});
define('tower-defense/components/td-game/stylesheet/block/component', ['exports', 'ember', 'tower-defense/utils/create-unit-code-line'], function (exports, _ember, _towerDefenseUtilsCreateUnitCodeLine) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var BlockComponent = _ember['default'].Component.extend({
    classNames: ['stylesheet__block'],

    tagName: 'ol'
  });

  //////////////////////////////
  //                          //
  //   Code Line Management   //
  //                          //
  //////////////////////////////

  BlockComponent.reopen({
    _deleteCodeLine: function _deleteCodeLine(id) {
      var codeLines = this.get('codeLines');
      var codeLine = this._getCodeLineById(id);

      if (codeLine.get('codeLine') || this.attrs.waveStarting || this._otherUnsubmittedCodeLinesExist(id)) {
        var index = codeLines.indexOf(codeLine);
        codeLines.removeAt(index);
      }
    },

    _getCodeLineById: function _getCodeLineById(id) {
      var codeLines = this.get('codeLines');
      var targetCodeLine = undefined;
      codeLines.forEach(function (codeLine) {
        if (id === codeLine.get('id')) {
          targetCodeLine = codeLine;
        }
      });

      return targetCodeLine;
    },

    _otherUnsubmittedCodeLinesExist: function _otherUnsubmittedCodeLinesExist(id) {
      var codeLines = this.get('codeLines');
      var otherUnsubmittedCodeLinesExist = false;
      codeLines.forEach(function (codeLine) {
        if (id !== codeLine.get('id')) {
          if (!codeLine.get('submitted')) {
            otherUnsubmittedCodeLinesExist = true;
          }
        }
      });

      return otherUnsubmittedCodeLinesExist;
    },

    codeLines: _ember['default'].computed('attrs.towerGroup.styles.[]', 'attrs.tower.styles.[]', function () {
      return this.attrs.tower ? this.attrs.tower.get('styles') : this.attrs.towerGroup.get('styles');
    }),

    actions: {
      deleteCodeLine: function deleteCodeLine(id) {
        this._deleteCodeLine(id);
      },

      submitCodeLine: function submitCodeLine(codeStr, id, valid) {
        this.get('codeLines').forEach(function (unitCodeLine) {
          if (unitCodeLine.get('id') === id) {
            unitCodeLine.set('valid', valid);
            unitCodeLine.set('codeLine', codeStr);
            unitCodeLine.set('submitted', true);
          }
        });
      }
    }
  });

  /////////////////////////
  //                     //
  //   Wave Initiation   //
  //                     //
  /////////////////////////

  BlockComponent.reopen({
    removeUnsubmittedCodeLines: _ember['default'].observer('attrs.waveStarting', function () {
      var _this = this;

      if (this.attrs.waveStarting) {
        this.get('codeLines').forEach(function (codeLine) {
          if (!codeLine.submitted) {
            _this._deleteCodeLine(codeLine.get('id'));
          }
        });
      }
    })
  });

  ////////////////////
  //                //
  //   Auto Focus   //
  //                //
  ////////////////////

  BlockComponent.reopen({
    inputIdSelectedManually: null,

    inputIdToFocus: null,

    _getUnsubmittedId: function _getUnsubmittedId() {
      var unsubmittedId = undefined;

      this.get('codeLines').forEach(function (codeLine) {
        if (!codeLine.submitted) {
          unsubmittedId = codeLine.get('id');
        }
      });

      return unsubmittedId;
    },

    _ensureUnsubmittedCodeLinesExist: _ember['default'].observer('codeLines.@each.submitted', function () {
      if (this.attrs.waveStarting) {
        return;
      }

      var codeLines = this.get('codeLines');
      if (codeLines.isEvery('submitted')) {
        codeLines.addObject((0, _towerDefenseUtilsCreateUnitCodeLine['default'])());
      }
    }),

    _focusProperInput: _ember['default'].observer('attrs.selectedTower', 'attrs.selectedTowerGroup', 'attrs.tower', 'attrs.towerGroup', function () {
      if (this.attrs.waveStarted) {
        return;
      }

      var towerSelected = this.attrs.selectedTower && this.attrs.selectedTower === this.attrs.tower;

      var towerGroupSelected = this.attrs.selectedTowerGroup && this.attrs.selectedTowerGroup === this.attrs.towerGroup;

      if (towerSelected || towerGroupSelected) {
        var inputAutoSelected = !this.get('inputIdSelectedManually');
        if (inputAutoSelected) {
          var unsubmittedInputId = this._getUnsubmittedId();
          this.forceSet('inputIdToFocus', unsubmittedInputId);
        } else {
          this.forceSet('inputIdToFocus', this.get('inputIdSelectedManually'));
        }
      }
    }),

    actions: {
      disableAutoFocus: function disableAutoFocus(id) {
        this.set('inputIdSelectedManually', id);
      },

      enableAutoFocus: function enableAutoFocus() {
        this.set('inputIdSelectedManually', null);
      }
    }
  });

  exports['default'] = BlockComponent;
});
define('tower-defense/components/td-game/stylesheet/block/input/component', ['exports', 'ember', 'tower-defense/utils/create-flexbox-ref'], function (exports, _ember, _towerDefenseUtilsCreateFlexboxRef) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var InputComponent = _ember['default'].Component.extend({
    inputValue: null,

    inputViewName: 'input', // This can be called anything.

    inputEmpty: _ember['default'].computed('inputValue', function () {
      if (!this.get('inputValue')) {
        return true;
      }

      return this.get('inputValue') === '' ? true : false;
    }),

    actions: {
      handleInputEnter: function handleInputEnter() {
        this._submitCode();
      },

      handleKeyDown: function handleKeyDown(keyDownVal) {
        this.set('inputValue', keyDownVal);
      }
    }
  });

  ///////////////////////////////
  //                           //
  //   Submission Processing   //
  //                           //
  ///////////////////////////////

  InputComponent.reopen({
    _submitCode: function _submitCode() {
      if (this.get('inputValid')) {
        this.attrs['submit-code-line'](this.get('inputValue'), this.attrs.codeLineId, true);
      } else if (this.get('inputEmpty')) {
        this.attrs['delete-code-line'](this.attrs.codeLineId);
      } else {
        this.attrs['shake-stylesheet']();

        this.attrs['submit-code-line'](this.get('inputValue'), this.attrs.codeLineId, false);
      }
    }
  });

  ///////////////
  //           //
  //   Focus   //
  //           //
  ///////////////

  InputComponent.reopen({
    focusInCount: 0,

    focusOutCount: 0,

    _focusInput: function _focusInput() {
      var inputViewName = this.get('inputViewName');
      var inputComponent = this.get(inputViewName);
      var inputEl = inputComponent.get('element');
      inputEl.focus();
    },

    _focusIfFirstInput: _ember['default'].on('didInsertElement', _ember['default'].observer('overlayShown', function () {
      var _this = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        if (_this.attrs.unitId === _this.attrs.firstTowerGroupId && !_this.attrs.overlayShown) {
          _this._focusInput();
        }
      });
    })),

    _focusMatchedInput: _ember['default'].observer('attrs.inputIdToFocus', function () {
      if (this.attrs.inputIdToFocus === this.attrs.codeLineId) {
        this._focusInput();
      }
    }),

    focusNewInput: _ember['default'].computed('attrs.blockSubmitted', function () {
      if (!this.attrs.finalInputFound || this.attrs.overlayShown) {
        return false;
      }

      return !this.attrs.blockSubmitted;
    }),

    _notifyOnFinalInput: _ember['default'].on('didInsertElement', function () {
      var _this2 = this;

      _ember['default'].run.schedule('afterRender', this, function () {
        if (_this2.attrs.unitId === _this2.attrs.finalTowerId) {
          _this2.attrs['notify-final-input']();
        }
      });
    }),

    _sendFocusedState: _ember['default'].observer('focusInCount', 'focusOutCount', function () {
      var focusInCount = this.get('focusInCount');
      var focusOutCount = this.get('focusOutCount');

      // autofocus is the block's function for automatically focusing on the
      // unsubmitted input
      if (focusInCount > focusOutCount) {
        this.attrs['disable-autofocus'](this.attrs.codeLineId);
      } else {
        this.attrs['enable-autofocus'](this.attrs.codeLineId);
      }
    }),

    actions: {
      handleFocusIn: function handleFocusIn() {
        var focusInCount = this.get('focusInCount');
        this.set('focusInCount', focusInCount + 1);

        var unit = undefined;
        var attribute = undefined;

        if (this.attrs.tower) {
          unit = this.attrs.tower;
          attribute = 'tower';
        } else {
          unit = this.attrs.towerGroup;
          attribute = 'tower-group';
        }

        this.attrs['select-' + attribute](unit);
      },

      handleFocusOut: function handleFocusOut() {
        var focusOutCount = this.get('focusOutCount');
        this.set('focusOutCount', focusOutCount + 1);

        this._submitCode();
      }
    }
  });

  ////////////////////////////
  //                        //
  //   Flexbox Validation   //
  //                        //
  ////////////////////////////

  InputComponent.reopen({
    flexboxRef: (0, _towerDefenseUtilsCreateFlexboxRef['default'])(),

    _getProperty: function _getProperty() {
      var inputValueLowerCase = this.get('inputValue').toLowerCase();
      var colonLocation = inputValueLowerCase.indexOf(':');

      return inputValueLowerCase.substring(0, colonLocation);
    },

    _propertyFound: function _propertyFound() {
      if (this.get('inputEmpty')) {
        return false;
      }

      var colonLocation = this.get('inputValue').indexOf(':');
      return colonLocation < 1 ? false : true;
    },

    _getValWithoutSemiColon: function _getValWithoutSemiColon(val) {
      var lastIndex = val.length - 1;
      if (val[lastIndex] === ';') {
        return val.substring(0, lastIndex);
      }
    },

    _validPropertyFound: function _validPropertyFound() {
      if (!this._propertyFound()) {
        return false;
      }

      var propertyType = this.attrs.tower ? 'item' : 'container';
      var property = this._getProperty();
      if (!this.get('flexboxRef').get(propertyType)[property]) {
        return false;
      }

      return true;
    },

    _validValueFound: function _validValueFound() {
      if (!this._propertyFound()) {
        return false;
      }

      var property = this._getProperty();
      var startIndex = property.length + 1;
      var endIndex = this.get('inputValue.length');

      var fullValue = this.get('inputValue').substring(startIndex, endIndex).trim();
      var semicolonFound = fullValue[fullValue.length - 1] === ';';
      var value = undefined;
      if (semicolonFound) {
        value = this._getValWithoutSemiColon(fullValue);
      } else {
        value = fullValue;
      }

      var propertyType = this.attrs.tower ? 'item' : 'container';
      var valueFound = false;
      this.get('flexboxRef').get(propertyType)[property].forEach(function (validValue) {
        if (value === validValue.toString()) {
          valueFound = true;
        }
      });

      return valueFound ? true : false;
    },

    inputValid: _ember['default'].computed('inputValue', function () {
      return this._validPropertyFound() && this._validValueFound();
    })
  });

  exports['default'] = InputComponent;
});
define("tower-defense/components/td-game/stylesheet/block/input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/block/input/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "inputValue", ["loc", [null, [3, 4], [3, 18]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/block/input/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "input", [], ["class", "block__input", "enter", ["subexpr", "action", ["handleInputEnter"], [], ["loc", [null, [7, 16], [7, 43]]]], "focus-in", ["subexpr", "action", ["handleFocusIn"], [], ["loc", [null, [8, 19], [8, 43]]]], "focus-out", ["subexpr", "action", ["handleFocusOut"], [], ["loc", [null, [9, 20], [9, 45]]]], "focusOnInsert", ["subexpr", "readonly", [["get", "focusNewInput", ["loc", [null, [10, 34], [10, 47]]]]], [], ["loc", [null, [10, 24], [10, 48]]]], "key-down", ["subexpr", "action", ["handleKeyDown"], [], ["loc", [null, [11, 19], [11, 43]]]], "value", ["subexpr", "readonly", [["get", "inputValue", ["loc", [null, [12, 26], [12, 36]]]]], [], ["loc", [null, [12, 16], [12, 37]]]], "viewName", ["subexpr", "readonly", [["get", "inputViewName", ["loc", [null, [13, 29], [13, 42]]]]], [], ["loc", [null, [13, 19], [13, 43]]]]], ["loc", [null, [6, 2], [13, 45]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/stylesheet/block/input/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "attrs.waveStarted", ["loc", [null, [1, 6], [1, 23]]]]], [], 0, 1, ["loc", [null, [1, 0], [14, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("tower-defense/components/td-game/stylesheet/block/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "block__line block__declaration");
          var el2 = dom.createTextNode("\n    display: flex;\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 2
              },
              "end": {
                "line": 32,
                "column": 2
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1, "class", "block__line block__declaration");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["inline", "td-game/stylesheet/block/input", [], ["blockCodeLine", ["subexpr", "readonly", [["get", "twrCodeLine.codeLine", ["loc", [null, [10, 63], [10, 83]]]]], [], ["loc", [null, [10, 53], [10, 84]]]], "blockSubmitted", ["subexpr", "readonly", [["get", "twrCodeLine.submitted", ["loc", [null, [11, 64], [11, 85]]]]], [], ["loc", [null, [11, 54], [11, 86]]]], "class", "block__input-container", "codeLineId", ["subexpr", "readonly", [["get", "twrCodeLine.id", ["loc", [null, [13, 60], [13, 74]]]]], [], ["loc", [null, [13, 50], [13, 75]]]], "delete-code-line", ["subexpr", "action", ["deleteCodeLine"], [], ["loc", [null, [14, 56], [14, 81]]]], "disable-autofocus", ["subexpr", "action", ["disableAutoFocus"], [], ["loc", [null, [15, 57], [15, 84]]]], "enable-autofocus", ["subexpr", "action", ["enableAutoFocus"], [], ["loc", [null, [16, 56], [16, 82]]]], "finalInputFound", ["subexpr", "readonly", [["get", "attrs.finalInputFound", ["loc", [null, [17, 65], [17, 86]]]]], [], ["loc", [null, [17, 55], [17, 87]]]], "finalTowerId", ["subexpr", "readonly", [["get", "attrs.finalTowerId", ["loc", [null, [18, 62], [18, 80]]]]], [], ["loc", [null, [18, 52], [18, 81]]]], "firstTowerGroupId", ["subexpr", "readonly", [["get", "attrs.firstTowerGroupId", ["loc", [null, [19, 67], [19, 90]]]]], [], ["loc", [null, [19, 57], [19, 91]]]], "inputIdToFocus", ["subexpr", "readonly", [["get", "inputIdToFocus", ["loc", [null, [20, 64], [20, 78]]]]], [], ["loc", [null, [20, 54], [20, 79]]]], "notify-final-input", ["subexpr", "action", [["get", "attrs.notify-final-input", ["loc", [null, [21, 66], [21, 90]]]]], [], ["loc", [null, [21, 58], [21, 91]]]], "overlayShown", ["subexpr", "readonly", [["get", "attrs.overlayShown", ["loc", [null, [22, 62], [22, 80]]]]], [], ["loc", [null, [22, 52], [22, 81]]]], "shake-stylesheet", ["subexpr", "action", [["get", "attrs.shake-stylesheet", ["loc", [null, [23, 64], [23, 86]]]]], [], ["loc", [null, [23, 56], [23, 87]]]], "submit-code-line", ["subexpr", "action", ["submitCodeLine"], [], ["loc", [null, [24, 56], [24, 81]]]], "select-tower", ["subexpr", "action", [["get", "attrs.select-tower", ["loc", [null, [25, 60], [25, 78]]]]], [], ["loc", [null, [25, 52], [25, 79]]]], "selectedTower", ["subexpr", "readonly", [["get", "attrs.selectedTower", ["loc", [null, [26, 63], [26, 82]]]]], [], ["loc", [null, [26, 53], [26, 83]]]], "tower", ["subexpr", "readonly", [["get", "attrs.tower", ["loc", [null, [27, 55], [27, 66]]]]], [], ["loc", [null, [27, 45], [27, 67]]]], "unitId", ["subexpr", "readonly", [["get", "attrs.tower.id", ["loc", [null, [28, 56], [28, 70]]]]], [], ["loc", [null, [28, 46], [28, 71]]]], "unitType", ["subexpr", "readonly", ["tower"], [], ["loc", [null, [29, 48], [29, 66]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [30, 61], [30, 78]]]]], [], ["loc", [null, [30, 51], [30, 79]]]]], ["loc", [null, [10, 6], [30, 81]]]]],
          locals: ["twrCodeLine"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 33,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "each", [["get", "codeLines", ["loc", [null, [8, 10], [8, 19]]]]], [], 0, null, ["loc", [null, [8, 2], [32, 11]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 34,
                "column": 2
              },
              "end": {
                "line": 57,
                "column": 2
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1, "class", "block__line block__declaration");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["inline", "td-game/stylesheet/block/input", [], ["blockCodeLine", ["subexpr", "readonly", [["get", "twrGrpCodeLine.codeLine", ["loc", [null, [36, 63], [36, 86]]]]], [], ["loc", [null, [36, 53], [36, 87]]]], "blockSubmitted", ["subexpr", "readonly", [["get", "twrGrpCodeLine.submitted", ["loc", [null, [37, 64], [37, 88]]]]], [], ["loc", [null, [37, 54], [37, 89]]]], "class", "block__input-container", "codeLineId", ["subexpr", "readonly", [["get", "twrGrpCodeLine.id", ["loc", [null, [39, 60], [39, 77]]]]], [], ["loc", [null, [39, 50], [39, 78]]]], "delete-code-line", ["subexpr", "action", ["deleteCodeLine"], [], ["loc", [null, [40, 56], [40, 81]]]], "disable-autofocus", ["subexpr", "action", ["disableAutoFocus"], [], ["loc", [null, [41, 57], [41, 84]]]], "enable-autofocus", ["subexpr", "action", ["enableAutoFocus"], [], ["loc", [null, [42, 56], [42, 82]]]], "finalInputFound", ["subexpr", "readonly", [["get", "finalInputFound", ["loc", [null, [43, 65], [43, 80]]]]], [], ["loc", [null, [43, 55], [43, 81]]]], "finalTowerId", ["subexpr", "readonly", [["get", "attrs.finalTowerId", ["loc", [null, [44, 62], [44, 80]]]]], [], ["loc", [null, [44, 52], [44, 81]]]], "firstTowerGroupId", ["subexpr", "readonly", [["get", "attrs.firstTowerGroupId", ["loc", [null, [45, 67], [45, 90]]]]], [], ["loc", [null, [45, 57], [45, 91]]]], "inputIdToFocus", ["subexpr", "readonly", [["get", "inputIdToFocus", ["loc", [null, [46, 64], [46, 78]]]]], [], ["loc", [null, [46, 54], [46, 79]]]], "overlayShown", ["subexpr", "readonly", [["get", "attrs.overlayShown", ["loc", [null, [47, 62], [47, 80]]]]], [], ["loc", [null, [47, 52], [47, 81]]]], "shake-stylesheet", ["subexpr", "action", [["get", "attrs.shake-stylesheet", ["loc", [null, [48, 64], [48, 86]]]]], [], ["loc", [null, [48, 56], [48, 87]]]], "submit-code-line", ["subexpr", "action", ["submitCodeLine"], [], ["loc", [null, [49, 56], [49, 81]]]], "select-tower-group", ["subexpr", "action", [["get", "attrs.select-tower-group", ["loc", [null, [50, 66], [50, 90]]]]], [], ["loc", [null, [50, 58], [50, 91]]]], "selectedTowerGroup", ["subexpr", "readonly", [["get", "attrs.selectedTowerGroup", ["loc", [null, [51, 68], [51, 92]]]]], [], ["loc", [null, [51, 58], [51, 93]]]], "towerGroup", ["subexpr", "readonly", [["get", "attrs.towerGroup", ["loc", [null, [52, 60], [52, 76]]]]], [], ["loc", [null, [52, 50], [52, 77]]]], "unitId", ["subexpr", "readonly", [["get", "attrs.towerGroup.id", ["loc", [null, [53, 56], [53, 75]]]]], [], ["loc", [null, [53, 46], [53, 76]]]], "unitType", ["subexpr", "readonly", ["tower group"], [], ["loc", [null, [54, 48], [54, 72]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [55, 61], [55, 78]]]]], [], ["loc", [null, [55, 51], [55, 79]]]]], ["loc", [null, [36, 6], [55, 81]]]]],
          locals: ["twrGrpCodeLine"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 33,
              "column": 0
            },
            "end": {
              "line": 58,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "each", [["get", "codeLines", ["loc", [null, [34, 10], [34, 19]]]]], [], 0, null, ["loc", [null, [34, 2], [57, 11]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 59,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/stylesheet/block/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "attrs.towerGroup", ["loc", [null, [1, 6], [1, 22]]]]], [], 0, null, ["loc", [null, [1, 0], [5, 7]]]], ["block", "if", [["get", "attrs.tower", ["loc", [null, [7, 6], [7, 17]]]]], [], 1, 2, ["loc", [null, [7, 0], [58, 7]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define('tower-defense/components/td-game/stylesheet/component', ['exports', 'ember'], function (exports, _ember) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var StylesheetComponent = _ember['default'].Component.extend({
    classNames: ['sidebar__stylesheet']
  });

  /////////////////////////////
  //                         //
  //   Toggle Tower Inputs   //
  //                         //
  /////////////////////////////

  StylesheetComponent.reopen({
    towerInputsHidden: true,

    _showTowerInputs: _ember['default'].observer('towerInputsHidden', function () {
      if (!this.get('towerInputsHidden')) {
        this.attrs['show-tower-inputs']();
      }
    }),

    _hideTowerInputs: _ember['default'].observer('towerInputsHidden', function () {
      if (this.get('towerInputsHidden')) {
        this.attrs['hide-tower-inputs']();
      }
    }),

    _resetTowerInputsHidden: _ember['default'].observer('attrs.towerStylesHidden', function () {
      this.set('towerInputsHidden', this.attrs.towerStylesHidden);
    }),

    actions: {
      toggleHideInputs: function toggleHideInputs() {
        this.set('towerInputsHidden', !this.get('towerInputsHidden'));
      }
    }
  });

  /////////////////////////
  //                     //
  //   Wave Initiation   //
  //                     //
  /////////////////////////

  StylesheetComponent.reopen({
    waveStarting: false,

    _falsifyWaveStarting: _ember['default'].observer('waveStarted', function () {
      if (this.attrs.waveStarted) {
        this.set('waveStarting', false);
      }
    }),

    // shift + enter hotkey
    _startWave: _ember['default'].observer('attrs.overlayShown', function () {
      var _this = this;

      if (this.attrs.overlayShown) {
        _ember['default'].$(window).off('keypress');
      } else {
        _ember['default'].$(window).on('keypress', function (keyEvent) {
          if (keyEvent.shiftKey && keyEvent.which === 13) {
            if (_this.attrs.towersColliding) {
              _this._shake();
              return;
            }

            _this.set('waveStarting', true);
            _this.attrs['start-wave']();
          }
        });
      }
    }),

    actions: {
      startWave: function startWave() {
        this.set('waveStarting', true);
        this.attrs['start-wave']();
      }
    }
  });

  ///////////////////////////
  //                       //
  //   Wave Cancellation   //
  //                       //
  ///////////////////////////

  StylesheetComponent.reopen({
    actions: {
      cancelWave: function cancelWave() {
        this.attrs['cancel-wave']();
      }
    }
  });

  /////////////////////
  //                 //
  //   Block Lines   //
  //                 //
  /////////////////////

  StylesheetComponent.reopen({
    _getLinesForBraces: function _getLinesForBraces() {
      var count = 0;
      var towerGroups = this.attrs.towerGroups;
      var towersAndTowerGroups = this.attrs.towerStylesHidden ? towerGroups : towerGroups.concat(this.get('towers'));

      towersAndTowerGroups.forEach(function () {
        for (var i = 0; i < 2; i++) {
          count++;
        }
      });

      return count;
    },

    _getLinesForInputs: function _getLinesForInputs() {
      var count = 0;
      var towerGroupStyles = this.get('towerGroupStyles');
      var towerAndTowerGroupStyles = this.attrs.towerStylesHidden ? towerGroupStyles : towerGroupStyles.concat(this.get('towerStyles'));

      towerAndTowerGroupStyles.forEach(function () {
        count++;
      });

      return count;
    },

    // Line breaks: TG + T - 1
    _getLinesForLineBreaks: function _getLinesForLineBreaks() {
      var count = 0;
      var numTowers = this.get('towers.length');
      var numTowerGroups = this.attrs.towerGroups.length;
      var numTowersAndTowerGroups = this.attrs.towerStylesHidden ? numTowerGroups : numTowers + numTowerGroups;
      var numLineBreakLines = numTowersAndTowerGroups - 1;

      for (var i = 0; i < numLineBreakLines; i++) {
        count++;
      }

      return count;
    },

    // Manual properties (display: flex): 1 per tower group
    _getLinesForManualProperties: function _getLinesForManualProperties() {
      return this.attrs.towerGroups.length;
    },

    _flatten: function _flatten(arrays) {
      var items = _ember['default'].A([]);

      arrays.forEach(function (array) {
        array.forEach(function (item) {
          items.addObject(item);
        });
      });

      return items;
    },

    lineNumbers: _ember['default'].computed('attrs.currentWaveNumber', 'attrs.towersGroups.[]', 'attrs.waveStarted', 'towerGroupStyles.[]', 'towerStylesHidden', 'towers.[]', 'towerStyles.[]', function () {
      var lineCount = this._getLinesForManualProperties() + this._getLinesForBraces() + this._getLinesForInputs() + this._getLinesForLineBreaks(); // TG + T - 1

      var lineNumbers = [];
      for (var i = 1; i <= lineCount; i++) {
        lineNumbers.push(i);
      }

      return lineNumbers;
    }),

    towerGroupStylesMapped: _ember['default'].computed.mapBy('attrs.towerGroups', 'styles'),

    towerGroupStyles: _ember['default'].computed('attrs.currentWaveNumber', 'attrs.waveStarted', 'towerGroupStylesMapped.@each.[]', function () {
      return this._flatten(this.get('towerGroupStylesMapped'));
    }),

    towersMapped: _ember['default'].computed.mapBy('attrs.towerGroups', 'towers'),

    towers: _ember['default'].computed('towersMapped.@each.[]', function () {
      return this._flatten(this.get('towersMapped'));
    }),

    towerStylesMapped: _ember['default'].computed.mapBy('towers', 'styles'),

    towerStyles: _ember['default'].computed('towerStylesMapped.@each.[]', function () {
      return this._flatten(this.get('towerStylesMapped'));
    })
  });

  /////////////////////
  //                 //
  //   Shake Error   //
  //                 //
  /////////////////////

  StylesheetComponent.reopen({
    shakeActive: false,

    _delayNextShake: function _delayNextShake() {
      var _this2 = this;

      this.set('shakeActive', true);

      _ember['default'].run.later(this, function () {
        _this2.set('shakeActive', false);
      }, 1300);
    },

    _shake: function _shake() {
      if (this.get('shakeActive')) {
        return;
      }

      this._delayNextShake();

      var l = 20;
      for (var i = 0; i < 10; i++) {
        this.$().animate({
          'margin-left': "+=" + (l = -l) + 'px',
          'margin-right': "-=" + l + 'px'
        }, 115);
      }
    },

    actions: {
      shake: function shake() {
        this._shake();
      }
    }
  });

  /////////////////////////
  //                     //
  //   Input Reporting   //
  //                     //
  /////////////////////////

  StylesheetComponent.reopen({
    finalTowerId: null,

    firstTowerGroupId: null,

    finalInputFound: false,

    _setFirstAndFinalUnitIds: _ember['default'].on('init', _ember['default'].observer('attrs.currentWaveNumber', 'attrs.waveStarted', function () {
      if (!this.attrs.waveStarted) {
        var firstTowerGroup = this.attrs.towerGroups.get('firstObject');
        var firstTowerGroupId = firstTowerGroup.get('id');
        this.set('firstTowerGroupId', firstTowerGroupId);

        var finalTowerGroup = this.attrs.towerGroups.get('lastObject');
        var finalTower = finalTowerGroup.get('towers').get('lastObject');
        var finalTowerId = finalTower.get('id');
        this.set('finalTowerId', finalTowerId);
      }
    })),

    actions: {
      notifyFinalInput: function notifyFinalInput() {
        this.set('finalInputFound', true);
      }
    }
  });

  /////////////////////
  //                 //
  //   Help Button   //
  //                 //
  /////////////////////

  StylesheetComponent.reopen({
    actions: {
      showOverlay: function showOverlay() {
        this.attrs['show-overlay']();
      }
    }
  });

  exports['default'] = StylesheetComponent;
});
define("tower-defense/components/td-game/stylesheet/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "stylesheet__line-number");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "lineNumber", ["loc", [null, [3, 41], [3, 55]]]]],
        locals: ["lineNumber"],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 36,
                "column": 4
              },
              "end": {
                "line": 37,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: true,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 38,
                  "column": 6
                },
                "end": {
                  "line": 57,
                  "column": 6
                }
              },
              "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("li");
              dom.setAttribute(el1, "class", "block__line block__brace-line");
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2, "class", "block__selector");
              var el3 = dom.createTextNode(".");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2, "class", "block__brace");
              var el3 = dom.createTextNode("{");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("li");
              dom.setAttribute(el1, "class", "block__line block__brace-line block__brace-line--close");
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2, "class", "block__brace");
              var el3 = dom.createTextNode("}");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(2);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
              morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
              return morphs;
            },
            statements: [["content", "tower.selector", ["loc", [null, [40, 41], [40, 59]]]], ["inline", "td-game/stylesheet/block", [], ["finalInputFound", ["subexpr", "readonly", [["get", "finalInputFound", ["loc", [null, [43, 61], [43, 76]]]]], [], ["loc", [null, [43, 51], [43, 77]]]], "finalTowerId", ["subexpr", "readonly", [["get", "finalTowerId", ["loc", [null, [44, 58], [44, 70]]]]], [], ["loc", [null, [44, 48], [44, 71]]]], "firstTowerGroupId", ["subexpr", "readonly", [["get", "firstTowerGroupId", ["loc", [null, [45, 63], [45, 80]]]]], [], ["loc", [null, [45, 53], [45, 81]]]], "notify-final-input", ["subexpr", "action", ["notifyFinalInput"], [], ["loc", [null, [46, 54], [46, 81]]]], "overlayShown", ["subexpr", "readonly", [["get", "attrs.overlayShown", ["loc", [null, [47, 58], [47, 76]]]]], [], ["loc", [null, [47, 48], [47, 77]]]], "select-tower", ["subexpr", "action", [["get", "attrs.select-tower", ["loc", [null, [48, 56], [48, 74]]]]], [], ["loc", [null, [48, 48], [48, 75]]]], "selectedTower", ["subexpr", "readonly", [["get", "attrs.selectedTower", ["loc", [null, [49, 59], [49, 78]]]]], [], ["loc", [null, [49, 49], [49, 79]]]], "shake-stylesheet", ["subexpr", "action", ["shake"], [], ["loc", [null, [50, 52], [50, 68]]]], "tower", ["subexpr", "readonly", [["get", "tower", ["loc", [null, [51, 51], [51, 56]]]]], [], ["loc", [null, [51, 41], [51, 57]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [52, 57], [52, 74]]]]], [], ["loc", [null, [52, 47], [52, 75]]]], "waveStarting", ["subexpr", "readonly", [["get", "waveStarting", ["loc", [null, [53, 58], [53, 70]]]]], [], ["loc", [null, [53, 48], [53, 71]]]]], ["loc", [null, [43, 8], [53, 73]]]]],
            locals: ["tower"],
            templates: []
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 37,
                "column": 4
              },
              "end": {
                "line": 58,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "each", [["get", "towerGroup.towers", ["loc", [null, [38, 14], [38, 31]]]]], [], 0, null, ["loc", [null, [38, 6], [57, 15]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 2
            },
            "end": {
              "line": 59,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "block__line block__brace-line");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "block__selector");
          var el3 = dom.createTextNode(".");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "block__brace");
          var el3 = dom.createTextNode("{");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "block__line block__brace-line block__brace-line--close");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "block__brace");
          var el3 = dom.createTextNode("}");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[2] = dom.createMorphAt(fragment, 7, 7, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["content", "towerGroup.selector", ["loc", [null, [16, 37], [16, 60]]]], ["inline", "td-game/stylesheet/block", [], ["currentWaveNumber", ["subexpr", "readonly", [["get", "attrs.currentWaveNumber", ["loc", [null, [20, 59], [20, 82]]]]], [], ["loc", [null, [20, 49], [20, 83]]]], "finalInputFound", ["subexpr", "readonly", [["get", "finalInputFound", ["loc", [null, [21, 57], [21, 72]]]]], [], ["loc", [null, [21, 47], [21, 73]]]], "finalTowerId", ["subexpr", "readonly", [["get", "finalTowerId", ["loc", [null, [22, 54], [22, 66]]]]], [], ["loc", [null, [22, 44], [22, 67]]]], "firstTowerGroupId", ["subexpr", "readonly", [["get", "firstTowerGroupId", ["loc", [null, [23, 59], [23, 76]]]]], [], ["loc", [null, [23, 49], [23, 77]]]], "overlayShown", ["subexpr", "readonly", [["get", "attrs.overlayShown", ["loc", [null, [24, 54], [24, 72]]]]], [], ["loc", [null, [24, 44], [24, 73]]]], "select-tower-group", ["subexpr", "action", [["get", "attrs.select-tower-group", ["loc", [null, [25, 58], [25, 82]]]]], [], ["loc", [null, [25, 50], [25, 83]]]], "selectedTowerGroup", ["subexpr", "readonly", [["get", "attrs.selectedTowerGroup", ["loc", [null, [26, 60], [26, 84]]]]], [], ["loc", [null, [26, 50], [26, 85]]]], "shake-stylesheet", ["subexpr", "action", ["shake"], [], ["loc", [null, [27, 48], [27, 64]]]], "towerGroup", ["subexpr", "readonly", [["get", "towerGroup", ["loc", [null, [28, 52], [28, 62]]]]], [], ["loc", [null, [28, 42], [28, 63]]]], "waveStarted", ["subexpr", "readonly", [["get", "attrs.waveStarted", ["loc", [null, [29, 53], [29, 70]]]]], [], ["loc", [null, [29, 43], [29, 71]]]], "waveStarting", ["subexpr", "readonly", [["get", "waveStarting", ["loc", [null, [30, 54], [30, 66]]]]], [], ["loc", [null, [30, 44], [30, 67]]]]], ["loc", [null, [20, 4], [30, 69]]]], ["block", "if", [["get", "attrs.towerStylesHidden", ["loc", [null, [36, 10], [36, 33]]]]], [], 0, 1, ["loc", [null, [36, 4], [58, 11]]]]],
        locals: ["towerGroup"],
        templates: [child0, child1]
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 70,
                "column": 4
              },
              "end": {
                "line": 72,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "stylesheet__cancel-wave-button");
            var el2 = dom.createTextNode("Cancel Wave");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 72,
                "column": 4
              },
              "end": {
                "line": 74,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "stylesheet__cancel-wave-button stylesheet__cancel-wave-button--active");
            var el2 = dom.createTextNode("Cancel Wave");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element1);
            return morphs;
          },
          statements: [["element", "action", ["cancelWave"], [], ["loc", [null, [73, 92], [73, 115]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 69,
              "column": 2
            },
            "end": {
              "line": 75,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "attrs.cancellingWave", ["loc", [null, [70, 10], [70, 30]]]]], [], 0, 1, ["loc", [null, [70, 4], [74, 11]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 76,
                "column": 4
              },
              "end": {
                "line": 78,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "stylesheet__start-wave-button");
            var el2 = dom.createTextNode("Start Wave");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 78,
                "column": 4
              },
              "end": {
                "line": 80,
                "column": 4
              }
            },
            "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "stylesheet__start-wave-button stylesheet__start-wave-button--active");
            var el2 = dom.createTextNode("Start Wave");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["element", "action", ["startWave"], [], ["loc", [null, [79, 90], [79, 112]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 75,
              "column": 2
            },
            "end": {
              "line": 81,
              "column": 2
            }
          },
          "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "attrs.towersColliding", ["loc", [null, [76, 10], [76, 31]]]]], [], 0, 1, ["loc", [null, [76, 4], [80, 11]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 83,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/stylesheet/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "stylesheet__line-numbers");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "stylesheet__content");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "class", "stylesheet__help--button");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "class", "help__link");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-lg fa-question-circle");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "stylesheet__hide-inputs");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3, "class", "hide-inputs__text");
        var el4 = dom.createTextNode("hide tower inputs");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [2]);
        var element3 = dom.childAt(element2, [1, 1]);
        var element4 = dom.childAt(element2, [5]);
        var element5 = dom.childAt(element4, [3]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        morphs[1] = dom.createElementMorph(element3);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(element4, 1, 1);
        morphs[4] = dom.createElementMorph(element5);
        morphs[5] = dom.createMorphAt(element2, 7, 7);
        return morphs;
      },
      statements: [["block", "each", [["get", "lineNumbers", ["loc", [null, [2, 10], [2, 21]]]]], [], 0, null, ["loc", [null, [2, 2], [4, 11]]]], ["element", "action", ["showOverlay"], [], ["loc", [null, [9, 26], [9, 50]]]], ["block", "each", [["get", "attrs.towerGroups", ["loc", [null, [14, 10], [14, 27]]]]], [], 1, null, ["loc", [null, [14, 2], [59, 11]]]], ["inline", "input", [], ["class", "hide-inputs__checkbox", "checked", ["subexpr", "@mut", [["get", "towerInputsHidden", ["loc", [null, [63, 20], [63, 37]]]]], [], []], "name", "towerInputsHidden", "type", "checkbox"], ["loc", [null, [62, 4], [65, 29]]]], ["element", "action", ["toggleHideInputs"], [], ["loc", [null, [66, 36], [66, 65]]]], ["block", "if", [["get", "attrs.waveStarted", ["loc", [null, [69, 8], [69, 25]]]]], [], 2, 3, ["loc", [null, [69, 2], [81, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define("tower-defense/components/td-game/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 8
              },
              "end": {
                "line": 15,
                "column": 7
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "nav__button");
            dom.setAttribute(el1, "type", "button");
            dom.setAttribute(el1, "name", "button");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-angle-double-left");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("\n    ");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element21 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element21);
            return morphs;
          },
          statements: [["element", "action", ["changeWavePrevious"], [], ["loc", [null, [12, 32], [12, 63]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 7
              },
              "end": {
                "line": 21,
                "column": 8
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "nav__button nav__button--active");
            dom.setAttribute(el1, "type", "button");
            dom.setAttribute(el1, "name", "button");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-angle-double-left");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("\n     ");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element20 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element20);
            return morphs;
          },
          statements: [["element", "action", ["changeWavePrevious"], [], ["loc", [null, [18, 32], [18, 63]]]]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 33,
                "column": 8
              },
              "end": {
                "line": 39,
                "column": 8
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("\n       ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "nav__button");
            dom.setAttribute(el1, "type", "button");
            dom.setAttribute(el1, "name", "button");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-angle-double-right");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("\n     ");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element19 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element19);
            return morphs;
          },
          statements: [["element", "action", ["changeWaveNext"], [], ["loc", [null, [36, 32], [36, 59]]]]],
          locals: [],
          templates: []
        };
      })();
      var child3 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 39,
                "column": 8
              },
              "end": {
                "line": 45,
                "column": 8
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("\n       ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "nav__button nav__button--active");
            dom.setAttribute(el1, "type", "button");
            dom.setAttribute(el1, "name", "button");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-angle-double-right");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element18 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element18);
            return morphs;
          },
          statements: [["element", "action", ["changeWaveNext"], [], ["loc", [null, [42, 32], [42, 59]]]]],
          locals: [],
          templates: []
        };
      })();
      var child4 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.2.0",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 51,
                    "column": 16
                  },
                  "end": {
                    "line": 53,
                    "column": 16
                  }
                },
                "moduleName": "tower-defense/components/td-game/template.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("button");
                dom.setAttribute(el1, "class", "menu__wave-link menu__wave-link");
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
                return morphs;
              },
              statements: [["content", "waveLink", ["loc", [null, [52, 66], [52, 78]]]]],
              locals: [],
              templates: []
            };
          })();
          var child1 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.2.0",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 53,
                    "column": 16
                  },
                  "end": {
                    "line": 55,
                    "column": 16
                  }
                },
                "moduleName": "tower-defense/components/td-game/template.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("button");
                dom.setAttribute(el1, "class", "menu__wave-link menu__wave-link--active");
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var element17 = dom.childAt(fragment, [1]);
                var morphs = new Array(2);
                morphs[0] = dom.createElementMorph(element17);
                morphs[1] = dom.createMorphAt(element17, 0, 0);
                return morphs;
              },
              statements: [["element", "action", ["changeWaveSelect", ["get", "waveLink", ["loc", [null, [54, 102], [54, 110]]]]], [], ["loc", [null, [54, 74], [54, 112]]]], ["content", "waveLink", ["loc", [null, [54, 113], [54, 125]]]]],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 50,
                  "column": 14
                },
                "end": {
                  "line": 56,
                  "column": 14
                }
              },
              "moduleName": "tower-defense/components/td-game/template.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "if", [["subexpr", "eq", [["get", "waveLink", ["loc", [null, [51, 26], [51, 34]]]], ["get", "currentWaveNumber", ["loc", [null, [51, 35], [51, 52]]]]], [], ["loc", [null, [51, 22], [51, 53]]]]], [], 0, 1, ["loc", [null, [51, 16], [55, 23]]]]],
            locals: ["waveLink"],
            templates: [child0, child1]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 47,
                "column": 8
              },
              "end": {
                "line": 59,
                "column": 8
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "button__menu");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "menu__wave-links");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
            return morphs;
          },
          statements: [["block", "each", [["get", "waveLinks", ["loc", [null, [50, 22], [50, 31]]]]], [], 0, null, ["loc", [null, [50, 14], [56, 23]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      var child5 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 125,
                  "column": 8
                },
                "end": {
                  "line": 133,
                  "column": 8
                }
              },
              "moduleName": "tower-defense/components/td-game/template.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "modal__instructions");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n\n          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "modal__actions");
              var el2 = dom.createTextNode("\n            ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("button");
              dom.setAttribute(el2, "class", "modal__button");
              var el3 = dom.createTextNode("Ok, got it!");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n            ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              dom.setAttribute(el2, "class", "modal__support-link");
              var el3 = dom.createTextNode("Support this project");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element13 = dom.childAt(fragment, [3]);
              var element14 = dom.childAt(element13, [1]);
              var element15 = dom.childAt(element13, [3]);
              var morphs = new Array(3);
              morphs[0] = dom.createUnsafeMorphAt(dom.childAt(fragment, [1]), 0, 0);
              morphs[1] = dom.createElementMorph(element14);
              morphs[2] = dom.createElementMorph(element15);
              return morphs;
            },
            statements: [["content", "instructionsMain", ["loc", [null, [126, 43], [126, 65]]]], ["element", "action", ["hideOverlay"], [], ["loc", [null, [129, 42], [129, 66]]]], ["element", "action", ["showSupportModal"], [], ["loc", [null, [130, 43], [130, 72]]]]],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            var child0 = (function () {
              var child0 = (function () {
                return {
                  meta: {
                    "fragmentReason": false,
                    "revision": "Ember@2.2.0",
                    "loc": {
                      "source": null,
                      "start": {
                        "line": 138,
                        "column": 14
                      },
                      "end": {
                        "line": 147,
                        "column": 14
                      }
                    },
                    "moduleName": "tower-defense/components/td-game/template.hbs"
                  },
                  isEmpty: false,
                  arity: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("                ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("p");
                    var el2 = dom.createTextNode("You beat the game! If you had a good time, follow me for\n                   updates and spread the word about flexboxdefense.com!");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n                ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("div");
                    dom.setAttribute(el1, "class", "custom-follow-button");
                    var el2 = dom.createTextNode("\n                  ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("a");
                    dom.setAttribute(el2, "href", "https://twitter.com/intent/user?screen_name=channingallen");
                    dom.setAttribute(el2, "target", "_blank");
                    dom.setAttribute(el2, "alt", "Follow Channing Allen");
                    var el3 = dom.createTextNode("\n                    ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("i");
                    dom.setAttribute(el3, "class", "btn-icon");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n                    ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("span");
                    dom.setAttribute(el3, "class", "btn-text");
                    var el4 = dom.createTextNode("Follow @ChanningAllen");
                    dom.appendChild(el3, el4);
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n                  ");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n                ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  buildRenderNodes: function buildRenderNodes() {
                    return [];
                  },
                  statements: [],
                  locals: [],
                  templates: []
                };
              })();
              return {
                meta: {
                  "fragmentReason": false,
                  "revision": "Ember@2.2.0",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 134,
                      "column": 10
                    },
                    "end": {
                      "line": 149,
                      "column": 10
                    }
                  },
                  "moduleName": "tower-defense/components/td-game/template.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("            ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("div");
                  dom.setAttribute(el1, "class", "modal__grade");
                  var el2 = dom.createTextNode("\n              ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("p");
                  var el3 = dom.createTextNode("Congratulations! You scored ");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createComment("");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createTextNode(" points!");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n\n");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createComment("");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("            ");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var element8 = dom.childAt(fragment, [1]);
                  var morphs = new Array(2);
                  morphs[0] = dom.createMorphAt(dom.childAt(element8, [1]), 1, 1);
                  morphs[1] = dom.createMorphAt(element8, 3, 3);
                  return morphs;
                },
                statements: [["content", "score", ["loc", [null, [136, 45], [136, 54]]]], ["block", "if", [["get", "isLastWave", ["loc", [null, [138, 20], [138, 30]]]]], [], 0, null, ["loc", [null, [138, 14], [147, 21]]]]],
                locals: [],
                templates: [child0]
              };
            })();
            var child1 = (function () {
              return {
                meta: {
                  "fragmentReason": false,
                  "revision": "Ember@2.2.0",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 149,
                      "column": 10
                    },
                    "end": {
                      "line": 153,
                      "column": 10
                    }
                  },
                  "moduleName": "tower-defense/components/td-game/template.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("            ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("div");
                  dom.setAttribute(el1, "class", "modal__grade");
                  var el2 = dom.createTextNode("\n              ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("p");
                  var el3 = dom.createTextNode("You scored ");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createComment("");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createTextNode(" points. See if you can get 80 or more!");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
                  return morphs;
                },
                statements: [["content", "score", ["loc", [null, [151, 28], [151, 37]]]]],
                locals: [],
                templates: []
              };
            })();
            var child2 = (function () {
              return {
                meta: {
                  "fragmentReason": false,
                  "revision": "Ember@2.2.0",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 158,
                      "column": 14
                    },
                    "end": {
                      "line": 160,
                      "column": 14
                    }
                  },
                  "moduleName": "tower-defense/components/td-game/template.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("              ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("button");
                  dom.setAttribute(el1, "class", "modal__button");
                  var el2 = dom.createTextNode("Next wave");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var element7 = dom.childAt(fragment, [1]);
                  var morphs = new Array(1);
                  morphs[0] = dom.createElementMorph(element7);
                  return morphs;
                },
                statements: [["element", "action", ["changeWaveNext"], [], ["loc", [null, [159, 44], [159, 71]]]]],
                locals: [],
                templates: []
              };
            })();
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.2.0",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 133,
                    "column": 8
                  },
                  "end": {
                    "line": 165,
                    "column": 8
                  }
                },
                "moduleName": "tower-defense/components/td-game/template.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n          ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                dom.setAttribute(el1, "class", "modal__actions");
                var el2 = dom.createTextNode("\n            ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("div");
                dom.setAttribute(el2, "class", "modal__buttons");
                var el3 = dom.createTextNode("\n              ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("button");
                dom.setAttribute(el3, "class", "modal__button");
                var el4 = dom.createTextNode("Try again");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n");
                dom.appendChild(el2, el3);
                var el3 = dom.createComment("");
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("            ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n            ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("a");
                dom.setAttribute(el2, "class", "modal__support-link");
                var el3 = dom.createTextNode("Support this project");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var element9 = dom.childAt(fragment, [2]);
                var element10 = dom.childAt(element9, [1]);
                var element11 = dom.childAt(element10, [1]);
                var element12 = dom.childAt(element9, [3]);
                var morphs = new Array(4);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                morphs[1] = dom.createElementMorph(element11);
                morphs[2] = dom.createMorphAt(element10, 3, 3);
                morphs[3] = dom.createElementMorph(element12);
                dom.insertBoundary(fragment, 0);
                return morphs;
              },
              statements: [["block", "if", [["get", "passed", ["loc", [null, [134, 16], [134, 22]]]]], [], 0, 1, ["loc", [null, [134, 10], [153, 17]]]], ["element", "action", ["hideOverlay"], [], ["loc", [null, [157, 44], [157, 68]]]], ["block", "unless", [["get", "isLastWave", ["loc", [null, [158, 24], [158, 34]]]]], [], 2, null, ["loc", [null, [158, 14], [160, 25]]]], ["element", "action", ["showSupportModal"], [], ["loc", [null, [162, 43], [162, 72]]]]],
              locals: [],
              templates: [child0, child1, child2]
            };
          })();
          var child1 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "fragmentReason": false,
                  "revision": "Ember@2.2.0",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 165,
                      "column": 8
                    },
                    "end": {
                      "line": 176,
                      "column": 8
                    }
                  },
                  "moduleName": "tower-defense/components/td-game/template.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("          ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("div");
                  dom.setAttribute(el1, "class", "modal__cancellation");
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("p");
                  var el3 = dom.createTextNode("Sorry! Flexbox Defense doesn't run well in the background just yet.");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("p");
                  var el3 = dom.createTextNode("Mind trying again?");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n          ");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n\n          ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("div");
                  dom.setAttribute(el1, "class", "modal__actions");
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("button");
                  dom.setAttribute(el2, "class", "modal__button");
                  var el3 = dom.createTextNode("Try again");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("a");
                  dom.setAttribute(el2, "class", "modal__support-link");
                  var el3 = dom.createTextNode("Support this project");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n          ");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var element4 = dom.childAt(fragment, [3]);
                  var element5 = dom.childAt(element4, [1]);
                  var element6 = dom.childAt(element4, [3]);
                  var morphs = new Array(2);
                  morphs[0] = dom.createElementMorph(element5);
                  morphs[1] = dom.createElementMorph(element6);
                  return morphs;
                },
                statements: [["element", "action", ["hideOverlay"], [], ["loc", [null, [172, 42], [172, 66]]]], ["element", "action", ["showSupportModal"], [], ["loc", [null, [173, 43], [173, 72]]]]],
                locals: [],
                templates: []
              };
            })();
            var child1 = (function () {
              var child0 = (function () {
                return {
                  meta: {
                    "fragmentReason": false,
                    "revision": "Ember@2.2.0",
                    "loc": {
                      "source": null,
                      "start": {
                        "line": 176,
                        "column": 8
                      },
                      "end": {
                        "line": 194,
                        "column": 8
                      }
                    },
                    "moduleName": "tower-defense/components/td-game/template.hbs"
                  },
                  isEmpty: false,
                  arity: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("          ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("div");
                    dom.setAttribute(el1, "class", "modal__support");
                    var el2 = dom.createTextNode("\n            ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("p");
                    var el3 = dom.createTextNode("Have you found Flexbox Defense useful? Please make a $5 donation and follow ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("a");
                    dom.setAttribute(el3, "class", "support__twitter-link");
                    dom.setAttribute(el3, "href", "https://twitter.com/intent/user?screen_name=channingallen");
                    dom.setAttribute(el3, "target", "_blank");
                    dom.setAttribute(el3, "alt", "Follow Channing Allen");
                    var el4 = dom.createTextNode("@ChanningAllen");
                    dom.appendChild(el3, el4);
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode(" on Twitter for updates on this and other projects!");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n            ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("form");
                    dom.setAttribute(el2, "action", "https://www.paypal.com/cgi-bin/webscr");
                    dom.setAttribute(el2, "class", "support__form");
                    dom.setAttribute(el2, "method", "post");
                    dom.setAttribute(el2, "target", "_blank");
                    var el3 = dom.createTextNode("\n              ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("input");
                    dom.setAttribute(el3, "type", "hidden");
                    dom.setAttribute(el3, "name", "cmd");
                    dom.setAttribute(el3, "value", "_s-xclick");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n              ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("input");
                    dom.setAttribute(el3, "type", "hidden");
                    dom.setAttribute(el3, "name", "encrypted");
                    dom.setAttribute(el3, "value", "-----BEGIN PKCS7-----MIIHFgYJKoZIhvcNAQcEoIIHBzCCBwMCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYC4tjV1A/uLFYH5zLlZJqhacYxWYg+7a8s0C8qBTyWzAy9aF/zQEF0hFiAYYGR0phdSgc/JcAuH2dcXGaPk26qCnDH+hOq9a/eoa5xQIrlpvxekYBlh17xe15burf5hPQEIF4noTxmTqH1APY0BKfC2iIqKpNGkw795S+jwWQXNezELMAkGBSsOAwIaBQAwgZMGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIGgxLxd8AFdqAcNCyiTTIjEJl7nbfzH/Q94ArvpbPPMpZttJnz25lprJSXgk2YgIFWxnyhoR2tC7Z1bEDitpbxMfb9yOXFKlhw6ylGAvJO77qOYT7Dx8sx2DNvRM6F30exh84YnywN/LF/O8rGp/k44t5YHcB4lgGcsSgggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNjAzMDcwNTQ4MDRaMCMGCSqGSIb3DQEJBDEWBBSrax2Fvj/83f1nFnkaHO+0y7PS0DANBgkqhkiG9w0BAQEFAASBgFgWrz0F95RF/11VsX2/L0Aw0yLTf2eJcEgbbnu0wIqT/9Cwst9uSXCBxTcJ2eSY06vZrAsQsql3pttC1vEKAD4eG+HU8/cC0bQw0Ry9BVILZB9M8PDIfIQ5NaEFoSwNa0kU2DYHbx+ZbbXp+Oawu2dFNqB4PSb7zvzOt9JYpdpX-----END PKCS7-----");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n              ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("input");
                    dom.setAttribute(el3, "type", "image");
                    dom.setAttribute(el3, "src", "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif");
                    dom.setAttribute(el3, "border", "0");
                    dom.setAttribute(el3, "name", "submit");
                    dom.setAttribute(el3, "alt", "PayPal - The safer, easier way to pay online!");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n              ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createElement("img");
                    dom.setAttribute(el3, "alt", "");
                    dom.setAttribute(el3, "border", "0");
                    dom.setAttribute(el3, "src", "https://www.paypalobjects.com/en_US/i/scr/pixel.gif");
                    dom.setAttribute(el3, "width", "1");
                    dom.setAttribute(el3, "height", "1");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n            ");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n          ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n\n          ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("div");
                    dom.setAttribute(el1, "class", "modal__actions");
                    var el2 = dom.createTextNode("\n            ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("button");
                    dom.setAttribute(el2, "class", "modal__button");
                    var el3 = dom.createTextNode("Dismiss");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n          ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n\n");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var element3 = dom.childAt(fragment, [3, 1]);
                    var morphs = new Array(1);
                    morphs[0] = dom.createElementMorph(element3);
                    return morphs;
                  },
                  statements: [["element", "action", ["hideOverlay"], [], ["loc", [null, [191, 42], [191, 66]]]]],
                  locals: [],
                  templates: []
                };
              })();
              var child1 = (function () {
                return {
                  meta: {
                    "fragmentReason": false,
                    "revision": "Ember@2.2.0",
                    "loc": {
                      "source": null,
                      "start": {
                        "line": 194,
                        "column": 8
                      },
                      "end": {
                        "line": 199,
                        "column": 8
                      }
                    },
                    "moduleName": "tower-defense/components/td-game/template.hbs"
                  },
                  isEmpty: false,
                  arity: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("          ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("div");
                    dom.setAttribute(el1, "class", "modal__actions");
                    var el2 = dom.createTextNode("\n            ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("button");
                    dom.setAttribute(el2, "class", "modal__button");
                    var el3 = dom.createTextNode("Dismiss");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n            ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("a");
                    dom.setAttribute(el2, "class", "modal__support-link");
                    var el3 = dom.createTextNode("Support this project");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n          ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n        ");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var element0 = dom.childAt(fragment, [1]);
                    var element1 = dom.childAt(element0, [1]);
                    var element2 = dom.childAt(element0, [3]);
                    var morphs = new Array(2);
                    morphs[0] = dom.createElementMorph(element1);
                    morphs[1] = dom.createElementMorph(element2);
                    return morphs;
                  },
                  statements: [["element", "action", ["hideOverlay"], [], ["loc", [null, [196, 42], [196, 66]]]], ["element", "action", ["showSupportModal"], [], ["loc", [null, [197, 43], [197, 72]]]]],
                  locals: [],
                  templates: []
                };
              })();
              return {
                meta: {
                  "fragmentReason": false,
                  "revision": "Ember@2.2.0",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 176,
                      "column": 8
                    },
                    "end": {
                      "line": 199,
                      "column": 8
                    }
                  },
                  "moduleName": "tower-defense/components/td-game/template.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                  dom.insertBoundary(fragment, 0);
                  dom.insertBoundary(fragment, null);
                  return morphs;
                },
                statements: [["block", "if", [["get", "supportModalShown", ["loc", [null, [176, 18], [176, 35]]]]], [], 0, 1, ["loc", [null, [176, 8], [199, 8]]]]],
                locals: [],
                templates: [child0, child1]
              };
            })();
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.2.0",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 165,
                    "column": 8
                  },
                  "end": {
                    "line": 199,
                    "column": 8
                  }
                },
                "moduleName": "tower-defense/components/td-game/template.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                dom.insertBoundary(fragment, null);
                return morphs;
              },
              statements: [["block", "if", [["get", "cancellationModalShown", ["loc", [null, [165, 18], [165, 40]]]]], [], 0, 1, ["loc", [null, [165, 8], [199, 8]]]]],
              locals: [],
              templates: [child0, child1]
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 133,
                  "column": 8
                },
                "end": {
                  "line": 199,
                  "column": 8
                }
              },
              "moduleName": "tower-defense/components/td-game/template.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "if", [["get", "gradeModalShown", ["loc", [null, [133, 18], [133, 33]]]]], [], 0, 1, ["loc", [null, [133, 8], [199, 8]]]]],
            locals: [],
            templates: [child0, child1]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 121,
                "column": 2
              },
              "end": {
                "line": 202,
                "column": 2
              }
            },
            "moduleName": "tower-defense/components/td-game/template.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "overlay");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "modal");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element16 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element16, 'onclick');
            morphs[1] = dom.createMorphAt(dom.childAt(element16, [1]), 1, 1);
            return morphs;
          },
          statements: [["attribute", "onclick", ["subexpr", "action", ["handleOverlayClick"], [], ["loc", [null, [123, 17], [123, 48]]]]], ["block", "if", [["get", "instructionsModalShown", ["loc", [null, [125, 14], [125, 36]]]]], [], 0, 1, ["loc", [null, [125, 8], [199, 15]]]]],
          locals: [],
          templates: [child0, child1]
        };
      })();
      return {
        meta: {
          "fragmentReason": {
            "name": "missing-wrapper",
            "problems": ["multiple-nodes", "wrong-type"]
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 203,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "td-game__sidebar");
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "td-game__header");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "header__title");
          var el4 = dom.createTextNode("Flexbox Defense");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "header__nav");
          var el4 = dom.createTextNode("\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("\n\n       ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4, "class", "nav__button nav__button--active nav__button--selector");
          dom.setAttribute(el4, "type", "button");
          dom.setAttribute(el4, "name", "button");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("span");
          dom.setAttribute(el5, "class", "selector__content");
          var el6 = dom.createTextNode("\n            Wave ");
          dom.appendChild(el5, el6);
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode(" of ");
          dom.appendChild(el5, el6);
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n            ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("i");
          dom.setAttribute(el6, "class", "fa fa-caret-down selector__caret");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n          ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("\n\n     ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "sidebar__instructions");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("footer");
          dom.setAttribute(el2, "class", "sidebar__footer");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          dom.setAttribute(el3, "class", "footer__text");
          var el4 = dom.createTextNode("Made by Channing Allen");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "class", "footer__link");
          dom.setAttribute(el3, "href", "https://www.facebook.com/TheChanningAllen");
          dom.setAttribute(el3, "target", "_blank");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "fa fa-facebook-square");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "class", "footer__link");
          dom.setAttribute(el3, "href", "https://twitter.com/ChanningAllen");
          dom.setAttribute(el3, "target", "_blank");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "fa fa-twitter-square");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "class", "footer__link");
          dom.setAttribute(el3, "href", "https://www.linkedin.com/in/channingallen");
          dom.setAttribute(el3, "target", "_blank");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "fa fa-linkedin-square");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "class", "footer__link");
          dom.setAttribute(el3, "href", "https://github.com/channingallen");
          dom.setAttribute(el3, "target", "_blank");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "fa fa-github-square");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element22 = dom.childAt(fragment, [1]);
          var element23 = dom.childAt(element22, [2, 3]);
          var element24 = dom.childAt(element23, [3]);
          var element25 = dom.childAt(element24, [1]);
          var morphs = new Array(10);
          morphs[0] = dom.createMorphAt(element23, 1, 1);
          morphs[1] = dom.createAttrMorph(element24, 'onclick');
          morphs[2] = dom.createMorphAt(element25, 1, 1);
          morphs[3] = dom.createMorphAt(element25, 3, 3);
          morphs[4] = dom.createMorphAt(element23, 5, 5);
          morphs[5] = dom.createMorphAt(element23, 7, 7);
          morphs[6] = dom.createUnsafeMorphAt(dom.childAt(element22, [5, 1]), 0, 0);
          morphs[7] = dom.createMorphAt(element22, 7, 7);
          morphs[8] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[9] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "isFirstWave", ["loc", [null, [9, 14], [9, 25]]]]], [], 0, 1, ["loc", [null, [9, 8], [21, 15]]]], ["attribute", "onclick", ["subexpr", "action", ["openDropdown"], [], ["loc", [null, [26, 24], [26, 49]]]]], ["content", "currentWaveNumber", ["loc", [null, [28, 17], [28, 38]]]], ["content", "game.waves.length", ["loc", [null, [28, 42], [28, 63]]]], ["block", "if", [["get", "isLastWave", ["loc", [null, [33, 14], [33, 24]]]]], [], 2, 3, ["loc", [null, [33, 8], [45, 15]]]], ["block", "if", [["get", "dropdownActive", ["loc", [null, [47, 14], [47, 28]]]]], [], 4, null, ["loc", [null, [47, 8], [59, 15]]]], ["content", "instructionsTldr", ["loc", [null, [66, 20], [66, 42]]]], ["inline", "td-game/stylesheet", [], ["cancel-wave", ["subexpr", "action", ["beginWaveCancellation"], [], ["loc", [null, [69, 37], [69, 69]]]], "cancellingWave", ["subexpr", "readonly", [["get", "cancellingWave", ["loc", [null, [70, 50], [70, 64]]]]], [], ["loc", [null, [70, 40], [70, 65]]]], "currentWaveNumber", ["subexpr", "readonly", [["get", "currentWaveNumber", ["loc", [null, [71, 53], [71, 70]]]]], [], ["loc", [null, [71, 43], [71, 71]]]], "hide-tower-inputs", ["subexpr", "action", ["hideTowerInputs"], [], ["loc", [null, [72, 43], [72, 69]]]], "overlayShown", ["subexpr", "readonly", [["get", "overlayShown", ["loc", [null, [73, 48], [73, 60]]]]], [], ["loc", [null, [73, 38], [73, 61]]]], "select-tower", ["subexpr", "action", ["selectTower"], [], ["loc", [null, [74, 38], [74, 60]]]], "select-tower-group", ["subexpr", "action", ["selectTowerGroup"], [], ["loc", [null, [75, 44], [75, 71]]]], "selectedTower", ["subexpr", "readonly", [["get", "selectedTower", ["loc", [null, [76, 49], [76, 62]]]]], [], ["loc", [null, [76, 39], [76, 63]]]], "selectedTowerGroup", ["subexpr", "readonly", [["get", "selectedTowerGroup", ["loc", [null, [77, 54], [77, 72]]]]], [], ["loc", [null, [77, 44], [77, 73]]]], "show-tower-inputs", ["subexpr", "action", ["showTowerInputs"], [], ["loc", [null, [78, 43], [78, 69]]]], "show-overlay", ["subexpr", "action", ["showOverlay"], [], ["loc", [null, [79, 38], [79, 60]]]], "start-wave", ["subexpr", "action", ["startWave"], [], ["loc", [null, [80, 36], [80, 56]]]], "towersColliding", ["subexpr", "readonly", [["get", "towersColliding", ["loc", [null, [81, 51], [81, 66]]]]], [], ["loc", [null, [81, 41], [81, 67]]]], "towerStylesHidden", ["subexpr", "readonly", [["get", "towerStylesHidden", ["loc", [null, [82, 53], [82, 70]]]]], [], ["loc", [null, [82, 43], [82, 71]]]], "towerGroups", ["subexpr", "readonly", [["get", "currentWave.towerGroups", ["loc", [null, [83, 47], [83, 70]]]]], [], ["loc", [null, [83, 37], [83, 71]]]], "waveStarted", ["subexpr", "readonly", [["get", "waveStarted", ["loc", [null, [84, 47], [84, 58]]]]], [], ["loc", [null, [84, 37], [84, 59]]]]], ["loc", [null, [69, 4], [84, 61]]]], ["inline", "td-game/board", [], ["add-colliding-tower", ["subexpr", "action", ["addCollidingTower"], [], ["loc", [null, [103, 38], [103, 66]]]], "backgroundImage", ["subexpr", "readonly", [["get", "currentWave.board.imageUrl", ["loc", [null, [104, 44], [104, 70]]]]], [], ["loc", [null, [104, 34], [104, 71]]]], "cancellingWave", ["subexpr", "readonly", [["get", "cancellingWave", ["loc", [null, [105, 43], [105, 57]]]]], [], ["loc", [null, [105, 33], [105, 58]]]], "minimumPoints", ["subexpr", "readonly", [["get", "currentWave.minimumPoints", ["loc", [null, [106, 42], [106, 67]]]]], [], ["loc", [null, [106, 32], [106, 68]]]], "overlayShown", ["subexpr", "readonly", [["get", "overlayShown", ["loc", [null, [107, 41], [107, 53]]]]], [], ["loc", [null, [107, 31], [107, 54]]]], "path", ["subexpr", "readonly", [["get", "currentWave.board.pathData", ["loc", [null, [108, 33], [108, 59]]]]], [], ["loc", [null, [108, 23], [108, 60]]]], "remove-colliding-tower", ["subexpr", "action", ["removeCollidingTower"], [], ["loc", [null, [109, 41], [109, 72]]]], "report-tower-position", ["subexpr", "action", ["reportTowerPosition"], [], ["loc", [null, [110, 40], [110, 70]]]], "score-wave", ["subexpr", "action", ["scoreWave"], [], ["loc", [null, [111, 29], [111, 49]]]], "select-tower", ["subexpr", "action", ["selectTower"], [], ["loc", [null, [112, 31], [112, 53]]]], "select-tower-group", ["subexpr", "action", ["selectTowerGroup"], [], ["loc", [null, [113, 37], [113, 64]]]], "selectedTower", ["subexpr", "readonly", [["get", "selectedTower", ["loc", [null, [114, 42], [114, 55]]]]], [], ["loc", [null, [114, 32], [114, 56]]]], "selectedTowerGroup", ["subexpr", "readonly", [["get", "selectedTowerGroup", ["loc", [null, [115, 47], [115, 65]]]]], [], ["loc", [null, [115, 37], [115, 66]]]], "towerGroups", ["subexpr", "readonly", [["get", "currentWave.towerGroups", ["loc", [null, [116, 40], [116, 63]]]]], [], ["loc", [null, [116, 30], [116, 64]]]], "waveMobs", ["subexpr", "readonly", [["get", "currentWave.mobs", ["loc", [null, [117, 37], [117, 53]]]]], [], ["loc", [null, [117, 27], [117, 54]]]], "waveStarted", ["subexpr", "readonly", [["get", "waveStarted", ["loc", [null, [118, 40], [118, 51]]]]], [], ["loc", [null, [118, 30], [118, 52]]]]], ["loc", [null, [103, 2], [118, 54]]]], ["block", "if", [["get", "overlayShown", ["loc", [null, [121, 8], [121, 20]]]]], [], 5, null, ["loc", [null, [121, 2], [202, 9]]]]],
        locals: [],
        templates: [child0, child1, child2, child3, child4, child5]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 203,
              "column": 0
            },
            "end": {
              "line": 207,
              "column": 0
            }
          },
          "moduleName": "tower-defense/components/td-game/template.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "td-game__loading-container");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-5x fa-spinner fa-spin");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 208,
            "column": 0
          }
        },
        "moduleName": "tower-defense/components/td-game/template.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "currentWave", ["loc", [null, [1, 6], [1, 17]]]]], [], 0, 1, ["loc", [null, [1, 0], [207, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define('tower-defense/components/tool-tip', ['exports', 'ember'], function (exports, _ember) {

  ////////////////
  //            //
  //   Basics   //
  //            //
  ////////////////

  var ToolTipComponent = _ember['default'].Component.extend({
    classNameBindings: ['atTop:tool-tip--below:tool-tip--above'],

    classNames: ['tool-tip'],

    atTop: null,

    updateAtTop: _ember['default'].on('didInsertElement', function () {
      var atTop = this.$().offset().top < 100;
      this.set('atTop', atTop);
    }),

    keepTowerToolTipsOnScreen: _ember['default'].on('didInsertElement', _ember['default'].observer('atTop', function () {
      var _this = this;

      var windowWidth = _ember['default'].$(window).width();
      var offsetLeft = this.$().offset().left;
      var textOuterWidth = this.$('nobr').outerWidth();
      var offsetLeftPlusOuterWidth = offsetLeft + textOuterWidth;
      var offsetRight = windowWidth - offsetLeftPlusOuterWidth;
      var atRight = offsetRight < 0;

      if (this.attrs.type === 'tower' && atRight) {
        _ember['default'].run.schedule('afterRender', this, function () {
          _this.$('.tool-tip__content').css('margin-left', offsetRight + 'px');
        });
      }
    }))
  });

  exports['default'] = ToolTipComponent;
});
define('tower-defense/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('tower-defense/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('tower-defense/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('tower-defense/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('tower-defense/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('tower-defense/initializers/add-force-set', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].Object.reopen({
      forceSet: function forceSet(key, newValue) {
        var _this = this;

        var _ref = arguments.length <= 2 || arguments[2] === undefined ? { queue: 'afterRender' } : arguments[2];

        var queue = _ref.queue;

        var currentValue = this.get(key);

        if (currentValue === newValue) {
          this.set(key, undefined);
          _ember['default'].run.scheduleOnce(queue, this, function () {
            _this.set(key, newValue);
          });
        } else {
          this.set(key, newValue);
        }
      }
    });
  }

  exports['default'] = {
    name: 'add-force-set',
    initialize: initialize
  };
});
define('tower-defense/initializers/add-insertion-detection-to-components', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() /* application */{
    _ember['default'].Component.reopen({
      elementInserted: false,

      _updateElementInserted: _ember['default'].on('didInsertElement', function () {
        var _this = this;

        _ember['default'].run.schedule('afterRender', this, function () {
          _this.set('elementInserted', true);
        });
      })
    });
  }

  exports['default'] = {
    name: 'add-insertion-detection-to-components',
    initialize: initialize
  };
});
define('tower-defense/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'tower-defense/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _towerDefenseConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_towerDefenseConfigEnvironment['default'].APP.name, _towerDefenseConfigEnvironment['default'].APP.version)
  };
});
define('tower-defense/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('tower-defense/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('tower-defense/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('tower-defense/initializers/export-application-global', ['exports', 'ember', 'tower-defense/config/environment'], function (exports, _ember, _towerDefenseConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_towerDefenseConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _towerDefenseConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_towerDefenseConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('tower-defense/initializers/extend-ember-text-field', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].TextField.reopen({
      _focusInput: _ember['default'].on('didInsertElement', function () {
        if (this.attrs.focusOnInsert) {
          this.$().focus(); // this.$() === this.get('element'): fn vs const
        }
      })
    });
  }

  exports['default'] = {
    name: 'extend-ember-text-field',
    initialize: initialize
  };
});
define('tower-defense/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('tower-defense/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('tower-defense/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('tower-defense/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("tower-defense/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('tower-defense/mixins/google-pageview', ['exports', 'ember', 'tower-defense/config/environment'], function (exports, _ember, _towerDefenseConfigEnvironment) {
  exports['default'] = _ember['default'].Mixin.create({
    beforePageviewToGA: function beforePageviewToGA(ga) {},

    pageviewToGA: _ember['default'].on('didTransition', function (page, title) {
      var page = page ? page : this.get('url');
      var title = title ? title : this.get('url');

      if (_ember['default'].get(_towerDefenseConfigEnvironment['default'], 'googleAnalytics.webPropertyId') != null) {
        var trackerType = _ember['default'].getWithDefault(_towerDefenseConfigEnvironment['default'], 'googleAnalytics.tracker', 'analytics.js');

        if (trackerType === 'analytics.js') {
          var globalVariable = _ember['default'].getWithDefault(_towerDefenseConfigEnvironment['default'], 'googleAnalytics.globalVariable', 'ga');
          var gaHandle = window[globalVariable];

          if (typeof gaHandle === 'function') {
            this.beforePageviewToGA(gaHandle);

            gaHandle('send', 'pageview', {
              page: page,
              title: title
            });
          }
        } else if (trackerType === 'ga.js') {
          if (window._gaq && typeof window._gaq.push === 'function') {
            window._gaq.push(['_trackPageview']);
          }
        }
      }
    })

  });
});
define('tower-defense/objects/board', ['exports', 'ember', 'tower-defense/objects/mob'], function (exports, _ember, _towerDefenseObjectsMob) {
  var pathWidth = _towerDefenseObjectsMob.mobDimensions * 2;
  exports.pathWidth = pathWidth;
  var boardPaddingPct = 2;

  exports.boardPaddingPct = boardPaddingPct;
  var Board = _ember['default'].Object.extend({
    imageUrl: null,

    pathData: null,

    _initializePathData: _ember['default'].on('init', function () {
      this.set('pathData', _ember['default'].A());
    })
  });

  exports['default'] = Board;
});
define('tower-defense/objects/flexbox-ref', ['exports', 'ember'], function (exports, _ember) {

  var FlexboxRef = _ember['default'].Object.extend({
    container: _ember['default'].Object.extend({
      'align-content': ['stretch', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'initial', 'inherit'],

      'align-items': ['stretch', 'center', 'flex-start', 'flex-end', 'baseline', 'initial', 'inherit'],

      'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse', 'initial', 'inherit'],

      'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse', 'initial', 'inherit'],

      'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'initial', 'inherit']
    }).create(),

    item: _ember['default'].Object.extend({
      order: ['initial', 'inherit'],

      'align-self': ['auto', 'stetch', 'center', 'flex-start', 'flex-end', 'baseline', 'initial', 'inherit'],

      _populateOrder: _ember['default'].on('init', function () {
        for (var i = -100; i < 101; i++) {
          this.get('order').push(i);
        }
      })
    }).create()
  });

  exports['default'] = FlexboxRef;
});
define('tower-defense/objects/game', ['exports', 'ember'], function (exports, _ember) {

  var Game = _ember['default'].Object.extend({
    waves: null
  });

  exports['default'] = Game;
});
define('tower-defense/objects/mob', ['exports', 'ember'], function (exports, _ember) {

  // mobs are 4% the width/height of the board
  var mobDimensions = 4;

  exports.mobDimensions = mobDimensions;
  var Mob = _ember['default'].Object.extend({
    id: null,
    active: null,
    frequency: null,
    health: null,
    maxHealth: null,
    points: null,
    posX: null,
    posY: null,
    quantity: null,
    speed: null,
    type: null,

    _initializeMobActive: _ember['default'].on('init', function () {
      this.set('active', true);
    })
  });

  exports['default'] = Mob;
});
define('tower-defense/objects/path-coords', ['exports', 'ember'], function (exports, _ember) {

  var PathCoords = _ember['default'].Object.extend({
    x: null,
    y: null
  });

  exports['default'] = PathCoords;
});
define('tower-defense/objects/projectile', ['exports', 'ember'], function (exports, _ember) {

  var Projectile = _ember['default'].Object.extend({
    id: null,
    mobId: null,
    mobX: null,
    mobY: null,
    towerX: null,
    towerY: null
  });

  exports['default'] = Projectile;
});
define('tower-defense/objects/tower-group', ['exports', 'ember'], function (exports, _ember) {
  var spaceBetweenTowersPct = 1;

  exports.spaceBetweenTowersPct = spaceBetweenTowersPct;
  var TowerGroup = _ember['default'].Object.extend({
    id: null,
    groupNum: null,
    numRows: 1,
    posY: 'board__tower-group--position-y0',
    selector: '.t-g',
    styles: null,
    towers: null
  });

  exports['default'] = TowerGroup;
});
define('tower-defense/objects/tower', ['exports', 'ember', 'tower-defense/objects/mob'], function (exports, _ember, _towerDefenseObjectsMob) {
  var towerDimensions = _towerDefenseObjectsMob.mobDimensions;

  exports.towerDimensions = towerDimensions;
  var Tower = _ember['default'].Object.extend({
    id: null,
    attackPower: null,
    attackRange: null, // 1-100 (% of board; attackRange / 2 = attack radius)
    posX: null,
    posY: null,
    selector: '.t',
    styles: null,
    targetedMobId: null,
    targetId: null,
    type: null
  });

  exports['default'] = Tower;
});
define('tower-defense/objects/unit-code-line', ['exports', 'ember'], function (exports, _ember) {

  var UnitCodeLine = _ember['default'].Object.extend({
    id: null,
    codeLine: undefined,
    submitted: null,
    valid: null
  });

  exports['default'] = UnitCodeLine;
});
define('tower-defense/objects/wave', ['exports', 'ember'], function (exports, _ember) {

  var Wave = _ember['default'].Object.extend({
    board: null,
    instructions: null,
    minimumScore: null,
    mobs: null,
    towerStylesHidden: null,
    towerGroups: null
  });

  exports['default'] = Wave;
});
define('tower-defense/router', ['exports', 'ember', 'tower-defense/config/environment', 'tower-defense/mixins/google-pageview'], function (exports, _ember, _towerDefenseConfigEnvironment, _towerDefenseMixinsGooglePageview) {

  var Router = _ember['default'].Router.extend(_towerDefenseMixinsGooglePageview['default'], {
    location: _towerDefenseConfigEnvironment['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('tower-defense/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("tower-defense/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "tower-defense/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("tower-defense/templates/components/tool-tip", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "tower-defense/templates/components/tool-tip.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tool-tip__caret tool-tip__caret--below");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tool-tip__content tool-tip__content--below");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("nobr");
          dom.setAttribute(el2, "class", "tool-tip__text");
          var el3 = dom.createTextNode(".");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [3, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "attrs.selector", ["loc", [null, [5, 34], [5, 52]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "tower-defense/templates/components/tool-tip.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tool-tip__content tool-tip__content--above");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("nobr");
          dom.setAttribute(el2, "class", "tool-tip__text");
          var el3 = dom.createTextNode(".");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tool-tip__caret tool-tip__caret--above");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "attrs.selector", ["loc", [null, [9, 34], [9, 52]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "tower-defense/templates/components/tool-tip.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "atTop", ["loc", [null, [2, 6], [2, 11]]]]], [], 0, 1, ["loc", [null, [2, 0], [12, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("tower-defense/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "tower-defense/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "td-game", ["loc", [null, [1, 0], [1, 11]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('tower-defense/utils/create-flexbox-ref', ['exports', 'tower-defense/objects/flexbox-ref'], function (exports, _towerDefenseObjectsFlexboxRef) {
  exports['default'] = createFlexboxRef;

  function createFlexboxRef() {
    return _towerDefenseObjectsFlexboxRef['default'].create();
  }
});
define('tower-defense/utils/create-game', ['exports', 'ember', 'tower-defense/utils/create-wave-1', 'tower-defense/utils/create-wave-2', 'tower-defense/utils/create-wave-3', 'tower-defense/utils/create-wave-4', 'tower-defense/utils/create-wave-5', 'tower-defense/utils/create-wave-6', 'tower-defense/utils/create-wave-7', 'tower-defense/utils/create-wave-8', 'tower-defense/utils/create-wave-9', 'tower-defense/utils/create-wave-10', 'tower-defense/objects/game'], function (exports, _ember, _towerDefenseUtilsCreateWave1, _towerDefenseUtilsCreateWave2, _towerDefenseUtilsCreateWave3, _towerDefenseUtilsCreateWave4, _towerDefenseUtilsCreateWave5, _towerDefenseUtilsCreateWave6, _towerDefenseUtilsCreateWave7, _towerDefenseUtilsCreateWave8, _towerDefenseUtilsCreateWave9, _towerDefenseUtilsCreateWave10, _towerDefenseObjectsGame) {
  exports['default'] = createGame;

  function addWavesToGame(game) {
    var waves = _ember['default'].ArrayProxy.create({ content: _ember['default'].A([]) });

    waves.addObject((0, _towerDefenseUtilsCreateWave1['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave2['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave3['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave4['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave5['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave6['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave7['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave8['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave9['default'])());
    waves.addObject((0, _towerDefenseUtilsCreateWave10['default'])());

    game.set('waves', waves);
  }

  function createGame() {
    var game = _towerDefenseObjectsGame['default'].create();

    addWavesToGame(game); // TODO THIS COMMIT: implement this

    return game;
  }
});
define('tower-defense/utils/create-unit-code-line', ['exports', 'tower-defense/objects/unit-code-line'], function (exports, _towerDefenseObjectsUnitCodeLine) {
  exports['default'] = createUnitCodeLine;

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createUnitCodeLine() {
    var unitCodeLine = _towerDefenseObjectsUnitCodeLine['default'].create({
      id: generateIdForRecord(),
      submitted: false,
      valid: false
    });

    return unitCodeLine;
  }
});
define('tower-defense/utils/create-wave-1', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave1;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-1.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 60, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 60, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 60 }), _towerDefenseObjectsPathCoords['default'].create({ x: 60, y: 60 }), _towerDefenseObjectsPathCoords['default'].create({ x: 60, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 5;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 2000,
        health: 200,
        maxHealth: 200,
        points: 20,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(1, 47);

    addTowersToTowerGroup(towerGroup1, 2);

    wave.set('towerGroups', _ember['default'].A([towerGroup1]));
  }

  function addTowersToTowerGroup(towerGroup, numTowers) {
    function getNewTower(towerNum) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: 1,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = _ember['default'].A([]);
    for (var i = 1; i < numTowers + 1; i++) {
      newTowers.addObject(getNewTower(i));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave1() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'Your job is to stop the incoming enemies from getting past your\n             defenses. Unlike other tower defense games, you must position your\n             towers using CSS!\n\nWe\'ll start with container properties. Use the `justify-content` property to move\nthe towers into effective positions. `justify-content` positions a container\'s\nitems horizontally and accepts the following values:\n\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\nTo move the container\'s towers to the center, for example, try\n`justify-content: center;`',
        tldr: 'Use the `justify-content` property to move these two towers into\n           position. Click the <i class="fa fa-question-circle"></i> button in\n           the stylesheet for a reminder on how the property works.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-10', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave10;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-10.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: -3, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 15, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 15, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 50, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 50, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 103, y: 25 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 10;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 2000,
        health: 300,
        maxHealth: 300,
        points: 10,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(7, 32);

    addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]);

    wave.set('towerGroups', _ember['default'].A([towerGroup1]));
  }

  function addTowersToTowerGroup(towerGroup, specsForTowers) {
    function getNewTower(towerNum, type) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: type,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = [];
    for (var i = 1; i < specsForTowers.length + 1; i++) {
      newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave10() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: false,
      instructions: {
        main: 'To vertically position individual towers, use `align-self`, which\n             accepts the same values as `align-items`.\n\nUse `justify-content`, `align-items`, and `align-self` to move your towers\ninto position.\n\n**justify-content**\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\n**align-items** and **align-self**\n* `flex-start`: align items across the top of the container\n* `flex-end`: align items across the bottom of the container\n* `center`: align items across the center of the container\n* `baseline`: align items across the baseline of the container\n* `stretch`: stretch items to fill the container',
        tldr: 'Use `justify-content`, `align-items`, and `align-self` to\n             move your towers into position.' },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-2', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave2;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-2.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 85, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 60 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 60 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 5;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 2000,
        health: 200,
        maxHealth: 200,
        points: 20,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(1, 20);
    var towerGroup2 = getNewTowerGroup(1, 47);
    var towerGroup3 = getNewTowerGroup(1, 75);

    addTowersToTowerGroup(towerGroup1, 1);
    addTowersToTowerGroup(towerGroup2, 1);
    addTowersToTowerGroup(towerGroup3, 1);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2, towerGroup3]));
  }

  function addTowersToTowerGroup(towerGroup, numTowers) {
    function getNewTower(towerNum) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: 1,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = _ember['default'].A([]);
    for (var i = 1; i < numTowers + 1; i++) {
      newTowers.addObject(getNewTower(i));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave2() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'Now you have more tower groups at your disposal! Use\n            `justify-content` to move the towers into position.\n            `justify-content` accepts the following values:\n\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them',
        tldr: 'Use `justify-content` to move your towers into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-3', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave3;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-3.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 12, y: 103 }), _towerDefenseObjectsPathCoords['default'].create({ x: 12, y: 20 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 20 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 5;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 2000,
        health: 200,
        maxHealth: 200,
        points: 20,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(1, 10);
    var towerGroup2 = getNewTowerGroup(1, 60);

    addTowersToTowerGroup(towerGroup1, 1);
    addTowersToTowerGroup(towerGroup2, 2);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2]));
  }

  function addTowersToTowerGroup(towerGroup, numTowers) {
    function getNewTower(towerNum) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: 1,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = _ember['default'].A([]);
    for (var i = 1; i < numTowers + 1; i++) {
      newTowers.addObject(getNewTower(i));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave3() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'A tower flashes red when it is positioned on the path; you must\n            reposition it before you can start the wave. Use `justify-content`\n            to get your towers into better positions. `justify-content`\n            accepts the following values:\n\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them',
        tldr: 'Use `justify-content` to move your towers into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-4', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave4;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-4.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: -3, y: 30 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 30 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 80 }), _towerDefenseObjectsPathCoords['default'].create({ x: -3, y: 80 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 10;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 1500,
        health: 220,
        maxHealth: 220,
        points: 10,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    // getNewTowerGroup = function(numRows, posY)
    var towerGroup1 = getNewTowerGroup(3, 9);
    var towerGroup2 = getNewTowerGroup(3, 59);

    // addTowersToTowerGroup = function(towerGroup, numTowers)
    addTowersToTowerGroup(towerGroup1, 2);
    addTowersToTowerGroup(towerGroup2, 2);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2]));
  }

  function addTowersToTowerGroup(towerGroup, numTowers) {
    function getNewTower(towerNum) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: 1,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = _ember['default'].A([]);
    for (var i = 1; i < numTowers + 1; i++) {
      newTowers.addObject(getNewTower(i));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave4() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'Now some of the groups have vertical space, which is the perfect\n             opportunity to use the `align-items` property. `align-items`\n             positions a container\'s items vertically and accepts the following\n             values:\n\n* `flex-start`: align items across the top of the container\n* `flex-end`: align items across the bottom of the container\n* `center`: align items across the center of the container\n* `baseline`: align items across the baseline of the container\n* `stretch`: stretch items to fill the container',
        tldr: 'Use `align-items` to move your towers into effective positions.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-5', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave5;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-5.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 5, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 5, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 65, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 65, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 25 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 75 }), _towerDefenseObjectsPathCoords['default'].create({ x: 35, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 10;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 1500,
        health: 220,
        maxHealth: 220,
        points: 10,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(3, 4);
    var towerGroup2 = getNewTowerGroup(1, 46);
    var towerGroup3 = getNewTowerGroup(3, 60);

    addTowersToTowerGroup(towerGroup1, 2);
    addTowersToTowerGroup(towerGroup2, 1);
    addTowersToTowerGroup(towerGroup3, 2);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2, towerGroup3]));
  }

  function addTowersToTowerGroup(towerGroup, numTowers) {
    function getNewTower(towerNum) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: 1,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = _ember['default'].A([]);
    for (var i = 1; i < numTowers + 1; i++) {
      newTowers.addObject(getNewTower(i));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave5() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'This time things are a bit trickier. Try combining\n            `justify-content` and `align-items` to score 80 or higher!\n\n**justify-content**\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\n**align-items**\n* `flex-start`: align items across the top of the container\n* `flex-end`: align items across the bottom of the container\n* `center`: align items across the center of the container\n* `baseline`: align items across the baseline of the container\n* `stretch`: stretch items to fill the container',
        tldr: 'Use `justify-content` and `align-items` to move your towers\n             into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-6', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave6;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-6.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: -3, y: 55 }), _towerDefenseObjectsPathCoords['default'].create({ x: 15, y: 55 }), _towerDefenseObjectsPathCoords['default'].create({ x: 15, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 50, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 50, y: 55 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 55 }), _towerDefenseObjectsPathCoords['default'].create({ x: 85, y: 40 }), _towerDefenseObjectsPathCoords['default'].create({ x: 103, y: 40 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 10;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 1925,
        health: 300,
        maxHealth: 300,
        points: 10,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(7, 30);

    addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]);

    wave.set('towerGroups', _ember['default'].A([towerGroup1]));
  }

  function addTowersToTowerGroup(towerGroup, specsForTowers) {
    function getNewTower(towerNum, type) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: type,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = [];
    for (var i = 1; i < specsForTowers.length + 1; i++) {
      newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave6() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'Use the properties you\'ve learned to score 80 or higher!\n\n**justify-content**\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\n**align-items**\n* `flex-start`: align items across the top of the container\n* `flex-end`: align items across the bottom of the container\n* `center`: align items across the center of the container\n* `baseline`: align items across the baseline of the container\n* `stretch`: stretch items to fill the container',
        tldr: 'Use `justify-content` and `align-items` to move your towers\n             into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-7', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave7;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-7.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 15, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 15, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 10;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 900,
        health: 300,
        maxHealth: 300,
        points: 10,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    // getNewTowerGroup = function(numRows, posY)
    var towerGroup1 = getNewTowerGroup(5, 15);
    var towerGroup2 = getNewTowerGroup(5, 65);

    // addTowersToTowerGroup = function(towerGroup, numTowers)
    addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]);
    addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }]);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2]));
  }

  function addTowersToTowerGroup(towerGroup, specsForTowers) {
    function getNewTower(towerNum, type) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: type,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = [];
    for (var i = 1; i < specsForTowers.length + 1; i++) {
      newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave7() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'This time you have more towers, but less horizontal room to work\n             with.\n\nThe `flex-direction` property is your answer. `flex-direction` defines the\ndirectional layout of the items in the flex container. Flex items can lay out\neither in horizontal rows or vertical columns. Accordingly, `flex-direction`\naccepts the following values:\n\n* `row`: lay out items from left to right\n* `row-reverse`: lay out items from right to left\n* `column`: lay out items from top to bottom\n* `column-reverse`: lay out items from bottom to top',
        tldr: 'Use `flex-direction` to move your towers into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-8', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave8;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-8.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 90, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 35 }), _towerDefenseObjectsPathCoords['default'].create({ x: 71, y: 35 }), _towerDefenseObjectsPathCoords['default'].create({ x: 71, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 50 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 50 }), _towerDefenseObjectsPathCoords['default'].create({ x: 40, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 10, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 10, y: 90 }), _towerDefenseObjectsPathCoords['default'].create({ x: 30, y: 90 }), _towerDefenseObjectsPathCoords['default'].create({ x: 30, y: 70 }), _towerDefenseObjectsPathCoords['default'].create({ x: 103, y: 70 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 20;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 800,
        health: 300,
        maxHealth: 300,
        points: 5,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(1, 20);
    var towerGroup2 = getNewTowerGroup(5, 65);

    addTowersToTowerGroup(towerGroup1, [{ type: 2 }, { type: 1 }, { type: 1 }]);
    addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 1 }, { type: 2 }]);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2]));
  }

  function addTowersToTowerGroup(towerGroup, specsForTowers) {
    function getNewTower(towerNum, type) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: type,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = [];
    for (var i = 1; i < specsForTowers.length + 1; i++) {
      newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave8() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: true,
      instructions: {
        main: 'This time each group contains a super tower! Super towers take a\n             while to reload but damage every enemy in their attack range. Use\n             the properties you\'ve learned to score 80 or higher!\n\n**justify-content**\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\n**align-items**\n* `flex-start`: align items across the top of the container\n* `flex-end`: align items across the bottom of the container\n* `center`: align items across the center of the container\n* `baseline`: align items across the baseline of the container\n* `stretch`: stretch items to fill the container\n\n**flex-direction**\n* `row`: lay out items from left to right\n* `row-reverse`: lay out items from right to left\n* `column`: lay out items from top to bottom\n* `column-reverse`: lay out items from bottom to top',
        tldr: 'Use `justify-content`, `align-items`, and `flex-direction` to\n             move your towers into position.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
define('tower-defense/utils/create-wave-9', ['exports', 'tower-defense/objects/board', 'tower-defense/utils/create-unit-code-line', 'ember', 'tower-defense/objects/mob', 'tower-defense/objects/path-coords', 'tower-defense/objects/tower-group', 'tower-defense/objects/tower', 'tower-defense/objects/wave'], function (exports, _towerDefenseObjectsBoard, _towerDefenseUtilsCreateUnitCodeLine, _ember, _towerDefenseObjectsMob, _towerDefenseObjectsPathCoords, _towerDefenseObjectsTowerGroup, _towerDefenseObjectsTower, _towerDefenseObjectsWave) {
  exports['default'] = createWave9;

  function addBoardToWave(wave) {
    var board = _towerDefenseObjectsBoard['default'].create();
    board.set('imageUrl', '/images/path-9.png');

    var pathObjects = [_towerDefenseObjectsPathCoords['default'].create({ x: 10, y: -3 }), _towerDefenseObjectsPathCoords['default'].create({ x: 10, y: 30 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 30 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 70, y: 10 }), _towerDefenseObjectsPathCoords['default'].create({ x: 70, y: 50 }), _towerDefenseObjectsPathCoords['default'].create({ x: 30, y: 50 }), _towerDefenseObjectsPathCoords['default'].create({ x: 30, y: 90 }), _towerDefenseObjectsPathCoords['default'].create({ x: 10, y: 90 }), _towerDefenseObjectsPathCoords['default'].create({ x: 10, y: 70 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 70 }), _towerDefenseObjectsPathCoords['default'].create({ x: 90, y: 103 })];

    pathObjects.forEach(function (pathObject) {
      board.get('pathData').addObject(pathObject);
    });

    wave.set('board', board);
  }

  function addMobsToWave(wave) {
    var mobs = [];

    var mobQuantity = 25;
    for (var i = 0; i < mobQuantity; i++) {
      var newMob = _towerDefenseObjectsMob['default'].create({
        id: generateIdForRecord(),
        frequency: 700,
        health: 300,
        maxHealth: 300,
        points: 4,
        quantity: mobQuantity,
        speed: 10, // seconds to cross one axis of the board
        type: 'standard'
      });

      mobs.push(newMob);
    }
    wave.set('mobs', _ember['default'].A(mobs));
  }

  function addTowerGroupsToWave(wave) {
    var groupNum = 1;

    function getNewTowerGroup(numRows, posY) {
      return _towerDefenseObjectsTowerGroup['default'].create({
        id: generateIdForRecord(),
        groupNum: groupNum,
        numRows: numRows,
        posY: posY,
        selector: 'tower-group-' + groupNum++,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var towerGroup1 = getNewTowerGroup(1, 17);
    var towerGroup2 = getNewTowerGroup(1, 77);

    addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 2 }, { type: 1 }]);
    addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 2 }, { type: 1 }]);

    wave.set('towerGroups', _ember['default'].A([towerGroup1, towerGroup2]));
  }

  function addTowersToTowerGroup(towerGroup, specsForTowers) {
    function getNewTower(towerNum, type) {
      return _towerDefenseObjectsTower['default'].create({
        id: generateIdForRecord(),
        attackPower: 20,
        attackRange: 20,
        selector: 'tower-' + towerGroup.get('groupNum') + '-' + towerNum,
        type: type,
        styles: _ember['default'].A([(0, _towerDefenseUtilsCreateUnitCodeLine['default'])()])
      });
    }

    var newTowers = [];
    for (var i = 1; i < specsForTowers.length + 1; i++) {
      newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
    }

    towerGroup.set('towers', newTowers);
  }

  function generateIdForRecord() {
    function generate4DigitString() {
      var baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + '-' + generate4DigitString() + generate4DigitString() + generate4DigitString();
  }

  function createWave9() {
    var wave = _towerDefenseObjectsWave['default'].create({
      towerStylesHidden: false,
      instructions: {
        main: 'The super towers are in bad positions again, but this time you\'ll\n             need to apply styles to the towers themselves.\n\nThe `order` property defines the order in which an item appears in the flex\ncontainer and accepts both positive and negative integer values. All flex items\nbegin with a default order of 0, so an item with an order greater than 0 will\nbe repositioned relative to items still set to their default orders.\n\nUse `justify-content` and `order` to move your towers into position.\n\n**justify-content**\n* `flex-start`: group items in the left (the start) of a container\n* `flex-end`: group items in the right of a container\n* `center`: group items in the center of a container\n* `space-between`: evenly distribute items in a container such that the first\nitem aligns to the left and the final item aligns to the right\n* `space-around`: evenly distribute items in a container such that all items\nhave equal space around them\n\n**order**\n* `#`: position an item relative to the other items in the container',
        tldr: 'Move your towers into position by combining the container properties\n           `justify-content` and `align-items` with the item property\n           `order`. Remember that all items have a default order of 0.'
      },
      minimumScore: 80
    });

    addBoardToWave(wave);
    addMobsToWave(wave);
    addTowerGroupsToWave(wave);

    return wave;
  }
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('tower-defense/config/environment', ['ember'], function(Ember) {
  var prefix = 'tower-defense';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("tower-defense/app")["default"].create({"name":"tower-defense","version":"0.0.0+62b9f85c"});
}

/* jshint ignore:end */
//# sourceMappingURL=tower-defense.map