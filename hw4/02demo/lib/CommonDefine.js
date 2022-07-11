/*
* @Author: Dawn
* @Date:   2017-04-12 17:32:08
* @Last Modified by:   Dawn
* @Last Modified time: 2017-05-05 20:08:17
*/
'use strict';

function CommonDef()
{
    // 
    this.addEditMode = true;
    this.addEditLinkMode = true;
    this.addEditSelLink = false;
    this.editRangeSize = 30;
    this.editInsideRangeSize = 0;
    this.nodeSize = 5;
    this.selectedNodeId = -1;
    this.subGraphNodeFixed = true;

    this.moduleGraphMode = false;

    this.maxSubGraphCnt = 16;
    this.subGraphAnimDelta = 76;

    // Menu
    this.colorThemeBun = [
        "#ff2222", "#9C27B0", "#3F51B5", "#004D40", "#E65100"
    ];

    this.colorThemeBunNoBlue = [
        "#f1230d", "#9C27B0", "#E65100", "#8c564b","#e377c2", "#7f7f7f", "#bcbd22", "#EEEEEE", "#17becf"//, "#004D40"   , "#3F51B5"
    ];

    this.colorTheme15 = [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
        "#f1230d", "#9C27B0", "#3F51B5", "#004D40", "#E65100"
    ];

    this.colorThemeBlue4 = [
        
    ];

    this.colorThemeRed4 = [

    ];

    this.colorTheme20 = [
        "#1f77b4",
        "#aec7e8",
        "#ff7f0e",
        "#ffbb78",
        "#2ca02c",
        "#98df8a",
        "#d62728",
        "#ff9896",
        "#9467bd",
        "#c5b0d5",
        "#1f77b4",
        "#aec7e8",
        "#ff7f0e",
        "#ffbb78",
        "#2ca02c",
        "#98df8a",
        "#d62728",
        "#ff9896",
        "#9467bd",
        "#c5b0d5"
    ];

    this.colorGradientNormal = {
            .4: "blue",
            .6: "cyan",
            .7: "lime",
            .9: "yellow",
            1: "red"
       };
}

var CommonDefine = new CommonDef();
