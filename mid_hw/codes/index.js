const MAXSIZE = 200, THRESHOLD = 5;

var reader = new FileReader();
var canvasObj = $("#myCanvas").get(0);// JQuery得到的是一个类似数组的东西 需要添加索引
var img = new Image();

$("#imageUpload").on("change", function(event){
    reader.readAsDataURL(event.target.files[0]);
});

reader.onload = function (event) { img.src = event.target.result; };

img.onload = function()
{
    // 重置画布
    canvasObj.width = canvasObj.width;
    canvasObj.height = canvasObj.height;

    var context = canvasObj.getContext('2d');
    let width = img.width, height = img.height;

    // 调整图片大小
    if(width > height)
    {
        height = Math.round(height * MAXSIZE / width);
        width = MAXSIZE;
    }
    else
    {
        width = Math.round(width * MAXSIZE / height);
        height = MAXSIZE;
    }
    canvasObj.width = width;
    canvasObj.height = height;
    context.drawImage(img, 0, 0, width, height);
}

$("#start").on("click", function(event){
    var k, chartForm;

    k = parseInt(document.querySelector("#k").value);
    if(isNaN(k) || k <= 0 || k >= 11)
    {
        console.log(k);
        alert("k的值应为1-10的整数");
        return ;
    }
    chartForm = $('input:radio[name="chart"]:checked').val();
    if(chartForm == undefined)
    {
        alert("请选择结果呈现的图表类型");
        return ;
    }

    var context = canvasObj.getContext('2d');
    var imgData = context.getImageData(0, 0, canvasObj.width, canvasObj.height).data;
    
    var cluster = new KMeans(k, imgData, THRESHOLD);
    var result = cluster.run();
    console.log(result);
    
    if(chartForm == "pie")
        showPie(result, k);
    else
        showBar(result, k);
});

function ptoh_string(pixel)
{
    return "#" + pixel.r.toString(16) + pixel.g.toString(16) + pixel.b.toString(16);
}

function showPie(result, k)
{
    var colorArray = new Array(k);
    var chartData = new Array(k);
    for(let i = 0; i < k; i++)
    {
        colorArray[i] = ptoh_string(result.centerList[i]);
        chartData[i] = {value: result.count[i], name: colorArray[i]};
    }

    var dom = document.getElementById('showChart');
    var myChart = echarts.init(dom);
    var option;

    option = {
        title: {
            text: '图片主要像素及其相近像素个数',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [{
            type: 'pie',
            radius: '80%',
            color: colorArray,
            data: chartData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

function showBar(result, k)
{
    var colorArray = new Array(k);
    var chartData = new Array(k);
    for(let i = 0; i < k; i++)
    {
        colorArray[i] = ptoh_string(result.centerList[i]);
        chartData[i] = {value: result.count[i], itemStyle: { color: colorArray[i] }};
    }

    var dom = document.getElementById('showChart');
    var myChart = echarts.init(dom);
    var option;

    option = {
        title: {
            text: '图片主要像素及其相近像素个数',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: colorArray
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: chartData,
            type: 'bar'
        }]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}