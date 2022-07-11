// 像素类 忽略了 a: 透明度 这一维度 一般a都为255
class Pixel
{
    constructor(r, g, b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class KMeans
{
    constructor(k, data, threshold)
    {
        this.k = k;
        this.threshold = threshold;
        this.size = data.length / 4;
        this.vector = new Array(this.size);

        let index = 0;
        for(let i = 0; i < this.size; i++, index+=4)
            this.vector[i] = new Pixel(data[index], data[index+1], data[index+2]);
    }

    run()
    {
        let centerList = this.initCenters();
        let pixels;
        let loop = true;

        while(loop)
        {
            pixels = this.clustering(centerList);
            let newCenterList = this.getNewCenters(pixels);
            if(this.isClose(centerList, newCenterList))
                loop = false;
            centerList = newCenterList;
        }
        
        let ret = {centerList: centerList, count: new Array(this.k)};
        for(let i = 0; i < this.k; i++)
            ret.count[i] = pixels[i].length;
        return ret;
    }

    initCenters()
    {
        let arr = new Array();
        let randNum;
        for(let i = 0; i < this.k; i++)
        {
            randNum = Math.floor(Math.random() * this.size);
            if(arr.indexOf(randNum) != -1)
                --i;
            else
                arr.push(this.vector[randNum]);
        }
        return arr;
    }

    getDistance(p1, p2)
    {
        return (p1.r-p2.r) ** 2 + (p1.g-p2.g) ** 2 + (p1.b-p2.b) ** 2;
    }

    clustering(centerList)
    {
        let pixels = new Array(this.k);
        for(let i = 0; i < this.k; i++)
            pixels[i] = new Array();

        for(let i = 0; i < this.size; i++)
        {
            let minDistance = Infinity, centerIndex;
            for(let j = 0; j < this.k; j++)
            {
                let d = this.getDistance(centerList[j], this.vector[i]);
                if(d < minDistance)
                {
                    minDistance = d;
                    centerIndex = j;
                }
            }
            pixels[centerIndex].push(i);
        };

        return pixels;
    }

    getNewCenters(pixels)
    {
        let centers = new Array(this.k);
        for(let i = 0; i < this.k; i++)
        {
            let r_sum = 0, g_sum = 0, b_sum = 0, len = pixels[i].length;
            let that = this;

            pixels[i].forEach(function(p_index) {
                let p = that.vector[p_index];
                r_sum += p.r;
                g_sum += p.g;
                b_sum += p.b;
            });
            r_sum = Math.round(r_sum / len);
            g_sum = Math.round(g_sum / len);
            b_sum = Math.round(b_sum / len);
            centers[i] = new Pixel(r_sum, g_sum, b_sum);
        }
        return centers;
    }

    isClose(oldCenters, newCenters)
    {
        for(let i = 0; i < this.k; i++)
        {
            if(this.getDistance(oldCenters[i], newCenters[i]) > this.threshold)
                return false;
        }
        return true;
    }
}