class Chart {
    constructor(sFirstChartId, sSecondChartId) {
        const oMargin = this.oMargin = {
            top: 20,
            right: 30,
            left: 50,
            bottom: 60
        }

        const oFirstChartWrapper = this.oFirstChartWrapper = d3.select(`#${sFirstChartId}Wrapper`);
        const oSecondChartWrapper = this.oSecondChartWrapper = d3.select(`#${sSecondChartId}Wrapper`);

        const oCalculatedSizeFirst = this.oCalculatedSizeFirst =  Chart.getElementSizeWoBoxSizing(oFirstChartWrapper.node());
        this.oCalculatedSizeFirst.height -= this._additionalHeight;
        const oFirstChartSvg = this.oFirstChartSvg = oFirstChartWrapper.append("svg")
            .attr("id", sFirstChartId)
            .attr("width", oCalculatedSizeFirst.width)
            .attr("height", oCalculatedSizeFirst.height);

        // Calculates size for second chart after the first one, because adding of first svg makes and impact on
        //    available size for second one. 
        const oCalculatedSizeSecond = this.oCalculatedSizeSecond = Chart.getElementSizeWoBoxSizing(oSecondChartWrapper.node());
        this.oCalculatedSizeSecond.height -= this._additionalHeight;
        const oSecondChartSvg = this.oSecondChartSvg = oSecondChartWrapper.append("svg")
            .attr("id", sSecondChartId)
            .attr("width", oCalculatedSizeSecond.width)
            .attr("height", oCalculatedSizeSecond.height);
    }

    drawFirstChart() {
        let aColumnsData = this.columnsData;
        const $Svg = this.oFirstChartSvg;
        const oMargin = this.oMargin;

        if (!aColumnsData || !$Svg) {
            console.log("drawFirstChart no data");
            return false;
        }

        const oYScale = this.oYScale = d3.scaleLinear()
            .range([oMargin.top, this.oCalculatedSizeFirst.height - oMargin.bottom])
            .domain([0, 100]);

        const oXScale = this.oXScale = d3.scaleBand()
            .range([oMargin.left, this.oCalculatedSizeFirst.width - oMargin.right])
            .domain(aColumnsData.map((oData) => oData.sLabel));

        const oYAxis = this.oYAxis = d3.axisLeft(oYScale);
        const oXAxis = this.oXAxis = d3.axisBottom(oXScale);

        $Svg.append("g")
            .attr("transform", `translate(${oMargin.left},${0})`)
            .call(oYAxis);
        
        $Svg.append("g")
            .attr("transform", `translate(${0},${this.oCalculatedSizeFirst.height - oMargin.bottom})`)
            .call(oXAxis);
    }

    get _additionalHeight() {
        return 5;
    }

    drawSecondChart() {

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
            aGeneratedData[i].sLabel = `${aGeneratedData[i].sYear}/${aGeneratedData[i].sMonth}`
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
chart.drawFirstChart();

// window.addEventListener("resize", chart.redraw);