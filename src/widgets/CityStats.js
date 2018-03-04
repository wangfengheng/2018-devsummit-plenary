/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/core/watchUtils", "esri/core/promiseUtils", "esri/tasks/support/Query"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1, watchUtils_1, promiseUtils_1, Query) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        base: "widgets-citystats",
        cardBlue: "widgets-citystats--cardBlue",
        cardGreen: "widgets-citystats--cardGreen",
        cardOrange: "widgets-citystats--cardOrange",
        cardPurple: "widgets-citystats--cardPurple",
        cardTitle: "widgets-citystats--cardtitle",
        cardValue: "widgets-citystats--cardvalue",
    };
    var CityStats = /** @class */ (function (_super) {
        __extends(CityStats, _super);
        function CityStats(props) {
            var _this = _super.call(this, props) || this;
            // was a new demand of stats made
            _this._refresh = false;
            _this.iconClass = "esri-icon-dashboard";
            _this.count = 0;
            _this.statistics = null;
            return _this;
        }
        CityStats.prototype.postInitialize = function () {
            var _this = this;
            var view = this.view;
            var updateCallback = function () { return _this.updateStatistics(); };
            watchUtils_1.whenFalse(this, "view.updating", updateCallback);
            watchUtils_1.watch(this, "view.extent", updateCallback);
            watchUtils_1.watch(this, "year", updateCallback);
        };
        CityStats.prototype.updateStatistics = function () {
            var _this = this;
            if (this._statsPromise) {
                this._refresh = true;
                return;
            }
            this._refresh = false;
            this._statsPromise = this.view.whenLayerView(this.layer)
                .then(function (layerView) {
                return promiseUtils_1.eachAlways([
                    layerView.queryFeatures(_this.createStatisticsQuery()),
                    layerView.queryFeatureCount(_this.createCountQuery())
                ]);
            })
                .then(function (results) {
                _this.statistics = results[0].value && results[0].value[0].attributes;
                _this.count = results[1].value;
                _this._statsPromise = null;
                // if a stats has been asked, start a new batch
                if (_this._refresh) {
                    _this.updateStatistics();
                }
            });
        };
        CityStats.prototype.createCountQuery = function () {
            return new Query({
                where: "CNSTRCT_YR <= " + this.year,
                geometry: this.view.extent
            });
        };
        CityStats.prototype.createStatisticsQuery = function () {
            return new Query({
                where: "CNSTRCT_YR <= " + this.year,
                geometry: this.view.extent,
                outStatistics: [
                    {
                        onStatisticField: "HEIGHTROOF",
                        outStatisticFieldName: "MAX_HEIGHTROOF",
                        statisticType: "max"
                    },
                    {
                        onStatisticField: "NUM_FLOORS",
                        outStatisticFieldName: "AVG_NUM_FLOORS",
                        statisticType: "avg"
                    },
                    {
                        onStatisticField: "CNSTRCT_YR",
                        outStatisticFieldName: "AVG_CNSTRCT_YR",
                        statisticType: "avg"
                    }
                ]
            });
        };
        CityStats.prototype.render = function () {
            var classes = {};
            var stats = this.statistics || {
                AVG_NUM_FLOORS: 0,
                MAX_HEIGHTROOF: 0,
                AVG_CNSTRCT_YR: 0
            };
            return (widget_1.tsx("div", { bind: this, class: CSS.base, classes: classes },
                widget_1.tsx("div", { class: CSS.cardBlue },
                    widget_1.tsx("div", { class: CSS.cardTitle }, "Buildings Count"),
                    widget_1.tsx("div", { class: CSS.cardValue }, this.count)),
                widget_1.tsx("div", { class: CSS.cardGreen },
                    widget_1.tsx("div", { class: CSS.cardTitle }, "Max Height"),
                    widget_1.tsx("div", { class: CSS.cardValue },
                        Math.round(stats.MAX_HEIGHTROOF),
                        " ft")),
                widget_1.tsx("div", { class: CSS.cardOrange },
                    widget_1.tsx("div", { class: CSS.cardTitle }, "Avg Construction Year"),
                    widget_1.tsx("div", { class: CSS.cardValue }, Math.round(stats.AVG_CNSTRCT_YR)))));
        };
        __decorate([
            decorators_1.property()
        ], CityStats.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], CityStats.prototype, "layer", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CityStats.prototype, "count", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CityStats.prototype, "statistics", void 0);
        __decorate([
            decorators_1.property()
        ], CityStats.prototype, "view", void 0);
        __decorate([
            decorators_1.property()
        ], CityStats.prototype, "year", void 0);
        CityStats = __decorate([
            decorators_1.subclass("widgets.CityStats")
        ], CityStats);
        return CityStats;
    }(decorators_1.declared(Widget)));
    exports.default = CityStats;
});
//# sourceMappingURL=CityStats.js.map