/*
* @Author: Dawn
* @Date:   2017-04-12 16:36:13
* @Last Modified by:   Dawn
* @Last Modified time: 2017-04-20 11:33:08
*/
'use strict';

function GCommonFuncUtl(){

    var gSpinnerLoading = undefined;

    this.DoClearEditSelection = function(){
        graphGentorMgr.clearEditSelection();
    }

    this.DoDeleteSelectedNode = function(){
        graphGentorMgr.deleteSelectedNode();
    }

    this.DoChangeRangeSize = function(val)
    {
        CommonDefine.editRangeSize = val;
        graphGentorMgr.changeRangeSize();
    }

    this.DoChangeInsideRangeSize = function(val)
    {
        CommonDefine.editInsideRangeSize = val;
        graphGentorMgr.changeInsideRangeSize();
    }

    this.DoLoadSubGraph = function(id)
    {
        if ( CommonDefine.subGraphNodeFixed ) {
            graphGentorMgr.loadSuperGraphFixedWithId(id);
        }else{
            graphGentorMgr.loadSuperGraphWithId(id);
        };
    }

    this.DoPlayModuleGraphAnimation = function(){

    }

    this.DoPlaySubGraphAnimation = function(){

        var curFrame = 0;
        var curTimeStep = 0;
        var inter = CommonDefine.subGraphAnimDelta;

        var playAnimTimer = d3.timer(function(elapsed) {

            if ( curTimeStep % inter == 0 ) {
                if ( CommonDefine.subGraphNodeFixed ) {
                    graphGentorMgr.loadSuperGraphFixedWithId(curFrame);
                }else{
                    graphGentorMgr.loadSuperGraphWithId(curFrame);
                };

                $( "#subgraph-slider" ).slider("value", curFrame);
                $( "#subgraph-handle" ).text( curFrame );

                curFrame++;
                console.log( curFrame );

                if (curFrame >= CommonDefine.maxSubGraphCnt) 
                {
                    curFrame = 0;
                    curTimeStep = 0;
                    return true;
                }
            };

            curTimeStep++;
        });
    }

    this.DoRemoveLoadAnim = function(divName)
    {
        if ( gSpinnerLoading != undefined )
            gSpinnerLoading.stop();
    }

    this.DoStartLoadAnim = function(divName)
    {
        var opts = {
              lines: 15 // The number of lines to draw
            , length: 17 // The length of each line
            , width: 14 // The line thickness
            , radius: 42 // The radius of the inner circle
            , scale: 1 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.3 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '35%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
            }
        var target = document.getElementById(divName)
        gSpinnerLoading = new Spinner(opts).spin(target);
    }
}

var GCommonFuncUtility = new GCommonFuncUtl();