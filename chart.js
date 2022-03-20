class Chart {
    constructor(sFirstChartId, sSecondChartId) {
        this.iMargin = 10;
        
        const oFirstChartWrapper = this.oFirstChartWrapper = d3.select(`#${sFirstChartId}Wrapper`);
        const oSecondChartWrapper = this.oSecondChartWrapper = d3.select(`#${sSecondChartId}Wrapper`);

        const oCalculatedSizeFirst = Chart.getElementSizeWoBoxSizing(oFirstChartWrapper.node());
        

        this.firstChartSvg = oFirstChartWrapper.append("svg")
            .attr("id", sFirstChartId)
            .attr("width", oCalculatedSizeFirst.width)
            // 5 is a hardcoded value. For some reason parent div is geeting higher when we add svg into it
            .attr("height", oCalculatedSizeFirst.height - 5);

        const oCalculatedSizeSecond = Chart.getElementSizeWoBoxSizing(oSecondChartWrapper.node());
        this.secondChartSvg = oSecondChartWrapper.append("svg")
            .attr("id", sSecondChartId)
            .attr("width", oCalculatedSizeSecond.width)
            // 5 is a hardcoded value. For some reason parent div is geeting higher when we add svg into it
            .attr("height", oCalculatedSizeSecond.height - 5);
    }

    // redraw = () => {
    //     return;
    //     const iFirstHeight = this.iFirstHeight =  this.firstChartWrapper.node().getBoundingClientRect().height;
    //     const iFirstWidth = this.iFirstHeight =  this.firstChartWrapper.node().getBoundingClientRect().width;
    //     const iSecondHeight = this.iSecondHeight = this.secondChartWrapper.node().getBoundingClientRect().height;
    //     const iSecondWidth = this.iSecondWidth = this.secondChartWrapper.node().getBoundingClientRect().width;
    //     this.firstChartSvg
    //         .attr("width", iFirstWidth)
    //         .attr("height", iFirstHeight)
    //         // .attr("viewBox", [0, 0, iFirstWidth, iFirstHeight])
    //     this.secondChartSvg
    //         .attr("width", iSecondWidth)
    //         .attr("height", iSecondHeight)
    //         // .attr("viewBox", [0, 0, iSecondWidth, iSecondHeight])

    //     this.drawLine();
    // }

    drawLine() {
        // this.firstChartSvg.select("line").remove();
        // this.firstChartSvg.append('line')
        //     .style("stroke", "lightgreen")
        //     .style("stroke-width", this.iFirstHeight / 10)
        //     .attr("x1", 0)
        //     .attr("y1", 0)
        //     .attr("x2", 200)
        //     .attr("y2", 200); 
    }
    
    set columnsData(aData) {
        this.columnsDataValue = aData;
    }

    get columnsData() {
        return this.columnsDataValue;
    }

    set firstLineData(aData) {
        this.firstLineDataValue = aData;
    }

    get firstLineData() {
        return this.firstLineDataValue;
    }

    set secondLineData(aData) {
        this.secondLineDataValue = aData;
    }

    get secondLineData() {
        return this.secondLineDataValue;
    }

    generateDataForChart() {
        this.generateAndSetColumnsData();
        this.generateAndSetFirstLineData();
        this.generateAndSetSecondLineData();
    }

    generateAndSetColumnsData() {
        this.columnsData = this.generateRandomData();
    }

    generateAndSetFirstLineData() {
        this.firstLineData = this.generateRandomData();
    }

    generateAndSetSecondLineData() {
        this.secondLineData = this.generateRandomData();
    }

    generateRandomData(iMonths = 12, iMaxValue = 100) {
        let aGeneratedData = [];

        for (let i = 0; i < iMonths; i++) {
            let dDate = new Date(2022, i, 1, 0, 0, 0, 0);
            aGeneratedData.push({
                sYear: dDate.getFullYear(),
                sMonth: +dDate.getMonth() + 1,
                dDate: dDate,
                iValue: Chart.generateRandomInteger(iMaxValue)
            });
        }

        return aGeneratedData;
    }
    
    static generateRandomInteger(iMax) {
        return Math.floor(Math.random() * iMax);
    }

    static getElementSizeWoBoxSizing(element) {
        const oStyle = window.getComputedStyle(element);
        const fPaddingX = parseFloat(oStyle.paddingLeft) + parseFloat(oStyle.paddingRight);
        const fPaddingY = parseFloat(oStyle.paddingTop) + parseFloat(oStyle.paddingBottom);

        const fBorderX = parseFloat(oStyle.borderLeftWidth) + parseFloat(oStyle.borderRightWidth);
        const fBorderY = parseFloat(oStyle.borderTopWidth) + parseFloat(oStyle.borderBottomWidth);
        return {
            height: element.offsetHeight - fPaddingY - fBorderY,
            width: element.offsetWidth - fPaddingX - fBorderX
        }
    }

    static getElementSizeWiBoxSizing(element) {
        return {
            height: element.getBoundingClientRect().height,
            width: element.getBoundingClientRect().width
        }
    }
}


const chart = new Chart("firstChart", "secondChart");
chart.generateDataForChart();
console.log('Columns:');
console.log(chart.columnsData);
console.log('First Line:');
console.log(chart.firstLineData);
console.log('SecondLine:');
console.log(chart.secondLineData);
chart.drawLine();

// window.addEventListener("resize", chart.redraw);